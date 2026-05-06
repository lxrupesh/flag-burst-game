const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let speed = 2;

const flagData = {
  "India": "https://flagcdn.com/w320/in.png",
  "USA": "https://flagcdn.com/w320/us.png",
  "Japan": "https://flagcdn.com/w320/jp.png",
  "Germany": "https://flagcdn.com/w320/de.png"
};

let balloons = [];

function spawnBalloons() {
  balloons = [];
  document.querySelectorAll("#settings input[type=checkbox]:checked")
    .forEach(cb => {
      balloons.push({
        img: flagData[cb.value],
        country: cb.value,
        x: Math.random() * 300,
        y: 600
      });
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
setInterval(draw, 50);

document.getElementById("input").addEventListener("input", e => {
  let text = e.target.value.trim().toLowerCase();
  balloons = balloons.filter(b => {
    if (text === b.country.toLowerCase()) {
      e.target.value = "";
      return false; // burst balloon
    }
    return true;
  });
});

document.getElementById("speedControl").addEventListener("input", e => {
  speed = parseInt(e.target.value);
});

spawnBalloons();
