// Dashboard module for handling dashboard visualizations and interactions
function initDashboard() {
    // Check if user is logged in
    if (!window.app.isUserLoggedIn()) {
        return;
    }
    
    // Get user data from localStorage
    const userData = localStorage.getItem('learningPersonaUser');
    if (!userData) return;
    
    try {
        const parsedData = JSON.parse(userData);
        if (parsedData.isLoggedIn && parsedData.currentUser) {
            updateDashboardUI(parsedData.currentUser);
        }
    } catch (e) {
        console.error('Error parsing user data for dashboard:', e);
    }
}

function updateDashboardUI(user) {
    // Update welcome banner
    const welcomeHeading = document.getElementById('welcome-heading');
    if (welcomeHeading) {
        welcomeHeading.textContent = `Welcome back, ${user.name.split(' ')[0]}`;
    }
    
    // Update streak count
    const userStreak = document.getElementById('user-streak');
    const streakValue = document.getElementById('streak-value');
    if (userStreak) userStreak.textContent = user.streak;
    if (streakValue) streakValue.textContent = user.streak;
    
    // Update completed courses
    const completedCourses = document.getElementById('completed-courses');
    if (completedCourses) completedCourses.textContent = user.completedCourses;
    
    // Update progress circle
    const progressCircle = document.getElementById('progress-circle-value');
    const progressText = document.getElementById('progress-text');
    
    if (progressCircle) {
        // Calculate dashoffset (circumference - (circumference * progress / 100))
        const circumference = 2 * Math.PI * 45; // 45 is the circle radius
        const offset = circumference - (circumference * user.progress / 100);
        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = offset;
    }
    
    if (progressText) {
        progressText.textContent = `${user.progress}%`;
    }
    
    // Update persona information
    const userPersonaName = document.getElementById('user-persona-name');
    if (userPersonaName && user.persona) {
        userPersonaName.textContent = user.persona;
    }
    
    // Generate learning streak calendar
    generateStreakCalendar(user.streak);
    
    // Initialize skill map
    initializeSkillMap();
}

function generateStreakCalendar(streakCount) {
    const streakCalendar = document.getElementById('streak-calendar');
    if (!streakCalendar) return;
    
    // Clear existing calendar
    streakCalendar.innerHTML = '';
    
    // Generate days for two weeks (14 days)
    for (let i = 13; i >= 0; i--) {
        const streakDay = document.createElement('div');
        streakDay.className = 'streak-day';
        
        // Determine if day was active (for this demo, we'll make a pattern)
        // In a real app, you'd use actual user activity data
        if (i < streakCount) {
            // Assign random intensity classes for active days
            const intensity = Math.floor(Math.random() * 5) + 1;
            streakDay.classList.add(`active-${intensity}`);
        }
        
        streakCalendar.appendChild(streakDay);
    }
}

