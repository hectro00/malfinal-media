// Alejandro III de Escocia — Kinghorn, 19 mar 1286 (engine4). Death never shown.
import { K, W, H, OUT, clamp, lerp, ease, easeIn, easeOut, back, R, seg, ol, rr, circ, ell, line, poly, txt, L, screen, camTo, camPath, shakeAt, handheld,
  person, pose, mixPose, cloud, puff, speedLines, sky, wind } from './engine.js';
import { PH, st, en, dur, sh, fx } from './lib.js';
export { FRAMES, frame, post, blurN } from './lib.js';
const g = K.g;
// ---------- cast ----------
const KING = { skin: '#f2c9a0', hair: '#b5652e', hairStyle: 'side', beard: true, coat: '#2f4f9a', pants: '#3a2a22', shoes: '#2a1a12', seed: 1 };
const QUEEN = { skin: '#f5d2b3', hair: '#e0b25a', hairStyle: 'bun', dress: true, coat: '#b03a5a', pants: '#b03a5a', shoes: '#3a1a1a', seed: 2 };
const NOB = (i) => ({ skin: ['#f2c9a0', '#e0a97f', '#f5d2b3', '#e8b98f'][i % 4], hair: ['#5a3b22', '#999', '#2b1d14', '#7a5a3a'][i % 4], hairStyle: ['side', 'bald', 'curly', 'side'][i % 4], beard: i % 2 === 0, mustache: i % 2 === 1, coat: ['#6b2f3a', '#2f5a3a', '#5a4636', '#45405a'][i % 4], pants: '#2a2a30', shoes: '#1b1b1b', seed: 10 + i });
const BOAT = { skin: '#e0a97f', hair: '#444', hairStyle: 'bald', beard: true, hat: 'cap', hatColor: '#3a4a5a', coat: '#c9a24a', pants: '#3a3a44', shoes: '#222', seed: 7 };
const GUARD = (i) => ({ skin: ['#f2c9a0', '#e0a97f', '#c98e62'][i % 3], hair: '#3a2a1a', hairStyle: 'side', hat: 'cap', hatColor: '#555', coat: ['#7a2b2b', '#2b4a7a', '#4a5a2b'][i % 3], pants: '#3a2a22', shoes: '#222', mustache: i % 2 === 0, seed: 20 + i });
const crownAt = (x, y, w) => { g.save(); g.translate(x, y); poly([[-w / 2, 0], [w / 2, 0], [w / 2, -w * 0.55], [w * 0.25, -w * 0.25], [0, -w * 0.6], [-w * 0.25, -w * 0.25], [-w / 2, -w * 0.55]]); ol('#f2c23a', 5); circ(0, -w * 0.14, w * 0.08); ol('#d0302f', 3); g.restore(); };
function kingP(x, y, h, P, s, t, flip = false) { person(x, y, h, KING, P, s, t, flip); const sc = h / 300, hy = y - (P.jump || 0) * sc, top = -93 - (P.bob || 0) * 0.3 - 90 - 51 * 0.85 - 51 * 0.72;
  g.save(); g.translate(x, hy); g.rotate((flip ? -1 : 1) * (P.lean || 0)); crownAt(0, top * sc, 64 * sc); g.restore(); }
