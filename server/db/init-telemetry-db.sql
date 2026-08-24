-- ============================================================================
-- EASYTRACKER TELEMETRY DATA PLANE (TimescaleDB / PostgreSQL 16)
-- HARD RULE: This DB handles raw high-throughput GPS telemetry points.
-- It NEVER holds ERP customer invoices, passwords or financial ledgers.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- 1. High-Performance Telemetry Positions Hypertable
CREATE TABLE IF NOT EXISTS tc_positions (
    id BIGSERIAL,
    deviceid INT NOT NULL,
    protocol VARCHAR(128),
    servertime TIMESTAMP WITH TIME ZONE NOT NULL,
    devicetime TIMESTAMP WITH TIME ZONE NOT NULL,
    fixtime TIMESTAMP WITH TIME ZONE NOT NULL,
    valid BOOLEAN NOT NULL DEFAULT TRUE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    altitude DOUBLE PRECISION DEFAULT 0,
    speed DOUBLE PRECISION DEFAULT 0,
    course DOUBLE PRECISION DEFAULT 0,
    address TEXT,
    accuracy DOUBLE PRECISION DEFAULT 0,
    network JSONB DEFAULT '{}'::jsonb,
    attributes JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (fixtime, id)
);

-- Convert tc_positions into a TimescaleDB Hypertable partitioned by 7 days
SELECT create_hypertable('tc_positions', 'fixtime', chunk_time_interval => INTERVAL '7 days', if_not_exists => TRUE);

-- 2. TimescaleDB Compression Policy (90%+ Disk Savings)
ALTER TABLE tc_positions SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'deviceid',
    timescaledb.compress_orderby = 'fixtime DESC'
);

-- Automatically compress chunks older than 14 days
SELECT add_compression_policy('tc_positions', INTERVAL '14 days', if_not_exists => TRUE);

-- 3. Automatic Data Retention Policy (Archive raw points older than 180 days)
SELECT add_retention_policy('tc_positions', INTERVAL '180 days', if_not_exists => TRUE);

-- High-Speed Composite Index for History Replay Queries
CREATE INDEX IF NOT EXISTS idx_tc_positions_device_fixtime ON tc_positions (deviceid, fixtime DESC);

-- 4. High-Speed Telemetry Events Hypertable (SOS, Over-speed, Wire-cut)
CREATE TABLE IF NOT EXISTS tc_events (
    id BIGSERIAL,
    type VARCHAR(128) NOT NULL,
    eventtime TIMESTAMP WITH TIME ZONE NOT NULL,
    deviceid INT NOT NULL,
    positionid BIGINT,
    geofenceid INT,
    attributes JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (eventtime, id)
);

SELECT create_hypertable('tc_events', 'eventtime', chunk_time_interval => INTERVAL '14 days', if_not_exists => TRUE);
CREATE INDEX IF NOT EXISTS idx_tc_events_device_eventtime ON tc_events (deviceid, eventtime DESC);
