// Bela I de Hungría — Tiszavárkony (corona o espada, c. 1060) y Dömös 1063: su trono de madera se rompió; murió herido camino a la frontera (engine4). Death never shown.
import { K, W, H, OUT, clamp, lerp, ease, easeIn, easeOut, back, R, seg, ol, rr, circ, ell, line, poly, txt, L, screen, camTo, camPath, shakeAt, handheld,
  person, pose, mixPose, cloud, puff, speedLines, sky, tree, wind } from './engine.js';
import { PH, st, en, dur, sh, fx, crowdRow, clouds } from './lib.js';
export { FRAMES, frame, post, blurN } from './lib.js';
const g = K.g;
// ---------- cast (own designs, medieval) ----------
const BELA = { skin: '#f2c9a0', hair: '#7a4a24', hairStyle: 'side', beard: true, mustache: true, coat: '#9a2f2a', pants: '#3a2a22', shoes: '#2a1a12', seed: 1 };
const BELAK = Object.assign({}, BELA, { hat: 'crown' });
const ANDR = { skin: '#f5d2b3', hair: '#4a3a30', hairStyle: 'side', beard: true, coat: '#2f4a8a', pants: '#2a2a3a', shoes: '#1a1a22', hat: 'crown', seed: 2 };
const NOBLE = { skin: '#e8b98f', hair: '#3a2a1a', hairStyle: 'bald', mustache: true, coat: '#2f5a3a', pants: '#2a2a22', shoes: '#1a1a12', seed: 3 };
const SOLD = (i) => ({ skin: ['#f2c9a0', '#e0a97f', '#c98e62', '#f5d2b3'][i % 4], hair: '#3a2a1a', hairStyle: 'side', beard: i % 2 === 0, hat: 'helm', coat: ['#6a6a5a', '#5a5a6a', '#6a5a4a'][i % 3], pants: '#3a3a3a', shoes: '#222', seed: 10 + i });
const COURT = [0, 1, 2, 3, 4, 5].map((i) => ({ skin: ['#f2c9a0', '#e0a97f', '#f5d2b3', '#c98e62'][i % 4], hair: ['#2b1d14', '#5a3b22', '#7a5a3a', '#999'][i % 4], hairStyle: ['side', 'bald', 'bun', 'curly'][i % 4], dress: i % 3 === 2, mustache: i % 2 === 0 && i % 3 !== 2, coat: ['#5a3a6a', '#7a5a2a', '#3a5a6a', '#6a2f3a', '#4a6a3a', '#5a4a3a'][i], pants: '#2a2a30', shoes: '#1b1b1b', seed: 20 + i }));
const ARMY = [0, 1, 2, 3, 4, 5].map(SOLD);
// ---------- props ----------
function crown(x, y, s, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); poly([[-60, 0], [-70, -70], [-35, -38], [0, -90], [35, -38], [70, -70], [60, 0]]); ol('#e8c34a', 6); circ(0, -22, 12); ol('#c0283a', 4); circ(-36, -18, 8); ol('#3a7ac0', 3); circ(36, -18, 8); ol('#3a7ac0', 3); g.restore(); }
function sword(x, y, s, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); poly([[-12, -40], [12, -40], [8, -300], [0, -330], [-8, -300]]); ol('#dfe6ee', 5); line([[0, -60], [0, -290]], 3, 'rgba(90,100,120,0.5)'); rr(-60, -48, 120, 18, 6); ol('#c9a24a', 5); rr(-9, -30, 18, 70, 5); ol('#5a3418', 5); circ(0, 48, 14); ol('#c9a24a', 4); g.restore(); }
const holdSword = (up = 0) => (hR) => sword(hR[0], hR[1] + 10, 0.75, lerp(-0.4, -Math.PI + 0.3, up) + Math.PI);
function plinth(x, y, w, o = {}) { rr(x - w / 2, y - 330, w, 34, 8); ol(o.cloth || '#7a2a3a', 6); poly([[x - w / 2, y - 300], [x + w / 2, y - 300], [x + w / 2 - 30, y - 120], [x - w / 2 + 30, y - 120]]); ol(o.cloth || '#7a2a3a', 6); for (let k = 0; k < 5; k++) line([[x - w / 2 + 30 + k * (w - 60) / 4, y - 300], [x - w / 2 + 40 + k * (w - 80) / 4, y - 130]], 3, 'rgba(255,220,140,0.35)'); rr(x - 26, y - 120, 52, 120, 6); ol('#5a3418', 5); }
// wooden throne: origin = floor centre. brk 0..1 = break (legs snap, back falls, pieces fly)
function throne(x, y, s, brk = 0, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); const wood = o.gold ? '#c9a24a' : '#8a5a32', dk = o.gold ? '#9a7a2a' : '#6a4022';
  const b = easeOut(brk), fly = (k) => b * (120 + R(k) * 160);
  // back
  g.save(); g.translate(0, -200 + b * 120); g.rotate(-b * 0.9); rr(-110, -360, 220, 360, 30); ol(wood, 7); rr(-80, -330, 160, 290, 20); ol(o.cush || '#7a2a3a', 5); circ(0, -360, 26); ol(dk, 5); g.restore();
  // seat
  g.save(); g.translate(0, -200 + b * 190); g.rotate(b * 0.25); rr(-140, -10, 280, 44, 10); ol(wood, 7); rr(-130, -30, 260, 26, 10); ol(o.cush || '#7a2a3a', 5); g.restore();
  // legs
  for (const [lx, k] of [[-120, 1], [120, 2]]) { g.save(); g.translate(lx + Math.sign(lx) * fly(k) * 0.8, -170 + b * 120 - Math.sin(b * Math.PI) * fly(k + 3) * 0.6); g.rotate(b * (k === 1 ? -1.6 : 1.9)); rr(-20, 0, 40, 170 * (1 - b * 0.4), 8); ol(dk, 6); g.restore(); }
  // arms
  for (const sx of [-1, 1]) { g.save(); g.translate(sx * (150 + fly(sx + 7)), -260 + b * 180 - Math.sin(b * Math.PI) * fly(sx + 9)); g.rotate(sx * b * 2.4); rr(-30, -20, 60, 28, 10); ol(wood, 6); g.restore(); }
  if (brk > 0 && brk < 1) for (let i = 0; i < 10; i++) { const a = -Math.PI * R(i + 30), r = b * (150 + R(i + 31) * 260); g.save(); g.translate(Math.cos(a) * r, -150 + Math.sin(a) * r * 0.8 + b * b * 200); g.rotate(i + b * 9); rr(-26, -6, 52, 12, 4); ol('#b07a42', 3); g.restore(); }
  if (o.cracks) { g.globalAlpha = o.cracks; for (const [cx, cy] of [[-120, -100], [120, -120], [-40, -190]]) line([[cx - 10, cy - 40], [cx + 8, cy - 15], [cx - 6, cy + 5], [cx + 10, cy + 30]], 5, '#2a1a10'); g.globalAlpha = 1; }
  g.restore(); }
