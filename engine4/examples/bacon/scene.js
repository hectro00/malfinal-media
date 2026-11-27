// Francis Bacon — Highgate, abril 1626: rellenó una gallina con nieve para ver si la conservaba; se enfrió, cama húmeda, murió de neumonía (engine4). Death never shown.
import { K, W, H, OUT, clamp, lerp, ease, easeIn, easeOut, back, R, seg, ol, rr, circ, ell, line, poly, txt, L, screen, camTo, camPath, shakeAt, handheld,
  person, pose, mixPose, cloud, puff, speedLines, sky, tree, wind } from './engine.js';
import { PH, st, en, dur, sh, fx, crowdRow, clouds, frost, smoke } from './lib.js';
export { FRAMES, frame, post, blurN } from './lib.js';
const g = K.g;
// ---------- cast (own designs, Jacobean England) ----------
const BAC = { skin: '#f2d2b5', hair: '#9a948c', hairStyle: 'side', beard: true, mustache: true, hat: 'top', coat: '#2a2a38', pants: '#22222c', shoes: '#18161c', seed: 1 };
const BACH = Object.assign({}, BAC, { hat: null });
const DOC = { skin: '#e8b98f', hair: '#3a2a1a', hairStyle: 'bald', mustache: true, hat: 'bowler', hatColor: '#4a3022', coat: '#6a3a2a', pants: '#2a2a22', shoes: '#1a1a12', seed: 2 };
const WOM = { skin: '#e0a97f', hair: '#5a3b22', hairStyle: 'bun', dress: true, coat: '#7a5a8a', pants: '#3a2a3a', shoes: '#2a1a12', seed: 3 };
const SERV = (i) => ({ skin: ['#f2c9a0', '#c98e62', '#f5d2b3'][i % 3], hair: ['#2b1d14', '#7a5a3a', '#141414'][i % 3], hairStyle: ['side', 'curly', 'bald'][i % 3], hat: i === 1 ? 'cap' : null, coat: ['#3a5a6a', '#5a4a3a', '#4a3a5a'][i % 3], pants: '#2a2a30', shoes: '#1b1b1b', seed: 10 + i });
const COURT = [0, 1, 2, 3, 4, 5].map((i) => ({ skin: ['#f2c9a0', '#e0a97f', '#f5d2b3', '#c98e62'][i % 4], hair: ['#2b1d14', '#5a3b22', '#7a5a3a', '#999'][i % 4], hairStyle: ['side', 'bald', 'bun', 'curly'][i % 4], dress: i % 3 === 2, mustache: i % 2 === 0 && i % 3 !== 2, hat: ['top', null, null, 'bowler'][i % 4], coat: ['#5a3a6a', '#7a5a2a', '#3a5a6a', '#6a2f3a', '#4a6a3a', '#5a4a3a'][i], pants: '#2a2a30', shoes: '#1b1b1b', seed: 20 + i }));
const shiver = (t, a = 5) => Math.sin(t * 70) * a;
// ---------- props ----------
function hen(x, y, s, t, o = {}) { // plucked kitchen hen (cartoon, no gore), body packed with snow when o.snow
  g.save(); g.translate(x, y); g.scale(s, s); g.rotate(o.rot || 0);
  ell(0, 0, 120, 82); ol(o.col || '#f4d9c0', 7); for (const sx of [-1, 1]) { g.save(); g.translate(sx * 60, 55); g.rotate(sx * 0.5); rr(-16, 0, 32, 70, 14); ol(o.col || '#f4d9c0', 6); circ(0, 74, 20); ol('#fff', 5); g.restore(); }
  ell(-70, -20, 40, 26, -0.4); ol(o.col || '#ead0b4', 5);
  if (o.snow) { const k = clamp(o.snow); ell(85, -5, 40 * (0.4 + k * 0.6), 46 * (0.4 + k * 0.6)); ol('#ffffff', 5); for (let i = 0; i < 4; i++) { circ(85 + (R(i) - 0.5) * 40 * k, -5 + (R(i + 3) - 0.5) * 50 * k, 12 * k); ol('#eef6ff', 3); } }
  if (o.sparkle) { for (let i = 0; i < 5; i++) { const a = t * 2 + i * 1.3, rr0 = 150 + Math.sin(t * 3 + i) * 20; star(Math.cos(a) * rr0, Math.sin(a) * rr0 * 0.6 - 20, 16 + Math.sin(t * 6 + i) * 6); } }
  g.restore(); }
