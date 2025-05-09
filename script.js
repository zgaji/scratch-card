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

  if (percent > 20) {
    revealed = true;
    showPopup()
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
      <button class="no-btn">Ayaww</button>
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

          showRandomPopup(randX, randY);
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

  function showRandomPopup(x, y) {
    const popup = document.createElement('div');
    
    popup.classList.add('popup');
  
    const messages = [
      `<p>Real ba? :( </p> <img src="https://i.pinimg.com/736x/aa/62/e8/aa62e804da9030809731146c6960c802.jpg" width="100" style="border-radius:10px;">`,
      '<p>Sure ka na?</p>',
      '<p>😔 iyak nalang ako</p>',
      `<p>Plsss? </p><img src="https://i.pinimg.com/736x/01/d8/9f/01d89fa219cfd75867a00c1e920d776f.jpg" width="100" style="border-radius:10px;">`,
      `<p>Lugmok na ko ☹️ </p><img src="https://i.pinimg.com/736x/00/a2/51/00a2512606a9e7624651e163d57a392b.jpg" width="100" style="border-radius:10px;">`
    ];

    const sadSounds = [
      document.getElementById('sound1'),
      document.getElementById('sound2'),
    ];
    

    document.body.appendChild(popup);

    // Play sound
    const sound = document.getElementById('sadSound');
    if (sound) sound.play();
  
    popup.innerHTML = `
      ${messages[Math.floor(Math.random() * messages.length)]}
      <br>
      <button class="yes-btn">Yes</button>
      <button class="no-btn">Ayaww</button>
    `;
  
    popup.style.top = `${y}px`;
    popup.style.left = `${x}px`;
    popup.style.transform = `translate(0, 0)`;
  
    document.body.appendChild(popup);
  
    popup.querySelector('.yes-btn').onclick = () => {
      popup.innerHTML = `<p style="font-size:24px;">YAYY MWA!!! </p>`;
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    };
  
    popup.querySelector('.no-btn').onclick = () => {
      sadSounds.forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
      });

      const randomSound = sadSounds[Math.floor(Math.random() * sadSounds.length)];
      randomSound.play();

      popup.remove();
      noCount++;
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
}
