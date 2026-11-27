// Ödön von Horváth — París, 1 junio 1938: una adivina en Ámsterdam le dijo que en París viviría su mayor aventura; una rama de castaño cayó sobre él en una tormenta frente al Théâtre Marigny (engine4). Death never shown.
import { K, W, H, OUT, clamp, lerp, ease, easeIn, easeOut, back, R, seg, ol, rr, circ, ell, line, poly, txt, L, screen, camTo, camPath, shakeAt, handheld,
  person, pose, mixPose, cloud, bird, lamp, building, puff, speedLines, sky, wind, filmCam } from './engine.js';
import { PH, st, en, dur, sh, fx, CROWD, SKYT, SKYB, clouds, birds, skyline, ground, smoke, crowdRow } from './lib.js';
export { FRAMES, frame, post, blurN } from './lib.js';
const g = K.g;
// ---------- cast (own designs) ----------
const ODON = { skin: '#f0c8a4', hair: '#2b1d14', hairStyle: 'side', hat: 'bowler', hatColor: '#2a2a32', coat: '#3a3f52', pants: '#23232b', shoes: '#151515', tie: true, seed: 1 };
const ODONH = Object.assign({}, ODON, { hat: null });
const ADIV = { skin: '#c98e62', hair: '#141414', hairStyle: 'bun', dress: true, coat: '#6a2a5a', jacket: '#6a2a5a', shirt: '#e8c25a', pants: '#4a1a3a', shoes: '#2a1a22', seed: 2 };
const DIR = { skin: '#e8b98f', hair: '#5a3b22', hairStyle: 'side', hat: 'cap', glasses: true, mustache: true, jacket: '#5a4636', shirt: '#eee', pants: '#2a2a30', shoes: '#1b1b1b', seed: 3 };
const STORM_T = '#1d2230', STORM_B = '#4a5468';
// ---------- helpers ----------
function tag(a = 1) { screen(() => { g.globalAlpha = a; rr(40, 150, 470, 70, 16); ol('rgba(20,15,30,0.8)', 5); txt('MUERTES ABSURDAS #42', 275, 186, 34, '#ffd23f', 0); g.globalAlpha = 1; }); }
function popText(s1, y, lt, t0 = 0, col = '#fff', size = 90) { const k = back(seg(lt, t0, t0 + 0.25)); if (k <= 0) return; screen(() => { g.save(); g.translate(W / 2, y); g.scale(k, k); txt(s1, 0, 0, size, col, 16); g.restore(); }); }
function card(s1, s2, a, y = 330) { if (a <= 0) return; screen(() => { g.globalAlpha = a; rr(150, y - 80, 780, 160, 24); ol('#fbf7ea', 6); txt(s1, W / 2, y - 22, 62, '#3a2a40', 0); if (s2) txt(s2, W / 2, y + 42, 38, '#8a5a3a', 0, 'center', '700'); g.globalAlpha = 1; }); }
function rain(t, amt = 1) { screen(() => { g.save(); g.strokeStyle = 'rgba(200,215,235,0.55)'; g.lineCap = 'round'; for (let i = 0; i < 90 * amt; i++) { const x = ((R(i) * W * 1.3 + t * 300) % (W * 1.3)) - W * 0.15, y = ((R(i + 3) * H + t * (1900 + R(i + 1) * 700)) % (H + 200)) - 100; g.lineWidth = 3 + R(i + 5) * 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 26, y + 70); g.stroke(); } g.restore(); }); }
function flash(t, times) { let a = 0; for (const t0 of times) { const d = t - t0; if (d >= 0 && d < 0.5) a = Math.max(a, (d < 0.06 ? 1 : Math.exp(-(d - 0.06) * 9)) * (0.75 + 0.25 * Math.sin(d * 90))); } if (a > 0) screen(() => { g.fillStyle = `rgba(235,240,255,${0.7 * a})`; g.fillRect(0, 0, W, H); }); return a; }
function bolt(x, y0, y1, seed, a) { if (a <= 0.05) return; g.save(); g.globalAlpha = a; const pts = [[x, y0]]; let cx = x; for (let i = 1; i <= 8; i++) { cx += (R(seed + i) - 0.5) * 140; pts.push([cx, lerp(y0, y1, i / 8)]); } line(pts, 22, 'rgba(180,200,255,0.5)'); line(pts, 9, '#fff'); g.restore(); }
function darkTint(a) { screen(() => { g.fillStyle = `rgba(15,20,40,${a})`; g.fillRect(0, 0, W, H); }); }
// chestnut tree: origin = trunk base. o.w wind 0..1, o.fall 0..1 (big right branch breaks and drops), o.crack 0..1
function chestnut(x, y, s, t, o = {}) {
  const w = o.w || 0, sway = Math.sin(t * 2.2) * 0.02 + Math.sin(t * 5.3) * 0.03 * w;
  g.save(); g.translate(x, y); g.scale(s, s);
  poly([[-55, 0], [55, 0], [38, -520], [-38, -520]]); ol('#5b4230', 7); line([[-10, -60], [-18, -300]], 4, '#4a3527'); line([[18, -150], [12, -380]], 4, '#4a3527');
  g.save(); g.translate(0, -520); g.rotate(sway);
  line([[0, 0], [-260, -200]], 34, OUT); line([[0, 0], [-260, -200]], 24, '#5b4230'); line([[0, 0], [20, -330]], 34, OUT); line([[0, 0], [20, -330]], 24, '#5b4230');
  const blob = (bx, by, r, col) => { circ(bx, by, r); ol(col, 6); };
  for (let i = 0; i < 9; i++) blob(-300 + i * 70 + Math.sin(t * 3 + i) * 8 * w, -260 - Math.sin(i * 1.3) * 120, 120 + R(i) * 40, i % 2 ? '#3f7a3a' : '#4e8c44');
  for (let i = 0; i < 5; i++) blob(-200 + i * 90 + Math.sin(t * 3.5 + i) * 10 * w, -420 - R(i + 4) * 60, 100, '#5a9a4c');
  g.restore();
  // big branch (pivot at trunk, right side, at -470)
  const f = o.fall || 0; g.save(); g.translate(30, -470);
  if (f > 0) { g.translate(lerp(0, 160, f), easeIn(f) * 520); g.rotate(easeIn(f) * 1.1); } else g.rotate(sway * 1.6 + Math.sin(t * 7) * 0.04 * w);
  line([[0, 0], [380, -60]], 40, OUT); line([[0, 0], [380, -60]], 28, '#5b4230');
  for (let i = 0; i < 4; i++) { circ(200 + i * 70, -110 + Math.sin(i * 2) * 40, 95); ol(i % 2 ? '#3f7a3a' : '#4e8c44', 6); }
  if (o.crack > 0 && f < 0.05) { g.globalAlpha = o.crack; line([[6, -20], [22, 4], [10, 22]], 7, '#fff'); line([[-6, 10], [-24, 30]], 6, '#fff'); g.globalAlpha = 1; }
  g.restore(); g.restore();
}
function arch(x, y, s, col) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.fillRect(-160, -300, 320, 300); g.fillRect(-180, -340, 360, 50); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.moveTo(-60, 0); g.lineTo(-60, -150); g.arc(0, -150, 60, Math.PI, 0); g.lineTo(60, 0); g.closePath(); g.fill(); g.restore(); }
// Paris avenue with chestnut rows. o.storm 0..1
function avenue(t, o = {}) {
  const k = o.storm || 0; const top = mix(SKYT, STORM_T, k), bot = mix(SKYB, STORM_B, k);
  sky(top, bot); L(0.1, () => { clouds(t * (1 + k * 4), -900, 6); if (k > 0) { g.globalAlpha = k; clouds(t * 5, -700, 7, 1.6); for (let i = 0; i < 6; i++) cloud(-1400 + ((i * 520 + t * 160) % 2800), -650 + R(i) * 300, 2.2, '#5a6070'); g.globalAlpha = 1; } });
  L(0.3, () => { skyline(620, 1, mix('#c3cdd7', '#3a4050', k), 2); arch(0, 620, 1.1, mix('#d8ccb4', '#4a4a58', k)); });
  L(0.6, () => { for (let i = 0; i < 9; i++) { const x = -1500 + i * 380; g.save(); g.globalAlpha = 1 - 0.3 * k; chestnut(x, 860, 0.55, t + i, { w: k }); g.restore(); } });
  L(1, () => { g.fillStyle = mix('#a8a49a', '#4c505c', k); g.fillRect(-3000, 900, 6000, 1600); line([[-3000, 900], [3000, 900]], 7); for (let i = 0; i < 28; i++) { ell(-2800 + i * 210, 1000 + (i % 3) * 120, 70, 14); ol(mix('#b8b4aa', '#5c6270', k), 3); }
    if (k > 0.3) for (let i = 0; i < 12; i++) { ell(-1400 + i * 260, 1060 + (i % 2) * 110, 90, 12); ol(`rgba(170,190,220,${0.35 * k})`, 0); }
    for (let i = 0; i < 5; i++) lamp(-1300 + i * 650, 910, 1.2, k > 0.5 ? 1 : 0); });
}
function mix(a, b, k) { const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }
function theatre(t, o = {}) { sky(STORM_T, STORM_B); L(0.1, () => { for (let i = 0; i < 7; i++) cloud(-1400 + ((i * 480 + t * 200) % 2800), -800 + R(i) * 300, 2.2, '#4a5060'); });
  L(0.5, () => { rr(-900, -100, 1500, 1000, 4); ol('#8a8270', 7); poly([[-950, -100], [650, -100], [-150, -360]]); ol('#7a7262', 7); for (let i = 0; i < 6; i++) { rr(-820 + i * 250, 60, 70, 840, 8); ol('#b8ae98', 6); } rr(-620, 0, 860, 90, 8); ol('#2a2a40', 6); txt('THÉÂTRE MARIGNY', -190, 45, 60, '#ffd98a', 0);
    for (let i = 0; i < 3; i++) { rr(-700 + i * 250, 560, 160, 340, 70); ol('#ffd98a', 6); } });
  L(1, () => { g.fillStyle = '#464a56'; g.fillRect(-3000, 900, 6000, 1600); line([[-3000, 900], [3000, 900]], 7); for (let i = 0; i < 10; i++) { ell(-1400 + i * 300, 1050 + (i % 2) * 120, 100, 12); ol('rgba(170,190,220,0.3)', 0); } lamp(-560, 910, 1.2, 1); });
}
function tent(t, o = {}) { g.fillStyle = '#2a1636'; g.fillRect(0, 0, W, H);
  L(0.6, () => { for (let i = -5; i <= 5; i++) { g.beginPath(); g.moveTo(i * 300 - 150, -1400); g.quadraticCurveTo(i * 300 + Math.sin(t + i) * 20, 0, i * 300 - 150, 1400); g.lineTo(i * 300 + 150, 1400); g.quadraticCurveTo(i * 300 + Math.sin(t + i) * 20, 0, i * 300 + 150, -1400); g.closePath(); ol(i % 2 ? '#4a2a5a' : '#5a3268', 5); }
    for (let i = 0; i < 12; i++) { g.globalAlpha = 0.5 + 0.5 * Math.sin(t * 2 + i); txt('✦', -1200 + R(i) * 2400, -500 + R(i + 1) * 900, 40, '#ffd98a', 0); } g.globalAlpha = 1; });
  if (o.cast !== false) L(1, () => person(0, 650, 560, ADIV, o.pose || pose('stand', t, { armL: 0.9, armR: -0.9, elbL: -1.2, elbR: 1.2 }), o.face || { expr: 'smug' }, t));
  L(1, () => { rr(-700, 700, 1400, 600, 20); ol('#7a2a3a', 7); for (let i = 0; i < 14; i++) { poly([[-700 + i * 100, 1300], [-650 + i * 100, 1380], [-600 + i * 100, 1300]]); ol('#e8c25a', 4); }
    const gl = g.createRadialGradient(0, 600, 0, 0, 600, 300); gl.addColorStop(0, `rgba(140,200,255,${0.5 + 0.2 * Math.sin(t * 3)})`); gl.addColorStop(1, 'rgba(140,200,255,0)'); g.fillStyle = gl; g.fillRect(-400, 300, 800, 600);
    circ(0, 600, 110); ol('#a8d8f0', 7); ell(-35, 560, 30, 45, -0.5); ol('rgba(255,255,255,0.6)', 0); rr(-80, 690, 160, 30, 8); ol('#c9a24a', 5);
    for (const cx of [-520, 520]) { rr(cx - 18, 560, 36, 130, 6); ol('#f4ecd2', 4); if (!(o.out && cx > 0 && o.out > 0)) { const fl = 1 + Math.sin(t * 13 + cx) * 0.12; ell(cx, 535, 14 * fl, 30 * fl); ol('#ffcf3a', 3); } } });
}
function tcard(x, y, s, flip, face) { g.save(); g.translate(x, y); g.scale(s * Math.max(0.05, Math.abs(Math.cos(flip * Math.PI))), s); rr(-80, -120, 160, 240, 14); if (flip < 0.5) { ol('#3a2a6a', 6); txt('✦', 0, 0, 70, '#ffd98a', 0); } else { ol('#fbf7ea', 6); face(); } g.restore(); }
function towerFace() { line([[-40, 80], [0, -80], [40, 80]], 7); line([[-24, 20], [24, 20]], 6); line([[0, -80], [0, -100]], 5); txt('PARÍS', 0, 98, 30, '#c0392b', 0); }
function study(t) { g.fillStyle = '#5a4636'; g.fillRect(0, 0, W, H);
  L(0.7, () => { for (let r = 0; r < 4; r++) { rr(-1200, -500 + r * 260, 1000, 24, 4); ol('#3a2a1e', 5); for (let i = 0; i < 14; i++) { rr(-1180 + i * 70, -700 + r * 260, 54, 196 - R(i + r) * 40, 4); ol(['#8a2a2a', '#2a4a6a', '#3a6a3a', '#c9a24a'][(i + r) % 4], 4); } }
    rr(300, -500, 520, 640, 10); ol('#9cc0dc', 8); line([[560, -500], [560, 140]], 7); line([[300, -180], [820, -180]], 7); });
  L(1, () => { rr(-700, 760, 1400, 60, 8); ol('#6b4a2e', 7); rr(-650, 820, 40, 400, 6); ol('#6b4a2e', 6); rr(610, 820, 40, 400, 6); ol('#6b4a2e', 6); });
}
function books(x, y, s, stamp) { g.save(); g.translate(x, y); g.scale(s, s); for (let i = 0; i < 4; i++) { rr(-120 + i * 8, -60 - i * 46, 240, 44, 6); ol(['#8a2a2a', '#2a4a6a', '#3a6a3a', '#c9a24a'][i], 5); } txt('ÖDÖN V. H.', 0, -175, 26, '#fff', 0);
  if (stamp > 0) { const k = back(stamp); g.save(); g.translate(0, -110); g.rotate(-0.2); g.scale(k * 1.4, k * 1.4); rr(-150, -42, 300, 84, 10); ol('rgba(255,255,255,0)', 0); g.strokeStyle = '#c0392b'; g.lineWidth = 10; g.stroke(); txt('PROHIBIDO', 0, 2, 52, '#c0392b', 0); g.restore(); } g.restore(); }
