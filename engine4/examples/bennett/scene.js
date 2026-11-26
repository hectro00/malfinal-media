// Arnold Bennett — Paris, enero 1931: bebe agua de la llave para demostrar que es segura; muere de tifoidea en Londres, 27 mar 1931 (engine4). Death never shown.
import { K, W, H, OUT, clamp, lerp, ease, easeIn, easeOut, back, R, seg, ol, rr, circ, ell, line, poly, txt, L, screen, camTo, camPath, shakeAt, handheld,
  person, pose, mixPose, cloud, puff, speedLines, sky, building, lamp, tower, tree } from './engine.js';
import { PH, st, en, dur, sh, fx, crowdRow, clouds, skyline, CROWD, smoke } from './lib.js';
export { FRAMES, frame, post, blurN } from './lib.js';
const g = K.g;
// ---------- cast ----------
const BEN = { skin: '#f2c9a0', hair: '#6a4a32', hairStyle: 'side', mustache: true, jacket: '#3a3550', shirt: '#f4f1ea', tie: '#b02a3a', pants: '#2e2a40', shoes: '#1a1a1a', seed: 1 };
const WAIT = { skin: '#e0a97f', hair: '#1e1e1e', hairStyle: 'side', mustache: true, jacket: '#f2efe6', shirt: '#ffffff', tie: '#1a1a1a', pants: '#1d1d24', shoes: '#111', seed: 3 };
const DOC = (i) => ({ skin: ['#f5d2b3', '#e8b98f'][i % 2], hair: ['#999', '#3a2a1a'][i % 2], hairStyle: ['bald', 'side'][i % 2], glasses: true, beard: i === 0, coat: '#f2f2f2', pants: '#3a3a44', shoes: '#222', seed: 30 + i });
const WORK = (i) => ({ skin: ['#e0a97f', '#f2c9a0', '#c98e62'][i % 3], hair: '#3a2a1a', hairStyle: 'side', hat: 'cap', hatColor: ['#5a4a3a', '#3a4a5a', '#4a3a3a'][i % 3], coat: ['#8a6a3a', '#4a6a8a', '#6a4a5a'][i % 3], pants: '#3a3a44', shoes: '#222', mustache: i % 2 === 0, seed: 40 + i });
const NEWS = { skin: '#f5d2b3', hair: '#7a4a2a', hairStyle: 'side', hat: 'cap', hatColor: '#6a5a40', coat: '#9a4a2a', pants: '#3a3a44', shoes: '#222', seed: 50 };
// ---------- props ----------
// glass: origin = bottom centre; lvl 0..1 water level
function glass(x, y, s, lvl = 1, t = 0, germs = 0) { g.save(); g.translate(x, y); g.scale(s, s);
  const wob = Math.sin(t * 6) * 3;
  if (lvl > 0.02) { const top = -150 * lvl; g.beginPath(); g.moveTo(-44, -4); g.lineTo(-52 + 8 * (1 - lvl), top + wob * 0.3); g.quadraticCurveTo(0, top - 6 + wob, 52 - 8 * (1 - lvl), top - wob * 0.3); g.lineTo(44, -4); g.closePath(); g.fillStyle = 'rgba(140,200,235,0.75)'; g.fill(); }
  if (germs > 0) for (let i = 0; i < 6; i++) { const gx = -28 + R(i) * 56 + Math.sin(t * 3 + i) * 6, gy = -20 - R(i + 4) * 120 * lvl + Math.cos(t * 2.5 + i) * 6; if (gy < -150 * lvl + 10) continue; germ(gx, gy, 9 * germs, t + i); }
  g.beginPath(); g.moveTo(-56, -160); g.lineTo(-44, 0); g.lineTo(44, 0); g.lineTo(56, -160); g.strokeStyle = OUT; g.lineWidth = 6; g.lineJoin = 'round'; g.stroke();
  g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 6; g.beginPath(); g.moveTo(-36, -140); g.lineTo(-30, -30); g.stroke(); g.restore(); }
function germ(x, y, r, t) { g.save(); g.translate(x, y); g.rotate(Math.sin(t * 4) * 0.3); for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2 + t; line([[Math.cos(a) * r, Math.sin(a) * r], [Math.cos(a) * r * 1.5, Math.sin(a) * r * 1.5]], Math.max(2, r * 0.25)); }
  circ(0, 0, r); ol('#7fcf5a', Math.max(2, r * 0.3)); circ(-r * 0.35, -r * 0.15, r * 0.22); ol('#fff', 0); circ(r * 0.35, -r * 0.15, r * 0.22); ol('#fff', 0); circ(-r * 0.35, -r * 0.1, r * 0.1); ol(OUT, 0); circ(r * 0.35, -r * 0.1, r * 0.1); ol(OUT, 0); g.restore(); }
