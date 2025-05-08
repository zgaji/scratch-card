const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');

// Make canvas cover the full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Fill canvas with gray overlay
ctx.fillStyle = '#aaa';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Erasing mode
ctx.globalCompositeOperation = 'destination-out';

let isDrawing = false;

// Mouse support
canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseleave', () => isDrawing = false);
canvas.addEventListener('mousemove', (e) => scratch(e.offsetX, e.offsetY));

// Touch support
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  isDrawing = true;
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
  scratch(x, y);
});

// Core scratch function
function scratch(x, y) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.fill();
}
