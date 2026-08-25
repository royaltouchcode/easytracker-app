-- ==============================================================================
-- 🚀 EASYTRACKER TELEMATICS ENTERPRISE - SLOT-WISE TIMESCALEDB ARCHITECTURE
-- Designed for 20 Lakh (2,000,000) IoT Devices on PostgreSQL 16+ & TimescaleDB
-- ==============================================================================

-- 1. Enable TimescaleDB & Extension Support
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. PARTNER & TENANT SLOT MANAGEMENT TABLES
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

-- Device Slot Mapping (Maps each IMEI/Device ID to a Slot Group & Partner)
CREATE TABLE IF NOT EXISTS device_slot_assignments (
    id BIGSERIAL PRIMARY KEY,
    partner_id VARCHAR(64) NOT NULL REFERENCES partner_slot_quotas(partner_id) ON DELETE CASCADE,
    device_id INT NOT NULL,
    tracker_imei VARCHAR(32) UNIQUE NOT NULL,
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
-- 3. TIMESCALEDB HYPERTABLE OPTIMIZATION FOR TC_POSITIONS
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
-- and space-partitioned by deviceid (16 hash partitions for high-throughput concurrency)
SELECT create_hypertable(
    'tc_positions', 
    'fixtime', 
    partitioning_column => 'deviceid',
    number_partitions => 16,
    chunk_time_interval => INTERVAL '7 days',
    if_not_exists => TRUE
);

-- Compound indexes for instantaneous history playback & report queries
CREATE INDEX IF NOT EXISTS idx_positions_dev_fixtime ON tc_positions (deviceid, fixtime DESC);
CREATE INDEX IF NOT EXISTS idx_positions_fixtime ON tc_positions (fixtime DESC);

-- ==============================================================================
-- 4. AUTOMATED COMPRESSION POLICY (SAVES 90-95% DISK AT 20 LAKH SCALE)
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
-- 5. AUTOMATED DATA RETENTION POLICY (CLEANUP OF DATA OLDER THAN 180 DAYS)
-- ==============================================================================

-- Automatically drop hypertable chunks older than 180 days (or adjust as needed)
SELECT add_retention_policy('tc_positions', INTERVAL '180 days', if_not_exists => TRUE);

-- ==============================================================================
-- 6. CONTINUOUS AGGREGATES (REAL-TIME PRE-COMPUTED STATS FOR REPORTS)
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
-- 7. SLOT QUOTA MANAGEMENT STORED PROCEDURES
-- ==============================================================================

-- Procedure: Allocate Device to Partner Slot
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

    -- Insert assignment
    INSERT INTO device_slot_assignments (partner_id, device_id, tracker_imei, plate_number, customer_phone, slot_index, is_active)
    VALUES (p_partner_id, p_device_id, p_imei, p_plate, p_phone, v_used_slots + 1, TRUE)
    ON CONFLICT (tracker_imei) DO UPDATE SET
        partner_id = EXCLUDED.partner_id,
        device_id = EXCLUDED.device_id,
        plate_number = EXCLUDED.plate_number,
        is_active = TRUE;

    -- Increment used slot counter
    UPDATE partner_slot_quotas 
    SET active_used_slots = active_used_slots + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE partner_id = p_partner_id;

    RETURN jsonb_build_object(
        'success', true, 
        'partner_id', p_partner_id, 
        'device_id', p_device_id, 
        'slot_index', v_used_slots + 1,
        'remaining_slots', v_available - 1
    );
END;
$$ LANGUAGE plpgsql;
