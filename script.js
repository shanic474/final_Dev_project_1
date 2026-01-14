const holes = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("start");

let score = 0;
let timeLeft = 30;
let moleInterval;
let timerInterval;
let activeHole = null;

function randomHole() {
  holes.forEach(hole => hole.classList.remove("mole"));

  const index = Math.floor(Math.random() * holes.length);
  activeHole = holes[index];
  activeHole.classList.add("mole");
}

function startGame() {
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;

  moleInterval = setInterval(randomHole, 800);

  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(moleInterval);
      clearInterval(timerInterval);
      holes.forEach(hole => hole.classList.remove("mole"));
      alert(`Game Over! Your score: ${score}`);
    }
  }, 1000);
}

holes.forEach(hole => {
  hole.addEventListener("click", () => {
    if (hole === activeHole) {
      score++;
      scoreDisplay.textContent = score;
      hole.classList.remove("mole");
      activeHole = null;
    }
  });
});

startBtn.addEventListener("click", startGame);
