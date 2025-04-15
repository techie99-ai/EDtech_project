// Authentication module for user login, registration, and session management
function checkAuthStatus() {
    const userData = localStorage.getItem('learningPersonaUser');
    
    if (userData) {
        try {
            const parsedData = JSON.parse(userData);
            
            if (parsedData.isLoggedIn && parsedData.currentUser) {
                updateUIForLoggedInUser(parsedData.currentUser);
                return true;
            }
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
    
    updateUIForLoggedOutUser();
    return false;
}

function updateUIForLoggedInUser(user) {
    // Hide auth buttons, show user menu
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-menu').style.display = 'flex';
    document.getElementById('mobile-auth-buttons').style.display = 'none';
    document.getElementById('mobile-user-menu').style.display = 'block';
    
    // Update user information
    document.getElementById('user-avatar').textContent = user.name.charAt(0);
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('mobile-avatar').textContent = user.name.charAt(0);
    document.getElementById('mobile-user-name').textContent = user.name;
    document.getElementById('mobile-user-email').textContent = user.email;
    
    // Update dashboard elements if on dashboard page
    if (document.getElementById('dashboard-page').classList.contains('active')) {
        updateDashboardUI(user);
    }
    
    // Update quiz signup prompt
    const signupPrompt = document.getElementById('signup-prompt');
    if (signupPrompt) {
        signupPrompt.style.display = 'none';
    }
}

function updateUIForLoggedOutUser() {
    // Show auth buttons, hide user menu
    document.getElementById('auth-buttons').style.display = 'flex';
    document.getElementById('user-menu').style.display = 'none';
    document.getElementById('mobile-auth-buttons').style.display = 'block';
    document.getElementById('mobile-user-menu').style.display = 'none';
    
    // If user is on restricted page, redirect to home
    const restrictedPages = [
        'dashboard', 'profile', 'courses', 'strategies', 
        'ld-dashboard', 'ld-reports'
    ];
    
    const currentPage = document.querySelector('.page.active');
    if (currentPage && restrictedPages.includes(currentPage.id.replace('-page', ''))) {
        window.app.navigateToPage('home');
    }
}

function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            login(email, password);
        });
    }
}

function initRegisterForm() {
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('register-first-name').value;
            const lastName = document.getElementById('register-last-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            
            register(firstName, lastName, email, password);
        });
    }
}

function login(email, password) {
    // In a real application, this would validate with a server
    // For this demo, we'll simulate login
    
    // Check if email exists (simple validation)
    if (!email.includes('@') || password.length < 6) {
        window.app.showMessage('Invalid email or password', 'error');
        return;
    }
    
    // Create user object for this demo
    const user = {
        name: email.split('@')[0].replace(/\./g, ' '),
        email: email,
        persona: 'The Explorer',
        progress: 65,
        streak: 12,
        completedCourses: 7,
        department: 'Marketing'
    };
    
    // Set user as logged in
    saveUserToLocalStorage(user);
    
    // Update UI
    updateUIForLoggedInUser(user);
    
    // Show success message
    window.app.showMessage('Successfully logged in!', 'success');
    
    // Navigate to dashboard
    window.app.navigateToPage('dashboard');
}

function register(firstName, lastName, email, password) {
    // In a real application, this would register with a server
    // For this demo, we'll simulate registration
    
    // Simple validation
    if (!email.includes('@') || password.length < 8) {
        window.app.showMessage('Please enter a valid email and password (min 8 characters)', 'error');
        return;
    }
    
    // Create user object
    const user = {
        name: `${firstName} ${lastName}`,
        email: email,
        persona: null,
        progress: 0,
        streak: 0,
        completedCourses: 0,
        department: 'New User'
    };
    
    // Set user as logged in
    saveUserToLocalStorage(user);
    
    // Update UI
    updateUIForLoggedInUser(user);
    
    // Show success message
    window.app.showMessage('Account created successfully!', 'success');
    
    // Navigate to dashboard
    window.app.navigateToPage('dashboard');
}

function logout() {
    // Clear user data
    localStorage.removeItem('learningPersonaUser');
    
    // Update UI
    updateUIForLoggedOutUser();
    
    // Show message
    window.app.showMessage('You have been logged out', 'info');
    
    // Navigate to home
    window.app.navigateToPage('home');
}

function saveUserToLocalStorage(user) {
    const userData = {
        isLoggedIn: true,
        currentUser: user
    };
    
    localStorage.setItem('learningPersonaUser', JSON.stringify(userData));
}

// Initialize authentication when the module loads
function initAuth() {
    // Initialize login and register forms
    initLoginForm();
    initRegisterForm();
    
    // Set up logout buttons
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('mobile-logout-btn').addEventListener('click', logout);
}

// Export authentication functions
window.auth = {
    checkAuthStatus,
    login,
    register,
    logout
};

// Initialize authentication when the document is ready
document.addEventListener('DOMContentLoaded', initAuth);