function star(x, y, r) { poly([[x, y - r], [x + r * 0.3, y - r * 0.3], [x + r, y], [x + r * 0.3, y + r * 0.3], [x, y + r], [x - r * 0.3, y + r * 0.3], [x - r, y], [x - r * 0.3, y - r * 0.3]]); ol('#fff6b0', 3); }
function snowball(x, y, r) { circ(x, y, r); ol('#ffffff', 4); circ(x - r * 0.3, y - r * 0.3, r * 0.3); ol('#eef6ff', 0); }
function coinP(x, y, r, t, k = 0) { g.save(); g.translate(x, y); g.scale(Math.cos(t * 7 + k), 1); circ(0, 0, r); ol('#e8c34a', 5); circ(0, 0, r * 0.6); g.strokeStyle = '#b8932a'; g.lineWidth = 3; g.stroke(); g.restore(); }
function bag(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.beginPath(); g.moveTo(-60, 0); g.quadraticCurveTo(-80, -90, -25, -110); g.lineTo(25, -110); g.quadraticCurveTo(80, -90, 60, 0); g.closePath(); ol('#b89a5a', 6); line([[-30, -110], [30, -110]], 8, '#6a4a22'); txt('£', 0, -50, 60, '#6a4a22', 0); g.restore(); }
function horseB(x, y, s, t, walk = 1, col = '#5a3a28') { g.save(); g.translate(x, y); g.scale(s, s); const a = Math.sin(t * 8) * 0.45 * walk;
  for (const [lx, ph] of [[-100, 0], [-70, 1], [80, 1], [110, 0]]) { g.save(); g.translate(lx, -140); g.rotate(ph ? a : -a); rr(-11, 0, 22, 140, 10); ol(col, 5); rr(-13, 126, 26, 18, 4); ol('#222', 4); g.restore(); }
  ell(0, -180, 150, 62); ol(col, 6); g.save(); g.translate(120, -210); g.rotate(-0.7 + Math.sin(t * 8) * 0.06 * walk); rr(-28, -140, 56, 160, 26); ol(col, 6); g.restore();
  g.save(); g.translate(210, -320); ell(0, 0, 64, 30, 0.35); ol(col, 6); circ(-8, -10, 6); ol(OUT, 0); g.restore();
  g.beginPath(); g.moveTo(-150, -190); g.quadraticCurveTo(-200, -140 + Math.sin(t * 5) * 10, -190, -80); g.strokeStyle = '#2a1a10'; g.lineWidth = 14; g.stroke(); g.restore(); }
function coach(x, y, s, t, o = {}) { // own carriage design; o.roll = wheel speed, o.door 0..1 open, o.horses
  g.save(); g.translate(x, y); g.scale(s, s);
  if (o.horses !== false) { horseB(520, 0, 0.95, t, o.walk ?? 1); horseB(700, 10, 0.95, t + 0.3, o.walk ?? 1, '#3a2a20'); line([[240, -170], [430, -170]], 9, '#4a3020'); }
  rr(-300, -560, 560, 380, 40); ol('#6a2230', 7); rr(-320, -600, 600, 60, 20); ol('#3a1820', 6);
  rr(-250, -500, 180, 160, 16); ol(o.night ? '#ffd27a' : '#bcd2e4', 6); rr(60, -500, 150, 160, 16); ol(o.night ? '#ffd27a' : '#bcd2e4', 6);
  if (o.face) { g.save(); rr(-250, -500, 180, 160, 16); g.clip(); person(-160, -300, 300, BAC, pose('stand', t), { expr: o.face, look: 1 }, t); g.restore(); }
  const dk = o.door || 0; g.save(); g.translate(-60, -520); g.scale(1 - dk * 0.85, 1); rr(0, 0, 110, 320, 10); ol('#7a2a3a', 6); circ(90, 170, 8); ol('#e8c34a', 3); g.restore();
  rr(220, -660, 90, 30, 8); ol('#3a1820', 5); circ(-280, -620, 14); ol('#e8c34a', 4); circ(260, -620, 14); ol('#e8c34a', 4);
  for (const wx of [-200, 160]) { g.save(); g.translate(wx, -110); g.rotate(t * (o.roll ?? 0)); circ(0, 0, 110); ol('#a8742a', 8); circ(0, 0, 22); ol('#5a3418', 5); for (let k = 0; k < 6; k++) line([[Math.cos(k * 1.047) * -100, Math.sin(k * 1.047) * -100], [Math.cos(k * 1.047) * 100, Math.sin(k * 1.047) * 100]], 6, '#5a3418'); g.restore(); }
  g.restore(); }
function bed(x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s);
  rr(-420, -420, 50, 420, 8); ol('#5a3a22', 6); rr(370, -300, 50, 300, 8); ol('#5a3a22', 6); rr(-400, -200, 800, 90, 10); ol('#6a4a2a', 6);
  rr(-380, -250, 760, 60, 20); ol(o.damp ? '#c8cdb8' : '#efe8d6', 6); ell(-300, -255, 70, 34); ol('#f4efe2', 5);
  if (o.damp) { g.globalAlpha = 0.5; for (let i = 0; i < 4; i++) { ell(-200 + i * 160, -225, 50 + R(i) * 30, 14); ol('#8a9a7a', 0); } g.globalAlpha = 1; }
  g.restore(); }
function blanket(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.beginPath(); g.moveTo(-230, -250); g.quadraticCurveTo(0, -330, 380, -260); g.lineTo(380, -190); g.lineTo(-230, -190); g.closePath(); ol('#7a8a6a', 6); g.restore(); }
function candle(x, y, s, t, out = 0) { g.save(); g.translate(x, y); g.scale(s, s); rr(-14, -90, 28, 90, 4); ol('#f4efe2', 4); rr(-40, -6, 80, 12, 6); ol('#a8742a', 4);
  if (out < 1) { const fl = Math.sin(t * 13) * 4; g.globalAlpha = 1 - out; g.beginPath(); g.moveTo(-10, -92); g.quadraticCurveTo(fl, -150, 0, -160); g.quadraticCurveTo(10 + fl, -130, 10, -92); g.closePath(); ol('#ffb43a', 3); circ(0, -110, 60); g.fillStyle = 'rgba(255,200,90,0.15)'; g.fill(); g.globalAlpha = 1; }
  if (out > 0) smoke(0, -100, t, 0.6); g.restore(); }
