// Sophie Blanchard — Tivoli, Paris, 6 July 1819 (engine4)
import { K, W, H, OUT, clamp, lerp, ease, easeIn, easeOut, back, R, seg, ol, rr, circ, ell, line, poly, txt, L, screen, camTo, camPath, shakeAt, handheld,
  person, pose, mixPose, cloud, bird, tree, lamp, building, puff, speedLines, sky, wind } from './engine.js';
import { PH, st, en, dur, sh, fx, CROWD, SKYT, SKYB, clouds, birds, skyline, ground, smoke, vign, crowdRow } from './lib.js';
export { FRAMES, frame, post, blurN } from './lib.js';
const g = K.g;
const SOPHIE = { skin: '#f5d2b3', hair: '#4a2c1e', hairStyle: 'bun', hat: 'plume', hatColor: '#f4ecdc', plume: '#e05a7a', dress: true, jacket: '#f4f0f6', shirt: '#f4f0f6', pants: '#e9e3ee', shoes: '#4a3a5a', seed: 1 };
const JP = { skin: '#eab48c', hair: '#5a3b26', hairStyle: 'side', jacket: '#3b4a6b', shirt: '#eee', pants: '#d8d0bd', shoes: '#222', seed: 2 };
const NAP = { skin: '#f2cda8', hair: '#3a2a1a', hairStyle: 'side', hat: 'bicorne', jacket: '#24305a', shirt: '#f3efe6', pants: '#f3efe6', shoes: '#111', police: true, seed: 3 };
const ADV1 = { ...CROWD[0], seed: 6 }, ADV2 = { ...CROWD[1], seed: 7 };
const NIGHT_T = '#141a3a', NIGHT_B = '#3a3060';
// ---------- props ----------
function balloon(x, y, s = 1, t = 0, o = {}) { // origin = basket floor; o.who (draw passenger), o.fire 0..1, o.works (fireworks), o.sleep
  g.save(); g.translate(x, y); g.scale(s, s); g.rotate(o.rot || 0);
  const ey = -560, er = 230;
  for (const sx of [-1, -0.45, 0.45, 1]) line([[sx * 70, -110], [sx * er * 0.75, ey + er * 0.75]], 3, '#5b4230');
  circ(0, ey, er); ol(o.col || '#f2d45c', 8); g.save(); circ(0, ey, er); g.clip(); const cols = ['#e05a5a', '#f2d45c', '#5a8be0', '#f2d45c'];
  for (let k = -4; k <= 4; k++) { g.beginPath(); g.ellipse(0, ey, Math.abs(k) * er / 4.2 + 4, er, 0, 0, Math.PI * 2); g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = 4; g.stroke(); }
  g.fillStyle = 'rgba(255,255,255,0.25)'; g.beginPath(); g.ellipse(-80, ey - 90, 50, 90, -0.4, 0, Math.PI * 2); g.fill(); g.restore();
  txt('H₂', 0, ey + 40, 70, 'rgba(60,40,20,0.35)', 0);
  if (o.who) { g.save(); person(0, -20, 230, o.who, o.pose || pose('stand', t, { armL: 0.8, armR: -1.8, elbR: 0.4 }), o.face || { expr: 'happy' }, t); g.restore(); }
  rr(-80, -110, 160, 110, 14); ol('#a8743f', 7); for (let k = -2; k <= 2; k++) line([[k * 30, -105], [k * 30, -5]], 3, '#6b4a26'); line([[-80, -70], [80, -70]], 3, '#6b4a26');
  if (o.ballast) for (let i = 0; i < 3; i++) { rr(-110 + i * 16, -60, 26, 34, 6); ol('#c9b38a', 4); }
  if (o.works) { line([[0, 0], [0, 140]], 3, '#555'); rr(-40, 140, 80, 50, 8); ol('#6b2f3a', 5); const k = o.works; for (let i = 0; i < 26; i++) { const a = R(i) * 6.28, ph = (t * 1.6 + R(i + 1)) % 1, r = ph * 260 * k; g.globalAlpha = 1 - ph; circ(Math.cos(a) * r, 170 + Math.sin(a) * r + ph * ph * 120, 7 + (1 - ph) * 6); ol(['#ffd23f', '#ff6b6b', '#7dd3ff', '#fff'][i % 4], 0); } g.globalAlpha = 1;
    const gl = g.createRadialGradient(0, 170, 0, 0, 170, 220 * k); gl.addColorStop(0, 'rgba(255,200,120,0.55)'); gl.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gl; g.fillRect(-260, -60, 520, 460); }
  if (o.fire) flames(0, ey - er + 20, o.fire * 1.6, t);
  if (o.sleep) { for (let i = 0; i < 3; i++) { const ph = (t * 0.5 + i / 3) % 1; g.globalAlpha = 1 - ph; txt('z', 60 + ph * 90, -200 - ph * 160, 40 + i * 10, '#fff', 6); } g.globalAlpha = 1; }
  g.restore();
}
function flames(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); for (let k = 0; k < 7; k++) { const fx2 = (k - 3) * 34, h = 120 + Math.sin(t * 13 + k * 1.7) * 40 + R(k) * 60; g.beginPath(); g.moveTo(fx2 - 34, 30); g.quadraticCurveTo(fx2 - 30, -h * 0.4, fx2 + Math.sin(t * 9 + k) * 14, -h); g.quadraticCurveTo(fx2 + 30, -h * 0.4, fx2 + 34, 30); g.closePath(); ol(k % 2 ? '#ff7a1a' : '#ffcf3a', 5); }
  for (let i = 0; i < 8; i++) { const ph = (t * 1.3 + R(i)) % 1; g.globalAlpha = 0.5 * (1 - ph); circ((R(i + 2) - 0.5) * 160 + Math.sin(ph * 5) * 30, -150 - ph * 360, 30 + ph * 60); ol('#5a5560', 0); } g.globalAlpha = 1; g.restore(); }
