import { initializeQuiz } from './services/QuizService.js';
import { initializeResults } from './services/ResultService.js';
import { renderQuestion } from './components/QuestionRenderer.js';
import { setupQuizNavigation } from './components/QuizNavigation.js';

document.addEventListener('DOMContentLoaded', () => {
    const quizData = initializeQuiz();
    const resultData = initializeResults();
    
    setupQuizNavigation(quizData, resultData, renderQuestion);
});