// Eleazar Avaran — battle of Beth Zechariah, Judea, 162 BC (1 Maccabees 6:43-46) (engine4)
import { K, W, H, OUT, clamp, lerp, ease, easeIn, easeOut, back, R, seg, ol, rr, circ, ell, line, poly, txt, L, screen, camTo, camPath, shakeAt, handheld,
  person, pose, mixPose, cloud, bird, tree, puff, speedLines, sky, wind } from './engine.js';
import { PH, st, en, dur, sh, fx, clouds, birds, vign } from './lib.js';
export { FRAMES, frame, post, blurN } from './lib.js';
const g = K.g;
// ---------- cast ----------
const ELE = { skin: '#d9a676', hair: '#2b1d14', hairStyle: 'curly', beard: true, coat: '#c9b48a', pants: '#7a5a3a', shoes: '#4a3020', seed: 1 };
const REB = [{ skin: '#c98e62', hair: '#141414', hairStyle: 'curly', beard: true, coat: '#8a6a4a', pants: '#5a4030', shoes: '#3a2818', seed: 4 },
  { skin: '#e0a97f', hair: '#5a3b22', hairStyle: 'side', mustache: true, coat: '#6b7a4a', pants: '#5a4030', shoes: '#3a2818', seed: 5 },
  { skin: '#b97f58', hair: '#2b1d14', hairStyle: 'bald', beard: true, coat: '#a0704a', pants: '#4a3a2a', shoes: '#3a2818', seed: 6 }];