function sitP(t, ex = {}) { return pose('sit', t, Object.assign({ armL: 0.5, armR: -0.5, elbL: -0.9, elbR: 0.9 }, ex)); }
// king sitting on throne at floor (x,y), throne scale s; person h
function seated(x, y, s, h, d, t, s2 = {}, ex = {}) { throne(x, y, s, 0, s2.thr || {}); person(x, y - 200 * s + 0.155 * h + 20 * s, h, d, sitP(t, ex), s2, t); }
function baby(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.rotate(Math.sin(t * 3) * 0.15); ell(0, 0, 70, 38); ol('#f4efe2', 5); circ(-50, -6, 28); ol('#f5d2b3', 5); circ(-56, -10, 4); ol(OUT, 0); circ(-44, -10, 4); ol(OUT, 0); g.restore(); }
function cradle(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.rotate(Math.sin(t * 2) * 0.06); g.beginPath(); g.arc(0, -120, 150, 0.1 * Math.PI, 0.9 * Math.PI); g.closePath(); ol('#8a5a32', 7); rr(-150, -140, 300, 30, 10); ol('#f4efe2', 5); g.restore(); }
function coin(x, y, r, t, k = 0) { g.save(); g.translate(x, y); g.scale(Math.cos(t * 7 + k), 1); circ(0, 0, r); ol('#e8c34a', 5); circ(0, 0, r * 0.6); g.strokeStyle = '#b8932a'; g.lineWidth = 4; g.stroke(); line([[-r * 0.25, 0], [r * 0.25, 0]], 4, '#b8932a'); line([[0, -r * 0.25], [0, r * 0.25]], 4, '#b8932a'); g.restore(); }
function banner(x, y, s, t, col = '#c0283a') { g.save(); g.translate(x, y); g.scale(s, s); line([[0, 0], [0, -520]], 10, '#5a3418'); g.beginPath(); g.moveTo(0, -510); for (let k = 0; k <= 6; k++) g.lineTo(k * 30, -510 + Math.sin(t * 6 - k) * 10); for (let k = 6; k >= 0; k--) g.lineTo(k * 30, -360 + Math.sin(t * 6 - k) * 10 + (k === 6 ? -20 : 0)); g.closePath(); ol(col, 5); g.restore(); }
function horse(x, y, s, t, walk = 1) { g.save(); g.translate(x, y); g.scale(s, s); const a = Math.sin(t * 7) * 0.4 * walk;
  for (const [lx, ph] of [[-110, 0], [-80, 1], [90, 1], [120, 0]]) { g.save(); g.translate(lx, -150); g.rotate((ph ? a : -a)); rr(-12, 0, 24, 150, 10); ol('#6a4a32', 5); g.restore(); }
  ell(0, -190, 160, 70); ol('#8a6242', 6); g.save(); g.translate(130, -220); g.rotate(-0.8 + Math.sin(t * 7) * 0.05); rr(-30, -150, 60, 170, 28); ol('#8a6242', 6); g.restore(); g.save(); g.translate(230, -330); ell(0, 0, 70, 32, 0.3); ol('#8a6242', 6); circ(-10, -12, 6); ol(OUT, 0); g.restore();
  g.beginPath(); g.moveTo(-160, -200); g.quadraticCurveTo(-210, -150 + Math.sin(t * 5) * 10, -200, -90); g.strokeStyle = '#3a2a1a'; g.lineWidth = 14; g.stroke(); g.restore(); }
function cart(x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); for (const wx of [-170, 170]) { g.save(); g.translate(wx, -80); g.rotate(t * (o.roll ?? 3)); circ(0, 0, 80); ol('#7a5a32', 7); for (let k = 0; k < 4; k++) line([[Math.cos(k * 0.785) * -76, Math.sin(k * 0.785) * -76], [Math.cos(k * 0.785) * 76, Math.sin(k * 0.785) * 76]], 6, '#5a3418'); g.restore(); }
  rr(-280, -230, 560, 110, 10); ol('#9a6a3a', 7); for (let k = 0; k < 5; k++) line([[-270 + k * 135, -225], [-270 + k * 135, -125]], 4, '#6a4022');
  if (o.cloth) { g.beginPath(); g.moveTo(-270, -230); g.quadraticCurveTo(0, -330 + Math.sin(t * 2) * 6, 270, -230); g.closePath(); ol(o.cloth, 6); }
  line([[280, -150], [420, -130]], 10, '#5a3418'); g.restore(); }
