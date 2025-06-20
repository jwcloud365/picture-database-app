const database = require('../database/connection');
const path = require('path');
const fs = require('fs').promises;

/**
 * Picture model for handling all picture-related database operations
 * Provides CRUD methods for the pictures table
 */

class Picture {
    constructor(data = {}) {
        this.id = data.id || null;
        this.filename = data.filename || null;
        this.original_name = data.original_name || null;
        this.description = data.description || '';
        this.file_size = data.file_size || null;
        this.mime_type = data.mime_type || null;
        this.width = data.width || null;
        this.height = data.height || null;
        this.upload_date = data.upload_date || null;
        this.updated_date = data.updated_date || null;
    }

    /**
     * Insert a new picture record into the database
     * @param {Object} pictureData - Picture data object
     * @returns {Promise<Picture>} Created picture instance
     */
    static async insertPicture(pictureData) {
        try {
            const query = `
                INSERT INTO pictures (
                    filename, 
                    original_name, 
                    description, 
                    file_size, 
                    mime_type, 
                    width, 
                    height
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            
            const params = [
                pictureData.filename,
                pictureData.original_name,
                pictureData.description || '',
                pictureData.file_size,
                pictureData.mime_type,
                pictureData.width || null,
                pictureData.height || null
            ];
            
            const result = await database.run(query, params);
            
            // Fetch and return the created picture
            return await Picture.getPictureById(result.lastID);
            
        } catch (error) {
            console.error('Error inserting picture:', error);
            throw new Error(`Failed to insert picture: ${error.message}`);
        }
    }

    /**
     * Get all pictures from the database
     * @param {Object} options - Query options (limit, offset, orderBy)
     * @returns {Promise<Array<Picture>>} Array of picture instances
     */
    static async getAllPictures(options = {}) {
        try {
            const { 
                limit = null, 
                offset = 0, 
                orderBy = 'upload_date', 
                orderDirection = 'DESC' 
            } = options;
            
            let query = `
                SELECT 
                    id, filename, original_name, description, 
                    file_size, mime_type, width, height,
                    upload_date, updated_date
                FROM pictures 
                ORDER BY ${orderBy} ${orderDirection}
            `;
            
            const params = [];
            
            if (limit) {
                query += ' LIMIT ? OFFSET ?';
                params.push(limit, offset);
            }
            
            const rows = await database.all(query, params);
            
            return rows.map(row => new Picture(row));
            
        } catch (error) {
            console.error('Error fetching all pictures:', error);
            throw new Error(`Failed to fetch pictures: ${error.message}`);
        }
    }

    /**
     * Get a picture by its ID
     * @param {number} id - Picture ID
     * @returns {Promise<Picture|null>} Picture instance or null if not found
     */
    static async getPictureById(id) {
        try {
            const query = `
                SELECT 
                    id, filename, original_name, description, 
                    file_size, mime_type, width, height,
                    upload_date, updated_date
                FROM pictures 
                WHERE id = ?
            `;
            
            const row = await database.get(query, [id]);
            
            return row ? new Picture(row) : null;
            
        } catch (error) {
            console.error('Error fetching picture by ID:', error);
            throw new Error(`Failed to fetch picture: ${error.message}`);
        }
    }

    /**
     * Get a picture by its filename
     * @param {string} filename - Picture filename
     * @returns {Promise<Picture|null>} Picture instance or null if not found
     */
    static async getPictureByFilename(filename) {
        try {
            const query = `
                SELECT 
                    id, filename, original_name, description, 
                    file_size, mime_type, width, height,
                    upload_date, updated_date
                FROM pictures 
                WHERE filename = ?
            `;
            
            const row = await database.get(query, [filename]);
            
            return row ? new Picture(row) : null;
            
        } catch (error) {
            console.error('Error fetching picture by filename:', error);
            throw new Error(`Failed to fetch picture: ${error.message}`);
        }
    }

    /**
     * Update picture description
     * @param {number} id - Picture ID
     * @param {string} description - New description
     * @returns {Promise<Picture|null>} Updated picture instance or null
     */
    static async updatePictureDescription(id, description) {
        try {
            const query = `
                UPDATE pictures 
                SET description = ?, updated_date = CURRENT_TIMESTAMP 
                WHERE id = ?
            `;
            
            const result = await database.run(query, [description, id]);
            
            if (result.changes === 0) {
                return null; // Picture not found
            }
            
            // Return updated picture
            return await Picture.getPictureById(id);
            
        } catch (error) {
            console.error('Error updating picture description:', error);
            throw new Error(`Failed to update picture: ${error.message}`);
        }
    }

    /**
     * Delete a picture from database and filesystem
     * @param {number} id - Picture ID
     * @returns {Promise<boolean>} True if deleted successfully
     */
    static async deletePicture(id) {
        try {
            // First get the picture to know which files to delete
            const picture = await Picture.getPictureById(id);
            
            if (!picture) {
                return false; // Picture not found
            }
            
            // Delete from database first
            const query = 'DELETE FROM pictures WHERE id = ?';
            const result = await database.run(query, [id]);
            
            if (result.changes === 0) {
                return false;
            }
            
            // Delete files from filesystem
            await Picture.deleteFiles(picture.filename);
            
            return true;
            
        } catch (error) {
            console.error('Error deleting picture:', error);
            throw new Error(`Failed to delete picture: ${error.message}`);
        }
    }

    /**
     * Delete picture files from filesystem
     * @param {string} filename - Picture filename
     * @returns {Promise<void>}
     */
    static async deleteFiles(filename) {
        try {
            const uploadsDir = path.join(__dirname, '../uploads');
            const thumbnailsDir = path.join(uploadsDir, 'thumbnails');
            
            const mainFilePath = path.join(uploadsDir, filename);
            const thumbnailPath = path.join(thumbnailsDir, filename);
            
            // Delete main image file
            try {
                await fs.unlink(mainFilePath);
                console.log(`Deleted main image: ${filename}`);
            } catch (err) {
                console.warn(`Could not delete main image ${filename}:`, err.message);
            }
            
            // Delete thumbnail file
            try {
                await fs.unlink(thumbnailPath);
                console.log(`Deleted thumbnail: ${filename}`);
            } catch (err) {
                console.warn(`Could not delete thumbnail ${filename}:`, err.message);
            }
            
        } catch (error) {
            console.error('Error deleting files:', error);
            // Don't throw here - we want database deletion to succeed even if file deletion fails
        }
    }

    /**
     * Get total count of pictures
     * @returns {Promise<number>} Total picture count
     */
    static async getTotalCount() {
        try {
            const query = 'SELECT COUNT(*) as count FROM pictures';
            const result = await database.get(query);
            return result.count;
            
        } catch (error) {
            console.error('Error getting picture count:', error);
            throw new Error(`Failed to get picture count: ${error.message}`);
        }
    }

    /**
     * Search pictures by description or original name
     * @param {string} searchTerm - Search term
     * @param {Object} options - Query options
     * @returns {Promise<Array<Picture>>} Array of matching pictures
     */
    static async searchPictures(searchTerm, options = {}) {
        try {
            const { 
                limit = null, 
                offset = 0, 
                orderBy = 'upload_date', 
                orderDirection = 'DESC' 
            } = options;
            
            let query = `
                SELECT 
                    id, filename, original_name, description, 
                    file_size, mime_type, width, height,
                    upload_date, updated_date
                FROM pictures 
                WHERE description LIKE ? OR original_name LIKE ?
                ORDER BY ${orderBy} ${orderDirection}
            `;
            
            const searchPattern = `%${searchTerm}%`;
            const params = [searchPattern, searchPattern];
            
            if (limit) {
                query += ' LIMIT ? OFFSET ?';
                params.push(limit, offset);
            }
            
            const rows = await database.all(query, params);
            
            return rows.map(row => new Picture(row));
            
        } catch (error) {
            console.error('Error searching pictures:', error);
            throw new Error(`Failed to search pictures: ${error.message}`);
        }
    }

    /**
     * Get pictures by MIME type
     * @param {string} mimeType - MIME type to filter by
     * @returns {Promise<Array<Picture>>} Array of pictures with matching MIME type
     */
    static async getPicturesByMimeType(mimeType) {
        try {
            const query = `
                SELECT 
                    id, filename, original_name, description, 
                    file_size, mime_type, width, height,
                    upload_date, updated_date
                FROM pictures 
                WHERE mime_type = ?
                ORDER BY upload_date DESC
            `;
            
            const rows = await database.all(query, [mimeType]);
            
            return rows.map(row => new Picture(row));
            
        } catch (error) {
            console.error('Error fetching pictures by MIME type:', error);
            throw new Error(`Failed to fetch pictures by MIME type: ${error.message}`);
        }
    }

    /**
     * Convert picture instance to JSON
     * @returns {Object} Picture data as plain object
     */
    toJSON() {
        return {
            id: this.id,
            filename: this.filename,
            original_name: this.original_name,
            description: this.description,
            file_size: this.file_size,
            mime_type: this.mime_type,
            width: this.width,
            height: this.height,
            upload_date: this.upload_date,
            updated_date: this.updated_date
        };
    }
}

module.exports = Picture;
