/* ============================================================
   BIRTHDAY WEBSITE — script.js
   All interactivity · Animations · Game · Logic
   ============================================================ */

'use strict';

/* ============================================================
   ✏️ CUSTOMIZATION ZONE — Edit everything in this block!
   ============================================================ */

// ── Typewriter opening line ──────────────────────────────────
// ✏️ EDIT: The first animated line on the message section
const TYPEWRITER_TEXT = "To my favorite person in the whole universe… 💕";

// ── Memory timeline cards ────────────────────────────────────
// ✏️ EDIT: Add/remove/change memory cards
// For image: put your image URL in the `img` field, or leave as "" for placeholder
const MEMORIES = [
  {
    emoji: "🌸",
    date:  "The beginning",
    title: "The First Hello",
    body:  "I still remember the first time we talked. Something in the universe shifted that day — though I didn't know it yet.",
    img:   "",   // ✏️ Replace with image URL or leave empty
    imgLabel: "📸 Add your photo here"
  },
  {
    emoji: "😂",
    date:  "A little later",
    title: "The First Real Laugh",
    body:  "You laughed so hard at something ridiculous, and I realized — I wanted to hear that laugh forever.",
    img:   "",
    imgLabel: "📸 Add your photo here"
  },
  {
    emoji: "💫",
    date:  "Our anniversary",
    title: "The Day It Became Official",
    body:  "The day I got to call you mine. I smiled so wide my cheeks hurt for a week.",
    img:   "",
    imgLabel: "📸 Add your photo here"
  },
  {
    emoji: "🌙",
    date:  "A night to remember",
    title: "Our Favorite Memory",
    body:  "That evening felt like it was made just for us. Time stopped, and all that existed was you and me.",
    img:   "",
    imgLabel: "📸 Add your photo here"
  },
  {
    emoji: "🎂",
    date:  "Today",
    title: "Your Birthday 🎉",
    body:  "Today we celebrate the day the world became infinitely more wonderful — the day you were born.",
    img:   "",
    imgLabel: "📸 Add today's photo"
  }
];

// ── Reasons I Love You ───────────────────────────────────────
// ✏️ EDIT: Add as many reasons as you like!
const REASONS = [
  "The way your eyes light up when you talk about something you love.",
  "How genuinely kind you are to every single person.",
  "Your infectious, beautiful laugh that fills every room.",
  "The way you make ordinary moments feel magical.",
  "Your curiosity — you make life more interesting just by being in it.",
  "How deeply you feel everything; your sensitivity is a superpower.",
  "The way you always know the right thing to say.",
  "Your creativity and the way you see beauty in unexpected places.",
  "How you make everyone around you feel valued and seen.",
  "The warmth you carry — like being near a fireplace on a cold night.",
  "Your honesty, even when it's hard.",
  "The little things — your voice, your gestures, the way you smile when you're thinking.",
  "How passionate you are about the things you love.",
  "The way you believe in people, including me.",
  "Simply… you. Every complicated, beautiful, wonderful part of you.",
];

// ── Secret password ──────────────────────────────────────────
// ✏️ EDIT: Change to your anniversary date in DDMMYYYY format
const SECRET_PASSWORD = "14022025";

// ── QR code destination URL ──────────────────────────────────
// ✏️ EDIT: Your deployed GitHub Pages URL
const SITE_URL = "https://yourname.github.io/birthday";

/* ============================================================
   END OF CUSTOMIZATION ZONE
   ============================================================ */


/* ── DOM REFERENCES ── */
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ============================================================
   LOADING SCREEN
   ============================================================ */
function initLoading() {
  const screen = $('#loading-screen');
  const app    = $('#app');

  // Simulate loading: 2.6s then fade out
  setTimeout(() => {
    screen.classList.add('fade-out');
    app.classList.remove('hidden');
    // Start reveal animations
    initRevealObserver();
    setTimeout(() => screen.remove(), 900);
  }, 2700);
}

/* ============================================================
   PARTICLE CANVAS — floating hearts & stars
   ============================================================ */
