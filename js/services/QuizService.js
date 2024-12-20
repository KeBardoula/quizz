export function initializeQuiz() {
    return {
        questions: [
            {
                id: 1,
                text: "Quel est le langage de programmation le plus populaire en 2024 ?",
                answers: [
                    { text: "JavaScript", isCorrect: true },
                    { text: "Python", isCorrect: false },
                    { text: "Java", isCorrect: false },
                    { text: "C++", isCorrect: false }
                ]
            },
            {
                id: 2,
                text: "Qu'est-ce que le DOM ?",
                answers: [
                    { text: "Document Object Model", isCorrect: true },
                    { text: "Data Object Management", isCorrect: false },
                    { text: "Digital Object Manipulation", isCorrect: false },
                    { text: "Dynamic Object Method", isCorrect: false }
                ]
            },
            {
                id: 3,
                text: "Quelle méthode permet de sélectionner un élément par son ID ?",
                answers: [
                    { text: "querySelector()", isCorrect: false },
                    { text: "getElementsByClassName()", isCorrect: false },
                    { text: "getElementById()", isCorrect: true },
                    { text: "findElement()", isCorrect: false }
                ]
            },
            {
                id: 4,
                text: "Qu'est-ce qu'un événement en JavaScript ?",
                answers: [
                    { text: "Une fonction qui se répète", isCorrect: false },
                    { text: "Une action déclenchée par l'utilisateur", isCorrect: true },
                    { text: "Une variable globale", isCorrect: false },
                    { text: "Un type de donnée", isCorrect: false }
                ]
            },
            {
                id: 5,
                text: "Que signifie l'acronyme AJAX ?",
                answers: [
                    { text: "Advanced JavaScript And XML", isCorrect: true },
                    { text: "Asynchronous JavaScript And XML", isCorrect: false },
                    { text: "Automated JavaScript And XML", isCorrect: false },
                    { text: "Advanced JSON And XML", isCorrect: false }
                ]
            },
            {
                id: 6,
                text: "Comment déclarer une constante en JavaScript ?",
                answers: [
                    { text: "let", isCorrect: false },
                    { text: "var", isCorrect: false },
                    { text: "const", isCorrect: true },
                    { text: "variable", isCorrect: false }
                ]
            },
            {
                id: 7,
                text: "Qu'est-ce qu'une fonction fléchée ?",
                answers: [
                    { text: "Une fonction qui retourne une flèche", isCorrect: false },
                    { text: "Une syntaxe moderne de fonction", isCorrect: true },
                    { text: "Une fonction de dessin", isCorrect: false },
                    { text: "Une fonction complexe", isCorrect: false }
                ]
            },
            {
                id: 8,
                text: "Qu'est-ce que le localStorage ?",
                answers: [
                    { text: "Un système de stockage côté serveur", isCorrect: false },
                    { text: "Un système de stockage temporaire", isCorrect: false },
                    { text: "Un stockage de données dans le navigateur", isCorrect: true },
                    { text: "Un type de base de données", isCorrect: false }
                ]
            },
            {
                id: 9,
                text: "Qu'est-ce que le JSON ?",
                answers: [
                    { text: "JavaScript Object Notation", isCorrect: true },
                    { text: "JavaScript Online Network", isCorrect: false },
                    { text: "Java Structured Object Notation", isCorrect: false },
                    { text: "JavaScript Object Navigation", isCorrect: false }
                ]
            },
            {
                id: 10,
                text: "Qu'est-ce qu'une promesse (Promise) en JavaScript ?",
                answers: [
                    { text: "Un engagement verbal", isCorrect: false },
                    { text: "Un objet représentant une opération asynchrone", isCorrect: true },
                    { text: "Un type de fonction", isCorrect: false },
                    { text: "Un gestionnaire d'événements", isCorrect: false }
                ]
            }
        ],
        getQuestionById(id) {
            return this.questions.find(q => q.id === id);
        }
    };
}

export function getQuestionById(quizData, id) {
    return quizData.questions.find(q => q.id === id);
}