/* ════════════════════════════════════════
   CONFIG — modifica qui
════════════════════════════════════════ */
const C = {
  address: "Via Gandolfi, 21 - Alessandria",

  music: {
    spotifyPlaylist: "https://open.spotify.com/playlist/1WwdJ7KVWoZdESdDYvY88j?si=73ee6fe5b00c45af&pt=9e576b5cc196cd3fde47275c5cfd14b2",
    youtube1:        "https://music.youtube.com/playlist?list=PLTirHryYJPRIcS0j46BfrZuF5pNgo8QrB&jct=55Lcn4L5bza5_Z0peyILuQ",
  },

  board: {
    url: "https://excalidraw.com/#room=8c0d73e0e6ef4b09e1f7,m8yPQ-nPzT60cNsbPypTmQ",
  },

  map: {
    osmBbox:  "8.60403,44.8932,8.61203,44.9012",
    gAddress: "Via+Gandolfi+21+Alessandria",
  },

  photos: {
    album: "https://drive.proton.me/urls/W7969F36ZW#Lx8ACeAe2KmE",
  },

  guestbook: {
    tally: "https://tally.so/r/kdRRld",
  },

  games: [
    {n:"Skribbl.io",   i:"<i data-lucide='palette'></i>", d:"Disegna e indovina · 2–16",  u:"https://skribbl.io"},
    {n:"Gartic Phone", i:"<i data-lucide='phone-call'></i>", d:"Telefono senza fili",         u:"https://garticphone.com"},
    {n:"Kahoot!",      i:"<i data-lucide='brain'></i>", d:"Quiz live · crea il tuo",     u:"https://kahoot.it"},
    {n:"GeoGuessr",    i:"<i data-lucide='globe'></i>", d:"Indovina dove sei nel mondo", u:"https://www.geoguessr.com"},
  ],
};

/* ════════════════════════════════════════
   CARD DATA
════════════════════════════════════════ */
const ALL_CARDS = [
  {id:"music",    i:"<i data-lucide='music'></i>", t:"Musica",    s:"Spotify · YouTube", acc:"#FF2D78", accS:"rgba(255,45,120,.22)",  b:null,  bv:false},
  {id:"games",    i:"<i data-lucide='gamepad-2'></i>", t:"Giochi",    s:"Multiplayer",       acc:"#9B2DFF", accS:"rgba(155,45,255,.22)",  b:"New", bv:true},
  {id:"board",    i:"<i data-lucide='pen-tool'></i>", t:"Lavagna",   s:"Excalidraw",        acc:"#2D8FFF", accS:"rgba(45,143,255,.22)",  b:"∞",   bv:false},
  {id:"photos",   i:"<i data-lucide='image'></i>", t:"Drive",     s:"File condivisi",    acc:"#FFD02D", accS:"rgba(255,208,45,.22)",  b:null,  bv:false},
  {id:"food",     i:"<i data-lucide='pizza'></i>", t:"Cibo",      s:"Delivery",          acc:"#FF7A2D", accS:"rgba(255,122,45,.22)",  b:null,  bv:false},
  {id:"map",      i:"<i data-lucide='map-pin'></i>", t:"Zona",      s:"Bar · Taxi · +",    acc:"#00E8AA", accS:"rgba(0,232,170,.22)",   b:null,  bv:false},
  {id:"contacts", i:"<i data-lucide='phone'></i>", t:"Contatti",  s:"Numeri utili",      acc:"#FF7A2D", accS:"rgba(255,122,45,.22)",  b:null,  bv:false},
  {id:"guestbook",i:"<i data-lucide='book-open'></i>",  t:"Guestbook", s:"Lascia un segno",  acc:"#00CCFF", accS:"rgba(0,204,255,.22)",   b:null,  bv:false},
];

/* Disposizione honeycomb 3-2-3
   Ogni elemento: {row, col} — col può essere .5 per offset */