// horse facing right; origin = ground under body. returns saddle point
function horse(x, y, s, t, o = {}) { const v = o.v ?? 1, ph = t * 9 * v, col = o.col || '#5a3a26', dk = '#3e2818';
  g.save(); g.translate(x, y); g.scale(s, s); if (o.flip) g.scale(-1, 1); const bob = Math.abs(Math.sin(ph)) * 14 * v; g.translate(0, -bob); g.rotate(o.tilt || 0);
  const leg = (lx, k, c) => { const a = Math.sin(ph + k) * 0.55 * v + (o.rear ? -0.6 : 0) * (lx > 0 ? 1 : 0); g.save(); g.translate(lx, -150); g.rotate(a); rr(-13, -10, 26, 90, 10); ol(c, 6); g.translate(0, 78); g.rotate(Math.max(0, Math.sin(ph + k + 1)) * 0.9 * v); rr(-11, -6, 22, 84, 9); ol(c, 6); rr(-14, 70, 28, 16, 4); ol('#222', 5); g.restore(); };
  leg(-95, 0.0, dk); leg(85, 2.2, dk);
  line([[-140, -205], [-205 + Math.sin(t * 6) * 18, -110]], 22, OUT); line([[-140, -205], [-205 + Math.sin(t * 6) * 18, -110]], 14, '#2a1a10');
  ell(0, -190, 150, 66); ol(col, 7);
  g.save(); g.translate(115, -215); g.rotate(0.5 + Math.sin(ph) * 0.06 * v); for (let k = 0; k < 5; k++) { ell(-30 - Math.sin(t * 7 + k) * 5, -140 + k * 30, 16, 22); ol('#1e140c', 4); } rr(-32, -165, 66, 190, 28); ol(col, 7);
  poly([[-14, -150], [-4, -200], [10, -155]]); ol(col, 5); ell(45, -140, 78, 36, 0.55); ol(col, 7); circ(14, -150, 6); ol(OUT, 0); circ(98, -105, 5); ol(OUT, 0); g.restore();
  if (o.saddle !== false) { rr(-55, -262, 100, 30, 10); ol('#8a2b2b', 5); rr(-40, -240, 70, 70, 6); ol('#c9a24a', 4); }
  leg(-70, 3.1, col); leg(110, 1.2, col);
  g.restore(); return [x - 5 * s * (o.flip ? -1 : 1), y - (262 + bob) * s];
}
const rideP = (t) => pose('stand', t, { legL: -0.7, legR: -0.5, kneeL: 1.1, kneeR: 1.0, armL: 0.9, armR: -0.9, elbL: -1.0, elbR: 1.0, lean: -0.05 });
function rider(sad, h, t, s = {}, P) { const hp = 93 * h / 300; kingP(sad[0], sad[1] + hp, h, P || rideP(t), { expr: 'determined', look: 1, ...s }, t); }
// ---------- weather ----------
const NT = '#141a33', NB = '#2e3b60';
function rain(t, amt = 1, hail = false) { g.save(); g.strokeStyle = hail ? 'rgba(235,240,255,0.9)' : 'rgba(190,205,240,0.55)'; g.lineCap = 'round'; g.lineWidth = hail ? 9 : 4;
  for (let i = 0; i < 90 * amt; i++) { const x = ((R(i) * W * 1.5 - t * 500) % (W * 1.5) + W * 1.5) % (W * 1.5) - W * 0.2, y = ((R(i + 3) * H + t * (1800 + R(i + 5) * 700)) % (H + 200)) - 100; g.beginPath(); g.moveTo(x, y); g.lineTo(x - (hail ? 8 : 40), y + (hail ? 14 : 90)); g.stroke(); } g.restore(); }
function bolt(t, t0, x = 700) { const d = t - t0; if (d < 0 || d > 0.35) return; screen(() => { g.fillStyle = `rgba(230,235,255,${0.55 * (1 - d / 0.35)})`; g.fillRect(0, 0, W, H); g.globalAlpha = 1 - d / 0.35; const pts = [[x, -20]]; for (let k = 1; k < 8; k++) pts.push([x + (R(k + t0 * 10) - 0.5) * 160, k * 110]); line(pts, 18, OUT); line(pts, 9, '#fff6c0'); g.globalAlpha = 1; }); }
function storm(t, o = {}) { sky(o.top || NT, o.bot || NB); L(0.1, () => { for (let i = 0; i < 6; i++) cloud(((R(i) * 2600 + t * 120) % 2600) - 1300, -900 + R(i + 3) * 400, 1.4 + R(i + 5), '#3a4566'); }); }
function sea(t, y, o = {}) { const amp = o.amp ?? 40; for (let l = 0; l < 3; l++) { const yy = y + l * 120; g.beginPath(); g.moveTo(-4000, 4000); for (let x = -4000; x <= 4000; x += 60) g.lineTo(x, yy + Math.sin(x * 0.004 + t * (1.6 + l * 0.4) + l) * amp * (1 + l * 0.3) + Math.sin(x * 0.011 - t * 2.3) * amp * 0.35); g.lineTo(4000, 4000); g.closePath(); ol(['#1f3a5a', '#24476b', '#2b557c'][l], 6);
  g.strokeStyle = 'rgba(230,240,255,0.6)'; g.lineWidth = 6; for (let k = 0; k < 14; k++) { const x = -2000 + R(k + l * 20) * 4000; const wy = yy + Math.sin(x * 0.004 + t * (1.6 + l * 0.4) + l) * amp * (1 + l * 0.3) + Math.sin(x * 0.011 - t * 2.3) * amp * 0.35; g.beginPath(); g.arc(x, wy + 8, 26, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); } } }
