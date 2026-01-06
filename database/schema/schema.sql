-- Create database
CREATE DATABASE addis_transit
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Create user and grant privileges
CREATE USER 'addis_transit'@'localhost'
IDENTIFIED BY 'DB_PASSWORD_PLACEHOLDER';
GRANT ALL PRIVILEGES ON addis_transit.* TO 'addis_transit'@'localhost';
FLUSH PRIVILEGES;


USE addis_transit;

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,

    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    role ENUM(
        'commuter',
        'ticket_agent',
        'admin'
    ) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL DEFAULT NULL,

    -- Indexes
    UNIQUE KEY uq_users_email (email),
    KEY idx_users_role (role),
    KEY idx_users_created_at (created_at),
    KEY idx_users_phone (phone_number)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


CREATE TABLE agent_invites (
    invite_id INT AUTO_INCREMENT PRIMARY KEY,

    email VARCHAR(255) NOT NULL,

    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,

    used BOOLEAN NOT NULL DEFAULT FALSE,

    created_by INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Indexes
    KEY idx_agent_invites_email (email),
    KEY idx_agent_invites_token (token),
    KEY idx_agent_invites_created_at (created_at),

    CONSTRAINT fk_agent_invites_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
        ON DELETE SET NULL
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

CREATE TABLE stations (
    station_id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,

    is_major BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    -- Constraints
    UNIQUE KEY uq_station_name (name),

    -- Indexes
    KEY idx_station_location (latitude, longitude)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
------------------------------------------------------------
-- BUS STOPS TABLE
------------------------------------------------------------

CREATE TABLE bus_stops (
    stop_id INT AUTO_INCREMENT PRIMARY KEY,

    station_id INT NOT NULL,

    name VARCHAR(100) NOT NULL,

    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    -- Relations
    CONSTRAINT fk_bus_stops_station
        FOREIGN KEY (station_id)
        REFERENCES stations(station_id)
        ON DELETE CASCADE,

    -- Same stop name allowed at different stations
    UNIQUE KEY uq_station_stop (station_id, name),

    -- Performance
    KEY idx_stop_location (latitude, longitude)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

------------------------------------------------------------
-- BUS ROUTES TABLE
------------------------------------------------------------

CREATE TABLE bus_routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_route_name (name)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

------------------------------------------------------------
-- ROUTE STOPS (ORDERED STOPS PER ROUTE)
------------------------------------------------------------

CREATE TABLE route_stops (
    route_stop_id INT AUTO_INCREMENT PRIMARY KEY,

    route_id INT NOT NULL,
    stop_id INT NOT NULL,

    stop_order INT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_route_stops_route
        FOREIGN KEY (route_id)
        REFERENCES bus_routes(route_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_route_stops_stop
        FOREIGN KEY (stop_id)
        REFERENCES bus_stops(stop_id)
        ON DELETE CASCADE,

    UNIQUE KEY uq_route_stop_order (route_id, stop_order),
    UNIQUE KEY uq_route_stop (route_id, stop_id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


------------------------------------------------------------
-- BUSES TABLE
------------------------------------------------------------
CREATE TABLE buses (
    bus_id INT AUTO_INCREMENT PRIMARY KEY,

    plate_number VARCHAR(20) NOT NULL,
    capacity INT NOT NULL,

    route_id INT NULL,
    assigned_agent_id INT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_bus_plate (plate_number),

    CONSTRAINT fk_bus_route
        FOREIGN KEY (route_id)
        REFERENCES bus_routes(route_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_bus_agent
        FOREIGN KEY (assigned_agent_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