function initParticles() {
  const canvas = $('#particle-canvas');
  const ctx    = canvas.getContext('2d');
  const particles = [];
  const SYMBOLS = ['💕', '✨', '🌸', '💖', '⭐', '💗'];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawnParticle() {
    particles.push({
      x:     Math.random() * canvas.width,
      y:     canvas.height + 20,
      sym:   SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      size:  Math.random() * 14 + 10,
      speedY: Math.random() * 0.6 + 0.3,
      speedX: (Math.random() - 0.5) * 0.5,
      alpha:  Math.random() * 0.5 + 0.3,
      drift:  Math.random() * Math.PI * 2,
      driftSpeed: Math.random() * 0.02 + 0.01,
    });
  }

  let spawnTimer = 0;
  function animate(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    spawnTimer++;
    if (spawnTimer % 40 === 0) spawnParticle();

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.drift += p.driftSpeed;
      p.x += p.speedX + Math.sin(p.drift) * 0.4;
      p.y -= p.speedY;

      if (p.y < -30) { particles.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.sym, p.x, p.y);
      ctx.restore();
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

/* ============================================================
   MUSIC TOGGLE
   ============================================================ */
function initMusic() {
  const btn   = $('#music-btn');
  const audio = $('#bg-music');
  let playing = false;

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.classList.remove('playing');
      btn.querySelector('.music-icon').textContent = '🎵';
    } else {
      audio.play().catch(() => {}); // graceful fail if no audio file
      btn.classList.add('playing');
      btn.querySelector('.music-icon').textContent = '🎶';
    }
    playing = !playing;
  });
}

/* ============================================================
   SCROLL REVEAL OBSERVER
   ============================================================ */
