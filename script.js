const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let speed = 2;
let balloons = [];
let score = 0;
let gameInterval, spawnInterval, timerInterval;
let timeRemaining = 0;

const flagData = {
  "India": "https://flagcdn.com/w320/in.png",
  "USA": "https://flagcdn.com/w320/us.png",
  "Japan": "https://flagcdn.com/w320/jp.png",
  "Germany": "https://flagcdn.com/w320/de.png",
  "France": "https://flagcdn.com/w320/fr.png",
  "Brazil": "https://flagcdn.com/w320/br.png"
};

function spawnBalloon() {
  const selected = Array.from(document.getElementById("countrySelect").selectedOptions)
                        .map(opt => opt.value);
  if (selected.length === 0) return;
  const country = selected[Math.floor(Math.random() * selected.length)];
  balloons.push({
    img: flagData[country],
    country: country,
    x: Math.random() * 300,
    y: 600
  });
}

function draw() {
  ctx.clearRect(0, 0, 400, 600);
  balloons.forEach(b => {
    let flag = new Image();
    flag.src = b.img;
    ctx.drawImage(flag, b.x, b.y, 50, 30);
    b.y -= speed;
  });
}

document.getElementById("input").addEventListener("input", e => {
  let text = e.target.value.trim().toLowerCase();
  balloons = balloons.filter(b => {
    if (text === b.country.toLowerCase()) {
      e.target.value = "";
      score++;
      document.getElementById("scoreDisplay").textContent = "Score: " + score;
      return false; // burst balloon
    }
    return true;
  });
});

document.getElementById("speedControl").addEventListener("input", e => {
  speed = parseInt(e.target.value);
});

document.getElementById("startBtn").addEventListener("click", () => {
  // Reset game
  balloons = [];
  score = 0;
  document.getElementById("scoreDisplay").textContent = "Score: 0";

  // Set timer
  let minutes = parseInt(document.getElementById("timeLimit").value);
  timeRemaining = minutes * 60;

  // Clear old intervals
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  clearInterval(timerInterval);

  // Start game loop
  gameInterval = setInterval(draw, 50);
  spawnInterval = setInterval(spawnBalloon, 1500); // spawn every 1.5s
  timerInterval = setInterval(() => {
    timeRemaining--;
    let min = Math.floor(timeRemaining / 60);
    let sec = timeRemaining % 60;
    document.getElementById("timerDisplay").textContent = 
      `Time Left: ${min}:${sec.toString().padStart(2,"0")}`;

    if (timeRemaining <= 0) {
      clearInterval(gameInterval);
      clearInterval(spawnInterval);
      clearInterval(timerInterval);
      alert("⏰ Time's up! Final Score: " + score);
    }
  }, 1000);
});