function drip(x, y0, y1, t, k = 0) { const ph = (t * 0.7 + k) % 1; circ(x, lerp(y0, y1, easeIn(ph)), 9); ol('#9ad0f0', 3); }
function letter(x, y, s, k, t) { g.save(); g.translate(x, y); g.scale(s, s); g.rotate(-0.05); rr(-260, -330, 520, 660, 10); ol('#f6ecd2', 7);
  for (let i = 0; i < 7; i++) { const w = 380 * clamp(k * 8 - i); if (w > 0) line([[-200, -230 + i * 60], [-200 + w, -230 + i * 60]], 6, '#6a5a4a'); }
  if (k > 0.8) { g.save(); g.globalAlpha = seg(k, 0.8, 0.95); txt('¡EXCELENTE!', 0, 230, 70, '#2f7a3a', 0); g.restore(); } g.restore(); }
function quill(x, y, s, t) { g.save(); g.translate(x, y); g.rotate(-0.6 + Math.sin(t * 9) * 0.08); g.scale(s, s); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(40, -120, 20, -240); g.quadraticCurveTo(-30, -120, 0, 0); ol('#f4f1e0', 4); g.restore(); }
// ---------- sets ----------
function snowfall(t, n = 70, sp = 1) { g.save(); g.fillStyle = 'rgba(255,255,255,0.85)'; for (let i = 0; i < n; i++) { const x = ((R(i) * W * 1.3 + t * (40 + R(i + 2) * 60) * sp + Math.sin(t + i) * 30) % (W * 1.3)) - W * 0.15, y = ((R(i + 5) * H + t * (120 + R(i + 3) * 120) * sp) % H); circ(x, y, 4 + R(i + 7) * 6); g.fill(); } g.restore(); }
function snowroad(t, o = {}) { sky(o.top || '#8a9ab8', o.bot || '#e6ecf4'); L(0.06, () => clouds(t, -700, 5, 1.0));
  L(0.25, () => { g.fillStyle = '#d6dee8'; g.beginPath(); g.moveTo(-5000, 900); for (let k = -5000; k <= 5000; k += 700) { g.quadraticCurveTo(k + 350, 560 + R(k * 0.01 + 2) * 200, k + 700, 900); } g.lineTo(5000, 3000); g.lineTo(-5000, 3000); g.closePath(); ol('#d6dee8', 5); });
  L(0.55, () => { for (let i = 0; i < 14; i++) { const tx = -3400 + i * 520 + R(i) * 120; poly([[tx - 100, 990], [tx, 640 + R(i) * 90], [tx + 100, 990]]); ol('#3a5a4a', 5); poly([[tx - 60, 820], [tx, 650 + R(i) * 90], [tx + 60, 820]]); ol('#f4f6fa', 0); }
    for (let i = 0; i < 3; i++) { const hx = -2600 + i * 2200; rr(hx, 720, 300, 260, 6); ol('#c8a88a', 5); poly([[hx - 30, 720], [hx + 150, 560], [hx + 330, 720]]); ol('#f4f6fa', 5); rr(hx + 120, 860, 60, 120, 6); ol('#5a3a2a', 4); } });
  L(1, () => { g.fillStyle = '#f2f5fa'; g.fillRect(-6000, 1000, 12000, 3000); line([[-6000, 1000], [6000, 1000]], 6); g.fillStyle = '#d8dee8'; g.fillRect(-6000, 1120, 12000, 140); for (let i = 0; i < 30; i++) { ell(-5000 + i * 360, 1190, 40, 8); ol('#c8d0dc', 0); } }); }
function court(t, o = {}) { g.fillStyle = '#2a1e22'; g.fillRect(0, 0, W, H);
  L(0.6, () => { g.fillStyle = '#6a5040'; g.fillRect(-3000, -2000, 6000, 3000); for (let i = 0; i < 12; i++) line([[-3000 + i * 500, -2000], [-3000 + i * 500, 1000]], 12, '#4a3428');
    for (let i = 0; i < 3; i++) { const cx = -1200 + i * 1200; rr(cx - 120, -500, 240, 600, 120); ol('#2a3a5a', 7); rr(cx - 100, -480, 200, 560, 100); ol('#9cb8d4', 0); line([[cx, -480], [cx, 80]], 5); line([[cx - 100, -150], [cx + 100, -150]], 5); }
    poly([[-200, -620], [200, -620], [160, -300], [-160, -300]]); ol('#8a2a3a', 6); circ(0, -470, 70); ol('#e8c34a', 5); });
  L(1, () => { g.fillStyle = '#4a3a30'; g.fillRect(-3000, 1000, 6000, 2000); line([[-3000, 1000], [3000, 1000]], 6); for (let i = 0; i < 14; i++) line([[-3000 + i * 460, 1000], [-3400 + i * 460, 2400]], 4, 'rgba(0,0,0,0.15)'); }); }
function bench(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); rr(-380, -420, 760, 420, 10); ol('#7a4a2a', 7); rr(-420, -460, 840, 60, 10); ol('#5a3418', 6); for (let i = 0; i < 4; i++) { rr(-330 + i * 180, -360, 120, 300, 10); ol('#6a4022', 4); } g.restore(); }
function study(t, o = {}) { g.fillStyle = '#20181c'; g.fillRect(0, 0, W, H);
  L(0.6, () => { g.fillStyle = '#5a4636'; g.fillRect(-3000, -2000, 6000, 3000);
    for (let sx = -2; sx <= 2; sx++) { const bx = sx * 700 - 250; rr(bx, -500, 500, 1500, 6); ol('#4a3022', 6); for (let r = 0; r < 6; r++) { line([[bx, -380 + r * 230], [bx + 500, -380 + r * 230]], 8, '#3a2418'); for (let k = 0; k < 9; k++) { const h = 120 + R(sx * 50 + r * 9 + k) * 70; rr(bx + 20 + k * 52, -380 + r * 230 - h, 44, h, 4); ol(['#8a2a3a', '#2f5a3a', '#2f4a8a', '#a8742a', '#5a3a6a'][(k + r + sx + 10) % 5], 3); } } }
    rr(-160, -420, 320, 360, 20); ol('#2a3a5a', 7); rr(-140, -400, 280, 320, 14); ol(o.night ? '#1e2a4a' : '#bcd2e4', 0); snowfall(t * 0.3, 0); });
  L(1, () => { g.fillStyle = '#3a2a22'; g.fillRect(-3000, 1000, 6000, 2000); line([[-3000, 1000], [3000, 1000]], 6); }); }