function initRevealObserver() {
  const els = $$('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => observer.observe(el));
}

/* ============================================================
   LANDING — "Open Surprise" button smooth scroll
   ============================================================ */
function initLanding() {
  const btn = $('#open-surprise-btn');
  btn.addEventListener('click', () => {
    $('#message').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ============================================================
   TYPEWRITER EFFECT
   ============================================================ */
function initTypewriter() {
  const el = $('#typewriter-text');
  let i = 0;
  let started = false;

  // Only start when section is in view
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      function type() {
        if (i < TYPEWRITER_TEXT.length) {
          el.textContent = TYPEWRITER_TEXT.slice(0, ++i);
          setTimeout(type, 45);
        }
      }
      setTimeout(type, 400);
    }
  }, { threshold: 0.5 });

  observer.observe($('#message'));
}

/* ============================================================
   MEMORY TIMELINE SLIDER
   ============================================================ */
function initTimeline() {
  const slider = $('#timeline-slider');
  const dotsEl = $('#tl-dots');
  let current  = 0;

  // Build cards
  MEMORIES.forEach((mem, idx) => {
    const card = document.createElement('div');
    card.className = 'timeline-card';
    card.innerHTML = `
      <span class="card-emoji">${mem.emoji}</span>
      <p class="card-date">${mem.date}</p>
      <h3 class="card-title">${mem.title}</h3>
      <p class="card-body">${mem.body}</p>
      ${mem.img
        ? `<img src="${mem.img}" alt="${mem.title}" style="width:100%;border-radius:14px;margin-top:20px;object-fit:cover;height:180px;" />`
        : `<div class="card-img"><span>📷</span>${mem.imgLabel}</div>`
      }
    `;
    slider.appendChild(card);

    // Dot
    const dot = document.createElement('button');
    dot.className = 'tl-dot' + (idx === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to memory ${idx + 1}`);
    dot.addEventListener('click', () => goTo(idx));
    dotsEl.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + MEMORIES.length) % MEMORIES.length;
    const cards = $$('.timeline-card');
    // ใช้ pixel จาก slider width จริง แทน % ของ card เพื่อ accuracy
    const sliderW = slider.clientWidth;
    cards.forEach((c, i) => {
      c.style.transform = `translateX(${(i - current) * sliderW}px)`;
    });
    $$('.tl-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  // Re-align on resize (orientation change on mobile)
  window.addEventListener('resize', () => goTo(current));
  // รอให้ browser layout เสร็จก่อน ไม่งั้น clientWidth = 0 ทำให้ card ซ้อนกัน
  requestAnimationFrame(() => requestAnimationFrame(() => goTo(0)));

  $('#tl-prev').addEventListener('click', () => goTo(current - 1));
  $('#tl-next').addEventListener('click', () => goTo(current + 1));

  // Swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
  });
}

/* ============================================================
   REASONS I LOVE YOU
   ============================================================ */
function initReasons() {
  const btn      = $('#next-reason-btn');
  const textEl   = $('#reason-text');
  const numEl    = $('#reason-num');
  const cardEl   = $('#reason-card');
  const burstEl  = $('#heart-burst');
  let shown = [];

  function getNextReason() {
    if (shown.length === REASONS.length) shown = [];
    const remaining = REASONS.filter((_, i) => !shown.includes(i));
    const idx = remaining[Math.floor(Math.random() * remaining.length)];
    shown.push(idx);
    return { text: REASONS[idx], num: shown.length };
  }

  function spawnHearts() {
    burstEl.innerHTML = '';
    const hearts = ['💕','💖','💗','💓','🌸','✨'];
    for (let i = 0; i < 10; i++) {
      const h = document.createElement('span');
      h.className = 'burst-heart';
      h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      const angle = Math.random() * 360;
      const dist  = 60 + Math.random() * 80;
      h.style.setProperty('--bx', `${Math.cos(angle) * dist}px`);
      h.style.setProperty('--by', `${-Math.abs(Math.sin(angle)) * dist - 40}px`);
      h.style.animationDelay = `${Math.random() * 0.2}s`;
      burstEl.appendChild(h);
      setTimeout(() => h.remove(), 1400);
    }
  }

  btn.addEventListener('click', () => {
    const reason = getNextReason();
    textEl.textContent = reason.text;
    numEl.textContent  = `#${reason.num}`;
    cardEl.classList.remove('pop');
    void cardEl.offsetWidth; // reflow
    cardEl.classList.add('pop');
    spawnHearts();
  });

  // Show first reason immediately
  btn.click();
}

/* ============================================================
   SECRET MESSAGE UNLOCK
   ============================================================ */
function initSecret() {
  const input   = $('#secret-input');
  const btn     = $('#unlock-btn');
  const errorEl = $('#secret-error');
  const lockEl  = $('#secret-lock');
  const revealEl= $('#secret-revealed');

  function tryUnlock() {
    if (input.value.trim() === SECRET_PASSWORD) {
      lockEl.style.animation = 'revealFade 0.5s ease reverse forwards';
      setTimeout(() => {
        lockEl.classList.add('hidden');
        revealEl.classList.remove('hidden');
      }, 500);
    } else {
      errorEl.textContent = "That's not quite right, my love… try again 🔐";
      input.value = '';
      input.style.animation = 'none';
      void input.offsetWidth;
      input.style.animation = 'shake 0.4s ease';
      input.focus();
    }
  }

  btn.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });
}

/* ============================================================
   MINI GAME — Catch the Hearts
   ============================================================ */
