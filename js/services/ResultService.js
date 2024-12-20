export function initializeResults() {
    return {
        answers: [],
        chart: null
    };
}

export function addAnswer(resultData, answer) {
    const existingAnswer = resultData.answers.find(a => 
        a.text === answer.text && a.isCorrect === answer.isCorrect
    );

    if (!existingAnswer) {
        resultData.answers.push(answer);
    }
}

export function generateResultChart(resultData) {
    const correctAnswers = resultData.answers.filter(answer => answer.isCorrect).length;
    const incorrectAnswers = resultData.answers.length - correctAnswers;

    const chartContainer = document.getElementById('chart-container');
    if (!chartContainer) {
        console.error('Chart container not found');
        return;
    }

    chartContainer.innerHTML = `
        <canvas id="my-chart" width="400" height="400"></canvas>
        <button id="center-correction-btn" class="btn btn-primary mt-3">
            <i class="bi bi-journal-text me-2"></i>Voir la correction
        </button>
    `;

    const correctionBtn = document.getElementById('center-correction-btn');
    if (correctionBtn) {
        correctionBtn.addEventListener('click', () => {
            const report = generateCorrectionReport(resultData);
            const modalBody = document.querySelector('#correctionModal .modal-body');
            modalBody.innerHTML = generateCorrectionHTML(report);
            
            const correctionModal = new bootstrap.Modal(document.getElementById('correctionModal'));
            correctionModal.show();
        });
    }

    const ctx = document.getElementById('my-chart');
    if (!ctx) {
        console.error('Canvas not found');
        return;
    }

    if (resultData.chart) {
        resultData.chart.destroy();
    }

    resultData.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Bonnes réponses', 'Mauvaises réponses'],
            datasets: [{
                label: 'Résultats du Quiz',
                data: [correctAnswers, incorrectAnswers],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Résultats du Quiz (${correctAnswers}/${resultData.answers.length})`,
                    font: {
                        size: 18
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const value = context.parsed;
                            const percentage = ((value / total) * 100).toFixed(2);
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

export function generateCorrectionReport(resultData) {
    return {
        totalQuestions: resultData.answers.length,
        correctAnswers: resultData.answers.filter(a => a.isCorrect).length,
        incorrectAnswers: resultData.answers.filter(a => !a.isCorrect).length,
        details: resultData.answers.map((answer, index) => ({
            questionId: index + 1,
            questionText: "Question " + (index + 1),
            userSelectedAnswer: answer.text,
            isCorrect: answer.isCorrect,
            correctAnswer: answer.isCorrect ? answer.text : answer.isCorrect == true
        }))
    };
}

export function resetQuiz(resultData) {
    resultData.answers = [];
    if (resultData.chart) {
        resultData.chart.destroy();
    }
}

export function getFinalScore(resultData) {
    const correctAnswers = resultData.answers.filter(answer => answer.isCorrect).length;
    return {
        total: resultData.answers.length,
        correct: correctAnswers,
        incorrect: resultData.answers.length - correctAnswers,
        percentage: ((correctAnswers / resultData.answers.length) * 100).toFixed(2)
    };
}

export function generateCorrectionHTML(report) {
    let html = `
        <div class="correction-summary">
            <h2>Résultats de votre quiz</h2>
            <div class="summary-stats">
                <p>Total des questions : ${report.totalQuestions}</p>
                <p class="text-success">Bonnes réponses : ${report.correctAnswers}</p>
                <p class="text-danger">Mauvaises réponses : ${report.incorrectAnswers}</p>
                <p>Score : ${Math.round((report.correctAnswers / report.totalQuestions) * 100)}%</p>
            </div>
            <div class="correction-details">
                <h3>Détail des questions</h3>
    `;

    report.details.forEach((detail, index) => {
        html += `
            <div class="card mb-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Question ${index + 1}</span>
                    ${detail.isCorrect ? 
                        '<span class="badge bg-success">Correct</span>' : 
                        '<span class="badge bg-danger">Incorrect</span>'
                    }
                </div>
                <div class="card-body">
                    <p><strong>Question :</strong> ${detail.questionText}</p>
                    <p><strong>Votre réponse :</strong> 
                        <span class="${detail.isCorrect ? 'text-success' : 'text-danger'}">
                            ${detail.userSelectedAnswer}
                        </span>
                    </p>
                    <p><strong>Réponse correcte :</strong> 
                        <span class="text-success">${detail.correctAnswer}</span>
                    </p>
                    
                    ${!detail.isCorrect ? `
                        <div class="accordion" id="explanationAccordion${index}">
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingExplanation${index}">
                                    <button class="accordion-button collapsed" type="button" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target="#collapseExplanation${index}" 
                                            aria-expanded="false" 
                                            aria-controls="collapseExplanation${index}">
                                        Voir l'explication
                                    </button>
                                </h2>
                                <div id="collapseExplanation${index}" 
                                     class="accordion-collapse collapse" 
                                     aria-labelledby="headingExplanation${index}"
                                     data-bs-parent="#explanationAccordion${index}">
                                    <div class="accordion-body">
                                        <div class="alert alert-info">
                                            ${getExplanation(detail.userSelectedAnswer, detail.correctAnswer)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

export function getExplanation(userAnswer, correctAnswer) {
    const explanations = {
        "JavaScript": "JavaScript est considéré comme le langage le plus populaire en raison de sa polyvalence, de son utilisation dans le développement web front-end et back-end, et de son écosystème riche.",
        "Document Object Model": "Le DOM (Document Object Model) est une interface de programmation qui représente la structure d'un document HTML ou XML comme un arbre de nœuds, permettant aux programmes de manipuler dynamiquement le contenu, la structure et le style.",
        "getElementById()": "getElementById() est une méthode native du DOM qui permet de sélectionner un élément HTML unique en utilisant son attribut ID, ce qui le rend plus performant que d'autres méthodes de sélection.",
        "Une action déclenchée par l'utilisateur": "En JavaScript, un événement est une action ou un fait qui se produit dans le système que le programme peut détecter et gérer, comme un clic de souris, une frappe au clavier, etc.",
        "Advanced JavaScript And XML": "AJAX permet de mettre à jour des parties d'une page web sans recharger toute la page, améliorant ainsi l'expérience utilisateur et la réactivité des applications web.",
        "const": "const déclare une constante dont la valeur ne peut pas être réassignée, contrairement à let et var. C'est une bonne pratique pour déclarer des valeurs qui ne changeront pas.",
        "Une syntaxe moderne de fonction": "Les fonctions fléchées (arrow functions) offrent une syntaxe plus concise, préservent le contexte de 'this', et sont particulièrement utiles pour les fonctions courtes et les callbacks.",
        "Un stockage de données dans le navigateur": "localStorage permet de stocker des données côté client de manière permanente, contrairement à sessionStorage qui efface les données à la fermeture du navigateur.",
        "JavaScript Object Notation": "JSON est un format léger d'échange de données, facile à lire et à écrire pour les humains, et facile à parser et générer pour les machines.",
        "Un objet représentant une opération asynchrone": "Les Promises en JavaScript permettent de gérer des opérations asynchrones de manière plus élégante et lisible, évitant le problème du 'callback hell'."
    };

    return explanations[correctAnswer] || 
        `La réponse "${correctAnswer}" est correcte. Pour plus de détails, consultez la documentation ou demandez à votre formateur.`;
}