function stream(y, t, w = 3000) { g.fillStyle = '#5a8ab8'; g.fillRect(-w, y, 2 * w, 260); line([[-w, y], [w, y]], 6); line([[-w, y + 260], [w, y + 260]], 6); g.save(); g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 6; g.lineCap = 'round'; for (let i = 0; i < 18; i++) { const xx = ((R(i) * 2 * w + t * 160) % (2 * w)) - w, yy = y + 40 + R(i + 3) * 180; g.beginPath(); g.moveTo(xx, yy); g.quadraticCurveTo(xx + 40, yy - 12, xx + 80, yy); g.stroke(); } g.restore(); }
// ---------- sets ----------
function hall(t, o = {}) { g.fillStyle = '#2a1e22'; g.fillRect(0, 0, W, H);
  L(0.6, () => { g.fillStyle = o.wall || '#7a6a5a'; g.fillRect(-3000, -2000, 6000, 3000); for (let r = 0; r < 14; r++) for (let c = 0; c < 18; c++) { rr(-2700 + c * 300 + (r % 2) * 150, -1600 + r * 130, 290, 120, 6); ol('rgba(0,0,0,0.08)', 3); }
    for (let i = 0; i < 5; i++) { const cx = -1600 + i * 800; rr(cx - 110, -400, 220, 520, 110); ol('#3a4a6a', 7); rr(cx - 90, -380, 180, 480, 90); ol(o.night ? '#1e2a4a' : '#9cc0dc', 0); line([[cx, -380], [cx, 100]], 5); }
    for (let i = 0; i < 4; i++) { const bx = -1200 + i * 800; g.beginPath(); g.moveTo(bx - 90, -560); g.lineTo(bx + 90, -560); g.lineTo(bx + 90, -120 + Math.sin(t * 2 + i) * 8); g.lineTo(bx, -60); g.lineTo(bx - 90, -120); g.closePath(); ol(i % 2 ? '#c0283a' : '#2f5a3a', 6); circ(bx, -340, 40); ol('#e8c34a', 5); }
    for (let i = 0; i < 4; i++) { const tx = -1600 + i * 1060; rr(tx - 14, 120, 28, 120, 4); ol('#5a3418', 4); const fl = Math.sin(t * 13 + i) * 6; g.beginPath(); g.moveTo(tx - 22, 120); g.quadraticCurveTo(tx + fl, 40, tx, 20); g.quadraticCurveTo(tx + 22 + fl, 70, tx + 22, 120); g.closePath(); ol('#ffb43a', 4); } });
  L(1, () => { g.fillStyle = o.floor || '#5a4a40'; g.fillRect(-3000, 1000, 6000, 2000); line([[-3000, 1000], [3000, 1000]], 6); for (let i = 0; i < 14; i++) line([[-3000 + i * 460, 1000], [-3400 + i * 460, 2400]], 4, 'rgba(0,0,0,0.15)');
    if (o.carpet !== false) { poly([[-260, 1000], [260, 1000], [520, 2400], [-520, 2400]]); ol('#8a2a3a', 0); } }); }
function landscape(t, o = {}) { sky(o.top || '#8fb8dc', o.bot || '#f6e0bc'); L(0.08, () => clouds(t, -650, 5, 0.9));
  L(0.25, () => { g.fillStyle = '#9ab0a0'; g.beginPath(); g.moveTo(-4000, 950); for (let k = -4000; k <= 4000; k += 500) g.quadraticCurveTo(k + 250, 640 + R(k * 0.01) * 200, k + 500, 950); g.lineTo(4000, 3000); g.lineTo(-4000, 3000); g.closePath(); g.fill(); });
  L(0.45, () => { g.fillStyle = '#8aa06b'; g.beginPath(); g.moveTo(-4000, 1000); g.quadraticCurveTo(-600, 600, 200, 640); g.quadraticCurveTo(900, 680, 4000, 1000); g.lineTo(4000, 3000); g.lineTo(-4000, 3000); g.closePath(); ol('#8aa06b', 6); castle(200, 660, 1.0, t, o); });
  if (o.river) L(0.7, () => { g.fillStyle = '#5a8ab8'; g.beginPath(); g.moveTo(-4000, 1080); g.quadraticCurveTo(0, 1000, 4000, 1120); g.lineTo(4000, 1220); g.quadraticCurveTo(0, 1110, -4000, 1180); g.closePath(); ol('#5a8ab8', 5); });
  L(1, () => { g.fillStyle = '#9fb27e'; g.fillRect(-4000, 1150, 8000, 2000); line([[-4000, 1150], [4000, 1150]], 6); for (let i = 0; i < 7; i++) tree(-1500 + i * 520 + R(i) * 120, 1160, 0.9 + R(i + 2) * 0.4, i, t); }); }
function castle(x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); const c = o.wood ? '#9a6a3a' : '#cfc2a8', roof = o.wood ? '#6a3a22' : '#7a3a3a';
  rr(-260, -260, 520, 260, 4); ol(c, 6); for (let k = 0; k < 7; k++) rr(-260 + k * 80, -290, 44, 34, 2), ol(c, 5);
  for (const tx of [-300, 300]) { rr(tx - 60, -420, 120, 420, 4); ol(c, 6); poly([[tx - 76, -420], [tx + 76, -420], [tx, -540]]); ol(roof, 6); rr(tx - 14, -360, 28, 50, 12); ol('#3a3040', 4); }
  rr(-50, -130, 100, 130, 46); ol('#5a3418', 6); line([[300, -540], [300, -620]], 5); g.beginPath(); g.moveTo(300, -620); for (let k = 0; k <= 4; k++) g.lineTo(300 + k * 22, -620 + Math.sin(t * 8 - k) * 6); for (let k = 4; k >= 0; k--) g.lineTo(300 + k * 22, -580 + Math.sin(t * 8 - k) * 6); g.closePath(); ol('#c0283a', 4); g.restore(); }
function field(t, o = {}) { sky(o.top || '#9cc0dc', o.bot || '#f4dcc0'); L(0.08, () => clouds(t, -650, 5, 0.9)); L(0.3, () => castle(-500, 900, 0.7, t)); L(0.5, () => { g.fillStyle = '#a6b884'; g.fillRect(-4000, 900, 8000, 2000); line([[-4000, 900], [4000, 900]], 5); for (let i = 0; i < 6; i++) tree(-1800 + i * 700, 905, 0.6, i + 3, t); });
  L(1, () => { g.fillStyle = o.mud || '#b8a274'; g.fillRect(-4000, 1000, 8000, 2000); line([[-4000, 1000], [4000, 1000]], 6); for (let i = 0; i < 30; i++) { ell(-2500 + R(i) * 5000, 1100 + R(i + 3) * 700, 30, 8); ol('rgba(0,0,0,0.08)', 0); } }); }
function corridor(t) { g.fillStyle = '#16121a'; g.fillRect(0, 0, W, H);
  L(0.6, () => { g.fillStyle = '#4a3e3a'; g.fillRect(-3000, -2000, 6000, 3000); for (let r = 0; r < 14; r++) for (let c = 0; c < 18; c++) { rr(-2700 + c * 300 + (r % 2) * 150, -1600 + r * 130, 290, 120, 6); ol('rgba(0,0,0,0.12)', 3); }
    for (let i = 0; i < 3; i++) { const tx = -1000 + i * 1000; rr(tx - 14, 160, 28, 120, 4); ol('#5a3418', 4); const fl = Math.sin(t * 13 + i) * 6; g.beginPath(); g.moveTo(tx - 22, 160); g.quadraticCurveTo(tx + fl, 80, tx, 60); g.quadraticCurveTo(tx + 22 + fl, 110, tx + 22, 160); g.closePath(); ol('#ffb43a', 4); g.save(); g.globalAlpha = 0.18; circ(tx, 120, 260); ol('#ffcf6a', 0); g.restore(); } });
  L(1, () => { g.fillStyle = '#2e2622'; g.fillRect(-3000, 1000, 6000, 2000); line([[-3000, 1000], [3000, 1000]], 6); }); }