const waveY = (x, y, t, amp = 40) => y + Math.sin(x * 0.004 + t * 1.6) * amp + Math.sin(x * 0.011 - t * 2.3) * amp * 0.35;
function castle(x, y, s, lit = 1) { g.save(); g.translate(x, y); g.scale(s, s); const c = '#6f7488';
  rr(-420, -420, 840, 420, 4); ol(c); for (let k = 0; k < 9; k++) { rr(-420 + k * 98, -460, 56, 46, 2); ol(c, 5); }
  for (const tx of [-460, 380]) { rr(tx, -640, 80, 640, 4); ol('#5f6478'); poly([[tx - 14, -640], [tx + 94, -640], [tx + 40, -760]]); ol('#3a3f55'); }
  rr(-70, -700, 140, 280, 4); ol('#5f6478'); poly([[-90, -700], [90, -700], [0, -830]]); ol('#3a3f55'); line([[0, -830], [0, -900]], 6); poly([[0, -900], [80, -880], [0, -860]]); ol('#c0392b', 4);
  for (let k = 0; k < 5; k++) { rr(-330 + k * 150, -330, 46, 80, 20); ol(lit ? '#ffcf6a' : '#3a3f55', 5); } rr(-60, -170, 120, 170, 60); ol('#3a2a22'); g.restore(); }
function rock(x, y, w, h) { g.beginPath(); g.moveTo(x - w, y); g.lineTo(x - w * 0.8, y - h * 0.7); g.lineTo(x - w * 0.2, y - h); g.lineTo(x + w * 0.6, y - h * 0.8); g.lineTo(x + w, y); g.closePath(); ol('#4a4f5a', 6); }
function boat(x, y, s, t, ang = 0, crew = true, king = true) { g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  if (crew) person(-110, -40, 300, BOAT, pose('crank', t), { expr: 'worried', look: 1 }, t); if (king) kingP(90, -40, 300, pose('stand', t, { armR: -0.5, armL: 0.5, elbL: -1, elbR: 1 }), { expr: 'smug', look: -0.4 }, t);
  g.beginPath(); g.moveTo(-300, -60); g.lineTo(300, -60); g.quadraticCurveTo(260, 60, 180, 70); g.lineTo(-180, 70); g.quadraticCurveTo(-270, 50, -300, -60); g.closePath(); ol('#7a4a2a', 7); line([[-280, -30], [280, -30]], 4, '#5a3418');
  g.restore(); }
function tag(a = 1) { screen(() => { g.globalAlpha = a; rr(40, 150, 470, 70, 16); ol('rgba(20,15,30,0.8)', 5); txt('MUERTES ABSURDAS #38', 275, 186, 34, '#ffd23f', 0); g.globalAlpha = 1; }); }
function bigText(s1, y, a, col = '#fff', size = 90) { if (a <= 0) return; screen(() => { g.globalAlpha = a; txt(s1, W / 2, y, size, col, 16); g.globalAlpha = 1; }); }
function popText(s1, y, lt, t0 = 0, col = '#fff', size = 90) { const k = back(seg(lt, t0, t0 + 0.25)); if (k <= 0) return; screen(() => { g.save(); g.translate(W / 2, y); g.scale(k, k); txt(s1, 0, 0, size, col, 16); g.restore(); }); }
// cliff path along the coast (world): ground line from x
const cliffY = (x) => 1000 + Math.sin(x * 0.002) * 40;
function coast(t, o = {}) { storm(t, o); L(0.4, () => sea(t, 1150, { amp: 30 })); L(1, () => { g.beginPath(); g.moveTo(-4000, 3000); for (let x = -4000; x <= 6000; x += 100) g.lineTo(x, cliffY(x)); g.lineTo(6000, 3000); g.closePath(); ol('#3d4436', 7);
  g.beginPath(); g.moveTo(-4000, cliffY(-4000) + 40); for (let x = -4000; x <= 6000; x += 100) g.lineTo(x, cliffY(x) + 40 + Math.sin(x * 0.03) * 10); g.strokeStyle = '#2c3228'; g.lineWidth = 10; g.stroke(); for (let i = 0; i < 12; i++) rock(-2000 + i * 600, cliffY(-2000 + i * 600) + 2, 50, 40); }); }
function hall(t) { g.fillStyle = '#4a3428'; g.fillRect(0, 0, W, H); L(0.6, () => { g.fillStyle = '#5e4434'; g.fillRect(-3000, -2000, 6000, 3000); for (let i = 0; i < 8; i++) { rr(-1500 + i * 420, -300, 60, 1300, 6); ol('#6e5444', 6); } for (let i = 0; i < 3; i++) { rr(-700 + i * 600, -80, 170, 300, 80); ol('#1a2038', 6); if (R(Math.floor(t * 3) + i) > 0.85) { rr(-700 + i * 600, -80, 170, 300, 80); ol('#e8ecff', 0); } } });
  L(1, () => { g.fillStyle = '#6a4a30'; g.fillRect(-3000, 1000, 6000, 2000); line([[-3000, 1000], [3000, 1000]], 6); }); }