const HIVE_LAYOUT = [
  {row:0, col:0}, // music
  {row:0, col:1}, // games
  {row:0, col:2}, // board
  {row:1, col:.5},// photos
  {row:1, col:1.5},// food
  {row:2, col:0}, // map
  {row:2, col:1}, // contacts
  {row:2, col:2}, // guestbook
];

const NAV_PRIMARY = ["","music","games","map"];
const SHEET_ITEMS = ALL_CARDS.filter(c => !NAV_PRIMARY.includes(c.id));

/* ════════════════════════════════════════
   TEMA
════════════════════════════════════════ */
(function(){
  const saved = localStorage.getItem('Ittroiaio_theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.dataset.theme = saved;
})();

function toggleTheme(){
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  document.getElementById('theme-icon').textContent = next === 'light' ? '🌙' : '☀️';
  localStorage.setItem('Ittroiaio_theme', next);
  document.querySelector('meta[name="theme-color"]').content = next === 'light' ? '#ECF0F8' : '#060A14';
}
function syncThemeIcon(){
  const t = document.documentElement.dataset.theme;
  const el = document.getElementById('theme-icon');
  if(el) el.textContent = t === 'light' ? '🌙' : '☀️';
}

/* ════════════════════════════════════════
   ROUTER
════════════════════════════════════════ */
function go(sec){ haptic(); closeSheet(); location.hash = sec ? '#'+sec : '#'; }
function haptic(ms=6){ try{ if(navigator.vibrate) navigator.vibrate(ms); }catch(e){} }

function route(){
  const hash = location.hash.replace(/^#\/?/,'').trim();
  const sec  = hash || '';

  // Animate out current page
  const curPg = document.querySelector('.page.active');
  if(curPg){
    curPg.classList.remove('active');
    curPg.classList.add('exiting');
    const done = () => curPg.classList.remove('exiting');
    curPg.addEventListener('animationend', done, {once:true});
    setTimeout(done, 240); // fallback
  }

  const pg = document.getElementById('page-'+sec);
  if(!pg){ location.hash='#'; return; }

  setTimeout(()=>{
    pg.classList.add('active');
    window.scrollTo(0, 0);
  }, curPg ? 55 : 0);

  const card = ALL_CARDS.find(c => c.id === sec);
  document.getElementById('bar-crumb').textContent = sec ? (card ? card.t : sec) : '';
  document.getElementById('back-btn').classList.toggle('on', sec !== '');
  document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('active'));
  const bn = document.getElementById('bn-'+(sec||'home'));
  if(bn) bn.classList.add('active');
  else   document.getElementById('bn-altro').classList.add('active');

  // Re-center hive when returning home
  if(sec === '' && window._hiveReset) window._hiveReset();
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', () => {
  syncThemeIcon();
  buildHive();
  buildSheetGrid();
  injectConfig();
  buildGames();
  buildStars();
  loadGB();
  route();

  initSwipeBack();
  initSheetDrag();
  initScrollEffect();
  lucide.createIcons();
});

function initScrollEffect(){
  const bar = document.querySelector('.bar');
  let t = false;
  window.addEventListener('scroll', () => {
    if(!t){
      requestAnimationFrame(() => {
        bar.classList.toggle('scrolled', window.scrollY > 8);
        t = false;
      });
      t = true;
    }
  }, {passive:true});
}