function carriage(x, y, s, t, v = 1) { // horse + carriage, moving right
  g.save(); g.translate(x, y); g.scale(s, s);
  for (const wx of [-260, -60]) { g.save(); g.translate(wx, -70); circ(0, 0, 70); ol('#7a4a2a', 7); g.rotate(t * 8 * v); for (let k = 0; k < 6; k++) { g.rotate(Math.PI / 3); line([[0, 0], [0, 64]], 5); } g.restore(); }
  rr(-330, -330, 330, 220, 22); ol('#2b3a5a', 7); rr(-280, -290, 110, 110, 10); ol('#cfe3f2', 5); rr(-150, -290, 110, 110, 10); ol('#cfe3f2', 5); line([[0, -160], [140, -170]], 8, '#5b4230');
  const ph = t * 10 * v; g.save(); g.translate(250, -150); for (const [lx, o2] of [[-80, 0], [-60, 1.5], [70, 3], [90, 4.5]]) { const a = Math.sin(ph + o2) * 0.5; g.save(); g.translate(lx, 30); g.rotate(a); rr(-9, 0, 18, 120, 8); ol('#6b4226', 5); g.restore(); }
  ell(0, 0, 130, 60); ol('#8a5a34', 7); g.save(); g.translate(110, -40); g.rotate(-0.6 + Math.sin(ph) * 0.06); rr(-20, -100, 50, 120, 20); ol('#8a5a34', 6); ell(30, -110, 55, 30, 0.3); ol('#8a5a34', 6); circ(30, -120, 5); ol(OUT, 0); g.restore(); line([[-120, -20], [-170, 40 + Math.sin(ph) * 10]], 12, '#3a2418'); g.restore();
  g.restore();
}
function street(t, o = {}) { const night = o.night; sky(night ? NIGHT_T : SKYT, night ? NIGHT_B : SKYB); if (night) L(0.03, () => stars(t)); else L(0.1, () => clouds(t, -900, 5));
  L(0.3, () => skyline(500, 1, night ? '#2c2a48' : '#c3cdd7', 4));
  L(1, () => { const lit = !!night; building(-1500, 900, 760, 1100, { col: night ? '#8a8098' : '#e9dcc3', lit }); building(-700, 900, 680, 1250, { col: night ? '#7e7590' : '#e3d3b8', lit, door: true }); building(20, 900, 700, 1150, { col: night ? '#8a8098' : '#e9dcc3', lit }); building(760, 900, 760, 1300, { col: night ? '#7e7590' : '#e3d3b8', lit });
    g.fillStyle = night ? '#4a4658' : '#9a9a96'; g.fillRect(-3000, 900, 6000, 1600); line([[-3000, 900], [3000, 900]], 7); for (let i = 0; i < 30; i++) { ell(-2800 + i * 200, 1000 + (i % 3) * 120, 70, 16); ol(night ? '#57536a' : '#a8a8a2', 3); } for (let i = 0; i < 5; i++) lamp(-1300 + i * 650, 910, 1.2, night ? 1 : 0); if (o.sign) { rr(-640, 160, 420, 90, 10); ol('#24305a', 6); txt('RUE DE PROVENCE', -430, 205, 40, '#fff', 0); } });
}
function stars(t) { for (let i = 0; i < 80; i++) { g.globalAlpha = 0.5 + 0.5 * Math.sin(t * 3 + i); circ(-1500 + R(i) * 3000, -1500 + R(i + 1) * 2000, 3 + R(i + 2) * 4); ol('#fff', 0); } g.globalAlpha = 1; circ(500, -800, 90); ol('#f8f1d0', 0); }
function nightSky(t) { sky(NIGHT_T, NIGHT_B); L(0.03, () => stars(t)); L(0.15, () => { g.globalAlpha = 0.5; clouds(t, -600, 4, 1.3); g.globalAlpha = 1; }); L(0.3, () => skyline(1300, 1.1, '#2c2a48', 9)); }
function tivoli(t, o = {}) { nightSky(t); L(0.7, () => { ground(800, '#2f4a35', '#2a4230'); for (let i = 0; i < 7; i++) tree(-1500 + i * 500, 810, 1.0, i + 30, t); for (let i = 0; i < 14; i++) { const x = -1500 + i * 230, y = 420 + Math.sin(i) * 40; line([[x, y], [x + 230, 420 + Math.sin(i + 1) * 40]], 3, '#222'); circ(x, y + 20, 22); ol(['#ffcf3a', '#ff6b6b', '#7dd3ff'][i % 3], 4); } });
  if (o.crowd !== false) L(1, () => crowdRow(t, -1100, 980, 9, 330, 270, { pose: o.pose || (() => 'stand'), expr: o.expr || (() => 'happy'), look: o.look ?? -0.3 })); }
