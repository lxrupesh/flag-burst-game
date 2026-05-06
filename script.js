const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let speed = 2;
let balloons = [];
let score = 0;
let gameInterval, spawnInterval, timerInterval;
let timeRemaining = 0;

// Example: populate dropdown with all countries
const countries = [
  {name:"India", code:"in"},
  {name:"USA", code:"us"},
  {name:"Japan", code:"jp"},
  {name:"Germany", code:"de"},
  {name:"France", code:"fr"},
  {name:"Brazil", code:"br"},
  // ... extend to all 195 countries
];

// Populate dropdown
const select = document.getElementById("countrySelect");
countries.forEach(c => {
  let opt = document.createElement("option");
  opt.value = c.name;
  opt.textContent = c.name;
  select.appendChild(opt);
});

function spawnBalloons() {
  const selected = Array.from(select.selectedOptions).map(opt => opt.value);
  if (selected.length === 0) return;

  let count = Math.floor(Math.random() * 5) + 1; // 1–5 balloons
  for (let i=0; i<count; i++) {
    const country = selected[Math.floor(Math.random() * selected.length)];
    balloons.push({
      img: `https://flagcdn.com/w320/${countries.find(c=>c.name===country).code}.png`,
      country: country,
      x: 50 + i*100, // spaced apart horizontally
      y: 600
    });
  }
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  balloons.forEach(b => {
    let flag = new Image();
    flag.src = b.img;
    ctx.drawImage(flag, b.x, b.y, 60, 40);
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
      return false;
    }
    return true;
  });
});

document.getElementById("speedControl").addEventListener("input", e => {
  speed = parseInt(e.target.value);
});

document.getElementById("startBtn").addEventListener("click", () => {
  balloons = [];
  score = 0;
  document.getElementById("scoreDisplay").textContent = "Score: 0";

  let minutes = parseInt(document.getElementById("timeLimit").value);
  timeRemaining = minutes * 60;

  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  clearInterval(timerInterval);

  gameInterval = setInterval(draw, 50);
  spawnInterval = setInterval(spawnBalloons, 2000); // spawn every 2s
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
