// Franz Reichelt, Eiffel Tower, 4 Feb 1912 — Mal Final. Every set, prop and person drawn in the same flat-cartoon language.
import { K, W, H, OUT, clamp, lerp, ease, easeIn, easeOut, back, R, seg, ol, rr, circ, ell, line, poly, txt, L, screen, camTo, camPath, shakeAt, handheld,
  person, pose, mixPose, cloud, bird, tree, lamp, building, tower, filmCam, puff, speedLines, sky, wind } from './engine.js';
const TM = await (await fetch('timing.json')).json();
const PH = TM.phrases;
export const FRAMES = Math.ceil((PH[PH.length - 1].end + 1.4) * 30);
const g = K.g;
// ---------- cast ----------
const FRANZ_T = { skin: '#f0c39b', hair: '#3b2a1e', hairStyle: 'side', mustache: true, jacket: '#55606e', shirt: '#f3efe6', tie: '#8a2a2a', pants: '#3d3a36', shoes: '#1b1b1b', seed: 1 };
const FRANZ_S = { ...FRANZ_T, suit: true };
const FRIEND1 = { skin: '#eab48c', hair: '#5b3b26', hairStyle: 'side', hat: 'bowler', mustache: true, coat: '#3f5040', pants: '#2e2e33', shoes: '#1b1b1b', seed: 2 };
const FRIEND2 = { skin: '#d9a47e', hair: '#7a7a7a', hairStyle: 'bald', beard: true, coat: '#6a3b3b', pants: '#2e2e33', shoes: '#1b1b1b', seed: 3 };
const CHIEF = { skin: '#f2c9a6', hair: '#d8d8d8', hairStyle: 'bald', hat: 'kepi', mustache: true, jacket: '#2a3a6a', police: true, pants: '#1f2a4f', shoes: '#111', seed: 4 };
const COP = { ...CHIEF, hair: '#3b2a1e', seed: 9 };
const DUMMY = { skin: '#e2d2ab', hair: '#000', hairStyle: 'none', dummy: true, shirt: '#b3a281', pants: '#8a7d66', shoes: '#6b5a44', seed: 5 };
const DUMMY_S = { ...DUMMY, suit: true };
const CROWD = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({ skin: ['#f2c9a0', '#e0a97f', '#c98e62', '#f5d2b3', '#e8b98f', '#b97f58'][i % 6], hair: ['#2b1d14', '#5a3b22', '#141414', '#7a5a3a', '#999'][i % 5], hairStyle: ['side', 'bald', 'side', 'bun', 'curly'][i % 5],
  hat: ['bowler', 'top', 'cap', null, 'bowler'][i % 5], coat: ['#3a4250', '#5a4636', '#2f3b2f', '#6b2f3a', '#45405a'][i % 5], mustache: i % 3 === 0, pants: '#2a2a30', shoes: '#1b1b1b', seed: 20 + i }));
