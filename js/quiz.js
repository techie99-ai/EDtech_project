// Quiz module for handling the persona assessment functionality
function initQuiz() {
    // Initialize quiz state
    const quizState = {
        currentStep: 1,
        totalSteps: 5,
        answers: {},
        quizStarted: false,
        quizCompleted: false,
        result: null
    };
    
    // Get quiz DOM elements
    const quizModal = document.getElementById('quiz-modal');
    const quizProgressBar = document.getElementById('quiz-progress-bar');
    const quizBackBtn = document.getElementById('quiz-back-btn');
    const quizNextBtn = document.getElementById('quiz-next-btn');
    const quizCloseBtn = document.getElementById('quiz-close-btn');
    const quizCloseResultsBtn = document.getElementById('quiz-close-results-btn');
    const quizSteps = document.querySelectorAll('.quiz-step');
    const quizResults = document.getElementById('quiz-results');
    const quizNavButtons = document.getElementById('quiz-nav-buttons');
    
    // Initialize quiz event listeners
    function setupQuizEventListeners() {
        // Quiz navigation buttons
        quizBackBtn.addEventListener('click', goToPreviousStep);
        quizNextBtn.addEventListener('click', goToNextStep);
        quizCloseBtn.addEventListener('click', closeQuiz);
        quizCloseResultsBtn.addEventListener('click', closeQuiz);
        
        // Quiz option selection
        quizSteps.forEach(step => {
            const inputs = step.querySelectorAll('input[type="radio"]');
            inputs.forEach(input => {
                input.addEventListener('change', () => {
                    // Store the answer
                    const questionNumber = step.getAttribute('data-step');
                    quizState.answers[questionNumber] = input.value;
                    
                    // Enable next button if an option is selected
                    quizNextBtn.classList.remove('disabled');
                });
            });
        });
        
        // Signup prompt buttons in results
        const signupPrompt = document.getElementById('signup-prompt');
        if (signupPrompt) {
            const promptButtons = signupPrompt.querySelectorAll('[data-action]');
            promptButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const action = button.getAttribute('data-action');
                    closeQuiz();
                    window.app.navigateToPage(action);
                });
            });
        }
    }
    
    // Quiz step navigation
    function goToNextStep() {
        if (quizState.currentStep < quizState.totalSteps) {
            // If current step has no selection, disable button
            const currentStepEl = document.querySelector(`.quiz-step[data-step="${quizState.currentStep}"]`);
            const hasSelection = currentStepEl.querySelector('input[type="radio"]:checked');
            
            if (!hasSelection) {
                window.app.showMessage('Please select an option to continue', 'error');
                return;
            }
            
            // Move to next step
            quizState.currentStep++;
            updateQuizUI();
        } else {
            completeQuiz();
        }
    }
    
    function goToPreviousStep() {
        if (quizState.currentStep > 1) {
            quizState.currentStep--;
            updateQuizUI();
        }
    }
    
    // Update quiz UI based on current state
    function updateQuizUI() {
        // Update progress bar
        const progress = ((quizState.currentStep - 1) / quizState.totalSteps) * 100;
        quizProgressBar.style.width = `${progress}%`;
        
        // Show current step, hide others
        quizSteps.forEach(step => {
            step.classList.remove('active');
        });
        
        const currentStep = document.querySelector(`.quiz-step[data-step="${quizState.currentStep}"]`);
        if (currentStep) {
            currentStep.classList.add('active');
        }
        
        // Update back button state
        if (quizState.currentStep === 1) {
            quizBackBtn.classList.add('disabled');
        } else {
            quizBackBtn.classList.remove('disabled');
        }
        
        // Update next button text
        if (quizState.currentStep === quizState.totalSteps) {
            quizNextBtn.innerHTML = 'See Results <i class="fas fa-chart-pie"></i>';
        } else {
            quizNextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
        }
        
        // Check if current step has a selection and enable/disable next button
        const stepEl = document.querySelector(`.quiz-step[data-step="${quizState.currentStep}"]`);
        const hasSelection = stepEl.querySelector('input[type="radio"]:checked');
        
        if (hasSelection) {
            quizNextBtn.classList.remove('disabled');
        } else {
            quizNextBtn.classList.add('disabled');
        }
    }
    
    // Complete quiz and show results
    function completeQuiz() {
        quizState.quizCompleted = true;
        
        // Calculate result based on answers (simplified for this demo)
        determinePersona();
        
        // Update UI to show results
        quizProgressBar.style.width = '100%';
        
        // Hide all steps and show results
        quizSteps.forEach(step => {
            step.classList.remove('active');
        });
        quizResults.classList.add('active');
        
        // Hide navigation buttons, show close button
        quizNavButtons.style.display = 'none';
        quizCloseResultsBtn.style.display = 'block';
        
        // If user is logged in, update their persona
        if (window.app.isUserLoggedIn()) {
            updateUserPersona(quizState.result);
            document.getElementById('signup-prompt').style.display = 'none';
        }
    }
    
    // Determine persona based on quiz answers
    function determinePersona() {
        // In a real application, this would use a more sophisticated algorithm
        // For this demo, we'll always return "The Explorer"
        quizState.result = "The Explorer";
        
        // You could extend this with different personas based on the most common answers
        // const answerCounts = {};
        // Object.values(quizState.answers).forEach(answer => {
        //     answerCounts[answer] = (answerCounts[answer] || 0) + 1;
        // });
        // 
        // let maxCount = 0;
        // let dominantType = null;
        // 
        // for (const [type, count] of Object.entries(answerCounts)) {
        //     if (count > maxCount) {
        //         maxCount = count;
        //         dominantType = type;
        //     }
        // }
        // 
        // const personaMap = {
        //     '1': 'The Thinker',
        //     '2': 'The Explorer',
        //     '3': 'The Creator',
        //     '4': 'The Connector'
        // };
        // 
        // quizState.result = personaMap[dominantType] || 'The Explorer';
    }
    
    // Update user persona in localStorage
    function updateUserPersona(persona) {
        const userData = localStorage.getItem('learningPersonaUser');
        
        if (userData) {
            try {
                const parsedData = JSON.parse(userData);
                
                if (parsedData.currentUser) {
                    parsedData.currentUser.persona = persona;
                    localStorage.setItem('learningPersonaUser', JSON.stringify(parsedData));
                    
                    // Update UI if on dashboard
                    if (document.getElementById('dashboard-page').classList.contains('active')) {
                        updateDashboardUI(parsedData.currentUser);
                    }
                }
            } catch (e) {
                console.error('Error updating user persona:', e);
            }
        }
    }
    
    // Open quiz modal
    function openQuiz() {
        // Reset quiz state
        quizState.currentStep = 1;
        quizState.quizCompleted = false;
        quizState.answers = {};
        
        // Reset UI
        quizModal.classList.add('active');
        quizNavButtons.style.display = 'flex';
        quizCloseResultsBtn.style.display = 'none';
        quizResults.classList.remove('active');
        
        // Show first step
        quizSteps.forEach(step => {
            step.classList.remove('active');
        });
        quizSteps[0].classList.add('active');
        
        // Reset progress bar
        quizProgressBar.style.width = '0%';
        
        // Disable back button on first step
        quizBackBtn.classList.add('disabled');
        
        // Reset next button text
        quizNextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
        
        // Reset radio button selections
        document.querySelectorAll('.quiz-option input[type="radio"]').forEach(input => {
            input.checked = false;
        });
        
        // Disable next button until selection is made
        quizNextBtn.classList.add('disabled');
        
        // Show/hide signup prompt based on login status
        if (window.app.isUserLoggedIn()) {
            document.getElementById('signup-prompt').style.display = 'none';
        } else {
            document.getElementById('signup-prompt').style.display = 'block';
        }
        
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    // Close quiz modal
    function closeQuiz() {
        quizModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        if (quizState.quizCompleted && window.app.isUserLoggedIn()) {
            window.app.navigateToPage('dashboard');
        }
    }
    
    // Setup quiz initialization
    setupQuizEventListeners();
    
    // Return public API
    return {
        openQuiz: openQuiz,
        closeQuiz: closeQuiz
    };
}

// Start the quiz (called from main script)
function startQuiz() {
    const quizModule = initQuiz();
    quizModule.openQuiz();
}

// Export quiz functionality
window.quiz = {
    startQuiz
};
