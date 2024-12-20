export function createCorrectionService(quizService) {
    let userAnswers = [];

    function saveUserAnswer(questionId, selectedAnswerId) {
        // Supprimer toute réponse précédente pour cette question
        userAnswers = userAnswers.filter(answer => answer.questionId !== questionId);
        
        // Ajouter la nouvelle réponse
        userAnswers.push({
            questionId: questionId,
            selectedAnswerId: selectedAnswerId
        });
    }

    function generateCorrectionReport() {
        const report = {
            totalQuestions: quizService.questions.length,
            correctAnswers: 0,
            incorrectAnswers: 0,
            details: []
        };

        quizService.questions.forEach(question => {
            const userAnswer = userAnswers.find(a => a.questionId === question.id);
            
            if (userAnswer) {
                const selectedAnswer = question.answers.find(a => 
                    question.answers.indexOf(a) === userAnswer.selectedAnswerId
                );

                const correctionDetail = {
                    questionId: question.id,
                    questionText: question.text,
                    userSelectedAnswer: selectedAnswer ? selectedAnswer.text : "Non répondu",
                    isCorrect: selectedAnswer ? selectedAnswer.isCorrect : false,
                    correctAnswer: question.answers.find(a => a.isCorrect).text
                };

                if (correctionDetail.isCorrect) {
                    report.correctAnswers++;
                } else {
                    report.incorrectAnswers++;
                }

                report.details.push(correctionDetail);
            } else {
                // Question non répondue
                report.incorrectAnswers++;
                report.details.push({
                    questionId: question.id,
                    questionText: question.text,
                    userSelectedAnswer: "Non répondu",
                    isCorrect: false,
                    correctAnswer: question.answers.find(a => a.isCorrect).text
                });
            }
        });

        return report;
    }

    function generateCorrectionHTML(report) {
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
                        <span>Question ${detail.questionId}</span>
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

    function getExplanation(userAnswer, correctAnswer) {
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

    return {
        saveUserAnswer,
        generateCorrectionReport,
        generateCorrectionHTML
    };
}