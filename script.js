// === QUIZ QUESTIONS ===
const questions = [
  {
    question: "Which HTML tag is used for the largest heading?",
    answers: [
      { text: "&lt;h1&gt;", correct: true },
      { text: "&lt;h6&gt;", correct: false },
      { text: "&lt;p&gt;", correct: false },
      { text: "&lt;title&gt;", correct: false },
    ],
  },
  {
    question: "Which CSS property changes text color?",
    answers: [
      { text: "font-weight", correct: false },
      { text: "color", correct: true },
      { text: "background-color", correct: false },
      { text: "text-decoration", correct: false },
    ],
  },
  {
    question: "JavaScript runs in the ___",
    answers: [
      { text: "Database", correct: false },
      { text: "Browser", correct: true },
      { text: "Android OS only", correct: false },
      { text: "MS Word", correct: false },
    ],
  },
  {
    question: "Which HTML tag is used to create a hyperlink?",
    answers: [
      { text: "&lt;a&gt;", correct: true },
      { text: "&lt;link&gt;", correct: false },
      { text: "&lt;href&gt;", correct: false },
      { text: "&lt;p&gt;", correct: false },
    ],
  },
  {
    question: "Which CSS property controls text size?",
    answers: [
      { text: "font-size", correct: true },
      { text: "text-style", correct: false },
      { text: "text-size", correct: false },
      { text: "font-weight", correct: false },
    ],
  },
  {
    question: "Which HTML element inserts an image?",
    answers: [
      { text: "&lt;img&gt;", correct: true },
      { text: "&lt;image&gt;", correct: false },
      { text: "&lt;pic&gt;", correct: false },
      { text: "&lt;photo&gt;", correct: false },
    ],
  },
  {
    question: "What does CSS stand for?",
    answers: [
      { text: "Colorful Style Sheet", correct: false },
      { text: "Cascading Style Sheet", correct: true },
      { text: "Creative Style System", correct: false },
      { text: "Computer Styling Syntax", correct: false },
    ],
  },
  {
    question: "Which JavaScript keyword declares a variable?",
    answers: [
      { text: "var", correct: false },
      { text: "let", correct: true },
      { text: "const", correct: false },
      { text: "define", correct: false },
    ],
  },
  {
    question: "Which symbol is used for single-line comments in JavaScript?",
    answers: [
      { text: "//", correct: true },
      { text: "/* */", correct: false },
      { text: "&lt;!-- --&gt;", correct: false },
      { text: "#", correct: false },
    ],
  },
  {
    question: "Which method outputs data to the console in JavaScript?",
    answers: [
      { text: "console.log()", correct: true },
      { text: "print()", correct: false },
      { text: "display()", correct: false },
      { text: "echo()", correct: false },
    ],
  },
];

// === DOM ELEMENTS ===
const questionEl = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const timerEl = document.getElementById("timer");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const themeToggle = document.getElementById("theme-toggle");

// === STATE ===
let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let quizOver = false;

const TIME_PER_QUESTION = 15;
let timeRemaining = TIME_PER_QUESTION;
let timerInterval = null;
let hasAnswered = false;

// === UTILITIES ===
function shuffleArray(arr) {
  return arr
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

// === START QUIZ ===
function startQuiz() {
  shuffledQuestions = shuffleArray(questions);
  currentQuestionIndex = 0;
  score = 0;
  quizOver = false;
  nextButton.textContent = "Next";
  updateProgress();
  showQuestion();
}

// === RESET ===
function resetState() {
  nextButton.style.display = "none";
  answerButtons.innerHTML = "";
  clearInterval(timerInterval);
  timerInterval = null;
  hasAnswered = false;
}

// === SHOW QUESTION ===
function showQuestion() {
  resetState();

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionEl.innerHTML = `${currentQuestionIndex + 1}. ${
    currentQuestion.question
  }`;

  const shuffledAnswers = shuffleArray([...currentQuestion.answers]);

  shuffledAnswers.forEach((answer) => {
    const btn = document.createElement("button");
    btn.innerHTML = answer.text;
    btn.classList.add("btn");
    if (answer.correct) btn.dataset.correct = "true";
    btn.addEventListener("click", selectAnswer);
    answerButtons.appendChild(btn);
  });

  startTimer();
  updateProgress();
}

// === TIMER ===
function startTimer() {
  timeRemaining = TIME_PER_QUESTION;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      handleTimeUp();
    }
  }, 1000);
}

function updateTimerDisplay() {
  timerEl.textContent = `${timeRemaining}s`;
}

// === TIME UP ===
function handleTimeUp() {
  if (hasAnswered) return;
  hasAnswered = true;

  Array.from(answerButtons.children).forEach((btn) => {
    if (btn.dataset.correct === "true") btn.classList.add("correct");
    btn.disabled = true;
  });

  playWrongSound();
  nextButton.style.display = "block";
}

// === SELECT ANSWER ===
function selectAnswer(e) {
  if (hasAnswered) return;
  hasAnswered = true;

  clearInterval(timerInterval);
  timerInterval = null;

  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";

  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
    playCorrectSound();
  } else {
    selectedBtn.classList.add("wrong");
    playWrongSound();
  }

  Array.from(answerButtons.children).forEach((btn) => {
    if (btn.dataset.correct === "true") btn.classList.add("correct");
    btn.disabled = true;
  });

  nextButton.style.display = "block";
}

// === UPDATE PROGRESS ===
function updateProgress() {
  const total = shuffledQuestions.length;
  const current = currentQuestionIndex + 1;
  progressText.textContent = `Question ${current} of ${total}`;
  progressFill.style.width = `${(currentQuestionIndex / total) * 100}%`;
}

// === NEXT BUTTON ===
nextButton.addEventListener("click", () => {
  if (!quizOver) {
    currentQuestionIndex++;
    currentQuestionIndex < shuffledQuestions.length
      ? showQuestion()
      : showScore();
  } else {
    startQuiz();
  }
});

// === FINAL RESULTS ===
function showScore() {
  resetState();
  quizOver = true;

  const total = shuffledQuestions.length;
  const percent = Math.round((score / total) * 100);

  questionEl.innerHTML = `
    <h2 class="result-title">Quiz Completed!</h2>
    <p>You scored <b>${score}</b> out of <b>${total}</b> (${percent}%).</p>
    <div class="score-bar">
      <div class="score-fill" style="width: ${percent}%"></div>
    </div>
  `;

  progressText.textContent = "Quiz Completed";
  progressFill.style.width = "100%";
  timerEl.textContent = "";

  nextButton.textContent = "Restart";
  nextButton.style.display = "block";
}

// === SOUND EFFECTS ===
function playBeep(freq = 600, duration = 0.2) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.stop(ctx.currentTime + duration);
}

function playCorrectSound() {
  playBeep(900, 0.2);
}

function playWrongSound() {
  playBeep(200, 0.3);
}

// === DARK MODE ===
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", themeToggle.checked);
});

// INIT
startQuiz();
