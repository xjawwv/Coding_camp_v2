CREATE DATABASE IF NOT EXISTS coding_camp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE coding_camp;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id CHAR(36) PRIMARY KEY,
  token_hash CHAR(64) NOT NULL UNIQUE,
  user_id CHAR(36) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT sessions_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX sessions_user_id_idx (user_id),
  INDEX sessions_expires_at_idx (expires_at)
);

CREATE TABLE IF NOT EXISTS courses (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  learning_objectives TEXT NOT NULL,
  content JSON NULL,
  image MEDIUMTEXT NOT NULL,
  level ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
  category VARCHAR(100) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  uploaded_at DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