const SOL = (i) => ({ skin: ['#f2c9a0', '#e0a97f', '#c98e62', '#f5d2b3'][i % 4], hair: '#3a2a1a', hairStyle: 'side', hat: 'cap', hatColor: '#c49a3c', coat: ['#9a2f2f', '#2f4a7a', '#9a2f2f', '#7a3a6a'][i % 4], pants: '#5a4030', shoes: '#3a2818', mustache: i % 2 === 0, seed: 10 + i });
const KING = { skin: '#f5d2b3', hair: '#7a5a3a', hairStyle: 'side', coat: '#6b2f8a', pants: '#e8dcc0', shoes: '#c9a24a', seed: 30 };
const spear = (hR, hL, gg) => { line([[hR[0] - 8, hR[1] + 90], [hR[0] + 14, hR[1] - 250]], 9, '#6b4a26'); poly([[hR[0] + 4, hR[1] - 245], [hR[0] + 24, hR[1] - 250], [hR[0] + 18, hR[1] - 300]]); ol('#cfd6dc', 4); circ(hL[0] + 10, hL[1] - 10, 62); ol('#c49a3c', 7); circ(hL[0] + 10, hL[1] - 10, 22); ol('#9a7428', 5); };
const swordUp = (hR) => { line([[hR[0], hR[1] + 10], [hR[0], hR[1] - 150]], 12, '#cfd6dc'); line([[hR[0] - 26, hR[1] - 6], [hR[0] + 26, hR[1] - 6]], 9, '#8a6a3a'); };
const swordFwd = (hR) => { line([[hR[0] - 10, hR[1] + 4], [hR[0] + 140, hR[1] - 50]], 12, '#cfd6dc'); line([[hR[0] + 2, hR[1] - 22], [hR[0] - 8, hR[1] + 26]], 9, '#8a6a3a'); };
// ---------- props ----------
function crown(x, y, w, col = '#f2c23a') { g.save(); g.translate(x, y); poly([[-w / 2, 0], [w / 2, 0], [w / 2, -w * 0.55], [w * 0.25, -w * 0.25], [0, -w * 0.6], [-w * 0.25, -w * 0.25], [-w / 2, -w * 0.55]]); ol(col, 5); circ(0, -w * 0.14, w * 0.08); ol('#d0302f', 3); g.restore(); }
// elephant, origin = between the feet on the ground, facing right. o: {royal, tower, crew, tilt, walk, hurt, emptyTower}
function elephant(x, y, s, t, o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s); g.rotate(o.tilt || 0);
  const ph = t * 5 * (o.walk ?? 1), skin = o.royal ? '#9a9aa8' : '#a7a2a0', dk = '#85808a';
  // far legs
  for (const [lx, k] of [[-190, 0], [160, 2]]) { g.save(); g.translate(lx, -250); g.rotate(Math.sin(ph + k + 1.5) * 0.18 * (o.walk ?? 1 ? 1 : 0)); rr(-48, -20, 96, 275, 30); ol(dk, 7); g.restore(); }
  // tail
  line([[-330, -470], [-390 + Math.sin(t * 4) * 15, -300]], 8); circ(-392 + Math.sin(t * 4) * 15, -290, 12); ol('#5a5560', 4);
  // body
  ell(0, -450, 340, 220); ol(skin, 8);
  if (o.royal) { g.beginPath(); g.moveTo(-250, -600); g.quadraticCurveTo(0, -690, 230, -600); g.lineTo(250, -340); g.quadraticCurveTo(0, -300, -270, -340); g.closePath(); ol('#b8282f', 7); for (let k = 0; k < 9; k++) { circ(-240 + k * 60, -345 + Math.sin(k) * 6, 14); ol('#f2c23a', 4); } rr(-260, -620, 510, 36, 10); ol('#f2c23a', 6); }
  // tower
  if (o.tower) { const tx = -40; rr(tx - 150, -920, 300, 300, 8); ol('#a8743f', 7); for (let k = 0; k < 5; k++) line([[tx - 150 + k * 75, -915], [tx - 150 + k * 75, -625]], 3, '#6b4a26'); line([[tx - 150, -770], [tx + 150, -770]], 3, '#6b4a26');
    for (let k = 0; k < 5; k++) { rr(tx - 158 + k * 66, -960, 50, 46, 4); ol('#a8743f', 6); }
    if (o.royal) { rr(tx - 160, -930, 320, 22, 4); ol('#f2c23a', 5); const fl = Math.sin(t * 8); line([[tx + 120, -960], [tx + 120, -1150]], 7); poly([[tx + 120, -1150], [tx + 230, -1125 + fl * 10], [tx + 120, -1095]]); ol('#b8282f', 5); }
    if (o.crew && !o.emptyTower) for (let k = 0; k < 3; k++) { const hx = tx - 90 + k * 90; g.save(); person(hx, -800, 330, SOL(k + 3), pose('stand', t + k), { expr: k === 1 ? 'grin' : 'determined', look: 0.5 }, t, false); g.restore(); }
    if (o.crew) { rr(tx - 150, -820, 300, 200, 4); ol('#a8743f', 7); for (let k = 0; k < 5; k++) line([[tx - 150 + k * 75, -815], [tx - 150 + k * 75, -625]], 3, '#6b4a26'); }
    line([[tx - 140, -620], [-200, -330]], 6, '#6b4a26'); line([[tx + 140, -620], [180, -330]], 6, '#6b4a26'); }
  // head
  g.save(); g.translate(280, -540); g.rotate(Math.sin(ph * 0.5) * 0.04 + (o.rear || 0) * -0.4);
  ell(-40, 20, 120, 150); ol(dk, 7); // ear
  circ(60, 0, 150); ol(skin, 8);
  if (o.royal) { poly([[20, -140], [150, -110], [170, 20], [70, 40]]); ol('#f2c23a', 6); circ(110, -40, 18); ol('#b8282f', 4); }
  // trunk
  const tw = Math.sin(t * 2.2) * 0.25 + (o.rear || 0) * -1.2; g.beginPath(); g.moveTo(140, 40); g.bezierCurveTo(230, 120 + tw * 80, 210 + tw * 120, 300, 260 + tw * 220, 380 - Math.abs(tw) * 160); g.lineTo(215 + tw * 220, 390 - Math.abs(tw) * 160); g.bezierCurveTo(160 + tw * 100, 300, 170, 150, 80, 100); g.closePath(); ol(skin, 7);
  g.beginPath(); g.moveTo(120, 90); g.quadraticCurveTo(210, 150, 260, 90); g.lineTo(250, 110); g.quadraticCurveTo(200, 165, 115, 115); g.closePath(); ol('#f4efe2', 5); // tusk
  if (o.hurt) { line([[70, -40], [110, -20]], 7); line([[70, -10], [110, -30]], 7); } else { circ(95, -30, 13); ol(OUT, 0); circ(91, -34, 4); ol('#fff', 0); }
  g.restore();
  // near legs
  for (const [lx, k] of [[-150, 0.5], [200, 2.5]]) { g.save(); g.translate(lx, -250); g.rotate(Math.sin(ph + k) * 0.18 * ((o.walk ?? 1) ? 1 : 0)); rr(-52, -30, 104, 285, 30); ol(skin, 7); for (let j = -1; j <= 1; j++) { ell(j * 28, 248, 14, 9); ol('#f4efe2', 3); } g.restore(); }
  g.restore();
}
function horse(x, y, s, t, v = 1) { g.save(); g.translate(x, y); g.scale(s, s); const ph = t * 8 * v; g.translate(0, -150);
  for (const [lx, o2] of [[-80, 0], [-60, 1.5], [70, 3], [90, 4.5]]) { const a = Math.sin(ph + o2) * 0.4 * v; g.save(); g.translate(lx, 30); g.rotate(a); rr(-9, 0, 18, 120, 8); ol('#f2ece0', 5); g.restore(); }
  ell(0, 0, 130, 60); ol('#f2ece0', 7); rr(-90, -55, 150, 40, 8); ol('#6b2f8a', 5); g.save(); g.translate(110, -40); g.rotate(-0.6 + Math.sin(ph) * 0.05); rr(-20, -100, 50, 120, 20); ol('#f2ece0', 6); ell(30, -110, 55, 30, 0.3); ol('#f2ece0', 6); circ(30, -120, 5); ol(OUT, 0); g.restore();
  line([[-120, -20], [-170, 40 + Math.sin(ph) * 10]], 12, '#c9b48a'); g.restore(); }
