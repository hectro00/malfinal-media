// Karel Soucek — Niagara 1984 / Astrodome 1985 (engine4)
import { K, W, H, OUT, clamp, lerp, ease, easeIn, easeOut, back, R, seg, ol, rr, circ, ell, line, poly, txt, L, screen, camTo, camPath, shakeAt, handheld,
  person, pose, mixPose, cloud, bird, tree, lamp, building, puff, speedLines, sky, wind } from './engine.js';
import { PH, st, en, dur, sh, fx, CROWD, SKYT, SKYB, clouds, birds, ground, vign, crowdRow } from './lib.js';
export { FRAMES, frame, post, blurN } from './lib.js';
const g = K.g;
// ---------- cast ----------
const KAREL = { skin: '#f0c39b', hair: '#4a3020', hairStyle: 'side', mustache: true, jacket: '#d8402f', shirt: '#f4f4f4', pants: '#d8402f', shoes: '#1b1b1b', seed: 1 };
const CREW1 = { skin: '#e8b98f', hair: '#3a2a1a', hairStyle: 'side', hat: 'cap', hatColor: '#f2b632', jacket: '#2f6db5', shirt: '#ddd', pants: '#3a3f47', shoes: '#222', seed: 2 };
const CREW2 = { skin: '#a8714c', hair: '#141414', hairStyle: 'curly', jacket: '#e3a33b', shirt: '#eee', pants: '#33404d', shoes: '#222', seed: 3 };
const MED1 = { skin: '#f2cda8', hair: '#c9a24a', hairStyle: 'side', shirt: '#f4f4f4', jacket: '#f4f4f4', pants: '#1f3a6b', shoes: '#111', seed: 4 };
const MED2 = { skin: '#8a5a3c', hair: '#141414', hairStyle: 'bun', shirt: '#f4f4f4', jacket: '#f4f4f4', pants: '#1f3a6b', shoes: '#111', seed: 5 };
const FANS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({ skin: ['#f2c9a0', '#e0a97f', '#c98e62', '#f5d2b3', '#8a5a3c', '#b97f58'][i % 6], hair: ['#2b1d14', '#c9a24a', '#141414', '#7a5a3a', '#5a3b22'][i % 5],
  hairStyle: ['side', 'curly', 'bun', 'side', 'bald'][i % 5], hat: i % 3 === 0 ? 'cap' : null, hatColor: ['#c0392b', '#2f6db5', '#27ae60'][i % 3], jacket: ['#e74c3c', '#3498db', '#27ae60', '#9b59b6', '#f39c12'][i % 5], shirt: '#fff', pants: '#2d3a55', shoes: '#222', seed: 40 + i }));
