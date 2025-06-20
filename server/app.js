const express = require('express');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Import our modules
const database = require('./database/connection');
const Picture = require('./models/Picture');

/**
 * Picture Database Express Application
 * Main server file that sets up Express server, middleware, and routes
 */

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure required directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

/**
 * Initialize application directories
 */
async function ensureDirectories() {
    try {
        await fs.mkdir(uploadsDir, { recursive: true });
        await fs.mkdir(thumbnailsDir, { recursive: true });
        console.log('Upload directories initialized');
    } catch (error) {
        console.error('Error creating directories:', error);
    }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with original extension
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// File filter for image validation
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/webp',
        'image/gif'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use('/static', express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(uploadsDir));

// Set up EJS template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Basic logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

/**
 * Generate thumbnail for uploaded image
 * @param {string} inputPath - Path to original image
 * @param {string} outputPath - Path for thumbnail
 * @returns {Promise<{width: number, height: number}>} Image dimensions
 */
async function generateThumbnail(inputPath, outputPath) {
    try {
        const metadata = await sharp(inputPath).metadata();
        
        await sharp(inputPath)
            .resize(200, 200, {
                fit: 'cover',
                position: 'center'
            })
            .jpeg({ quality: 85 })
            .toFile(outputPath);
            
        return {
            width: metadata.width,
            height: metadata.height
        };
    } catch (error) {
        console.error('Error generating thumbnail:', error);
        throw error;
    }
}

// Routes

/**
 * Home page - display picture gallery
 */
app.get('/', async (req, res) => {
    try {
        const pictures = await Picture.getAllPictures({ limit: 50 });
        res.render('index', { 
            title: 'Picture Gallery',
            pictures: pictures,
            body: 'index' // This tells the layout which template to render
        });
    } catch (error) {
        console.error('Error loading pictures:', error);
        res.render('index', { 
            title: 'Picture Gallery',
            pictures: [],
            error: 'Failed to load pictures'
        });
    }
});

/**
 * Upload page
 */
app.get('/upload', (req, res) => {
    res.render('upload', { 
        title: 'Upload Pictures' 
    });
});

/**
 * Picture detail page
 */
app.get('/picture/:id', async (req, res) => {
    try {
        const picture = await Picture.getPictureById(req.params.id);
        
        if (!picture) {
            return res.status(404).render('error', {
                title: 'Picture Not Found',
                message: 'The requested picture could not be found.'
            });
        }
        
        res.render('picture-detail', {
            title: picture.original_name,
            picture: picture
        });
    } catch (error) {
        console.error('Error loading picture:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load picture details.'
        });
    }
});

// API Routes

/**
 * API: Get all pictures
 */
app.get('/api/pictures', async (req, res) => {
    try {
        const { limit, offset, search } = req.query;
        
        let pictures;
        if (search) {
            pictures = await Picture.searchPictures(search, { 
                limit: parseInt(limit) || null, 
                offset: parseInt(offset) || 0 
            });
        } else {
            pictures = await Picture.getAllPictures({ 
                limit: parseInt(limit) || null, 
                offset: parseInt(offset) || 0 
            });
        }
        
        res.json({
            success: true,
            pictures: pictures,
            count: pictures.length
        });
    } catch (error) {
        console.error('API Error - Get Pictures:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pictures'
        });
    }
});

/**
 * API: Get single picture
 */
app.get('/api/pictures/:id', async (req, res) => {
    try {
        const picture = await Picture.getPictureById(req.params.id);
        
        if (!picture) {
            return res.status(404).json({
                success: false,
                message: 'Picture not found'
            });
        }
        
        res.json({
            success: true,
            picture: picture
        });
    } catch (error) {
        console.error('API Error - Get Picture:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch picture'
        });
    }
});

/**
 * API: Upload pictures
 */
app.post('/api/pictures', upload.array('pictures', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }
        
        const uploadedPictures = [];
        
        // Process each uploaded file
        for (const file of req.files) {
            try {
                // Generate thumbnail
                const thumbnailPath = path.join(thumbnailsDir, file.filename);
                const dimensions = await generateThumbnail(file.path, thumbnailPath);
                
                // Save picture metadata to database
                const pictureData = {
                    filename: file.filename,
                    original_name: file.originalname,
                    description: req.body.description || '',
                    file_size: file.size,
                    mime_type: file.mimetype,
                    width: dimensions.width,
                    height: dimensions.height
                };
                
                const picture = await Picture.insertPicture(pictureData);
                uploadedPictures.push(picture);
                
            } catch (error) {
                console.error(`Error processing file ${file.filename}:`, error);
                // Clean up file if database save fails
                try {
                    await fs.unlink(file.path);
                } catch (unlinkError) {
                    console.error('Error cleaning up file:', unlinkError);
                }
            }
        }
        
        if (uploadedPictures.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'Failed to process any uploaded files'
            });
        }
        
        res.json({
            success: true,
            message: `Successfully uploaded ${uploadedPictures.length} picture(s)`,
            pictures: uploadedPictures
        });
        
    } catch (error) {
        console.error('API Error - Upload Pictures:', error);
        res.status(500).json({
            success: false,
            message: 'Upload failed'
        });
    }
});

/**
 * API: Update picture description
 */
app.put('/api/pictures/:id', async (req, res) => {
    try {
        const { description } = req.body;
        
        if (typeof description !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Description must be a string'
            });
        }
        
        const picture = await Picture.updatePictureDescription(req.params.id, description);
        
        if (!picture) {
            return res.status(404).json({
                success: false,
                message: 'Picture not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Picture updated successfully',
            picture: picture
        });
        
    } catch (error) {
        console.error('API Error - Update Picture:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update picture'
        });
    }
});

/**
 * API: Delete picture
 */
app.delete('/api/pictures/:id', async (req, res) => {
    try {
        const success = await Picture.deletePicture(req.params.id);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Picture not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Picture deleted successfully'
        });
        
    } catch (error) {
        console.error('API Error - Delete Picture:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete picture'
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Application Error:', error);
    
    // Handle multer errors
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 10MB.'
            });
        }
    }
    
    // Handle other errors
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Page Not Found',
        message: 'The requested page could not be found.'
    });
});

/**
 * Initialize and start the server
 */
async function startServer() {
    try {
        // Ensure directories exist
        await ensureDirectories();
        
        // Initialize database
        await database.initialize();
        
        // Start server
        app.listen(PORT, () => {
            console.log(`Picture Database Server running on http://localhost:${PORT}`);
            console.log('Press Ctrl+C to stop the server');
        });
        
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down server...');
    try {
        await database.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

// Start the server
if (require.main === module) {
    startServer();
}

module.exports = app;