// ---------- sets ----------
const SKY1 = '#8ec5e8', SKY2 = '#f6dfb0';
function hills(t, o = {}) { sky(o.top || SKY1, o.bot || SKY2); L(0.05, () => { circ(420, -700, 110); ol('#fff3c4', 0); }); L(0.1, () => clouds(t, -900, 4));
  L(0.25, () => { g.fillStyle = '#c9a77a'; g.beginPath(); g.moveTo(-3000, 700); for (let i = 0; i <= 12; i++) g.lineTo(-3000 + i * 500, 380 + Math.sin(i * 1.7) * 120); g.lineTo(3000, 2000); g.lineTo(-3000, 2000); g.closePath(); ol('#c9a77a', 5); });
  L(0.5, () => { g.beginPath(); g.moveTo(-3000, 800); for (let i = 0; i <= 16; i++) g.lineTo(-3000 + i * 380, 640 + Math.sin(i * 2.3) * 70); g.lineTo(3000, 2000); g.lineTo(-3000, 2000); g.closePath(); ol('#d8b98a', 5); for (let i = 0; i < 8; i++) tree(-1800 + i * 520, 700 + Math.sin(i * 2.3) * 40, 0.45, i + 3, t); }); }
function valley(t, o = {}) { hills(t, o); L(1, () => { g.fillStyle = '#e2c58f'; g.fillRect(-4000, o.gy ?? 1000, 8000, 3000); line([[-4000, o.gy ?? 1000], [4000, o.gy ?? 1000]], 7); g.fillStyle = '#d4b47a'; for (let i = 0; i < 30; i++) { ell(-3000 + R(i) * 6000, (o.gy ?? 1000) + 40 + R(i + 1) * 700, 50 + R(i + 2) * 90, 9 + R(i + 3) * 10); g.fill(); } }); }
function farArmy(t, y, s, n, p = 0.45, vx = 40) { L(p, () => { for (let i = 0; i < n; i++) { const x = -2400 + i * 330 + t * vx; elephant(x, y + (i % 2) * 25, s, t + i, { tower: true, royal: false }); } }); }
function tag(a = 1) { screen(() => { g.globalAlpha = a; rr(40, 150, 470, 70, 16); ol('rgba(20,15,30,0.8)', 5); txt('MUERTES ABSURDAS #37', 275, 186, 34, '#ffd23f', 0); g.globalAlpha = 1; }); }
function bigText(s1, y, a, col = '#fff', size = 96) { screen(() => { g.globalAlpha = a; txt(s1, W / 2, y, size, col, 16); g.globalAlpha = 1; }); }
function soldiersRow(t, x0, y, n, h, spc, o = {}) { for (let i = 0; i < n; i++) { const P = o.pose ? o.pose(i) : pose('walk', t + i * 0.3); person(x0 + i * spc, y + (i % 2) * 20, h, SOL(i), P, { expr: o.expr || 'determined', look: o.look ?? 0.5, hold: o.noSpear ? null : spear }, t + i, o.flip); } }
// ---------- shots ----------
// P0 hook (payoff in motion): under the belly, sword up... the elephant comes down (cut to dust)
sh(0, 0, (t, u, lt) => { camPath([150, 330, 0.8], [150, 300, 0.9], u); valley(t); L(1, () => { elephant(0, 1000, 1.25, t, { royal: true, tower: true, rear: seg(lt, 0.1, 0.6), hurt: lt > 0.2, walk: 0, tilt: -0.08 * seg(lt, 0.2, 1.5) });
  person(150, 1000, 430, ELE, pose('stamp', t), { expr: 'determined', look: 0.3, hold: (hR) => swordUp(hR) }, t); }); shakeAt(t, t - lt + 0.12, 26);
  screen(() => { const k = back(seg(lt, 0, 0.25)); g.save(); g.translate(W / 2, 470); g.scale(k, k); txt('MATÓ AL ELEFANTE…', 0, 0, 84, '#fff', 16); g.restore(); }); tag(); }, 1);