// ---------- props ----------
function barrel(x, y, s = 1, rot = 0, o = {}) { // red steel barrel, origin = centre
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  const sq = o.squash || 0; g.scale(1 + sq * 0.25, 1 - sq * 0.25);
  rr(-70, -100, 140, 200, 26); ol('#d63a24', 7); g.save(); rr(-70, -100, 140, 200, 26); g.clip(); g.fillStyle = 'rgba(255,255,255,0.28)'; g.fillRect(-40, -100, 22, 200); g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(36, -100, 34, 200); g.restore();
  for (const yy of [-45, 45]) line([[-70, yy], [70, yy]], 9, '#7a1a10');
  ell(0, -98, 66, 14); ol('#9aa0a6', 6); if (o.open) { ell(0, -98, 34, 8); ol('#111', 4); } else { circ(0, -98, 9); ol('#c9a24a', 4); }
  txt('KAREL', 0, 4, 30, '#fff3e0', 6); if (o.dent) { g.beginPath(); g.moveTo(40, -100); g.quadraticCurveTo(20, -70, 70, -60); ol(null, 7); }
  g.restore();
}
function tank(x, y, s = 1, t = 0, o = {}) { // round water tank, origin = rim centre
  g.save(); g.translate(x, y); g.scale(s, s);
  g.beginPath(); g.moveTo(-300, 0); g.lineTo(-300, 260); g.ellipse(0, 260, 300, 60, 0, Math.PI, 0, true); g.lineTo(300, 0); g.closePath(); ol('#b9c0c7', 8);
  g.save(); g.clip(); for (let k = -4; k <= 4; k++) line([[k * 70, 0], [k * 70, 330]], 4, 'rgba(0,0,0,0.15)'); g.fillStyle = 'rgba(0,0,0,0.15)'; g.fillRect(180, 0, 120, 340); g.restore();
  ell(0, 0, 300, 60); ol('#3aa6d6', 8); g.save(); ell(0, 0, 300, 60); g.clip(); for (let k = 0; k < 3; k++) { const r = ((t * 0.6 + k / 3) % 1); ell(0, 0, 280 * r, 52 * r); g.strokeStyle = `rgba(255,255,255,${0.6 * (1 - r)})`; g.lineWidth = 4; g.stroke(); } g.restore();
  ell(0, 0, 306, 64); g.strokeStyle = '#e9edf0'; g.lineWidth = 12; g.stroke(); g.strokeStyle = OUT; g.lineWidth = 4; g.stroke();
  if (o.dent) { g.beginPath(); g.moveTo(230, -36); g.quadraticCurveTo(262, -6, 300, -6); g.strokeStyle = OUT; g.lineWidth = 8; g.stroke(); }
  g.restore();
}
function drops(t, t0, x, y, n = 40, pow = 1, col = '#bfe6f7') { // ballistic splash droplets
  const d = t - t0; if (d < 0 || d > 1.6) return;
  for (let i = 0; i < n; i++) { const a = (R(i) - 0.5) * 2.6, v = (500 + R(i + 9) * 900) * pow; const px = x + Math.sin(a) * v * d, py = y - Math.cos(a) * v * d * 1.1 + 1400 * d * d; g.globalAlpha = clamp(1.4 - d); circ(px, py, (10 + R(i + 3) * 16) * pow); ol(col, 3); }
  g.globalAlpha = 1;
}
function mist(t, x, y, w, a = 1) { for (let i = 0; i < 14; i++) { const ph = (t * 0.12 + R(i)) % 1; g.globalAlpha = 0.45 * a * Math.sin(ph * Math.PI); circ(x + (R(i + 1) - 0.5) * w, y - ph * 260, 60 + R(i + 2) * 90 + ph * 60); ol('#f4fbff', 0); } g.globalAlpha = 1; }
// ---------- Niagara sets ----------
function river(t, y0, flow = 1) { // water surface from y0 down, animated stripes
  g.fillStyle = '#3f8fb8'; g.fillRect(-3000, y0, 6000, 3000); line([[-3000, y0], [3000, y0]], 6);
  g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 6; g.lineCap = 'round';
  for (let i = 0; i < 40; i++) { const yy = y0 + 30 + R(i) * 900, x = ((R(i + 3) * 4000 + t * 380 * flow * (0.6 + R(i + 5))) % 4000) - 2000, l = 80 + R(i + 7) * 160; g.beginPath(); g.moveTo(x, yy); g.quadraticCurveTo(x + l / 2, yy - 10, x + l, yy); g.stroke(); }
}
function bankSet(t) { sky(SKYT, SKYB); L(0.08, () => clouds(t, -900, 5)); L(0.25, () => { g.fillStyle = '#7d9a6a'; g.beginPath(); g.moveTo(-3000, 300); for (let x = -3000; x <= 3000; x += 200) g.lineTo(x, 200 - R(x) * 160); g.lineTo(3000, 300); g.fill(); });
  L(0.5, () => { river(t, 300, 1.4); mist(t, 800, 300, 900, 0.6); }); L(1, () => { ground(620, '#8fae6e', '#7f9d60'); rr(-1400, 600, 2800, 26, 4); ol('#9b8566', 5); for (let i = 0; i < 5; i++) tree(-1300 + i * 640, 620, 0.9, i + 3, t); }); }