/* ════════════════════════════════════════
   BUILD HONEYCOMB
════════════════════════════════════════ */
function buildHive(){
  document.getElementById('hero-addr').textContent = C.address;

  const container = document.getElementById('hive-container');
  if(!container) return;

  let dragMoved = false;

  // Dimensioni responsive
  const vw = window.innerWidth;
  const HW = vw < 380 ? 88 : vw < 520 ? 98 : vw < 720 ? 108 : 118;
  const HH = Math.round(HW * 1.1547);
  const GAP = vw < 520 ? 7 : 10;

  // Dimensioni griglia
  // 3 colonne → larghezza = 3*HW + 2*GAP
  // 3 righe con offset → altezza = 2*(HH*0.75 + GAP) + HH
  const colW  = HW + GAP;
  const rowH  = HH * 0.75 + GAP * 0.6;
  const totalW = 3 * HW + 2 * GAP;
  const totalH = Math.round(rowH * 2 + HH);

  container.style.width  = totalW + 'px';
  container.style.height = totalH + 'px';

  // Crea SVG per linee
  const svg = document.getElementById('hive-svg');
  svg.setAttribute('viewBox', `0 0 ${totalW} ${totalH}`);

  // Calcola centri hex
  const centers = HIVE_LAYOUT.map(pos => ({
    x: pos.col * colW + HW / 2,
    y: pos.row * rowH + HH / 2,
  }));

  // Disegna linee tra hex adiacenti (distanza ≤ colW * 1.15)
  const maxDist = colW * 1.15;
  const lines = [];
  for(let i = 0; i < centers.length; i++){
    for(let j = i+1; j < centers.length; j++){
      const dx = centers[i].x - centers[j].x;
      const dy = centers[i].y - centers[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist <= maxDist){
        const line = document.createElementNS('http://www.w3.org/2000/svg','line');
        line.setAttribute('x1', centers[i].x);
        line.setAttribute('y1', centers[i].y);
        line.setAttribute('x2', centers[j].x);
        line.setAttribute('y2', centers[j].y);
        const len = Math.round(dist) + 10;
        line.setAttribute('stroke-dasharray', len);
        line.setAttribute('stroke-dashoffset', len);
        svg.appendChild(line);
        lines.push({el: line, delay: Math.min(centers[i].y, centers[j].y) / totalH});
      }
    }
  }

  // Crea hex elements
  const wraps = [];
  ALL_CARDS.forEach((card, i) => {
    const pos = HIVE_LAYOUT[i];
    const cx  = pos.col * colW;
    const cy  = Math.round(pos.row * rowH);

    const wrap = document.createElement('div');
    wrap.className = 'hex-wrap';
    wrap.style.left   = cx + 'px';
    wrap.style.top    = cy + 'px';
    wrap.style.width  = HW + 'px';
    wrap.style.height = HH + 'px';
    wrap.style.setProperty('--acc',   card.acc);
    wrap.style.setProperty('--acc-s', card.accS);

    const outer = document.createElement('div');
    outer.className = 'hex-outer';
    outer.onclick = () => { if(!dragMoved) go(card.id); };

    const inner = document.createElement('div');
    inner.className = 'hex-inner';

    // Glow overlay
    const glow = document.createElement('div');
    glow.className = 'hex-glow';

    // Idle pulse overlay
    const pulse = document.createElement('div');
    pulse.className = 'hex-pulse-overlay';
    pulse.style.setProperty('--pulse-dur',   (3.5 + Math.random() * 3) + 's');
    pulse.style.setProperty('--pulse-delay',  (Math.random() * 4) + 's');

    // Content
    const content = document.createElement('div');
    content.className = 'hex-content';
    content.innerHTML = `
      <span class="hex-icon">${card.i}</span>
      <div class="hex-title">${card.t}</div>
      <div class="hex-sub">${card.s}</div>
    `;

    inner.appendChild(glow);
    inner.appendChild(pulse);
    inner.appendChild(content);
    outer.appendChild(inner);

    if(card.b){
      const badge = document.createElement('span');
      badge.className = 'hex-badge';
      badge.textContent = card.b;
      outer.appendChild(badge);
    }

    wrap.appendChild(outer);
    container.appendChild(wrap);
    wraps.push({ wrap, cy });
  });

  // Set section height
  const section = document.getElementById('hive-section');
  if(section) section.style.height = (totalH + 140) + 'px';

  // Index-based stagger reveal
  wraps.forEach(({ wrap }, i) => {
    setTimeout(() => wrap.classList.add('revealed'), 60 + i * 35);
  });
  lines.forEach(({ el }, i) => {
    setTimeout(() => el.classList.add('drawn'), 80 + i * 28);
  });

  // Hover dimming
  wraps.forEach(({ wrap }) => {
    const outer = wrap.querySelector('.hex-outer');
    outer.addEventListener('mouseenter', () => {
      wraps.forEach(({ wrap: w }) => {
        if(w !== wrap) w.classList.add('dimmed');
      });
    });
    outer.addEventListener('mouseleave', () => {
      wraps.forEach(({ wrap: w }) => w.classList.remove('dimmed'));
    });
  });

  // Draggable hive — store reset for use on home return
  if(section){
    const ctrl = initDraggableHive(container, section, (v) => { dragMoved = v; });
    if(ctrl) window._hiveReset = ctrl.resetPosition;
  };
}

