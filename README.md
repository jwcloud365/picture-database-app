# Picture Database Website

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue)](https://expressjs.com/)

A modern, responsive web application for managing a personal picture database with upload, view, edit, and delete functionality. Built with Node.js, Express, SQLite, and Bootstrap 5.

## 🌟 Features

- 📸 **Upload Images**: Support for JPEG, PNG, WebP, and GIF files
- 🖼️ **Automatic Thumbnails**: 200x200px thumbnails generated with Sharp
- 📝 **Description Management**: Add and edit image descriptions
- 🗑️ **Safe Deletion**: Delete images with confirmation dialogs
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🔍 **Search & Filter**: Find images by name or description
- 🎨 **Modern UI**: Clean interface built with Bootstrap 5
- 🛡️ **Security**: File validation, size limits, and XSS protection
- ⚡ **Fast Performance**: Optimized loading with lazy loading and thumbnails

## 📋 Table of Contents

- [Demo](#demo)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Demo

> **Note**: This is a local application. For a live demo, deploy to a cloud service like Azure App Service.

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/jwcloud365/picture-database-app.git
cd picture-database-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Initialize Database

```bash
npm run db:init
```

### 4. Start the Application

```bash
# For development (with auto-reload)
npm run dev

# For production
npm start

# Quick start (installs dependencies if needed)
npm run quick-start
```

### 5. Open Your Browser

Navigate to `http://localhost:3000`

## 🎯 Usage

### Uploading Images

1. Click the **"Upload Pictures"** button in the navigation
2. Drag and drop images or click **"Browse Files"**
3. Add optional descriptions
4. Click **"Upload Pictures"** to save

### Managing Images

- **View Full Size**: Click on any thumbnail
- **Edit Description**: Click the edit icon on image cards
- **Delete Image**: Click the delete icon and confirm
- **Search**: Use the search bar to find images by name or description
- **Sort**: Use the dropdown to sort by date, name, or file size

## 📁 Project Structure

```
picture-database/
├── server/
│   ├── app.js              # Main Express application
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication & validation
│   ├── models/             # Database models
│   ├── uploads/            # File storage directory
│   └── database/           # SQLite database file
├── public/
│   ├── css/               # Stylesheets
│   ├── js/                # Client-side JavaScript
│   └── images/            # Static assets
├── views/                 # EJS templates
├── tests/                 # Unit tests
├── package.json
└── README.md
```

## Usage

### Uploading Images

1. Click the "Upload Image" button
2. Select one or more image files (max 10MB each)
3. Add optional descriptions
4. Click "Upload" to save

### Managing Images

- **View**: Click on any thumbnail to view full-size
- **Edit**: Click the edit icon to modify the description
- **Delete**: Click the delete icon and confirm removal

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
DB_PATH=./server/database/pictures.db
UPLOAD_PATH=./server/uploads
MAX_FILE_SIZE=10485760
```

### Supported File Types

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

## Development Guidelines

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Follow the existing code structure
3. Add tests for new functionality
4. Update documentation
5. Submit pull request

### Code Style

- Use ESLint for code linting
- Follow consistent naming conventions
- Add comments for complex logic
- Keep functions small and focused

## Deployment

### Azure App Service (Production)

This application is designed to be deployed on Azure App Service with EntraID authentication.

See the [deployment guide](DEPLOYMENT.md) for detailed instructions.

### Local Production Test

```bash
NODE_ENV=production npm start
```

## Security

- File type validation
- File size limits (10MB max)
- Secure file naming
- XSS protection
- CSRF protection (production)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the GitHub repository.
