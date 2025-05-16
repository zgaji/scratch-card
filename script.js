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
      
      // Trigger initial confetti celebration
      celebrateWithConfetti();
      
      // Create and show the kiss popup
      const kissPopup = document.createElement('div');
      kissPopup.classList.add('popup');
      kissPopup.innerHTML = `
        <div class="popup-content">
          <p>yay !!! kiss pls </p>
          <button class="kiss-btn">😘</button>
        </div>
      `;
      document.body.appendChild(kissPopup);

      // Add click handler for the kiss button
      const kissBtn = kissPopup.querySelector('.kiss-btn');
      kissBtn.onclick = () => {
        kissPopup.remove();
        celebrateWithConfetti(); // Trigger confetti again
      };
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
        finalPopup.innerHTML = `
          <p style="font-size:20px;">okayyy, edi h'wag ☹️<br> try again next time</p>
          <button class="hehe-btn">hehe</button>
        `;
        finalPopup.style.top = `50%`;
        finalPopup.style.left = `50%`;
        finalPopup.style.transform = `translate(-50%, -50%)`;
        document.body.appendChild(finalPopup);

        const heheBtn = finalPopup.querySelector('.hehe-btn');
        if (heheBtn) {
          heheBtn.onclick = () => {
            document.querySelectorAll('.popup').forEach(p => p.remove());
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
          <p>
            The first thing you ever asked me at the bar—aside from my name—was to be honest with you.
          </p>
          
          <p>
            And so, here I am.
          </p>

          <p>
            I’ve never been great with words or expressing how I feel, and I’ve been waiting for the right 
            moment to ask you—without rush, without pressure. (Though honestly, medyo na-rush 
            na rin kasi malalanta na yung flowers HAHAHAHAHAH.)
          </p>

          <p>
            I’ve actually been meaning to ask for about a month now, pero ang dami ko pang arte sa isip—thinking 
            of the right way, the right timing, the right everything.
          </p>
          
          <p>We said we’d just see where this goes, and I really held on to that. But now, I feel like I’m ready 
            to make it real—to finally ask you, officially.
          </p>
          
          <p>I’m still unsure how to navigate things pagdating sa family mo. But want you to know that whatever 
          happens, whatever you decide—I’ll be here. I’ll be with you through it, no pressure, no rush.
          </p>
          
          <p>If now isn’t the right time for you, or if you need more clarity or space, I understand. 
          I just want to be honest about what I feel—because I really do like you a lot, my Micole.
          </p>
          
          <p>And whatever your answer may be, I’ll still be here. Dito lang ako. Hanggang sa ayaw mo na.
          </p>

          <p class="signature">
            <strong>- Love, Zari</strong>
          </p>
          
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
      `
        <p>Real ba? 🥺</p>
        <img src="https://i.pinimg.com/736x/aa/62/e8/aa62e804da9030809731146c6960c802.jpg" 
             width="100" 
             style="border-radius:10px;">
      `,
      `
        <p>Sige na plsss? 🥹</p>
      `,
      `
        <p>😔 Iyak na talaga ako</p>
      `,
      `
        <p>Last na, plsssss</p>
        <img src="https://i.pinimg.com/736x/01/d8/9f/01d89fa219cfd75867a00c1e920d776f.jpg" 
             width="100" 
             style="border-radius:10px;">
      `,
      `
        <p>sakit mo na ☹️</p>
        <img src="https://i.pinimg.com/736x/00/a2/51/00a2512606a9e7624651e163d57a392b.jpg" 
             width="100" 
             style="border-radius:10px;">
      `
    ];

    popup.innerHTML = `
      <div class="popup-content">
        ${messages[Math.floor(Math.random() * messages.length)]}
        <div class="popup-buttons">
          <button class="yes-btn">Yes</button>
          <button class="no-btn">Ayaww</button>
        </div>
      </div>
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

// Add wildflower container
function createWildflowers() {
  const container = document.createElement('div');
  container.className = 'wildflower-container';
  
  // Add grass background
  const grass = document.createElement('div');
  grass.className = 'grass';
  container.appendChild(grass);
  
  // Add wildflowers
  for (let i = 0; i < 10; i++) {
    const flower = document.createElement('div');
    flower.className = 'wildflower';
    
    // Create flower head
    const flowerHead = document.createElement('div');
    flowerHead.className = 'flower-head';
    
    // Add petals
    for (let j = 0; j < 5; j++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.setProperty('--rotation', `${j * 72}deg`);
      flowerHead.appendChild(petal);
    }
    
    // Add flower center
    const center = document.createElement('div');
    center.className = 'flower-center';
    flowerHead.appendChild(center);
    
    // Add stem
    const stem = document.createElement('div');
    stem.className = 'stem';
    
    // Add leaves
    for (let k = 0; k < 2; k++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.style.setProperty('--rotation', k === 0 ? '30deg' : '150deg');
      stem.appendChild(leaf);
    }
    
    flower.appendChild(flowerHead);
    flower.appendChild(stem);
    container.appendChild(flower);
  }
  
  // Add floating particles
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 4}s`;
    container.appendChild(particle);
  }
  
  document.body.appendChild(container);
}

// Call the function when the page loads
window.addEventListener('load', createWildflowers);