sh(0, 0.5, (t, u, lt) => { camPath([0, 380, 0.78], [0, 400, 0.85], u); valley(t); const k = seg(lt, 0, 0.8); L(1, () => { if (k < 1) elephant(-60, 1000, 1.25, t, { royal: true, tower: true, walk: 0, hurt: true, tilt: easeIn(k) * 0.9 }); puff(250, 960, 2.4, seg(lt, 0.55, 2.2), '#e9d7b0'); puff(-150, 980, 2.0, seg(lt, 0.65, 2.3), '#e2cfa4'); });
  shakeAt(t, t - lt + 0.7, 40); screen(() => { const a = seg(lt, 0.7, 0.9); g.save(); g.translate(W / 2, 470); g.globalAlpha = a; txt('…Y EL ELEFANTE A ÉL', 0, 0, 80, '#ffd23f', 16); g.restore(); }); tag(1 - seg(lt, 0.8, 1.1)); }, 1);
// P1 not even the right elephant: royal tower is empty (camera tilts up), "?" pops
sh(1, 0, (t, u, lt) => { camPath([-40, 100, 1.0], [-40, -420, 1.25], u); valley(t); L(1, () => elephant(0, 1000, 1.0, t, { royal: true, tower: true, crew: true, emptyTower: true, walk: 0.6 }));
  screen(() => { const k = back(seg(u, 0.45, 0.7)); g.save(); g.translate(W / 2 + 230, 520); g.scale(k, k); g.rotate(Math.sin(t * 5) * 0.08); txt('?', 0, 0, 260, '#ffd23f', 18); g.restore(); bigText('EL ELEFANTE EQUIVOCADO', 1250, seg(u, 0.25, 0.4), '#fff', 66); }); });
// P2 Judea, 162 BC: establishing valley, camera drops from sky
sh(2, 0, (t, u, lt) => { camPath([0, -500, 0.8], [0, 300, 0.75], u); valley(t); L(0.3, () => birds(t, -700, -500, 5, 1.2)); farArmy(t, 960, 0.18, 14, 0.5, 30);
  screen(() => { const a = seg(lt, 0.15, 0.45) * (1 - seg(lt, dur(2) - 0.4, dur(2))); g.globalAlpha = a; txt('JUDEA', W / 2, 420, 120, '#fff', 16); txt('162 a.C.', W / 2, 560, 90, '#ffd23f', 14); g.globalAlpha = 1; }); });
// P3 huge army advancing with 32 war elephants (side tracking, counter)
sh(3, 0, (t, u, lt) => { const cx = lerp(-300, 400, u); camTo(cx, 300, 0.55); valley(t); farArmy(t, 900, 0.3, 16, 0.6, 60);
  L(1, () => { for (let i = 0; i < 6; i++) elephant(-1600 + i * 650 + lt * 120, 1000, 0.6, t + i, { tower: true, crew: false, walk: 1 }); soldiersRow(t, -1500 + lt * 120, 1180, 14, 300, 240); });
  screen(() => { const n = Math.round(32 * ease(seg(u, 0.15, 0.8))); rr(W / 2 - 200, 230, 400, 170, 24); ol('rgba(20,15,30,0.8)', 6); txt(`${n}`, W / 2, 300, 110, '#ffd23f', 0); txt('ELEFANTES', W / 2, 370, 38, '#fff', 0); }); });