const holdGlass = (lvl, t, tilt = 0) => (hR) => { g.save(); g.translate(hR[0], hR[1] + 10); g.rotate(tilt); glass(0, 30, 0.55, lvl, t); g.restore(); };
const drinkP = (t, k) => pose('stand', t, { armR: lerp(-0.3, -0.75, k), elbR: lerp(1.2, 2.55, k), tilt: -0.18 * k, armL: 0.3, elbL: -0.4 });
function benDrink(x, y, h, k, lvl, t, flip, s = {}) { const sc = h / 300, f = flip ? 1 : -1; person(x, y, h, BEN, pose('stand', t, { armR: lerp(-0.2, -0.55, k), elbR: lerp(0.6, 2.6, k), tilt: -0.12 * k * f }), s, t, flip);
  g.save(); g.translate(x + f * lerp(55, 45, k) * sc, y - lerp(130, 184, k) * sc); g.rotate(f * lerp(0, -1.0, k)); glass(0, 40 * sc, 0.5 * sc, lvl, t); g.restore(); }
function pitcher(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.beginPath(); g.moveTo(-40, 0); g.lineTo(-50, -120); g.lineTo(-70, -140); g.lineTo(50, -140); g.lineTo(40, 0); g.closePath(); ol('#e8eef2'); g.beginPath(); g.arc(55, -80, 30, -1.2, 1.2); g.strokeStyle = OUT; g.lineWidth = 8; g.stroke(); g.restore(); }
// ---------- sets ----------
function dining(t, o = {}) { g.fillStyle = '#5a2f3a'; g.fillRect(0, 0, W, H);
  L(0.5, () => { g.fillStyle = '#7a3a44'; g.fillRect(-3000, -2000, 6000, 3000); for (let i = 0; i < 9; i++) { rr(-1800 + i * 420, -200, 50, 1200, 6); ol('#c9a24a', 5); } for (let i = 0; i < 4; i++) { rr(-1200 + i * 640, 0, 260, 520, 120); ol('#2a3a5a', 6); rr(-1190 + i * 640, 10, 240, 500, 110); ol('#3f5a80', 0); }
    for (let i = 0; i < 3; i++) { const cx = -900 + i * 900; line([[cx, -600], [cx, -250]], 4, '#c9a24a'); for (let k = -2; k <= 2; k++) { circ(cx + k * 45, -230 + Math.abs(k) * -12, 16); ol('#ffe9a8', 4); } ell(cx, -240, 120, 30); ol('rgba(255,233,168,0.5)', 0); }
  });
  L(0.7, () => { g.fillStyle = '#5e3e2a'; g.fillRect(-4000, 800, 8000, 3000); line([[-4000, 800], [4000, 800]], 6); for (let i = 0; i < 5; i++) { rr(-1500 + i * 700, 640, 380, 26, 8); ol('#fbf7ea', 5); }
    crowdRow(t, -1500, 800, 9, 340, 360, { expr: (i) => (o.crowdExpr ? o.crowdExpr(i) : (R(i) > 0.5 ? 'happy' : 'talk')), pose: o.crowdPose, look: o.crowdLook ?? 0 }); });
  L(1, () => { g.fillStyle = '#6a4630'; g.fillRect(-3000, 1000, 6000, 2000); line([[-3000, 1000], [3000, 1000]], 6); for (let i = 0; i < 12; i++) line([[-3000 + i * 500, 1000], [-3200 + i * 500, 2000]], 4, '#5a3a26'); }); }
function table(x, y, w, t, o = {}) { rr(x - w / 2, y - 260, w, 30, 8); ol('#fbf7ea', 6); poly([[x - w / 2, y - 232], [x + w / 2, y - 232], [x + w / 2 - 20, y - 120], [x - w / 2 + 20, y - 120]]); ol('#f4efe2', 6); rr(x - 18, y - 120, 36, 120, 4); ol('#5a3418', 5);
  if (o.candle !== false) { rr(x + w * 0.3, y - 340, 18, 80, 4); ol('#f4efe2', 4); const fl = Math.sin(t * 12) * 4; g.beginPath(); g.moveTo(x + w * 0.3 + 2, y - 340); g.quadraticCurveTo(x + w * 0.3 + 9 + fl, y - 380, x + w * 0.3 + 9, y - 392); g.quadraticCurveTo(x + w * 0.3 + 16 + fl, y - 360, x + w * 0.3 + 16, y - 340); g.closePath(); ol('#ffcf3a', 3); }
  ell(x - w * 0.15, y - 266, 70, 12); ol('#e8e2d6', 4); }
