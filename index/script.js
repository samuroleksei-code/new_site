let questions = [];

function addQuestion() {
    const q = questionText.value;
    const answers = [a1.value, a2.value, a3.value, a4.value];
    const type = questionType.value;
    const correctInput = correct.value;

    if (!q || answers.some(a => !a) || !correctInput) {
        alert("Заповніть усі поля");
        return;
    }

    const correctIndexes = correctInput
        .split(',')
        .map(n => Number(n.trim()) - 1);

    if (
        correctIndexes.some(i => i < 0 || i > 3) ||
        (type === "single" && correctIndexes.length !== 1)
    ) {
        alert("Невірні правильні відповіді");
        return;
    }

    questions.push({
        question: q,
        answers,
        correct: correctIndexes,
        type
    });

    questionText.value = "";
    a1.value = a2.value = a3.value = a4.value = "";
    correct.value = "";

    alert("Питання додано");
}


function startTest() {
    if (questions.length === 0) {
        alert("Додайте хоча б одне питання");
        return;
    }

    builder.classList.add("hidden");
    test.classList.remove("hidden");
    showTitle.innerText = testTitle.value;
    testArea.innerHTML = "";

    questions.forEach((q, i) => {
        const div = document.createElement("div");
        div.className = "question";

        const inputType = q.type === "single" ? "radio" : "checkbox";

        div.innerHTML =
            `<p>${q.question}</p>` +
            q.answers.map((a, j) =>
                `<label>
                    <input type="${inputType}" name="q${i}" value="${j}">
                    ${a}
                </label>`
            ).join("");

        testArea.appendChild(div);
    });
}


function checkTest() {
    let score = 0;

    questions.forEach((q, i) => {
        const selected = Array.from(
            document.querySelectorAll(`input[name="q${i}"]:checked`)
        ).map(el => Number(el.value));

        if (selected.sort().join() === q.correct.sort().join()) {
            score++;
        }
    });

    alert(`Ваш результат: ${score} з ${questions.length}`);
}

function backToBuilder() {
    test.classList.add("hidden");
    builder.classList.remove("hidden");

    document
        .querySelectorAll("#test input")
        .forEach(el => el.checked = false);
}


function saveTest() {
    if (questions.length === 0) {
        alert("Немає що зберігати");
        return;
    }

    const data = {
        title: testTitle.value,
        questions
    };

    const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
    );

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "test.json";
    link.click();
}


function loadTest(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const data = JSON.parse(reader.result);
        testTitle.value = data.title;
        questions = data.questions;
        alert("Тест завантажено");
    };
    reader.readAsText(file);
}