function initializeSkillMap() {
    const skillMapContainer = document.getElementById('skill-map-container');
    if (!skillMapContainer) return;
    
    // Clear existing content
    skillMapContainer.innerHTML = '';
    
    // Create radar chart elements
    // Outer circles (reference rings)
    for (let i = 1; i <= 3; i++) {
        const circle = document.createElement('div');
        circle.className = 'skill-map-circle';
        circle.style.position = 'absolute';
        circle.style.top = `${i * 20}%`;
        circle.style.left = `${i * 20}%`;
        circle.style.right = `${i * 20}%`;
        circle.style.bottom = `${i * 20}%`;
        circle.style.border = '2px solid rgba(67, 97, 238, 0.1)';
        circle.style.borderRadius = '50%';
        
        skillMapContainer.appendChild(circle);
    }
    
    // Skill data points and labels
    const skillData = [
        { name: 'Analytics', top: '20%', left: '50%', color: 'var(--primary-500)' },
        { name: 'Coding', top: '50%', left: '85%', color: 'var(--secondary-500)' },
        { name: 'Leadership', top: '80%', left: '70%', color: 'var(--accent-500)' },
        { name: 'Design', top: '80%', left: '30%', color: 'var(--success)' },
        { name: 'Research', top: '50%', left: '15%', color: 'var(--warning)' }
    ];
    
    // Add skill points and labels
    skillData.forEach(skill => {
        // Create point
        const point = document.createElement('div');
        point.className = 'skill-point';
        point.style.position = 'absolute';
        point.style.top = skill.top;
        point.style.left = skill.left;
        point.style.width = '12px';
        point.style.height = '12px';
        point.style.borderRadius = '50%';
        point.style.backgroundColor = skill.color;
        point.style.transform = 'translate(-50%, -50%)';
        
        // Create label
        const label = document.createElement('div');
        label.className = 'skill-label';
        label.style.position = 'absolute';
        label.style.top = `calc(${skill.top} - 15px)`;
        label.style.left = skill.left;
        label.style.transform = 'translate(-50%, -50%)';
        label.style.fontSize = '12px';
        label.style.fontWeight = '500';
        label.textContent = skill.name;
        
        skillMapContainer.appendChild(point);
        skillMapContainer.appendChild(label);
    });
    
    // Connect the points with lines
    for (let i = 0; i < skillData.length; i++) {
        const startSkill = skillData[i];
        const endSkill = skillData[(i + 1) % skillData.length];
        
        const line = document.createElement('div');
        line.className = 'skill-line';
        line.style.position = 'absolute';
        line.style.height = '2px';
        line.style.backgroundColor = 'rgba(67, 97, 238, 0.2)';
        line.style.transformOrigin = '0 0';
        
        // Position line at start point
        line.style.top = startSkill.top;
        line.style.left = startSkill.left;
        
        // Calculate angle and length
        const startX = parseFloat(startSkill.left);
        const startY = parseFloat(startSkill.top);
        const endX = parseFloat(endSkill.left);
        const endY = parseFloat(endSkill.top);
        
        // Convert percentage to pixel values (approximately)
        const containerWidth = skillMapContainer.clientWidth;
        const containerHeight = skillMapContainer.clientHeight;
        
        const startXPx = (startX / 100) * containerWidth;
        const startYPx = (startY / 100) * containerHeight;
        const endXPx = (endX / 100) * containerWidth;
        const endYPx = (endY / 100) * containerHeight;
        
        // Calculate distance and angle
        const dx = endXPx - startXPx;
        const dy = endYPx - startYPx;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        // Set line length and rotation
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
        
        skillMapContainer.appendChild(line);
    }
}

// L&D Professional Dashboard
function initLDDashboard() {
    // Initialize department chart
    const departmentChart = document.getElementById('department-chart');
    if (departmentChart) {
        createDepartmentChart(departmentChart);
    }
    
    // Initialize effectiveness chart
    const effectivenessChart = document.getElementById('effectiveness-chart');
    if (effectivenessChart) {
        createEffectivenessChart(effectivenessChart);
    }
}