/* ════════════════════════════════════════
   DRAGGABLE HIVE
════════════════════════════════════════ */
function initDraggableHive(container, section, onDragState) {
  let active = false, moved = false;
  let startX = 0, startY = 0;
  let curX = 0, curY = 0;
  let velX = 0, velY = 0;
  let prevX = 0, prevY = 0, prevT = 0;
  let rafId = 0;

  // Pinch-to-zoom state
  let scale = 1;
  let pinching = false;
  let initDist = 0;
  let initScale = 1;

  function getPoint(e) {
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX, y: t.clientY };
  }
  function applyPos() {
    container.style.transform = `translate(${curX}px,${curY}px) scale(${scale})`;
  }
  function getTouchDist(e) {
    const t = e.touches;
    const dx = t[0].clientX - t[1].clientX;
    const dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function onStart(e) {
    // Pinch start (2+ fingers)
    if (e.touches && e.touches.length >= 2) {
      pinching = true;
      active = false;
      initDist = getTouchDist(e);
      initScale = scale;
      section.classList.add('is-dragging');
      return;
    }
    cancelAnimationFrame(rafId);
    const { x, y } = getPoint(e);
    active = true; moved = false;
    startX = x - curX;
    startY = y - curY;
    prevX = x; prevY = y; prevT = Date.now();
    velX = velY = 0;
    section.classList.add('is-dragging');
    onDragState(false);
  }

  function onMove(e) {
    // Pinch move
    if (pinching && e.touches && e.touches.length >= 2) {
      e.preventDefault();
      const dist = getTouchDist(e);
      scale = Math.min(3, Math.max(0.5, initScale * (dist / initDist)));
      applyPos();
      return;
    }
    if (!active) return;
    e.preventDefault();
    const { x, y } = getPoint(e);
    const nx = x - startX, ny = y - startY;
    if (!moved && (Math.abs(nx - curX) > 4 || Math.abs(ny - curY) > 4)) {
      moved = true;
      onDragState(true);
    }
    const now = Date.now(), dt = Math.max(1, now - prevT);
    velX = (x - prevX) / dt * 14;
    velY = (y - prevY) / dt * 14;
    prevX = x; prevY = y; prevT = now;
    curX = nx; curY = ny;
    applyPos();
  }

  function onEnd() {
    if (pinching) {
      pinching = false;
      section.classList.remove('is-dragging');
      return;
    }
    if (!active) return;
    active = false;
    section.classList.remove('is-dragging');
    setTimeout(() => onDragState(false), 50);
    function coast() {
      velX *= 0.91; velY *= 0.91;
      if (Math.abs(velX) < 0.15 && Math.abs(velY) < 0.15) return;
      curX += velX; curY += velY;
      applyPos();
      rafId = requestAnimationFrame(coast);
    }
    if (moved) coast();
  }

  function resetPosition(){
    cancelAnimationFrame(rafId);
    container.style.transition = 'transform .5s cubic-bezier(0,.55,.45,1)';
    curX = 0; curY = 0; scale = 1;
    applyPos();
    setTimeout(() => { container.style.transition = ''; }, 520);
  }

  // Double-tap to reset
  let lastTap = 0;
  section.addEventListener('touchend', (e) => {
    if (e.touches && e.touches.length > 0) return;
    const now = Date.now();
    if (now - lastTap < 300) {
      resetPosition();
    }
    lastTap = now;
  });

  // Mouse wheel zoom
  section.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.92 : 1.08;
    scale = Math.min(3, Math.max(0.5, scale * factor));
    applyPos();
  }, { passive: false });

  section.addEventListener('mousedown', onStart);
  section.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('mousemove', onMove, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('mouseup', onEnd);
  window.addEventListener('touchend', onEnd);

  return { resetPosition };
}