// ---------- shots ----------
// P0 hook: scared of a carriage ... yet: fireworks under a hydrogen balloon
sh(0, 0, (t, u, lt) => { camPath([0, 560, 1.4], [0, 560, 1.25], u); street(t); L(1, () => { carriage(lerp(-1700, 1500, seg(lt, 0, 1.4)), 960, 1.0, t, 2); person(260, 960, 560, SOPHIE, pose('shock', t), { expr: 'scared', sweat: true, look: -0.8 }, t); }); shakeAt(t, t - lt + 0.5, 12); });
sh(0, 0.45, (t, u, lt) => { camPath([0, -200, 1.1], [0, -320, 1.3], u); nightSky(t); L(1, () => balloon(0, 200, 1.4, t, { who: SOPHIE, works: 1, fire: seg(u, 0.75, 1) })); }, 1);
// P1 Paris 1819: the most famous aeronaut of France (ascends over a crowd)
sh(1, 0, (t, u, lt) => { const y = lerp(760, 200, ease(u)); camTo(0, lerp(500, 250, u), 0.9); street(t); L(0.95, () => balloon(0, y, 1.2, t, { who: SOPHIE, face: { expr: 'happy' } })); L(1.1, () => crowdRow(t, -1200, 1250, 9, 360, 290, { pose: () => 'clap', expr: () => 'laugh', look: 0 }));
  screen(() => { const a = seg(lt, 0.15, 0.45) * (1 - seg(lt, 2.6, 3)); g.globalAlpha = a; txt('PARÍS · 1819', W / 2, 300, 92, '#fff', 14); g.globalAlpha = 1; }); });
// P2 husband also flew... died after falling from a balloon (sepia memory, cut away)
sh(2, 0, (t, u, lt) => { fx({ sepia: 0.85 }); camPath([0, -150, 1.4], [0, -60, 1.2], u); sky(SKYT, SKYB); L(0.1, () => clouds(t, -700, 5)); L(0.3, () => skyline(800, 1, '#c3cdd7', 3));
  L(1, () => { const k = seg(u, 0.45, 0.6); balloon(0, 150, 1.4, t, { who: k < 1 ? JP : null, pose: pose('stand', t, { armR: -0.4, elbR: 2.4, lean: k * 0.4 }), face: { expr: 'pain' } }); if (u > 0.6) { g.save(); g.translate(Math.sin(lt * 3) * 60, 300 + (u - 0.6) * 1400); g.rotate(lt * 2); ell(0, 0, 60, 14); ol('#222'); g.beginPath(); g.arc(0, -8, 38, Math.PI, 0); g.closePath(); ol('#222'); g.restore(); } }); });