function table(x, y, w) { rr(x - w / 2, y - 300, w, 40, 8); ol('#7a4a2a', 6); rr(x - w / 2 + 20, y - 260, 30, 260, 6); ol('#5a3418', 5); rr(x + w / 2 - 50, y - 260, 30, 260, 6); ol('#5a3418', 5); }
function flask(x, y, s, col, t, k = 0) { g.save(); g.translate(x, y); g.scale(s, s); g.beginPath(); g.moveTo(-15, -120); g.lineTo(-15, -70); g.lineTo(-60, 0); g.lineTo(60, 0); g.lineTo(15, -70); g.lineTo(15, -120); g.closePath(); ol('rgba(220,240,255,0.6)', 5); poly([[-45, -22], [45, -22], [60, 0], [-60, 0]]); ol(col, 0);
  for (let i = 0; i < 3; i++) { const ph = (t * 1.2 + i / 3 + k) % 1; g.globalAlpha = 1 - ph; circ(Math.sin(ph * 9 + i) * 10, -120 - ph * 90, 8 + ph * 10); ol(col, 3); g.globalAlpha = 1; } g.restore(); }
function village(t) { snowroad(t, { top: '#9aaac8', bot: '#eef2f8' });
  L(1, () => { rr(-560, 560, 560, 440, 8); ol('#c89a72', 6); poly([[-620, 560], [-280, 330], [60, 560]]); ol('#f2f5fa', 6); rr(-360, 760, 130, 240, 8); ol('#5a3a2a', 5); rr(-520, 660, 110, 100, 6); ol('#ffd27a', 5); line([[-465, 660], [-465, 760]], 4); smoke(-120, 380, t, 1);
    rr(-80, 340, 60, 140, 4); ol('#8a5a3a', 5); for (let i = 0; i < 5; i++) { rr(80 + i * 70, 900, 16, 100, 4); ol('#8a6a4a', 4); } line([[70, 930], [440, 930]], 8, '#8a6a4a'); }); }
function manor(t) { sky('#121a34', '#3a4a7a'); L(0.05, () => { circ(380, -480, 80); ol('#f4f1e0', 0); for (let i = 0; i < 30; i++) { circ(-1200 + R(i) * 2400, -900 + R(i + 4) * 900, 3 + R(i + 1) * 3); g.fillStyle = '#fff'; g.fill(); } });
  L(0.4, () => { g.fillStyle = '#c8d2e0'; g.fillRect(-4000, 950, 8000, 2000); for (let i = 0; i < 10; i++) { const tx = -2400 + i * 520; poly([[tx - 90, 980], [tx, 700], [tx + 90, 980]]); ol('#2a3a3a', 5); } });
  L(1, () => { rr(-700, 200, 1400, 800, 6); ol('#a89a8a', 7); poly([[-760, 200], [0, -80], [760, 200]]); ol('#5a6a7a', 7);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) { if (r === 1 && (c === 2 || c === 3)) continue; rr(-620 + c * 220, 300 + r * 330, 120, 190, 50); ol(R(r * 7 + c) > 0.4 ? '#ffd27a' : '#2a3450', 5); }
    rr(-110, 700, 220, 300, 100); ol('#4a2a1a', 6); g.fillStyle = '#e8eef6'; g.fillRect(-4000, 1000, 8000, 2000); line([[-4000, 1000], [4000, 1000]], 6); }); }
function room(t, o = {}) { g.fillStyle = '#141018'; g.fillRect(0, 0, W, H);
  L(0.6, () => { g.fillStyle = o.wall || '#5a5a4a'; g.fillRect(-3000, -2000, 6000, 3000); g.globalAlpha = 0.35; for (let i = 0; i < 8; i++) { ell(-1400 + R(i) * 2800, -600 + R(i + 2) * 1300, 120 + R(i + 1) * 160, 80 + R(i + 3) * 100); ol('#3a4a32', 0); } g.globalAlpha = 1;
    rr(380, -460, 300, 380, 16); ol('#2a3a5a', 7); rr(400, -440, 260, 340, 10); ol(o.dawn ? '#f0b07a' : '#1a2440', 0); line([[530, -440], [530, -100]], 5); line([[400, -270], [660, -270]], 5);
    g.strokeStyle = 'rgba(230,230,230,0.5)'; g.lineWidth = 2; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(-1000, -900); g.lineTo(-1000 + Math.cos(k * 0.35) * 260, -900 + Math.sin(k * 0.35) * 260); g.stroke(); } });
  L(1, () => { g.fillStyle = '#3a2e28'; g.fillRect(-3000, 1000, 6000, 2000); line([[-3000, 1000], [3000, 1000]], 6); }); }
