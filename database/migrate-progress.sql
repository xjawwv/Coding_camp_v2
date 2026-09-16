USE coding_camp;

CREATE TABLE IF NOT EXISTS course_progress (
  user_id CHAR(36) NOT NULL,
  course_id CHAR(36) NOT NULL,
  completed_pages JSON NOT NULL,
  progress TINYINT UNSIGNED NOT NULL DEFAULT 0,
  completed_at TIMESTAMP NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, course_id),
  CONSTRAINT course_progress_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT course_progress_course_fk FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