// P4 each elephant carries a wooden tower full of soldiers (tilt up legs -> tower)
sh(4, 0, (t, u, lt) => { camPath([60, 700, 1.0], [0, -150, 0.95], u); valley(t); L(1, () => elephant(lerp(-120, 60, u), 1000, 1.0, t, { tower: true, crew: true, walk: 1 })); }, 0);
// P5 from the hill, a rebel named Eleazar watches (push in)
function hillTop(t) { hills(t); L(0.5, () => { g.fillStyle = '#e2c58f'; g.fillRect(-4000, 950, 8000, 2000); }); farArmy(t, 1030, 0.14, 18, 0.5, 30);
  L(1, () => { g.beginPath(); g.moveTo(-1400, 2600); g.lineTo(-1400, 1150); g.quadraticCurveTo(-300, 980, 300, 1120); g.quadraticCurveTo(900, 1250, 1400, 1500); g.lineTo(1400, 2600); g.closePath(); ol('#c7a46a', 7); tree(-700, 1100, 1.1, 7, t); }); }
sh(5, 0, (t, u, lt) => { camPath([0, 700, 0.75], [-80, 760, 1.05], u); hillTop(t); L(1, () => { person(-180, 1060, 560, ELE, pose('think', t, { armR: -2.6, elbR: -1.2 }), { expr: 'determined', look: 0.9 }, t); person(-520, 1110, 520, REB[0], pose('stand', t), { expr: 'worried', look: 0.9 }, t); });
  screen(() => { const a = seg(lt, 0.4, 0.8) * (1 - seg(lt, dur(5) - 0.4, dur(5))); g.globalAlpha = a; rr(120, 330, 380, 90, 20); ol('#fbf7ea', 6); txt('ELEAZAR', 310, 375, 54, '#7a2b2b', 0); g.globalAlpha = 1; }); });
// P6 one elephant taller than all, with royal armor (zoom past the row onto the gold one)
sh(6, 0, (t, u, lt) => { camPath([-500, 250, 0.55], [560, 150, 0.75], u); valley(t); L(1, () => { for (let i = 0; i < 4; i++) if (i !== 2) elephant(-1300 + i * 650 + lt * 60, 1000, 0.62, t + i, { tower: true, walk: 1 }); elephant(-1300 + 2 * 650 + lt * 60 + 400, 1000, 0.9, t, { tower: true, royal: true, crew: true, walk: 1 });
  const k = seg(u, 0.5, 0.8); if (k > 0) for (let j = 0; j < 4; j++) { const a = t * 3 + j * 1.57; g.save(); g.translate(400 + 650 * 0.5 + lt * 60 + Math.cos(a) * 260, 300 + Math.sin(a) * 200); g.globalAlpha = k * (0.5 + 0.5 * Math.sin(t * 9 + j)); poly([[0, -40], [10, -10], [40, 0], [10, 10], [0, 40], [-10, 10], [-40, 0], [-10, -10]]); ol('#fff2a0', 3); g.restore(); } }); });
// P7a Eleazar thinks: the king is up there (thought bubble)
sh(7, 0, (t, u, lt) => { camPath([0, 650, 1.25], [0, 620, 1.4], u); hillTop(t); L(1, () => person(-220, 1060, 600, ELE, pose('think', t), { expr: 'smug', look: 0.6 }, t));
  screen(() => { const k = back(seg(lt, 0.2, 0.6)); g.save(); g.translate(720, 520); g.scale(k, k); for (const [bx, by, r] of [[-260, 300, 20], [-220, 240, 32]]) { circ(bx, by, r); ol('#fff', 6); } ell(0, 0, 300, 230); ol('#fff', 7); g.save(); g.translate(0, 120); g.scale(0.32, 0.32); elephant(0, 0, 1, t, { royal: true, tower: true, walk: 0 }); g.restore(); crown(-12, -170, 120); g.restore(); }); });
