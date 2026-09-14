USE coding_camp;

SET @role_column_exists = (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'users'
    AND column_name = 'role'
);

SET @role_sql = IF(
  @role_column_exists = 0,
  'ALTER TABLE users ADD COLUMN role ENUM(''user'', ''admin'') NOT NULL DEFAULT ''user''',
  'SELECT 1'
);

PREPARE role_statement FROM @role_sql;
EXECUTE role_statement;
DEALLOCATE PREPARE role_statement;

CREATE TABLE IF NOT EXISTS courses (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  learning_objectives TEXT NOT NULL,
  image MEDIUMTEXT NOT NULL,
  level ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
  category VARCHAR(100) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  uploaded_at DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE courses MODIFY COLUMN image MEDIUMTEXT NOT NULL;
SET @content_column_exists = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'courses' AND column_name = 'content');
SET @content_sql = IF(@content_column_exists = 0, 'ALTER TABLE courses ADD COLUMN content MEDIUMTEXT NULL', 'SELECT 1');
PREPARE content_statement FROM @content_sql;
EXECUTE content_statement;
DEALLOCATE PREPARE content_statement;
