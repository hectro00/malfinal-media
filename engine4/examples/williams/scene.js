// Tennessee Williams — Nueva York, 25 feb 1983: se ahogó con la tapita de un frasco de gotas que solía ponerse en la boca (engine4). Death never shown.
import { K, W, H, OUT, clamp, lerp, ease, easeIn, easeOut, back, R, seg, ol, rr, circ, ell, line, poly, txt, L, screen, camTo, camPath, shakeAt, handheld,
  person, pose, mixPose, cloud, bird, lamp, puff, speedLines, sky, wind } from './engine.js';
import { PH, st, en, dur, sh, fx, CROWD, crowdRow, vign } from './lib.js';
export { FRAMES, frame, post, blurN } from './lib.js';
const g = K.g;
// ---------- cast (own designs) ----------
const TOM = { skin: '#f0c8a4', hair: '#3a2a1e', hairStyle: 'side', mustache: true, jacket: '#e8e0cc', shirt: '#f6f2ea', tie: true, pants: '#d8ceb8', shoes: '#5a3d2c', seed: 1 };
const ROBE = { skin: '#f0c8a4', hair: '#3a2a1e', hairStyle: 'side', mustache: true, coat: '#7a2a3a', pants: '#5a1e2a', shoes: '#3a2a22', seed: 1 };
const ASIS = { skin: '#e0a97f', hair: '#5a3b22', hairStyle: 'curly', jacket: '#3a4a6a', shirt: '#eee', pants: '#2a2a30', shoes: '#1b1b1b', seed: 3 };
const NIGHT_T = '#141a33', NIGHT_B = '#3a3060';
// ---------- helpers ----------
function tag(a = 1) { screen(() => { g.globalAlpha = a; rr(40, 150, 470, 70, 16); ol('rgba(20,15,30,0.8)', 5); txt('MUERTES ABSURDAS #43', 275, 186, 34, '#ffd23f', 0); g.globalAlpha = 1; }); }
function popText(s1, y, lt, t0 = 0, col = '#fff', size = 90) { const k = back(seg(lt, t0, t0 + 0.25)); if (k <= 0) return; screen(() => { g.save(); g.translate(W / 2, y); g.scale(k, k); txt(s1, 0, 0, size, col, 16); g.restore(); }); }
function card(s1, s2, a, y = 330) { if (a <= 0) return; screen(() => { g.globalAlpha = a; rr(130, y - 80, 820, 160, 24); ol('#fbf7ea', 6); txt(s1, W / 2, y - 22, 60, '#3a2a40', 0); if (s2) txt(s2, W / 2, y + 42, 38, '#8a5a3a', 0, 'center', '700'); g.globalAlpha = 1; }); }
function tint(c, a) { if (a <= 0) return; screen(() => { g.fillStyle = c; g.globalAlpha = a; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }); }
// world position of a person's mouth (feet x,y; height h; lean, head tilt; flip)
function mouth(x, y, h, P, flip = false) { const k = h / 300, tl = P.tilt || 0, la = P.lean || 0; let mx = -23 * Math.sin(tl), my = -226 + 23 * Math.cos(tl) - (P.bob || 0) * 0.3; const rx = mx * Math.cos(la) - my * Math.sin(la), ry = mx * Math.sin(la) + my * Math.cos(la); return [x + (flip ? -1 : 1) * rx * k, y + ry * k - (P.jump || 0) * h / 300]; }
function cap(x, y, s, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); rr(-14, -12, 28, 24, 5); ol('#f4f4f8', 4); line([[-8, -12], [-8, 12]], 2, '#c8c8d4'); line([[0, -12], [0, 12]], 2, '#c8c8d4'); line([[8, -12], [8, 12]], 2, '#c8c8d4'); g.restore(); }
function bottle(x, y, s, open = true, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); rr(-26, -70, 52, 80, 10); ol('#d8eef8', 5); rr(-22, -30, 44, 30, 4); ol('#fff', 3); txt('GOTAS', 0, -15, 13, '#2a5a8a', 0); poly([[-12, -70], [12, -70], [5, -96], [-5, -96]]); ol('#e8f2f8', 4); if (!open) { rr(-14, -112, 28, 26, 5); ol('#f4f4f8', 4); } g.restore(); }
function drop(x, y, s) { g.beginPath(); g.moveTo(x, y - 18 * s); g.quadraticCurveTo(x + 12 * s, y, x, y + 8 * s); g.quadraticCurveTo(x - 12 * s, y, x, y - 18 * s); ol('#7fd0ff', 3); }
const HOLD = (rot = 0, open = true) => (hR) => bottle(hR[0], hR[1] - 6, 0.9, open, rot);
// hotel room (night by default). armchair at x=0, floor y=960
function room(t, o = {}) {
  const day = o.day || 0;
  g.fillStyle = day ? '#e8d8b8' : '#3a2e3e'; g.fillRect(0, 0, W, H);
  L(0.5, () => { // wallpaper stripes + window with city
    for (let i = -12; i < 12; i++) { g.fillStyle = (i % 2 ? (day ? '#e2cfa8' : '#352a3a') : (day ? '#ecdcbc' : '#3e3244')); g.fillRect(i * 120, -1600, 60, 3200); }
    rr(150, -420, 620, 820, 10); ol(day ? '#a8d0ec' : '#1a2246', 9);
    g.save(); rr(150, -420, 620, 820, 10); g.clip();
    for (let i = 0; i < 9; i++) { const bx = 150 + i * 72, bh = 300 + R(i) * 450; rr(bx, 400 - bh, 66, bh, 2); ol(day ? '#8aa0b8' : '#20284a', 3); for (let f = 0; f < bh / 40 - 1; f++) for (let j = 0; j < 2; j++) if (!day && R(i * 31 + f * 7 + j) > 0.55) { g.fillStyle = '#ffe08a'; g.fillRect(bx + 12 + j * 26, 400 - bh + 16 + f * 40, 14, 18); } }
    if (!day) { circ(640, -300, 46); ol('#fff6d8', 0); }
    g.restore(); line([[460, -420], [460, 400]], 8); line([[150, -10], [770, -10]], 8);
    poly([[100, -470], [230, -470], [200, 460], [90, 460]]); ol('#7a2a3a', 6); poly([[820, -470], [690, -470], [720, 460], [830, 460]]); ol('#7a2a3a', 6);
    rr(-900, -300, 340, 260, 8); ol('#c9a24a', 7); rr(-880, -280, 300, 220, 4); ol('#5a7a6a', 4); poly([[-860, -80], [-760, -220], [-660, -110], [-600, -170]]); line([[-860, -80], [-760, -220], [-660, -110], [-600, -170]], 5, '#2a3a2a');
  });
  L(1, () => {
    g.fillStyle = day ? '#8a5a3a' : '#4a2e2a'; g.fillRect(-3000, 960, 6000, 1600); line([[-3000, 960], [3000, 960]], 7);
    ell(0, 1120, 700, 90); ol(day ? '#a83a3a' : '#5a2030', 6);
    // side table + lamp (right)
    rr(330, 740, 200, 26, 6); ol('#6b4a2e', 6); rr(360, 766, 20, 194, 4); ol('#6b4a2e', 5); rr(480, 766, 20, 194, 4); ol('#6b4a2e', 5);
    const on = o.lamp ?? 1; rr(420, 600, 20, 140, 4); ol('#c9a24a', 4); poly([[370, 600], [490, 600], [460, 520], [400, 520]]); ol(on > 0.5 ? '#ffe9a8' : '#8a7a5a', 5);
    if (on > 0.5) { const gl = g.createRadialGradient(430, 580, 10, 430, 580, 520); gl.addColorStop(0, 'rgba(255,220,140,0.35)'); gl.addColorStop(1, 'rgba(255,220,140,0)'); g.fillStyle = gl; g.fillRect(-200, 100, 1300, 1100); }
    if (o.type !== false) { rr(-560, 700, 240, 40, 6); ol('#3a3a40', 5); rr(-540, 660, 200, 50, 8); ol('#2a2a30', 5); rr(-500, 620, 120, 50, 4); ol('#f6f2ea', 4); rr(-640, 740, 400, 24, 6); ol('#6b4a2e', 6); rr(-610, 764, 20, 196, 4); ol('#6b4a2e', 5); rr(-290, 764, 20, 196, 4); ol('#6b4a2e', 5); }
  });
}
function armchair(x, y, s, back = true) { g.save(); g.translate(x, y); g.scale(s, s); if (back) { rr(-170, -470, 340, 360, 70); ol('#2e5a4a', 7); } rr(-200, -200, 400, 120, 30); ol('#356a56', 7); rr(-230, -280, 80, 230, 30); ol('#2e5a4a', 7); rr(150, -280, 80, 230, 30); ol('#2e5a4a', 7); rr(-190, -80, 26, 80, 4); ol('#3a2a1e', 5); rr(164, -80, 26, 80, 4); ol('#3a2a1e', 5); g.restore(); }
function armFront(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); rr(150, -280, 80, 230, 30); ol('#2e5a4a', 7); g.restore(); }
// New York street, night, 1983
function nyc(t, o = {}) {
  sky(NIGHT_T, NIGHT_B); L(0.05, () => { for (let i = 0; i < 40; i++) { g.globalAlpha = 0.4 + 0.4 * Math.sin(t * 2 + i); circ(-1400 + R(i) * 2800, -1000 + R(i + 1) * 700, 3); g.fillStyle = '#fff'; g.fill(); } g.globalAlpha = 1; });
  L(0.25, () => { for (let i = 0; i < 14; i++) { const x = -1500 + i * 220, h = 900 + R(i) * 900; rr(x, 640 - h, 200, h, 2); ol(['#2a3050', '#323a5a', '#262c48'][i % 3], 4); if (i % 4 === 1) { poly([[x + 60, 640 - h], [x + 100, 640 - h - 200], [x + 140, 640 - h]]); ol('#3a4266', 4); } for (let f = 0; f < h / 60 - 1; f++) for (let j = 0; j < 4; j++) if (R(i * 17 + f * 5 + j) > 0.5) { g.fillStyle = '#ffe08a'; g.fillRect(x + 18 + j * 46, 640 - h + 22 + f * 60, 22, 28); } } });
  L(0.6, () => { for (let i = 0; i < 6; i++) { const x = -1400 + i * 520; rr(x, 300, 440, 600, 2); ol(['#6a3a2a', '#5a4a3a', '#7a4a34'][i % 3], 6); for (let f = 0; f < 4; f++) for (let j = 0; j < 3; j++) { rr(x + 50 + j * 130, 340 + f * 130, 70, 90, 3); ol(R(i + f + j) > 0.5 ? '#ffe08a' : '#2a3050', 4); } rr(x + 40, 900 - 30, 360, 30, 2); ol('#3a3a40', 4); }
    const nx = -300; rr(nx, 200, 360, 90, 14); ol('#1a1a2a', 6); g.globalAlpha = 0.75 + 0.25 * Math.sin(t * 9); txt('BROADWAY', nx + 180, 246, 54, '#ff5fa8', 0); g.globalAlpha = 1; });
  L(1, () => { g.fillStyle = '#4a4a56'; g.fillRect(-3000, 900, 6000, 1600); line([[-3000, 900], [3000, 900]], 7); g.fillStyle = '#2e2e38'; g.fillRect(-3000, 1080, 6000, 1400); line([[-3000, 1080], [3000, 1080]], 6); for (let i = 0; i < 20; i++) { rr(-3000 + i * 320, 1250, 160, 16, 4); ol('#d8d0a0', 0); } for (let i = 0; i < 5; i++) lamp(-1400 + i * 700, 910, 1.2, 1); });
  if (o.taxi !== false) L(1.05, () => { const x = ((t * 700) % 4200) - 2100; taxi(x, 1240); });
}
function taxi(x, y) { g.save(); g.translate(x, y); rr(-260, -150, 520, 110, 26); ol('#f2c230', 7); poly([[-160, -150], [-110, -250], [130, -250], [180, -150]]); ol('#f2c230', 7); rr(-120, -235, 110, 75, 8); ol('#bcdcf0', 5); rr(10, -235, 110, 75, 8); ol('#bcdcf0', 5); rr(-50, -290, 100, 40, 6); ol('#fff', 5); txt('TAXI', 0, -270, 22, OUT, 0); for (let k = 0; k < 6; k++) { rr(-240 + k * 80, -100, 40, 18, 2); ol('#1a1a1a', 0); } for (const wx of [-160, 160]) { circ(wx, -36, 46); ol('#222', 7); circ(wx, -36, 18); ol('#999', 4); } circ(250, -110, 16); ol('#fff6c0', 4); g.restore(); }
function theatre(t, o = {}) {
  g.fillStyle = '#1a0f18'; g.fillRect(0, 0, W, H);
  L(0.5, () => { const cl = o.close || 0; rr(-1000, -500, 2000, 1150, 6); ol('#3a1a2a', 0); const gl = g.createRadialGradient(0, 300, 20, 0, 300, 700); gl.addColorStop(0, 'rgba(255,230,160,0.55)'); gl.addColorStop(1, 'rgba(255,230,160,0)'); g.fillStyle = gl; g.fillRect(-1000, -500, 2000, 1200);
    for (const sx of [-1, 1]) { const xe = sx * lerp(1000, 0, ease(cl)), x0 = sx * 1000; for (let k = 0; k < 7; k++) { const a = lerp(x0, xe, k / 7), b = lerp(x0, xe, (k + 1) / 7); g.beginPath(); g.moveTo(a, -560); g.quadraticCurveTo((a + b) / 2 + Math.sin(t * 2 + k) * 6, 100, a, 660); g.lineTo(b, 660); g.quadraticCurveTo((a + b) / 2, 100, b, -560); g.closePath(); ol(k % 2 ? '#9a1e2e' : '#b2283a', 5); } }
    for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(sx * 1000, -560); g.quadraticCurveTo(sx * 600, -200, sx * 640, 400); g.lineTo(sx * 1000, 400); g.closePath(); ol('#8a1828', 6); }
    rr(-1100, -620, 2200, 120, 10); ol('#c9a24a', 7); rr(-1100, 640, 2200, 60, 4); ol('#5a3a2a', 6);
  });
}
function hotelExt(t) {
  sky(NIGHT_T, NIGHT_B); L(0.1, () => { for (let i = 0; i < 5; i++) cloud(-1300 + ((i * 600 + t * 30) % 2600), -1300 + R(i) * 400, 1.6, '#2a2a48'); });
  L(0.35, () => { for (let i = 0; i < 7; i++) { const x = -1600 + i * 480, h = 1900 + R(i) * 900; if (Math.abs(x + 200) < 500) continue; rr(x, 900 - h, 420, h, 2); ol('#262c48', 4); for (let f = 0; f < h / 80; f++) for (let j = 0; j < 4; j++) if (R(i * 9 + f * 3 + j) > 0.5) { g.fillStyle = '#ffe08a'; g.fillRect(x + 30 + j * 96, 900 - h + 30 + f * 80, 40, 40); } } });
  L(1, () => { rr(-460, -1500, 920, 2400, 4); ol('#b8a88a', 7); for (let f = 0; f < 16; f++) for (let j = 0; j < 5; j++) { const lit = (f === 7 && j === 3) || R(f * 7 + j) > 0.75; rr(-400 + j * 170, -1440 + f * 130, 100, 90, 4); ol(lit ? '#ffe08a' : '#4a4a66', 4); }
    rr(-330, 360, 660, 120, 12); ol('#1a1a2a', 6); g.globalAlpha = 0.8 + 0.2 * Math.sin(t * 7); txt('HOTEL ELYSÉE', 0, 420, 72, '#ffd98a', 0); g.globalAlpha = 1;
    poly([[-260, 560], [260, 560], [300, 620], [-300, 620]]); ol('#7a2a3a', 6); rr(-120, 620, 240, 280, 10); ol('#ffe08a', 6); line([[0, 620], [0, 900]], 5);
    g.fillStyle = '#4a4a56'; g.fillRect(-3000, 900, 6000, 1600); line([[-3000, 900], [3000, 900]], 7); lamp(-600, 910, 1.3, 1); lamp(600, 910, 1.3, 1); });
}
function hallway(t, o = {}) {
  const m = o.morning || 0; g.fillStyle = m ? '#d8c8a0' : '#2e2430'; g.fillRect(0, 0, W, H);
  L(1, () => { for (let i = -6; i < 8; i++) { const x = i * 420; rr(x - 110, 420, 220, 540, 10); ol(m ? '#8a5a3a' : '#4a2e24', 7); circ(x + 80, 700, 12); ol('#c9a24a', 4); rr(x - 50, 470, 100, 40, 6); ol('#c9a24a', 4); txt(String(1400 + i * 2), x, 490, 26, OUT, 0); rr(x + 170, 300, 60, 60, 30); ol(m ? '#fff6d0' : '#a89060', 5); }
    g.fillStyle = m ? '#9a3a3a' : '#4a1e26'; g.fillRect(-3000, 960, 6000, 1600); line([[-3000, 960], [3000, 960]], 7); for (let i = 0; i < 30; i++) { rr(-3000 + i * 200, 1100, 100, 14, 4); ol(m ? '#c9a24a' : '#6a4a2a', 0); } });
}
function clock(x, y, s, t, spin = 0) { g.save(); g.translate(x, y); g.scale(s, s); circ(0, 0, 90); ol('#fbf7ea', 7); for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; line([[Math.sin(a) * 70, -Math.cos(a) * 70], [Math.sin(a) * 80, -Math.cos(a) * 80]], 5); } const a = spin * t * 6; line([[0, 0], [Math.sin(a) * 60, -Math.cos(a) * 60]], 7); line([[0, 0], [Math.sin(a / 12) * 40, -Math.cos(a / 12) * 40]], 9); circ(0, 0, 8); ol(OUT, 0); g.restore(); }
function calendar(x, y, s, lt) { g.save(); g.translate(x, y); g.scale(s, s); const n = Math.floor(lt * 6); for (let k = 0; k < 3; k++) { rr(-160 + k * 6, -200 + k * 6, 320, 380, 16); ol('#fbf7ea', 6); } rr(-160, -200, 320, 90, 16); ol('#c0392b', 6); txt(String(1960 + Math.min(23, n * 2)), 0, -155, 54, '#fff', 0); txt(['ENE', 'MAR', 'JUN', 'SEP', 'DIC'][n % 5], 0, 20, 110, OUT, 0);
  const fl = (lt * 6) % 1; g.save(); g.globalAlpha = 1 - fl; g.translate(0, -200); g.rotate(-fl * 1.2); g.translate(-fl * 200, -fl * 300); rr(-160, 0, 320, 380, 16); ol('#fbf7ea', 6); g.restore(); g.restore(); }