function fallsSet(t, o = {}) { // the horseshoe curtain seen from the side/front; brink at y=-300, pool at y=900
  sky('#8fb9d9', '#eaf2f7'); L(0.08, () => clouds(t, -1100, 5)); L(0.2, () => { g.fillStyle = '#6f8f63'; g.fillRect(-3000, -420, 6000, 160); });
  L(0.6, () => { river(t, -330, 2.2);
    poly([[-1600, -300], [1600, -300], [1600, 900], [-1600, 900]]); ol('#e8f6fc', 0);
    g.save(); poly([[-1600, -300], [1600, -300], [1600, 900], [-1600, 900]]); g.clip(); g.strokeStyle = 'rgba(80,160,200,0.55)'; g.lineWidth = 14; g.lineCap = 'round';
    for (let i = 0; i < 60; i++) { const x = -1600 + i * 55 + Math.sin(i) * 10, off = ((t * 900 + R(i) * 1200) % 1200); g.beginPath(); g.moveTo(x, -300 + off - 300); g.lineTo(x + 4, -300 + off); g.stroke(); } g.restore();
    line([[-1600, -300], [1600, -300]], 8); });
  L(0.8, () => { river(t, 900, 0.8); mist(t, 0, 950, 2600, 1.2); });
}
// ---------- Astrodome sets ----------
function domeExt(t) { sky('#3b3f6e', '#f0a46b'); L(0.06, () => { circ(-300, 300, 120); ol('#ffd08a', 0); }); L(0.12, () => clouds(t * 0.5, -900, 4, 1));
  L(0.5, () => { g.fillStyle = '#2a2d45'; g.fillRect(-3000, 560, 6000, 2000); g.beginPath(); g.ellipse(0, 560, 900, 420, 0, Math.PI, 0); ol('#cfd6de', 8); g.save(); g.beginPath(); g.ellipse(0, 560, 900, 420, 0, Math.PI, 0); g.clip(); g.strokeStyle = 'rgba(60,70,90,0.4)'; g.lineWidth = 5; for (let k = -8; k <= 8; k++) { g.beginPath(); g.moveTo(k * 110, 560); g.quadraticCurveTo(k * 70, 200, 0, 140); g.stroke(); } for (let r = 1; r < 5; r++) { g.beginPath(); g.ellipse(0, 560, 900 * r / 5, 420 * r / 5, 0, Math.PI, 0); g.stroke(); } g.restore();
    rr(-920, 520, 1840, 60, 6); ol('#9aa3ad', 6); rr(-260, 380, 520, 110, 12); ol('#c0392b', 6); txt('ASTRODOME', 0, 436, 64, '#fff', 0); });
  L(1, () => { g.fillStyle = '#3a3d52'; g.fillRect(-3000, 900, 6000, 1500); line([[-3000, 900], [3000, 900]], 6); for (let i = 0; i < 6; i++) lamp(-1200 + i * 480, 910, 1.1, 1); });
}
function domeInt(t, o = {}) { // seats ring + lattice roof; floor y=700, roof y=-1400
  g.fillStyle = '#20233a'; g.fillRect(-4000, -4000, 8000, 8000);
  L(0.4, () => { g.strokeStyle = '#4b5170'; g.lineWidth = 10; for (let k = -10; k <= 10; k++) { g.beginPath(); g.moveTo(k * 200, -1400); g.quadraticCurveTo(k * 120, -2000, 0, -2100); g.stroke(); } for (let r = 1; r < 6; r++) { g.beginPath(); g.ellipse(0, -1400, 2200 * r / 6, 500 * r / 6, 0, Math.PI, 0); g.stroke(); }
    for (let row = 0; row < 7; row++) { const y = -900 + row * 220; rr(-2600, y, 5200, 200, 0); ol(['#2f5f8a', '#c0392b', '#2f5f8a', '#e6b437', '#2f5f8a', '#c0392b', '#2f5f8a'][row], 4);
      for (let i = 0; i < 60; i++) { const x = -2500 + i * 85 + (row % 2) * 40; const bob = o.cheer ? Math.abs(Math.sin(t * 9 + i + row)) * 14 : Math.sin(t * 2 + i) * 2; circ(x, y + 70 - bob, 22); ol(FANS[(i + row) % 10].skin, 3); rr(x - 26, y + 92 - bob, 52, 60, 14); ol(FANS[(i * 3 + row) % 10].jacket, 3); if (o.cheer && (i + row) % 3 === 0) line([[x - 20, y + 100 - bob], [x - 34, y + 30 - bob]], 8, FANS[(i * 3 + row) % 10].skin); } }
  });
  L(0.6, () => { if (o.beams !== false) for (let i = 0; i < 4; i++) { g.save(); g.translate(-1200 + i * 800, -1400); g.rotate(Math.sin(t * 0.8 + i * 1.7) * 0.3); g.globalAlpha = 0.22; poly([[-20, 0], [20, 0], [260, 2400], [-260, 2400]]); g.fillStyle = '#fff6d0'; g.fill(); g.restore(); } g.globalAlpha = 1; });
  L(1, () => { g.fillStyle = '#3d7a45'; g.fillRect(-3000, 700, 6000, 2000); line([[-3000, 700], [3000, 700]], 7); g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 8; for (let k = -6; k <= 6; k++) { g.beginPath(); g.moveTo(k * 300, 710); g.lineTo(k * 520, 2000); g.stroke(); } });
}
function roofDown(t, k = 0) { // looking down from the roof: tiny tank on the field, crowd ring
  g.fillStyle = '#3d7a45'; g.fillRect(-3000, -3000, 6000, 6000); g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 6; for (let i = -10; i <= 10; i++) { g.beginPath(); g.moveTo(i * 160, -3000); g.lineTo(i * 160, 3000); g.stroke(); }
  for (let r = 0; r < 4; r++) { g.beginPath(); g.ellipse(0, 0, 1100 + r * 120, 900 + r * 110, 0, 0, Math.PI * 2); g.strokeStyle = ['#2f5f8a', '#c0392b', '#e6b437', '#2f5f8a'][r]; g.lineWidth = 110; g.stroke(); }
  for (let i = 0; i < 160; i++) { const a = R(i) * 6.28, r = 1080 + R(i + 1) * 400; circ(Math.cos(a) * r, Math.sin(a) * r * 0.83, 12); ol(FANS[i % 10].jacket, 2); }
  tank(0, 0, 0.13, t);
  for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) line([[x * 300, y * 260], [x * 2000, y * 2000]], 26, '#4b5170');
}
// ---------- shot table ----------
// P0 hook: over the falls ... cut: hits the tank rim
sh(0, 0, (t, u, lt) => { const y = -360 + Math.max(0, lt - 0.2) ** 2 * 2600, x = 150 + lt * 160; camTo(lerp(0, x * 0.6, u), lerp(-200, y * 0.7, u), 0.75); fallsSet(t); L(0.6, () => barrel(x, y, 1.2, lt * 4)); screen(() => { if (lt > 0.4) speedLines(t, 'v', 0.6); }); }, 1);
sh(0, 0.5, (t, u, lt) => { const hit = 0.45, d = lt - hit; camTo(160, 120, 1.3); shakeAt(t, t - lt + hit, 40); domeInt(t, { beams: false }); L(1, () => { tank(0, 520, 1, t, { dent: d > 0 });
  if (d < 0) barrel(240, 420 - (-d) * 2200, 0.9, lt * 9); else { barrel(240 + d * 420, 420 - d * 700 + d * d * 2600, 0.9, hit * 9 + d * 6, { squash: Math.max(0, 0.6 - d * 4), dent: true }); drops(t, t - lt + hit, 240, 470, 50, 0.9); if (d < 0.08) { circ(240, 440, 220); ol('rgba(255,255,255,0.85)', 0); } } }); }, 1);