function street(t, o = {}) { sky(o.top || '#9cc0dc', o.bot || '#f4dcc0'); L(0.08, () => clouds(t, -650, 5, 0.9)); if (o.eiffel) L(0.2, () => tower(650, 950, 1.9, { lw: 4 })); L(0.35, () => skyline(950, 1, o.far || '#b9c6d3', o.seed || 1));
  L(1, () => { building(-1500, 1000, 760, 900, { door: true }); building(-700, 1000, 700, 1000, { col: '#e3d2b4', door: true }); building(40, 1000, 760, 880, { col: '#ede2cf', door: true }); building(840, 1000, 720, 960, { col: '#e0cdb0' }); g.fillStyle = o.road || '#8a8a92'; g.fillRect(-3000, 1000, 6000, 2000); line([[-3000, 1000], [3000, 1000]], 6); g.fillStyle = '#b8b2a6'; g.fillRect(-3000, 1000, 6000, 60); line([[-3000, 1060], [3000, 1060]], 5);
    for (let i = 0; i < 6; i++) lamp(-1300 + i * 520, 1010, 1.2, o.night ? 1 : 0); }); }
function bedroom(t, o = {}) { g.fillStyle = '#3a3a52'; g.fillRect(0, 0, W, H); L(0.6, () => { g.fillStyle = o.wall || '#7a8a9a'; g.fillRect(-3000, -2000, 6000, 3000); for (let i = 0; i < 14; i++) line([[-2000 + i * 300, -2000], [-2000 + i * 300, 1000]], 5, 'rgba(255,255,255,0.12)');
    rr(260, 80, 420, 560, 20); ol('#2a3550', 7); line([[470, 80], [470, 640]], 5); line([[260, 360], [680, 360]], 5); rr(230, 60, 80, 620, 10); ol('#9a3a3a', 5); rr(630, 60, 80, 620, 10); ol('#9a3a3a', 5);
    rr(-760, 120, 260, 200, 6); ol('#c9a24a', 6); rr(-740, 140, 220, 160, 4); ol('#5a7a6a', 0); });
  L(1, () => { g.fillStyle = '#6a4a3a'; g.fillRect(-3000, 1000, 6000, 2000); line([[-3000, 1000], [3000, 1000]], 6); }); }
function bed(x, y, t, o = {}) { rr(x - 420, y - 420, 50, 420, 10); ol('#5a3418'); rr(x + 370, y - 300, 50, 300, 10); ol('#5a3418'); rr(x - 400, y - 200, 800, 90, 12); ol('#7a4a2a');
  if (o.who !== false) { g.save(); g.translate(x + 60, y - 255); g.rotate(-Math.PI / 2 + 0.03); person(0, 0, 420, BEN, pose('stand', t, { armL: 0.1, armR: -0.1 }), { expr: o.expr || 'pain', sweat: o.sweat, shadow: false, look: 0 }, t); g.restore(); }
  rr(x - 380, y - 300, 120, 70, 30); ol('#f4f1ea', 5);
  g.beginPath(); g.moveTo(x - 300, y - 230); g.quadraticCurveTo(x, y - 300 + Math.sin(t * 1.5) * (o.who === false ? 0 : 6), x + 380, y - 240); g.lineTo(x + 380, y - 110); g.lineTo(x - 300, y - 110); g.closePath(); ol(o.blanket || '#c9a24a', 6);
  for (let k = 0; k < 4; k++) line([[x - 220 + k * 160, y - 250 - (k === 1 || k === 2 ? 15 : 0)], [x - 200 + k * 160, y - 120]], 3, 'rgba(60,40,20,0.3)'); }
function thermo(x, y, s, k) { g.save(); g.translate(x, y); g.scale(s, s); rr(-26, -400, 52, 400, 26); ol('#fbfbfb'); circ(0, 10, 46); ol('#e03a3a'); rr(-12, -380 * k, 24, 380 * k + 10, 12); ol('#e03a3a', 0); for (let i = 1; i < 8; i++) line([[14, -i * 48], [26, -i * 48]], 4); g.restore(); }
function train(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s);
  for (let c = 1; c <= 2; c++) { const cx = -c * 520; rr(cx - 230, -300, 460, 220, 14); ol(c === 1 ? '#2f5a3a' : '#5a2f3a'); for (let k = 0; k < 4; k++) { rr(cx - 200 + k * 110, -270, 80, 80, 8); ol('#ffe6a3', 5); } for (const wx of [-150, 150]) { circ(cx + wx, -60, 52); ol('#2a2a2a'); circ(cx + wx, -60, 16); ol('#888', 4); } line([[cx + 230, -120], [cx + 290, -120]], 10); }
  rr(-240, -340, 480, 260, 20); ol('#2a2a34'); rr(80, -460, 160, 140, 10); ol('#3a3a44'); rr(-180, -440, 70, 110, 6); ol('#3a3a44'); rr(-200, -460, 110, 26, 4); ol('#222');
  for (const [wx, r] of [[-140, 60], [20, 60], [170, 60]]) { g.save(); g.translate(wx, -70); g.rotate(t * 8); circ(0, 0, r); ol('#b02a3a'); line([[-r, 0], [r, 0]], 6); line([[0, -r], [0, r]], 6); g.restore(); }
  line([[-140 + Math.cos(t * 8) * 30, -70 + Math.sin(t * 8) * 30], [170 + Math.cos(t * 8) * 30, -70 + Math.sin(t * 8) * 30]], 10, '#888');
  for (let k = 0; k < 6; k++) { const ph = (t * 1.2 + k / 6) % 1; g.globalAlpha = 0.85 * (1 - ph); circ(-145 - ph * 600, -480 - ph * 260 + Math.sin(ph * 8 + k) * 30, 40 + ph * 80); ol('#f2f2f2', 4); } g.globalAlpha = 1;
  g.restore(); }