function suitcase(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); rr(-70, -100, 140, 100, 12); ol('#8a5a34', 6); rr(-24, -126, 48, 30, 10); ol(null, 6); line([[-70, -50], [70, -50]], 4); g.restore(); }
function amsterdam(t) { sky(SKYT, SKYB); L(0.1, () => clouds(t, -900, 5));
  L(0.6, () => { const cols = ['#a8553a', '#6a3a2a', '#c98e62', '#7a4a3a', '#b86a4a', '#5a3a2a']; for (let i = 0; i < 9; i++) { const x = -1600 + i * 360, h = 900 + R(i) * 300; rr(x, 900 - h, 330, h, 2); ol(cols[i % 6], 6); poly([[x, 900 - h], [x + 165, 900 - h - 160], [x + 330, 900 - h]]); ol(cols[(i + 2) % 6], 6); for (let f = 0; f < 4; f++) for (let j = 0; j < 3; j++) { rr(x + 40 + j * 95, 900 - h + 60 + f * (h / 4.4), 55, 90, 4); ol('#e8eef2', 4); } } });
  L(1, () => { g.fillStyle = '#9a8a7a'; g.fillRect(-3000, 900, 6000, 160); line([[-3000, 900], [3000, 900]], 7); g.fillStyle = '#4a7a9a'; g.fillRect(-3000, 1060, 6000, 1500); line([[-3000, 1060], [3000, 1060]], 7);
    for (let i = 0; i < 14; i++) { const x = ((-2000 + i * 300 + t * 40) % 4000) - 2000; line([[x, 1150 + (i % 3) * 90], [x + 120, 1150 + (i % 3) * 90]], 5, 'rgba(255,255,255,0.4)'); } });
}
function trainScene(t, u) { sky(SKYT, SKYB); L(0.1, () => clouds(t * 3, -900, 6)); const sp = t * 900;
  L(0.3, () => { g.fillStyle = '#9fb27e'; g.beginPath(); g.moveTo(-3000, 700); for (let x = -3000; x <= 3000; x += 200) g.lineTo(x, 600 + Math.sin((x + sp * 0.3) * 0.004) * 120); g.lineTo(3000, 3000); g.lineTo(-3000, 3000); g.closePath(); ol('#9fb27e', 6); });
  L(0.7, () => { for (let i = 0; i < 12; i++) { const x = ((i * 420 - sp * 0.7) % 5000 + 5000) % 5000 - 2500; g.save(); circ(x, 760, 90); ol('#4e8c44', 6); rr(x - 14, 760, 28, 140, 4); ol('#5b4230', 5); g.restore(); } });
  L(1, () => { g.fillStyle = '#8a7a6a'; g.fillRect(-3000, 1000, 6000, 1500); for (let i = 0; i < 40; i++) { const x = ((i * 150 - sp) % 6000 + 6000) % 6000 - 3000; rr(x, 1010, 30, 60, 4); ol('#5b4230', 3); } line([[-3000, 1030], [3000, 1030]], 8, '#555');
    // car (static in frame, scenery moves)
    rr(-520, 520, 1040, 440, 30); ol('#2a5a3a', 8); rr(-520, 500, 1040, 60, 20); ol('#1e3a28', 7);
    for (let i = 0; i < 3; i++) { rr(-450 + i * 330, 600, 240, 200, 16); ol('#cfe3f2', 6); }
    g.save(); rr(-120, 600, 240, 200, 16); g.clip(); person(0, 1130, 560, ODON, pose('stand', t, { armR: -2.6 + Math.sin(t * 9) * 0.35, elbR: 0.3 }), { expr: 'happy' }, t); g.restore();
    for (const wx of [-380, 380]) { g.save(); g.translate(wx, 990); circ(0, 0, 58); ol('#333', 7); g.rotate(t * 14); line([[-50, 0], [50, 0]], 6, '#777'); line([[0, -50], [0, 50]], 6, '#777'); g.restore(); } });
  L(0.9, () => smoke(-700, 420, t * 3, 1.4));
}
function office(t) { g.fillStyle = '#d8c8a8'; g.fillRect(0, 0, W, H);
  L(0.7, () => { rr(-900, -400, 520, 700, 10); ol('#24305a', 8); txt('CINE', -640, -280, 90, '#ffd23f', 0); circ(-640, 0, 150); ol('#c9a24a', 7); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + t * 0.6; circ(-640 + Math.cos(a) * 90, Math.sin(a) * 90, 32); ol('#24305a', 4); }
    rr(300, -400, 560, 520, 10); ol('#9cc0dc', 8); line([[580, -400], [580, 120]], 7); g.fillStyle = '#c0d0dc'; for (let i = 0; i < 4; i++) g.fillRect(320 + i * 130, -100 - R(i) * 200, 100, 300); });
  L(1, () => { g.fillStyle = '#8a6a4a'; g.fillRect(-3000, 900, 6000, 1600); line([[-3000, 900], [3000, 900]], 7); });
}
function hatGround(t, u) { theatre(t); L(1.2, () => { for (let i = 0; i < 16; i++) { g.save(); g.translate(-500 + R(i) * 1000, 1000 + R(i + 1) * 260); g.rotate(R(i + 2) * 6); ell(0, 0, 34, 16); ol(i % 2 ? '#4e8c44' : '#3f7a3a', 4); g.restore(); }
  g.save(); g.translate(60, 1060); ell(0, 0, 110, 22); ol('#2a2a32'); g.beginPath(); g.arc(0, -10, 62, Math.PI, 0); g.closePath(); ol('#2a2a32'); g.restore(); }); }