function createDepartmentChart(container) {
    // Clear existing content
    container.innerHTML = '';
    
    // Sample department data
    const departments = [
        { name: 'Marketing', employees: 35, distribution: [35, 25, 20, 15, 5] },
        { name: 'Engineering', employees: 52, distribution: [15, 45, 25, 10, 5] },
        { name: 'Sales', employees: 28, distribution: [30, 15, 30, 15, 10] },
        { name: 'Product', employees: 41, distribution: [25, 20, 15, 35, 5] }
    ];
    
    // Create chart container
    const chartContainer = document.createElement('div');
    chartContainer.className = 'department-bars';
    chartContainer.style.display = 'flex';
    chartContainer.style.height = '75%';
    chartContainer.style.alignItems = 'flex-end';
    chartContainer.style.justifyContent = 'space-around';
    
    // Create bars for each department
    departments.forEach(dept => {
        const deptColumn = document.createElement('div');
        deptColumn.className = 'department-column';
        deptColumn.style.display = 'flex';
        deptColumn.style.flexDirection = 'column';
        deptColumn.style.alignItems = 'center';
        deptColumn.style.width = '24%';
        
        // Create stacked bar
        const barContainer = document.createElement('div');
        barContainer.className = 'department-bar-container';
        barContainer.style.width = '100%';
        barContainer.style.height = `${dept.employees * 1.6}%`;
        barContainer.style.display = 'flex';
        barContainer.style.flexDirection = 'column-reverse';
        barContainer.style.borderTopLeftRadius = 'var(--radius-lg)';
        barContainer.style.borderTopRightRadius = 'var(--radius-lg)';
        barContainer.style.overflow = 'hidden';
        
        // Create segments for different personas
        const colors = [
            'var(--primary-500)',
            'var(--secondary-500)',
            'var(--accent-500)',
            'var(--success)',
            'var(--warning)'
        ];
        
        dept.distribution.forEach((percentage, index) => {
            const segment = document.createElement('div');
            segment.style.width = '100%';
            segment.style.height = `${percentage}%`;
            segment.style.backgroundColor = colors[index % colors.length];
            barContainer.appendChild(segment);
        });
        
        // Create label
        const label = document.createElement('div');
        label.className = 'department-label';
        label.style.marginTop = '0.5rem';
        label.style.textAlign = 'center';
        
        const nameSpan = document.createElement('div');
        nameSpan.style.fontWeight = '500';
        nameSpan.textContent = dept.name;
        
        const countSpan = document.createElement('div');
        countSpan.style.fontSize = '0.75rem';
        countSpan.style.color = 'var(--neutral-500)';
        countSpan.textContent = `${dept.employees} employees`;
        
        label.appendChild(nameSpan);
        label.appendChild(countSpan);
        
        deptColumn.appendChild(barContainer);
        deptColumn.appendChild(label);
        chartContainer.appendChild(deptColumn);
    });
    
    // Create legend
    const legend = document.createElement('div');
    legend.className = 'chart-legend';
    legend.style.position = 'absolute';
    legend.style.top = '1rem';
    legend.style.right = '1rem';
    legend.style.display = 'flex';
    legend.style.flexDirection = 'column';
    legend.style.gap = '0.5rem';
    
    const personaTypes = ['Explorer', 'Thinker', 'Connector', 'Creator', 'Planner'];
    const colors = [
        'var(--primary-500)',
        'var(--secondary-500)',
        'var(--accent-500)',
        'var(--success)',
        'var(--warning)'
    ];
    
    personaTypes.forEach((type, index) => {
        const legendItem = document.createElement('div');
        legendItem.style.display = 'flex';
        legendItem.style.alignItems = 'center';
        
        const colorBox = document.createElement('div');
        colorBox.style.width = '0.75rem';
        colorBox.style.height = '0.75rem';
        colorBox.style.backgroundColor = colors[index];
        colorBox.style.marginRight = '0.5rem';
        colorBox.style.borderRadius = '0.125rem';
        
        const typeText = document.createElement('span');
        typeText.style.fontSize = '0.75rem';
        typeText.style.color = 'var(--neutral-600)';
        typeText.textContent = type;
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(typeText);
        legend.appendChild(legendItem);
    });
    
    container.appendChild(chartContainer);
    container.appendChild(legend);
}