function newspaper(x, y, s, head, sub = '') { g.save(); g.translate(x, y); g.scale(s, s); rr(-210, -280, 420, 560, 6); ol('#f4efe2'); txt('THE TIMES', 0, -230, 46, '#1d1b22', 0, 'center', '900'); line([[-180, -195], [180, -195]], 4); txt(head, 0, -130, 58, '#b02a3a', 0); if (sub) txt(sub, 0, -70, 34, '#1d1b22', 0);
  for (let k = 0; k < 9; k++) line([[-180, -10 + k * 28], [k % 3 === 2 ? 60 : 180, -10 + k * 28]], 6, 'rgba(30,30,40,0.35)'); g.restore(); }
function straw(y, k, t, x0 = -3000, x1 = 3000) { if (k <= 0) return; g.save(); g.globalAlpha = Math.min(1, k * 1.5); g.fillStyle = '#e3c46a'; g.fillRect(x0, y + 60, (x1 - x0) * Math.min(1, k * 1.2), 900); g.strokeStyle = '#b8963a'; g.lineWidth = 4;
  for (let i = 0; i < 260 * k; i++) { const sx = x0 + R(i) * (x1 - x0) * Math.min(1, k * 1.2), sy = y + 70 + R(i + 3) * 700, a = R(i + 5) * Math.PI; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + Math.cos(a) * 40, sy + Math.sin(a) * 12); g.stroke(); } g.restore(); }
function bale(x, y, s = 1) { rr(x - 80 * s, y - 90 * s, 160 * s, 90 * s, 14); ol('#e3c46a', 6); for (let k = 0; k < 3; k++) line([[x - 70 * s, y - 70 * s + k * 25 * s], [x + 70 * s, y - 70 * s + k * 25 * s]], 3, '#b8963a'); }
function pitchfork(hR, t) { g.save(); g.translate(hR[0], hR[1]); g.rotate(0.7); line([[0, -110], [0, 170]], 8, '#7a5a3a'); for (const dx of [-18, 0, 18]) line([[dx, 170], [dx, 230]], 5, '#888'); line([[-20, 170], [20, 170]], 6, '#888'); g.restore(); }
// ---------- text helpers ----------
function tag(a = 1) { screen(() => { g.globalAlpha = a; rr(40, 150, 470, 70, 16); ol('rgba(20,15,30,0.8)', 5); txt('MUERTES ABSURDAS #39', 275, 186, 34, '#ffd23f', 0); g.globalAlpha = 1; }); }
function bigText(s1, y, a, col = '#fff', size = 90) { if (a <= 0) return; screen(() => { g.globalAlpha = a; txt(s1, W / 2, y, size, col, 16); g.globalAlpha = 1; }); }
function popText(s1, y, lt, t0 = 0, col = '#fff', size = 90) { const k = back(seg(lt, t0, t0 + 0.25)); if (k <= 0) return; screen(() => { g.save(); g.translate(W / 2, y); g.scale(k, k); txt(s1, 0, 0, size, col, 16); g.restore(); }); }
// ---------- shots ----------
// P0 hook: in the dining room he gulps the glass; waiter recoils in horror
sh(0, 0, (t, u, lt) => { camPath([60, 640, 1.15], [60, 600, 1.3], u); dining(t, { crowdExpr: () => 'shock', crowdPose: () => 'shock' }); L(1, () => { table(-40, 1000, 520, t); const k = clamp(lt / 0.5);
  benDrink(-160, 1000, 600, k, lerp(1, 0.1, seg(lt, 0.3, 2.2)), t, true, { expr: 'closed' }); person(380, 1000, 580, WAIT, pose('shock', t), { expr: 'shock', look: -1 }, t, true); });
  shakeAt(t, 0.05, 18); popText('AGUA DE PARÍS', 420, lt, 0, '#fff', 96); if (u > 0.5) popText('…Y SE LA TOMÓ', 560, lt, dur(0) * 0.5, '#7fd0ff', 100); tag(); });
