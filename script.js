const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');

// Make canvas full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Fill canvas with gray overlay
ctx.fillStyle = '#ccc';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Erasing mode
ctx.globalCompositeOperation = 'destination-out';

let isDrawing = false;
let lastX, lastY;

// Mouse support
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mouseup', () => isDrawing = false);
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

canvas.addEventListener('touchend', () => isDrawing = false);
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