function interior(t, o = {}) { g.fillStyle = '#3a1820'; g.fillRect(0, 0, W, H); // inside the coach: window with snowy land rushing by
  L(1, () => { rr(-330, 60, 660, 520, 30); ol('#3a5a7a', 8); g.save(); rr(-320, 70, 640, 500, 24); g.clip(); g.fillStyle = '#aab8d0'; g.fillRect(-340, 60, 700, 540); g.fillStyle = '#f2f5fa'; g.fillRect(-340, 420, 700, 200);
      for (let i = 0; i < 8; i++) { const tx = ((i * 260 - t * (o.stop ? 0 : 520)) % 2080 + 2080) % 2080 - 1040; poly([[tx - 70, 440], [tx, 200 + R(i) * 60], [tx + 70, 440]]); ol('#3a5a4a', 4); }
      g.fillStyle = 'rgba(255,255,255,0.9)'; for (let i = 0; i < 30; i++) { circ(((R(i) * 700 - t * 300) % 700 + 700) % 700 - 350, ((R(i + 3) * 540 + t * 160) % 540) + 60, 5); g.fill(); } g.restore();
    g.fillStyle = '#6a2230'; g.fillRect(-3000, 700, 6000, 400); rr(-560, 760, 420, 320, 30); ol('#8a2a3a', 6); rr(140, 760, 420, 320, 30); ol('#8a2a3a', 6); g.fillStyle = '#2a1018'; g.fillRect(-3000, 1080, 6000, 1500); line([[-3000, 1080], [3000, 1080]], 6); }); }
// ---------- text helpers ----------
function tag(a = 1) { screen(() => { g.globalAlpha = a; rr(40, 150, 470, 70, 16); ol('rgba(20,15,30,0.8)', 5); txt('MUERTES ABSURDAS #41', 275, 186, 34, '#ffd23f', 0); g.globalAlpha = 1; }); }
function bigText(s1, y, a, col = '#fff', size = 90) { if (a <= 0) return; screen(() => { g.globalAlpha = a; txt(s1, W / 2, y, size, col, 16); g.globalAlpha = 1; }); }
function popText(s1, y, lt, t0 = 0, col = '#fff', size = 90) { const k = back(seg(lt, t0, t0 + 0.25)); if (k <= 0) return; screen(() => { g.save(); g.translate(W / 2, y); g.scale(k, k); txt(s1, 0, 0, size, col, 16); g.restore(); }); }
function nameCard(s1, a, y = 1480) { screen(() => { g.globalAlpha = a; rr(170, y - 60, 740, 120, 24); ol('#fbf7ea', 6); txt(s1, W / 2, y, 64, '#3a2a40', 0); g.globalAlpha = 1; }); }
function blueTint(a) { screen(() => { g.fillStyle = `rgba(90,140,220,${a})`; g.fillRect(0, 0, W, H); }); }
// ---------- shots ----------
// P0 hook: Bacon kneeling in a blizzard stuffing a hen with snow, shivering hard; hit
sh(0, 0, (t, u, lt) => { camPath([0, 760, 1.15], [0, 780, 1.35], u); snowroad(t, { top: '#7a8aa8' }); wind(t, 8, 1.2);
  L(1, () => { const sx = shiver(t, 6); person(-120 + sx, 1000, 600, BAC, pose('crouch', t, { armR: -1.2, elbR: 0.6 + Math.sin(t * 9) * 0.4, armL: 0.9 }), { expr: 'shock', breath: true }, t); hen(240, 940, 0.95, t, { snow: 0.3 + lt * 0.4 });
    for (let i = 0; i < 3; i++) snowball(120 + i * 70 + Math.sin(t * 6 + i) * 20, 880 - ((lt * 1.4 + i * 0.3) % 1) * 120, 18); });
  snowfall(t, 110, 1.6); blueTint(0.12 + 0.1 * u); shakeAt(t, 0.05, 28); popText('QUISO CONGELAR UN POLLO…', 430, lt, 0, '#fff', 72); if (u > 0.45) popText('…Y SE CONGELÓ ÉL', 570, lt, dur(0) * 0.45, '#7fd0ff', 88); tag(); }, 1);
// P1a England 1626 snowy landscape; P1b study, name card
sh(1, 0, (t, u, lt) => { camPath([-300, 500, 0.55], [200, 540, 0.62], u); snowroad(t); L(1, () => coach(lerp(-900, 300, u), 1000, 0.8, t, { roll: 4 })); snowfall(t, 50);
  bigText('INGLATERRA', 380, seg(lt, 0.1, 0.4), '#fff', 120); bigText('AÑO 1626', 520, seg(lt, 0.3, 0.6), '#ffd23f', 100); });
sh(1, 0.5, (t, u, lt) => { camPath([0, 620, 0.95], [60, 600, 1.08], u); study(t); L(1, () => { table(330, 1000, 520); flask(230, 700, 1.0, '#7fd0ff', t); flask(420, 700, 0.8, '#a8e06a', t, 0.4);
    person(-200, 1000, 640, BAC, pose('think', t), { expr: 'smug', look: 1 }, t); }); nameCard('FRANCIS BACON', seg(lt, 0.1, 0.3)); bigText('FILÓSOFO Y CIENTÍFICO', 1600, seg(lt, 0.3, 0.5), '#ffd23f', 62); });
// P2a Lord Chancellor on the high bench; P2b bribe bags slide in, crowd points, he walks out
sh(2, 0, (t, u, lt) => { camPath([0, 560, 0.8], [0, 600, 0.95], u); court(t); L(1, () => { bench(0, 1000, 1.0); person(0, 640, 560, BAC, pose('proud', t), { expr: 'smug', look: 0 }, t);
    crowdRow(t, -1100, 1300, 3, 480, 320, { cast: COURT, pose: () => 'stand', expr: () => 'neutral', noflip: true }); crowdRow(t, 300, 1300, 3, 480, 320, { cast: COURT, off: 3, pose: () => 'stand', expr: () => 'neutral', noflip: true }); });
  popText('EL JUEZ MÁS PODEROSO', 380, lt, 0.1, '#fff', 80); });