// P1a Paris 1931 street + tower; P1b he steps out of the hotel, name card
sh(1, 0, (t, u, lt) => { camPath([200, 300, 0.5], [250, 450, 0.6], u); street(t, { eiffel: true }); L(1, () => crowdRow(t, -1200, 1080, 6, 320, 450, { pose: () => 'walk', talk: false }));
  bigText('PARÍS', 380, seg(lt, 0.1, 0.4), '#fff', 130); bigText('1931', 520, seg(lt, 0.3, 0.6), '#ffd23f', 110); });
sh(1, 0.5, (t, u, lt) => { const x = lerp(-80, 120, u); camTo(x + 40, 700, 1.0); street(t); L(1, () => person(x, 1060, 620, BEN, pose('walk', t), { expr: 'smug', look: 1 }, t));
  screen(() => { const a = seg(lt, 0.15, 0.45); g.globalAlpha = a; rr(150, 1450, 780, 120, 24); ol('#fbf7ea', 6); txt('ARNOLD BENNETT', W / 2, 1510, 66, '#3a3550', 0); g.globalAlpha = 1; }); });
// P2 one of England's most famous writers: bookshop, fans with books, he signs
sh(2, 0, (t, u, lt) => { camPath([-100, 620, 0.85], [100, 640, 0.95], u); g.fillStyle = '#4a3a30'; g.fillRect(0, 0, W, H);
  L(0.6, () => { g.fillStyle = '#7a5a40'; g.fillRect(-3000, -2000, 6000, 3000); for (let r = 0; r < 6; r++) { rr(-1800, -200 + r * 200, 3600, 20, 2); ol('#5a3418', 4); for (let b = 0; b < 40; b++) { const bh = 120 + R(b + r * 50) * 50; rr(-1780 + b * 90, -200 + r * 200 - bh, 70, bh, 4); ol(['#b02a3a', '#2f5a3a', '#3a4a8a', '#c9a24a', '#6a3a6a'][(b + r) % 5], 4); } } });
  L(1, () => { g.fillStyle = '#6a4630'; g.fillRect(-3000, 1000, 6000, 2000); line([[-3000, 1000], [3000, 1000]], 6); table(-250, 1000, 480, t, { candle: false }); for (let k = 0; k < 4; k++) { rr(-430 + k * 20, 700 - k * 34, 160, 34, 4); ol(['#b02a3a', '#3a4a8a', '#c9a24a', '#2f5a3a'][k], 4); }
    person(-330, 1000, 560, BEN, pose('write', t, { armR: -0.7 + Math.sin(t * 9) * 0.12 }), { expr: 'smug', look: 1 }, t);
    for (let i = 0; i < 4; i++) { const qx = 120 + i * 230; person(qx, 1000 + (i % 2) * 15, 480, CROWD[i + 1], pose('carry', t + i * 0.4), { expr: 'happy', look: -1, hold: (hR, hL) => { rr(hR[0] - 10, hR[1] - 40, 70, 90, 4); ol('#b02a3a', 4); } }, t + i, true); } });
  bigText('ESCRITOR FAMOSO', 400, seg(lt, 0.2, 0.5), '#ffd23f', 92); });
// P3 rich, elegant, know-it-all: he lectures, finger up, coins rain
sh(3, 0, (t, u, lt) => { camPath([0, 560, 1.1], [0, 520, 1.3], u); g.fillStyle = '#2a2440'; g.fillRect(0, 0, W, H); L(0.6, () => { for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + t * 0.3; poly([[0, 500], [Math.cos(a) * 3000, 500 + Math.sin(a) * 3000], [Math.cos(a + 0.26) * 3000, 500 + Math.sin(a + 0.26) * 3000]]); ol(i % 2 ? '#3a3260' : '#4a4078', 0); } });
  L(1, () => { person(0, 1000, 700, BEN, pose('stamp', t, { armR: -2.7, elbR: -0.3 }), { expr: 'smug', talk: true, look: 0.3 }, t, true); for (let i = 0; i < 10; i++) { const ph = (t * 0.6 + R(i)) % 1; const cx = -500 + R(i + 2) * 1000, cy = -100 + ph * 1200; g.save(); g.translate(cx, cy); g.scale(Math.cos(t * 6 + i), 1); circ(0, 0, 34); ol('#f2c23a', 5); g.restore(); } });
  popText('RICO', 360, lt, 0.1, '#ffd23f', 100); popText('ELEGANTE', 480, lt, dur(3) * 0.3, '#fff', 90); popText('SABELOTODO', 1560, lt, dur(3) * 0.6, '#7fd0ff', 100); });
