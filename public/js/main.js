/**
 * Main JavaScript file for Picture Database Application
 * Handles common functionality across all pages
 */

// Global application state
window.PictureDB = {
    config: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
        apiBaseUrl: '/api'
    },
    state: {
        isLoading: false,
        currentTheme: 'light'
    }
};

/**
 * Initialize application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize core application functionality
 */
function initializeApp() {
    initializeTheme();
    initializeTooltips();
    initializeKeyboardNavigation();
    initializeErrorHandling();
    
    console.log('Picture Database App initialized');
}

/**
 * Theme management
 */
function initializeTheme() {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('picturedb-theme') || 'light';
    setTheme(savedTheme);
}

/**
 * Set application theme
 * @param {string} theme - 'light' or 'dark'
 */
function setTheme(theme) {
    const body = document.body;
    
    if (theme === 'dark') {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }
    
    PictureDB.state.currentTheme = theme;
    localStorage.setItem('picturedb-theme', theme);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const newTheme = PictureDB.state.currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialize keyboard navigation
 */
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC key closes modals
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
        }
        
        // Ctrl/Cmd + U opens upload page
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            window.location.href = '/upload';
        }
        
        // Ctrl/Cmd + H goes to home
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            window.location.href = '/';
        }
    });
}

/**
 * Initialize global error handling
 */
function initializeErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        showAlert('An unexpected error occurred. Please try again.', 'danger');
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        showAlert('An unexpected error occurred. Please try again.', 'danger');
    });
}

/**
 * Show alert message
 * @param {string} message - Alert message
 * @param {string} type - Alert type (success, danger, warning, info)
 * @param {number} duration - Auto-hide duration in milliseconds (0 = no auto-hide)
 */
function showAlert(message, type = 'info', duration = 5000) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
        console.warn('Alert container not found');
        return;
    }
    
    const alertId = 'alert-' + Date.now();
    const alertElement = document.createElement('div');
    alertElement.id = alertId;
    alertElement.className = `alert alert-${type} alert-dismissible fade show slide-up`;
    alertElement.setAttribute('role', 'alert');
    
    alertElement.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${getAlertIcon(type)} me-2"></i>
            <span>${escapeHtml(message)}</span>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to container
    alertContainer.appendChild(alertElement);
    
    // Auto-hide if duration is specified
    if (duration > 0) {
        setTimeout(() => {
            const alert = document.getElementById(alertId);
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, duration);
    }
    
    // Scroll to alert
    alertElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Get icon for alert type
 * @param {string} type - Alert type
 * @returns {string} Bootstrap icon name
 */
function getAlertIcon(type) {
    const icons = {
        success: 'check-circle-fill',
        danger: 'exclamation-triangle-fill',
        warning: 'exclamation-triangle-fill',
        info: 'info-circle-fill'
    };
    return icons[type] || 'info-circle-fill';
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show/hide loading indicator
 * @param {boolean} show - Whether to show loading
 * @param {string} message - Loading message
 */
function showLoading(show, message = 'Loading...') {
    PictureDB.state.isLoading = show;
    
    const modal = document.getElementById('loadingModal');
    if (!modal) return;
    
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modal);
    const messageElement = modal.querySelector('.modal-body p');
    
    if (show) {
        if (messageElement) {
            messageElement.textContent = message;
        }
        modalInstance.show();
    } else {
        modalInstance.hide();
    }
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date
 */
function formatDate(date, includeTime = false) {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
    }
    
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
function validateFile(file) {
    const config = PictureDB.config;
    
    // Check file type
    if (!config.allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type. Only ${config.allowedTypes.join(', ')} are allowed.`
        };
    }
    
    // Check file size
    if (file.size > config.maxFileSize) {
        return {
            valid: false,
            error: `File too large. Maximum size is ${formatFileSize(config.maxFileSize)}.`
        };
    }
    
    return { valid: true };
}

/**
 * Create image preview from file
 * @param {File} file - Image file
 * @returns {Promise<string>} Data URL of the image
 */
function createImagePreview(file) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            reject(new Error('Not an image file'));
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}

/**
 * Download file from URL
 * @param {string} url - File URL
 * @param {string} filename - Suggested filename
 */
function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Make API request with error handling
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response
 */
async function apiRequest(url, options = {}) {
    try {
        showLoading(true);
        
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
        
    } catch (error) {
        console.error('API request failed:', error);
        showAlert(`Request failed: ${error.message}`, 'danger');
        throw error;
    } finally {
        showLoading(false);
    }
}

/**
 * Lazy load images
 */
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * Initialize service worker for offline support (if available)
 */
function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        });
    }
}

/**
 * Utility function to check if device is mobile
 * @returns {boolean} True if mobile device
 */
function isMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Utility function to check if device supports touch
 * @returns {boolean} True if touch is supported
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Add keyboard accessibility to elements
 * @param {Element} element - Element to make accessible
 * @param {Function} callback - Function to call on activation
 */
function makeAccessible(element, callback) {
    element.setAttribute('tabindex', '0');
    element.setAttribute('role', 'button');
    
    element.addEventListener('click', callback);
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            callback(e);
        }
    });
}

// Export functions for use in other files
window.PictureDB.utils = {
    showAlert,
    showLoading,
    formatFileSize,
    formatDate,
    validateFile,
    createImagePreview,
    debounce,
    copyToClipboard,
    downloadFile,
    apiRequest,
    initializeLazyLoading,
    isMobile,
    isTouchDevice,
    makeAccessible,
    escapeHtml
};

// Initialize lazy loading and service worker
document.addEventListener('DOMContentLoaded', () => {
    initializeLazyLoading();
    initializeServiceWorker();
});