function table(t, x, y, w) { rr(x - w / 2, y - 220, w, 40, 8); ol('#7a4a2a', 7); rr(x - w / 2 + 40, y - 180, 30, 180, 4); ol('#5a3418', 6); rr(x + w / 2 - 70, y - 180, 30, 180, 4); ol('#5a3418', 6);
  for (let k = 0; k < 4; k++) { const cx = x - w / 2 + 120 + k * (w - 240) / 3; rr(cx - 10, y - 300, 20, 80, 4); ol('#f4efe2', 4); const fl = Math.sin(t * 12 + k) * 5; g.beginPath(); g.moveTo(cx - 8, y - 300); g.quadraticCurveTo(cx + fl, y - 345, cx, y - 360); g.quadraticCurveTo(cx + 8 + fl, y - 330, cx + 8, y - 300); g.closePath(); ol('#ffcf3a', 3); }
  ell(x - 60, y - 232, 90, 18); ol('#d9d2c0', 5); ell(x - 60, y - 250, 60, 22); ol('#b5652e', 5); }
function torch(x, y, t, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha = a; line([[x, y], [x + 10, y - 120]], 10, '#5a3418'); const fl = Math.sin(t * 14) * 8; g.beginPath(); g.moveTo(x - 12, y - 118); g.quadraticCurveTo(x + 10 + fl, y - 190, x + 14, y - 210); g.quadraticCurveTo(x + 30 + fl, y - 160, x + 30, y - 118); g.closePath(); ol('#ffb03a', 4); circ(x + 10, y - 150, 120); g.fillStyle = 'rgba(255,190,90,0.12)'; g.fill(); g.restore(); }
// ---------- shots ----------
// P0 hook: storm, king gallops along the cliff, lightning
sh(0, 0, (t, u, lt) => { const x = lerp(-300, 900, u); camTo(x + 120, 700, 0.8); coast(t); L(1, () => { const sd = horse(x, cliffY(x), 1.6, t, { v: 1.2 }); rider(sd, 300, t, { expr: 'determined' }); });
  screen(() => rain(t, 1)); bolt(t, 0.05, 800); bolt(t, 2.2, 250); shakeAt(t, 0.05, 22); popText('NO SALGAS…', 460, lt, 0, '#fff', 100); if (u > 0.55) popText('…Y SALIÓ', 600, lt, dur(0) * 0.55, '#ffd23f', 110); tag(); }, 1);
// P1 Scotland 1286, castle on the rock, then the king
sh(1, 0, (t, u, lt) => { camPath([0, -200, 0.55], [0, 100, 0.65], u); storm(t, { top: '#4a5a80', bot: '#a7a0a8' }); L(0.5, () => { g.fillStyle = '#4a5a40'; g.beginPath(); g.moveTo(-3000, 900); g.quadraticCurveTo(0, 150, 3000, 900); g.lineTo(3000, 3000); g.lineTo(-3000, 3000); g.closePath(); ol('#4a5a40'); castle(0, 420, 0.9, 1); });
  bigText('ESCOCIA', 380, seg(lt, 0.1, 0.4), '#fff', 120); bigText('1286', 520, seg(lt, 0.3, 0.6), '#ffd23f', 100); });
sh(1, 0.55, (t, u, lt) => { camPath([0, 560, 1.1], [0, 520, 1.25], u); hall(t); L(1, () => { rr(-220, 380, 440, 620, 30); ol('#8a2b2b', 7); kingP(0, 1000, 600, pose('proud', t), { expr: 'smug', look: 0.2 }, t); });
  screen(() => { const a = seg(lt, 0.2, 0.5); g.globalAlpha = a; rr(150, 1450, 780, 120, 24); ol('#fbf7ea', 6); txt('ALEJANDRO III', W / 2, 1510, 70, '#7a2b2b', 0); g.globalAlpha = 1; }); });
// P2 young queen Yolanda waits across the sea (pan from king's side over the water to her window)
sh(2, 0, (t, u, lt) => { camPath([150, 620, 0.7], [850, 540, 0.9], u); storm(t, { top: '#38456a', bot: '#7d7f9a' }); L(1, () => { sea(t, 1000, { amp: 25 }); g.fillStyle = '#3d4436'; rr(500, 600, 1200, 1400, 0); ol('#3d4436'); rr(700, 160, 380, 440, 6); ol('#8a8ea0'); rr(760, 240, 260, 320, 120); ol('#ffcf6a', 6);
  person(890, 560, 300, QUEEN, pose('plead', t), { expr: 'smile', look: -1 }, t, true); });
  screen(() => { const k = back(seg(u, 0.55, 0.75)); if (k > 0) { g.save(); g.translate(W / 2 + 150, 380); g.scale(k, k); g.fillStyle = '#e0405a'; g.beginPath(); g.moveTo(0, 40); g.bezierCurveTo(-90, -20, -50, -90, 0, -50); g.bezierCurveTo(50, -90, 90, -20, 0, 40); g.fill(); g.strokeStyle = OUT; g.lineWidth = 6; g.stroke(); g.restore(); } bigText('YOLANDA', 1500, seg(u, 0.6, 0.8), '#ffd23f', 80); }); });