function curtain(x, y, w, h, t, peek = 0) { for (let k = 0; k < 6; k++) { const xx = x + k * w / 6; g.beginPath(); g.moveTo(xx, y - h); g.lineTo(xx + w / 6, y - h); g.quadraticCurveTo(xx + w / 6 + Math.sin(t * 2 + k) * 8, y - h / 2, xx + w / 6, y - 40); g.lineTo(xx, y - 40); g.closePath(); ol(k % 2 ? '#6a1e2a' : '#7a2430', 5); }
  rr(x - 20, y - h - 30, w + 40, 40, 8); ol('#c9a24a', 5);
  if (peek > 0) { for (let i = 0; i < 3; i++) { const fx = x + 60 + i * w / 3; ell(fx, y - 10, 46, 18); ol('#222', 5); ell(fx + 40, y - 10, 46, 18); ol('#222', 5); g.save(); g.translate(fx + 20, y - h + 40); g.rotate(-0.15); line([[0, 0], [0, -160 * peek]], 10, '#5a3418'); g.beginPath(); g.moveTo(0, -160 * peek); g.quadraticCurveTo(70, -150 * peek, 60, -100 * peek); g.lineTo(0, -110 * peek); g.closePath(); ol('#cfd6de', 5); g.restore(); } } }
function snow(t, n = 70) { g.save(); g.fillStyle = 'rgba(255,255,255,0.85)'; for (let i = 0; i < n; i++) { const x = ((R(i) * W * 1.3 + t * (40 + R(i + 2) * 60) + Math.sin(t + i) * 30) % (W * 1.3)) - W * 0.15, y = ((R(i + 5) * H + t * (120 + R(i + 3) * 120)) % H); circ(x, y, 4 + R(i + 7) * 6); g.fill(); } g.restore(); }
function wintr(t) { sky('#2a3a5a', '#7a8aa8'); L(0.08, () => { circ(500, -500, 90); ol('#f4f1e0', 0); }); L(0.3, () => { g.fillStyle = '#c8d2e0'; g.beginPath(); g.moveTo(-4000, 950); for (let k = -4000; k <= 4000; k += 600) g.lineTo(k + 300, 500 + R(k * 0.01 + 4) * 250), g.lineTo(k + 600, 950); g.lineTo(4000, 3000); g.lineTo(-4000, 3000); g.closePath(); ol('#c8d2e0', 5); });
  L(0.6, () => { for (let i = 0; i < 9; i++) { const tx = -2000 + i * 500; poly([[tx - 110, 980], [tx, 620 + R(i) * 80], [tx + 110, 980]]); ol('#2f4a3a', 5); poly([[tx - 70, 800], [tx, 640 + R(i) * 80], [tx + 70, 800]]); ol('#f4f6fa', 0); } });
  L(1, () => { g.fillStyle = '#eef2f8'; g.fillRect(-4000, 1000, 8000, 2000); line([[-4000, 1000], [4000, 1000]], 6); }); }
function mint(t) { g.fillStyle = '#2a2020'; g.fillRect(0, 0, W, H); L(0.6, () => { g.fillStyle = '#6a4a3a'; g.fillRect(-3000, -2000, 6000, 3000); for (let i = 0; i < 8; i++) line([[-2000 + i * 500, -2000], [-2000 + i * 500, 1000]], 10, '#4a3022');
    rr(-900, 200, 500, 420, 30); ol('#3a2a2a', 7); const fl = Math.sin(t * 9) * 12; g.beginPath(); g.moveTo(-820, 620); g.quadraticCurveTo(-650 + fl, 330, -650, 280); g.quadraticCurveTo(-480 + fl, 400, -480, 620); g.closePath(); ol('#ff8a2a', 5); });
  L(1, () => { g.fillStyle = '#4a3a30'; g.fillRect(-3000, 1000, 6000, 2000); line([[-3000, 1000], [3000, 1000]], 6); }); }
function manorOut(t) { sky('#f0b07a', '#f8e2b8'); L(0.08, () => clouds(t, -600, 4, 0.8)); L(0.25, () => { g.fillStyle = '#7a9080'; g.beginPath(); g.moveTo(-4000, 900); g.quadraticCurveTo(-1500, 300, -300, 600); g.quadraticCurveTo(800, 900, 1400, 500); g.quadraticCurveTo(2400, 300, 4000, 900); g.lineTo(4000, 3000); g.lineTo(-4000, 3000); g.closePath(); ol('#7a9080', 5); });
  L(0.5, () => { g.fillStyle = '#5a8ab8'; g.fillRect(-4000, 1060, 8000, 400); line([[-4000, 1060], [4000, 1060]], 5); g.save(); g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 6; for (let i = 0; i < 14; i++) { const xx = ((R(i) * 6000 + t * 90) % 6000) - 3000, yy = 1100 + R(i + 3) * 240; g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx + 90, yy); g.stroke(); } g.restore(); });
  L(1, () => { g.fillStyle = '#9fb27e'; g.fillRect(-4000, 1000, 8000, 60); g.fillRect(-4000, 1400, 8000, 2000); castle(0, 1000, 1.15, t, { wood: true }); for (const tx of [-800, 820]) tree(tx, 1010, 1.2, tx, t); }); }