const CAMMAN = { skin: '#eab48c', hair: '#2b1d14', hairStyle: 'side', hat: 'cap', hatColor: '#5a4a3a', jacket: '#6b5a44', shirt: '#e8e2d4', pants: '#2a2a30', shoes: '#222', seed: 31 };
// ---------- shared scenery ----------
const SKYT = '#9cc0dc', SKYB = '#f4dcc0';
function clouds(t, y0 = -700, n = 5, sc = 1) { for (let i = 0; i < n; i++) cloud(((R(i) * 2600 + t * (20 + R(i + 1) * 25)) % 2600) - 1300, y0 + R(i + 3) * 380, (0.8 + R(i + 5) * 0.9) * sc); }
function birds(t, x0, y0, n = 5, s = 1, vx = 140) { for (let i = 0; i < n; i++) bird(x0 + t * vx + (R(i) - 0.5) * 260 * s, y0 + (R(i + 9) - 0.5) * 160 * s + Math.sin(t * 2 + i) * 12, 0.9 * s, t + i * 0.37); }
function skyline(y, s = 1, col = '#b9c6d3', seed = 1) { // far Paris silhouette
  g.save(); g.fillStyle = col; g.strokeStyle = 'rgba(40,40,60,0.35)'; g.lineWidth = 3;
  let x = -1700;
  while (x < 1700) { const w = (120 + R(x * 0.01 + seed) * 160) * s, h = (140 + R(x * 0.013 + seed) * 220) * s; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - h); g.lineTo(x + 18 * s, y - h - 40 * s); g.lineTo(x + w - 18 * s, y - h - 40 * s); g.lineTo(x + w, y - h); g.lineTo(x + w, y); g.closePath(); g.fill(); g.stroke();
    if (R(x + seed) > 0.5) { g.fillRect(x + w * 0.3, y - h - 70 * s, 16 * s, 34 * s); } x += w + 4; }
  g.beginPath(); g.arc(-520 * s, y - 330 * s, 90 * s, Math.PI, 0); g.fill(); g.stroke(); g.fillRect(-530 * s, y - 470 * s, 20 * s, 60 * s); g.fillRect(-640 * s, y - 330 * s, 240 * s, 330 * s);
  g.restore();
}
function ground(y, col = '#9fb27e', col2 = '#8aa06b') { g.fillStyle = col; g.fillRect(-3000, y, 6000, 3000); g.strokeStyle = OUT; g.lineWidth = 6; g.beginPath(); g.moveTo(-3000, y); g.lineTo(3000, y); g.stroke(); g.fillStyle = col2; for (let i = 0; i < 40; i++) { ell(-2400 + R(i) * 4800, y + 30 + R(i + 1) * 500, 60 + R(i + 2) * 120, 10 + R(i + 3) * 14); g.fill(); } }
function smoke(x, y, t, s = 1) { for (let k = 0; k < 5; k++) { const ph = (t * 0.25 + k / 5) % 1; g.globalAlpha = 0.6 * (1 - ph); circ(x + Math.sin(ph * 6 + k) * 20 * s + ph * 80 * s, y - ph * 220 * s, (12 + ph * 40) * s); ol('#eef0f2', 3); } g.globalAlpha = 1; }
function frost(t) { g.save(); for (let i = 0; i < 40; i++) { const x = ((R(i) * W * 1.4 + t * (80 + R(i + 2) * 120)) % (W * 1.4)) - W * 0.2, y = ((R(i + 5) * H + t * (60 + R(i + 3) * 60)) % H); g.globalAlpha = 0.5; circ(x, y, 3 + R(i + 7) * 4); g.fillStyle = '#fff'; g.fill(); } g.restore(); }
function vign(a = 0.35) { const gr = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(10,8,20,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
// interior of the tailor shop (world: floor at y=520)
function shop(t, o = {}) {
  L(0.85, () => {
    g.fillStyle = '#e7d3b0'; g.fillRect(-1400, -1400, 2800, 1920); g.fillStyle = '#dcc49c'; for (let x = -1400; x < 1400; x += 90) g.fillRect(x, -1400, 40, 1920);
    // window with rooftops + birds
    rr(-470, -620, 420, 560, 6); ol('#a9c9e0', 9); g.save(); rr(-470, -620, 420, 560, 6); g.clip(); sky(SKYT, SKYB, -620, -60); clouds(t * 2, -600, 2, 0.5); skyline(-90, 0.45, '#c7d2dc', 3); birds(t, -560 + ((t * 40) % 300), -430, 3, 0.7, 60); g.restore();
    line([[-260, -620], [-260, -60]], 8); line([[-470, -340], [-50, -340]], 8); rr(-500, -70, 480, 30, 4); ol('#8a6a4c');
    // shelves of fabric rolls
    rr(170, -620, 420, 22, 3); ol('#8a6a4c'); rr(170, -380, 420, 22, 3); ol('#8a6a4c');
    ['#7a3b3b', '#3b5a7a', '#5a7a3b', '#c9a24a', '#6b5a44', '#8a2a5a'].forEach((c, i) => { rr(190 + (i % 3) * 130, i < 3 ? -720 : -480, 110, 100, 40); ol(c); circ(245 + (i % 3) * 130, (i < 3 ? -670 : -430), 14); ol('#e8e2d4', 4); });
    // sign
    rr(-200, -880, 400, 110, 12); ol('#5a3d2c'); txt('TAILLEUR', 0, -825, 58, '#f3d58a', 0);
    g.fillStyle = '#8a6a4c'; g.fillRect(-1400, 520, 2800, 900); g.strokeStyle = 'rgba(60,40,25,0.4)'; g.lineWidth = 4; for (let x = -1400; x < 1400; x += 120) { g.beginPath(); g.moveTo(x, 520); g.lineTo(x - 200, 1400); g.stroke(); } line([[-1400, 520], [1400, 520]], 7);
  });
  if (o.machine !== false) L(0.95, () => sewing(330, 520, t, o.sew || 0));
  if (o.manikin) L(0.95, () => manikin(-560, 520));
}
function sewing(x, y, t, run) { // table + machine with moving needle
  rr(x - 190, y - 300, 380, 34, 6); ol('#7a5236'); for (const sx of [-1, 1]) { rr(x + sx * 160 - 12, y - 270, 24, 270, 4); ol('#3a3a3a'); }
  g.save(); g.translate(x, y - 300); rr(-120, -40, 240, 40, 8); ol('#1f1f24'); g.beginPath(); g.moveTo(-100, -40); g.lineTo(-100, -170); g.quadraticCurveTo(-100, -200, -60, -200); g.lineTo(90, -200); g.quadraticCurveTo(120, -200, 120, -170); g.lineTo(120, -120); g.lineTo(70, -120); g.lineTo(70, -150); g.lineTo(-50, -150); g.lineTo(-50, -40); g.closePath(); ol('#1f1f24');
  txt('REICHELT', 30, -175, 22, '#d9b25a', 0); circ(-100, -110, 34); ol('#4a4a52', 5);
  const ny = Math.sin(t * 30) * 12 * run; line([[95, -120], [95, -70 + ny]], 5, '#ccc');
  rr(-10 - (t * 60 * run) % 40, -52, 220, 14, 4); ol('#d9cdb0', 3); g.restore();
}
function manikin(x, y) { line([[x, y], [x, y - 360]], 10, '#5b4230'); for (const a of [-0.5, 0, 0.5]) line([[x, y - 20], [x + Math.sin(a) * 80, y]], 8, '#5b4230'); g.beginPath(); g.moveTo(x - 70, y - 600); g.quadraticCurveTo(x - 95, y - 470, x - 60, y - 360); g.lineTo(x + 60, y - 360); g.quadraticCurveTo(x + 95, y - 470, x + 70, y - 600); g.quadraticCurveTo(x, y - 640, x - 70, y - 600); ol('#d9cdb0'); circ(x, y - 640, 22); ol('#5b4230'); }
// Champ-de-Mars at the foot of the tower (ground y = 600), tower at x=0, s px/m
function champ(t, o = {}) {
  sky(o.skyT || SKYT, o.skyB || SKYB);
  L(0.05, () => { circ(380, -720, 70); ol('#fff4d8', 0); });
  L(0.12, () => clouds(t, -900, 6, 1.2));
  L(0.25, () => skyline(560, 1.1, '#c3cdd7', 2));
  L(o.tp ?? 0.6, () => tower(o.tx ?? 0, 600, o.ts ?? 9));
  L(0.75, () => { ground(600); for (let i = 0; i < 9; i++) tree(-1500 + i * 380 + (i > 3 ? 500 : 0), 610, 0.9 + R(i) * 0.4, i, t); });
}
function crowdRow(t, x0, y, n, h, sp, o = {}) {
  for (let i = 0; i < n; i++) { const d = CROWD[(i + (o.off || 0)) % CROWD.length], P = pose(o.pose ? o.pose(i) : (R(i + 3) > 0.7 ? 'point' : 'stand'), t + i * 0.37); person(x0 + i * sp + (R(i) - 0.5) * sp * 0.4, y + R(i + 2) * 20, h * (0.92 + R(i + 1) * 0.16), d, P, { expr: o.expr ? o.expr(i) : (R(i + 5) > 0.5 ? 'neutral' : 'talk'), talk: o.talk ?? R(i + 4) > 0.6, look: o.look ?? 0, breath: o.breath ?? true }, t, R(i + 6) > 0.5 && !o.noflip); }
}
// tower deck at 57 m seen from the side (deck floor y = 300 in world, rail at x = 250)
function deck(t, o = {}) {
  sky('#8fb6d6', '#f1d6bb');
  L(0.08, () => clouds(t * 1.5, -800, 5, 1.1));
  L(0.2, () => { skyline(900, 0.75, '#c9d3dc', 4); g.fillStyle = '#b7c4a2'; g.fillRect(-3000, 900, 6000, 2000); g.fillStyle = '#9fb0c4'; g.beginPath(); g.moveTo(-3000, 1050); g.quadraticCurveTo(0, 980, 3000, 1100); g.lineTo(3000, 1160); g.quadraticCurveTo(0, 1040, -3000, 1110); g.fill(); });
  L(0.5, () => { // section above the deck (beams going up)
    for (const x of [-900, 700]) { poly([[x, 300], [x + 160, 300], [x + 260, -1600], [x + 200, -1600]]); ol('#8b6a4c', 8); g.save(); poly([[x, 300], [x + 160, 300], [x + 260, -1600], [x + 200, -1600]]); g.clip(); for (let y = 300; y > -1600; y -= 160) { line([[x - 50, y], [x + 300, y - 160]], 5, '#6c5039'); line([[x + 300, y], [x - 50, y - 160]], 5, '#6c5039'); } g.restore(); }
  });
  L(1, () => { // deck floor + rail
    rr(-2000, 300, 4000, 70, 4); ol('#7a5a40', 8); for (let x = -2000; x < 2000; x += 120) { g.beginPath(); g.arc(x + 60, 370, 50, 0, Math.PI); g.strokeStyle = OUT; g.lineWidth = 6; g.stroke(); }
    rr(-2000, 370, 4000, 400, 0); ol('#6c5039', 0);
    if (o.rail !== false) { const rx = o.railX ?? 250; for (let y = 300; y > 120; y -= 60) {} rr(-2000, 110, rx + 2000 + 40, 18, 6); ol('#5b4230'); for (let x = -1980; x < rx + 40; x += 70) line([[x, 128], [x, 300]], 6, '#5b4230'); line([[rx + 40, 110], [rx + 40, 300]], 10, '#5b4230'); }
  });
}
// looking straight down from the deck: ground 57 m below, converging beams, tiny crowd
function downView(t, k = 0) {
  g.fillStyle = '#a9bb88'; g.fillRect(-2000, -2000, 4000, 4000);
  g.fillStyle = '#d8c9a5'; for (const a of [0.3, 1.1, 1.9, 2.7, 3.6, 4.5, 5.4]) { g.save(); g.rotate(a); g.fillRect(0, -26, 1600, 52); g.restore(); } circ(0, 0, 150); g.fillStyle = '#d8c9a5'; g.fill();
  for (let i = 0; i < 46; i++) { const a = R(i) * 6.28, r = 230 + R(i + 1) * 260; const x = Math.cos(a) * r, y = Math.sin(a) * r * 0.8 + 120; circ(x, y, 12); ol(CROWD[i % 10].coat, 3); circ(x, y - 4, 7); ol(CROWD[i % 10].hat ? '#222' : CROWD[i % 10].skin, 2); }
  filmCam(-160, 330, 0.18, t); filmCam(250, 250, 0.18, t);
  for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { poly([[x * 700, y * 1100], [x * 1300, y * 1100], [x * 260, y * 300], [x * 170, y * 260]]); ol('#8b6a4c', 8); }
}
// stairs inside the tower leg (scrolling lattice), y offset = climb
function stairs(t, climb) {
  sky('#9cc0dc', '#f4dcc0');
  L(0.15, () => { skyline(1200 + climb * 0.2, 0.9, '#c3cdd7', 5); });
  L(0.6, () => { g.save(); g.translate(0, climb * 0.6 % 400); for (let y = -1600; y < 1600; y += 400) { line([[-700, y], [700, y + 400]], 14, '#6c5039'); line([[700, y], [-700, y + 400]], 14, '#6c5039'); } g.restore(); for (const x of [-560, 560]) { rr(x - 40, -2000, 80, 4000, 0); ol('#8b6a4c', 8); } });
}
function blueprint(t, k) {
  g.fillStyle = '#2b5a8a'; g.fillRect(-900, -1300, 1800, 2600); g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 2; for (let x = -900; x < 900; x += 60) { g.beginPath(); g.moveTo(x, -1300); g.lineTo(x, 1300); g.stroke(); } for (let y = -1300; y < 1300; y += 60) { g.beginPath(); g.moveTo(-900, y); g.lineTo(900, y); g.stroke(); }
  txt('BREVET  N° 1912', 0, -620, 64, '#e8f2ff', 0);
}
// ---------- shot table ----------
const S = []; const sh = (p, a, fn, fast = 0) => S.push([p, a, fn, fast]);
const st = (p) => PH[p].start, en = (p) => PH[p].end;
function shotStart(i) { const [p, fa] = S[i]; if (fa > 0) return PH[p].start + (PH[p].end - PH[p].start) * fa; return p === 0 ? 0 : PH[p - 1].end + 0.03; }
let FX = { film: 0, dark: 0, flash: 0, sepia: 0, freeze: 0, red: 0 };

// P0a — the promise (prefecture office): chief nods, Franz with dummy winks
function office(t, o = {}) {
  g.fillStyle = '#cfd8c8'; g.fillRect(-2000, -2000, 4000, 4000); g.fillStyle = '#c2cdb9'; for (let x = -2000; x < 2000; x += 100) g.fillRect(x, -2000, 46, 2600);
  rr(-260, -800, 520, 360, 10); ol('#e9dfc8', 9); txt('PRÉFECTURE', 0, -720, 52, '#2a3a6a', 0); txt('DE POLICE', 0, -650, 52, '#2a3a6a', 0); circ(0, -540, 50); ol('#c9a24a', 6);
  g.fillStyle = '#7a5a40'; g.fillRect(-2000, 560, 4000, 2000); line([[-2000, 560], [2000, 560]], 7);
}
function desk(x, y) { rr(x - 330, y - 260, 660, 40, 6); ol('#6b4a32'); rr(x - 310, y - 220, 620, 220, 6); ol('#5b3e2a'); rr(x - 120, y - 300, 240, 40, 3); ol('#f4efe2', 5); }
sh(0, 0, (t, u, lt) => {
  camPath([60, 40, 1.25], [0, 0, 1.12], u); handheld(t, 4);
  L(0.7, () => office(t)); L(1, () => { person(-180, 560, 690, CHIEF, pose('stand', t), { expr: lt > 0.6 ? 'smile' : 'neutral', look: 0.6 }, t); desk(-150, 560); });
  L(1.15, () => person(300, 700, 760, FRANZ_T, pose('carry', t), { expr: lt > 0.9 ? 'smug' : 'happy', look: -0.6, hold: (hR, hL) => {} }, t, true));
  L(1.15, () => { person(160, 690, 520, DUMMY, pose('stand', t, { lean: 0.18, armL: 0.5, armR: -0.4 }), {}, t, true); });
});
// P0b — he leaps from the tower himself (flash-forward)
sh(0, 0.52, (t, u, lt) => {
  const j = seg(lt, 0.35, 0.6); const y = 300 - Math.sin(Math.min(1, j) * Math.PI * 0.7) * 260 + Math.max(0, lt - 0.55) ** 2 * 1800; const x = 160 + j * 300 + Math.max(0, lt - 0.55) * 200;
  camTo(lerp(140, x, 0.8), lerp(40, y - 200, ease(seg(lt, 0.3, 1.0))), 1.3); shakeAt(t, t - lt + 0.5, 22);
  deck(t); L(1, () => { const P = lt < 0.35 ? pose('crouch', t) : pose('leap', t);
    person(x, y, 520, FRANZ_S, P, { expr: lt < 0.35 ? 'determined' : 'shock', wing: lt < 0.3 ? 0.4 : 1, breath: true, shadow: false }, t); });
  if (lt > 0.55) speedLines(t, 'v', 0.7);
}, 1);
// P1 — Paris 1912: crane down from the sky to the shop
sh(1, 0, (t, u, lt) => {
  camPath([0, -700, 0.9], [0, 220, 1.25], u);
  sky(SKYT, SKYB); L(0.05, () => { circ(-330, -760, 80); ol('#fff3d0', 0); }); L(0.1, () => clouds(t, -950, 6)); L(0.2, () => { birds(t, -700, -500, 6, 1.2, 120); });
  L(0.3, () => skyline(300, 1, '#c3cdd7', 1)); L(0.45, () => tower(420, 380, 2.6));
  L(0.65, () => { building(-1300, 700, 700, 760, { col: '#dccdb2' }); building(-560, 700, 520, 860, { col: '#e9dcc3' }); building(0, 700, 640, 700, { col: '#e3d3b8' }); building(680, 700, 600, 820, { col: '#e9dcc3' }); smoke(-450, -260, t); smoke(150, -100, t + 1); });
  L(1, () => { g.fillStyle = '#9a9a96'; g.fillRect(-2000, 1100, 4000, 1200); line([[-2000, 1100], [2000, 1100]], 7); building(-700, 1100, 1400, 560, { col: '#efe3cc', floors: 3, door: true, chim: false }); rr(-330, 450, 660, 110, 10); ol('#5a3d2c'); txt('F. REICHELT · TAILLEUR', 0, 505, 46, '#f3d58a', 0); lamp(-820, 1110, 1.3); lamp(820, 1110, 1.3);
    person(-420 + u * 300, 1110, 260, CROWD[1], pose('walk', t * 1.2), {}, t); person(560 - u * 200, 1110, 250, CROWD[4], pose('walk', t * 1.1 + 0.4), {}, t, true); });
  L(0.3, () => {}); screen(() => { const a = seg(lt, 0.2, 0.6) * (1 - seg(lt, 2.6, 3.0)); g.globalAlpha = a; txt('PARÍS · 1912', W / 2, 330, 96, '#fff', 14); g.globalAlpha = 1; });
});
sh(1, 0.55, (t, u, lt) => { // inside: Franz watches birds, flaps his arms
  camPath([-250, -100, 1.35], [-150, -60, 1.2], u); shop(t, { machine: false });
  L(1, () => { const flapA = lt > 0.6 ? Math.sin(t * 14) * 0.45 : 0; person(-80, 560, 760, FRANZ_T, lt > 0.6 ? pose('wings', t, { armL: 1.2 + flapA, armR: -1.2 - flapA }) : pose('stand', t), { expr: 'happy', look: -0.8 }, t); });
});
// P2 — invents the suit: sewing, then the reveal (wings open)
sh(2, 0, (t, u, lt) => { camPath([260, -60, 1.35], [240, -90, 1.5], u); shop(t, { sew: 1 }); L(1, () => person(110, 560, 720, FRANZ_T, pose('write', t, { armL: 0.8 + Math.sin(t * 9) * 0.1 }), { expr: 'determined', look: 0.8 }, t, false)); });
sh(2, 0.42, (t, u, lt) => {
  const k = back(seg(lt, 0.25, 0.85)); camPath([0, 0, 1.05], [0, -40, 1.18], u); shop(t, { manikin: true });
  L(1, () => { rr(-220, 520, 440, 50, 8); ol('#8a2a2a'); person(0, 520, 780, FRANZ_S, mixPose(pose('stand', t), pose('wings', t), k), { expr: k > 0.5 ? 'grin' : 'determined', wing: k }, t); });
  screen(() => { if (lt > 0.3 && lt < 1.4) for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28 + lt, r = 300 + (lt - 0.3) * 400; g.globalAlpha = clamp(1.3 - lt); txt('✦', W / 2 + Math.cos(a) * r, H / 2 - 80 + Math.sin(a) * r * 0.8, 60, '#ffe14d', 6); } g.globalAlpha = 1; });
});
// P3 — dummy tests from his 5th-floor window: one floats, one plummets
function facade(t) { sky(SKYT, SKYB); L(0.1, () => clouds(t, -900, 5)); L(0.25, () => skyline(700, 1, '#c3cdd7', 6));
  L(1, () => { building(-520, 900, 1040, 1500, { floors: 5, col: '#e9dcc3' }); g.fillStyle = '#9a9a96'; g.fillRect(-2000, 900, 4000, 1600); line([[-2000, 900], [2000, 900]], 7); rr(-180, -470, 160, 200, 6); ol('#2b2b38', 6); }); }
sh(3, 0, (t, u, lt) => {
  const d = Math.max(0, lt - 0.7), y = -300 + d * 260 + Math.sin(d * 3) * 10, x = -90 + Math.sin(d * 2.2) * 60;
  camPath([-100, -300, 1.15], [-60, Math.min(560, y), 1.0], seg(lt, 0.6, 2.4)); facade(t);
  L(1, () => { person(-100, -270, 230, FRANZ_T, lt < 0.7 ? pose('carry', t) : pose('clap', t), { expr: lt < 0.7 ? 'determined' : 'grin', look: 0.4 }, t);
    if (lt > 0.5) person(x, Math.min(900, y + 160), 170, DUMMY_S, pose('wings', t), { wing: 1, flap: 0.6, shadow: false }, t); else person(-60, -280, 130, DUMMY_S, pose('stand', t), {}, t); });
});
sh(3, 0.55, (t, u, lt) => {
  const d = Math.max(0, lt - 0.45), y = -110 + 0.5 * 3200 * d * d, hit = -110 + 0.5 * 3200 * d * d > 900; const tHit = Math.sqrt(1010 * 2 / 3200) + 0.45;
  camPath([-60, -200, 1.1], [-40, 760, 1.6], seg(lt, 0.4, tHit)); shakeAt(t, t - lt + tHit, 26); facade(t);
  L(1, () => { if (!hit) person(-80, y, 150, DUMMY_S, pose('fall', t), { wing: 0.25, shadow: false }, t); else { const k = (lt - tHit); puff(-80, 900, 1, k / 0.9); person(-60, 900, 150, { ...DUMMY_S, hairStyle: 'none' }, pose('sit', t, { lean: 0.8 }), {}, t);
      g.save(); g.translate(60 + k * 380, 880 - Math.abs(Math.sin(k * 9)) * 90 * Math.exp(-k * 2)); g.rotate(k * 9); circ(0, 0, 24); ol(DUMMY.skin); line([[-8, -8], [8, 8]], 4); g.restore(); }
    if (lt > tHit + 0.1) person(-100, -270, 230, FRANZ_T, pose('cover', t), { expr: 'sad' }, t); else person(-100, -270, 230, FRANZ_T, pose('shock', t), { expr: 'shock' }, t); });
}, 1);
// P4 — he jumps from 10 m himself, breaks a leg
function field(t) { sky(SKYT, SKYB); L(0.1, () => clouds(t, -900, 5)); L(0.3, () => { skyline(700, 0.8, '#ccd5dd', 8); }); L(0.6, () => { ground(760, '#a5b784', '#93a674'); for (let i = 0; i < 6; i++) tree(-1300 + i * 520, 770, 0.8, i + 10, t); });
  L(1, () => { ground(900, '#9fb27e', '#8aa06b'); for (const x of [-60, 140]) { line([[x, 900], [x + 20, -100]], 16, '#7a5a40'); } for (let y = 800; y > -100; y -= 120) line([[-50, y], [150, y - 100]], 8, '#7a5a40'); rr(-120, -120, 340, 40, 6); ol('#8a6a4c');
    line([[330, 900], [330, -100]], 6, '#fff'); for (let k = 0; k <= 10; k++) line([[315, 900 - k * 100], [345, 900 - k * 100]], 5, '#fff'); txt('10 m', 420, -100, 60, '#fff', 10); }); }
sh(4, 0, (t, u, lt) => {
  const j = seg(lt, 0.5, 0.75), d = Math.max(0, lt - 0.7), y = -120 + 0.5 * 2800 * d * d; const tHit = 0.7 + Math.sqrt(1020 * 2 / 2800);
  camPath([60, -200, 1.0], [160, 500, 0.85], seg(lt, 0.4, tHit)); shakeAt(t, t - lt + tHit, 40); field(t);
  L(1, () => { if (lt < 0.7) person(60 + j * 120, -120, 300, FRANZ_S, lt < 0.5 ? pose('crouch', t) : pose('leap', t), { expr: 'determined', wing: 1 }, t);
    else if (lt < tHit) person(180 + d * 100, y, 300, FRANZ_S, pose('wings', t), { wing: 0.8, expr: 'scared', shadow: false }, t);
    else { const k = lt - tHit; person(280, 900, 300, FRANZ_S, pose('sit', t, { lean: -0.2 }), { expr: 'pain', wing: 0.3 }, t); puff(280, 900, 1.2, k / 0.8);
      if (k < 1.2) { g.save(); g.globalAlpha = clamp(1.5 - k); txt('¡CRACK!', 300, 560 - k * 60, 110 + k * 30, '#ffe14d', 14); g.restore(); }
      for (let i = 0; i < 3; i++) { const a = t * 5 + i * 2.1; txt('★', 280 + Math.cos(a) * 120, 560 + Math.sin(a) * 30, 54, '#ffe14d', 6); } } });
}, 1);
sh(4, 0.72, (t, u, lt) => { camPath([0, 0, 1.25], [0, -40, 1.12], u); shop(t, { machine: false });
  L(1, () => { line([[-300, 560], [-250, 180]], 12, '#8a6a4c'); line([[300, 560], [260, 180]], 12, '#8a6a4c'); person(0, 560, 760, FRANZ_T, pose('stand', t, { legR: -0.15, armL: 0.4, armR: -0.4 }), { expr: 'sad' }, t); rr(30, 380, 90, 180, 30); ol('#fbfbfb', 7); txt('✚', 75, 450, 40, '#d33', 0); });
});
// P5 — the theory: chalkboard drawing
function board(t, k1, k2) {
  rr(-460, -820, 920, 640, 14); ol('#2e3f35', 12); g.strokeStyle = '#f2f2ea'; g.lineWidth = 8; g.lineCap = 'round';
  const draw = (pts, k) => { if (k <= 0) return; g.beginPath(); g.moveTo(...pts[0]); const n = Math.max(1, Math.floor((pts.length - 1) * k)); for (let i = 1; i <= n; i++) g.lineTo(...pts[i]); g.stroke(); };
  draw([[-380, -260], [-380, -420], [-280, -420], [-280, -260]], k1); draw([[-330, -420], [-330, -520], [-330, -540]], k1); if (k1 > 0.8) { txt('✗', -230, -560, 90, '#ff6b6b', 0); txt('10 m', -330, -230, 40, '#f2f2ea', 0); }
  const tw = [[60, -230], [150, -480], [175, -760], [200, -480], [290, -230]]; draw(tw, k2); if (k2 > 0.6) { draw([[100, -340], [250, -340]], 1); } if (k2 > 0.85) { txt('✓', 330, -700, 90, '#7dff9b', 0); txt('57 m', 175, -200, 40, '#f2f2ea', 0); }
}
sh(5, 0, (t, u, lt) => { camPath([-20, -180, 1.0], [-40, -160, 0.92], u); shop(t, { machine: false });
  L(1, () => { g.save(); g.translate(120, 0); board(t, seg(u, 0.05, 0.4), seg(u, 0.5, 0.9)); g.restore(); person(-390, 640, 720, FRANZ_T, pose(u > 0.45 ? 'point' : 'think', t, u > 0.45 ? { armR: -2.1 } : {}), { expr: u > 0.5 ? 'grin' : 'determined', look: 0.8 }, t, true); line([[-270, 640], [-300, 340]], 12, '#8a6a4c'); });
});
// P6 — asks permission (dummy!) -> STAMP
sh(6, 0, (t, u, lt) => {
  const sk = seg(lt, 1.6, 1.75); camPath([0, -80, 1.05], [0, 120, 1.35], seg(lt, 0, 1.7)); shakeAt(t, t - lt + 1.75, 34);
  L(0.7, () => office(t)); L(1, () => { person(-150, 560, 660, CHIEF, pose('stamp', t, { armR: lerp(-2.3, -0.9, easeIn(sk)) }), { expr: lt < 1.0 ? 'worried' : 'neutral', look: 0.5 }, t); desk(-110, 560);
    if (lt > 1.75) { g.save(); g.translate(-120, 290); g.rotate(-0.12); rr(-150, -40, 300, 80, 8); g.strokeStyle = '#c0392b'; g.lineWidth = 8; g.stroke(); txt('AUTORISÉ', 0, 2, 50, '#c0392b', 0); g.restore(); } });
  L(1.15, () => { person(330, 700, 740, FRANZ_T, pose('plead', t), { expr: lt > 1.8 ? 'grin' : 'talk', talk: lt < 1.6, look: -0.7 }, t, true); person(150, 690, 500, DUMMY, pose('stand', t, { lean: 0.15, armL: 0.5 }), {}, t, true); });
});
// P7 — 4 Feb, 8 a.m., cold and windy: tilt up the tower
sh(7, 0, (t, u, lt) => {
  camPath([0, 380, 1.0], [0, -1200, 0.62], u); champ(t, { skyT: '#a5bfd6', skyB: '#f0d2b8', ts: 10 });
  L(1, () => { lamp(-380, 620, 1.6); g.save(); g.translate(-380, 140); circ(0, 0, 70); ol('#fbf7ea', 7); line([[0, 0], [0, -52]], 7); line([[0, 0], [40, 0]], 7); g.restore(); });
  L(0.95, () => { for (let i = 0; i < 6; i++) { const x = ((R(i) * 2000 + t * 600) % 2400) - 1200, y = 300 + R(i + 1) * 300 + Math.sin(t * 4 + i) * 30; g.save(); g.translate(x, y); g.rotate(t * 3 + i); rr(-30, -20, 60, 40, 4); ol('#efe8d6', 4); g.restore(); } });
  screen(() => { wind(t, 12, 1); frost(t); const a = seg(lt, 0.2, 0.6); g.globalAlpha = a * (1 - seg(lt, 3.2, 3.6)); rr(W / 2 - 230, 230, 460, 300, 16); ol('#fbf7ea', 10); rr(W / 2 - 230, 230, 460, 90, 16); ol('#c0392b', 10); txt('FÉVRIER 1912', W / 2, 275, 46, '#fff', 0); txt('4', W / 2, 425, 150, OUT, 0); g.globalAlpha = 1; });
});
// P8 — journalists, cameras, onlookers... but no dummy
sh(8, 0, (t, u, lt) => {
  camPath([0, 380, 1.4], [0, 330, 1.2], u); champ(t, { ts: 9, tp: 0.55 });
  L(0.9, () => { crowdRow(t, -1100, 640, 9, 230, 260, { off: 3 }); });
  L(1, () => { filmCam(-300, 760, 0.9, t); person(-470, 760, 300, CAMMAN, pose('crank', t), { expr: 'neutral', breath: true }, t); filmCam(380, 780, 0.9, t + 1); person(540, 780, 300, CAMMAN, pose('crank', t + 0.5), { expr: 'neutral', breath: true }, t, true);
    for (let i = 0; i < 3; i++) person(lerp(-900 + i * 140, -60 + i * 150, easeOut(seg(lt, 0, 1.6))), 800, 330, CROWD[i * 3], pose(lt < 1.6 ? 'walk' : 'write', t + i * 0.3), { expr: 'talk', talk: true, breath: true }, t); });
});
sh(8, 0.62, (t, u, lt) => { // the empty spot: everyone looks around
  camPath([0, 300, 1.6], [0, 300, 1.75], u); champ(t, { ts: 9, tp: 0.55 });
  L(1, () => { rr(-130, 760, 260, 30, 10); ol('rgba(0,0,0,0.12)', 0); crowdRow(t, -560, 820, 5, 300, 280, { pose: () => 'stand', expr: () => 'worried', look: Math.sin(t * 2.5) }); for (let i = 0; i < 3; i++) txt('?', -400 + i * 400, 380 + Math.sin(t * 5 + i) * 14, 120, '#ffe14d', 12); });
});
// P9 — he puts the suit on; friends beg him not to
sh(9, 0, (t, u, lt) => {
  const k = seg(lt, 0.2, 1.0); camPath([0, 250, 1.5], [0, 200, 1.35], u); champ(t, { ts: 9, tp: 0.55 });
  L(1, () => { const sp = Math.sin(k * Math.PI * 4) ; g.save(); g.translate(0, 0); person(0, 820, 620 * (1 - Math.abs(sp) * 0.06), k < 0.5 ? FRANZ_T : FRANZ_S, pose('wings', t, { armL: 1.45 * k, armR: -1.45 * k }), { expr: 'determined', wing: k > 0.5 ? k : 0, breath: true }, t, sp < 0); g.restore();
    if (k > 0 && k < 1) for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28 + t * 6; circ(Math.cos(a) * 260, 520 + Math.sin(a) * 160, 14); ol('#fbf7ea', 4); } });
});
sh(9, 0.45, (t, u, lt) => {
  camPath([-120, 260, 1.45], [-40, 260, 1.3], u); champ(t, { ts: 9, tp: 0.55 });
  L(1, () => { person(330, 830, 620, FRANZ_S, pose('proud', t), { expr: 'determined', wing: 0.25, look: -0.5, breath: true }, t, true); person(-80, 840, 560, FRIEND1, pose('plead', t, { kneeL: 1.4, kneeR: 1.4, legL: -1.2, legR: -1.2, bob: -60 }), { expr: 'worried', talk: true, look: 0.8, breath: true }, t); person(-380, 820, 600, FRIEND2, pose('plead', t + 0.4), { expr: 'worried', talk: true, look: 0.8, breath: true }, t); });
});
// P10 — safety rope offered: NO
sh(10, 0, (t, u, lt) => {
  const push = seg(lt, 1.6, 1.9); camPath([60, 240, 1.55], [100, 240, 1.75], u); champ(t, { ts: 9, tp: 0.55 });
  L(1, () => { person(-260, 830, 620, FRIEND1, pose('carry', t, { armL: lerp(1.1, 0.5, push), armR: lerp(-1.1, -0.5, push) }), { expr: lt > 1.6 ? 'sad' : 'talk', talk: lt < 1.6, look: 0.8, breath: true }, t);
    const rx = lerp(-120, -170, push), ry = lerp(560, 760, easeIn(push)); for (let i = 0; i < 4; i++) { ell(rx, ry - i * 10, 70 - i * 4, 26); g.strokeStyle = '#d8c8a0'; g.lineWidth = 12; g.stroke(); }
    person(250, 830, 620, FRANZ_S, lt > 0.8 ? pose('no', t) : pose('proud', t), { expr: 'determined', wing: 0.25, look: -0.6, breath: true }, t, true);
    if (lt > 0.9) { g.globalAlpha = seg(lt, 0.9, 1.1); txt('NO', 300, 120, 130, '#ff5a5a', 14); g.globalAlpha = 1; } });
});
// P11 — climbs to the first floor: 57 m counter
sh(11, 0, (t, u, lt) => {
  const climb = u * 2600; camTo(0, 0, 1); stairs(t, climb);
  L(1, () => { for (let y = -1400; y < 1400; y += 120) { const yy = ((y + climb) % 2400 + 2400) % 2400 - 1200; rr(-260 + (yy * 0.3), yy, 200, 24, 4); ol('#7a5a40', 5); } person(-60, 360, 560, FRANZ_S, pose('climb', t * 1.3), { expr: 'determined', wing: 0.2, breath: true }, t); });
  screen(() => { rr(W - 340, 210, 280, 140, 18); ol('rgba(20,20,30,0.75)', 6); txt(`${Math.round(57 * ease(u))} m`, W - 200, 280, 86, '#ffe14d', 0); });
});
// P12 — foot on the rail, 40 seconds
sh(12, 0, (t, u, lt) => {
  camPath([60, 120, 1.25], [180, 60, 1.55], u, (x) => x); deck(t);
  L(1, () => person(330, 300, 470, FRANZ_S, pose('rail', t, { legR: lerp(0, -1.25, seg(lt, 0.2, 0.9)), kneeR: lerp(0, 1.35, seg(lt, 0.2, 0.9)) }), { expr: 'determined', wing: 0.75, look: 0.5, flap: 1.2, breath: true }, t, false));
  screen(() => wind(t, 8, 0.8));
});
sh(12, 0.55, (t, u, lt) => { // view down + 40 s clock
  const z = 1.0 + u * 0.3; camTo(0, 0, z, Math.sin(t * 0.8) * 0.03); L(1, () => downView(t)); screen(() => {
    const sec = Math.max(0, 40 - Math.floor(lt / ((en(12) - st(12)) * 0.45) * 40)); circ(W / 2, 330, 120); ol('rgba(20,20,30,0.8)', 8); g.beginPath(); g.moveTo(W / 2, 330); g.arc(W / 2, 330, 110, -Math.PI / 2, -Math.PI / 2 + (sec / 40) * Math.PI * 2); g.closePath(); g.fillStyle = '#e74c3c'; g.fill(); txt(`${sec}`, W / 2, 330, 96, '#fff', 10);
    const hb = Math.max(0, Math.sin(t * 8)) ** 8; g.fillStyle = `rgba(160,0,0,${0.18 * hb})`; g.fillRect(0, 0, W, H); });
});
// P13 — "Y salta."
sh(13, 0, (t, u, lt) => {
  const j = seg(lt, 0.25, 0.55); const x = 330 + j * 260 + Math.max(0, lt - 0.55) * 300, y = 300 - Math.sin(j * Math.PI * 0.6) * 200 + Math.max(0, lt - 0.5) ** 2 * 2400;
  camTo(lerp(250, x, seg(lt, 0.2, 0.6) * 0.9), lerp(60, y - 180, seg(lt, 0.4, 0.9)), lerp(1.45, 1.15, seg(lt, 0, 0.8))); deck(t);
  L(1, () => { person(x, y, 470, FRANZ_S, lt < 0.25 ? pose('crouch', t) : pose('leap', t), { expr: lt < 0.3 ? 'determined' : 'shock', wing: 1, shadow: false }, t); });
  if (lt > 0.5) screen(() => speedLines(t, 'v', 0.6));
}, 1);
// P14 — half-open, wraps around him (follow cam on the fall)
function fallBg(t, y) {
  sky('#8fb6d6', '#f1d6bb'); L(0.1, () => clouds(0, -900 - y * 0.15, 4, 1));
  L(0.2, () => { g.save(); g.translate(0, -y * 0.12); skyline(1400, 0.9, '#c9d3dc', 7); g.fillStyle = '#b7c4a2'; g.fillRect(-3000, 1400, 6000, 3000); g.restore(); });
  L(0.9, () => { // the tower leg rushing past on the left (big lattice)
    const off = (y * 0.55) % 520; const x0 = -1100, x1 = -230;
    poly([[x0, -2400], [x1, -2400], [x1, 2400], [x0, 2400]]); ol('#8b6a4c', 10);
    g.save(); poly([[x0, -2400], [x1, -2400], [x1, 2400], [x0, 2400]]); g.clip();
    for (let k = -6; k < 8; k++) { const yy = k * 520 - off; line([[x0, yy], [x1, yy + 520]], 18, '#6c5039'); line([[x1, yy], [x0, yy + 520]], 18, '#6c5039'); line([[x0, yy], [x1, yy]], 22, '#5b4230'); }
    g.restore(); line([[x1, -2400], [x1, 2400]], 14);
  });
}
sh(14, 0, (t, u, lt) => {
  const y = lt * 2200 + lt * lt * 600; camTo(0, 0, 1.0, Math.sin(t * 3) * 0.04); handheld(t * 3, 10); fallBg(t, y);
  const c = seg(u, 0.05, 0.3), wr = seg(u, 0.45, 0.85);
  L(1, () => person(170 + Math.sin(t * 4) * 30, 300, 560, FRANZ_S, wr > 0.3 ? pose('wrap', t, { lean: Math.sin(t * 5) * 0.25 * wr }) : pose('fall', t), { expr: wr > 0.2 ? 'closed' : 'scared', canopy: c * 0.75 * (1 - wr), half: 1, wing: 1 - wr, wrap: wr, flap: 2, shadow: false }, t));
  screen(() => speedLines(t, 'v', 1));
}, 1);
// P15 — falls in seconds: wide from the ground, cut before the impact, crowd reaction
sh(15, 0, (t, u, lt) => {
  camPath([140, -120, 0.55], [140, 240, 0.62], u); champ(t, { ts: 9, tp: 0.6 });
  L(0.6, () => { const dd = Math.min(lt, 1.1); const y = -40 + 0.5 * 9.8 * 9 * dd * dd * 4.2; if (lt < 1.05) { person(150, y, 60, FRANZ_S, pose('wrap', t), { wrap: 1, shadow: false }, t); } });
  L(0.9, () => crowdRow(t, -1100, 640, 9, 230, 260, { off: 3, pose: () => 'shock', expr: () => 'shock' }));
}, 1);
sh(15, 0.55, (t, u, lt) => {
  camPath([0, 300, 1.7], [0, 320, 1.9], u); shakeAt(t, t - lt + 0.05, 18); FX.sepia = 0.6; champ(t, { ts: 9, tp: 0.55 });
  L(0.65, () => puff(140, 600, 2.2, lt / 1.6));
  L(1, () => { person(-280, 840, 600, FRIEND1, pose('cover', t), { expr: 'closed' }, t); person(230, 830, 620, FRIEND2, pose('shock', t), { expr: 'shock' }, t, true); g.save(); g.translate(lerp(700, 380, easeOut(seg(lt, 0.3, 1.3))), 840 - Math.abs(Math.sin(lt * 7)) * 40 * Math.exp(-lt)); g.rotate(-lt * 4); ell(0, 0, 60, 14); ol('#2b2b2b'); g.beginPath(); g.arc(0, -8, 38, Math.PI, 0); g.closePath(); ol('#2b2b2b'); g.restore(); });
});
// P16 — two cameras filmed it all (old film replay)
sh(16, 0, (t, u, lt) => { camPath([-60, 0, 1.6], [-20, -20, 2.0], u); champ(t, { ts: 9, tp: 0.55 }); L(1, () => { filmCam(-40, 700, 2.0, t); person(380, 740, 640, CAMMAN, pose('crank', t), { expr: 'scared', sweat: true }, t, true); }); });
sh(16, 0.5, (t, u, lt) => { FX.film = 1; camPath([120, -300, 0.6], [120, 0, 0.6], u); champ(t, { ts: 9, tp: 0.6, skyT: '#ddd', skyB: '#bbb' });
  L(0.6, () => { const yy = -60 + (u * 1.3 % 1) * 620; person(150, yy, 60, FRANZ_S, pose('wrap', t), { wrap: 1, shadow: false }, t); }); L(0.9, () => crowdRow(t, -1100, 640, 9, 230, 260, { off: 3, pose: () => 'stand' })); });