// ---------- shots ----------
// P0 hook: storm on the avenue, lightning, the branch cracks over him
sh(0, 0, (t, u, lt) => { camPath([60, 240, 1.0], [80, 300, 1.15], u); avenue(t, { storm: 1 }); L(1, () => { chestnut(-120, 960, 1.15, t, { w: 1, crack: seg(lt, 0.2, 0.5) }); person(250, 960, 520, ODON, pose('shock', t), { expr: 'shock', look: -0.5 }, t); }); wind(t, 10, 1); rain(t);
  const a = flash(t, [0.05, 1.3]); shakeAt(t, 0.05, 30); popText('VE A PARÍS…', 470, lt, 0, '#fff', 96); tag(); }, 1);
sh(0, 0.55, (t, u, lt) => { camPath([120, 260, 1.0], [180, 380, 1.2], u, easeIn); avenue(t, { storm: 1 }); L(1, () => { chestnut(-120, 960, 1.15, t, { w: 1, fall: seg(lt, 0.1, 0.9) * 0.45 }); person(250, 960, 520, ODON, pose('cover', t), { expr: 'scared', look: -0.5 }, t); }); rain(t); flash(t, [st(0) + dur(0) * 0.55 + 0.1]); shakeAt(t, t - lt + 0.15, 26);
  popText('…Y PARÍS LO MATÓ', 470, lt, 0, '#ff6b6b', 88); tag(); }, 1);
