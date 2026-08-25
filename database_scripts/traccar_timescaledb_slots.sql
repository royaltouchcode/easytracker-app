-- ==============================================================================
-- 🚀 EASYTRACKER TELEMATICS ENTERPRISE - SLOT-WISE TIMESCALEDB ARCHITECTURE
-- Designed for 20 Lakh (2,000,000) IoT Devices on PostgreSQL 16+ & TimescaleDB
-- Initial Deployment: TRACKING_CELL_001 (Oracle Cloud Free Tier & Multi-Cell Ready)
-- ==============================================================================

-- 1. Enable TimescaleDB & Security Extensions
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TRACKING CELL & 4,096 VIRTUAL ROUTING-SLOT ARCHITECTURE (LOGICAL LAYER)
-- ==============================================================================

-- Tracking Cell Registry Table
CREATE TABLE IF NOT EXISTS tracking_cells (
    cell_id VARCHAR(64) PRIMARY KEY,
    cell_name VARCHAR(255) NOT NULL,
    host_address VARCHAR(255) DEFAULT '127.0.0.1',
    port_base INT DEFAULT 5000,
    status VARCHAR(32) DEFAULT 'active' CHECK (status IN ('active', 'drain', 'standby', 'maintenance')),
    is_primary BOOLEAN DEFAULT TRUE,
    max_device_capacity INT DEFAULT 50000,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Register Initial Primary Cell: TRACKING_CELL_001
INSERT INTO tracking_cells (cell_id, cell_name, host_address, status, is_primary, max_device_capacity)
VALUES ('TRACKING_CELL_001', 'Oracle Cloud Primary Ingestion Cell 001', 'gps.easysoftsolution.net', 'active', TRUE, 50000)
ON CONFLICT (cell_id) DO UPDATE SET
    cell_name = EXCLUDED.cell_name,
    host_address = EXCLUDED.host_address,
    updated_at = CURRENT_TIMESTAMP;

-- 4096 Virtual Routing-Slot Lookup Directory (Single Table with 4096 Rows - ZERO Physical Table Partitioning)
CREATE TABLE IF NOT EXISTS virtual_routing_slots (
    slot_id INT PRIMARY KEY CHECK (slot_id BETWEEN 0 AND 4095),
    current_cell_id VARCHAR(64) NOT NULL REFERENCES tracking_cells(cell_id) ON DELETE RESTRICT,
    backup_cell_id VARCHAR(64) REFERENCES tracking_cells(cell_id) ON DELETE SET NULL,
    status VARCHAR(32) DEFAULT 'active' CHECK (status IN ('active', 'migrating', 'standby')),
    assigned_device_count INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Initialize all 4,096 Virtual Routing Slots (0..4095) pointing to TRACKING_CELL_001
INSERT INTO virtual_routing_slots (slot_id, current_cell_id, status)
SELECT s, 'TRACKING_CELL_001', 'active' 
FROM generate_series(0, 4095) AS s
ON CONFLICT (slot_id) DO NOTHING;

-- Deterministic Consistent Hashing Function: Maps any IMEI to Slot 0..4095
CREATE OR REPLACE FUNCTION get_imei_virtual_slot(p_imei VARCHAR) 
RETURNS INT AS $$
BEGIN
    IF p_imei IS NULL OR length(trim(p_imei)) = 0 THEN
        RETURN 0;
    END IF;
    RETURN abs(hashtext(trim(p_imei))) % 4096;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ==============================================================================
-- 3. PARTNER & TENANT SLOT MANAGEMENT TABLES
-- ==============================================================================

-- Master Partner Slot Allocation & Ledger
CREATE TABLE IF NOT EXISTS partner_slot_quotas (
    id SERIAL PRIMARY KEY,
    partner_id VARCHAR(64) UNIQUE NOT NULL,
    partner_name VARCHAR(255) NOT NULL,
    company_brand_name VARCHAR(255),
    contact_phone VARCHAR(32) NOT NULL,
    total_allocated_slots INT DEFAULT 50 CHECK (total_allocated_slots >= 0),
    active_used_slots INT DEFAULT 0 CHECK (active_used_slots >= 0),
    max_negative_floating_limit NUMERIC(12, 2) DEFAULT 5000.00,
    current_floating_due NUMERIC(12, 2) DEFAULT 0.00,
    max_due_days INT DEFAULT 30,
    service_tier VARCHAR(32) DEFAULT 'all_inclusive',
    status VARCHAR(32) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'grace_period')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Device Slot Mapping with Computed Virtual Slot ID
CREATE TABLE IF NOT EXISTS device_slot_assignments (
    id BIGSERIAL PRIMARY KEY,
    partner_id VARCHAR(64) NOT NULL REFERENCES partner_slot_quotas(partner_id) ON DELETE CASCADE,
    device_id INT NOT NULL,
    tracker_imei VARCHAR(32) UNIQUE NOT NULL,
    virtual_slot_id INT NOT NULL CHECK (virtual_slot_id BETWEEN 0 AND 4095) REFERENCES virtual_routing_slots(slot_id),
    cell_id VARCHAR(64) NOT NULL DEFAULT 'TRACKING_CELL_001' REFERENCES tracking_cells(cell_id),
    plate_number VARCHAR(64),
    customer_phone VARCHAR(32),
    slot_index INT NOT NULL,
    slot_group VARCHAR(64) DEFAULT 'standard_fleet',
    is_active BOOLEAN DEFAULT TRUE,
    activated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_device_slot_partner ON device_slot_assignments(partner_id, is_active);
CREATE INDEX IF NOT EXISTS idx_device_slot_imei ON device_slot_assignments(tracker_imei);
CREATE INDEX IF NOT EXISTS idx_device_slot_devid ON device_slot_assignments(device_id);
CREATE INDEX IF NOT EXISTS idx_device_slot_vslot ON device_slot_assignments(virtual_slot_id);

-- Slot Ledger & Billing Transactions
CREATE TABLE IF NOT EXISTS partner_slot_ledger_tx (
    id BIGSERIAL PRIMARY KEY,
    partner_id VARCHAR(64) NOT NULL REFERENCES partner_slot_quotas(partner_id) ON DELETE CASCADE,
    tx_type VARCHAR(32) NOT NULL CHECK (tx_type IN ('slot_purchase', 'subscription_fee', 'commission_payout', 'settlement_payment', 'bonus_credit')),
    amount NUMERIC(12, 2) NOT NULL,
    slots_delta INT DEFAULT 0,
    description TEXT,
    reference_id VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_slot_ledger_partner ON partner_slot_ledger_tx(partner_id, created_at DESC);

-- ==============================================================================
-- 4. TIMESCALEDB HYPERTABLE OPTIMIZATION FOR TC_POSITIONS
-- ==============================================================================

-- If Traccar hasn't created tc_positions yet, create base table definition
CREATE TABLE IF NOT EXISTS tc_positions (
    id BIGSERIAL NOT NULL,
    protocol VARCHAR(128),
    deviceid INT NOT NULL,
    servertime TIMESTAMPTZ NOT NULL,
    devicetime TIMESTAMPTZ NOT NULL,
    fixtime TIMESTAMPTZ NOT NULL,
    valid BOOLEAN NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    altitude FLOAT DEFAULT 0,
    speed FLOAT DEFAULT 0,
    course FLOAT DEFAULT 0,
    address VARCHAR(512),
    accuracy FLOAT DEFAULT 0,
    network JSONB,
    attributes JSONB,
    PRIMARY KEY (id, fixtime)
);

-- Convert tc_positions to a TimescaleDB Hypertable partitioned by fixtime (7-day chunks)
SELECT create_hypertable(
    'tc_positions', 
    'fixtime', 
    chunk_time_interval => INTERVAL '7 days',
    if_not_exists => TRUE
);

-- Compound indexes for instantaneous history playback & report queries
CREATE INDEX IF NOT EXISTS idx_positions_dev_fixtime ON tc_positions (deviceid, fixtime DESC);
CREATE INDEX IF NOT EXISTS idx_positions_fixtime ON tc_positions (fixtime DESC);

-- ==============================================================================
-- 5. AUTOMATED COMPRESSION POLICY (SAVES 90-95% DISK AT 20 LAKH SCALE)
-- ==============================================================================

-- Enable native columnar compression segmented by deviceid and ordered by fixtime
ALTER TABLE tc_positions SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'deviceid',
    timescaledb.compress_orderby = 'fixtime DESC'
);

-- Automatically compress telemetry data older than 7 days
SELECT add_compression_policy('tc_positions', INTERVAL '7 days', if_not_exists => TRUE);

-- ==============================================================================
-- 6. AUTOMATED DATA RETENTION POLICY (CLEANUP OF DATA OLDER THAN 180 DAYS)
-- ==============================================================================

-- Automatically drop hypertable chunks older than 180 days (or adjust as needed)
SELECT add_retention_policy('tc_positions', INTERVAL '180 days', if_not_exists => TRUE);

-- ==============================================================================
-- 7. CONTINUOUS AGGREGATES (REAL-TIME PRE-COMPUTED STATS FOR REPORTS)
-- ==============================================================================

-- Pre-computed Daily Device Mileage, Max Speed, and Operating Summary
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_device_telematics_summary
WITH (timescaledb.continuous) AS
SELECT 
    time_bucket('1 day', fixtime) AS day_slot,
    deviceid,
    COUNT(*) AS total_points,
    MAX(speed) AS max_speed_kmh,
    AVG(speed) AS avg_speed_kmh,
    COUNT(CASE WHEN speed > 0.5 THEN 1 END) AS moving_point_count,
    COUNT(CASE WHEN (attributes->>'ignition')::boolean IS TRUE THEN 1 END) AS ignition_on_count
FROM tc_positions
GROUP BY day_slot, deviceid
WITH NO DATA;

-- Refresh continuous view automatically every 1 hour
SELECT add_continuous_aggregate_policy('daily_device_telematics_summary',
    start_offset => INTERVAL '3 days',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour',
    if_not_exists => TRUE
);

-- ==============================================================================
-- 8. SLOT QUOTA & CELL ROUTING STORED PROCEDURES
-- ==============================================================================

-- Procedure: Allocate Device to Partner Slot with Automatic 4096 Virtual Slot Resolution
CREATE OR REPLACE FUNCTION allocate_device_to_partner_slot(
    p_partner_id VARCHAR(64),
    p_device_id INT,
    p_imei VARCHAR(32),
    p_plate VARCHAR(64),
    p_phone VARCHAR(32)
) RETURNS JSONB AS $$
DECLARE
    v_total_slots INT;
    v_used_slots INT;
    v_available INT;
    v_vslot INT;
    v_cell_id VARCHAR(64);
BEGIN
    SELECT total_allocated_slots, active_used_slots 
    INTO v_total_slots, v_used_slots
    FROM partner_slot_quotas
    WHERE partner_id = p_partner_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Partner slot record not found');
    END IF;

    v_available := v_total_slots - v_used_slots;
    IF v_available <= 0 THEN
        RETURN jsonb_build_object('success', false, 'message', 'No available slots remaining in partner quota');
    END IF;

    -- Calculate 4096 virtual routing slot deterministically
    v_vslot := get_imei_virtual_slot(p_imei);

    -- Lookup designated tracking cell for this virtual slot
    SELECT current_cell_id INTO v_cell_id 
    FROM virtual_routing_slots 
    WHERE slot_id = v_vslot;

    IF v_cell_id IS NULL THEN
        v_cell_id := 'TRACKING_CELL_001';
    END IF;

    -- Insert or update device assignment
    INSERT INTO device_slot_assignments (
        partner_id, device_id, tracker_imei, virtual_slot_id, cell_id, plate_number, customer_phone, slot_index, is_active
    )
    VALUES (
        p_partner_id, p_device_id, p_imei, v_vslot, v_cell_id, p_plate, p_phone, v_used_slots + 1, TRUE
    )
    ON CONFLICT (tracker_imei) DO UPDATE SET
        partner_id = EXCLUDED.partner_id,
        device_id = EXCLUDED.device_id,
        virtual_slot_id = EXCLUDED.virtual_slot_id,
        cell_id = EXCLUDED.cell_id,
        plate_number = EXCLUDED.plate_number,
        is_active = TRUE;

    -- Increment active slot count
    UPDATE partner_slot_quotas 
    SET active_used_slots = active_used_slots + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE partner_id = p_partner_id;

    -- Update virtual slot device count
    UPDATE virtual_routing_slots
    SET assigned_device_count = assigned_device_count + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE slot_id = v_vslot;

    RETURN jsonb_build_object(
        'success', true, 
        'partner_id', p_partner_id, 
        'device_id', p_device_id, 
        'virtual_slot_id', v_vslot,
        'tracking_cell_id', v_cell_id,
        'slot_index', v_used_slots + 1,
        'remaining_slots', v_available - 1
    );
END;
$$ LANGUAGE plpgsql;