// P17 — wanted to prove it worked... proved the opposite
sh(17, 0, (t, u, lt) => {
  camPath([0, 0, 1.0], [0, -40, 1.12], u); L(1, () => blueprint(t));
  L(1, () => { g.save(); g.globalAlpha = 0.95; person(0, 300, 760, { ...FRANZ_S, skin: '#cfe3f5', hair: '#cfe3f5', pants: '#2b5a8a', shoes: '#2b5a8a' }, pose('wings', t), { wing: 1, expr: 'neutral', shadow: false }, t); g.restore();
    const k1 = seg(u, 0.1, 0.25), k2 = seg(u, 0.55, 0.62); if (k1 > 0 && k2 === 0) { g.globalAlpha = k1; txt('✓', 330, -380, 260, '#7dff9b', 16); g.globalAlpha = 1; }
    if (k2 > 0) { g.save(); g.translate(0, -100); g.scale(lerp(2.2, 1, back(k2)), lerp(2.2, 1, back(k2))); g.rotate(-0.15); rr(-400, -110, 800, 220, 20); g.strokeStyle = '#e74c3c'; g.lineWidth = 18; g.stroke(); txt('ÉCHEC', 0, 6, 150, '#e74c3c', 0); g.restore(); } });
  if (u > 0.55) shakeAt(t, t - lt + (en(17) - st(17)) * 0.6, 26);
});
// P18 — if your friends tell you to use the dummy... use the dummy
sh(18, 0, (t, u, lt) => {
  camPath([0, 230, 1.35], [0, 260, 1.55], u); champ(t, { ts: 9, tp: 0.55 });
  L(1, () => { person(-330, 830, 600, FRIEND1, pose('point', t, { armR: -1.0 }), { expr: 'talk', talk: true, look: 0.6, breath: true }, t, true); person(330, 820, 600, FRIEND2, pose('proud', t), { expr: 'smug', look: -0.6, breath: true }, t, true);
    const wv = Math.sin(t * 9) * 0.5; person(0, 820, 470, DUMMY, pose('stand', t, { armR: -2.4 + wv, elbR: 0.4, armL: 0.3 }), {}, t); if (u > 0.55) { g.globalAlpha = seg(u, 0.55, 0.65); txt('👍', 160, 360, 120, '#fff', 0); g.globalAlpha = 1; } });
});
// P19 — would you have jumped? (POV, leaning over)
sh(19, 0, (t, u, lt) => {
  camTo(0, 0, 1.0 + u * 0.25, Math.sin(t * 0.7) * 0.04); L(1, () => downView(t));
  screen(() => { g.save(); g.translate(0, lerp(260, 0, ease(u))); rr(-40, 1560, W + 80, 34, 8); ol('#5b4230'); for (let x = 20; x < W; x += 90) line([[x, 1594], [x, 2000]], 12, '#5b4230'); for (const sx of [0.32, 0.68]) { g.save(); g.translate(W * sx, 1700); ell(0, 0, 90, 46); ol('#1b1b1b'); g.restore(); } g.restore(); wind(t, 6, 0.6); });
});

