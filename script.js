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

  if (percent > 50) {
    revealed = true;
    showPopup();
  }
}

function showPopup() {
  const popup = document.createElement('div');
  popup.innerHTML = `
    <div class="popup">
      <p>💌 Will you go out with me?</p>
      <button id="yes">Yes!</button>
      <button id="no">No 😭</button>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById('yes').onclick = () => {
    popup.innerHTML = `<p style="font-size:24px;">Yay!! 🎉💖</p>`;
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
  };

  document.getElementById('no').onclick = () => {
    popup.innerHTML = `<p style="font-size:24px;">Aww okay... 💔</p>`;
  };
}