function initGame() {
  const startBtn  = $('#game-start-btn');
  const area      = $('#game-area');
  const scoreEl   = $('#game-score');
  const startMsg  = $('#game-start-msg');
  const winMsg    = $('#game-win-msg');

  const GOAL      = 15;
  const HEART_EMOJIS = ['💕','💖','💗','💓','💝'];
  let score       = 0;
  let gameActive  = false;
  let spawnInterval;
  let hearts      = [];

  function createHeart() {
    if (!gameActive) return;
    const h = document.createElement('span');
    h.className = 'game-heart';
    h.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];

    const areaW = area.clientWidth  - 50;
    const areaH = area.clientHeight - 50;
    h.style.left   = Math.random() * areaW + 'px';
    h.style.top    = Math.random() * areaH + 'px';
    h.style.animationDuration = (2 + Math.random() * 2) + 's';
    h.style.animationDelay    = (-Math.random() * 2) + 's';

    h.addEventListener('click',      catchHeart.bind(null, h));
    h.addEventListener('touchstart', catchHeart.bind(null, h), { passive: true });

    area.appendChild(h);
    hearts.push(h);

    // Auto remove after 5s if not caught
    setTimeout(() => { if (h.parentNode) h.remove(); }, 5000);
  }

  function catchHeart(el, e) {
    e.stopPropagation();
    if (!gameActive || el.classList.contains('caught')) return;
    el.classList.add('caught');
    score++;
    scoreEl.textContent = score;

    // mini score pop
    const pop = document.createElement('span');
    pop.textContent = '+1 💕';
    pop.style.cssText = `position:absolute;left:${el.style.left};top:${el.style.top};
      font-family:var(--font-script);color:var(--rose);font-size:1.1rem;
      pointer-events:none;animation:burstFly 0.8s ease forwards;
      --bx:0px;--by:-50px;z-index:5;`;
    area.appendChild(pop);
    setTimeout(() => pop.remove(), 900);

    setTimeout(() => { if (el.parentNode) el.remove(); }, 350);

    if (score >= GOAL) endGame(true);
  }

  function startGame() {
    score = 0;
    gameActive = true;
    scoreEl.textContent = '0';
    startMsg.style.display = 'none';
    winMsg.classList.add('hidden');
    startBtn.textContent = 'Restart 🔄';
    area.innerHTML = '';
    hearts = [];

    // Spawn hearts periodically
    createHeart();
    createHeart();
    spawnInterval = setInterval(() => {
      if (hearts.filter(h => h.parentNode).length < 6) createHeart();
    }, 900);
  }

  function endGame(won) {
    gameActive = false;
    clearInterval(spawnInterval);
    area.innerHTML = '';
    if (won) {
      winMsg.classList.remove('hidden');
      // small confetti burst
      launchConfetti(true);
    }
    startBtn.textContent = 'Play Again 🎀';
  }

  startBtn.addEventListener('click', startGame);
}

/* ============================================================
   CONFETTI — finale & game win
   ============================================================ */