function tray(t, lt, o = {}) { g.fillStyle = '#cfd8dc'; g.fillRect(0, 0, W, H);
  L(0.6, () => { for (let i = -8; i < 8; i++) { line([[i * 160, -1400], [i * 160, 1400]], 3, 'rgba(60,80,90,0.25)'); line([[-1400, i * 160], [1400, i * 160]], 3, 'rgba(60,80,90,0.25)'); } rr(-700, -500, 520, 380, 12); ol('#fbf7ea', 6); for (let k = 0; k < 6; k++) line([[-660, -420 + k * 50], [-260 - R(k) * 160, -420 + k * 50]], 6, '#8a9aa6'); txt('FORENSE', -440, -470, 40, '#c0392b', 0); });
  L(1, () => { rr(-460, 700, 920, 260, 30); ol('#aab4ba', 7); rr(-420, 730, 840, 200, 24); ol('#c8d0d4', 4); cap(60, 830, 1.4, 0.3);
    const mx = lerp(-200, 60, ease(seg(lt, 0, 0.8))), my = 830; g.save(); line([[mx + 140, my + 140], [mx + 300, my + 300]], 30, OUT); line([[mx + 140, my + 140], [mx + 300, my + 300]], 20, '#5a3d2c'); circ(mx, my, 190); g.save(); circ(mx, my, 190); g.clip(); g.fillStyle = 'rgba(200,230,255,0.25)'; g.fillRect(mx - 200, my - 200, 400, 400); if (Math.abs(mx - 60) < 200) cap(60 + (60 - mx) * 1.2, 830, 3.4, 0.3); g.restore(); circ(mx, my, 190); ol(null, 14); g.restore(); });
}
function palm(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); const sk = '#f0c8a4';
  rr(-170, 120, 340, 700, 60); ol('#e8e0cc', 7); ell(0, 0, 230, 200); ol(sk, 7);
  for (let k = 0; k < 4; k++) { const fx = -150 + k * 100; rr(fx - 38, -380 + Math.abs(k - 1.5) * 40, 76, 330, 38); ol(sk, 7); }
  g.save(); g.translate(230, 20); g.rotate(-0.7); rr(-36, -230, 72, 240, 36); ol(sk, 7); g.restore();
  line([[-140, 40], [120, -30]], 4, 'rgba(150,90,70,0.5)'); line([[-120, 100], [140, 60]], 4, 'rgba(150,90,70,0.5)');
  cap(0, 10 + Math.sin(t * 3) * 4, 2.2, 0.2); g.restore(); }