// P3 still she kept rising, higher and higher (through clouds + altimeter)
sh(3, 0, (t, u, lt) => { const climb = u * 1600; camTo(0, -climb, 1.0); sky('#7fb0dc', '#e6f0f8'); L(0.6, () => { for (let i = 0; i < 9; i++) cloud(-900 + R(i) * 1800, -200 - i * 380, 1.6 + R(i + 2)); }); L(1, () => balloon(0, 300 - climb, 1.3, t, { who: SOPHIE, face: { expr: 'smile', look: 0.5 } }));
  screen(() => { rr(W - 360, 210, 300, 130, 18); ol('rgba(20,20,30,0.75)', 6); txt(`${Math.round(1000 + 2600 * ease(u))} m`, W - 210, 275, 70, '#ffd23f', 0); }); });
// P4 Napoleon names her aeronaut of the festivals (scroll + seal)
function hall(t) { g.fillStyle = '#7a2b3a'; g.fillRect(0, 0, W, H); L(0.8, () => { for (let i = -4; i <= 4; i++) { rr(i * 340 - 60, -1200, 120, 1900, 10); ol('#e8d7a8', 6); } rr(-2000, 700, 4000, 1400, 0); ol('#c9a24a', 7); for (let i = 0; i < 4; i++) { circ(-900 + i * 600, -700, 80); ol('#ffe9a8', 5); } }); }
sh(4, 0, (t, u, lt) => { camPath([0, 300, 1.2], [60, 280, 1.35], u); hall(t); L(1, () => { person(-300, 820, 640, NAP, pose('point', t, { armR: -1.3 }), { expr: 'smile', look: 0.6 }, t); person(300, 820, 600, SOPHIE, pose(u > 0.5 ? 'proud' : 'carry', t), { expr: 'grin', look: -0.6 }, t, true);
  const k = back(seg(u, 0.35, 0.65)); if (k > 0) { g.save(); g.translate(40, 260); g.scale(k, k); rr(-150, -90, 300, 180, 10); ol('#f4ecd2', 6); txt('AERONAUTA', 0, -30, 34, '#7a2b3a', 0); txt('OFICIAL', 0, 15, 34, '#7a2b3a', 0); circ(100, 60, 30); ol('#c0392b', 5); g.restore(); } }); });