// ---------- text helpers ----------
function tag(a = 1) { screen(() => { g.globalAlpha = a; rr(40, 150, 470, 70, 16); ol('rgba(20,15,30,0.8)', 5); txt('MUERTES ABSURDAS #40', 275, 186, 34, '#ffd23f', 0); g.globalAlpha = 1; }); }
function bigText(s1, y, a, col = '#fff', size = 90) { if (a <= 0) return; screen(() => { g.globalAlpha = a; txt(s1, W / 2, y, size, col, 16); g.globalAlpha = 1; }); }
function popText(s1, y, lt, t0 = 0, col = '#fff', size = 90) { const k = back(seg(lt, t0, t0 + 0.25)); if (k <= 0) return; screen(() => { g.save(); g.translate(W / 2, y); g.scale(k, k); txt(s1, 0, 0, size, col, 16); g.restore(); }); }
function nameCard(s1, a, y = 1480) { screen(() => { g.globalAlpha = a; rr(170, y - 60, 740, 120, 24); ol('#fbf7ea', 6); txt(s1, W / 2, y, 64, '#3a2a40', 0); g.globalAlpha = 1; }); }
// ---------- shots ----------
// P0 hook: the throne breaks under the king (cut to dust before he lands), crown flies
sh(0, 0, (t, u, lt) => { camPath([0, 640, 1.05], [0, 700, 1.2], u); hall(t); const b = clamp(0.25 + lt / 0.9), crK = clamp(lt / 1.6);
  L(1, () => { crowdRow(t, -900, 1000, 3, 520, 300, { cast: COURT, pose: () => 'shock', expr: () => 'shock', noflip: true }); crowdRow(t, 450, 1000, 3, 520, 300, { cast: COURT, off: 3, pose: () => 'shock', expr: () => 'shock', noflip: true });
    throne(0, 1000, 1.15, b); if (lt < 0.55) { g.save(); g.translate(0, 860 + lt * 260); g.rotate(-lt * 1.3); person(0, 0, 560, BELA, pose('fall', t), { expr: 'shock' }, t); g.restore(); }
    puff(0, 980, 3.2, clamp((lt - 0.25) / 1.6)); puff(-160, 990, 2.2, clamp((lt - 0.35) / 1.5)); crown(lerp(0, 420, crK), 640 - Math.sin(crK * Math.PI) * 420 + crK * 330, 1.1, crK * 7); });
  shakeAt(t, 0.05, 26); popText('ESCOGIÓ LA ESPADA…', 420, lt, 0, '#fff', 84); if (u > 0.45) popText('…Y LO MATÓ SU TRONO', 560, lt, dur(0) * 0.45, '#ffb43a', 80); tag(); }, 1);
// P1a Hungary 1060: castle on the hill; P1b two brothers
sh(1, 0, (t, u, lt) => { camPath([0, 420, 0.5], [120, 520, 0.62], u); landscape(t, { river: true }); L(1, () => crowdRow(t, -1300, 1180, 6, 300, 480, { cast: ARMY, pose: () => 'walk', talk: false }));
  bigText('HUNGRÍA', 380, seg(lt, 0.1, 0.4), '#fff', 130); bigText('AÑO 1060', 520, seg(lt, 0.3, 0.6), '#ffd23f', 100); });
sh(1, 0.45, (t, u, lt) => { camPath([0, 640, 0.92], [0, 640, 1.0], u); hall(t); L(1, () => { person(-250, 1000, 620, ANDR, pose('proud', t), { expr: 'smug', look: 1 }, t); person(250, 1000, 640, BELA, pose('stand', t), { expr: 'neutral', look: -1 }, t, true); });
  screen(() => { const a = seg(lt, 0.15, 0.4); g.globalAlpha = a; txt('REY ANDRÉS', 300, 1520, 56, '#7fb0ff', 12); txt('BELA', 790, 1520, 64, '#ff8a6a', 12); g.globalAlpha = 1; }); popText('DOS HERMANOS', 400, lt, 0.1, '#fff', 100); });
// P2 the warrior: Bela slashes a wooden post, chips fly
sh(2, 0, (t, u, lt) => { camPath([-60, 640, 1.0], [40, 620, 1.12], u); field(t); const sw = (Math.sin(t * 6) + 1) / 2;
  L(1, () => { rr(260, 560, 70, 440, 8); ol('#8a5a32', 6); rr(200, 640, 190, 40, 8); ol('#8a5a32', 5); for (let i = 0; i < 5; i++) { const ph = (t * 1.5 + i / 5) % 1; g.save(); g.translate(300 + ph * 300, 700 - Math.sin(ph * Math.PI) * 200 + ph * 150); g.rotate(ph * 8 + i); rr(-14, -5, 28, 10, 3); ol('#b07a42', 3); g.restore(); }
    person(-80, 1000, 640, BELA, pose('stand', t, { armR: lerp(-2.8, -1.0, sw), elbR: lerp(-0.4, 0, sw), lean: 0.08 * sw, legR: -0.3, legL: 0.25 }), { expr: 'determined', look: 1, hold: holdSword(1 - sw) }, t);
    crowdRow(t, -900, 1060, 2, 460, 320, { cast: ARMY, pose: () => 'clap', expr: () => 'happy', noflip: true }); });
  popText('EL GUERRERO', 400, lt, 0.1, '#fff', 100); popText('«EL CAMPEÓN»', 1560, lt, dur(2) * 0.45, '#ffd23f', 100); });
// P3a king with newborn son; P3b king lifts the crown over the cradle
sh(3, 0, (t, u, lt) => { camPath([0, 620, 1.05], [0, 600, 1.2], u); hall(t, { wall: '#7a6a7a' }); L(1, () => { person(0, 1000, 640, ANDR, pose('carry', t, { armL: 0.9 + Math.sin(t * 3) * 0.1, armR: -0.9 - Math.sin(t * 3) * 0.1 }), { expr: 'happy', look: 0, hold: (hR, hL) => baby((hR[0] + hL[0]) / 2, (hR[1] + hL[1]) / 2 - 10, 0.9, t) }, t);
    for (let i = 0; i < 3; i++) { const ph = (t * 0.7 + i / 3) % 1; g.save(); g.globalAlpha = 1 - ph; txt('♥', -120 + i * 120, 500 - ph * 260, 70, '#ff7a8a', 6); g.restore(); } });
  popText('¡UN HIJO!', 420, lt, 0.1, '#fff', 110); });
sh(3, 0.5, (t, u, lt) => { camPath([100, 600, 1.0], [120, 580, 1.12], u); hall(t, { wall: '#7a6a7a' }); L(1, () => { cradle(350, 1000, 1.1, t); baby(350, 830, 0.9, t); const k = ease(seg(u, 0.1, 0.6));
    person(-200, 1000, 640, ANDR, pose('stand', t, { armR: -1.5, elbR: lerp(-0.2, 0.3, k), armL: 0.3 }), { expr: 'smile', look: 1 }, t); crown(lerp(-20, 330, k), lerp(560, 700, k), 0.9, 0); });
  popText('LA CORONA, PARA ÉL', 1560, lt, dur(3) * 0.15, '#ffd23f', 84); });