// P1 Canada 1984: climbs into the barrel, lid closes
sh(1, 0, (t, u, lt) => { camPath([0, 260, 1.2], [140, 300, 1.45], u); bankSet(t); L(1, () => { const k = seg(u, 0.45, 0.8);
  barrel(260, 520, 1.6, 0, { open: k < 0.95 }); if (k < 1) person(lerp(-60, 260, seg(u, 0.25, 0.5)), lerp(620, 470 + k * 200, k), 520 * (1 - k * 0.15), KAREL, u < 0.25 ? pose('point', t, { armR: -2.3 }) : pose('wings', t, { armL: 2.6 - k * 2, armR: -2.6 + k * 2 }), { expr: 'grin', look: 0.5 }, t);
  person(-380, 620, 480, CREW1, pose('clap', t), { expr: 'happy', look: 0.8 }, t); });
  screen(() => { const a = seg(lt, 0.2, 0.5) * (1 - seg(lt, 2.6, 3)); g.globalAlpha = a; txt('CANADÁ · 1984', W / 2, 300, 92, '#fff', 14); g.globalAlpha = 1; }); });
// P2 drifting down the river (follow cam, bobbing)
sh(2, 0, (t, u, lt) => { const x = -400 + lt * 260; camTo(x + 200, 260, 1.1, Math.sin(t * 1.2) * 0.03); handheld(t, 8); bankSet(t); L(0.5, () => barrel(x, 310 + Math.sin(t * 3) * 14, 0.8, Math.sin(t * 2.2) * 0.2)); L(0.5, () => { line([[x + 900, 260], [x + 900, 340]], 6, '#fff'); }); screen(() => { g.globalAlpha = seg(u, 0.5, 0.7); txt('⚠', W - 160, 420, 120, '#ffd23f', 10); g.globalAlpha = 1; }); });
// P3 50 m drop: tumble along the curtain, meter counts, splash at the pool
sh(3, 0, (t, u, lt) => { const T = dur(3) * 0.75, k = clamp(lt / T), y = -330 + 1230 * k * k, x = 200 + k * 260; camTo(x * 0.6, lerp(-200, 700, ease(k)), 0.85); fallsSet(t);
  L(0.6, () => { if (k < 1) barrel(x, y, 0.9, lt * 5); else { drops(t, t - lt + T, x, 900, 70, 1.3); mist(t, x, 900, 600, 1); } });
  screen(() => { rr(W - 330, 210, 270, 130, 18); ol('rgba(20,20,30,0.75)', 6); txt(`${Math.round(50 * k)} m`, W - 195, 275, 80, '#ffd23f', 0); if (k > 0.2 && k < 1) speedLines(t, 'v', 0.5); });
  shakeAt(t, t - lt + T, 34); }, 1);
