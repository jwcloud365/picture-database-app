const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

/**
 * Database connection module for Picture Database Application
 * Handles SQLite database initialization, connection, and basic operations
 */

class Database {
    constructor() {
        this.db = null;
        this.dbPath = path.join(__dirname, 'pictures.db');
        this.schemaPath = path.join(__dirname, 'schema.sql');
    }

    /**
     * Initialize database connection and create tables if they don't exist
     * @returns {Promise<void>}
     */
    async initialize() {
        return new Promise((resolve, reject) => {
            // Create database directory if it doesn't exist
            const dbDir = path.dirname(this.dbPath);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }

            // Open database connection
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err.message);
                    reject(err);
                    return;
                }
                
                console.log('Connected to SQLite database:', this.dbPath);
                
                // Enable foreign keys and WAL mode for better performance
                this.db.serialize(() => {
                    this.db.run("PRAGMA foreign_keys = ON");
                    this.db.run("PRAGMA journal_mode = WAL");
                    
                    // Execute schema file to create tables
                    this.createTables()
                        .then(() => {
                            console.log('Database tables initialized successfully');
                            resolve();
                        })
                        .catch(reject);
                });
            });
        });
    }

    /**
     * Create database tables from schema file
     * @returns {Promise<void>}
     */
    async createTables() {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(this.schemaPath)) {
                reject(new Error(`Schema file not found: ${this.schemaPath}`));
                return;
            }

            const schema = fs.readFileSync(this.schemaPath, 'utf8');
            
            this.db.exec(schema, (err) => {
                if (err) {
                    console.error('Error creating tables:', err.message);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    /**
     * Get database instance
     * @returns {sqlite3.Database} Database instance
     */
    getConnection() {
        if (!this.db) {
            throw new Error('Database not initialized. Call initialize() first.');
        }
        return this.db;
    }

    /**
     * Execute a query that returns multiple rows
     * @param {string} query SQL query
     * @param {Array} params Query parameters
     * @returns {Promise<Array>} Query results
     */
    async all(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    console.error('Database query error:', err.message);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    /**
     * Execute a query that returns a single row
     * @param {string} query SQL query
     * @param {Array} params Query parameters
     * @returns {Promise<Object|null>} Query result or null
     */
    async get(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {
                if (err) {
                    console.error('Database query error:', err.message);
                    reject(err);
                    return;
                }
                resolve(row || null);
            });
        });
    }

    /**
     * Execute a query that modifies data (INSERT, UPDATE, DELETE)
     * @param {string} query SQL query
     * @param {Array} params Query parameters
     * @returns {Promise<Object>} Result with lastID, changes, etc.
     */
    async run(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function(err) {
                if (err) {
                    console.error('Database query error:', err.message);
                    reject(err);
                    return;
                }
                
                resolve({
                    lastID: this.lastID,
                    changes: this.changes
                });
            });
        });
    }

    /**
     * Execute multiple queries in a transaction
     * @param {Array<{query: string, params: Array}>} queries Array of query objects
     * @returns {Promise<Array>} Array of results
     */
    async transaction(queries) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("BEGIN TRANSACTION");
                
                const results = [];
                let completed = 0;
                
                const handleError = (err) => {
                    this.db.run("ROLLBACK");
                    reject(err);
                };
                
                queries.forEach((queryObj, index) => {
                    this.db.run(queryObj.query, queryObj.params, function(err) {
                        if (err) {
                            handleError(err);
                            return;
                        }
                        
                        results[index] = {
                            lastID: this.lastID,
                            changes: this.changes
                        };
                        
                        completed++;
                        
                        if (completed === queries.length) {
                            this.db.run("COMMIT", (err) => {
                                if (err) {
                                    handleError(err);
                                    return;
                                }
                                resolve(results);
                            });
                        }
                    });
                });
            });
        });
    }

    /**
     * Close database connection
     * @returns {Promise<void>}
     */
    async close() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve();
                return;
            }
            
            this.db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                    reject(err);
                    return;
                }
                
                console.log('Database connection closed');
                this.db = null;
                resolve();
            });
        });
    }
}

// Create singleton instance
const database = new Database();

module.exports = database;