sh(2, 0.5, (t, u, lt) => { camPath([0, 640, 0.9], [0, 640, 1.0], u); court(t); const k = ease(seg(lt, 0, 0.5)); L(1, () => { for (let i = 0; i < 3; i++) bag(lerp(-900, -380 + i * 130, k), 1000, 1.0); for (let i = 0; i < 4; i++) coinP(-300 + i * 60, 860 - Math.abs(Math.sin(t * 5 + i)) * 60, 24, t, i);
    person(120 + lerp(0, 380, ease(seg(u, 0.5, 1))), 1000, 600, BACH, pose(u > 0.5 ? 'walk' : 'shock', t), { expr: 'scared', look: 1 }, t);
    crowdRow(t, -1000, 1350, 6, 500, 340, { cast: COURT, pose: () => 'point', expr: () => 'angry', noflip: true }); });
  popText('¡SOBORNOS!', 420, lt, 0.15, '#ff6a5a', 130); shakeAt(t, st(2) + dur(2) * 0.5 + 0.2, 18); });
// P3 experiments: flasks bubble, a little explosion, he laughs
sh(3, 0, (t, u, lt) => { camPath([150, 640, 1.0], [150, 600, 1.15], u); study(t); L(1, () => { table(250, 1000, 700); flask(100, 700, 1.1, '#ff8a6a', t); flask(260, 700, 0.9, '#7fd0ff', t, 0.3); flask(410, 700, 1.0, '#a8e06a', t, 0.6);
    puff(260, 600, 1.4, seg(lt, 0.6, 1.8), '#cfe8ff'); person(-260, 1000, 640, BACH, pose(lt > 0.6 ? 'clap' : 'point', t), { expr: lt > 0.6 ? 'laugh' : 'happy', look: 1 }, t); });
  popText('EXPERIMENTAR CON TODO', 380, lt, 0.1, '#ffd23f', 76); shakeAt(t, st(3) + 0.6, 12); });
// P4 April: coach on the snowy road, camera follows
sh(4, 0, (t, u, lt) => { const x = lerp(-1400, -100, u); camTo(x + 250, 640, 0.62); snowroad(t); L(1, () => { coach(x, 1000, 0.9, t, { roll: 5 }); puff(x - 300, 990, 1.0, (lt * 0.8) % 1, '#ffffff'); }); snowfall(t, 50);
  bigText('ABRIL', 360, seg(lt, 0.1, 0.35), '#fff', 130); popText('+ EL MÉDICO DEL REY', 1580, lt, dur(4) * 0.4, '#ffd23f', 72); });
// P5 window POV: everything covered in snow
sh(5, 0, (t, u, lt) => { camPath([0, 640, 1.0], [0, 640, 1.12], u); interior(t); L(1, () => { person(-330, 1080, 560, BAC, pose('sit', t), { expr: 'neutral', look: 1 }, t); person(350, 1080, 560, DOC, pose('sit', t), { expr: 'neutral', look: -1 }, t, true); });
  popText('TODO NEVADO', 400, lt, 0.2, '#fff', 110); });
// P6 idea: thought bubble snow + meat = salt?
sh(6, 0, (t, u, lt) => { camPath([-260, 700, 1.25], [-260, 640, 1.45], u); interior(t); L(1, () => { person(-330, 1080, 560, BAC, pose('think', t), { expr: 'happy', look: 1 }, t);
    const k = back(seg(lt, 0.2, 0.6)); if (k > 0) { g.save(); g.translate(-120, 240); g.scale(k, k); for (const [cx, cy, r] of [[-120, 260, 18], [-80, 200, 28]]) { circ(cx, cy, r); ol('#fff', 5); } ell(80, 40, 260, 150); ol('#fff', 6); snowball(-60, 40, 44); txt('+', 20, 40, 60, '#3a2a40', 0); hen(140, 50, 0.4, t); g.restore(); } });
  popText('¿LA NIEVE CONSERVA', 1600, lt, dur(6) * 0.35, '#fff', 74); popText('LA CARNE?', 1710, lt, dur(6) * 0.5, '#7fd0ff', 90); });
// P7 the coach brakes hard in the road; he jumps out
sh(7, 0, (t, u, lt) => { const k = easeOut(seg(lt, 0, 0.7)); camTo(lerp(-300, 0, k) + 150, 680, 0.62); snowroad(t); L(1, () => { coach(lerp(-500, 0, k), 1000, 0.9, t, { roll: 5 * (1 - k), walk: 1 - k, door: seg(lt, 0.8, 1.1) });
    if (lt > 1.0) { const j = seg(lt, 1.0, 1.6); person(lerp(-60, -400, j), 1000 - Math.sin(j * Math.PI) * 160, 520, BAC, pose(j < 1 ? 'leap' : 'stand', t), { expr: 'happy' }, t, true); } puff(0, 990, 1.8, seg(lt, 0.4, 1.4), '#ffffff'); });
  snowfall(t, 50); shakeAt(t, st(7) + 0.6, 26); popText('¡ALTO!', 420, lt, 0.5, '#ffb43a', 150); }, 1);
