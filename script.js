// =============================================
// LOADER
// =============================================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader')?.classList.add('hidden');
  }, 1600);
});

// =============================================
// CUSTOM CURSOR
// =============================================
const cur = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  if (cur) {
    cur.style.left = (mx - 9) + 'px';
    cur.style.top  = (my - 9) + 'px';
  }
});

setInterval(() => {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  if (trail) {
    trail.style.left = (tx - 19) + 'px';
    trail.style.top  = (ty - 19) + 'px';
  }
}, 16);

// Cursor hover effects
document.querySelectorAll('button, a, .prog-card, .why-card, .act-item, .gallery-item')
  .forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cur) { cur.style.transform = 'scale(2)'; cur.style.background = 'var(--yellow)'; }
    });
    el.addEventListener('mouseleave', () => {
      if (cur) { cur.style.transform = 'scale(1)'; cur.style.background = 'var(--orange)'; }
    });
  });

// =============================================
// SMOOTH SCROLL
// =============================================
function scrollSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// =============================================
// FORM FOCUS
// =============================================
function focusForm() {
  const form = document.getElementById('admParent');
  if (form) {
    form.focus();
    form.style.borderColor = 'var(--orange)';
  }
}

// =============================================
// NAVBAR SCROLL EFFECT
// =============================================
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 60);
});

// =============================================
// MOBILE MENU
// =============================================
function toggleMenu() {
  document.querySelector('.mob-menu')?.classList.toggle('open');
}

function closeMenu() {
  document.querySelector('.mob-menu')?.classList.remove('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('nav') && !e.target.closest('.mob-menu')) {
    closeMenu();
  }
});

// =============================================
// REVEAL ON SCROLL (IntersectionObserver)
// =============================================
const revObs = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach(r => revObs.observe(r));

// =============================================
// COUNTER ANIMATION
// =============================================
const cObs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = 1;
      const tgt = parseInt(e.target.dataset.target);
      let v = 0;
      const step = tgt / 120;
      const t = setInterval(() => {
        v += step;
        if (v >= tgt) { v = tgt; clearInterval(t); }
        e.target.textContent =
          Math.floor(v) + (tgt === 98 ? '%' : tgt === 15 ? '' : '+');
      }, 16);
    }
  }),
  { threshold: 0.3 }
);
document.querySelectorAll('.stat-num').forEach(s => cObs.observe(s));

// =============================================
// TESTIMONIALS SLIDER
// =============================================
let tIdx = 0;

function slideTestimonials(dir) {
  const track = document.getElementById('testiTrack');
  if (!track) return;
  const vis = window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;
  tIdx = Math.max(0, Math.min(tIdx + dir, track.children.length - vis));
  track.style.transform =
    `translateX(-${tIdx * (track.children[0].offsetWidth + 22)}px)`;
}

// =============================================
// CONFETTI
// =============================================
function triggerConfetti() {
  ['#FFE566', '#FF8C42', '#A8DCFF', '#FFB3C6', '#B8F0B0', '#D4B8FF'].forEach(c => {
    for (let i = 0; i < 14; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left:${Math.random() * 100}vw;
        background:${c};
        width:${Math.random() * 9 + 5}px;
        height:${Math.random() * 9 + 5}px;
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration:${Math.random() * 1.8 + 1.4}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3200);
    }
  });
}

// =============================================
// GALLERY LIGHTBOX
// =============================================
function openLightbox(activity, emojis, colors) {
  document.getElementById('lbTitle').textContent = '📸 ' + activity;
  const grid = document.getElementById('lbImgs');
  grid.innerHTML = '';
  const ems  = emojis.split(',');
  const cols = colors.split(',');
  const caps = [
    'Kids in action! 🌟',
    'Happy moments 😊',
    'Learning through fun 🎉',
    'Memories forever 💛'
  ];
  ems.forEach((em, i) => {
    const d = document.createElement('div');
    d.className = 'lb-card';
    d.innerHTML = `
      <div class="lb-inner" style="background:linear-gradient(135deg,${cols[i] || cols[0]},${cols[(i + 1) % cols.length] || cols[0]});">
        ${em.trim()}
        <p>${caps[i]}</p>
      </div>`;
    grid.appendChild(d);
  });
  document.getElementById('galleryLightbox')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('galleryLightbox')?.classList.remove('open');
  document.body.style.overflow = '';
}