// P5 on the ground she was nervous, even carriages scared her
sh(5, 0, (t, u, lt) => { camPath([120, 600, 1.5], [80, 600, 1.35], u); street(t); L(1, () => { person(300, 960, 600, SOPHIE, pose(u > 0.4 ? 'cover' : 'stand', t), { expr: u > 0.4 ? 'scared' : 'worried', sweat: u > 0.4, look: -0.8 }, t); carriage(lerp(-2200, 1400, seg(u, 0.25, 0.75)), 960, 1.05, t, 2); }); shakeAt(t, t - lt + dur(5) * 0.45, 10); });
// P6 up there she was happy; sometimes slept in the balloon at night
sh(6, 0, (t, u, lt) => { camPath([-60, -150, 1.0], [0, -220, 1.3], u); nightSky(t); L(0.5, () => birds(t, -900, -700, 0)); L(1, () => balloon(lerp(-200, 120, u), 220 + Math.sin(t) * 20, 1.3, t, { who: SOPHIE, face: { expr: u > 0.45 ? 'closed' : 'happy' }, pose: pose('stand', t, { armL: 0.3, armR: -0.3, tilt: u > 0.45 ? 0.25 : 0 }), sleep: u > 0.45 })); });
// P7 a trick nobody else dared ... (box with a fuse)
sh(7, 0, (t, u, lt) => { camPath([0, 300, 1.5], [0, 260, 1.7], u); hall(t); L(1, () => { person(0, 820, 640, SOPHIE, pose('carry', t), { expr: 'smug', look: 0.4 }, t); rr(-60, 380, 120, 90, 10); ol('#6b2f3a', 6); line([[0, 380], [30, 330]], 4, '#555'); const sp = (t * 6) % 1; circ(30 + sp * 6, 326 - sp * 8, 10 + sp * 6); ol('#ffd23f', 3); txt('?', 300, 120, 140, '#ffd23f', 12); }); });
// P8 fireworks hanging under a hydrogen balloon (diagram, H2 warning)
sh(8, 0, (t, u, lt) => { camPath([0, -200, 0.95], [0, -150, 1.05], u); nightSky(t); L(1, () => { balloon(0, 260, 1.3, t, { works: seg(u, 0.2, 0.6) }); if (u > 0.55) { g.save(); g.translate(330, -500); g.rotate(Math.sin(t * 8) * 0.06); poly([[0, -110], [100, 70], [-100, 70]]); ol('#ffd23f', 8); txt('!', 0, 20, 110, OUT, 0); g.restore(); } }); });
// P9 warned it was dangerous; she ignored it
sh(9, 0, (t, u, lt) => { camPath([0, 300, 1.35], [0, 300, 1.5], u); hall(t); L(1, () => { person(-360, 820, 600, ADV1, pose('no', t), { expr: 'angry', talk: true, look: 0.8 }, t); person(-80, 830, 580, ADV2, pose('point', t, { armR: -1.6 }), { expr: 'worried', talk: true, look: 0.8 }, t); person(330, 820, 620, SOPHIE, pose(u > 0.5 ? 'proud' : 'stand', t), { expr: 'smug', look: u > 0.5 ? 0.6 : -0.6 }, t, true); }); });
// P10 6 July, Tivoli gardens, thousands waiting
sh(10, 0, (t, u, lt) => { camPath([0, -200, 0.75], [0, 450, 1.0], u); tivoli(t, { look: -0.2 }); screen(() => { const a = seg(lt, 0.1, 0.4) * (1 - seg(lt, 2.8, 3.2)); g.globalAlpha = a; rr(W / 2 - 220, 220, 440, 280, 16); ol('#fbf7ea', 10); rr(W / 2 - 220, 220, 440, 86, 16); ol('#c0392b', 10); txt('JULIO 1819', W / 2, 263, 46, '#fff', 0); txt('6', W / 2, 408, 140, OUT, 0); g.globalAlpha = 1; }); });
// P11 before boarding: "this will be my last flight"
sh(11, 0, (t, u, lt) => { camPath([0, 500, 1.35], [40, 480, 1.55], u); tivoli(t, { crowd: false }); L(1, () => { balloon(260, 900, 1.3, t, {}); person(-200, 980, 620, SOPHIE, pose('point', t, { armR: -2.5, elbR: 0.2 }), { expr: 'happy', talk: true, look: 0.5 }, t); }); screen(() => { if (u > 0.3) { rr(110, 330, 520, 150, 30); ol('#fff', 7); txt('ÚLTIMO VUELO', 370, 405, 50, OUT, 0); } }); });
// P12 the wind drifts her away... she lights the fireworks
sh(12, 0, (t, u, lt) => { const x = lerp(-300, 300, u); camTo(x * 0.6, -100, 0.9); nightSky(t); L(0.6, () => { for (let i = 0; i < 8; i++) building(-1600 + i * 420, 1300, 400, 600 + R(i) * 300, { col: '#5e5674', lit: true, lw: 4 }); }); L(1, () => balloon(x, 250, 1.15, t, { who: SOPHIE, works: seg(u, 0.45, 0.8), face: { expr: 'grin' }, pose: pose('point', t, { armR: -0.4 }) })); screen(() => wind(t, 8, 0.6)); });
// P13 then, on top of the balloon... flames
sh(13, 0, (t, u, lt) => { camPath([0, -100, 1.0], [0, -380, 1.6], u); nightSky(t); L(1, () => balloon(0, 300, 1.2, t, { who: SOPHIE, works: 1, fire: seg(u, 0.2, 0.9), face: { expr: u > 0.6 ? 'shock' : 'grin' } })); screen(() => { const k = seg(u, 0.3, 1); g.fillStyle = `rgba(255,120,30,${0.15 * k})`; g.fillRect(0, 0, W, H); }); }, 1);
// P14 from below someone shouts "Bravo! how beautiful!"
sh(14, 0, (t, u, lt) => { camPath([0, 500, 1.2], [0, 520, 1.35], u); tivoli(t, { pose: (i) => (i % 2 ? 'clap' : 'point'), expr: () => 'laugh', look: -0.2 }); L(0.3, () => { g.save(); g.translate(500, -700); flames(0, 0, 0.6, t); g.restore(); circ(500, -560, 60); ol('#f2d45c', 4); });
  screen(() => { const k = back(seg(lt, 0.2, 0.5)); g.save(); g.translate(W / 2 - 60, 700); g.scale(k, k); rr(-260, -90, 520, 180, 40); ol('#fff', 8); poly([[-40, 85], [40, 85], [-80, 160]]); ol('#fff', 0); txt('¡BRAVO!', 0, 0, 96, '#c0392b', 0); g.restore(); }); });