// P4 sinks, spins, pops up (damped buoyancy)
sh(4, 0, (t, u, lt) => { camPath([0, 820, 1.4], [0, 780, 1.25], u); fallsSet(t); L(0.8, () => { const by = 920 + 260 * Math.exp(-1.4 * lt) * Math.cos(lt * 3.6) - 40; barrel(Math.sin(lt * 1.2) * 60, by, 0.9, lt * 3 * Math.exp(-0.7 * lt) + Math.sin(t * 2) * 0.12); river(t, 940, 0.4); if (lt > 1.3) drops(t, t - lt + 1.35, 0, 930, 20, 0.5); }); });
// P5 rescued bleeding but alive -> famous (flashes + headline)
sh(5, 0, (t, u, lt) => { camPath([0, 300, 1.35], [0, 300, 1.5], u); bankSet(t); L(1, () => { barrel(-320, 560, 1.4, 1.3, { open: true }); person(60, 620, 560, KAREL, pose('stand', t, { lean: 0.08 }), { expr: 'pain', sweat: true }, t); rr(10, 92, 110, 30, 8); ol('#fff', 5); txt('✚', 64, 108, 24, '#d33', 0);
  person(-260, 620, 520, CREW1, pose('carry', t), { expr: 'scared', look: 0.8 }, t); person(400, 620, 520, CREW2, pose('shock', t), { expr: 'shock', look: -0.8 }, t, true); for (let i = 0; i < 3; i++) { const a = t * 5 + i * 2.1; txt('★', 60 + Math.cos(a) * 110, 120 + Math.sin(a) * 26, 50, '#ffe14d', 6); } }); });