function launchConfetti(mini = false) {
  const canvas  = $('#confetti-canvas') || createMiniCanvas(mini);
  const ctx     = canvas.getContext('2d');
  const pieces  = [];
  const COLORS  = ['#f9c5d1','#f4a0b5','#e8789a','#fde0d0','#e8c49a','#ffffff'];
  const COUNT   = mini ? 60 : 150;

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  for (let i = 0; i < COUNT; i++) {
    pieces.push({
      x:    Math.random() * canvas.width,
      y:    Math.random() * -canvas.height,
      w:    Math.random() * 12 + 4,
      h:    Math.random() * 6  + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot:  Math.random() * 360,
      rotS: (Math.random() - 0.5) * 8,
      vx:   (Math.random() - 0.5) * 3,
      vy:   Math.random() * 3 + 1.5,
      life: 1,
      decay: Math.random() * 0.003 + 0.001,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach(p => {
      p.y   += p.vy;
      p.x   += p.vx;
      p.rot += p.rotS;
      p.life -= p.decay;
      if (p.life <= 0 || p.y > canvas.height + 20) return;
      alive = true;
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    if (alive) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(draw);
}

function createMiniCanvas(mini) {
  // For game section — overlay on body
  const c = document.createElement('canvas');
  c.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:9998;`;
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 4000);
  return c;
}

/* ============================================================
   FINALE SECTION
   ============================================================ */
function initFinale() {
  // Trigger confetti when finale scrolls into view
  const finale = $('#finale');
  let fired = false;
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      launchConfetti();
    }
  }, { threshold: 0.3 });
  observer.observe(finale);

  // Replay button — scroll to top
  $('#replay-btn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => launchConfetti(), 800);
  });

  // QR Code (using a free API)
  initQR();
}

/* ============================================================
   QR CODE GENERATOR
   ============================================================ */
function initQR() {
  const qrContainer = $('#qr-code');
  const urlLabel    = $('#qr-url-label');
  urlLabel.textContent = SITE_URL;

  // Use Google Chart API to generate QR (free, no key needed)
  const encoded  = encodeURIComponent(SITE_URL);
  const qrApiUrl = `https://chart.googleapis.com/chart?cht=qr&chs=140x140&chl=${encoded}&choe=UTF-8`;

  const img = new Image();
  img.onload = () => {
    qrContainer.innerHTML = '';
    img.style.cssText = 'width:100%;height:100%;border-radius:12px;';
    qrContainer.appendChild(img);
  };
  img.onerror = () => {
    qrContainer.innerHTML = `<span style="font-size:2.5rem">📱</span>`;
  };
  img.src = qrApiUrl;
}

/* ============================================================
   INIT ALL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initParticles();
  initMusic();
  initLanding();
  initTypewriter();
  initTimeline();
  initReasons();
  initSecret();
  initGame();
  initFinale();
  initCake();
});

/* ============================================================
   BIRTHDAY CAKE SECTION
   ============================================================ */
function initCake() {
  const canvas  = document.getElementById('cake-canvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  const fwCv    = document.getElementById('cake-fw');
  const fctx    = fwCv.getContext('2d');
  const W = 340, H = 300, TOTAL = 19;

  const CANDLE_COLORS = [
    '#f4a0b5','#a8d8ea','#f9c5d1','#b5e7c8','#fde0d0',
    '#c3b1e1','#ffd6a5','#ffb3c6','#b5ead7','#e2b4bd',
    '#c7ceea','#ffc8dd','#a0c4ff','#fdffb6','#caffbf',
    '#9bf6ff','#ffd6ff','#bde0fe','#ffafcc'
  ];

  const BOTTOM = { x: 30,  y: 185, w: 300, h: 90, r: 14 };
  const TOP    = { x: 80,  y: 110, w: 200, h: 75, r: 12 };

  let candles = [], particles = [];

  function initCandles() {
    candles = [];
    const margin = 18, spacing = (TOP.w - margin * 2) / (TOTAL - 1);
    for (let i = 0; i < TOTAL; i++) {
      candles.push({
        x: TOP.x + margin + i * spacing, y: TOP.y,
        color: CANDLE_COLORS[i], lit: false,
        flicker: Math.random() * Math.PI * 2
      });
    }
  }

  function roundRect(c, x, y, w, h, r, fill) {
    c.fillStyle = fill;
    c.beginPath();
    c.moveTo(x+r,y); c.lineTo(x+w-r,y);
    c.quadraticCurveTo(x+w,y,x+w,y+r); c.lineTo(x+w,y+h-r);
    c.quadraticCurveTo(x+w,y+h,x+w-r,y+h); c.lineTo(x+r,y+h);
    c.quadraticCurveTo(x,y+h,x,y+h-r); c.lineTo(x,y+r);
    c.quadraticCurveTo(x,y,x+r,y);
    c.closePath(); c.fill();
  }

  function drawStripes(x, y, w, h, r) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
    ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r);
    ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r);
    ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath(); ctx.clip();
    ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.lineWidth = 12;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath(); ctx.moveTo(x+i*(w/5),y); ctx.lineTo(x+i*(w/5),y+h); ctx.stroke();
    }
    ctx.restore();
  }

  function strawberry(cx, cy, size) {
    ctx.fillStyle = '#e8567a';
    ctx.beginPath(); ctx.arc(cx,cy,size,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#c0392b';
    ctx.beginPath(); ctx.arc(cx-size*0.2,cy-size*0.2,size*0.25,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx+size*0.3,cy,size*0.2,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#4a7c3f'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(cx,cy-size); ctx.lineTo(cx-size*0.4,cy-size*1.8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy-size); ctx.lineTo(cx+size*0.4,cy-size*1.8); ctx.stroke();
  }

  function drawCake() {
    ctx.clearRect(0,0,W,H);
    // Plate
    ctx.fillStyle='#f0d5b0'; ctx.beginPath();
    ctx.ellipse(W/2,277,155,13,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#e8c896'; ctx.beginPath();
    ctx.ellipse(W/2,275,149,10,0,0,Math.PI*2); ctx.fill();
    // Bottom tier
    roundRect(ctx,BOTTOM.x,BOTTOM.y,BOTTOM.w,BOTTOM.h,BOTTOM.r,'#c17a3a');
    drawStripes(BOTTOM.x,BOTTOM.y,BOTTOM.w,BOTTOM.h,BOTTOM.r);
    ctx.strokeStyle='rgba(0,0,0,0.1)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(BOTTOM.x+BOTTOM.r,BOTTOM.y+28); ctx.lineTo(BOTTOM.x+BOTTOM.w-BOTTOM.r,BOTTOM.y+28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(BOTTOM.x+BOTTOM.r,BOTTOM.y+58); ctx.lineTo(BOTTOM.x+BOTTOM.w-BOTTOM.r,BOTTOM.y+58); ctx.stroke();
    roundRect(ctx,BOTTOM.x-3,BOTTOM.y-12,BOTTOM.w+6,22,8,'#fff0f4');
    for(let i=0;i<9;i++){ctx.fillStyle='#fff0f4';ctx.beginPath();ctx.arc(BOTTOM.x+16+i*30,BOTTOM.y+10,5,0,Math.PI*2);ctx.fill();}
    for(let i=0;i<7;i++) strawberry(BOTTOM.x+22+i*38,BOTTOM.y-8,6);
    // Top tier
    roundRect(ctx,TOP.x,TOP.y,TOP.w,TOP.h,TOP.r,'#d4926a');
    drawStripes(TOP.x,TOP.y,TOP.w,TOP.h,TOP.r);
    ctx.strokeStyle='rgba(0,0,0,0.08)'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(TOP.x+TOP.r,TOP.y+25); ctx.lineTo(TOP.x+TOP.w-TOP.r,TOP.y+25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(TOP.x+TOP.r,TOP.y+50); ctx.lineTo(TOP.x+TOP.w-TOP.r,TOP.y+50); ctx.stroke();
    roundRect(ctx,TOP.x-3,TOP.y-10,TOP.w+6,18,7,'#fff0f4');
    for(let i=0;i<5;i++){ctx.fillStyle='#fff0f4';ctx.beginPath();ctx.arc(TOP.x+20+i*36,TOP.y+8,4,0,Math.PI*2);ctx.fill();}
    for(let i=0;i<4;i++) strawberry(TOP.x+25+i*50,TOP.y-7,5);
  }

  function drawCandles() {
    candles.forEach(c => {
      const cH = 20;
      ctx.fillStyle = c.color;
      ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.roundRect(c.x-3.5, c.y-cH, 7, cH, 2);
      ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(c.x, c.y-cH); ctx.lineTo(c.x, c.y-cH-5); ctx.stroke();
      if (c.lit) {
        c.flicker += 0.13;
        const fx = c.x + Math.sin(c.flicker)*1.5;
        const fy = c.y - cH - 5;
        const flick = Math.cos(c.flicker*1.4)*1.2;
        const grad = ctx.createRadialGradient(fx,fy-5,1,fx,fy-3,9);
        grad.addColorStop(0,'rgba(255,255,180,0.9)');
        grad.addColorStop(0.4,'rgba(255,150,10,0.55)');
        grad.addColorStop(1,'rgba(255,60,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.ellipse(fx,fy-5,6,9+flick,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='rgba(255,220,80,0.95)';
        ctx.beginPath(); ctx.ellipse(fx,fy-4+flick*0.3,2.5,4.5,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.9)';
        ctx.beginPath(); ctx.ellipse(fx,fy-3,1,2,0,0,Math.PI*2); ctx.fill();
      }
    });
  }

  function getHitCandle(mx, my) {
    for (let i = candles.length-1; i >= 0; i--) {
      const c = candles[i];
      if (Math.abs(mx-c.x)<10 && Math.abs(my-(c.y-12))<20) return c;
    }
    return null;
  }

  function updateCakeUI() {
    const lit = candles.filter(c=>c.lit).length;
    document.getElementById('cake-candle-count').textContent = `${lit} / ${TOTAL} candles lit`;
    const st = document.getElementById('cake-status');
    const bb = document.getElementById('cake-blow-btn');
    const rb = document.getElementById('cake-reset-btn');
    if (lit === 0) {
      st.textContent = 'Tap a candle to light it 🕯️';
      bb.style.display='none'; rb.style.display='none';
    } else if (lit === TOTAL) {
      st.textContent = 'All 19 candles lit! 🎂';
      bb.textContent='Blow them all out 💨'; bb.style.display='inline-block'; rb.style.display='none';
    } else {
      st.textContent = `${lit} candle${lit>1?'s':''} glowing ✨`;
      bb.textContent=`Blow out ${lit} candle${lit>1?'s':''} 💨`;
      bb.style.display='inline-block'; rb.style.display='none';
    }
  }

  function updateFWParticles() {
    fctx.clearRect(0,0,W,H);
    for (let i=particles.length-1; i>=0; i--) {
      const p=particles[i];
      p.x+=p.vx; p.y+=p.vy; p.life-=p.decay;
      if (p.life<=0){particles.splice(i,1);continue;}
      if(p.type==='smoke'){
        fctx.globalAlpha=p.life*0.3; fctx.fillStyle='#aaa';
        fctx.beginPath(); fctx.arc(p.x,p.y,p.size*(1.8-p.life),0,Math.PI*2); fctx.fill();
      } else {
        fctx.globalAlpha=p.life; fctx.fillStyle=p.color;
        fctx.beginPath(); fctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2); fctx.fill();
      }
    }
    fctx.globalAlpha=1;
  }

  function loop() { drawCake(); drawCandles(); updateFWParticles(); requestAnimationFrame(loop); }

  canvas.addEventListener('click', e => {
    const rect=canvas.getBoundingClientRect(), sx=W/rect.width;
    const hit=getHitCandle((e.clientX-rect.left)*sx,(e.clientY-rect.top)*sx);
    if(hit){hit.lit=!hit.lit; updateCakeUI();}
  });
  canvas.addEventListener('touchstart', e=>{
    e.preventDefault();
    const rect=canvas.getBoundingClientRect(), sx=W/rect.width, t=e.touches[0];
    const hit=getHitCandle((t.clientX-rect.left)*sx,(t.clientY-rect.top)*sx);
    if(hit){hit.lit=!hit.lit; updateCakeUI();}
  },{passive:false});

  document.getElementById('cake-blow-btn').addEventListener('click', () => {
    const FW_COLORS=['#f9c5d1','#f4a0b5','#fde0d0','#b5e7c8','#a8d8ea','#c3b1e1','#ffd6a5'];
    candles.forEach(c=>{
      if(!c.lit)return;
      for(let s=0;s<5;s++) particles.push({
        type:'smoke',x:c.x,y:c.y-42,
        vx:(Math.random()-0.5)*1.5,vy:-(Math.random()*1.2+0.4),
        life:1,decay:0.022,size:Math.random()*5+3
      });
      c.lit=false;
    });
    document.getElementById('cake-status').textContent='Make a wish! 🌟';
    document.getElementById('cake-candle-count').textContent='0 / 19 candles lit';
    document.getElementById('cake-blow-btn').style.display='none';
    document.getElementById('cake-reset-btn').style.display='inline-block';
    // Fireworks
    let count=0;
    const burst=()=>{
      const x=40+Math.random()*260, y=20+Math.random()*120;
      for(let i=0;i<22;i++){
        const a=(i/22)*Math.PI*2, sp=2+Math.random()*3;
        particles.push({type:'fw',x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,
          color:FW_COLORS[Math.floor(Math.random()*FW_COLORS.length)],life:1,decay:0.022,size:3+Math.random()*2});
      }
      if(++count<8) setTimeout(burst,300);
    };
    burst();
    // Show letter after short delay
    setTimeout(()=>{
      document.getElementById('cake-letter').classList.remove('hidden');
    }, 1200);
  });

  document.getElementById('cake-reset-btn').addEventListener('click', ()=>{
    candles.forEach(c=>c.lit=false); updateCakeUI();
  });

  document.getElementById('letter-close-btn').addEventListener('click', ()=>{
    document.getElementById('cake-letter').classList.add('hidden');
  });

  initCandles(); updateCakeUI(); requestAnimationFrame(loop);
}
