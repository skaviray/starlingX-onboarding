CREATE TABLE "users" (
  "id" bigserial PRIMARY KEY,
  "username" varchar NOT NULL,
  "hashed_password" varchar NOT NULL,
  "email" varchar NOT NULL UNIQUE,
  "full_name" varchar NOT NULL,
  "password_changed_at" timestamptz NOT NULL DEFAULT '0001-01-01 00:00:00Z',
  "created_at" timestamptz NOT NULL DEFAULT (now())
);


CREATE TABLE system_controller (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    oam_floating VARCHAR(45) UNIQUE NOT NULL,
    oam_controller_0  VARCHAR(45) UNIQUE NOT NULL,
    oam_controller_1  VARCHAR(45) UNIQUE NOT NULL,
    config JSONB NOT NULL,
    status VARCHAR(50) CHECK (status IN ('active', 'maintenance', 'error', 'deploying')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE subcloud (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    system_controller_id INT REFERENCES system_controller(id) ON DELETE CASCADE NOT NULL,
    oam_floating VARCHAR(45) UNIQUE NOT NULL,
    oam_controller_0  VARCHAR(45) UNIQUE NOT NULL,
    oam_controller_1  VARCHAR(45) UNIQUE NOT NULL,
    config JSONB NOT NULL,
    sync_status VARCHAR(50) CHECK (sync_status IN ('in-sync', 'out-of-sync', 'unknown')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE nodes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    hostname VARCHAR(255) NOT NULL,
    bm_ip VARCHAR(45) UNIQUE NOT NULL,
    bm_user VARCHAR(45) NOT NULL,
    bm_pass VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('controller', 'worker', 'storage', 'aio')) NOT NULL,
    parent_type VARCHAR(50) CHECK (parent_type IN ('system_controller', 'subcloud')) NOT NULL,
    parent_id INT NOT NULL,  -- Foreign key reference based on parent_type
    status VARCHAR(255) NOT NULL DEFAULT 'provisioning',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE bios_settings (
    id SERIAL PRIMARY KEY,
    node_id INT REFERENCES nodes(id) ON DELETE CASCADE,
    setting_key VARCHAR(255) NOT NULL,
    setting_value VARCHAR(255) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE node_actions (
    id SERIAL PRIMARY KEY,
    node_id INT REFERENCES nodes(id) ON DELETE CASCADE,
    action VARCHAR(50) CHECK (action IN ('reboot', 'bios_update')),
    status VARCHAR(50) CHECK (status IN ('pending', 'in-progress', 'completed', 'failed')),
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