// P4 Bela arrives at the castle gate (camera follows him walking in)
sh(4, 0, (t, u, lt) => { const x = lerp(-700, -60, u); camTo(x + 200, 640, 0.75); landscape(t, { top: '#e8a87a', bot: '#f6dcb0' }); L(1, () => { castle(250, 1150, 1.6, t); person(x, 1180, 600, BELA, pose('walk', t), { expr: 'worried', look: 1 }, t); person(560, 1180, 560, SOLD(0), pose('stand', t), { expr: 'neutral', look: -1 }, t, true); });
  popText('UNA PRUEBA', 400, lt, dur(4) * 0.35, '#fff', 110); });
// P5 the test room: crown on one table, sword on the other (pan between them)
sh(5, 0, (t, u, lt) => { camPath([-330, 640, 1.25], [330, 640, 1.25], u); hall(t, { wall: '#5a4a5a', carpet: false }); L(1, () => { g.save(); g.globalAlpha = 0.3; poly([[-460, -300], [-200, -300], [-120, 1000], [-560, 1000]]); g.fillStyle = '#fff4d0'; g.fill(); poly([[200, -300], [460, -300], [560, 1000], [120, 1000]]); g.fill(); g.restore();
    plinth(-340, 1000, 360); crown(-340, 660 + Math.sin(t * 2) * 6, 1.1); plinth(340, 1000, 360, { cloth: '#2f4a6a' }); sword(340, 650, 0.9, Math.PI / 2 + Math.sin(t * 2) * 0.02); });
  bigText('CORONA', 400, seg(lt, 0.05, 0.3), '#ffd23f', 110); bigText('ESPADA', 1580, seg(lt, dur(5) * 0.45, dur(5) * 0.6), '#dfe6ee', 110); });
// P6 the king: "choose, brother" — Bela between the two tables
sh(6, 0, (t, u, lt) => { camPath([0, 600, 0.78], [0, 620, 0.9], u); hall(t, { wall: '#5a4a5a', carpet: false }); L(1, () => { plinth(-560, 1000, 300); crown(-560, 660, 0.9); plinth(560, 1000, 300, { cloth: '#2f4a6a' }); sword(560, 655, 0.75, Math.PI / 2);
    person(0, 1000, 600, BELA, pose('think', t), { expr: 'worried', look: Math.sin(t * 2.5) > 0 ? 1 : -1, sweat: true }, t); person(-900, 1010, 640, ANDR, pose('point', t, { armR: -1.4 }), { expr: 'smug', talk: true, look: 1 }, t); });
  popText('¿EL REINO…', 400, lt, 0.2, '#ffd23f', 100); popText('…O TU DUCADO?', 520, lt, dur(6) * 0.5, '#dfe6ee', 96); });
// P7a corridor: a noble whispers in his ear; P7b behind the curtain: soldiers with axes
sh(7, 0, (t, u, lt) => { camPath([0, 560, 1.35], [20, 540, 1.6], u); corridor(t); L(1, () => { person(120, 1000, 640, BELA, pose('stand', t), { expr: u > 0.4 ? 'shock' : 'neutral', look: -1 }, t, true); person(-170, 1000, 600, NOBLE, pose('stand', t, { lean: 0.22, armR: -1.2, elbR: 2.2 }), { expr: 'worried', talk: true, look: 1 }, t); });
  popText('«SI TOMAS LA CORONA…»', 400, lt, 0.2, '#fff', 76); popText('«…TE MATAN»', 1560, lt, dur(7) * 0.35, '#ff5a4a', 110); });
sh(7, 0.55, (t, u, lt) => { camPath([0, 700, 1.0], [0, 760, 1.2], u, easeIn); corridor(t); L(1, () => curtain(-520, 1000, 1040, 900, t, ease(seg(lt, 0.1, 0.5)))); screen(() => { g.fillStyle = `rgba(30,0,10,${0.35 * u})`; g.fillRect(0, 0, W, H); });
  popText('HACHAS ESCONDIDAS', 1560, lt, 0.2, '#ff5a4a', 86); });
// P8a he takes the sword (king's smile freezes); P8b he walks out alive
sh(8, 0, (t, u, lt) => { camPath([200, 620, 1.1], [240, 600, 1.25], u); hall(t, { wall: '#5a4a5a', carpet: false }); const k = ease(seg(lt, 0.15, 0.6)); L(1, () => { plinth(-460, 1000, 300); crown(-460, 660, 0.9); plinth(360, 1000, 300, { cloth: '#2f4a6a' });
    person(120, 1000, 620, BELA, pose('stand', t, { armR: lerp(-1.0, -2.8, k), elbR: lerp(0.6, -0.2, k) }), { expr: 'determined', look: 1, hold: k > 0.05 ? holdSword(k) : null }, t); if (k <= 0.05) sword(360, 655, 0.75, Math.PI / 2); person(-760, 1010, 600, ANDR, pose('stand', t), { expr: k > 0.5 ? 'worried' : 'smug', look: 1 }, t); });
  popText('¡LA ESPADA!', 400, lt, dur(8) * 0.2, '#dfe6ee', 110); shakeAt(t, st(8) + 0.5, 10); });
sh(8, 0.55, (t, u, lt) => { const x = lerp(-200, 600, u); camTo(x - 80, 640, 0.9); corridor(t); L(1, () => { rr(560, 380, 300, 620, 140); ol('#f6dcb0', 7); person(x, 1000, 600, BELA, pose('walk', t), { expr: 'happy', sweat: true, look: 1, hold: holdSword(0) }, t); });
  popText('…Y SALE VIVO', 1560, lt, 0.15, '#7fe08a', 100); });
// P9a escape to Poland through the snow; P9b he returns with an army (banners)
sh(9, 0, (t, u, lt) => { const x = lerp(-500, 500, u); camTo(x, 650, 0.85); wintr(t); L(1, () => { horse(x, 1000, 1.25, t); person(x - 20, 830, 520, BELA, pose('sit', t, { armR: -1.0, elbR: 0.6 }), { expr: 'determined', look: 1, shadow: false }, t); }); screen(() => snow(t)); screen(() => speedLines(t, 'h', 0.25));
  popText('NO LO OLVIDA', 400, lt, 0.1, '#fff', 100); bigText('→ POLONIA', 1560, seg(lt, dur(9) * 0.3, dur(9) * 0.45), '#ffd23f', 100); }, 1);