// P7b "if the king falls, the war ends" (crown falls in the bubble, Eleazar grins)
sh(7, 0.55, (t, u, lt) => { camPath([0, 650, 1.4], [-60, 600, 1.55], u); hillTop(t); L(1, () => person(-220, 1060, 600, ELE, pose('proud', t), { expr: 'grin', look: 0.6 }, t));
  screen(() => { g.save(); g.translate(720, 520); for (const [bx, by, r] of [[-260, 300, 20], [-220, 240, 32]]) { circ(bx, by, r); ol('#fff', 6); } ell(0, 0, 300, 230); ol('#fff', 7); const k = easeIn(seg(lt, 0.1, 0.7)); g.save(); g.translate(0, lerp(-170, 140, k)); g.rotate(k * 2.5); crown(0, 0, 120); g.restore(); if (lt > 0.8) txt('¡FIN!', 0, -60, 90, '#c0392b', 10); g.restore(); }); });
// P8 his plan was very simple... and very bad (plan sketch + red stamp)
sh(8, 0, (t, u, lt) => { camPath([0, 300, 1.0], [0, 320, 1.15], u); g.fillStyle = '#6b4a2c'; g.fillRect(0, 0, W, H); L(1, () => { g.save(); g.rotate(-0.04); rr(-430, -250, 860, 1000, 12); ol('#f1e3c0', 8);
  txt('PLAN', 0, -160, 80, '#5a3b22', 0); person(-250, 400, 200, ELE, pose('run', t), { expr: 'determined' }, t); line([[-180, 330], [80, 330]], 8, '#5a3b22'); poly([[80, 300], [130, 330], [80, 360]]); ol('#5a3b22', 0); g.save(); g.translate(250, 420); g.scale(0.22, 0.22); elephant(0, 0, 1, t, { royal: true, walk: 0 }); g.restore(); txt('1. CORRER', -150, 540, 46, '#5a3b22', 0); txt('2. CLAVAR', -150, 610, 46, '#5a3b22', 0); txt('3. ¿?', -150, 680, 46, '#5a3b22', 0);
  const k = back(seg(u, 0.55, 0.75)); if (k > 0) { g.save(); g.translate(60, 180); g.rotate(-0.25); g.scale(k * 1.3 - (k - 1) * 0, k); rr(-300, -80, 600, 160, 16); g.strokeStyle = '#d0302f'; g.lineWidth = 14; g.stroke(); txt('MAL PLAN', 0, 0, 100, '#d0302f', 0); g.restore(); } g.restore(); }); shakeAt(t, t - lt + dur(8) * 0.6, 18); });
// P9 runs down the hill alone, straight at the enemy (camera follows)
sh(9, 0, (t, u, lt) => { const x = lerp(-500, 900, u); camTo(x, lerp(800, 1000, u), 0.85); hills(t); L(0.5, () => { g.fillStyle = '#e2c58f'; g.fillRect(-4000, 950, 9000, 2000); }); farArmy(t, 1030, 0.2, 18, 0.5, 30);
  L(1, () => { g.beginPath(); g.moveTo(-1600, 2600); g.lineTo(-1600, 900); g.lineTo(2600, 1400); g.lineTo(2600, 2600); g.closePath(); ol('#c7a46a', 7); const y = lerp(900, 1400, (x + 1600) / 4200) + 10; person(x, y, 520, ELE, pose('run', t * 1.3), { expr: 'angry', look: 1, hold: (hR) => swordFwd(hR) }, t); puff(x - 160, y, 0.5, (t * 2) % 1, '#e9d7b0'); });
  screen(() => speedLines(t, 'h', 0.5)); }, 1);
// P10 dodges spears, shields and soldiers without stopping (tracking through the line)
sh(10, 0, (t, u, lt) => { const x = lerp(-200, 1600, u); camTo(x + 60, 640, 0.95); valley(t);
  L(1, () => { for (let i = 0; i < 9; i++) { const sx = -300 + i * 260, near = Math.abs(sx - x) < 160; person(sx, 1000 + (i % 2) * 30, 520, SOL(i), near ? pose('point', t, { armR: -1.7 }) : pose('stand', t + i), { expr: near ? 'shock' : 'angry', look: -0.6, hold: spear }, t + i, true); }
    const duck = Math.abs(Math.sin(u * Math.PI * 4)) > 0.75; person(x, 1060, 500, ELE, duck ? pose('crouch', t) : pose('run', t * 1.3), { expr: 'determined', look: 1, hold: duck ? null : (hR) => swordFwd(hR) }, t); });
  screen(() => speedLines(t, 'h', 0.6)); }, 1);
