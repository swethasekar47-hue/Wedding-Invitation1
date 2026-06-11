const canvas = document.getElementById("scratch");
const ctx = canvas.getContext("2d");

const container = document.querySelector(".scratch-container");

canvas.width = container.offsetWidth;
canvas.height = container.offsetHeight;

/* GOLD LAYER */

ctx.fillStyle = "#D9A441";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "rgba(255,255,255,0.8)";
ctx.font = "bold 22px serif";
ctx.textAlign = "center";
ctx.fillText(
  "Scratch Here",
  canvas.width / 2,
  canvas.height / 2
);

let scratching = false;
let revealed = false;

/* SCRATCH */

function scratch(x, y) {

  ctx.globalCompositeOperation = "destination-out";

  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2);
  ctx.fill();

  checkReveal();
}

/* CHECK % SCRATCHED */

function checkReveal() {

  if (revealed) return;

  const imageData = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );

  let transparentPixels = 0;

  for (let i = 3; i < imageData.data.length; i += 4) {

    if (imageData.data[i] === 0) {
      transparentPixels++;
    }

  }

  const totalPixels =
    canvas.width * canvas.height;

  const percent =
    (transparentPixels / totalPixels) * 100;

  if (percent >= 50) {

    revealed = true;

    /* FULLY REVEAL CARD */

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    document
      .querySelector(".reveal-content")
      .classList.add("revealed");

    document
      .querySelector(".countdown")
      .classList.add("show");

      startCountdown();

    /* SHOW MESSAGE */

    const celebrate =
      document.getElementById("celebrate");

    celebrate.style.display = "block";

    setTimeout(() => {
      celebrate.style.display = "none";
    }, 3000);

    /* CONFETTI */

    launchSparkles();
  }
}

/* CONFETTI */

// function launchConfetti(){

//     const duration = 3000;
//     const end = Date.now() + duration;

//     (function frame(){

//         confetti({
//             particleCount:5,
//             angle:60,
//             spread:55,
//             origin:{x:0}
//         });

//         confetti({
//             particleCount:5,
//             angle:120,
//             spread:55,
//             origin:{x:1}
//         });

//         if(Date.now() < end){
//             requestAnimationFrame(frame);
//         }

//     })();
// }

function launchSparkles() {

  confetti({
    particleCount: 150,
    spread: 70,
    shapes: ['circle'],
    colors: ['#D4AF37', '#FFD700', '#FFF8DC']
  });

}

function startCountdown() {

  const weddingDate =
    new Date("September 17, 2026 09:00:00").getTime();

  const timer = setInterval(() => {

    const now = new Date().getTime();

    const distance =
      weddingDate - now;

    if (distance < 0) {

      clearInterval(timer);

      document.querySelector(".countdown")
        .innerHTML =
        "<h3>🎉 It's Wedding Day 🎉</h3>";

      return;
    }

    const days =
      Math.floor(distance / (1000 * 60 * 60 * 24));

    const hours =
      Math.floor(
        (distance % (1000 * 60 * 60 * 24))
        / (1000 * 60 * 60)
      );

    const minutes =
      Math.floor(
        (distance % (1000 * 60 * 60))
        / (1000 * 60)
      );

    const seconds =
      Math.floor(
        (distance % (1000 * 60))
        / 1000
      );

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;

  }, 1000);

}

/* DESKTOP */

canvas.addEventListener("mousedown", () => {
  scratching = true;
});

canvas.addEventListener("mouseup", () => {
  scratching = false;
});

canvas.addEventListener("mouseleave", () => {
  scratching = false;
});

canvas.addEventListener("mousemove", (e) => {

  if (!scratching) return;

  const rect =
    canvas.getBoundingClientRect();

  scratch(
    e.clientX - rect.left,
    e.clientY - rect.top
  );
});

/* MOBILE */

canvas.addEventListener("touchstart", () => {
  scratching = true;
});

canvas.addEventListener("touchend", () => {
  scratching = false;
});

canvas.addEventListener("touchmove", (e) => {

  e.preventDefault();

  if (!scratching) return;

  const rect =
    canvas.getBoundingClientRect();

  const touch = e.touches[0];

  scratch(
    touch.clientX - rect.left,
    touch.clientY - rect.top
  );

}, { passive: false });