sh(5, 0.55, (t, u, lt) => { const k = back(seg(lt, 0, 0.5)); camTo(0, 0, 1); g.fillStyle = '#1d1b22'; g.fillRect(0, 0, W, H);
  screen(() => { g.save(); g.translate(W / 2, H / 2 - 60); g.rotate((1 - k) * 8 - 0.06); g.scale(0.2 + k * 0.8, 0.2 + k * 0.8); rr(-430, -560, 860, 1120, 6); ol('#f3efe2', 8); txt('THE DAILY', 0, -470, 64, OUT, 0, 'center', '900'); line([[-380, -410], [380, -410]], 6); txt('¡SOBREVIVIÓ', 0, -320, 96, '#c0392b', 0); txt('AL NIÁGARA!', 0, -210, 96, '#c0392b', 0);
    rr(-360, -130, 720, 460, 6); ol('#d9d3c2', 5); g.save(); g.translate(0, 300); person(0, 0, 400, KAREL, pose('proud', t), { expr: 'grin' }, t); g.restore(); for (let k2 = 0; k2 < 5; k2++) line([[-360, 390 + k2 * 32], [360, 390 + k2 * 32]], 8, '#bdb6a3'); g.restore();
    for (let i = 0; i < 3; i++) { const ph = (lt * 2 + i * 0.33) % 1; if (ph < 0.12) { g.globalAlpha = 1 - ph * 8; circ(R(i + Math.floor(lt * 2)) * W, 300 + R(i * 5 + Math.floor(lt * 2)) * 1300, 260); ol('#fff', 0); g.globalAlpha = 1; } } }); });
// P6 plans something crazier... under a roof (sketch on paper)
sh(6, 0, (t, u, lt) => { camPath([0, -60, 1.1], [0, -120, 1.25], u); g.fillStyle = '#7a5a40'; g.fillRect(0, 0, W, H);
  L(1, () => { rr(-460, -620, 920, 760, 10); ol('#f6f1e3', 8); const k1 = seg(u, 0.1, 0.5), k2 = seg(u, 0.5, 0.9); g.strokeStyle = '#2b5a8a'; g.lineWidth = 10;
    if (k1 > 0) { g.beginPath(); g.ellipse(0, 40, 360, 320 * k1, 0, Math.PI, 0); g.stroke(); line([[-380, 40], [380, 40]], 10, '#2b5a8a'); } if (k2 > 0) { line([[0, -280], [0, -280 + 260 * k2]], 6, '#2b5a8a'); rr(-30, -40 + 0 * k2, 60, 60, 8); ol(k2 > 0.5 ? '#d63a24' : null, 6); txt('?', 120, -160, 90, '#2b5a8a', 0); }
    person(380, 560, 640, KAREL, pose('think', t), { expr: 'smug', look: -0.7 }, t, true); });
  screen(() => { if (u > 0.85) txt('💡', W - 250, 460, 120, '#fff', 0); }); });