// P11 arrives right under the belly of the giant elephant (tilt up)
sh(11, 0, (t, u, lt) => { camPath([150, 900, 1.0], [150, 400, 0.8], u); valley(t); L(1, () => { elephant(-60, 1150, 1.45, t, { royal: true, tower: true, crew: true, walk: 0.3 }); person(150, 1150, 440, ELE, pose('shock', t), { expr: 'shock', look: 0.2 }, t); }); });
// P12 "and here everything went wrong" (dark push-in on his face)
sh(12, 0, (t, u, lt) => { camPath([150, 700, 1.6], [150, 650, 2.4], u, easeIn); valley(t); L(1, () => { elephant(-60, 1150, 1.45, t, { royal: true, tower: true, walk: 0 }); person(150, 1150, 440, ELE, pose('stand', t), { expr: 'worried', sweat: true, look: 0.2 }, t); });
  screen(() => { g.fillStyle = `rgba(30,0,10,${0.35 * u})`; g.fillRect(0, 0, W, H); }); });
// P13 raises the sword and thrusts it upward (flash on contact)
sh(13, 0, (t, u, lt) => { camPath([150, 600, 1.0], [150, 560, 1.1], u); valley(t); const k = seg(u, 0.25, 0.45); L(1, () => { elephant(-60, 1150, 1.45, t, { royal: true, tower: true, walk: 0, hurt: k >= 1, rear: seg(u, 0.45, 0.9) * 0.6 }); person(150, 1150, 440, ELE, mixPose(pose('crouch', t), pose('stamp', t), k), { expr: 'angry', look: 0.2, hold: (hR) => swordUp(hR) }, t);
  if (u > 0.45) { const f = 1 - seg(u, 0.45, 0.7); g.globalAlpha = f; poly([[150, 360], [200, 420], [270, 400], [220, 460], [260, 530], [170, 480], [120, 540], [120, 460], [50, 430], [130, 410]]); ol('#fff6b0', 4); g.globalAlpha = 1; } }); shakeAt(t, t - lt + dur(13) * 0.45, 30); }, 1);
// P14 the elephant staggers... and comes down on him (shadow grows, cut to dust)
sh(14, 0, (t, u, lt) => { camPath([0, 430, 0.78], [0, 450, 0.74], u); valley(t); const k = easeIn(seg(u, 0.15, 0.6)); L(1, () => { if (k < 1) elephant(-150, 1000, 1.2, t, { royal: true, tower: true, walk: 0, hurt: true, tilt: Math.sin(t * 9) * 0.04 * (1 - k) + k * 0.95 });
  if (u < 0.5) { g.globalAlpha = 0.25 + 0.5 * k; ell(200, 1005, 220 + k * 300, 40); ol('#000', 0); g.globalAlpha = 1; person(200, 1000, 360, ELE, pose('shock', t), { expr: 'scared' }, t); } puff(200, 980, 2.6, seg(u, 0.55, 1), '#e9d7b0'); puff(-200, 990, 2.2, seg(u, 0.6, 1), '#e2cfa4'); }); shakeAt(t, t - lt + dur(14) * 0.58, 45); }, 1);
// P15 he died right there, under the animal he brought down (aftermath: fallen elephant, sword in the dirt, soldiers shocked)
sh(15, 0, (t, u, lt) => { fx({ sepia: 0.45 }); camPath([0, 500, 0.75], [0, 560, 0.9], u); valley(t); L(1, () => { elephant(-430, 690, 0.8, t, { royal: true, hurt: true, walk: 0, tilt: 1.57 });
  g.save(); g.translate(520, 990); g.rotate(0.35); line([[0, 0], [0, -180]], 12, '#cfd6dc'); line([[-28, -150], [28, -150]], 9, '#8a6a3a'); g.restore(); puff(0, 980, 2.4, 0.55 + u * 0.4, '#e9d7b0'); });
  L(1.15, () => { person(-380, 1350, 560, SOL(0), pose('cover', t), { expr: 'closed', hold: null }, t); person(330, 1350, 560, REB[1], pose('shock', t), { expr: 'shock' }, t, true); }); });