/* ════════════════════════════════════════
   SHEET
════════════════════════════════════════ */
function buildSheetGrid(){
  const g = document.getElementById('sheet-grid');
  SHEET_ITEMS.forEach(c => {
    const el = document.createElement('button');
    el.className = 'sheet-item';
    el.innerHTML = `<span class="si-icon">${c.i}</span><span class="si-label">${c.t}</span>`;
    el.onclick = () => { haptic(); go(c.id); };
    g.appendChild(el);
  });
}
function openSheet(){
  document.getElementById('sheet-overlay').classList.add('on');
  document.getElementById('sheet').classList.add('on');
  document.getElementById('bn-altro').classList.add('active');
  // Stagger sheet items
  document.querySelectorAll('.sheet-item').forEach((el, i) => {
    el.classList.remove('si-in');
    void el.offsetHeight; // force reflow to restart animation
    el.style.animationDelay = (0.06 + i * 0.06) + 's';
    el.classList.add('si-in');
  });
}
function closeSheet(){
  const sheet = document.getElementById('sheet');
  sheet.style.transform = '';
  sheet.style.transition = '';
  document.getElementById('sheet-overlay').classList.remove('on');
  sheet.classList.remove('on');
  // Reset item animations so they replay next open
  document.querySelectorAll('.sheet-item').forEach(el => {
    el.classList.remove('si-in');
    el.style.animationDelay = '';
  });
}