// P15 she throws ballast to slow the fall (burning, descending)
sh(15, 0, (t, u, lt) => { const y = 150 + u * 400; camTo(0, y - 300, 1.1); nightSky(t); L(0.6, () => { for (let i = 0; i < 8; i++) building(-1600 + i * 420, 1400 - u * 300, 400, 700 + R(i) * 300, { col: '#5e5674', lit: true, lw: 4 }); });
  L(1, () => { balloon(0, y, 1.2, t, { who: SOPHIE, fire: 1, col: '#c9a24a', pose: pose('carry', t, { armR: -1.6 }), face: { expr: 'scared' }, ballast: true }); for (let i = 0; i < 3; i++) { const d = lt - 0.4 - i * 0.35; if (d > 0) { rr(-140 + i * 40, y - 40 + d * d * 1600, 34, 44, 8); ol('#c9b38a', 4); } } }); screen(() => speedLines(t, 'v', 0.4)); }, 1);
// P16 the basket hits a roof on Rue de Provence... she falls (cut away: crowd reaction + hat)
sh(16, 0, (t, u, lt) => { camPath([0, 250, 0.85], [0, 300, 0.95], u); street(t, { night: true, sign: true }); const hit = 0.8; shakeAt(t, t - lt + hit, 30);
  L(1, () => { const k = seg(lt, 0, hit); balloon(lerp(500, 380, k), lerp(-1200, -400, easeIn(k)), 1.0, t, { fire: 1, col: '#8a6a3a', rot: lt > hit ? 0.5 : 0 }); if (lt > hit) puff(330, -360, 1.4, (lt - hit) / 1.2, '#6a6478'); });
  L(1.1, () => { if (u > 0.5) { person(-420, 1150, 640, CROWD[2], pose('cover', t), { expr: 'closed' }, t); person(260, 1150, 640, CROWD[4], pose('shock', t), { expr: 'shock' }, t, true); } }); }, 1);
sh(16, 0.62, (t, u, lt) => { fx({ sepia: 0.6 }); camPath([0, 820, 1.7], [0, 840, 1.9], u); street(t, { night: true }); L(1, () => { const k = easeOut(seg(lt, 0, 1.1)); g.save(); g.translate(lerp(-600, 60, k), 960 - Math.abs(Math.sin(lt * 7)) * 50 * Math.exp(-lt * 2)); g.rotate(-lt * 3 * (1 - k)); ell(0, 0, 90, 18); ol('#f4ecdc'); g.beginPath(); g.arc(0, -10, 50, Math.PI, 0); g.closePath(); ol('#f4ecdc'); g.beginPath(); g.moveTo(20, -50); g.bezierCurveTo(60, -130, 110, -90, 90, -40); g.closePath(); ol('#e05a7a', 5); g.restore(); }); });
// P17 feared carriages... killed by her own show (dawn street, carriage passes the hat)
sh(17, 0, (t, u, lt) => { fx({ sepia: 0.4 }); camPath([0, 600, 1.25], [0, 620, 1.1], u); street(t); L(1, () => { g.save(); g.translate(60, 960); ell(0, 0, 90, 18); ol('#f4ecdc'); g.beginPath(); g.arc(0, -10, 50, Math.PI, 0); g.closePath(); ol('#f4ecdc'); g.restore(); carriage(lerp(-1900, 1700, u), 960, 1.0, t, 1); }); });
// P18 if someone tells you it's dangerous... listen
sh(18, 0, (t, u, lt) => { camPath([0, 300, 1.3], [0, 300, 1.45], u); hall(t); L(1, () => { person(-200, 820, 640, ADV1, pose('point', t, { armR: -1.4 }), { expr: 'talk', talk: true, look: 0.8 }, t); g.save(); g.translate(260, 300); g.rotate(Math.sin(t * 6) * 0.06); poly([[0, -150], [140, 100], [-140, 100]]); ol('#ffd23f', 10); txt('!', 0, 30, 160, OUT, 0); g.restore(); }); });
// P19 would you have gotten into that balloon? (push into the basket)
sh(19, 0, (t, u, lt) => { camPath([0, -150, 0.9], [0, 160, 2.6], u, easeIn); nightSky(t); L(1, () => balloon(0, 300, 1.3, t, { works: 0.6 })); });