function wineTable(t, lt) { g.fillStyle = '#4a2a2a'; g.fillRect(0, 0, W, H);
  L(0.6, () => { for (let i = 0; i < 12; i++) { const gl = g.createRadialGradient(-1000 + i * 200, -300, 4, -1000 + i * 200, -300, 80); gl.addColorStop(0, 'rgba(255,210,140,0.6)'); gl.addColorStop(1, 'rgba(255,210,140,0)'); g.fillStyle = gl; g.fillRect(-1100 + i * 200, -400, 200, 200); } for (let r = 0; r < 4; r++) { rr(-1100, -100 + r * 180, 2200, 20, 4); ol('#3a1e1a', 4); for (let i = 0; i < 18; i++) { circ(-1060 + i * 125, -40 + r * 180, 34); ol('#2a3a2a', 4); } } });
  L(1, () => { rr(-800, 820, 1600, 60, 10); ol('#7a4a2e', 7); g.fillStyle = '#5a341e'; g.fillRect(-800, 880, 1600, 1600);
    g.save(); g.translate(-40, 820); rr(-70, -320, 140, 320, 30); ol('#2e4a2e', 7); rr(-26, -470, 52, 170, 10); ol('#2e4a2e', 6); rr(-60, -220, 120, 120, 6); ol('#f2e6c8', 5); txt('VINO', 0, -160, 32, '#7a2a3a', 0);
    const pop = seg(lt, 0.25, 0.7); g.save(); g.translate(lerp(0, 160, pop), -490 - Math.sin(pop * Math.PI) * 260); g.rotate(pop * 7); rr(-20, -30, 40, 50, 8); ol('#c9a070', 5); g.restore(); if (pop > 0 && pop < 1) puff(0, -480, 0.5, pop, '#fff'); g.restore();
    rr(220, 600, 110, 220, 40); ol('rgba(220,240,255,0.3)', 6); rr(240, 680, 70, 120, 30); ol('#7a1e2e', 0); });
  const x = seg(lt, 0.9, 1.2); if (x > 0) screen(() => { g.save(); g.translate(W / 2 - 40, 900); g.scale(back(x), back(x)); line([[-260, -260], [260, 260]], 50, OUT); line([[260, -260], [-260, 260]], 50, OUT); line([[-260, -260], [260, 260]], 34, '#e23b3b'); line([[260, -260], [-260, 260]], 34, '#e23b3b'); g.restore(); });
}
function medal(x, y, s, k) { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(s * back(k), s * back(k)); poly([[-40, -170], [0, -60], [40, -170]]); ol('#2a4a8a', 5); circ(0, 0, 80); ol('#e8c34a', 7); circ(0, 0, 56); ol('#f2d870', 4); txt('P', 0, 4, 64, '#8a6a1a', 0); g.restore(); }
// poses
const P_HEADBACK = (t, u = 1) => pose('stand', t, { armR: lerp(-0.3, -2.7, u), elbR: lerp(0, -0.5, u), lean: -0.12 * u, tilt: -0.55 * u });
const P_TOMOUTH = (t, u) => pose('stand', t, { armR: lerp(-0.3, -2.2, u), elbR: lerp(0, 2.2, u), armL: 0.6, elbL: -1.2 });
const SITP = (t, x = {}) => pose('sit', t, x);
// ---------- shots ----------
// P0 hook: night room, head back with drops, cap white in his mouth -> cap flies at camera
sh(0, 0, (t, u, lt) => { camPath([120, 540, 1.2], [140, 500, 1.4], u); room(t); const P = P_HEADBACK(t, 1); L(1, () => { person(100, 960, 600, ROBE, P, { expr: 'closed', hold: HOLD(2.8) }, t); const m = mouth(100, 960, 600, P); cap(m[0], m[1], 1.0); for (let k = 0; k < 2; k++) { const ph = (lt * 1.5 + k * 0.5) % 1; drop(m[0] - 40, m[1] - 160 + ph * 80, 1); } });
  shakeAt(t, 0.03, 26); popText('DOS PULITZER…', 470, lt, 0, '#ffd23f', 100); tag(); }, 1);
