// Navigation module for handling page navigation and UI state
function initPageNavigation() {
    // Initialize navigation elements
    initMobileMenu();
    initDropdowns();
    initPageLinks();
    
    // Check for URL hash to navigate to specific page
    checkUrlHash();
    
    // Listen for hash changes
    window.addEventListener('hashchange', checkUrlHash);
}

function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            
            // Update icon
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }
    
    // Initialize mobile dropdown toggles
    const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
    
    mobileDropdownBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const dropdownId = btn.getAttribute('data-mobile-dropdown');
            const content = document.getElementById(`${dropdownId}-content`);
            
            if (content) {
                content.classList.toggle('active');
                
                // Update icon
                const icon = btn.querySelector('i');
                if (icon) {
                    if (content.classList.contains('active')) {
                        icon.className = 'fas fa-chevron-up';
                    } else {
                        icon.className = 'fas fa-chevron-down';
                    }
                }
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            mobileMenu.classList.remove('active');
            
            // Update icon
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }
    });
}

function initDropdowns() {
    const navDropdowns = document.querySelectorAll('.nav-dropdown');
    
    navDropdowns.forEach(dropdown => {
        const dropdownId = dropdown.getAttribute('data-dropdown');
        const dropdownContent = document.getElementById(`${dropdownId}-dropdown`);
        
        if (dropdownContent) {
            // Handle hover on desktop
            if (window.innerWidth >= 768) {
                dropdown.addEventListener('mouseenter', () => {
                    dropdownContent.classList.add('active');
                });
                
                dropdown.addEventListener('mouseleave', () => {
                    dropdownContent.classList.remove('active');
                });
            }
            
            // Handle click on both mobile and desktop
            const dropdownBtn = dropdown.querySelector('.dropdown-btn');
            if (dropdownBtn) {
                dropdownBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close all other dropdowns
                    document.querySelectorAll('.dropdown-content').forEach(content => {
                        if (content !== dropdownContent) {
                            content.classList.remove('active');
                        }
                    });
                    
                    // Toggle this dropdown
                    dropdownContent.classList.toggle('active');
                });
            }
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.dropdown-content').forEach(content => {
                content.classList.remove('active');
            });
        }
    });
}

function initPageLinks() {
    // Handle click on page navigation links
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const pageId = link.getAttribute('data-page');
            
            // Check if this page requires authentication
            const requiresAuth = link.getAttribute('data-requires-auth') === 'true';
            if (requiresAuth && !window.app.isUserLoggedIn()) {
                window.app.navigateToPage('login');
                window.app.showMessage('Please login to access this page', 'error');
                return;
            }
            
            // Navigate to the page
            navigateToPage(pageId);
            
            // Update URL hash
            window.location.hash = `#${pageId}`;
        });
    });
}

function navigateToPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            
            // Update hamburger icon
            const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            if (mobileMenuToggle) {
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        }
        
        // Dispatch page changed event for other modules
        const event = new CustomEvent('pageChanged', {
            detail: { page: pageId }
        });
        document.dispatchEvent(event);
    } else {
        console.error(`Page ${pageId} not found`);
    }
}

function checkUrlHash() {
    const hash = window.location.hash.substring(1);
    
    if (hash) {
        // Check if the page exists
        const targetPage = document.getElementById(`${hash}-page`);
        
        if (targetPage) {
            // Check if page requires authentication
            const pageLink = document.querySelector(`[data-page="${hash}"]`);
            const requiresAuth = pageLink && pageLink.getAttribute('data-requires-auth') === 'true';
            
            if (requiresAuth && !window.app.isUserLoggedIn()) {
                // Redirect to login
                navigateToPage('login');
                window.app.showMessage('Please login to access this page', 'error');
                return;
            }
            
            // Navigate to the page
            navigateToPage(hash);
        } else {
            // If page doesn't exist, default to home
            navigateToPage('home');
        }
    } else {
        // Default to home page if no hash
        navigateToPage('home');
    }
}

// Handle responsiveness
function handleResize() {
    // Reset dropdowns on window resize
    if (window.innerWidth >= 768) {
        // Close mobile menu on desktop view
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            
            // Update hamburger icon
            const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            if (mobileMenuToggle) {
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        }
    }
}

// Add resize listener
window.addEventListener('resize', handleResize);

// Export navigation functions
window.navigation = {
    navigateToPage,
    initPageNavigation
};