// =============================================
// GALLERY SINGLE PHOTO LIGHTBOX
// =============================================
function openPhotoLightbox(src, caption) {
  const titleEl = document.getElementById('lbTitle');
  const imgsEl = document.getElementById('lbImgs');
  if (titleEl) titleEl.textContent = '📸 ' + caption;
  if (imgsEl) {
    imgsEl.innerHTML = `<img src="${src}" style="width:100%; max-height:420px; object-fit:contain; border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,0.15);">`;
  }
  document.getElementById('galleryLightbox')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// =============================================
// CURRICULUM MILESTONE TABS
// =============================================
function switchMilestone(stage) {
  document.querySelectorAll('.milestone-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.milestone-tab').forEach(t => {
    t.classList.remove('active');
    if (t.getAttribute('onclick')?.includes(`'${stage}'`)) {
      t.classList.add('active');
    }
  });
  document.getElementById('m-' + stage)?.classList.add('active');
}

// =============================================
// WEB AUDIO API SOUND SYNTHESIZER
// =============================================
let audioCtx = null;
function playSound(type) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    
    if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'match') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'win') {
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq, idx) => {
        const noteOsc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();
        noteOsc.connect(noteGain);
        noteGain.connect(audioCtx.destination);
        noteOsc.type = 'triangle';
        noteOsc.frequency.setValueAtTime(freq, now + idx * 0.1);
        noteGain.gain.setValueAtTime(0.25, now + idx * 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);
        noteOsc.start(now + idx * 0.1);
        noteOsc.stop(now + idx * 0.1 + 0.25);
      });
    } else if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (err) {
    console.warn("Audio Context error: ", err);
  }
}

// =============================================
// GAME DASHBOARD SELECTOR
// =============================================
function selectGame(gameId) {
  clearInterval(bubTimer);
  clearInterval(bubSpawnTimer);
  isBubGameActive = false;
  
  document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.game-tab').forEach(t => {
    t.classList.remove('active');
    if (t.getAttribute('onclick')?.includes(`'${gameId}'`)) {
      t.classList.add('active');
    }
  });
  
  document.getElementById('game-' + gameId)?.classList.add('active');
  
  if (gameId === 'memory') {
    resetMemoryGame();
  } else if (gameId === 'sorter') {
    resetSorterGame();
  } else if (gameId === 'bubble') {
    const prompt = document.getElementById('bubStartPrompt');
    if (prompt) prompt.style.display = 'flex';
    document.getElementById('bubWinOverlay')?.classList.remove('active');
    document.getElementById('bubblePlayfield')?.querySelectorAll('.game-bubble').forEach(b => b.remove());
  }
}

// =============================================
// GAME 1: JUMBO'S MEMORY MATCH
// =============================================
let flippedCards = [];
let memMoves = 0;
let memTime = 0;
let memInterval = null;
let isFlippingBusy = false;

function resetMemoryGame() {
  clearInterval(memInterval);
  flippedCards = [];
  memMoves = 0;
  memTime = 0;
  isFlippingBusy = false;
  
  const movesEl = document.getElementById('mem-moves');
  const timeEl = document.getElementById('mem-time');
  if (movesEl) movesEl.textContent = '0';
  if (timeEl) timeEl.textContent = '0s';
  document.getElementById('memWinOverlay')?.classList.remove('active');
  
  const emojis = ['🐘', '🦁', '🐼', '🎨', '🌈', '🍎', '🎈', '⭐'];
  const cardData = [...emojis, ...emojis];
  cardData.sort(() => Math.random() - 0.5);
  
  const grid = document.getElementById('memoryGrid');
  if (!grid) return;
  grid.innerHTML = '';
  
  cardData.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.innerHTML = `
      <div class="card-back">❓</div>
      <div class="card-front">${emoji}</div>
    `;
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
  });
  
  // Custom cursor hover effects for new cards
  grid.querySelectorAll('.memory-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const cur = document.getElementById('cursor');
      if (cur) { cur.style.transform = 'scale(2)'; cur.style.background = 'var(--yellow)'; }
    });
    el.addEventListener('mouseleave', () => {
      const cur = document.getElementById('cursor');
      if (cur) { cur.style.transform = 'scale(1)'; cur.style.background = 'var(--orange)'; }
    });
  });
  
  memInterval = setInterval(() => {
    memTime++;
    if (timeEl) timeEl.textContent = memTime + 's';
  }, 1000);
}