// P1 the prophecy came true: fortune teller, glowing ball
sh(1, 0, (t, u, lt) => { camPath([0, 500, 1.05], [0, 560, 1.4], u); tent(t, { pose: pose('point', t, { armR: -1.2 }), face: { expr: 'smug', talk: true } }); tag(seg(lt, 0, 0.1) * (1 - seg(u, 0.5, 0.8))); });
// P2 who: writer at his desk, name card
sh(2, 0, (t, u, lt) => { camPath([0, 520, 1.25], [-40, 500, 1.4], u); study(t); L(1, () => { person(-60, 1010, 560, ODONH, pose('write', t, { elbR: 1.6 + Math.sin(t * 10) * 0.2 }), { expr: 'smile', look: 0.3 }, t); books(260, 760, 0.8, 0); }); card('ÖDÖN VON HORVÁTH', 'ESCRITOR · AUSTRIA-HUNGRÍA', seg(lt, 0.2, 0.5)); });
// P3 1938: banned (stamp slams) -> he runs with a suitcase
sh(3, 0, (t, u, lt) => { camPath([200, 620, 1.7], [200, 600, 1.9], u); study(t); L(1, () => books(200, 760, 1.2, seg(lt, 0.6, 0.9))); shakeAt(t, t - lt + 0.75, 24); card('1938', null, seg(lt, 0.05, 0.3) * (1 - seg(u, 0.85, 1)), 300); }, 1);
sh(3, 0.5, (t, u, lt) => { const x = lerp(-700, 600, u); camTo(x * 0.8, 560, 1.15); avenue(t, { storm: 0.25 }); L(1, () => { person(x, 960, 540, ODON, pose('run', t, { armL: 0.6, elbL: -0.4 }), { expr: 'worried', sweat: true }, t); suitcase(x + 70, 760 + Math.sin(t * 15) * 10, 1); }); screen(() => speedLines(t, 'h', 0.3)); }, 1);
// P4 Amsterdam: walks into the fortune teller's door
sh(4, 0, (t, u, lt) => { const x = lerp(-400, 120, ease(u)); camTo(x * 0.6, 560, 1.15); amsterdam(t); L(1, () => { rr(180, 560, 190, 340, 70); ol('#3a1a4a', 7); rr(150, 470, 250, 70, 10); ol('#e8c25a', 5); txt('ADIVINA', 275, 505, 40, '#3a1a4a', 0); person(x, 960, 540, ODON, pose(u < 0.85 ? 'walk' : 'stand', t), { expr: 'smile', look: 0.6 }, t); }); card('ÁMSTERDAM', null, seg(lt, 0.1, 0.4), 300); });
// P5 she reads the cards: PARÍS + your greatest adventure
sh(5, 0, (t, u, lt) => { camPath([0, 380, 1.1], [0, 640, 1.6], u); tent(t, { pose: pose('point', t, { armR: -0.9, armL: 0.7, elbL: -0.8 }), face: { expr: 'grin', talk: true } }); L(1.05, () => { tcard(-280, 1000, 0.9, seg(lt, 0.3, 0.7), () => txt('★', 0, 0, 90, '#c9a24a', 0)); tcard(0, 1020, 1.0, seg(lt, 1.2, 1.6), towerFace); tcard(280, 1000, 0.9, seg(lt, 2.1, 2.5), () => txt('!', 0, 0, 120, '#c0392b', 0)); }); });
// P6 excited, gets on the train (train rolls, he waves)
sh(6, 0, (t, u, lt) => { camPath([0, 720, 1.1], [60, 760, 1.25], u); trainScene(t, u); screen(() => speedLines(t, 'h', 0.25)); }, 1);
// P7 Paris: a director wants to film his novel (camera cranks, reel spins)
sh(7, 0, (t, u, lt) => { camPath([0, 540, 1.1], [0, 560, 1.3], u); office(t); L(1, () => { filmCam(330, 960, 1.0, t); person(150, 960, 560, DIR, pose('crank', t), { expr: 'grin', talk: true, look: -0.6 }, t, true); person(-250, 960, 560, ODONH, pose(u > 0.45 ? 'proud' : 'stand', t, { jump: u > 0.45 ? Math.abs(Math.sin(t * 7)) * 30 : 0 }), { expr: u > 0.45 ? 'laugh' : 'smile', look: 0.6 }, t); }); });
// P8 1 June: handshake, all perfect
sh(8, 0, (t, u, lt) => { camPath([-40, 560, 1.4], [0, 540, 1.6], u); office(t); L(1, () => { const sh2 = Math.sin(t * 12) * 0.15; person(-150, 960, 560, ODONH, pose('point', t, { armR: -1.0 + sh2 }), { expr: 'grin', look: 0.6 }, t); person(150, 960, 560, DIR, pose('point', t, { armR: -1.0 - sh2 }), { expr: 'grin', look: -0.6 }, t, true); });
  screen(() => { const a = seg(lt, 0.1, 0.4); g.globalAlpha = a; rr(W / 2 - 200, 220, 400, 250, 16); ol('#fbf7ea', 10); rr(W / 2 - 200, 220, 400, 80, 16); ol('#c0392b', 10); txt('JUNIO 1938', W / 2, 260, 44, '#fff', 0); txt('1', W / 2, 390, 130, OUT, 0); g.globalAlpha = 1; }); });
