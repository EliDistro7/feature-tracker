-- =============================================================
-- Feature Request Tracker - Database Setup
-- =============================================================

CREATE DATABASE IF NOT EXISTS feature_tracker
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE feature_tracker;

-- Drop table if exists (for clean reinstall)
DROP TABLE IF EXISTS features;

-- Create features table
CREATE TABLE features (
  id          INT             NOT NULL AUTO_INCREMENT,
  title       VARCHAR(255)    NOT NULL,
  description TEXT            NOT NULL,
  priority    ENUM('Low', 'Medium', 'High')                 NOT NULL DEFAULT 'Medium',
  status      ENUM('Open', 'In Progress', 'Completed')      NOT NULL DEFAULT 'Open',
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed sample data
INSERT INTO features (title, description, priority, status) VALUES
  ('User Authentication',      'Implement login, registration, and JWT-based auth system.',          'High',   'Completed'),
  ('Dashboard Analytics',      'Add charts and KPIs to the main dashboard for better insights.',     'High',   'In Progress'),
  ('Export to CSV',            'Allow users to export feature request lists to CSV files.',          'Medium', 'Open'),
  ('Dark Mode Support',        'Provide a dark theme toggle across the entire application.',         'Medium', 'Open'),
  ('Email Notifications',      'Send email alerts when a feature request status changes.',           'Low',    'Open'),
  ('Search & Filter',          'Global search bar and advanced filter panel for feature list.',      'High',   'In Progress'),
  ('Role-Based Access',        'Define Admin, Manager, and Viewer roles with different permissions.','High',   'Open'),
  ('Audit Log',                'Track all create / update / delete actions for compliance.',         'Low',    'Open');
