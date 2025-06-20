#!/usr/bin/env node

/**
 * Quick start script for Picture Database Application
 * Performs basic checks and starts the server
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🚀 Picture Database - Quick Start\n');

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    const install = spawn('npm', ['install'], { stdio: 'inherit' });
    
    install.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Dependencies installed\n');
            startServer();
        } else {
            console.error('❌ Failed to install dependencies');
            process.exit(1);
        }
    });
} else {
    console.log('✅ Dependencies already installed\n');
    startServer();
}

function startServer() {
    console.log('🔧 Starting Picture Database Server...\n');
    
    // Start the server
    const server = spawn('node', ['server/app.js'], { stdio: 'inherit' });
    
    server.on('error', (error) => {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    });
    
    server.on('close', (code) => {
        console.log(`\n🛑 Server stopped with code ${code}`);
    });
    
    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
        console.log('\n\n🛑 Shutting down server...');
        server.kill('SIGINT');
    });
}
