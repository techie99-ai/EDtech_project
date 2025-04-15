// Main JavaScript file that initializes the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize application components
    initApp();
});

function initApp() {
    // Initialize quiz module
    initQuiz();
    
    // Check if user is logged in
    checkAuthStatus();
    
    // Initialize page navigation
    initPageNavigation();
    
    // Initialize charts and visualizations
    initCharts();
    
    // Initialize dashboard features if user is logged in
    initDashboard();
    
    // Register global event listeners
    registerEventListeners();
}

function registerEventListeners() {
    // Quiz start buttons
    document.getElementById('take-quiz-btn').addEventListener('click', startQuiz);
    document.getElementById('start-journey-btn').addEventListener('click', startQuiz);
    document.getElementById('footer-quiz-btn').addEventListener('click', startQuiz);
    
    // Add event listeners to all page navigation links
    document.querySelectorAll('[data-page]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            const page = element.getAttribute('data-page');
            
            // Check if page requires authentication
            const requiresAuth = element.getAttribute('data-requires-auth') === 'true';
            if (requiresAuth && !isUserLoggedIn()) {
                navigateToPage('login');
                showMessage('Please log in to access this page', 'error');
                return;
            }
            
            navigateToPage(page);
        });
    });
}

// Message display functionality
function showMessage(message, type = 'info') {
    // Create message element if it doesn't exist
    let messageContainer = document.getElementById('message-container');
    
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
        messageContainer.style.position = 'fixed';
        messageContainer.style.top = '1rem';
        messageContainer.style.right = '1rem';
        messageContainer.style.zIndex = '1000';
        document.body.appendChild(messageContainer);
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.style.padding = '0.75rem 1rem';
    messageElement.style.marginBottom = '0.5rem';
    messageElement.style.borderRadius = 'var(--radius-md)';
    messageElement.style.backgroundColor = type === 'error' ? 'var(--error)' : 'var(--success)';
    messageElement.style.color = 'white';
    messageElement.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    messageElement.style.transition = 'all 0.3s ease';
    
    messageElement.textContent = message;
    
    messageContainer.appendChild(messageElement);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            messageElement.remove();
        }, 300);
    }, 3000);
}

// Helper function to determine if a user is logged in
function isUserLoggedIn() {
    const userData = localStorage.getItem('learningPersonaUser');
    if (!userData) return false;
    
    try {
        const parsed = JSON.parse(userData);
        return parsed && parsed.isLoggedIn;
    } catch (e) {
        return false;
    }
}

// Navigation function
function navigateToPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // Show requested page
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
    } else {
        console.error(`Page ${page} not found`);
    }
    
    // Update active state in navigation
    updateNavigationState(page);
}

function updateNavigationState(currentPage) {
    // Remove active class from all nav links
    document.querySelectorAll('[data-page]').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page nav link
    document.querySelectorAll(`[data-page="${currentPage}"]`).forEach(link => {
        link.classList.add('active');
    });
    
    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
}

// Export functions for use in other modules
window.app = {
    showMessage,
    navigateToPage,
    isUserLoggedIn
};