// P9 happy walk on the Champs-Élysées (camera follows)
sh(9, 0, (t, u, lt) => { const x = lerp(-500, 400, u); camTo(x, 560, 1.15); avenue(t); L(0.5, () => birds(t, -900, -500, 5)); L(1, () => person(x, 960, 540, ODON, pose('walk', t), { expr: 'happy', look: 0.4 }, t)); card('CAMPOS ELÍSEOS', 'PARÍS', seg(lt, 0.1, 0.4) * (1 - seg(u, 0.8, 1)), 300); });
// P10 the sky turns black in minutes (tilt up, storm rolls in)
sh(10, 0, (t, u, lt) => { camPath([300, 560, 1.15], [300, 100, 0.85], u); avenue(t, { storm: ease(u) }); L(1, () => person(300, 960, 540, ODON, pose(u > 0.5 ? 'think' : 'walk', t), { expr: u > 0.5 ? 'worried' : 'happy', look: -0.3 }, t)); darkTint(0.25 * u); });
// P11 brutal storm: lightning, wind, rain
sh(11, 0, (t, u, lt) => { camPath([0, 300, 0.9], [0, 380, 1.05], u); avenue(t, { storm: 1 }); const t0 = t - lt; L(0.4, () => { bolt(-300, -900, 500, 3, flash(t, [t0 + 0.3]) ); bolt(400, -900, 400, 9, flash(t, [t0 + 1.6])); }); flash(t, [t0 + 0.3, t0 + 1.6]); shakeAt(t, t0 + 0.3, 22); wind(t, 14, 1.3); rain(t, 1.4); handheld(t, 8); }, 1);
// P12 people run for cover; he runs under the trees
sh(12, 0, (t, u, lt) => { camPath([-100, 560, 1.0], [100, 560, 1.1], u); avenue(t, { storm: 1 }); L(1, () => { for (let i = 0; i < 4; i++) person(lerp(-900 + i * 200, 900 + i * 200, u) - 300, 1000 + i * 30, 500, CROWD[i], pose('cover', t + i), { expr: 'scared' }, t); person(lerp(-200, 260, u), 960, 540, ODON, pose('run', t, { armL: 2.6, elbL: 0.6 }), { expr: 'worried' }, t); }); rain(t, 1.3); wind(t, 10, 1); flash(t, [t - lt + 1.2]); }, 1);
// P13 right in front of the Théâtre Marigny, under a huge chestnut
sh(13, 0, (t, u, lt) => { camPath([-300, 300, 0.75], [-80, 450, 0.9], u); theatre(t); L(1, () => { chestnut(320, 920, 1.2, t, { w: 1 }); person(560, 920, 520, ODON, pose('cover', t), { expr: 'worried', look: -0.4 }, t, true); }); rain(t, 1.2); wind(t, 8, 0.9); });
// P14 "and here everything went wrong": tilt up the trunk to the creaking branch
sh(14, 0, (t, u, lt) => { camPath([400, 600, 1.1], [500, -160, 1.4], u, easeIn); theatre(t); L(1, () => { chestnut(320, 920, 1.2, t, { w: 1.3, crack: seg(u, 0.5, 0.9) }); person(560, 920, 520, ODON, pose('cover', t), { expr: 'worried', look: -0.4 }, t, true); }); rain(t); flash(t, [t - lt + dur(14) * 0.7]); });
// P15 the wind splits the branch (snap + lightning)
sh(15, 0, (t, u, lt) => { camPath([560, -160, 1.5], [580, -60, 1.3], u); theatre(t); const snap = dur(15) * 0.55; L(1, () => chestnut(320, 920, 1.2, t, { w: 1.5, crack: 1, fall: seg(lt, snap, snap + 0.9) * 0.25 })); wind(t, 14, 1.4); rain(t); flash(t, [t - lt + snap]); shakeAt(t, t - lt + snap, 30); if (lt > snap) popText('¡CRAC!', 520, lt, snap, '#ffd23f', 120); }, 1);
// P16 ...and it fell right on him (cut away: leaf burst + people's reaction)
sh(16, 0, (t, u, lt) => { camPath([360, 300, 0.95], [380, 340, 1.0], u); theatre(t); const hit = dur(16) * 0.45; L(1, () => { chestnut(320, 920, 1.2, t, { w: 1.2, fall: 0.25 + 0.75 * seg(lt, 0, hit) }); if (lt < hit * 0.8) person(560, 920, 520, ODON, pose('shock', t), { expr: 'shock', look: -0.4 }, t, true); if (lt > hit) { puff(620, 900, 2.2, (lt - hit) / 1.3, '#4e8c44'); puff(560, 920, 1.6, (lt - hit) / 1.1, '#8a8a90'); } }); rain(t); shakeAt(t, t - lt + hit, 34); }, 1);
sh(16, 0.62, (t, u, lt) => { camPath([0, 560, 1.5], [0, 560, 1.7], u); avenue(t, { storm: 1 }); L(1, () => { person(-200, 960, 560, CROWD[2], pose('cover', t), { expr: 'closed' }, t); person(200, 960, 560, CROWD[4], pose('shock', t), { expr: 'shock' }, t, true); }); rain(t); }, 1);
// P17 died on the spot at 36: his hat on the wet ground among leaves
sh(17, 0, (t, u, lt) => { fx({ sepia: 0.5 }); camPath([60, 900, 1.6], [60, 960, 2.0], u); hatGround(t, u); rain(t, 0.8); screen(() => { const a = seg(lt, 0.3, 0.7); g.globalAlpha = a; txt('1901 – 1938', W / 2, 330, 84, '#fff', 14); g.globalAlpha = 1; }); });
// P18 the fortune teller was right: card PARÍS on the table, candle goes out
sh(18, 0, (t, u, lt) => { camPath([0, 700, 1.3], [0, 900, 1.8], u); tent(t, { cast: u < 0.5, out: u > 0.75 ? 1 : 0, face: { expr: 'sad' } }); L(1.05, () => tcard(0, 1020, 1.1, 1, towerFace)); if (u > 0.75) L(1, () => smoke(520, 520, t, 0.8)); darkTint(0.3 * seg(u, 0.75, 1)); });
// P19 question: push into the crystal ball
sh(19, 0, (t, u, lt) => { camPath([0, 500, 1.1], [0, 600, 2.6], u, easeIn); tent(t, { face: { expr: 'smug' } }); screen(() => { const k = back(seg(lt, 0.4, 0.7)); g.save(); g.translate(W / 2, 360); g.scale(k, k); txt('¿TÚ LE HARÍAS CASO?', 0, 0, 70, '#ffd23f', 14); g.restore(); }); tag(); });
