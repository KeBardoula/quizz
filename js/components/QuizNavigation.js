import * as CorrectionService from '../services/CorrectionService.js';

export function setupQuizNavigation(quizService, resultService, questionRenderer) {
    let currentStep = 1;
    const totalSteps = quizService.questions.length;
    const correctionService = {
        saveUserAnswer: (questionId, selectedAnswerId) => {
            // Logique de sauvegarde de la réponse
        },
        generateCorrectionReport: () => {
            // Logique de génération du rapport de correction
        },
        generateCorrectionHTML: (report) => {
            // Logique de génération du HTML de correction
        }
    };

    function initializeNavigation() {
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('previous-btn');
        const restartBtn = document.getElementById('restart-btn');
        
        nextBtn.addEventListener('click', goToNextStep);
        prevBtn.addEventListener('click', goToPreviousStep);
        restartBtn.addEventListener('click', restartQuiz);
    
        restartBtn.style.display = 'none';
    
        updateNavigationState();
        renderCurrentQuestion();
    }

    function initEventListeners() {
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const questionId = parseInt(e.target.closest('.question-container').dataset.questionId);
                const selectedAnswerId = Array.from(e.target.closest('.question-container').querySelectorAll('.answer-btn')).indexOf(e.target);
                
                correctionService.saveUserAnswer(questionId, selectedAnswerId);
            });
        });

        document.getElementById('correction-btn').addEventListener('click', () => {
            const report = correctionService.generateCorrectionReport();
            const correctionHTML = correctionService.generateCorrectionHTML(report);
            
            const modalBody = document.querySelector('#correctionModal .modal-body');
            modalBody.innerHTML = correctionHTML;
            
            $('#correctionModal').modal('show');
        });
    }

    function loadSavedAnswers() {
        for (let step = 1; step <= totalSteps; step++) {
            const savedAnswer = sessionStorage.getItem(`question-${step}-answer`);
            if (savedAnswer !== null) {
                const radioButton = document.querySelector(`input[name="question${step}"][value="${savedAnswer}"]`);
                if (radioButton) {
                    radioButton.checked = true;
                }
            }
        }
    }

    function goToNextStep() {
        if (currentStep <= totalSteps) {
            const currentQuestion = quizService.getQuestionById(currentStep);
            const selectedAnswer = document.querySelector(`input[name="question${currentStep}"]:checked`);
    
            if (selectedAnswer) {
                sessionStorage.setItem(`question-${currentStep}-answer`, selectedAnswer.value);
    
                const answer = currentQuestion.answers[selectedAnswer.value];
                resultService.addAnswer(answer);
                
                updateProgressBar(currentStep);
                
                currentStep++;
                updateNavigationState();
                renderCurrentQuestion();
    
                if (currentStep <= totalSteps) {
                    const nextTabButton = document.getElementById(`question-${currentStep}-tab`);
                    const currentTabButton = document.getElementById(`question-${currentStep - 1}-tab`);
                    
                    if (nextTabButton) {
                        nextTabButton.disabled = false;
                        nextTabButton.click();
                    }
                    
                    if (currentTabButton) {
                        currentTabButton.classList.remove('active');
                    }
                }
    
                if (currentStep > totalSteps) {
                    const resultsTab = document.getElementById('results-tab');
                    const restartBtn = document.getElementById('restart-btn');
                    const nextBtn = document.getElementById('next-btn');
                    const prevBtn = document.getElementById('previous-btn');
                    
                    if (nextBtn) nextBtn.style.display = 'none';
                    if (prevBtn) prevBtn.style.display = 'none';
                    
                    if (resultsTab) {
                        resultsTab.click();
                        resultService.generateResultChart();
                    }
    
                    if (restartBtn) {
                        restartBtn.style.display = 'block';
                    }
                }
            } else {
                alert("Veuillez répondre à la question actuelle avant de passer à la suivante.");
            }
        }
    }

    function goToPreviousStep() {
        if (currentStep > 1) {
            currentStep--;
            updateNavigationState();
            renderCurrentQuestion();

            const prevTabButton = document.getElementById(`question-${currentStep}-tab`);
            const currentTabButton = document.getElementById(`question-${currentStep + 1}-tab`);
            
            if (prevTabButton) {
                prevTabButton.click();
            }
            
            if (currentTabButton) {
                currentTabButton.classList.remove('active');
            }
        }
    }

    function renderCurrentQuestion() {
        const currentQuestion = quizService.getQuestionById(currentStep);
        
        if (!currentQuestion) {
            console.error(`No question found for step ${currentStep}`);
            return;
        }
    
        questionRenderer(currentQuestion);
        
        const savedAnswer = sessionStorage.getItem(`question-${currentStep}-answer`);
        if (savedAnswer !== null) {
            const radioButton = document.querySelector(`input[name="question${currentStep}"][value="${savedAnswer}"]`);
            if (radioButton) {
                radioButton.checked = true;
            }
        }
    }

    function updateProgressBar(completedStep) {
        const progressBar = document.querySelector('.progress-bar');
        const percentage = Math.round((completedStep / totalSteps) * 100);
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${percentage}%`;
    }

    function updateNavigationState() {
        document.getElementById('previous-btn').disabled = currentStep === 1;
        document.getElementById('next-btn').disabled = currentStep > totalSteps;
    }

    function restartQuiz() {
        resultService.resetQuiz();
    
        currentStep = 1;
        updateNavigationState();
        renderCurrentQuestion();
    
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('previous-btn');
        const restartBtn = document.getElementById('restart-btn');
    
        nextBtn.style.display = 'block';
        prevBtn.style.display = 'block';
        restartBtn.style.display = 'none';
    
        updateProgressBar(0);
    
        const firstTab = document.getElementById('question-1-tab');
        const resultsTab = document.getElementById('results-tab');
    
        if (firstTab) {
            firstTab.click();
            firstTab.classList.add('active');
        }
    
        if (resultsTab) {
            resultsTab.classList.remove('active');
        }
    
        for (let i = 2; i <= totalSteps; i++) {
            const tabButton = document.getElementById(`question-${i}-tab`);
            if (tabButton) { 
                tabButton.disabled = true;
            }
        }
    
        for (let step = 1; step <= totalSteps; step++) {
            const radioButtons = document.querySelectorAll(`input[name="question${step}"]`);
            radioButtons.forEach(radio => {
                radio.checked = false;
            });
        }
    
        const resultsContent = document.getElementById('results-content');
        resultsContent.innerHTML = `
            <div id="chart-container" style="width: 50%; margin: auto; text-align: center;">
                <canvas id="my-chart" width="400" height="400"></canvas>
            </div>
        `;
    
        sessionStorage.clear();
    }

    initializeNavigation();
    loadSavedAnswers();
}

// Appel de la fonction pour initialiser la navigation
setupQuizNavigation(quizService, resultService, questionRenderer);