// P4 luxury hotel in Paris: façade with sign, push to entrance
sh(4, 0, (t, u, lt) => { camPath([60, 380, 0.62], [70, 760, 1.05], u); street(t, { eiffel: true, top: '#e8a87a', bot: '#f6dcb0', night: true });
  L(1, () => { rr(-300, 120, 680, 120, 16); ol('#b02a3a', 7); txt('GRAND HÔTEL', 40, 182, 84, '#ffd23f', 8); rr(-100, 700, 300, 300, 140); ol('#c9a24a', 7); rr(-80, 720, 260, 280, 120); ol('#ffe6a3', 0); person(-260, 1060, 480, WAIT, pose('stand', t), { expr: 'happy', look: 1 }, t); person(lerp(500, 120, ease(u)), 1060, 520, BEN, pose('walk', t), { expr: 'smug', look: -1 }, t, true); });
  bigText('HOTEL DE LUJO', 1520, seg(lt, 0.3, 0.6), '#fff', 90); });
// P5 he asks for a glass of tap water
sh(5, 0, (t, u, lt) => { camPath([0, 620, 0.95], [40, 600, 1.1], u); dining(t); L(1, () => { table(-120, 1000, 560, t); person(-300, 1000, 600, BEN, pose('point', t, { armR: -1.2 }), { expr: 'talk', talk: true, look: 1 }, t); person(330, 1000, 580, WAIT, pose('write', t), { expr: 'neutral', look: -1 }, t, true); });
  popText('AGUA DE LA LLAVE', 420, lt, dur(5) * 0.35, '#7fd0ff', 92); });
// P6 waiter scared: don't drink it (pleads, hides the jug)
sh(6, 0, (t, u, lt) => { camPath([200, 560, 1.25], [230, 540, 1.45], u); dining(t); L(1, () => { table(-120, 1000, 560, t); person(-300, 1000, 600, BEN, pose('stand', t), { expr: 'smug', look: 1 }, t); person(300, 1000, 580, WAIT, pose('no', t), { expr: 'scared', talk: true, sweat: true, look: -1 }, t, true); pitcher(530, 1000, 0.9); });
  popText('¡NO, MONSIEUR!', 420, lt, 0.25, '#fff', 100); });
// P7 microscope view: germs in Paris water
sh(7, 0, (t, u, lt) => { camTo(0, 0, 1 + u * 0.15); screen(() => { g.fillStyle = '#0e1a2a'; g.fillRect(0, 0, W, H); g.save(); g.translate(W / 2, H / 2 - 60); circ(0, 0, 470); g.fillStyle = '#bfe3f2'; g.fill(); g.save(); circ(0, 0, 470); g.clip();
  g.fillStyle = 'rgba(140,200,235,0.6)'; g.fillRect(-500, -500, 1000, 1000); for (let i = 0; i < 14; i++) germ(-380 + R(i) * 760 + Math.sin(t * 1.5 + i) * 40, -380 + R(i + 6) * 760 + Math.cos(t * 1.2 + i) * 40, 34 + R(i + 9) * 24, t + i); g.restore(); circ(0, 0, 470); g.strokeStyle = OUT; g.lineWidth = 26; g.stroke(); circ(0, 0, 470); g.strokeStyle = '#555'; g.lineWidth = 14; g.stroke(); g.restore(); });
  bigText('FIEBRE TIFOIDEA', 1600, seg(lt, 0.2, 0.5), '#7fcf5a', 100); bigText('PARÍS, 1931', 260, seg(lt, 0.4, 0.7), '#fff', 70); });
// P8 he laughs it off
sh(8, 0, (t, u, lt) => { camPath([-300, 560, 1.3], [-300, 520, 1.5], u); dining(t); L(1, () => { table(-120, 1000, 560, t); person(-300, 1000, 620, BEN, pose('proud', t, { bob: Math.abs(Math.sin(t * 10)) * 8 }), { expr: 'laugh', look: 0.5 }, t); person(300, 1000, 580, WAIT, pose('cover', t), { expr: 'worried', look: -1 }, t, true); });
  popText('¡PUROS CUENTOS!', 420, lt, dur(8) * 0.35, '#ffd23f', 96); });
// P9 re-hook: glass alone on the table, dark push-in, germs inside
sh(9, 0, (t, u, lt) => { camPath([-100, 700, 1.4], [-100, 660, 2.4], u, easeIn); dining(t); L(1, () => { table(-120, 1000, 560, t); glass(-100, 740, 0.7, 1, t, seg(u, 0.3, 0.8)); }); screen(() => { g.fillStyle = `rgba(30,0,10,${0.4 * u})`; g.fillRect(0, 0, W, H); });
  popText('PERO ESO NO FUE LO PEOR', 420, lt, 0.1, '#fff', 72); });
// P10 he drinks the whole glass in front of everyone (diners stand up, shocked)
sh(10, 0, (t, u, lt) => { camPath([-60, 600, 0.85], [-160, 560, 1.15], u); dining(t, { crowdExpr: () => 'shock', crowdPose: (i) => (u > 0.4 ? 'shock' : 'stand'), crowdLook: 0 }); L(1, () => { table(-120, 1000, 560, t); const k = ease(seg(u, 0.1, 0.35));
  benDrink(-300, 1000, 620, k, lerp(1, 0, seg(u, 0.3, 0.9)), t, true, { expr: 'closed' }); person(330, 1000, 580, WAIT, pose('shock', t), { expr: 'shock', look: -1 }, t, true); });
  popText('¡COMPLETO!', 1560, lt, dur(10) * 0.7, '#7fd0ff', 110); shakeAt(t, st(10) + dur(10) * 0.7, 14); });