// P7 Houston 1985: dome exterior -> packed interior
sh(7, 0, (t, u, lt) => { camPath([0, 300, 0.85], [0, 380, 1.0], u); domeExt(t); screen(() => { const a = seg(lt, 0.1, 0.4); g.globalAlpha = a; txt('HOUSTON · 1985', W / 2, 300, 92, '#fff', 14); g.globalAlpha = 1; }); });
sh(7, 0.55, (t, u, lt) => { camPath([0, -200, 0.55], [0, 100, 0.7], u); domeInt(t, { cheer: true }); L(1, () => tank(0, 620, 0.7, t)); });
// P8 hoisted to the roof (rope, pendulum sway)
sh(8, 0, (t, u, lt) => { const y = lerp(520, -1250, ease(u)), sw = Math.sin(lt * 2.1) * 0.07; camTo(0, y * 0.8, 0.8); domeInt(t); L(1, () => { line([[sw * 300, y - 2000], [sw * 300, y - 100]], 6, '#d8c8a0'); barrel(sw * 300, y, 0.8, sw); tank(0, 620, 0.7, t); }); });
// P9 55 m up: vertigo (dolly-zoom on the view down)
sh(9, 0, (t, u, lt) => { camTo(0, 0, lerp(1.6, 0.8, ease(u)), Math.sin(t * 0.9) * 0.05); L(1, () => roofDown(t)); screen(() => { rr(W - 330, 210, 270, 130, 18); ol('rgba(20,20,30,0.75)', 6); txt('55 m', W - 195, 275, 80, '#ffd23f', 0); g.save(); g.translate(W / 2, 420); barrel(0, 0, 1.3, Math.sin(t * 1.8) * 0.06); g.restore(); }); });
// P10 the tank waits below... looks like a glass
sh(10, 0, (t, u, lt) => { camPath([0, 560, 1.3], [0, 560, 1.15], u); domeInt(t); L(1, () => { tank(0, 560, 1, t); person(-520, 700, 420, CREW1, pose('point', t, { armR: -0.6 }), { expr: 'neutral', look: 0.8 }, t); }); });
sh(10, 0.5, (t, u, lt) => { const k = ease(seg(u, 0.3, 0.8)); camTo(0, 0, 1.1); L(1, () => roofDown(t)); screen(() => { g.save(); g.translate(W / 2, H / 2); g.globalAlpha = k; g.beginPath(); g.moveTo(-90, -130); g.lineTo(90, -130); g.lineTo(70, 130); g.lineTo(-70, 130); g.closePath(); ol('rgba(190,230,250,0.85)', 8); rr(-80, -40, 160, 20, 4); ol('#3aa6d6', 0); g.restore(); g.globalAlpha = 1; }); });
// P11 released too early -> starts to spin (falls away from camera)
sh(11, 0, (t, u, lt) => { const rel = dur(11) * 0.25, d = Math.max(0, lt - rel); camTo(0, 0, 1.0); L(1, () => roofDown(t)); screen(() => { const s = Math.max(0.25, 1.4 - d * 0.6); g.save(); g.translate(W / 2 + d * d * 40, 420 + d * 300); barrel(0, 0, s, d * d * 9 + Math.sin(t * 1.8) * 0.06); g.restore();
  line([[W / 2 - 50, 0], [W / 2 - 50, 300 - (lt > rel ? (lt - rel) * 600 : 0)]], 8, '#d8c8a0'); if (lt > rel && lt < rel + 0.6) { g.globalAlpha = 1 - (lt - rel) / 0.6; txt('¡CLAC!', W / 2 + 220, 260, 100, '#ffd23f', 12); g.globalAlpha = 1; } }); shakeAt(t, t - lt + rel, 16); }, 1);
// P12 'Verás': at Niagara a whole river to land in (green target)
sh(12, 0, (t, u, lt) => { camPath([0, 700, 0.8], [0, 760, 0.7], u); fallsSet(t); L(0.8, () => { g.beginPath(); g.ellipse(0, 960, 1100, 160, 0, 0, Math.PI * 2); g.setLineDash([40, 24]); g.lineDashOffset = -t * 80; g.strokeStyle = '#2ecc71'; g.lineWidth = 20; g.stroke(); g.setLineDash([]); txt('✓', 0, 760, 200, '#2ecc71', 14); }); });
// P13 here the target was tiny; a spinning barrel drifts (red ring + curved path)
sh(13, 0, (t, u, lt) => { camTo(0, 0, 1.25); L(1, () => { roofDown(t); g.beginPath(); g.arc(0, 0, 70, 0, Math.PI * 2); g.setLineDash([16, 12]); g.lineDashOffset = -t * 60; g.strokeStyle = '#e74c3c'; g.lineWidth = 12; g.stroke(); g.setLineDash([]);
  const k = seg(u, 0.35, 0.95); g.strokeStyle = '#ffd23f'; g.lineWidth = 14; g.setLineDash([24, 18]); g.beginPath(); g.moveTo(-40, -700); for (let i = 1; i <= 40 * k; i++) { const v = i / 40; g.lineTo(-40 + 110 * v * v, -700 + 700 * v); } g.stroke(); g.setLineDash([]); }); });
