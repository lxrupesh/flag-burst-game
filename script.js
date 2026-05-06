const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let speed = 2;
let balloons = [];
let score = 0;
let gameInterval, spawnInterval, timerInterval;
let timeRemaining = 0;

let countries = []; // will be filled dynamically

// Load all countries dynamically from FlagCDN
async function loadCountries() {
  const response = await fetch("https://flagcdn.com/en/codes.json");
  const codes = await response.json();

  const select = document.getElementById("countrySelect");
  Object.entries(codes).forEach(([code, name]) => {
    let opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
    countries.push({name, code});
  });
}
loadCountries();

function spawnBalloons() {
  const selected = Array.from(document.getElementById("countrySelect").selectedOptions)
                        .map(opt => opt.value);
  if (selected.length === 0) return;

  let count = Math.floor(Math.random() * 5) + 1; // 1–5 balloons
  for (let i=0; i<count; i++) {
    const country = selected[Math.floor(Math.random() * selected.length)];
    const code = countries.find(c => c.name === country).code;
    balloons.push({
      img: `https://flagcdn.com/w320/${code}.png`,
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
