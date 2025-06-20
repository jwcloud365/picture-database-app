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

![Picture Database Demo](https://via.placeholder.com/800x400/007bff/ffffff?text=Picture+Database+Screenshot)

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
picture-database-app/
├── 📁 server/
│   ├── 🚀 app.js              # Main Express application
│   ├── 📁 models/             # Database models (Picture.js)
│   ├── 📁 uploads/            # File storage (ignored by git)
│   ├── 📁 middleware/         # Custom middleware
│   └── 📁 database/           # SQLite schema & connection
├── 📁 public/
│   ├── 📁 css/               # Custom stylesheets
│   ├── 📁 js/                # Client-side JavaScript
│   └── 📁 images/            # Static assets
├── 📁 views/                 # EJS templates
├── 📁 tests/                 # Test files
├── 📋 package.json           # Dependencies & scripts
├── 🚀 start.js              # Quick start script
├── 🧪 test.js               # Basic functionality tests
└── 📖 README.md             # This file
```

## 🔌 API Documentation

### Pictures API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/pictures` | Get all pictures |
| `GET` | `/api/pictures/:id` | Get single picture |
| `POST` | `/api/pictures` | Upload new pictures |
| `PUT` | `/api/pictures/:id` | Update picture description |
| `DELETE` | `/api/pictures/:id` | Delete picture |
| `GET` | `/uploads/:filename` | Serve image files |

### Example API Usage

```javascript
// Upload pictures
const formData = new FormData();
formData.append('pictures', fileInput.files[0]);
formData.append('description', 'My vacation photo');

const response = await fetch('/api/pictures', {
    method: 'POST',
    body: formData
});
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
DB_PATH=./server/database/pictures.db

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_PATH=./server/uploads

# Security (for production)
SESSION_SECRET=your-secret-key
```

### Supported File Types

- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **WebP** (.webp)
- **GIF** (.gif)

### File Size Limits

- **Maximum**: 10MB per file
- **Thumbnails**: Automatically generated at 200x200px

## 🛠️ Development

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start with nodemon (auto-reload)
npm test          # Run functionality tests
npm run quick-start # Install deps + start server
npm run db:init    # Initialize database
npm run lint       # Run ESLint
```

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Testing

```bash
# Run basic functionality tests
npm test

# Test specific functionality
node -e "require('./server/database/connection').initialize().then(() => console.log('✅ Database OK'))"
```

## 🚀 Deployment

### Local Production

```bash
NODE_ENV=production npm start
```

### Azure App Service

This application is designed for Azure deployment:

1. **Prepare for deployment**
2. **Configure Azure App Service**
3. **Set up EntraID authentication** (optional)
4. **Deploy** via GitHub Actions or Azure CLI

> See the full deployment guide in the [PLANNING.md](PLANNING.md) file.

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Contributing Guidelines

1. **Fork** the repository
2. **Create** your feature branch
3. **Write tests** for new functionality
4. **Follow** the existing code style
5. **Submit** a Pull Request

### Code Style

- Use **ESLint** for JavaScript linting
- Follow **consistent naming** conventions
- **Comment** complex logic
- Keep functions **small and focused**

## 🐛 Issues & Support

If you encounter any issues:

1. **Check** the [Issues](https://github.com/jwcloud365/picture-database-app/issues) page
2. **Search** for existing solutions
3. **Create** a new issue with detailed information

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Express.js** - Fast, unopinionated web framework
- **Bootstrap** - Responsive CSS framework
- **Sharp** - High performance image processing
- **SQLite** - Self-contained database engine

## 📈 Roadmap

- [ ] **Authentication** - User login system
- [ ] **Tags** - Image categorization
- [ ] **Bulk Operations** - Select multiple images
- [ ] **Advanced Search** - Filter by date, size, type
- [ ] **Image Editing** - Basic crop/resize functionality
- [ ] **Export** - Download albums as ZIP
- [ ] **PWA** - Progressive Web App features

---

**Made with ❤️ by [jwcloud365](https://github.com/jwcloud365)**

For questions or suggestions, please [open an issue](https://github.com/jwcloud365/picture-database-app/issues) or contact me directly.
