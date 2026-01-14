const holes = document.querySelectorAll(".hole");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const levelEl = document.getElementById("level");
const startBtn = document.getElementById("start");

let score = 0;
let timeLeft = 30;
let level = 1;
let speed = 900;
let moleTimer;
let gameTimer;
let activeHole = null;

function randomHole() {
  holes.forEach(hole => hole.classList.remove("active"));

  const index = Math.floor(Math.random() * holes.length);
  activeHole = holes[index];
  activeHole.classList.add("active");

  setTimeout(() => {
    activeHole?.classList.remove("active");
    activeHole = null;
  }, speed - 100);
}

function nextLevel() {
  level++;
  speed = Math.max(300, speed - 120); // increase difficulty
  levelEl.textContent = level;

  clearInterval(moleTimer);
  moleTimer = setInterval(randomHole, speed);
}

function startGame() {
  score = 0;
  level = 1;
  speed = 900;
  timeLeft = 30;

  scoreEl.textContent = score;
  levelEl.textContent = level;
  timeEl.textContent = timeLeft;

  clearInterval(moleTimer);
  clearInterval(gameTimer);

  moleTimer = setInterval(randomHole, speed);

  gameTimer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;

    if (score !== 0 && score % 10 === 0) {
      nextLevel();
    }

    if (timeLeft === 0) {
      clearInterval(moleTimer);
      clearInterval(gameTimer);
      holes.forEach(h => h.classList.remove("active"));
      alert(`Game Over!\nScore: ${score}\nLevel: ${level}`);
    }
  }, 1000);
}

holes.forEach(hole => {
  hole.addEventListener("click", () => {
    if (hole === activeHole) {
      score++;
      scoreEl.textContent = score;
      hole.classList.remove("active");
      activeHole = null;
    }
  });
});

startBtn.addEventListener("click", startGame);