// P8 village: buys a hen from a woman, coin flips
sh(8, 0, (t, u, lt) => { camPath([-60, 640, 0.85], [40, 640, 0.95], u); village(t); const k = ease(seg(lt, 0.4, 1.2));
  L(1, () => { person(-380, 1000, 600, BAC, pose('point', t), { expr: 'happy', look: 1, breath: true }, t); person(330, 1000, 560, WOM, pose('carry', t), { expr: 'shock', look: -1, breath: true }, t, true); hen(lerp(300, -150, k), 760 - Math.sin(k * Math.PI) * 120, 0.55, t);
    coinP(lerp(-250, 260, seg(lt, 0, 0.5)), 700 - Math.sin(seg(lt, 0, 0.5) * Math.PI) * 200, 26, t); }); snowfall(t, 40);
  popText('UNA GALLINA', 400, lt, 0.2, '#fff', 110); });
// P9 stuffing it with snow by hand
sh(9, 0, (t, u, lt) => { camPath([0, 760, 1.0], [40, 800, 1.25], u); snowroad(t); L(1, () => { person(-150, 1000, 600, BAC, pose('crouch', t, { armR: -1.0, elbR: 0.6 + Math.sin(t * 8) * 0.5 }), { expr: 'happy', breath: true }, t); hen(200, 930, 0.9, t, { snow: u });
    for (let i = 0; i < 2; i++) snowball(110 + Math.sin(t * 8 + i * 3) * 30, 880 - ((t * 1.6 + i * 0.5) % 1) * 80, 16); person(520, 1000, 560, DOC, pose('no', t), { expr: 'worried', look: -1, breath: true }, t, true); }); snowfall(t, 60);
  popText('LA RELLENA DE NIEVE', 400, lt, 0.2, '#7fd0ff', 86); });
// P10 close on the hands: handful after handful, shivering
sh(10, 0, (t, u, lt) => { camPath([120, 780, 1.8], [150, 820, 2.1], u); snowroad(t); L(1, () => { const sx = shiver(t, 3 + u * 5); person(-80 + sx, 1000, 600, BAC, pose('crouch', t, { armR: -1.0, elbR: 0.6 + Math.sin(t * 10) * 0.5 }), { expr: 'worried', breath: true, sweat: u > 0.5 }, t); hen(260, 930, 0.9, t, { snow: 1 });
    for (let i = 0; i < 3; i++) snowball(180 + Math.sin(t * 10 + i * 2) * 30, 870 - ((t * 2 + i * 0.33) % 1) * 90, 14); }); snowfall(t, 90, 1.4); frost(t); blueTint(0.1 + u * 0.12);
  popText('PUÑADO TRAS PUÑADO', 400, lt, 0.1, '#fff', 84); });
// P11 re-hook: dark, push-in on the shivering man
sh(11, 0, (t, u, lt) => { camPath([-100, 700, 1.3], [-100, 600, 2.0], u, easeIn); snowroad(t, { top: '#2a3a5a', bot: '#7a8aa8' }); L(1, () => person(-100 + shiver(t, 6), 1000, 600, BAC, pose('cover', t), { expr: 'scared', breath: true }, t)); snowfall(t, 120, 2); wind(t, 10, 1.4); blueTint(0.25);
  popText('PERO ESO NO', 400, lt, 0.1, '#fff', 110); popText('FUE LO PEOR', 530, lt, 0.4, '#ff6a5a', 110); }, 1);
// P12 he shakes so hard the doctor has to hold him up
sh(12, 0, (t, u, lt) => { camPath([0, 640, 0.95], [0, 660, 1.1], u); snowroad(t); L(1, () => { coach(500, 1000, 0.7, t, { horses: false, door: 1 }); person(-120 + shiver(t, 9), 1000, 600, BAC, pose('cover', t), { expr: 'pain', breath: true, sweat: true }, t); person(140, 1000, 580, DOC, pose('plead', t), { expr: 'worried', look: -1 }, t, true); });
  snowfall(t, 60); blueTint(0.15); popText('NO PUEDE NI VOLVER', 400, lt, 0.2, '#fff', 86); });
// P13 night: coach arrives at the earl's house, servants carry him in (camera follows)
sh(13, 0, (t, u, lt) => { const x = lerp(-1300, -250, easeOut(u)); camTo(x * 0.6, 600, 0.6); manor(t); L(1, () => { coach(x - 600, 1100, 0.7, t, { roll: 4 * (1 - u), walk: 1 - u, night: true });
    for (let i = 0; i < 2; i++) person(200 + i * 220, 1100, 480, SERV(i), pose('walk', t + i * 0.4), { expr: 'worried', breath: true }, t, true); }); snowfall(t, 40, 0.6);
  bigText('HIGHGATE', 380, seg(lt, 0.2, 0.5), '#fff', 120); bigText('CASA DE UN CONDE', 510, seg(lt, 0.45, 0.75), '#ffd23f', 70); });
// P14 the damp bed nobody had used in a year: drips, mould, cobwebs
sh(14, 0, (t, u, lt) => { camPath([0, 700, 0.95], [0, 760, 1.15], u); room(t); L(1, () => { bed(0, 1000, 1.0, t, { damp: true }); for (let i = 0; i < 3; i++) drip(-200 + i * 220, 380, 760, t, i * 0.33);
    g.save(); g.translate(160, 745); g.rotate(-Math.PI / 2); person(0, 0, 440, BACH, pose('stand', t, { armL: 0.1, armR: -0.1 }), { expr: 'pain', shadow: false, breath: true }, t); g.restore(); blanket(0, 1000, 1.0); candle(500, 1000 - 0, 1.2, t); });
  popText('CAMA HÚMEDA', 400, lt, 0.15, '#9ad0f0', 110); popText('1 AÑO SIN USAR', 1580, lt, dur(14) * 0.45, '#fff', 84); });