// P3 dinner in Edinburgh castle with counsellors
sh(3, 0, (t, u, lt) => { camPath([-250, 620, 0.85], [150, 640, 0.95], u); hall(t); L(1, () => { person(-560, 1000, 520, NOB(0), pose('stand', t), { talk: true, expr: 'talk', look: 1 }, t); person(540, 1000, 520, NOB(1), pose('point', t), { talk: true, expr: 'talk', look: -1 }, t, true); person(260, 1000, 520, NOB(2), pose('stand', t + 1), { expr: 'happy', look: -1 }, t, true);
  kingP(-180, 1000, 560, pose('write', t, { armR: -1.2 + Math.sin(t * 6) * 0.3, elbR: 1.8 }), { expr: 'happy', talk: Math.sin(t * 2) > 0, look: 1 }, t); table(t, 0, 1080, 1300); });
  bigText('EDIMBURGO', 380, seg(lt, 0.2, 0.5) * (1 - seg(lt, dur(3) - 0.3, dur(3))), '#fff', 100); });
// P4 outside: wind, hail, total darkness (castle exterior, lightning)
sh(4, 0, (t, u, lt) => { camPath([0, 300, 0.7], [0, 260, 0.85], u); storm(t); L(0.6, () => { g.fillStyle = '#2c3228'; g.beginPath(); g.moveTo(-3000, 1000); g.quadraticCurveTo(0, 650, 3000, 1000); g.lineTo(3000, 3000); g.lineTo(-3000, 3000); g.closePath(); ol('#2c3228'); castle(0, 820, 0.95, 1); });
  L(1, () => { for (let i = 0; i < 5; i++) { g.save(); g.translate(-500 + i * 260, 1350); g.rotate(Math.sin(t * 3 + i) * 0.25 - 0.2); line([[0, 0], [0, -300]], 14, '#2a2018'); g.restore(); } });
  screen(() => { wind(t, 14, 1.2); rain(t, 1.4, true); }); bolt(t, st(4) + dur(4) * 0.45, 300); shakeAt(t, st(4) + dur(4) * 0.45, 20);
  bigText('GRANIZO', 1500, seg(u, 0.25, 0.4), '#bfe3ff', 90); });
// P5 nobles beg him to stay
sh(5, 0, (t, u, lt) => { camPath([0, 600, 0.8], [150, 620, 1.0], u); hall(t); L(1, () => { kingP(420, 1000, 580, pose('no', t), { expr: 'determined', look: -1 }, t, true); for (let i = 0; i < 3; i++) person(-520 + i * 260, 1000 + i * 10, 500, NOB(i), pose('plead', t + i * 0.3), { expr: 'worried', look: 1, talk: i === 1 }, t + i); });
  popText('¡QUÉDESE, MAJESTAD!', 420, lt, 0.3, '#fff', 76); });
// P6a he won't wait — stands up, waves no
sh(6, 0, (t, u, lt) => { camPath([200, 560, 1.2], [200, 520, 1.4], u); hall(t); L(1, () => kingP(200, 1000, 620, mixPose(pose('stand', t), pose('point', t, { armR: -2.0 }), seg(lt, 0.2, 0.6)), { expr: 'angry', talk: true, look: -0.5 }, t, true)); popText('¡MI CABALLO!', 420, lt, dur(6) * 0.25, '#ffd23f', 100); });
// P6b the horse is brought out into the storm (stable door, horse walks in)
sh(6, 0.55, (t, u, lt) => { camPath([0, 650, 0.85], [100, 650, 0.9], u); storm(t); L(1, () => { g.fillStyle = '#3d4436'; g.fillRect(-3000, 1000, 6000, 2000); line([[-3000, 1000], [3000, 1000]], 6); castle(-200, 1000, 1.1, 1);
  const hx = lerp(-420, 60, ease(u)); horse(hx, 1000, 1.4, t, { v: 0.5, saddle: true }); person(hx + 300, 1000, 460, GUARD(0), pose('walk', t), { expr: 'scared', look: -1 }, t); kingP(470, 1000, 500, pose('proud', t), { expr: 'smug', look: -1 }, t, true); });
  screen(() => rain(t, 1)); });