/* ════════════════════════════════════════
   SWIPE BACK + SHEET DRAG
════════════════════════════════════════ */
function initSwipeBack(){
  let sx = 0, sy = 0, sw = false;
  document.addEventListener('touchstart', e => {
    if(e.touches[0].clientX < 28){ sx = e.touches[0].clientX; sy = e.touches[0].clientY; sw = true; }
    else sw = false;
  }, {passive:true});
  document.addEventListener('touchend', e => {
    if(!sw) return; sw = false;
    const dx = e.changedTouches[0].clientX - sx;
    const dy = Math.abs(e.changedTouches[0].clientY - sy);
    if(dx > 70 && dy < 55){
      const sec = location.hash.replace(/^#\/?/,'').trim();
      if(sec){ haptic(8); go(''); }
    }
  }, {passive:true});
}

function initSheetDrag(){
  const sheet = document.getElementById('sheet');
  let sy = 0, dragging = false;
  sheet.addEventListener('touchstart', e => {
    const fromTop = e.touches[0].clientY - sheet.getBoundingClientRect().top;
    if(fromTop < 56){ sy = e.touches[0].clientY; dragging = true; sheet.style.transition = 'none'; }
  }, {passive:true});
  window.addEventListener('touchmove', e => {
    if(!dragging) return;
    const dy = e.touches[0].clientY - sy;
    if(dy > 0){ sheet.style.transform = `translateY(${dy}px)`; e.preventDefault(); }
  }, {passive:false});
  window.addEventListener('touchend', e => {
    if(!dragging) return; dragging = false;
    const dy = e.changedTouches[0].clientY - sy;
    sheet.style.transition = '';
    if(dy > 90) closeSheet();
    else sheet.style.transform = 'translateY(0)';
  });
}

/* ════════════════════════════════════════
   INJECT CONFIG
════════════════════════════════════════ */
function sh(id, url){ const e=document.getElementById(id); if(e&&url&&url!=='#') e.href=url; }
function injectConfig(){
  sh('lc-sp-pl', C.music.spotifyPlaylist);
  sh('lc-yt1',   C.music.youtube1);
  sh('lc-board', C.board.url);

  const mf = document.getElementById('map-iframe');
  if(mf) mf.src = `https://www.openstreetmap.org/export/embed.html?bbox=${C.map.osmBbox}&layer=mapnik`;
  sh('lc-gmaps', `https://www.google.com/maps/search/${encodeURIComponent(C.map.gAddress)}`);

  const fa = document.getElementById('food-addr');
  if(fa) fa.textContent = C.address;

  const lph = document.getElementById('lc-photos');
  if(C.photos.album){ if(lph) lph.href = C.photos.album; }
  else if(lph) lph.style.opacity = '.45';
}

/* ════════════════════════════════════════
   GAMES
════════════════════════════════════════ */
function buildGames(){
  const g = document.getElementById('games-grid'); if(!g) return;
  const frag = document.createDocumentFragment();
  C.games.forEach(gm => {
    const a = document.createElement('a');
    a.className = 'gc'; a.href = gm.u; a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = `<span class="gc-icon">${gm.i}</span><div class="gc-name">${gm.n}</div><div class="gc-sub">${gm.d}</div>`;
    frag.appendChild(a);
  });
  g.appendChild(frag);
}

/* ════════════════════════════════════════
   QR
════════════════════════════════════════ */
function makeQR(id, text, sz){
  const el = document.getElementById(id); if(!el||!text||text.includes('INSERISCI')) return;
  el.innerHTML='';
  try{ new QRCode(el,{text,width:sz||180,height:sz||180,colorDark:'#000',colorLight:'#fff',correctLevel:QRCode.CorrectLevel.M}); }
  catch(e){ el.textContent='QR n/d'; }
}

/* ════════════════════════════════════════
   STARS
════════════════════════════════════════ */
let gbStars=0;
function buildStars(){
  document.querySelectorAll('#stars span').forEach(s => {
    s.addEventListener('click',()=>{
      gbStars=+s.dataset.v;
      document.querySelectorAll('#stars span').forEach((st,i)=>{
        st.textContent = i<gbStars?'★':'☆';
        st.classList.toggle('lit',i<gbStars);
      });
    });
  });
}

/* ════════════════════════════════════════
   GUESTBOOK
════════════════════════════════════════ */
function loadGB(){
  const msgs=JSON.parse(localStorage.getItem('Ittroiaio_gb')||'[]');
  const el=document.getElementById('gb-msgs'); if(!el||!msgs.length) return;
  let html=`<p style="font-family:var(--mono);font-size:.56rem;color:var(--mut2);letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px">Messaggi salvati</p>`;
  msgs.slice().reverse().forEach(m=>{
    html+=`<div class="gb-item"><span class="gb-name">${esc(m.name)}</span><span class="gb-star">${'★'.repeat(m.s)}${'☆'.repeat(5-m.s)}</span><div class="gb-text">${esc(m.msg)}</div><div class="gb-date">${m.date}</div></div>`;
  });
  el.innerHTML=html;
}
function submitGB(){
  const name=document.getElementById('gb-name').value.trim();
  const msg=document.getElementById('gb-msg').value.trim();
  if(!name||!msg) return toast('Compila nome e messaggio ✦');
  const msgs=JSON.parse(localStorage.getItem('Ittroiaio_gb')||'[]');
  msgs.push({name,msg,s:gbStars,date:new Date().toLocaleDateString('it-IT',{day:'2-digit',month:'long',year:'numeric'})});
  localStorage.setItem('Ittroiaio_gb',JSON.stringify(msgs));
  document.getElementById('gb-name').value='';
  document.getElementById('gb-msg').value='';
  gbStars=0; buildStars(); loadGB();
  toast('Grazie '+name+' ✦');
}
function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ════════════════════════════════════════
   TOAST
════════════════════════════════════════ */
let _tt;
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('on');
  clearTimeout(_tt); _tt=setTimeout(()=>t.classList.remove('on'),2600);
}