function flipCard(card) {
  if (isFlippingBusy || card.classList.contains('flipped') || flippedCards.includes(card)) return;
  
  card.classList.add('flipped');
  flippedCards.push(card);
  
  if (flippedCards.length === 2) {
    memMoves++;
    const movesEl = document.getElementById('mem-moves');
    if (movesEl) movesEl.textContent = memMoves;
    checkMemoryMatch();
  }
}

function checkMemoryMatch() {
  isFlippingBusy = true;
  const [c1, c2] = flippedCards;
  if (c1.dataset.emoji === c2.dataset.emoji) {
    playSound('match');
    flippedCards = [];
    isFlippingBusy = false;
    
    const allCards = document.querySelectorAll('.memory-card');
    const allFlipped = Array.from(allCards).every(c => c.classList.contains('flipped'));
    if (allFlipped) {
      clearInterval(memInterval);
      setTimeout(() => {
        const wMoves = document.getElementById('win-moves');
        const wTime = document.getElementById('win-time');
        if (wMoves) wMoves.textContent = memMoves;
        if (wTime) wTime.textContent = memTime;
        document.getElementById('memWinOverlay')?.classList.add('active');
        playSound('win');
        triggerConfetti();
      }, 500);
    }
  } else {
    setTimeout(() => {
      c1.classList.remove('flipped');
      c2.classList.remove('flipped');
      flippedCards = [];
      isFlippingBusy = false;
    }, 1000);
  }
}

// =============================================
// GAME 2: PHONICS BUBBLE POP
// =============================================
let bubScore = 0;
let bubTimeLeft = 30;
let bubTimer = null;
let bubSpawnTimer = null;
let isBubGameActive = false;

function startBubbleGame() {
  clearInterval(bubTimer);
  clearInterval(bubSpawnTimer);
  isBubGameActive = true;
  
  const startPrompt = document.getElementById('bubStartPrompt');
  if (startPrompt) startPrompt.style.display = 'none';
  document.getElementById('bubWinOverlay')?.classList.remove('active');
  
  bubScore = 0;
  bubTimeLeft = 30;
  const scoreEl = document.getElementById('bub-score');
  const timeEl = document.getElementById('bub-time');
  if (scoreEl) scoreEl.textContent = '0';
  if (timeEl) timeEl.textContent = '30s';
  
  const playfield = document.getElementById('bubblePlayfield');
  if (!playfield) return;
  playfield.querySelectorAll('.game-bubble').forEach(b => b.remove());
  
  bubTimer = setInterval(() => {
    bubTimeLeft--;
    if (timeEl) timeEl.textContent = bubTimeLeft + 's';
    
    if (bubTimeLeft <= 0) {
      endBubbleGame();
    }
  }, 1000);
  
  bubSpawnTimer = setInterval(() => {
    if (isBubGameActive) spawnBubble();
  }, 700);
}