// P16a "and the king?" — the royal tower lies empty
sh(16, 0, (t, u, lt) => { camPath([0, -150, 1.2], [0, -250, 1.4], u); valley(t); L(1, () => elephant(0, 600, 1.0, t, { royal: true, tower: true, crew: true, emptyTower: true, walk: 0 })); screen(() => { const k = back(seg(lt, 0.2, 0.5)); g.save(); g.translate(W / 2, 330); g.scale(k, k); txt('¿EL REY?', 0, 0, 110, '#ffd23f', 16); g.restore(); }); });
// P16b the boy king was far away, safe on his horse
sh(16, 0.45, (t, u, lt) => { camPath([0, 650, 1.15], [0, 630, 1.3], u); valley(t); L(0.6, () => { for (let i = 0; i < 4; i++) person(-900 + i * 600, 1000, 380, SOL(i), pose('stand', t + i), { expr: 'smug', hold: spear }, t + i); });
  L(1, () => { horse(-40, 1050, 1.6, t, 0.2); person(-40, 790, 330, KING, pose('point', t, { armR: -2.4, elbR: 0.3, legL: -0.9, legR: -0.9, kneeL: 1.2, kneeR: 1.2 }), { expr: 'grin', look: 0.6 }, t); crown(-40, 790 - 0.86 * 330, 80); }); });
// P17 that day, his army lost the battle (rebels retreat, banner falls, sunset)
sh(17, 0, (t, u, lt) => { camPath([200, 600, 0.85], [-200, 620, 0.85], u); valley(t, { top: '#e88a5a', bot: '#f6c98a' }); L(1, () => { for (let i = 0; i < 4; i++) { const x = 600 - i * 260 - lt * 320; person(x, 1020 + (i % 2) * 30, 460, i ? REB[i % 3] : REB[1], pose('run', t * 1.2 + i * 0.3), { expr: 'scared', look: -1 }, t + i, true); }
  g.save(); g.translate(250, 1030); g.rotate(-easeIn(seg(u, 0.2, 0.7)) * 1.4); line([[0, 0], [0, -520]], 10, '#6b4a26'); poly([[0, -520], [220, -480 + Math.sin(t * 6) * 10], [0, -400]]); ol('#3a6ab0', 6); g.restore(); }); });
// P18 told in the First Book of Maccabees (old book + candle)
sh(18, 0, (t, u, lt) => { camPath([0, 250, 0.95], [0, 230, 1.15], u); g.fillStyle = '#3a2a22'; g.fillRect(0, 0, W, H); L(1, () => { const o = ease(seg(lt, 0, 0.7)); rr(-420, -150, 840, 760, 16); ol('#7a3a2a', 8); g.save(); g.translate(0, 230); g.scale(1, 1); rr(-400 * o, -360, 400 * o, 720, 8); ol('#f1e3c0', 6); rr(0, -360, 400, 720, 8); ol('#f1e3c0', 6); g.restore();
  if (o > 0.9) { txt('1 MACABEOS', 200, 0, 46, '#5a3b22', 0); txt('6 : 43-46', 200, 70, 42, '#7a2b2b', 0); for (let k = 0; k < 7; k++) line([[-360, 0 + k * 60], [-60, 0 + k * 60]], 5, 'rgba(90,59,34,0.45)'); line([[60, 150], [340, 150]], 5, 'rgba(90,59,34,0.45)'); }
  rr(380, 400, 60, 180, 8); ol('#f4efe2', 6); const fl = Math.sin(t * 12) * 6; g.beginPath(); g.moveTo(395, 400); g.quadraticCurveTo(405 + fl, 340, 410, 300); g.quadraticCurveTo(415 + fl, 340, 425, 400); g.closePath(); ol('#ffcf3a', 4); }); });
// P19 would you have gone under the elephant? (push into the shadow under the belly)
sh(19, 0, (t, u, lt) => { camPath([150, 600, 0.7], [150, 860, 1.9], u, easeIn); valley(t); L(1, () => { elephant(-60, 1150, 1.45, t, { royal: true, tower: true, crew: true, walk: 0.2 }); g.globalAlpha = 0.5; ell(150, 1150, 260, 40); ol('#000', 0); g.globalAlpha = 1; });
  screen(() => { const k = back(seg(lt, 0.2, 0.5)); g.save(); g.translate(W / 2, 420); g.scale(k, k); txt('¿TÚ TE HABRÍAS', 0, -60, 84, '#fff', 16); txt('METIDO AHÍ?', 0, 50, 96, '#ffd23f', 16); g.restore(); }); tag(seg(lt, 0.3, 0.6)); });
