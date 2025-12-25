-- Create database
CREATE DATABASE addis_transit
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Create user and grant privileges
CREATE USER 'addis_transit'@'localhost'
IDENTIFIED BY 'addis_transit_1234';
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
    updated_at TIMESTAMP NOT NULL 
        DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL DEFAULT NULL,

    -- Indexes
    UNIQUE KEY uq_users_email (email),
    KEY idx_users_role (role),
    KEY idx_users_created_at (created_at),
    KEY idx_users_phone (phone_number)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

