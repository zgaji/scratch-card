const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const messageBox = document.getElementById('message');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = '#bfdda8';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.globalCompositeOperation = 'destination-out';

let isDrawing = false;
let lastX, lastY;
let revealed = false;
let noCount = 0;

canvas.addEventListener('mousedown', e => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  checkReveal();
});
canvas.addEventListener('mouseleave', () => isDrawing = false);
canvas.addEventListener('mousemove', e => drawLine(e.offsetX, e.offsetY));

canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  isDrawing = true;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  lastX = touch.clientX - rect.left;
  lastY = touch.clientY - rect.top;
});
canvas.addEventListener('touchend', () => {
  isDrawing = false;
  checkReveal();
});
canvas.addEventListener('touchcancel', () => isDrawing = false);
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (!isDrawing) return;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  drawLine(x, y);
});

function celebrateWithConfetti() {
  const duration = 2 * 1000;
  const end = Date.now() + duration;

  const interval = setInterval(function() {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }
    confetti({
      particleCount: 50,
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      },
      colors: ['#ff9999', '#ffb3b3', '#ff8080', '#ffcccc', '#ff6666']
    });
  }, 250);
}

function drawLine(x, y) {
  if (!isDrawing) return;
  ctx.lineWidth = 40;
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
    showPopup();
  }
}

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

    if (x !== null && y !== null) {
      popup.style.top = `${y}px`;
      popup.style.left = `${x}px`;
      popup.style.transform = `translate(0, 0)`;
    }

    document.body.appendChild(popup);
    addPopupListeners(popup);
  }

  function addPopupListeners(popup) {
    const yesBtn = popup.querySelector('.yes-btn');
    const noBtn = popup.querySelector('.no-btn');
    const sounds = [document.getElementById('sound1'), document.getElementById('sound2')];

    yesBtn.onclick = () => {
      sounds.forEach(s => { s.pause(); s.currentTime = 0; });
      document.querySelectorAll('.popup').forEach(p => p.remove());
      celebrateWithConfetti();
    };

    noBtn.onclick = () => {
      noCount++;
      popup.remove();
      const sound = sounds[Math.floor(Math.random() * sounds.length)];
      sound.play();

      if (noCount < 5) {
        for (let i = 0; i < noCount + 1; i++) {
          const randX = Math.random() * (window.innerWidth - 200);
          const randY = Math.random() * (window.innerHeight - 150);
          showRandomPopup(randX, randY);
        }
      } else {
        const finalPopup = document.createElement('div');
        finalPopup.classList.add('popup');
        finalPopup.innerHTML = `<p style="font-size:22px;">Okay fine... Next time nalang ulitt 😤</p>
                                <button class="hehe-btn">hehe</button>`;
        finalPopup.style.top = `50%`;
        finalPopup.style.left = `50%`;
        finalPopup.style.transform = `translate(-50%, -50%)`;
        document.body.appendChild(finalPopup);

        const heheBtn = finalPopup.querySelector('.hehe-btn');
        if (heheBtn) {
          heheBtn.onclick = () => {
            document.querySelectorAll('.popup').forEach(p => p.remove()); // Remove all popups
            showEnvelope();
          };
        }

      }
    };

  }

  function showEnvelope() {
    document.querySelectorAll('.popup').forEach(p => p.remove());
  
    const container = document.createElement('div');
    container.className = 'envelope-container';
    container.innerHTML = `
      <div class="envelope"> 
        <div class="flap"></div>
        <div class="letter">
          <p>I've been waiting to feel the right moment to ask you—without the rush, without pressure. I've actually been</p>
          <p>meaning to ask for maybe a month now, but I wanted to wait until I felt it was the right time.</p>
          <p>I know we said we'd just see what happens. But now, I feel like finally asking would make everything real—</p>
          <p>official. That we'd start facing everything together, because this would mean it's no longer just a maybe.</p>
          <p>If now isn't the right time for you, if you feel like you still need space or clarity—that's okay. I just want to be</p>
          <p>honest with you about what I feel. And no matter what your answer is, I'll still be here. Dito lang ako,</p>
          <p>hanggang sa ayaw mo na.</p><br><br>
          <p><strong>- Zari</strong></p>
          <button class="close-envelope">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(container);
  
    // Add close functionality
    const closeBtn = container.querySelector('.close-envelope');
    closeBtn.onclick = () => {
      container.remove();
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
    addPopupListeners(popup);
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = '#bfdda8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });
}