// P11a toast + smile, diners clap; P11b train back to London
sh(11, 0, (t, u, lt) => { camPath([-300, 560, 1.2], [-300, 560, 1.3], u); dining(t, { crowdPose: () => 'clap', crowdExpr: () => 'happy' }); L(1, () => { table(-120, 1000, 560, t); person(-300, 1000, 620, BEN, pose('stamp', t, { armR: -2.6 }), { expr: 'grin', look: 0.5, hold: holdGlass(0, t, 0) }, t); }); popText('¡SALUD!', 420, lt, 0.2, '#ffd23f', 110); });
sh(11, 0.5, (t, u, lt) => { const x = lerp(-600, 700, u); camTo(x - 300, 700, 0.7); sky('#9cc0dc', '#f4dcc0'); L(0.08, () => clouds(t, -500, 5)); L(0.4, () => { g.fillStyle = '#9fb27e'; g.beginPath(); g.moveTo(-4000, 1000); for (let k = -4000; k <= 4000; k += 400) g.quadraticCurveTo(k + 200, 800 + R(k) * 120, k + 400, 1000); g.lineTo(4000, 3000); g.lineTo(-4000, 3000); g.closePath(); ol('#9fb27e'); for (let i = 0; i < 8; i++) tree(-3000 + i * 800, 960, 1.4, i, t); });
  L(1, () => { g.fillStyle = '#7a6a5a'; g.fillRect(-4000, 1000, 8000, 2000); line([[-4000, 1000], [4000, 1000]], 6); for (let k = -40; k < 40; k++) rr(k * 110, 1000, 60, 18, 2); train(x, 1000, 1.0, t); }); screen(() => speedLines(t, 'h', 0.3));
  bigText('DE VUELTA A LONDRES', 400, seg(lt, 0.2, 0.5), '#fff', 80); }, 1);
// P12 days later: fever in bed, thermometer rising
sh(12, 0, (t, u, lt) => { camPath([0, 640, 0.95], [0, 640, 1.1], u); bedroom(t); L(1, () => { bed(-80, 1000, t, { sweat: true, expr: 'pain' }); thermo(480, 960, 1.2, lerp(0.2, 0.95, ease(seg(u, 0.2, 0.9)))); });
  bigText('DÍAS DESPUÉS', 400, seg(lt, 0.1, 0.4), '#fff', 96); popText('FIEBRE', 1560, lt, dur(12) * 0.5, '#ff6a4a', 120); });
// P13 "and here everything went wrong": dark push into the sweating face
sh(13, 0, (t, u, lt) => { camPath([-300, 700, 1.1], [-330, 760, 2.0], u, easeIn); bedroom(t); L(1, () => bed(-80, 1000, t, { sweat: true, expr: 'pain' })); screen(() => { g.fillStyle = `rgba(30,0,10,${0.45 * u})`; g.fillRect(0, 0, W, H); });
  popText('Y AQUÍ TODO SALIÓ MAL', 420, lt, 0.1, '#fff', 76); });
// P14 doctors confirm: typhoid (chart flips)
sh(14, 0, (t, u, lt) => { camPath([150, 600, 0.85], [150, 580, 1.0], u); bedroom(t); L(1, () => { bed(-150, 1000, t, { sweat: true, expr: 'pain' });
  person(420, 1000, 560, DOC(0), pose('write', t), { expr: 'worried', look: -1, hold: (hR, hL) => { rr(hL[0] - 70, hL[1] - 90, 120, 150, 6); ol('#f4efe2', 5); } }, t, true); person(730, 1000, 540, DOC(1), pose('no', t), { expr: 'sad', look: -1 }, t, true); });
  popText('TIFOIDEA', 420, lt, dur(14) * 0.4, '#7fcf5a', 120); });
// P15 all London follows the news: newsboy + crowd reading papers
sh(15, 0, (t, u, lt) => { camPath([-200, 620, 0.8], [200, 640, 0.9], u); street(t, { top: '#a8b4c0', bot: '#d8d4cc', far: '#9aa4b0', seed: 4 });
  L(1, () => { crowdRow(t, -1100, 1080, 7, 440, 300, { pose: () => 'carry', expr: () => 'worried', hold: null, look: 0 }); person(0, 1100, 560, NEWS, pose('stamp', t, { armR: -2.6 + Math.sin(t * 8) * 0.2 }), { expr: 'talk', talk: true, hold: (hR) => { g.save(); g.translate(hR[0], hR[1] - 90); g.rotate(Math.sin(t * 8) * 0.1); newspaper(0, 0, 0.4, 'BENNETT', '¿CÓMO SIGUE?'); g.restore(); } }, t); });
  screen(() => newspaper(W / 2, 1450, 0.95 * back(seg(lt, 0.3, 0.6)), 'BENNETT', 'GRAVE')); bigText('LONDRES', 380, seg(lt, 0.1, 0.4), '#fff', 110); });