sh(0, 0.55, (t, u, lt) => { tint('#1a1420', 1); screen(() => { g.save(); const k = easeOut(seg(lt, 0, 0.6)); g.translate(W / 2, 1000); g.rotate(lt * 3); cap(0, 0, lerp(2, 14, k), 0); g.restore(); }); shakeAt(t, t - lt + 0.2, 30); popText('…Y UNA TAPITA', 470, lt, 0.1, '#ff6b6b', 100); tag(); }, 1);
// P1 not a wine bottle: cork pops, red X
sh(1, 0, (t, u, lt) => { camPath([0, 560, 1.0], [-30, 520, 1.2], u); wineTable(t, lt / dur(1)); });
// P2 who/where: NYC night, taxi passes, he walks; name card
sh(2, 0, (t, u, lt) => { const x = lerp(-300, 250, u); camTo(x * 0.7, 560, 1.12); nyc(t); L(1, () => person(x, 960, 560, TOM, pose('walk', t), { expr: 'smile', look: 0.4 }, t)); card(u < 0.45 ? 'NUEVA YORK · 1983' : 'TENNESSEE WILLIAMS', u < 0.45 ? null : 'DRAMATURGO', seg(lt, 0.05, 0.3), 330); });
// P3 famous: theatre, he bows on stage, audience claps, 2 medals pop
sh(3, 0, (t, u, lt) => { camPath([0, 620, 0.95], [0, 560, 1.15], u); theatre(t); L(1, () => { g.fillStyle = '#5a3a2a'; g.fillRect(-1200, 700, 2400, 30); const bow = Math.max(0, Math.sin(lt * 2.2)) * 0.45; person(0, 700, 480, TOM, pose('proud', t, { lean: bow }), { expr: 'happy' }, t); }); L(1.3, () => crowdRow(t, -900, 1500, 8, 520, 260, { pose: () => 'clap', expr: () => 'happy' })); medal(-260, 360, 1, seg(lt, 0.8, 1.1)); medal(260, 360, 1, seg(lt, 1.3, 1.6)); });
// P4 strange habit: day room, he looks around suspiciously, "?" pops
sh(4, 0, (t, u, lt) => { camPath([0, 560, 1.2], [60, 520, 1.5], u); room(t, { day: 1, lamp: 0 }); L(1, () => person(60, 960, 600, TOM, pose('think', t), { expr: 'smug', look: Math.sin(t * 2) }, t)); popText('?', 380, lt, 0.3, '#ffd23f', 160); });
// P5 eye drops every day: macro bottle on table + calendar
sh(5, 0, (t, u, lt) => { camPath([200, 640, 1.6], [240, 600, 1.9], u); room(t, { day: 1, lamp: 0, type: false }); L(1, () => { const k = back(seg(lt, 0.05, 0.4)); bottle(430, 740, 1.4 * k, false); for (let i = 0; i < 3; i++) { const ph = (lt * 1.2 + i / 3) % 1; drop(430 + (i - 1) * 40, 520 - ph * 140, 1.2); } }); screen(() => calendar(W / 2 - 220, 520, 0.7, lt)); });
// P6 cap into his mouth: cap travels from bottle to mouth
sh(6, 0, (t, u, lt) => { camPath([60, 520, 1.3], [60, 480, 1.5], u); room(t, { day: 1, lamp: 0 }); const k = ease(seg(u, 0.1, 0.6)); const P = P_TOMOUTH(t, k); L(1, () => { person(60, 960, 600, TOM, P, { expr: k > 0.95 ? 'closed' : 'neutral', look: 0.3, hold: (hR) => { if (k < 1) cap(hR[0], hR[1] - 10, 1.0); } }, t); const m = mouth(60, 960, 600, P); if (k >= 1) cap(m[0], m[1], 1.0); }); popText('¡A LA BOCA!', 420, lt, dur(6) * 0.65, '#fff', 80); });
// P7 head back, drops fall into his eyes
sh(7, 0, (t, u, lt) => { camPath([60, 500, 1.35], [70, 470, 1.55], u); room(t, { day: 1, lamp: 0 }); const k = ease(seg(u, 0, 0.4)); const P = P_HEADBACK(t, k); L(1, () => { person(60, 960, 600, TOM, P, { expr: 'closed', hold: HOLD(2.8 * k) }, t); const m = mouth(60, 960, 600, P); cap(m[0], m[1], 1.0); if (k > 0.9) for (let i = 0; i < 2; i++) { const ph = (lt * 1.6 + i * 0.5) % 1; drop(m[0] - 40, m[1] - 150 + ph * 70, 1); } }); });
// P8 for years, nothing happened: calendar flips, he gives a happy shrug
sh(8, 0, (t, u, lt) => { camPath([0, 560, 1.1], [0, 540, 1.3], u); room(t, { day: 1, lamp: 0 }); L(1, () => person(-260, 960, 560, TOM, pose('proud', t), { expr: 'happy' }, t)); screen(() => calendar(W / 2 + 180, 700, 0.9, lt * 1.5)); card('NUNCA PASÓ NADA', null, seg(u, 0.55, 0.75), 330); });
// P9 February, Hotel Elysée: tilt down the facade to the sign
sh(9, 0, (t, u, lt) => { camPath([0, -900, 0.8], [0, 380, 1.0], u, ease); hotelExt(t); card('FEBRERO · 1983', null, seg(lt, 0.1, 0.4), 300); });
// P10 alone tonight, opens the bottle (cap pops off)
sh(10, 0, (t, u, lt) => { camPath([0, 560, 1.05], [40, 520, 1.25], u); room(t); L(1, () => { armchair(0, 960, 1.1); const k = seg(u, 0.55, 0.75); person(0, 900, 560, ROBE, SITP(t, { armR: -0.7, elbR: 1.6 }), { expr: 'neutral', look: 0.4, hold: (hR) => { bottle(hR[0], hR[1] - 6, 0.9, k <= 0); if (k > 0) cap(hR[0] + 20 + k * 30, hR[1] - 110 - Math.sin(k * Math.PI) * 60, 1, k * 6); } }, t); armFront(0, 960, 1.1); if (k > 0 && k < 1) puff(30, 560, 0.25, k, '#fff'); }); clock(-380, 260, 0.9, t, 1); });
// P11 cap to mouth, like always (push in)
sh(11, 0, (t, u, lt) => { camPath([0, 560, 1.15], [10, 520, 1.4], u); room(t); const k = ease(seg(u, 0.05, 0.55)); const P = SITP(t, { armR: lerp(-0.7, -2.2, k), elbR: lerp(1.6, 2.2, k), armL: 0.4, elbL: -1.0 }); L(1, () => { armchair(0, 960, 1.1); person(0, 900, 560, ROBE, P, { expr: k > 0.95 ? 'closed' : 'neutral', hold: (hR) => { if (k < 1) cap(hR[0], hR[1] - 10, 1.0); } }, t); const m = mouth(0, 900, 560, P); if (k >= 1) cap(m[0], m[1], 0.95); armFront(0, 960, 1.1); }); });
// P12 here everything went wrong: snap zoom, lamp flickers, red
sh(12, 0, (t, u, lt) => { camPath([0, 520, 1.3], [0, 460, 1.7], u, easeOut); const fl = Math.sin(lt * 40) > 0.3 ? 1 : 0; room(t, { lamp: fl }); const P = SITP(t, { armR: -2.2, elbR: 2.2, armL: 0.4, elbL: -1.0 }); L(1, () => { armchair(0, 960, 1.1); person(0, 900, 560, ROBE, P, { expr: 'closed' }, t); const m = mouth(0, 900, 560, P); cap(m[0], m[1], 0.95); armFront(0, 960, 1.1); }); tint('#a01020', 0.18 * u); shakeAt(t, t - lt + 0.05, 20); popText('AQUÍ TODO SALIÓ MAL', 420, lt, 0.1, '#ff6b6b', 76); });
// P13 head back... cap disappears (slips) -> cut: bottle drops to the floor in slow motion (no choking shown)
sh(13, 0, (t, u, lt) => { camPath([0, 540, 1.3], [0, 500, 1.5], u); room(t); const k = ease(seg(u, 0, 0.5)); const P = SITP(t, { armR: lerp(-2.2, -2.9, k), elbR: lerp(2.2, -0.4, k), armL: 0.4, elbL: -1.0, tilt: -0.55 * k, lean: -0.1 * k }); L(1, () => { armchair(0, 960, 1.1); person(0, 900, 560, ROBE, P, { expr: k > 0.9 ? 'shock' : 'closed', hold: HOLD(2.8 * k) }, t); const m = mouth(0, 900, 560, P); const sl = seg(u, 0.6, 0.95); if (sl < 1) cap(m[0], m[1] + sl * 10, 0.95 * (1 - sl)); armFront(0, 960, 1.1); }); }, 0);
sh(13, 0.62, (t, u, lt) => { camPath([300, 760, 1.6], [300, 820, 1.8], u); room(t, { lamp: 1 }); L(1, () => { const k = easeIn(seg(u, 0, 0.6)); bottle(lerp(260, 340, k), lerp(600, 940, k), 1.2, true, k * 2.6); if (k >= 1) puff(340, 950, 0.6, seg(u, 0.6, 1), '#c8b8a8'); }); shakeAt(t, t - lt + dur(13) * 0.38 * 0.6, 18); }, 1);
// P14 nobody there to help: empty night corridor, slow dolly, clock ticking
sh(14, 0, (t, u, lt) => { camTo(lerp(-600, 600, u), 560, 1.05); hallway(t); L(1.1, () => clock(lerp(-600, 600, u) + 300, -100, 0.8, t, 2)); tint('#0a0a20', 0.25); });
// P15 the morning of 25 Feb: door opens, light floods in, assistant shocked
sh(15, 0, (t, u, lt) => { camPath([0, 560, 1.1], [0, 520, 1.35], u); hallway(t, { morning: 1 }); const k = ease(seg(u, 0.05, 0.4)); L(1.02, () => { g.fillStyle = `rgba(255,240,200,${0.8 * k})`; poly([[-110, 420], [110, 420], [110 + 400 * k, 960], [-110 - 400 * k, 960]]); g.fill(); rr(-110, 420, 220 * (1 - k * 0.85), 540, 10); ol('#8a5a3a', 7); person(lerp(-500, -260, k), 960, 540, ASIS, pose(u > 0.45 ? 'shock' : 'walk', t), { expr: u > 0.45 ? 'shock' : 'neutral', look: 0.6 }, t); });
  screen(() => { const a = seg(lt, 0.2, 0.5); g.globalAlpha = a; rr(W / 2 - 200, 200, 400, 250, 16); ol('#fbf7ea', 10); rr(W / 2 - 200, 200, 400, 80, 16); ol('#c0392b', 10); txt('FEBRERO 1983', W / 2, 240, 40, '#fff', 0); txt('25', W / 2, 370, 130, OUT, 0); g.globalAlpha = 1; }); });
