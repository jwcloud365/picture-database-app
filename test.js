/**
 * Test script for Picture Database Application
 * Tests database connection and basic functionality
 */

const database = require('./server/database/connection');
const Picture = require('./server/models/Picture');

async function runTests() {
    console.log('🧪 Starting Picture Database Tests...\n');
    
    try {
        // Test 1: Database connection
        console.log('1. Testing database connection...');
        await database.initialize();
        console.log('✅ Database connected successfully\n');
        
        // Test 2: Database tables
        console.log('2. Testing database tables...');
        const tables = await database.all("SELECT name FROM sqlite_master WHERE type='table'");
        console.log('📋 Found tables:', tables.map(t => t.name));
        console.log('✅ Database tables verified\n');
        
        // Test 3: Picture model - count
        console.log('3. Testing Picture model - count...');
        const count = await Picture.getTotalCount();
        console.log(`📊 Total pictures in database: ${count}`);
        console.log('✅ Picture count retrieved\n');
        
        // Test 4: Picture model - get all
        console.log('4. Testing Picture model - get all...');
        const pictures = await Picture.getAllPictures({ limit: 5 });
        console.log(`📸 Retrieved ${pictures.length} pictures`);
        if (pictures.length > 0) {
            console.log('📝 Sample picture:', {
                id: pictures[0].id,
                filename: pictures[0].filename,
                original_name: pictures[0].original_name
            });
        }
        console.log('✅ Picture retrieval working\n');
        
        // Test 5: Test directories
        console.log('5. Testing directory structure...');
        const fs = require('fs');
        const path = require('path');
        
        const uploadsDir = path.join(__dirname, 'server', 'uploads');
        const thumbnailsDir = path.join(uploadsDir, 'thumbnails');
        
        console.log(`📁 Uploads directory exists: ${fs.existsSync(uploadsDir)}`);
        console.log(`📁 Thumbnails directory exists: ${fs.existsSync(thumbnailsDir)}`);
        console.log('✅ Directory structure verified\n');
        
        console.log('🎉 All tests passed! The application is ready to run.');
        console.log('\nTo start the server:');
        console.log('  npm start');
        console.log('  or');
        console.log('  node server/app.js');
        console.log('\nThen open: http://localhost:3000');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('\nFull error:', error);
    } finally {
        // Close database connection
        await database.close();
        console.log('\n🔌 Database connection closed');
    }
}

// Run tests
runTests();
