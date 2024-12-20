export function renderQuestion(question) {
    const questionContainer = document.querySelector(`#question-${question.id}-content`);
    questionContainer.innerHTML = `
        <div class="container">
            <h3 class="mt-3">${question.text}</h3>
            <div class="answers">
                ${question.answers.map((answer, index) => `
                    <div class="form-check">
                        <input 
                            class="form-check-input" 
                            type="radio" 
                            name="question${question.id}" 
                            id="answer${question.id}-${index}"
                            value="${index}"
                        >
                        <label class="form-check-label" for="answer${question.id}-${index}">
                            ${answer.text}
                        </label>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}