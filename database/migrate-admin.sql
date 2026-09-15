USE coding_camp;

SET @role_column_exists = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'role');
SET @role_sql = IF(@role_column_exists = 0, 'ALTER TABLE users ADD COLUMN role ENUM(''user'', ''admin'') NOT NULL DEFAULT ''user''', 'SELECT 1');
PREPARE role_statement FROM @role_sql;
EXECUTE role_statement;
DEALLOCATE PREPARE role_statement;

SET @content_column_exists = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'courses' AND column_name = 'content');
SET @content_sql = IF(@content_column_exists = 0, 'ALTER TABLE courses ADD COLUMN content JSON NULL', 'SELECT 1');
PREPARE content_statement FROM @content_sql;
EXECUTE content_statement;
DEALLOCATE PREPARE content_statement;

SET @status_column_exists = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'courses' AND column_name = 'status');
SET @status_sql = IF(@status_column_exists = 0, 'ALTER TABLE courses ADD COLUMN status ENUM(''draft'', ''published'') NOT NULL DEFAULT ''draft''', 'SELECT 1');
PREPARE status_statement FROM @status_sql;
EXECUTE status_statement;
DEALLOCATE PREPARE status_statement;

UPDATE courses SET status = 'draft' WHERE status IS NULL OR status = '';