// P14 hits the RIM: slow-mo ramp, flash, splash, shake
sh(14, 0, (t, u, lt) => { const D = dur(14) + 0.3, hit = D * 0.6, slow = (x) => x < hit - 0.4 ? x : x < hit ? hit - 0.4 + (x - hit + 0.4) * 0.3 : hit - 0.28 + (x - hit), tt = slow(lt), H0 = hit - 0.28, d = lt - hit;
  camPath([120, 360, 1.15], [240, 420, 1.55], seg(lt, 0, hit)); shakeAt(t, t - lt + hit, 46, 5); domeInt(t, { beams: false });
  L(1, () => { tank(0, 560, 1, t, { dent: d > 0 }); if (d < 0) barrel(260 + (H0 - tt) * 120, 470 - (H0 - tt) * 2200, 0.9, tt * 9); else { barrel(260 + d * 520, 470 - d * 900 + d * d * 2800, 0.9, H0 * 9 + d * 5, { squash: Math.max(0, 0.7 - d * 5), dent: true }); drops(t, t - lt + hit, 270, 520, 60, 1); if (d < 0.07) { circ(270, 500, 260); ol('rgba(255,255,255,0.9)', 0); } } }); }, 1);
// P15 the crowd applauds: they think it went perfectly
sh(15, 0, (t, u, lt) => { camPath([0, -300, 1.0], [0, -250, 1.15], u); domeInt(t, { cheer: true }); L(1.1, () => { for (let i = 0; i < 5; i++) person(-640 + i * 320, 560, 600, FANS[i * 2], pose(i % 2 ? 'clap' : 'shock', t + i * 0.3, i % 2 ? {} : { armL: 2.7, armR: -2.7 }), { expr: i % 2 ? 'laugh' : 'happy', look: R(i) - 0.5 }, t, i % 2 === 1); }); });
// P16 until the paramedics arrive (run in, siren glow, crowd freezes)
sh(16, 0, (t, u, lt) => { camPath([0, 380, 1.2], [80, 400, 1.35], u); domeInt(t, { beams: false }); L(1, () => { tank(-200, 560, 0.9, t, { dent: true }); person(lerp(900, 260, easeOut(u)), 720, 480, MED1, pose('run', t * 1.3), { expr: 'scared', look: -0.6 }, t, true); person(lerp(1150, 520, easeOut(u)), 720, 470, MED2, pose('run', t * 1.3 + 0.3), { expr: 'scared', look: -0.6 }, t, true); });
  screen(() => { const p = (Math.sin(t * 14) + 1) / 2; g.fillStyle = `rgba(255,40,40,${0.18 * p})`; g.fillRect(0, 0, W, H); g.fillStyle = `rgba(40,90,255,${0.14 * (1 - p)})`; g.fillRect(0, 0, W, H); }); });
// P17 Karel died the next day (dim, dented empty barrel, lights off)
sh(17, 0, (t, u, lt) => { camPath([0, 560, 1.3], [0, 600, 1.55], u); fx({ sepia: 0.7 }); domeInt(t, { beams: false }); L(1, () => { tank(-260, 560, 0.9, t, { dent: true }); barrel(300, 650, 0.9, Math.PI / 2 + 0.08, { dent: true }); }); screen(() => { g.fillStyle = 'rgba(5,6,14,0.45)'; g.fillRect(0, 0, W, H); }); });
// P18 survived the most famous fall in the world... not a tank (split screen)
sh(18, 0, (t, u, lt) => { const k = ease(seg(u, 0, 0.35)); camTo(0, 400, 0.6); screen(() => { g.save(); g.beginPath(); g.rect(0, 0, W, H / 2); g.clip(); g.translate(0, -H / 4); fallsSet(t); g.restore(); g.save(); g.beginPath(); g.rect(0, H / 2, W, H / 2); g.clip(); g.translate(0, H / 4); K.cam = { x: 0, y: 560, z: 1.2, rot: 0 }; domeInt(t, { beams: false }); L(1, () => tank(0, 560, 1, t, { dent: true })); g.restore(); line([[0, H / 2], [W, H / 2]], 12, '#fff');
  g.globalAlpha = k; txt('✓', W - 160, 300, 180, '#2ecc71', 14); if (u > 0.5) txt('✗', W - 160, H / 2 + 260, 180, '#e74c3c', 14); g.globalAlpha = 1; }); });
// P19 would you get back into the barrel? (push into the open hatch)
sh(19, 0, (t, u, lt) => { camPath([260, 360, 1.3], [260, 260, 4.5], u, easeIn); bankSet(t); L(1, () => barrel(260, 520, 1.6, 0, { open: true })); });
