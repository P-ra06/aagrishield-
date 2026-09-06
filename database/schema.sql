-- AgriShield Database Schema
-- Compatible with PostgreSQL & SQLite

-- 1. Villages and Geographic Zones
CREATE TABLE IF NOT EXISTS villages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    district VARCHAR(150) NOT NULL,
    state VARCHAR(150) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    pincode VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users and Farmer Profiles
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'farmer', -- 'farmer' or 'admin'
    preferred_language VARCHAR(10) DEFAULT 'en', -- 'en', 'hi', 'or'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farmer_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    village_id INTEGER REFERENCES villages(id) ON DELETE SET NULL,
    crops_grown TEXT NOT NULL, -- comma-separated e.g. "Potato, Tomato, Rice"
    farm_size_acres DECIMAL(6, 2) DEFAULT 2.5,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Crops & Disease Knowledge Base
CREATE TABLE IF NOT EXISTS crops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    scientific_name VARCHAR(150),
    category VARCHAR(50) -- 'Cereal', 'Vegetable', 'Fruit', 'Cash Crop'
);

CREATE TABLE IF NOT EXISTS diseases (
    id SERIAL PRIMARY KEY,
    crop_id INTEGER REFERENCES crops(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    pathogen VARCHAR(150),
    pathogen_type VARCHAR(50), -- 'Fungal', 'Bacterial', 'Viral', 'Pest'
    symptoms TEXT NOT NULL,
    causes TEXT NOT NULL,
    prevention TEXT NOT NULL,
    treatment TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'Moderate', -- 'Low', 'Moderate', 'High', 'Severe'
    optimal_temp_min DECIMAL(5, 2),
    optimal_temp_max DECIMAL(5, 2),
    critical_humidity_pct DECIMAL(5, 2),
    warning_signs TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Crop Disease Detections
CREATE TABLE IF NOT EXISTS detections (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    village_id INTEGER REFERENCES villages(id) ON DELETE SET NULL,
    crop_name VARCHAR(100) NOT NULL,
    disease_name VARCHAR(150) NOT NULL,
    confidence DECIMAL(5, 4) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    symptoms_observed TEXT,
    prevention_recommended TEXT,
    treatment_recommended TEXT,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Outbreak Clusters & Alerts
CREATE TABLE IF NOT EXISTS outbreaks (
    id SERIAL PRIMARY KEY,
    disease_name VARCHAR(150) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    focal_village_id INTEGER REFERENCES villages(id),
    affected_villages TEXT NOT NULL, -- JSON or comma-separated names
    case_count INTEGER NOT NULL DEFAULT 1,
    risk_level VARCHAR(50) NOT NULL, -- 'Moderate', 'High', 'Critical'
    threshold_triggered INTEGER NOT NULL DEFAULT 3,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'MONITORED', 'RESOLVED'
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    alert_type VARCHAR(50) NOT NULL, -- 'OUTBREAK', 'WEATHER_RISK', 'DETECTION', 'ADVISORY'
    severity VARCHAR(50) NOT NULL,   -- 'INFO', 'WARNING', 'HIGH', 'CRITICAL'
    message TEXT NOT NULL,
    village VARCHAR(150),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Environmental Weather Risk Records
CREATE TABLE IF NOT EXISTS weather_records (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    temperature DECIMAL(5, 2) NOT NULL,
    humidity DECIMAL(5, 2) NOT NULL,
    rainfall_mm DECIMAL(6, 2) NOT NULL,
    wind_speed_kmh DECIMAL(5, 2) NOT NULL,
    weather_condition VARCHAR(100),
    calculated_risk_level VARCHAR(50), -- 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'
    possible_diseases TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_detections_village_disease ON detections(village_id, disease_name, created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_user_unread ON alerts(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_outbreaks_status ON outbreaks(status);