// P16 he was 71: sepia, empty armchair + typewriter, 1911–1983
sh(16, 0, (t, u, lt) => { fx({ sepia: 0.6 }); camPath([-200, 640, 1.2], [-150, 660, 1.45], u); room(t, { day: 1, lamp: 0 }); L(1, () => { armchair(150, 960, 1.1); bottle(430, 740, 1.0, true); }); screen(() => { const a = seg(lt, 0.2, 0.6); g.globalAlpha = a; txt('1911 – 1983', W / 2, 330, 90, '#fff', 14); g.globalAlpha = 1; }); });
// P17 forensic: magnifier over the tiny cap
sh(17, 0, (t, u, lt) => { camPath([0, 600, 1.05], [40, 760, 1.4], u); tray(t, lt / dur(17)); card('CAUSA: UNA TAPITA', null, seg(u, 0.55, 0.75), 330); });
// P18 huge tragedies... final fits in one palm: curtain closes, then the palm
sh(18, 0, (t, u, lt) => { camPath([0, 300, 0.9], [0, 300, 0.95], u); theatre(t, { close: seg(u, 0.1, 0.95) }); }, 0);
sh(18, 0.5, (t, u, lt) => { camPath([0, 700, 1.25], [0, 640, 1.6], u); g.fillStyle = '#1a0f18'; g.fillRect(0, 0, W, H); L(0.5, () => { const gl = g.createRadialGradient(0, 600, 20, 0, 600, 800); gl.addColorStop(0, 'rgba(255,230,160,0.5)'); gl.addColorStop(1, 'rgba(255,230,160,0)'); g.fillStyle = gl; g.fillRect(-1200, -400, 2400, 2000); }); L(1, () => palm(0, 900, 1.0 * back(seg(lt, 0, 0.4)), t)); });
// P19 question: spinning cap + text, tag
sh(19, 0, (t, u, lt) => { camPath([0, 500, 1.1], [0, 520, 1.6], u, easeIn); room(t); L(1, () => { armchair(0, 960, 1.1); armFront(0, 960, 1.1); bottle(430, 740, 1.0, true); }); screen(() => { g.save(); g.translate(W / 2, 1150); g.rotate(t * 2); cap(0, 0, 6, 0); g.restore(); const k = back(seg(lt, 0.3, 0.6)); g.save(); g.translate(W / 2, 380); g.scale(k, k); txt('¿TÚ TAMBIÉN?', 0, 0, 96, '#ffd23f', 14); g.restore(); }); tag(); });