function createEffectivenessChart(container) {
    // Clear existing content
    container.innerHTML = '';
    
    // Create chart container with axes
    const chartContainer = document.createElement('div');
    chartContainer.className = 'effectiveness-chart-container';
    chartContainer.style.position = 'relative';
    chartContainer.style.height = '100%';
    chartContainer.style.padding = '1rem 0';
    
    // X axis
    const xAxis = document.createElement('div');
    xAxis.className = 'x-axis';
    xAxis.style.position = 'absolute';
    xAxis.style.bottom = '1.5rem';
    xAxis.style.left = '0';
    xAxis.style.right = '0';
    xAxis.style.height = '1px';
    xAxis.style.backgroundColor = 'var(--neutral-200)';
    
    // Y axis
    const yAxis = document.createElement('div');
    yAxis.className = 'y-axis';
    yAxis.style.position = 'absolute';
    yAxis.style.top = '0';
    yAxis.style.bottom = '1.5rem';
    yAxis.style.left = '0';
    yAxis.style.width = '1px';
    yAxis.style.backgroundColor = 'var(--neutral-200)';
    
    // Grid lines
    for (let i = 1; i <= 3; i++) {
        const gridLine = document.createElement('div');
        gridLine.className = 'grid-line';
        gridLine.style.position = 'absolute';
        gridLine.style.left = '0';
        gridLine.style.right = '0';
        gridLine.style.height = '1px';
        gridLine.style.backgroundColor = 'var(--neutral-100)';
        gridLine.style.bottom = `${i * 25}%`;
        chartContainer.appendChild(gridLine);
    }
    
    // X axis labels
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const xLabels = document.createElement('div');
    xLabels.className = 'x-labels';
    xLabels.style.position = 'absolute';
    xLabels.style.bottom = '0';
    xLabels.style.left = '0';
    xLabels.style.right = '0';
    xLabels.style.display = 'flex';
    xLabels.style.justifyContent = 'space-between';
    xLabels.style.paddingLeft = '1rem';
    xLabels.style.paddingRight = '1rem';
    
    months.forEach(month => {
        const label = document.createElement('span');
        label.style.fontSize = '0.75rem';
        label.style.color = 'var(--neutral-500)';
        label.textContent = month;
        xLabels.appendChild(label);
    });
    
    // Line charts
    // Sample data points (normalized to 0-100)
    const explorerData = [70, 60, 80, 50, 20, 25];
    const thinkerData = [80, 70, 60, 65, 40, 40];
    
    // Create SVG for lines
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.right = '0';
    svg.style.bottom = '1.5rem';
    
    // Create explorer line
    const explorerPath = createLinePath(explorerData, 'var(--primary-500)');
    svg.appendChild(explorerPath);
    
    // Create thinker line
    const thinkerPath = createLinePath(thinkerData, 'var(--secondary-500)');
    svg.appendChild(thinkerPath);
    
    // Add legend
    const legend = document.createElement('div');
    legend.className = 'chart-legend';
    legend.style.position = 'absolute';
    legend.style.top = '0';
    legend.style.right = '0';
    legend.style.display = 'flex';
    legend.style.gap = '1rem';
    
    const personaTypes = ['Explorer', 'Thinker'];
    const colors = ['var(--primary-500)', 'var(--secondary-500)'];
    
    personaTypes.forEach((type, index) => {
        const legendItem = document.createElement('div');
        legendItem.style.display = 'flex';
        legendItem.style.alignItems = 'center';
        
        const colorLine = document.createElement('div');
        colorLine.style.width = '0.75rem';
        colorLine.style.height = '2px';
        colorLine.style.backgroundColor = colors[index];
        colorLine.style.marginRight = '0.25rem';
        
        const typeText = document.createElement('span');
        typeText.style.fontSize = '0.75rem';
        typeText.style.color = 'var(--neutral-600)';
        typeText.textContent = type;
        
        legendItem.appendChild(colorLine);
        legendItem.appendChild(typeText);
        legend.appendChild(legendItem);
    });
    
    chartContainer.appendChild(xAxis);
    chartContainer.appendChild(yAxis);
    chartContainer.appendChild(xLabels);
    chartContainer.appendChild(svg);
    chartContainer.appendChild(legend);
    
    container.appendChild(chartContainer);
}

function createLinePath(dataPoints, color) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Calculate points for the path
    let pathData = '';
    
    dataPoints.forEach((point, index) => {
        // Calculate x position (evenly spaced)
        const x = (index / (dataPoints.length - 1)) * 100;
        
        // Calculate y position (inverted, since SVG 0,0 is top-left)
        const y = 100 - point;
        
        // Start path or continue it
        if (index === 0) {
            pathData = `M${x},${y}`;
        } else {
            // Use a curve for smoother lines
            const prevX = ((index - 1) / (dataPoints.length - 1)) * 100;
            const prevY = 100 - dataPoints[index - 1];
            const cpX1 = prevX + ((x - prevX) / 3);
            const cpX2 = prevX + ((x - prevX) * 2 / 3);
            
            pathData += ` C${cpX1},${prevY} ${cpX2},${y} ${x},${y}`;
        }
    });
    
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    
    return path;
}

// Export dashboard functions
window.dashboard = {
    updateDashboardUI,
    initLDDashboard
};
