# Picture Database Website - Planning Document

## High-Level Vision

Create a modern, responsive web application for managing a personal picture database with upload, view, edit, and delete functionality. The application will start as a local development solution and be prepared for Azure cloud deployment with EntraID authentication.

## Architecture Overview

### Application Structure
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
├── package.json
└── README.md
```

### Data Model
**Pictures Table:**
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- filename (TEXT NOT NULL)
- original_name (TEXT NOT NULL)
- description (TEXT)
- file_size (INTEGER)
- mime_type (TEXT)
- upload_date (DATETIME DEFAULT CURRENT_TIMESTAMP)
- updated_date (DATETIME DEFAULT CURRENT_TIMESTAMP)

## Technology Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** SQLite3
- **File Upload:** Multer
- **Image Processing:** Sharp (for thumbnails)
- **Template Engine:** EJS
- **Authentication:** @azure/msal-node (for EntraID integration)

### Frontend
- **CSS Framework:** Bootstrap 5 (for responsive design)
- **JavaScript:** Vanilla ES6+ with Fetch API
- **Icons:** Bootstrap Icons
- **Image Display:** Custom lightbox implementation

### Development Tools
- **Package Manager:** npm
- **Process Manager:** nodemon (development)
- **Environment:** dotenv
- **Linting:** ESLint (optional)

## Design Principles

### UI/UX Design
- **Modern Material Design** inspired interface
- **Mobile-first responsive** design
- **Accessible** with proper ARIA labels
- **Fast loading** with optimized thumbnails
- **Intuitive navigation** with clear action buttons

### Customization Features
- CSS custom properties for easy color scheme changes
- Configurable button styles and sizes
- Responsive grid layouts that adapt to screen size
- Dark/light theme support preparation

### Color Scheme (Customizable)
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
}
```

## Constraints & Requirements

### Technical Constraints
- SQLite database for both local and Azure deployment
- File-based storage (no external blob storage initially)
- Browser compatibility: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Maximum file size: 10MB per image
- Supported formats: JPEG, PNG, WebP, GIF

### Functional Requirements
- Image upload with description
- Thumbnail generation (200x200px)
- Full-size image viewing
- Description editing
- Image deletion with confirmation
- Responsive grid layout
- Search/filter functionality (future enhancement)

### Security Requirements
- File type validation
- File size limits
- XSS protection
- CSRF protection
- Secure file naming
- EntraID authentication preparation

## Deployment Strategy

### Local Development (Phase 1)
- Run on localhost:3000
- SQLite database in local file system
- File uploads to local directory
- No authentication initially

### Azure Deployment (Phase 2)
- **Azure App Service** (Web App)
- **SQLite database** packaged with deployment
- **EntraID authentication** integration
- **HTTPS enforcement**
- **Environment variables** for configuration

### Azure Configuration
```javascript
// Environment variables for Azure
process.env.NODE_ENV = 'production'
process.env.PORT = process.env.PORT || 8080
process.env.AZURE_CLIENT_ID = 'your-client-id'
process.env.AZURE_TENANT_ID = 'your-tenant-id'
process.env.AZURE_CLIENT_SECRET = 'your-client-secret'
```

## Development Phases

### Phase 1: Core Functionality (Local)
1. Basic Express server setup
2. SQLite database integration
3. File upload functionality
4. Image thumbnail generation
5. CRUD operations for pictures
6. Basic responsive UI

### Phase 2: Enhanced UI/UX
1. Modern CSS framework integration
2. Responsive design implementation
3. Interactive elements and animations
4. Error handling and user feedback
5. Loading states and progress indicators

### Phase 3: Azure Preparation
1. EntraID authentication integration
2. Environment configuration
3. Production optimizations
4. Security enhancements
5. Deployment scripts

### Phase 4: Azure Deployment
1. Azure App Service configuration
2. Database migration strategy
3. Static asset optimization
4. Monitoring and logging setup
5. SSL/HTTPS configuration

## Testing Strategy

### Manual Testing Checklist
- [ ] Image upload with various file types and sizes
- [ ] Thumbnail generation and display
- [ ] Full-size image viewing
- [ ] Description editing and updating
- [ ] Image deletion with confirmation
- [ ] Responsive design on different screen sizes
- [ ] Cross-browser compatibility
- [ ] Error handling for edge cases

### Performance Considerations
- Lazy loading for image thumbnails
- Image compression and optimization
- Database query optimization
- Caching strategies for static assets
- Pagination for large image collections

## Future Enhancements

### Potential Features
- Image categorization and tagging
- Advanced search and filtering
- Bulk operations (delete, download)
- Image editing capabilities
- Social sharing features
- Image metadata extraction
- Backup and export functionality
- User management and permissions

### Scalability Considerations
- Database migration to Azure SQL Database
- Azure Blob Storage for image files
- CDN integration for global distribution
- Load balancing for high traffic
- Caching layer implementation