export function blurN(f) { return S[cur(f / 30)][3] ? 5 : 2; }
function cur(t) { let i = S.length - 1; for (let k = 0; k < S.length - 1; k++) if (t < shotStart(k + 1)) { i = k; break; } return i; }
export function frame(f, k) {
  FX = { film: 0, dark: 0, flash: 0, sepia: 0 };
  const t = f / 30, i = cur(t), a = shotStart(i), b = i + 1 < S.length ? shotStart(i + 1) : FRAMES / 30;
  const u = clamp((t - a) / Math.max(0.01, b - a)); S[i][2](t, u, Math.max(0, t - a));
  // quick whip-pan transition into the next shot (last 4 frames)
  const rem = (b - t) * 30; if (rem < 3 && i + 1 < S.length) { const kk = 1 - rem / 3; g.save(); g.fillStyle = `rgba(255,255,255,${0.25 * kk})`; g.fillRect(0, 0, W, H); g.restore(); }
  vign(0.32);
}
export function post(o, f, k) {
  if (FX.sepia) { o.save(); o.globalCompositeOperation = 'saturation'; o.fillStyle = `rgba(128,128,128,${FX.sepia})`; o.fillRect(0, 0, W, H); o.restore(); }
  if (FX.film) { o.save(); o.globalCompositeOperation = 'saturation'; o.fillStyle = '#808080'; o.fillRect(0, 0, W, H); o.globalCompositeOperation = 'multiply'; o.fillStyle = '#e8cf9e'; o.fillRect(0, 0, W, H); o.globalCompositeOperation = 'source-over';
    o.fillStyle = `rgba(255,240,210,${0.06 + 0.06 * R(f)})`; o.fillRect(0, 0, W, H); o.strokeStyle = 'rgba(40,30,20,0.5)'; o.lineWidth = 2; for (let i = 0; i < 3; i++) { const x = R(f * 3 + i) * W; o.beginPath(); o.moveTo(x, 0); o.lineTo(x + 10, H); o.stroke(); }
    o.fillStyle = '#111'; o.fillRect(0, 0, 70, H); o.fillRect(W - 70, 0, 70, H); o.fillStyle = '#e8e0cc'; const off = (f * 18) % 120; for (let y = -120; y < H; y += 120) { o.beginPath(); o.roundRect(18, y + off, 34, 60, 8); o.fill(); o.beginPath(); o.roundRect(W - 52, y + off, 34, 60, 8); o.fill(); } o.restore(); }
  // paper grain (shared across the whole video so it reads as one film)
  o.save(); o.globalAlpha = 0.05; for (let i = 0; i < 220; i++) { o.fillStyle = R(i + f) > 0.5 ? '#000' : '#fff'; o.fillRect(R(i * 3 + f) * W, R(i * 7 + f * 2) * H, 3, 3); } o.restore();
}
