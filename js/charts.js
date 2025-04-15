// Charts module for data visualization across the application
function initCharts() {
    // Initialize all charts when on appropriate pages
    document.addEventListener('pageChanged', (e) => {
        const page = e.detail.page;
        
        if (page === 'dashboard') {
            initializeDashboardCharts();
        } else if (page === 'ld-dashboard') {
            initializeLDCharts();
        }
    });
    
    // Also initialize on first load if needed
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
        const pageId = currentPage.id.replace('-page', '');
        
        if (pageId === 'dashboard') {
            initializeDashboardCharts();
        } else if (pageId === 'ld-dashboard') {
            initializeLDCharts();
        }
    }
}

function initializeDashboardCharts() {
    // Initialize the progress circle
    initializeProgressCircle();
    
    // Initialize skill map
    initializeSkillMap();
    
    // Initialize streak calendar
    initializeStreakCalendar();
}

function initializeLDCharts() {
    // Initialize L&D dashboard charts
    window.dashboard.initLDDashboard();
    
    // Set up filter event listeners
    const departmentFilter = document.getElementById('department-filter');
    const timeFilter = document.getElementById('time-filter');
    
    if (departmentFilter) {
        departmentFilter.addEventListener('change', () => {
            // Re-render department chart when filter changes
            const departmentChart = document.getElementById('department-chart');
            if (departmentChart) {
                createDepartmentChart(departmentChart);
            }
        });
    }
    
    if (timeFilter) {
        timeFilter.addEventListener('change', () => {
            // Re-render effectiveness chart when filter changes
            const effectivenessChart = document.getElementById('effectiveness-chart');
            if (effectivenessChart) {
                createEffectivenessChart(effectivenessChart);
            }
        });
    }
}

function initializeProgressCircle() {
    const progressCircle = document.getElementById('progress-circle-value');
    if (!progressCircle) return;
    
    // Get user progress
    const userData = localStorage.getItem('learningPersonaUser');
    if (!userData) return;
    
    try {
        const parsedData = JSON.parse(userData);
        const progress = parsedData.currentUser?.progress || 0;
        
        // Calculate dashoffset (circumference - (circumference * progress / 100))
        const radius = 45; // From the SVG circle
        const circumference = 2 * Math.PI * radius;
        progressCircle.style.strokeDasharray = circumference;
        
        // Animate progress
        const currentOffset = progressCircle.style.strokeDashoffset || circumference;
        const targetOffset = circumference - (circumference * progress / 100);
        
        animateProgress(progressCircle, parseFloat(currentOffset), targetOffset);
    } catch (e) {
        console.error('Error initializing progress circle:', e);
    }
}

function animateProgress(element, start, end) {
    const duration = 1000; // 1 second animation
    const startTime = performance.now();
    
    function updateProgress(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const value = start + (end - start) * progress;
        
        element.style.strokeDashoffset = value;
        
        if (progress < 1) {
            requestAnimationFrame(updateProgress);
        }
    }
    
    requestAnimationFrame(updateProgress);
}

function initializeSkillMap() {
    // Actual implementation moved to dashboard.js
    // We'll just call that function here
    if (typeof window.dashboard !== 'undefined') {
        const skillMapContainer = document.getElementById('skill-map-container');
        if (skillMapContainer) {
            // Apply radar chart visualization
            applyRadarChartVisualization(skillMapContainer);
        }
    }
}

function applyRadarChartVisualization(container) {
    // Clears and redraws the skill map with animated entrance
    const skillData = [
        { name: 'Analytics', value: 80, top: '20%', left: '50%', color: 'var(--primary-500)' },
        { name: 'Coding', value: 65, top: '50%', left: '85%', color: 'var(--secondary-500)' },
        { name: 'Leadership', value: 70, top: '80%', left: '70%', color: 'var(--accent-500)' },
        { name: 'Design', value: 55, top: '80%', left: '30%', color: 'var(--success)' },
        { name: 'Research', value: 75, top: '50%', left: '15%', color: 'var(--warning)' }
    ];
    
    // This function will animate the skill points appearing one by one
    function animateSkillPoints() {
        const points = container.querySelectorAll('.skill-point');
        const labels = container.querySelectorAll('.skill-label');
        const lines = container.querySelectorAll('.skill-line');
        
        // Hide all elements initially
        points.forEach(point => {
            point.style.opacity = '0';
            point.style.transform = 'translate(-50%, -50%) scale(0)';
        });
        
        labels.forEach(label => {
            label.style.opacity = '0';
        });
        
        lines.forEach(line => {
            line.style.opacity = '0';
        });
        
        // Animate points appearing
        points.forEach((point, index) => {
            setTimeout(() => {
                point.style.transition = 'all 0.5s ease-out';
                point.style.opacity = '1';
                point.style.transform = 'translate(-50%, -50%) scale(1)';
            }, index * 200);
        });
        
        // Animate labels appearing
        labels.forEach((label, index) => {
            setTimeout(() => {
                label.style.transition = 'all 0.5s ease-out';
                label.style.opacity = '1';
            }, 1000 + index * 150);
        });
        
        // Animate lines appearing
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.style.transition = 'all 0.5s ease-out';
                line.style.opacity = '1';
            }, 1500 + index * 100);
        });
    }
    
    // Call the animation function if elements are present
    const skillPoints = container.querySelectorAll('.skill-point');
    if (skillPoints.length > 0) {
        animateSkillPoints();
    }
}

function initializeStreakCalendar() {
    const streakCalendar = document.getElementById('streak-calendar');
    if (!streakCalendar) return;
    
    // Get user data
    const userData = localStorage.getItem('learningPersonaUser');
    if (!userData) return;
    
    try {
        const parsedData = JSON.parse(userData);
        const streak = parsedData.currentUser?.streak || 0;
        
        // Generate streak calendar with animation
        generateAnimatedStreakCalendar(streakCalendar, streak);
    } catch (e) {
        console.error('Error initializing streak calendar:', e);
    }
}

function generateAnimatedStreakCalendar(container, streakCount) {
    // Clear existing calendar
    container.innerHTML = '';
    
    // Generate days for two weeks (14 days)
    for (let i = 13; i >= 0; i--) {
        const streakDay = document.createElement('div');
        streakDay.className = 'streak-day';
        
        // Determine if day was active
        if (i < streakCount) {
            // Assign random intensity classes for active days
            const intensity = Math.floor(Math.random() * 5) + 1;
            streakDay.className = `streak-day active-${intensity}`;
            
            // Set initial opacity to 0
            streakDay.style.opacity = '0';
            streakDay.style.transform = 'scale(0.5)';
            
            // Add animation with delay based on index
            streakDay.style.transition = 'all 0.3s ease-out';
            
            // Animate entrance with delay
            setTimeout(() => {
                streakDay.style.opacity = '1';
                streakDay.style.transform = 'scale(1)';
            }, (13 - i) * 100); // Animate from oldest to newest
        }
        
        container.appendChild(streakDay);
    }
}

// Handle chart creation for L&D dashboards
function createDepartmentChart(container) {
    // Implementation moved to dashboard.js
    if (typeof window.dashboard !== 'undefined') {
        window.dashboard.createDepartmentChart(container);
    }
}

function createEffectivenessChart(container) {
    // Implementation moved to dashboard.js
    if (typeof window.dashboard !== 'undefined') {
        window.dashboard.createEffectivenessChart(container);
    }
}

// Export charts functionality
window.charts = {
    initCharts,
    initializeDashboardCharts,
    initializeLDCharts
};