// P7 re-hook "but that wasn't the worst" — gallop in the dark, speed lines
sh(7, 0, (t, u, lt) => { const x = lerp(0, 1100, u); camTo(x + 100, 640, 0.95); coast(t); L(1, () => { const sd = horse(x, cliffY(x), 1.5, t, { v: 1.3 }); rider(sd, 290, t); }); screen(() => { speedLines(t, 'h', 0.5); rain(t, 1); g.fillStyle = 'rgba(30,0,10,0.3)'; g.fillRect(0, 0, W, H); }); popText('PERO ESO NO FUE LO PEOR', 420, lt, 0.1, '#fff', 72); }, 1);
// dock set
function dock(t, o = {}) { storm(t); L(0.5, () => sea(t, 1080, { amp: 45 })); L(1, () => { rr(-1600, 960, 1700, 60, 6); ol('#6b4a2a'); for (let i = 0; i < 6; i++) { rr(-1500 + i * 300, 1000, 40, 500, 4); ol('#4a3018'); } boat(380, waveY(380, 1090, t, 40), 0.9, t, Math.sin(t * 2) * 0.12, false, false); }); }
// P8 dock: boatman with lantern says crossing is madness
sh(8, 0, (t, u, lt) => { camPath([-330, 620, 0.85], [-280, 600, 0.95], u); dock(t); L(1, () => { person(-150, 960, 560, BOAT, pose('no', t), { expr: 'scared', talk: true, look: -1, hold: (hR) => torch(hR[0], hR[1] + 60, t) }, t); kingP(-620, 960, 580, pose('stand', t), { expr: 'determined', look: 1 }, t); });
  screen(() => rain(t, 0.8)); popText('¡ES UNA LOCURA!', 420, lt, dur(8) * 0.4, '#fff', 90); bolt(t, st(8) + dur(8) * 0.4, 800); });
// P9 king asks: afraid to die with me?
sh(9, 0, (t, u, lt) => { camPath([-390, 580, 1.1], [-390, 560, 1.2], u); dock(t); L(1, () => { person(-150, 960, 560, BOAT, pose('cover', t), { expr: 'scared', sweat: true, look: -1 }, t); kingP(-620, 960, 580, pose('point', t), { expr: 'smug', talk: true, look: 1 }, t); });
  popText('¿MIEDO DE MORIR?', 400, lt, 0.4, '#ffd23f', 90); });
// P10 boatman: I'll gladly die with your father's son (proud, chest out)
sh(10, 0, (t, u, lt) => { camPath([-150, 560, 1.4], [-150, 520, 1.6], u); dock(t); L(1, () => person(-150, 960, 600, BOAT, mixPose(pose('cover', t), pose('proud', t), seg(lt, 0.3, 0.9)), { expr: lt > 0.6 ? 'determined' : 'worried', talk: true, look: -1 }, t)); screen(() => rain(t, 0.6));
  popText('MORIRÉ CON GUSTO', 400, lt, dur(10) * 0.45, '#fff', 84); });
// P11 crossing in the storm: big waves, boat pitching, lightning
sh(11, 0, (t, u, lt) => { const bx = lerp(-400, 400, u); camTo(bx, 700 + Math.sin(t * 2) * 30, 0.75, Math.sin(t * 1.5) * 0.03); storm(t); L(0.5, () => sea(t, 900, { amp: 70 })); L(1, () => boat(bx, waveY(bx, 1050, t, 70) - 10, 1.2, t, Math.sin(t * 2.4) * 0.22)); L(1.2, () => sea(t + 1, 1300, { amp: 60 }));
  screen(() => rain(t, 1.2)); bolt(t, st(11) + 0.3, 650); shakeAt(t, st(11) + 0.3, 25); handheld(t, 10); }, 1);
// P12 they reach the other shore alive (boat hits the sand, king jumps out proud)
sh(12, 0, (t, u, lt) => { camPath([-200, 650, 0.85], [100, 620, 0.95], u); storm(t); L(0.5, () => sea(t, 1050, { amp: 20 })); L(1, () => { g.fillStyle = '#b8a27a'; g.beginPath(); g.moveTo(-300, 3000); g.lineTo(-300, 1080); g.quadraticCurveTo(600, 980, 3000, 1000); g.lineTo(3000, 3000); g.closePath(); ol('#b8a27a');
  boat(-650, 1090, 0.9, t, -0.05, true, false); const k = ease(seg(u, 0.1, 0.5)); const kx = lerp(-500, 250, k), ky = 1060 - Math.sin(k * Math.PI) * 120; kingP(kx, ky, 540, k < 1 ? pose('leap', t) : pose('proud', t), { expr: 'grin', look: 1 }, t); });
  popText('¡VIVOS!', 420, lt, dur(12) * 0.5, '#ffd23f', 110); });