sh(9, 0.55, (t, u, lt) => { camPath([300, 700, 0.85], [0, 720, 0.95], u); field(t, { top: '#c8a0a0', bot: '#f4dcc0' }); L(1, () => { for (let r = 0; r < 2; r++) crowdRow(t, -1500 + r * 200 + t * 60, 1000 + r * 140, 9, 420, 330, { cast: ARMY, off: r, pose: () => 'walk', expr: () => 'determined', talk: false, noflip: true });
    for (let i = 0; i < 4; i++) banner(-1300 + i * 800 + t * 60, 1000, 1.1, t + i, i % 2 ? '#c0283a' : '#f4f1ea'); });
  popText('…CON UN EJÉRCITO', 400, lt, 0.15, '#fff', 90); });
// P10a battle: Andrés runs away, crown falls; P10b Bela sits on the golden throne, court bows
sh(10, 0, (t, u, lt) => { camPath([-200, 620, 0.8], [200, 620, 0.9], u); field(t, { mud: '#a8925a' }); L(1, () => { crowdRow(t, -1300, 1000, 3, 520, 300, { cast: ARMY, pose: () => 'run', expr: () => 'angry', talk: false, noflip: true });
    person(-200, 1000, 600, BELA, pose('run', t, { armR: -2.6 }), { expr: 'angry', look: 1, hold: holdSword(1) }, t); const ax = lerp(300, 1100, u); person(ax, 1000, 580, ANDR, pose('run', t), { expr: 'scared', look: -1 }, t, false);
    crown(lerp(300, 420, u), 1000 - 40 - Math.abs(Math.sin(u * 9)) * 60 * (1 - u), 0.7, u * 6); puff(200, 1000, 1.6, (lt * 0.9) % 1); }); screen(() => speedLines(t, 'h', 0.2));
  popText('DERROTA A SU HERMANO', 400, lt, 0.15, '#fff', 80); }, 1);
sh(10, 0.55, (t, u, lt) => { camPath([0, 620, 0.9], [0, 640, 1.0], u); hall(t); L(1, () => { seated(0, 1000, 1.15, 600, BELAK, t, { expr: 'smug', look: 0, thr: { gold: true } });
    crowdRow(t, -1000, 1040, 2, 520, 300, { cast: COURT, pose: () => 'plead', expr: () => 'happy', noflip: true }); crowdRow(t, 560, 1040, 2, 520, 300, { cast: COURT, off: 2, pose: () => 'plead', expr: () => 'happy', noflip: true }); });
  popText('¡REY BELA!', 400, lt, 0.15, '#ffd23f', 110); });
// P11 mint: hammer strikes, coins fly
sh(11, 0, (t, u, lt) => { camPath([0, 600, 1.0], [80, 600, 1.12], u); mint(t); const hk = Math.abs(Math.sin(t * 5));
  L(1, () => { rr(-60, 760, 260, 240, 10); ol('#5a5a62', 7); person(-300, 1000, 600, SOLD(2), pose('stand', t, { armR: lerp(-2.6, -1.3, hk), elbR: lerp(-0.3, 0.2, hk), lean: 0.1 }), { expr: 'determined', look: 1, hold: (hR) => { g.save(); g.translate(hR[0], hR[1]); g.rotate(lerp(-2.4, -1.2, hk) + Math.PI); line([[0, 0], [0, 170]], 12, '#6a4022'); rr(-50, 160, 100, 54, 8); ol('#7a7a82', 6); g.restore(); } }, t);
    for (let i = 0; i < 9; i++) { const ph = (t * 0.8 + R(i)) % 1; coin(60 + (R(i + 2) - 0.3) * 700 * ph, 740 - Math.sin(ph * Math.PI) * 600 + ph * 200, 38, t, i); }
    person(480, 1000, 600, BELAK, pose('proud', t), { expr: 'happy', look: -1 }, t, true); });
  popText('POR FIN ES REY', 400, lt, 0.1, '#ffd23f', 96); popText('MONEDAS DE PLATA', 1560, lt, dur(11) * 0.45, '#fff', 86); });
// P12 re-hook: dark push-in on a plain wooden throne, cracks appear
sh(12, 0, (t, u, lt) => { camPath([0, 700, 1.1], [0, 760, 1.9], u, easeIn); hall(t, { wall: '#4a3e3a', night: true, carpet: false }); L(1, () => throne(0, 1000, 1.3, 0, { cracks: seg(u, 0.2, 0.7) })); screen(() => { g.fillStyle = `rgba(30,0,10,${0.45 * u})`; g.fillRect(0, 0, W, H); });
  popText('PERO ESO NO FUE LO PEOR', 420, lt, 0.1, '#fff', 72); });
// P13a Dömös: wooden manor by the Danube; P13b he sits down on the wooden throne (creak)
sh(13, 0, (t, u, lt) => { camPath([0, 560, 0.62], [0, 640, 0.75], u); manorOut(t); bigText('DÓMOSH', 380, seg(lt, 0.1, 0.35), '#fff', 120); bigText('3 AÑOS DESPUÉS', 520, seg(lt, 0.3, 0.55), '#ffd23f', 80); });
sh(13, 0.45, (t, u, lt) => { camPath([0, 640, 0.95], [0, 660, 1.08], u); hall(t, { wall: '#8a6a4a', floor: '#6a4a30', carpet: false }); const k = ease(seg(u, 0.05, 0.6));
  L(1, () => { throne(0, 1000, 1.15, 0, { cracks: seg(u, 0.6, 0.95) }); const sy = lerp(1000 - 20, 1000 - 230 + 0.155 * 600 + 20, k); person(0, sy, 600, BELAK, mixPose(pose('stand', t), sitP(t), k), { expr: 'happy', look: 0 }, t);
    crowdRow(t, -900, 1040, 2, 520, 300, { cast: COURT, off: 1, pose: () => 'stand', expr: () => 'talk', noflip: true }); });
  popText('TRONO DE MADERA', 1560, lt, dur(13) * 0.2, '#e3b06a', 90); if (u > 0.7) popText('*CRIC*', 420, lt, dur(13) * 0.38, '#fff', 110); });
// P14 the throne breaks: close on the legs snapping, splinters
sh(14, 0, (t, u, lt) => { camPath([0, 820, 1.6], [0, 860, 1.4], u); hall(t, { wall: '#8a6a4a', floor: '#6a4a30', carpet: false }); const b = ease(seg(lt, 0.25, 1.0));
  L(1, () => { throne(0, 1000, 1.15, b); if (b < 0.3) person(0, 1000 - 230 + 0.155 * 600 + 20 + b * 300, 600, BELAK, sitP(t, { armL: 2.3, armR: -2.3 }), { expr: 'shock' }, t); puff(0, 990, 2.6, seg(lt, 0.3, 1.6)); });
  shakeAt(t, st(14) + 0.3, 34); popText('¡CRAC!', 420, lt, 0.28, '#ffb43a', 150); }, 1);