// P15 fever rises, hard to breathe: close on the face, heat waves
sh(15, 0, (t, u, lt) => { camPath([-180, 700, 1.4], [-200, 720, 1.75], u); room(t); handheld(t, 8); L(1, () => { bed(0, 1000, 1.0, t, { damp: true }); g.save(); g.translate(160, 745 + Math.sin(t * 4) * 6); g.rotate(-Math.PI / 2); person(0, 0, 440, BACH, pose('stand', t, { armL: 0.1, armR: -0.1 }), { expr: 'pain', shadow: false, sweat: true, breath: true }, t); g.restore(); blanket(0, 1000, 1.0); });
  screen(() => { g.fillStyle = `rgba(255,90,60,${0.08 + 0.08 * Math.sin(t * 5)})`; g.fillRect(0, 0, W, H); }); popText('FIEBRE', 400, lt, 0.1, '#ff6a5a', 140); popText('LE FALTA EL AIRE', 1560, lt, dur(15) * 0.45, '#fff', 84); });
// P16a he dictates, a servant writes; P16b the letter: "excellent"
sh(16, 0, (t, u, lt) => { camPath([0, 700, 0.9], [60, 700, 1.0], u); room(t); L(1, () => { bed(-100, 1000, 1.0, t, { damp: true }); g.save(); g.translate(60, 745); g.rotate(-Math.PI / 2); person(0, 0, 440, BACH, pose('stand', t, { armL: 0.1, armR: -0.1 }), { expr: 'happy', talk: true, shadow: false }, t); g.restore(); blanket(-100, 1000, 1.0);
    person(470, 1000, 560, SERV(0), pose('write', t), { expr: 'neutral', look: -1 }, t, true); candle(300, 720, 0.8, t); }); popText('DICTA UNA CARTA', 400, lt, 0.15, '#fff', 90); });
sh(16, 0.5, (t, u, lt) => { camPath([0, 960, 1.0], [0, 960, 1.15], u); screen(() => { g.fillStyle = '#3a2a22'; g.fillRect(0, 0, W, H); }); L(1, () => { letter(0, 960, 1.4, u, t); quill(260, 1100, 1.3, t); });
  popText('“SALIÓ EXCELENTE”', 380, lt, dur(16) * 0.2, '#ffd23f', 90); });
// P17 the candle goes out; dawn in the window, empty bed with his hat (death implied)
sh(17, 0, (t, u, lt) => { camPath([0, 700, 0.95], [0, 720, 1.05], u); room(t, { dawn: u > 0.5 }); L(1, () => { bed(0, 1000, 1.0, t, { damp: true }); blanket(0, 1000, 1.0); g.save(); g.translate(-300, 735); g.rotate(-0.25); rr(-55, -120, 110, 100, 6); ol('#222', 6); ell(0, -22, 95, 18); ol('#222', 6); g.restore();
    candle(500, 1000, 1.2, t, seg(lt, 0.3, 0.6)); }); screen(() => { g.fillStyle = `rgba(0,0,0,${0.3 * (1 - u)})`; g.fillRect(0, 0, W, H); });
  bigText('9 DE ABRIL', 380, seg(lt, 0.4, 0.7), '#fff', 110); bigText('NEUMONÍA', 520, seg(lt, dur(17) * 0.55, dur(17) * 0.7), '#ff8a6a', 110); });
// P18a the hen, perfectly preserved, sparkles; P18b his hat lying in the snow
sh(18, 0, (t, u, lt) => { camPath([0, 900, 1.2], [0, 900, 1.35], u); snowroad(t); L(1, () => { rr(-250, 920, 500, 120, 10); ol('#8a5a32', 6); for (let i = 0; i < 6; i++) snowball(-200 + i * 80, 920, 40); hen(0, 840, 1.0, t, { snow: 1, sparkle: true }); });
  popText('SU GALLINA: PERFECTA', 400, lt, 0.1, '#7fd0ff', 84); });
sh(18, 0.5, (t, u, lt) => { camPath([0, 900, 1.3], [0, 940, 1.5], u); snowroad(t, { top: '#5a6a8a' }); L(1, () => { g.save(); g.translate(40, 1000); g.rotate(0.35); rr(-70, -150, 140, 120, 6); ol('#222', 6); ell(0, -28, 120, 22); ol('#222', 6); g.restore(); }); snowfall(t, 70, 0.6);
  popText('…ÉL NO', 400, lt, 0.2, '#ff6a5a', 140); });
// P19 question: Bacon at the open coach door, looking at us (loops to frame 0)
sh(19, 0, (t, u, lt) => { camPath([0, 660, 0.85], [0, 660, 0.95], u); snowroad(t); L(1, () => { coach(200, 1000, 0.85, t, { door: 1, walk: 0 }); hen(-380, 960, 0.6, t); person(-100, 1000, 600, BAC, pose('think', t), { expr: 'worried', look: Math.sin(t * 2) > 0 ? 1 : -1, breath: true }, t); }); snowfall(t, 50);
  screen(() => { const k = back(seg(lt, 0.2, 0.5)); g.save(); g.translate(W / 2, 400); g.scale(k, k); txt('¿TÚ TE HABRÍAS', 0, -60, 88, '#fff', 16); txt('BAJADO DEL CARRUAJE?', 0, 50, 76, '#ffd23f', 16); g.restore(); }); tag(seg(lt, 0.3, 0.6)); });