// P16 workers cover the street with straw to muffle the noise
sh(16, 0, (t, u, lt) => { camPath([-200, 900, 0.95], [100, 920, 1.05], u); street(t, { top: '#a8b4c0', bot: '#d8d4cc', far: '#9aa4b0', seed: 4, road: '#7a7a82' });
  L(1, () => { straw(1000, ease(seg(u, 0, 0.9)), t); bale(-700, 1300); bale(600, 1320, 1.1); for (let i = 0; i < 3; i++) { const wx = -450 + i * 420; person(wx, 1250 + (i % 2) * 40, 480, WORK(i), pose('crank', t + i * 0.4, { armL: 0.9, elbL: -1.3 }), { expr: 'neutral', look: i % 2 ? -1 : 1, hold: (hR) => pitchfork(hR, t) }, t + i, i % 2 === 1); }
    rr(220, 180, 220, 160, 6); ol('#ffe6a3', 6); });
  popText('PAJA EN LA CALLE', 420, lt, dur(16) * 0.35, '#e3c46a', 92); popText('¡SHHH!', 1560, lt, dur(16) * 0.65, '#fff', 110); });
// P17 the last time London did that: wide street all in straw, horse cart slows, text
sh(17, 0, (t, u, lt) => { camPath([0, 400, 0.55], [0, 560, 0.68], u); street(t, { top: '#8a94a4', bot: '#cfc8bc', far: '#8a94a4', seed: 4, road: '#7a7a82', night: true });
  L(1, () => { straw(1000, 1, t); for (let i = 0; i < 4; i++) person(-900 + i * 600, 1300 + (i % 2) * 60, 420, CROWD[i + 2], pose('walk', t * 0.4 + i), { expr: 'sad', look: 1 }, t * 0.4 + i, i % 2 === 1); rr(220, 180, 220, 160, 6); ol('#ffe6a3', 6); });
  bigText('LA ÚLTIMA VEZ', 400, seg(lt, 0.2, 0.5), '#ffd23f', 110); bigText('QUE LONDRES LO HIZO', 520, seg(lt, 0.4, 0.7), '#fff', 72); });
// P18a March: empty bed, hat on the pillow, window rain; P18b the empty glass under a spotlight
sh(18, 0, (t, u, lt) => { camPath([0, 640, 0.9], [0, 620, 1.05], u); bedroom(t, { wall: '#5a6474' }); L(1, () => { bed(-80, 1000, t, { who: false, blanket: '#8a7a5a' }); ell(-400, 660, 70, 16); ol('#2b2b2b'); g.beginPath(); g.arc(-400, 650, 44, Math.PI, 0); g.closePath(); ol('#2b2b2b'); });
  bigText('MARZO DE 1931', 400, seg(lt, 0.2, 0.5), '#fff', 96); });
sh(18, 0.5, (t, u, lt) => { camPath([0, 760, 1.5], [0, 740, 1.8], u); screen(() => { g.fillStyle = '#120f18'; g.fillRect(0, 0, W, H); }); L(1, () => { g.save(); g.globalAlpha = 0.35; poly([[-80, -400], [80, -400], [420, 1100], [-420, 1100]]); g.fillStyle = '#fff4d0'; g.fill(); g.restore(); ell(0, 1000, 420, 60); ol('#3a3040', 0); glass(0, 1000, 1.3, 0, t); });
  popText('UN VASO DE AGUA', 1550, lt, 0.3, '#7fd0ff', 100); });
// P19 question: back to the dining room, he raises a fresh glass (loop to frame 0)
sh(19, 0, (t, u, lt) => { camPath([60, 640, 1.15], [60, 620, 1.25], u); dining(t, { crowdExpr: () => 'shock', crowdPose: () => 'shock' }); L(1, () => { table(-40, 1000, 520, t); const k = ease(seg(lt, 0.4, 1.2));
  benDrink(-160, 1000, 600, k * 0.6, 1, t, true, { expr: 'smug', look: 1 }); person(380, 1000, 580, WAIT, pose('no', t), { expr: 'scared', look: -1 }, t, true); });
  screen(() => { const k = back(seg(lt, 0.2, 0.5)); g.save(); g.translate(W / 2, 430); g.scale(k, k); txt('¿TÚ TE LA', 0, -60, 96, '#fff', 16); txt('HABRÍAS TOMADO?', 0, 50, 84, '#7fd0ff', 16); g.restore(); }); tag(seg(lt, 0.3, 0.6)); });
