const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let speed = 2;
let balloons = [];
let bursts = [];
let score = 0;
let gameInterval, spawnInterval, timerInterval;
let timeRemaining = 0;
let learningMode = false;

let countries = []; // filled dynamically

// Load all countries dynamically from FlagCDN
async function loadCountries() {
  const response = await fetch("https://flagcdn.com/en/codes.json");
  const codes = await response.json();

  const select = document.getElementById("countrySelect");
  Object.entries(codes).forEach(([code, name]) => {
    let opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    opt.selected = true; // select all by default
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
      x: 50 + i*100,   // horizontal spacing (columns)
      y: 600 + i*50    // vertical spacing (rows)
    });
  }
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Draw balloons
  balloons.forEach(b => {
    let flag = new Image();
    flag.src = b.img;
    ctx.drawImage(flag, b.x, b.y, 60, 40);
    b.y -= speed;

    // Show country name if learning mode enabled
    if (learningMode) {
      ctx.font = "16px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(b.country, b.x + 30, b.y + 55);
    }
  });

  // Draw bursts
  bursts.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x+30, b.y+20, b.radius, 0, 2*Math.PI);
    ctx.fillStyle = `rgba(255,0,0,${b.alpha})`;
    ctx.fill();
    b.radius += 3;
    b.alpha -= 0.1;
  });
  bursts = bursts.filter(b => b.alpha > 0);
}

document.getElementById("input").addEventListener("input", e => {
  let text = e.target.value.trim().toLowerCase();
  balloons = balloons.filter(b => {
    if (text === b.country.toLowerCase()) {
      e.target.value = "";
      score++;
      document.getElementById("scoreDisplay").textContent = "Score: " + score;

      // Burst effect
      bursts.push({x: b.x, y: b.y, radius: 10, alpha: 1});

      // Play sound (optional, add pop.mp3 in sounds folder)
      // const popSound = new Audio("sounds/pop.mp3");
      // popSound.play();

      return false;
    }
    return true;
  });
});

document.getElementById("speedControl").addEventListener("input", e => {
  speed = parseInt(e.target.value);
});

document.getElementById("learningMode").addEventListener("change", e => {
  learningMode = e.target.checked;
});

document.getElementById("toggleLearningBtn").addEventListener("click", () => {
  learningMode = !learningMode;
  document.getElementById("toggleLearningBtn").textContent = 
    learningMode ? "Disable Learning Mode" : "Enable Learning Mode";
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
