-- ============================================================================
-- EASYTRACKER SAAS ERP DATABASE (PostgreSQL 16 - OLTP / ACID)
-- HARD RULE: This DB NEVER stores millions of raw telemetry coordinates.
-- It strictly handles Tenants, Users, Subscriptions, Paywalls, Ledgers & Jobs.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tenants & B2B Partners
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(64) PRIMARY KEY,
    brand_name VARCHAR(255) NOT NULL,
    applicant_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL UNIQUE,
    whatsapp VARCHAR(32),
    email VARCHAR(255),
    district VARCHAR(100) NOT NULL,
    thana VARCHAR(100),
    union_ward VARCHAR(150),
    holding_address TEXT,
    geo_lat NUMERIC(10, 6),
    geo_lng NUMERIC(10, 6),
    service_tier VARCHAR(50) DEFAULT 'all_inclusive',
    approved_roles TEXT[] DEFAULT '{"sales","technician","customer"}',
    status VARCHAR(30) DEFAULT 'approved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Central Users (SSO / IAM)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(32) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    primary_role VARCHAR(50) NOT NULL DEFAULT 'customer',
    approved_roles TEXT[] DEFAULT '{"customer"}',
    tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE SET NULL,
    administrator BOOLEAN DEFAULT FALSE,
    disabled BOOLEAN DEFAULT FALSE,
    security_pin VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Vehicle Profiles (Metadata & Owner Binding)
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE SET NULL,
    traccar_device_id INT UNIQUE,
    name VARCHAR(150) NOT NULL,
    unique_id VARCHAR(50) NOT NULL UNIQUE, -- IMEI
    category VARCHAR(50) DEFAULT 'motorcycle',
    plate_number VARCHAR(100),
    color VARCHAR(20) DEFAULT '#ef4444',
    driver_name VARCHAR(150),
    driver_phone VARCHAR(32),
    sos_number_1 VARCHAR(32),
    sos_number_2 VARCHAR(32),
    sos_number_3 VARCHAR(32),
    speed_limit INT DEFAULT 60,
    vehicle_spec JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Seller IMEI Paywall Quotas
CREATE TABLE IF NOT EXISTS seller_quotas (
    seller_id VARCHAR(100) PRIMARY KEY,
    seller_name VARCHAR(255) NOT NULL,
    assigned_imei_limit INT NOT NULL DEFAULT 5,
    active_due_devices INT NOT NULL DEFAULT 0,
    paywall_locked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Technician Negative Floating Ledgers
CREATE TABLE IF NOT EXISTS technician_ledgers (
    technician_id VARCHAR(100) PRIMARY KEY,
    technician_name VARCHAR(255) NOT NULL,
    technician_phone VARCHAR(32) NOT NULL,
    floating_limit_bdt NUMERIC(12, 2) NOT NULL DEFAULT 5000.00,
    current_due_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    settlement_cycle_days INT NOT NULL DEFAULT 7,
    last_settlement_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Subscriptions, Invoices & MFS Transactions (bKash / Nagad / BanglaQR)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL DEFAULT 'Monthly Unlimited GPS',
    amount_bdt NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- bkash, nagad, banglaqr, cash
    mfs_trx_id VARCHAR(100),
    payment_status VARCHAR(30) DEFAULT 'paid', -- paid, pending, failed
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Field Technician Job Cards (Installation & Repair with OTP Confirmation)
CREATE TABLE IF NOT EXISTS job_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_type VARCHAR(50) NOT NULL, -- installation, repair, battery_check, relay_service
    customer_id INT REFERENCES users(id),
    vehicle_id INT REFERENCES vehicles(id),
    technician_id VARCHAR(100) REFERENCES technician_ledgers(technician_id),
    assigned_imei VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'assigned', -- assigned, in_progress, completed, verified
    otp_code VARCHAR(10),
    commission_earned_bdt NUMERIC(10, 2) DEFAULT 0.00,
    customer_rating INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for Blazing Fast Queries
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_vehicles_unique_id ON vehicles(unique_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_job_cards_technician ON job_cards(technician_id);
