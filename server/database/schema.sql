-- SQLite database schema for Picture Database Application
-- This file defines the structure for storing picture metadata

-- Pictures table: stores metadata for all uploaded images
CREATE TABLE IF NOT EXISTS pictures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL UNIQUE,           -- Generated filename (UUID + extension)
    original_name TEXT NOT NULL,             -- Original filename from user
    description TEXT DEFAULT '',             -- User-provided description
    file_size INTEGER NOT NULL,              -- File size in bytes
    mime_type TEXT NOT NULL,                 -- MIME type (image/jpeg, image/png, etc.)
    width INTEGER,                           -- Image width in pixels
    height INTEGER,                          -- Image height in pixels
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pictures_upload_date ON pictures(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_pictures_filename ON pictures(filename);
CREATE INDEX IF NOT EXISTS idx_pictures_mime_type ON pictures(mime_type);

-- Trigger to automatically update the updated_date when a record is modified
CREATE TRIGGER IF NOT EXISTS update_pictures_timestamp 
    AFTER UPDATE ON pictures
    FOR EACH ROW
    BEGIN
        UPDATE pictures SET updated_date = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