// P15 wide: courtiers shocked, dust cloud, crown rolls across the floor
sh(15, 0, (t, u, lt) => { camPath([0, 620, 0.85], [150, 640, 0.95], u); hall(t, { wall: '#8a6a4a', floor: '#6a4a30', carpet: false }); const cx = lerp(80, 760, easeOut(u));
  L(1, () => { throne(0, 1000, 1.15, 1); puff(0, 990, 3.4, clamp(0.25 + lt / 2.4)); crown(cx, 960 - Math.abs(Math.sin(u * 12)) * 40 * (1 - u), 0.75, u * 9);
    crowdRow(t, -1000, 1040, 2, 540, 300, { cast: COURT, pose: () => 'shock', expr: () => 'shock', noflip: true }); person(560, 1040, 560, COURT[3], pose('cover', t), { expr: 'scared', look: -1 }, t, true); });
  popText('CON TODO Y REY', 400, lt, 0.2, '#fff', 100); });
// P16 injured, carried in a cart to defend the border (camera follows)
sh(16, 0, (t, u, lt) => { const x = lerp(-500, 500, u); camTo(x + 100, 640, 0.72); landscape(t, { top: '#c8b0a0', bot: '#f4dcc0' });
  L(1, () => { horse(x + 520, 1180, 1.2, t); cart(x, 1180, 1.1, t, { roll: 3 }); g.save(); g.translate(x - 30, 1180 - 260); g.rotate(-Math.PI / 2); person(0, 0, 420, BELAK, pose('stand', t, { armL: 0.1, armR: -0.1 }), { expr: 'pain', shadow: false, sweat: true }, t); g.restore();
    g.beginPath(); g.moveTo(x - 300, 1180 - 250); g.quadraticCurveTo(x - 50, 1180 - 330, x + 300, 1180 - 250); g.lineTo(x + 300, 1180 - 240); g.lineTo(x - 300, 1180 - 240); g.closePath(); ol('#c9a24a', 5);
    crowdRow(t, x - 1200, 1200, 3, 460, 300, { cast: ARMY, pose: () => 'walk', expr: () => 'worried', talk: false, noflip: true }); });
  popText('HERIDO', 400, lt, 0.1, '#ff8a6a', 110); popText('A LA FRONTERA', 1560, lt, dur(16) * 0.4, '#fff', 90); });
// P17 dusk at a stream: cart stopped, covered; soldiers take off helmets (death implied)
sh(17, 0, (t, u, lt) => { camPath([0, 560, 0.7], [0, 600, 0.8], u); sky('#5a3a5a', '#e89a6a'); L(0.1, () => { circ(0, 700, 160); ol('#ffcf7a', 0); }); L(0.3, () => { g.fillStyle = '#4a4a5a'; g.fillRect(-4000, 900, 8000, 2000); });
  L(1, () => { g.fillStyle = '#5a6a4a'; g.fillRect(-4000, 1000, 8000, 2000); line([[-4000, 1000], [4000, 1000]], 6); stream(1120, t); cart(-200, 1100, 1.0, t, { roll: 0, cloth: '#e8e0cc' }); horse(320, 1100, 1.0, t, 0);
    for (let i = 0; i < 3; i++) person(-700 + i * 650 + (i === 2 ? 300 : 0), 1500, 520, Object.assign({}, SOLD(i), { hat: null }), pose('stand', t, { tilt: 0.25, armL: 0.6, elbL: -1.4 }), { expr: 'sad', look: 0 }, t, i === 2); });
  bigText('EN UN ARROYO', 380, seg(lt, 0.2, 0.5), '#fff', 100); bigText('1063', 500, seg(lt, dur(17) * 0.6, dur(17) * 0.75), '#ffd23f', 110); });
// P18a flashback (sepia): crown vs sword; P18b the broken throne under a spotlight, crown on top
sh(18, 0, (t, u, lt) => { camPath([0, 640, 0.95], [0, 640, 1.05], u); fx({ sepia: 0.9 }); hall(t, { wall: '#5a4a5a', carpet: false }); L(1, () => { plinth(-330, 1000, 320); crown(-330, 660, 1.0); line([[-460, 560], [-200, 760]], 14, '#c0283a'); line([[-200, 560], [-460, 760]], 14, '#c0283a'); plinth(330, 1000, 320, { cloth: '#2f4a6a' }); sword(330, 655, 0.8, Math.PI / 2); });
  popText('ESQUIVÓ LA CORONA', 400, lt, 0.1, '#fff', 86); });
sh(18, 0.5, (t, u, lt) => { camPath([0, 820, 1.3], [0, 800, 1.6], u); screen(() => { g.fillStyle = '#120f18'; g.fillRect(0, 0, W, H); }); L(1, () => { g.save(); g.globalAlpha = 0.35; poly([[-80, -400], [80, -400], [460, 1100], [-460, 1100]]); g.fillStyle = '#fff4d0'; g.fill(); g.restore(); ell(0, 1000, 460, 60); ol('#3a3040', 0); throne(0, 1000, 1.0, 1); crown(30, 940, 0.8, 0.4); });
  popText('…Y LO MATÓ LA SILLA', 1550, lt, 0.2, '#ffb43a', 84); });
// P19 question: Bela between crown and sword again, looks at us (loop to frame 0)
sh(19, 0, (t, u, lt) => { camPath([0, 620, 0.85], [0, 620, 0.95], u); hall(t, { wall: '#5a4a5a', carpet: false }); L(1, () => { plinth(-480, 1000, 300); crown(-480, 660 + Math.sin(t * 3) * 6, 0.9); plinth(480, 1000, 300, { cloth: '#2f4a6a' }); sword(480, 655, 0.75, Math.PI / 2 + Math.sin(t * 3) * 0.03);
    person(0, 1000, 620, BELA, pose('think', t), { expr: 'worried', look: Math.sin(t * 2) > 0 ? 1 : -1 }, t); });
  screen(() => { const k = back(seg(lt, 0.2, 0.5)); g.save(); g.translate(W / 2, 400); g.scale(k, k); txt('¿TÚ QUÉ ELEGIRÍAS?', 0, -60, 88, '#fff', 16); txt('¿CORONA O ESPADA?', 0, 50, 84, '#ffd23f', 16); g.restore(); }); tag(seg(lt, 0.3, 0.6)); });