// P13 "and here everything went wrong": dark push-in on rider's face
sh(13, 0, (t, u, lt) => { camPath([150, 450, 1.3], [210, 330, 2.0], u, easeIn); coast(t); L(1, () => { const sd = horse(0, cliffY(0), 1.5, t, { v: 0.3 }); rider(sd, 290, t, { expr: 'worried', sweat: true }); }); screen(() => { rain(t, 1); g.fillStyle = `rgba(30,0,10,${0.45 * u})`; g.fillRect(0, 0, W, H); }); bolt(t, st(13) + 0.2, 300); });
// P14 a few km left... guides' torches fall behind and vanish
sh(14, 0, (t, u, lt) => { const x = lerp(0, 1300, u); camTo(x + 150, 640, 0.75); coast(t); L(1, () => { for (let i = 0; i < 2; i++) { const gx = x - 520 - i * 260 - easeIn(seg(u, 0.35, 1)) * 1400; const sd = horse(gx, cliffY(gx), 1.2, t + i, { v: 1, col: '#6a5a4a' }); person(sd[0], sd[1] + 93 * 240 / 300, 240, GUARD(i), rideP(t), { expr: 'worried', look: 1, hold: (hR) => torch(hR[0], hR[1], t, 1 - seg(u, 0.5, 0.85)) }, t); }
  const sd = horse(x, cliffY(x), 1.5, t, { v: 1.1 }); rider(sd, 290, t); }); screen(() => { rain(t, 1); g.fillStyle = `rgba(5,5,20,${0.35 * seg(u, 0.5, 1)})`; g.fillRect(0, 0, W, H); }); bigText('SOLO', 1500, seg(u, 0.7, 0.85), '#ffd23f', 110); }, 1);
// P15 horse alone along the very edge of the coast (side view, sea far below)
sh(15, 0, (t, u, lt) => { const x = lerp(-200, 500, u); camTo(x - 100, 900, 0.62); storm(t); L(0.35, () => sea(t, 1900, { amp: 50 })); L(1, () => { g.beginPath(); g.moveTo(-3000, 3000); g.lineTo(-3000, 1000); g.lineTo(600 + Math.sin(t) * 0, 1000); g.lineTo(560, 1250); g.lineTo(620, 1500); g.lineTo(540, 3000); g.closePath(); ol('#3d4436', 7); for (let i = 0; i < 5; i++) rock(-2400 + i * 520, 1002, 40, 30);
  const sd = horse(x, 1000, 1.4, t, { v: 0.7 }); rider(sd, 270, t, { expr: 'scared', look: 1 }); }); screen(() => rain(t, 1.1)); bolt(t, st(15) + dur(15) * 0.6, 850); popText('EL BORDE', 420, lt, 0.4, '#fff', 90); });
// P16a dawn: guards find the crown on the beach, horse alone (no body)
sh(16, 0, (t, u, lt) => { camPath([0, 560, 0.8], [0, 600, 0.95], u); sky('#e8a87a', '#f6dcb0'); L(0.1, () => { circ(-300, 300, 140); ol('#ffe9a8', 0); }); L(0.4, () => sea(t * 0.3, 900, { amp: 10 })); L(1, () => { g.fillStyle = '#d8c39a'; g.fillRect(-3000, 1000, 6000, 2000); line([[-3000, 1000], [3000, 1000]], 6); rr(700, 300, 900, 800, 0); ol('#5a5f4a');
  horse(330, 1010, 1.0, t, { v: 0, saddle: true, flip: true }); g.save(); g.translate(-30, 1040); g.rotate(0.4); crownAt(0, 0, 110); g.restore(); for (let i = 0; i < 2; i++) person(-430 + i * 200, 1030, 460, GUARD(i), pose('cover', t + i), { expr: 'closed' }, t + i); });
  bigText('AL AMANECER', 380, seg(lt, 0.1, 0.4), '#fff', 96); });