function spawnBubble() {
  const playfield = document.getElementById('bubblePlayfield');
  if (!playfield) return;
  
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z'];
  const randLetter = letters[Math.floor(Math.random() * letters.length)];
  
  const bubble = document.createElement('div');
  bubble.className = 'game-bubble';
  bubble.textContent = randLetter;
  
  const size = Math.floor(Math.random() * 20) + 50; 
  bubble.style.width = size + 'px';
  bubble.style.height = size + 'px';
  bubble.style.fontSize = (size * 0.4) + 'px';
  
  const startX = Math.random() * (playfield.clientWidth - size - 20) + 10;
  bubble.style.left = startX + 'px';
  bubble.style.top = '380px'; 
  
  const colors = ['#FFE566', '#FF8C42', '#A8DCFF', '#FFB3C6', '#B8F0B0', '#D4B8FF'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 40%, ${randomColor} 80%)`;
  
  const clickHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    popBubble(bubble);
  };
  
  bubble.addEventListener('mousedown', clickHandler);
  bubble.addEventListener('touchstart', clickHandler);
  
  // Custom cursor hover effects for bubble
  bubble.addEventListener('mouseenter', () => {
    const cur = document.getElementById('cursor');
    if (cur) { cur.style.transform = 'scale(2)'; cur.style.background = 'var(--yellow)'; }
  });
  bubble.addEventListener('mouseleave', () => {
    const cur = document.getElementById('cursor');
    if (cur) { cur.style.transform = 'scale(1)'; cur.style.background = 'var(--orange)'; }
  });
  
  playfield.appendChild(bubble);
  
  let currentTop = 380;
  const speed = Math.random() * 1.5 + 1.2; 
  
  function step() {
    if (!isBubGameActive || !bubble.parentNode) return;
    currentTop -= speed;
    bubble.style.top = currentTop + 'px';
    
    const wobbleX = Math.sin(currentTop / 15) * 3;
    bubble.style.transform = `translateX(${wobbleX}px)`;
    
    if (currentTop < -80) {
      bubble.remove();
    } else {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

function popBubble(bubble) {
  if (!isBubGameActive) return;
  playSound('pop');
  
  bubble.style.transition = 'all 0.15s ease-out';
  bubble.style.transform = 'scale(1.4)';
  bubble.style.opacity = '0';
  
  bubScore++;
  const scoreEl = document.getElementById('bub-score');
  if (scoreEl) scoreEl.textContent = bubScore;
  
  setTimeout(() => bubble.remove(), 120);
}

function endBubbleGame() {
  isBubGameActive = false;
  clearInterval(bubTimer);
  clearInterval(bubSpawnTimer);
  
  const wBubScore = document.getElementById('win-bub-score');
  if (wBubScore) wBubScore.textContent = bubScore;
  document.getElementById('bubWinOverlay')?.classList.add('active');
  playSound('win');
  triggerConfetti();
}

// =============================================
// GAME 3: COLOR & SHAPE SORTER
// =============================================
let sortScore = 0;
let selectedItem = null;

function resetSorterGame() {
  sortScore = 0;
  selectedItem = null;
  const scoreEl = document.getElementById('sort-score');
  if (scoreEl) scoreEl.textContent = '0';
  document.getElementById('sortWinOverlay')?.classList.remove('active');
  
  const itemsData = [
    { emoji: '🍎', color: 'red', label: 'Red Apple' },
    { emoji: '🎈', color: 'blue', label: 'Blue Balloon' },
    { emoji: '⭐', color: 'yellow', label: 'Yellow Star' },
    { emoji: '🍃', color: 'green', label: 'Green Leaf' }
  ];
  
  itemsData.sort(() => Math.random() - 0.5);
  
  const itemsContainer = document.getElementById('sorterItems');
  if (!itemsContainer) return;
  itemsContainer.innerHTML = '';
  
  itemsData.forEach(item => {
    const div = document.createElement('div');
    div.className = 'draggable-item';
    div.textContent = item.emoji;
    div.draggable = true;
    div.dataset.color = item.color;
    div.title = item.label;
    
    div.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.color);
      div.style.opacity = '0.5';
      selectedItem = div;
    });
    div.addEventListener('dragend', () => {
      div.style.opacity = '1';
    });
    
    div.addEventListener('click', () => {
      document.querySelectorAll('.draggable-item').forEach(i => {
        i.style.border = 'none';
        i.style.transform = 'scale(1)';
      });
      selectedItem = div;
      div.style.border = '3px solid var(--orange)';
      div.style.transform = 'scale(1.15)';
      playSound('correct'); 
    });
    
    // Custom cursor hover effects for sorting items
    div.addEventListener('mouseenter', () => {
      const cur = document.getElementById('cursor');
      if (cur) { cur.style.transform = 'scale(2)'; cur.style.background = 'var(--yellow)'; }
    });
    div.addEventListener('mouseleave', () => {
      const cur = document.getElementById('cursor');
      if (cur) { cur.style.transform = 'scale(1)'; cur.style.background = 'var(--orange)'; }
    });
    
    itemsContainer.appendChild(div);
  });
  
  document.querySelectorAll('.bucket').forEach(b => {
    b.classList.remove('drag-over');
    b.style.opacity = '1';
    b.style.transform = 'scale(1)';
  });
}

function allowDrop(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const bucket = e.currentTarget;
  bucket.classList.remove('drag-over');
  
  const itemColor = e.dataTransfer.getData('text/plain') || (selectedItem ? selectedItem.dataset.color : '');
  const bucketColor = bucket.dataset.color;
  
  if (itemColor === bucketColor) {
    handleCorrectSort(bucket);
  } else {
    handleIncorrectSort(bucket);
  }
}

// Mobile/tap selector helper setup
document.querySelectorAll('.bucket').forEach(bucket => {
  bucket.addEventListener('click', () => {
    if (selectedItem) {
      const itemColor = selectedItem.dataset.color;
      const bucketColor = bucket.dataset.color;
      if (itemColor === bucketColor) {
        handleCorrectSort(bucket);
      } else {
        handleIncorrectSort(bucket);
      }
    }
  });
  
  // Custom cursor hover effects for buckets
  bucket.addEventListener('mouseenter', () => {
    const cur = document.getElementById('cursor');
    if (cur) { cur.style.transform = 'scale(2)'; cur.style.background = 'var(--yellow)'; }
  });
  bucket.addEventListener('mouseleave', () => {
    const cur = document.getElementById('cursor');
    if (cur) { cur.style.transform = 'scale(1)'; cur.style.background = 'var(--orange)'; }
  });
  
  bucket.addEventListener('dragenter', (e) => {
    e.preventDefault();
    bucket.classList.add('drag-over');
  });
  bucket.addEventListener('dragleave', () => {
    bucket.classList.remove('drag-over');
  });
});

function handleCorrectSort(bucket) {
  if (!selectedItem) return;
  playSound('correct');
  
  bucket.style.transform = 'scale(1.15)';
  setTimeout(() => bucket.style.transform = 'scale(1)', 300);
  
  selectedItem.remove();
  selectedItem = null;
  
  sortScore++;
  const scoreEl = document.getElementById('sort-score');
  if (scoreEl) scoreEl.textContent = sortScore;
  
  if (sortScore === 4) {
    setTimeout(() => {
      document.getElementById('sortWinOverlay')?.classList.add('active');
      playSound('win');
      triggerConfetti();
    }, 600);
  }
}

function handleIncorrectSort(bucket) {
  playSound('wrong');
  
  bucket.style.transform = 'translateX(-10px)';
  setTimeout(() => bucket.style.transform = 'translateX(10px)', 80);
  setTimeout(() => bucket.style.transform = 'translateX(-10px)', 160);
  setTimeout(() => bucket.style.transform = 'translateX(0)', 240);
  
  if (selectedItem) {
    selectedItem.style.transform = 'scale(1)';
    selectedItem.style.border = 'none';
    selectedItem = null;
  }
}

// =============================================
// INITIALIZE ON LOAD
// =============================================
window.addEventListener('load', () => {
  resetMemoryGame();
  resetSorterGame();
});

// =============================================
// SUCCESS MODAL
// =============================================
function closeModal() {
  document.getElementById('successModal')?.classList.remove('open');
  document.body.style.overflow = '';
}

// =============================================
// PARALLAX FLOATING ELEMENTS
// =============================================
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  document.querySelectorAll('.floating').forEach((el, i) => {
    el.style.transform = `
      translateY(${Math.sin(y / 200 + i) * 14}px)
      rotate(${Math.sin(y / 280 + i) * 7}deg)
    `;
  });
});

// =============================================
// GALLERY FILTER
// =============================================
function filterGallery(category) {
  const items   = document.querySelectorAll('.gallery-photo');
  const buttons = document.querySelectorAll('.filter-btn');

  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  items.forEach(item => {
    if (category === 'all' || item.classList.contains(category)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// =============================================
// SUPABASE FORM SUBMISSION
// =============================================
let mainSupabaseClient = null;

function initMainSupabase() {
  const isConfigured = 
    typeof SUPABASE_URL !== 'undefined' && 
    typeof SUPABASE_ANON_KEY !== 'undefined' &&
    SUPABASE_URL && 
    SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL' && 
    SUPABASE_ANON_KEY && 
    SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';

  if (isConfigured) {
    try {
      mainSupabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (err) {
      console.error("Failed to initialize main page Supabase client:", err);
    }
  }
}

// Initialize Supabase client and listener immediately
initMainSupabase();
fetchBirthdays();

const form = document.getElementById('enquiryForm');
if (form) {
  form.addEventListener('submit', handleEnquirySubmit);
}

async function handleEnquirySubmit(event) {
  event.preventDefault();
  
  const submitBtn = document.getElementById('enquirySubmitBtn');
  const parentName = document.getElementById('admParent').value;
  const mobile = document.getElementById('admMobile').value;
  const childName = document.getElementById('admChild').value;
  const program = document.getElementById('admProgram').value;
  const email = document.getElementById('admEmail').value;
  const message = document.getElementById('admMessage').value;

  if (!mainSupabaseClient) {
    alert("Supabase is not configured yet! Please edit config.js with your project credentials.");
    return;
  }

  // Set loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = '🎒 Submitting Enquiry...';
  }

  try {
    const { error } = await mainSupabaseClient
      .from('enquiries')
      .insert([
        {
          parent_name: parentName,
          mobile: mobile,
          child_name: childName,
          program: program,
          email: email || null,
          message: message || null,
          status: 'pending'
        }
      ]);

    if (error) throw error;

    // Reset Form
    event.target.reset();

    // Show Success Modal
    const modal = document.getElementById('successModal');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    
    // Play Sound & Confetti
    playSound('win');
    triggerConfetti();

  } catch (err) {
    console.error("Error submitting to Supabase:", err);
    alert("Sorry! There was an issue submitting your enquiry: " + err.message);
  } finally {
    // Restore button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '🎒 Submit Enquiry & Get a Call Back';
    }
  }
}

// =============================================
// FETCH & DISPLAY BIRTHDAYS
// =============================================
async function fetchBirthdays() {
  if (!mainSupabaseClient) return;

  try {
    const { data: students, error } = await mainSupabaseClient
      .from('students')
      .select('*');

    if (error) throw error;
    if (!students || students.length === 0) return;

    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() is 0-indexed
    const currentDay = today.getDate();

    // Filter students whose birthday is today
    const birthdayStudents = students.filter(student => {
      if (!student.birth_date) return false;
      // Ensure we compare date components from YYYY-MM-DD
      const bMonth = parseInt(student.birth_date.split('-')[1]);
      const bDay = parseInt(student.birth_date.split('-')[2]);
      
      return bMonth === currentMonth && bDay === currentDay;
    });

    if (birthdayStudents.length > 0) {
      const section = document.getElementById('birthdays');
      const grid = document.getElementById('birthday-grid');
      
      if (section && grid) {
        section.style.display = 'block'; // Show the section
        grid.innerHTML = ''; // Clear previous

        birthdayStudents.forEach(student => {
          const card = document.createElement('div');
          card.className = 'birthday-card';
          
          // Use an inline SVG placeholder if photo_url is missing
          const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FFE566"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/%3E%3C/svg%3E';
          const photoUrl = student.photo_url ? student.photo_url : defaultAvatar;

          card.innerHTML = \`
            <img class="birthday-img" src="\${photoUrl}" alt="\${student.student_name}">
            <h3>\${student.student_name}</h3>
            <p>\${student.class_name ? student.class_name : 'Little Champion'}</p>
          \`;
          grid.appendChild(card);
        });
      }
    }
  } catch (err) {
    console.error('Error fetching birthdays:', err);
  }
}