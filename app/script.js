const grid = document.getElementById("grid");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const levelEl = document.getElementById("level");
const startBtn = document.getElementById("start");
const highScoreEl = document.getElementById("highScore");
const comboEl = document.getElementById("combo");
const gameOverModal = document.getElementById("gameOverModal");
const playAgainBtn = document.getElementById("playAgain");
const finalScoreEl = document.getElementById("finalScore");
const finalLevelEl = document.getElementById("finalLevel");
const accuracyEl = document.getElementById("accuracy");
const bestComboEl = document.getElementById("bestCombo");

let score = 0;
let timeLeft = 30;
let level = 1;
let speed = 900;
let moleTimer;
let gameTimer;
let activeHoles = new Set();
let isGameRunning = false;
let highScore = localStorage.getItem("huntMoleHighScore") || 0;
let combo = 0;
let bestCombo = 0;
let hits = 0;
let misses = 0;

// Generate holes with moles
for (let i = 0; i < 9; i++) {
  const hole = document.createElement("div");
  hole.className = "hole";
  hole.innerHTML = `
    <div class="mole">
      <div class="mole-body">
        <div class="mole-eyes">
          <div class="eye"></div>
          <div class="eye"></div>
        </div>
        <div class="mole-nose"></div>
        <div class="mole-teeth">
          <div class="tooth"></div>
          <div class="tooth"></div>
        </div>
      </div>
    </div>
  `;
  grid.appendChild(hole);
}

const holes = document.querySelectorAll(".hole");
highScoreEl.textContent = highScore;

function randomHole() {
  if (!isGameRunning) return;
  
  // Remove a random active hole
  const activeArray = Array.from(activeHoles);
  if (activeArray.length > 0 && Math.random() > 0.5) {
    const removeHole = activeArray[Math.floor(Math.random() * activeArray.length)];
    removeHole.classList.remove("active");
    activeHoles.delete(removeHole);
  }
  
  // Add a new hole
  const availableHoles = Array.from(holes).filter(h => !activeHoles.has(h));
  if (availableHoles.length > 0) {
    const newHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
    newHole.classList.add("active");
    activeHoles.add(newHole);
    
    // Auto-hide after duration
    setTimeout(() => {
      if (newHole.classList.contains("active")) {
        newHole.classList.remove("active");
        activeHoles.delete(newHole);
        if (isGameRunning) {
          misses++;
          combo = 0;
          updateCombo();
        }
      }
    }, Math.max(400, speed - 200));
  }
}

function updateCombo() {
  if (combo > 0) {
    comboEl.textContent = `🔥 ${combo}x COMBO!`;
    comboEl.style.display = "block";
  } else {
    comboEl.textContent = "";
  }
  
  if (combo > bestCombo) {
    bestCombo = combo;
  }
}

function showScorePopup(hole, points) {
  const rect = hole.getBoundingClientRect();
  const gridRect = grid.getBoundingClientRect();
  const popup = document.createElement("div");
  popup.className = "score-popup";
  popup.textContent = `+${points}`;
  popup.style.position = "absolute";
  popup.style.left = (rect.left - gridRect.left + rect.width / 2) + "px";
  popup.style.top = (rect.top - gridRect.top + rect.height / 2) + "px";
  
  grid.appendChild(popup);
  
  setTimeout(() => {
    popup.remove();
  }, 1000);
}

function nextLevel() {
  level++;
  speed = Math.max(300, speed - 100);
  levelEl.textContent = level;
  
  // Visual feedback for level up
  levelEl.parentElement.style.animation = "none";
  setTimeout(() => {
    levelEl.parentElement.style.animation = "pulse 0.5s ease-in-out";
  }, 10);
}

function endGame() {
  isGameRunning = false;
  clearInterval(moleTimer);
  clearInterval(gameTimer);
  
  holes.forEach(h => {
    h.classList.remove("active");
  });
  activeHoles.clear();
  
  // Update high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("huntMoleHighScore", highScore);
    highScoreEl.textContent = highScore;
  }
  
  // Calculate accuracy
  const totalClicks = hits + misses;
  const accuracy = totalClicks > 0 ? Math.round((hits / totalClicks) * 100) : 0;
  
  // Show game over modal
  finalScoreEl.textContent = score;
  finalLevelEl.textContent = level;
  accuracyEl.textContent = accuracy + "%";
  bestComboEl.textContent = bestCombo + "x";
  
  gameOverModal.classList.add("show");
}

function startGame() {
  score = 0;
  level = 1;
  speed = 900;
  timeLeft = 30;
  combo = 0;
  bestCombo = 0;
  hits = 0;
  misses = 0;
  isGameRunning = true;
  
  scoreEl.textContent = score;
  levelEl.textContent = level;
  timeEl.textContent = timeLeft;
  comboEl.textContent = "";
  
  activeHoles.clear();
  holes.forEach(h => h.classList.remove("active"));
  
  clearInterval(moleTimer);
  clearInterval(gameTimer);
  
  startBtn.textContent = "Hunting...";
  startBtn.disabled = true;
  
  moleTimer = setInterval(randomHole, speed);
  
  gameTimer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    
    // Level up every 10 points
    if (score > 0 && score % 10 === 0 && score !== level * 10) {
      nextLevel();
      clearInterval(moleTimer);
      moleTimer = setInterval(randomHole, speed);
    }
    
    if (timeLeft === 0) {
      endGame();
      startBtn.textContent = "Start Hunt";
      startBtn.disabled = false;
    }
  }, 1000);
}

// Click handlers for holes
holes.forEach(hole => {
  hole.addEventListener("click", () => {
    if (!isGameRunning) return;
    
    if (activeHoles.has(hole)) {
      const mole = hole.querySelector(".mole");
      mole.classList.add("hit");
      
      setTimeout(() => {
        mole.classList.remove("hit");
      }, 300);
      
      hole.classList.remove("active");
      activeHoles.delete(hole);
      
      combo++;
      hits++;
      const points = combo > 1 ? 1 + Math.floor(combo / 3) : 1;
      score += points;
      scoreEl.textContent = score;
      
      updateCombo();
      showScorePopup(hole, points);
      
      // Score animation
      scoreEl.parentElement.style.animation = "none";
      setTimeout(() => {
        scoreEl.parentElement.style.animation = "pulse 0.5s ease-in-out";
      }, 10);
    }
  });
});

startBtn.addEventListener("click", startGame);

playAgainBtn.addEventListener("click", () => {
  gameOverModal.classList.remove("show");
  startGame();
});

// Close modal on click outside
gameOverModal.addEventListener("click", (e) => {
  if (e.target === gameOverModal) {
    gameOverModal.classList.remove("show");
    startBtn.disabled = false;
    startBtn.textContent = "Start Hunt";
  }
});