// P16b flashback: hoof slips on wet rock, stones fall (sepia)
sh(16, 0.55, (t, u, lt) => { fx({ sepia: 0.6 }); camPath([0, 820, 1.5], [0, 860, 1.7], u); storm(t); L(1, () => { g.fillStyle = '#3d4436'; g.fillRect(-3000, 1000, 6000, 2000); rock(60, 1000, 120, 60);
  g.save(); g.translate(0, 1000); g.rotate(-0.4 * ease(seg(lt, 0.1, 0.4))); rr(-22, -220, 44, 200, 12); ol('#3e2818', 6); rr(-28, -30, 56, 30, 6); ol('#222', 5); g.restore(); for (let i = 0; i < 6; i++) { const k = seg(lt, 0.25 + i * 0.05, 1.2); circ(80 + i * 30 + k * 60, 1000 + easeIn(k) * 600, 14 + R(i) * 10); ol('#6a6a6a', 4); } });
  shakeAt(t, t - lt + 0.25, 30); bigText('TROPEZÓ', 1450, seg(lt, 0.2, 0.4), '#ffd23f', 110); }, 1);
// P17a empty throne, crown on it
sh(17, 0, (t, u, lt) => { camPath([0, 600, 0.9], [0, 560, 1.15], u); hall(t); L(1, () => { rr(-220, 380, 440, 620, 30); ol('#8a2b2b', 7); rr(-180, 760, 360, 60, 10); ol('#c9a24a', 6); crownAt(0, 760, 90); }); popText('SIN REY', 400, lt, 0.2, '#fff', 110); });
// P17b ...and decades of war (banners clash on the hill)
sh(17, 0.5, (t, u, lt) => { camPath([-200, 620, 0.75], [200, 620, 0.8], u); storm(t, { top: '#6a3a3a', bot: '#c08a6a' }); L(1, () => { g.fillStyle = '#4a5a40'; g.fillRect(-3000, 1000, 6000, 2000); line([[-3000, 1000], [3000, 1000]], 6);
  for (let i = 0; i < 4; i++) { const dx = ease(seg(u, 0, 0.6)) * 250; person(-950 + i * 180 + dx, 1000 + (i % 2) * 20, 420, GUARD(i), pose('run', t + i * 0.3), { expr: 'angry', look: 1 }, t + i); person(950 - i * 180 - dx, 1000 + (i % 2) * 20, 420, NOB(i), pose('run', t + i * 0.4), { expr: 'angry', look: 1 }, t + i, true); }
  for (const [bx, c, f] of [[-700, '#2b4a9a', 1], [700, '#9a2b2b', -1]]) { line([[bx, 1000], [bx, 400]], 10, '#5a3418'); poly([[bx, 400], [bx + f * 220, 440 + Math.sin(t * 6) * 12], [bx, 500]]); ol(c, 6); } puff(0, 990, 1.6, (lt * 0.8) % 1, '#e9d7b0'); });
  bigText('GUERRA', 400, seg(lt, 0.2, 0.5), '#ff6a4a', 120); shakeAt(t, t - lt + 0.3, 18); });
// P18 all for not wanting to sleep away from his wife (queen waits at the window, candle)
sh(18, 0, (t, u, lt) => { camPath([0, 620, 1.0], [0, 600, 1.25], u); g.fillStyle = '#3a2a3a'; g.fillRect(0, 0, W, H); L(1, () => { rr(-380, 0, 760, 760, 300); ol('#1a2038', 8); for (let k = 0; k < 3; k++) line([[-380, 250 + k * 170], [380, 250 + k * 170]], 4, '#4a5070'); g.save(); rr(-380, 0, 760, 760, 300); g.clip(); g.translate(-540, -300); rain(t, 0.6); g.restore();
  person(-80, 1150, 640, QUEEN, pose('stand', t), { expr: 'sad', look: 0.5 }, t); rr(330, 900, 40, 140, 6); ol('#f4efe2', 5); const fl = Math.sin(t * 12) * 5; g.beginPath(); g.moveTo(338, 900); g.quadraticCurveTo(350 + fl, 850, 350, 830); g.quadraticCurveTo(358 + fl, 870, 362, 900); g.closePath(); ol('#ffcf3a', 3); }); });
// P19 would you have waited out the storm? (back to the cliff ride, loop to frame 0)
sh(19, 0, (t, u, lt) => { const x = lerp(-300, 400, u); camTo(x + 120, 700, 0.8); coast(t); L(1, () => { const sd = horse(x, cliffY(x), 1.6, t, { v: 1.1 }); rider(sd, 300, t); }); screen(() => rain(t, 1)); bolt(t, st(19) + 0.6, 800);
  screen(() => { const k = back(seg(lt, 0.2, 0.5)); g.save(); g.translate(W / 2, 430); g.scale(k, k); txt('¿TÚ HABRÍAS', 0, -60, 90, '#fff', 16); txt('ESPERADO?', 0, 50, 100, '#ffd23f', 16); g.restore(); }); tag(seg(lt, 0.3, 0.6)); });
