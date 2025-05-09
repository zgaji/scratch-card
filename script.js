const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const messageBox = document.getElementById('message');

// Set canvas full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Fill with overlay color
ctx.fillStyle = '#bfdda8';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Erasing mode
ctx.globalCompositeOperation = 'destination-out';

let isDrawing = false;
let lastX, lastY;
let revealed = false;

// Mouse support
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  checkReveal();
});
canvas.addEventListener('mouseleave', () => isDrawing = false);
canvas.addEventListener('mousemove', (e) => drawLine(e.offsetX, e.offsetY));

// Touch support
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  lastX = touch.clientX - rect.left;
  lastY = touch.clientY - rect.top;
});
canvas.addEventListener('touchend', () => {
  isDrawing = false;
  checkReveal();
});
canvas.addEventListener('touchcancel', () => isDrawing = false);
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  drawLine(x, y);
});

function drawLine(x, y) {
  if (!isDrawing) return;
  ctx.lineWidth = 30;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  [lastX, lastY] = [x, y];
}

function checkReveal() {
  if (revealed) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let transparentPixels = 0;
  for (let i = 3; i < imageData.data.length; i += 4) {
    if (imageData.data[i] === 0) transparentPixels++;
  }

  const percent = transparentPixels / (canvas.width * canvas.height) * 100;

  if (percent > 30) {
    revealed = true;
    showPopup();
  }
}

let noCount = 0;

function showPopup() {
  createPopup();

  function createPopup(x = null, y = null) {
    const popup = document.createElement('div');
    popup.classList.add('popup');

    popup.innerHTML = `
      <p>💌 Tayo nalang plss?</p>
      <button class="yes-btn">Yes!</button>
      <button class="no-btn">No 😭</button>
    `;

    document.body.appendChild(popup);

    if (x !== null && y !== null) {
      popup.style.top = `${y}px`;
      popup.style.left = `${x}px`;
      popup.style.transform = `translate(0, 0)`;
    }

    popup.querySelector('.yes-btn').onclick = () => {
      popup.innerHTML = `<p style="font-size:24px;">Yay!! 🎉💖</p>`;
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    };

    popup.querySelector('.no-btn').onclick = () => {
      noCount++;
      popup.remove();

      if (noCount < 5) {
        for (let i = 0; i < noCount + 1; i++) {
          const randX = Math.random() * (window.innerWidth - 200);
          const randY = Math.random() * (window.innerHeight - 150);
          createPopup(randX, randY);
        }
      } else {
        const finalPopup = document.createElement('div');
        finalPopup.classList.add('popup');
        finalPopup.innerHTML = `<p style="font-size:22px;">Okay fine... 😤 I give up.</p>`;
        finalPopup.style.top = `50%`;
        finalPopup.style.left = `50%`;
        finalPopup.style.transform = `translate(-50%, -50%)`;
        document.body.appendChild(finalPopup);
      }
    };
  }
  document.addEventListener('DOMContentLoaded', () => {
    const field = document.getElementById('flowerField');
    const flowerCount = 40;
  
    const flowerSVGs = [
      // 🌸 Pink flower
      `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="10" fill="#FFD700"/><circle cx="50" cy="20" r="10" fill="#FF69B4"/><circle cx="80" cy="50" r="10" fill="#FF69B4"/><circle cx="50" cy="80" r="10" fill="#FF69B4"/><circle cx="20" cy="50" r="10" fill="#FF69B4"/></svg>`,
  
      // 🌼 Yellow flower
      `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="12" fill="#FFA500"/><ellipse cx="50" cy="25" rx="8" ry="12" fill="#FFFF99"/><ellipse cx="75" cy="50" rx="8" ry="12" fill="#FFFF99" transform="rotate(45 75 50)"/><ellipse cx="50" cy="75" rx="8" ry="12" fill="#FFFF99"/><ellipse cx="25" cy="50" rx="8" ry="12" fill="#FFFF99" transform="rotate(-45 25 50)"/></svg>`,
  
      // 💜 Purple star flower
      `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="10" fill="#9932CC"/><polygon points="50,20 60,40 80,40 65,55 70,75 50,65 30,75 35,55 20,40 40,40" fill="#DA70D6"/></svg>`,
  
      // 🔥 Orange bloom
      `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="8" fill="#FF4500"/><path d="M50 20 Q60 40 50 60 Q40 40 50 20" fill="#FF7F7F"/><path d="M20 50 Q40 60 60 50 Q40 40 20 50" fill="#FF7F7F"/></svg>`,
  
      // 🤍 White petals
      `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="6" fill="#FFFFFF"/><circle cx="50" cy="20" r="8" fill="#FFFFFF"/><circle cx="80" cy="50" r="8" fill="#FFFFFF"/><circle cx="50" cy="80" r="8" fill="#FFFFFF"/><circle cx="20" cy="50" r="8" fill="#FFFFFF"/></svg>`
    ];
  
    for (let i = 0; i < flowerCount; i++) {
      const flower = document.createElement('div');
      flower.classList.add('flower');
      flower.innerHTML = flowerSVGs[Math.floor(Math.random() * flowerSVGs.length)];
  
      const left = Math.random() * 100; // % position
      const scale = 0.5 + Math.random(); // 0.5x to 1.5x
      const delay = Math.random() * 2; // seconds
  
      flower.style.left = `${left}%`;
      flower.style.transform = `scale(${scale})`;
      flower.style.animationDelay = `${delay}s`;
  
      field.appendChild(flower);
    }
  });
  
}