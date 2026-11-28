// Dick Wertheim — US Open, Nueva York, 10 sep 1983: juez de línea golpeado por un saque desviado, cayó de su silla (engine4). Death never shown.
import { K, W, H, OUT, clamp, lerp, ease, easeIn, easeOut, back, R, seg, ol, rr, circ, ell, line, poly, txt, L, screen, camTo, camPath, shakeAt, handheld,
  person, pose, mixPose, cloud, bird, lamp, puff, speedLines, sky, wind } from './engine.js';
import { PH, st, en, dur, sh, fx, crowdRow, clouds, birds } from './lib.js';
export { FRAMES, frame, post, blurN } from './lib.js';
const g = K.g;
// ---------- cast (own designs) ----------
const DICK = { skin: '#f0c8a4', hair: '#c8c8c8', hairStyle: 'bald', jacket: '#24365e', shirt: '#f6f6f6', tie: '#b8323a', pants: '#e8e4da', shoes: '#3a2a22', glasses: true, seed: 1 };
const KID = { skin: '#f4d2b4', hair: '#e8c66a', hairStyle: 'side', shirt: '#fafafa', pants: '#fafafa', shoes: '#f0f0f0', seed: 2 };
const RIVAL = { skin: '#e0a97f', hair: '#3a2a1a', hairStyle: 'curly', shirt: '#f2d24a', pants: '#fafafa', shoes: '#f0f0f0', seed: 3 };
const DOC = { skin: '#8a5a3c', hair: '#141414', hairStyle: 'side', jacket: '#f4f4f4', shirt: '#cfe6f2', pants: '#2a4a7a', shoes: '#111', seed: 4 };
const JUDGE2 = { skin: '#c98e62', hair: '#2b1d14', hairStyle: 'side', jacket: '#24365e', shirt: '#f6f6f6', tie: '#b8323a', pants: '#e8e4da', shoes: '#222', seed: 5 };
const FANS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({ skin: ['#f2c9a0', '#e0a97f', '#c98e62', '#f5d2b3', '#8a5a3c', '#b97f58'][i % 6], hair: ['#2b1d14', '#c9a24a', '#141414', '#7a5a3a', '#5a3b22'][i % 5],
  hairStyle: ['side', 'curly', 'bun', 'side', 'bald'][i % 5], hat: i % 3 === 0 ? 'cap' : null, hatColor: ['#c0392b', '#2f6db5', '#27ae60'][i % 3], jacket: ['#e74c3c', '#3498db', '#27ae60', '#9b59b6', '#f39c12'][i % 5], shirt: '#fff', pants: '#2d3a55', shoes: '#222', seed: 40 + i }));
const FLOOR = 960, HP = 560, KS = HP / 300; // person height; sitting: origin = floor + 44*KS
const SITY = FLOOR + 44 * KS;
const DY = 110, ZM = 1.12; const CP = (a, b, u, e) => camPath([a[0], a[1] + DY, a[2] * ZM], [b[0], b[1] + DY, b[2] * ZM], u, e);
// ---------- helpers ----------
function tag(a = 1) { screen(() => { g.globalAlpha = a; rr(40, 150, 470, 70, 16); ol('rgba(20,15,30,0.8)', 5); txt('MUERTES ABSURDAS #44', 275, 186, 34, '#ffd23f', 0); g.globalAlpha = 1; }); }
function popText(s1, y, lt, t0 = 0, col = '#fff', size = 90) { const k = back(seg(lt, t0, t0 + 0.25)); if (k <= 0) return; screen(() => { g.save(); g.translate(W / 2, y); g.scale(k, k); txt(s1, 0, 0, size, col, 16); g.restore(); }); }
function card(s1, s2, a, y = 330) { if (a <= 0) return; screen(() => { g.globalAlpha = a; rr(110, y - 80, 860, 160, 24); ol('#fbf7ea', 6); txt(s1, W / 2, y - 22, 58, '#24365e', 0); if (s2) txt(s2, W / 2, y + 42, 38, '#b8323a', 0, 'center', '700'); g.globalAlpha = 1; }); }
function tint(c, a) { if (a <= 0) return; screen(() => { g.fillStyle = c; g.globalAlpha = a; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }); }
function ball(x, y, s = 1, spin = 0) { g.save(); g.translate(x, y); g.rotate(spin); g.scale(s, s); circ(0, 0, 22); ol('#d8ec3a', 5); g.beginPath(); g.arc(-26, 0, 20, -0.9, 0.9); g.strokeStyle = '#fff'; g.lineWidth = 4; g.stroke(); g.beginPath(); g.arc(26, 0, 20, Math.PI - 0.9, Math.PI + 0.9); g.stroke(); g.restore(); }
function racket(hR, a) { g.save(); g.translate(...hR); g.rotate(a); rr(-6, 0, 12, 60, 5); ol('#3a2a22', 4); ell(0, 100, 34, 44); ol('rgba(255,255,255,0.15)', 7); g.save(); ell(0, 100, 34, 44); g.clip(); for (let k = -3; k <= 3; k++) { line([[k * 10, 50], [k * 10, 150]], 2, '#ddd'); line([[-40, 100 + k * 12], [40, 100 + k * 12]], 2, '#ddd'); } g.restore(); ell(0, 100, 34, 44); ol(null, 7); g.restore(); }
const RK = (P) => (hR) => racket(hR, -((P.armR || 0) + (P.elbR || 0)));
function chair(x, y, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); line([[-60, 0], [-50, -92]], 9, '#8a6a4a'); line([[60, 0], [50, -92]], 9, '#8a6a4a'); line([[-75, -300], [-55, 0]], 9, '#6a4a32'); rr(-70, -105, 150, 22, 6); ol('#a8835a', 6); rr(-95, -300, 30, 170, 10); ol('#a8835a', 6); g.restore(); }
// judge sitting on his chair, whole group tilts back by ang around the rear leg
function judge(x, t, o = {}) {
  const ang = o.ang || 0, P = pose('sit', t, Object.assign({ armL: 0.5, armR: -0.5, elbL: -1.5, elbR: 1.5 }, o.pose || {}));
  g.save(); g.translate(x - 55, FLOOR); g.rotate(-ang); g.translate(-(x - 55), -FLOOR);
  chair(x, FLOOR, 1.15); person(x - 10, SITY, HP, DICK, P, { expr: o.expr || 'neutral', look: o.look ?? 0.5, shadow: false, sweat: o.sweat }, t);
  g.restore();
}
// stadium stands (parallax) + court on the main plane; net at x=0
function stands(t, o = {}) {
  const night = o.night || 0; sky(night ? '#1a2246' : '#8fc0e8', night ? '#3a3060' : '#e8f0f4');
  L(0.08, () => { if (!night) clouds(t, -1200, 5, 1.2); });
  L(0.35, () => { rr(-3000, -900, 6000, 1300, 0); ol('#5a6478', 0);
    for (let r = 0; r < 12; r++) for (let i = 0; i < 70; i++) { const x = -2600 + i * 76 + (r % 2) * 38, y = -820 + r * 100; const c = ['#e74c3c', '#3498db', '#f2f2f2', '#f39c12', '#27ae60', '#9b59b6', '#f2c9a0'][Math.floor(R(i * 13 + r * 7) * 7)];
      const bob = o.still ? 0 : Math.sin(t * 6 + i * 0.7 + r) * 4 * (o.cheer || 0.3); circ(x, y + bob, 24); ol(c, 3); circ(x, y - 30 + bob, 16); ol(['#f2c9a0', '#c98e62', '#8a5a3c', '#f5d2b3'][(i + r) % 4], 3); }
    rr(-3000, 380, 6000, 90, 0); ol('#24365e', 6); for (let i = 0; i < 6; i++) txt('ABIERTO DE EE.UU. · 1983', -2400 + i * 1000, 425, 40, '#fff', 0); });
  L(1, () => { g.fillStyle = '#3f7a4a'; g.fillRect(-4000, 470, 8000, 3000); g.fillStyle = '#4f9a5a'; g.fillRect(-1300, FLOOR - 40, 2600, 1500); line([[-4000, 470], [4000, 470]], 6);
    line([[-1300, FLOOR - 40], [1300, FLOOR - 40]], 10, '#fff'); line([[-1300, FLOOR + 260], [1300, FLOOR + 260]], 10, '#fff'); line([[-1300, FLOOR - 40], [-1300, FLOOR + 260]], 10, '#fff'); line([[1300, FLOOR - 40], [1300, FLOOR + 260]], 10, '#fff');
    line([[-700, FLOOR + 110], [700, FLOOR + 110]], 8, o.hilite ? '#ffd23f' : '#fff'); if (o.hilite) { g.globalAlpha = 0.4 + 0.4 * Math.sin(t * 8); line([[-700, FLOOR + 110], [700, FLOOR + 110]], 22, '#ffd23f'); g.globalAlpha = 1; } });
}
function net(t) { L(1, () => { rr(-12, FLOOR - 220, 24, 260, 4); ol('#2a2a30'); g.save(); poly([[-4, FLOOR - 200], [4, FLOOR - 200], [4, FLOOR + 30], [-4, FLOOR + 30]]); g.restore(); rr(-8, FLOOR - 205, 16, 230, 2); ol('rgba(240,240,240,0.5)', 3); rr(-10, FLOOR - 210, 20, 14, 2); ol('#fff', 3); }); }
function hospital(t, o = {}) { sky('#1a2246', '#4a3a6a'); L(0.1, () => { for (let i = 0; i < 30; i++) { circ(-1400 + R(i) * 2800, -900 + R(i + 1) * 600, 3); ol('#fff', 0); } });
  L(0.4, () => { for (let i = 0; i < 10; i++) { const x = -1600 + i * 330, h = 700 + R(i) * 700; rr(x, 700 - h, 300, h, 2); ol('#2a3050', 4); } });
  L(1, () => { rr(-480, -600, 960, 1560, 4); ol('#e8e4da', 7); for (let f = 0; f < 9; f++) for (let j = 0; j < 4; j++) { rr(-400 + j * 210, -540 + f * 140, 120, 90, 4); ol(R(f * 5 + j) > 0.5 ? '#ffe08a' : '#7f9bb0', 4); }
    rr(-140, -720, 280, 160, 10); ol('#e23b3b', 6); rr(-24, -700, 48, 120, 4); ol('#fff', 0); rr(-60, -664, 120, 48, 4); ol('#fff', 0);
    rr(-300, 700, 600, 100, 12); ol('#24365e', 6); txt('HOSPITAL', 0, 750, 64, '#fff', 0); rr(-120, 800, 240, 160, 6); ol('#ffe08a', 6);
    g.fillStyle = '#4a4a56'; g.fillRect(-3000, FLOOR, 6000, 1600); line([[-3000, FLOOR], [3000, FLOOR]], 7); lamp(-700, FLOOR + 10, 1.3, 1); lamp(700, FLOOR + 10, 1.3, 1); });
}
function ambulance(x, y, t) { g.save(); g.translate(x, y); rr(-300, -300, 420, 250, 16); ol('#fafafa', 7); poly([[120, -220], [230, -220], [300, -130], [300, -50], [120, -50]]); ol('#fafafa', 7); poly([[140, -205], [220, -205], [270, -140], [140, -140]]); ol('#bcdcf0', 5);
  rr(-300, -170, 600, 30, 0); ol('#e23b3b', 0); rr(-110, -270, 40, 100, 4); ol('#e23b3b', 0); rr(-140, -240, 100, 40, 4); ol('#e23b3b', 0);
  const on = Math.sin(t * 18) > 0; rr(-60, -340, 90, 40, 8); ol(on ? '#ff4040' : '#4060ff', 5); if (on) { g.globalAlpha = 0.3; circ(-15, -320, 160); ol('#ff4040', 0); g.globalAlpha = 1; }
  for (const wx of [-180, 180]) { circ(wx, -40, 56); ol('#222', 7); circ(wx, -40, 22); ol('#999', 4); } g.restore(); }
function calendar(x, y, s, lt, d0 = 10, d1 = 15) { g.save(); g.translate(x, y); g.scale(s, s); const n = Math.min(d1, d0 + Math.floor(lt * 2.2)); for (let k = 0; k < 3; k++) { rr(-160 + k * 6, -200 + k * 6, 320, 380, 16); ol('#fbf7ea', 6); } rr(-160, -200, 320, 90, 16); ol('#c0392b', 6); txt('SEP 1983', 0, -155, 46, '#fff', 0); txt(String(n), 0, 30, 170, OUT, 0); g.restore(); }
function court(t, lt) { g.fillStyle = '#4a2e24'; g.fillRect(0, 0, W, H);
  L(0.5, () => { for (let i = -8; i < 8; i++) { rr(i * 260 - 100, -900, 200, 1500, 6); ol('#5a3a2a', 5); } rr(-500, -760, 1000, 200, 12); ol('#c9a24a', 6); txt('TRIBUNAL', 0, -660, 80, '#3a2a1e', 0); });
  L(1, () => { rr(-700, 600, 1400, 360, 16); ol('#6b4a2e', 7); rr(-740, 560, 1480, 60, 10); ol('#8a5a3a', 6);
    const k = back(seg(lt, 0.2, 0.6)); g.save(); g.translate(-150, 520); g.rotate(-0.08); g.scale(k, k); rr(-200, -280, 400, 300, 10); ol('#fbf7ea', 6); txt('DEMANDA', 0, -220, 54, '#c0392b', 0); for (let i = 0; i < 5; i++) line([[-160, -150 + i * 34], [150 - R(i) * 120, -150 + i * 34]], 6, '#8a9aa6'); txt('$2,250,000', 0, -10, 46, OUT, 0); g.restore();
    const hit = Math.max(0, Math.sin(lt * 5)); g.save(); g.translate(330, 520); g.rotate(-0.6 * hit); rr(-14, -10, 28, 200, 6); ol('#7a4a2e', 5); rr(-80, -70, 160, 70, 14); ol('#8a5a3a', 6); g.restore(); rr(240, 540, 180, 30, 8); ol('#6b4a2e', 5); });
}
// poses
const P_TOSS = (t, k) => pose('stand', t, { armL: lerp(0.3, 2.9, k), elbL: 0, armR: lerp(-0.3, -2.2, k), elbR: lerp(0, -1.6, k), lean: -0.05 * k });
const P_HIT = (t, k) => pose('stand', t, { armL: lerp(2.9, 0.6, k), elbL: lerp(0, -0.8, k), armR: lerp(-2.6, -0.4, k), elbR: lerp(-1.6, 0.2, k), lean: lerp(-0.05, 0.22, k), legR: -0.3 * k, kneeR: 0.4 * k });
const BOUNCE = (t) => pose('stand', t, { armL: 0.5 + Math.max(0, Math.sin(t * 7)) * 0.3, elbL: -1.0, armR: -0.4, elbR: -0.4, kneeL: 0.25, kneeR: 0.25, lean: 0.12 });
// ---------- shots ----------
// P0 hook (2 shots): serve flies -> judge on chair is hit, chair tips; then giant ball at camera
sh(0, 0, (t, u, lt) => { CP([260, 560, 1.15], [230, 540, 1.3], u); stands(t, { cheer: 0.6 }); net(t);
  const hitT = 0.55, k = seg(lt, 0, hitT); L(1, () => { judge(260, t, { ang: 0.5 * easeOut(seg(lt, hitT, hitT + 0.9)), expr: lt > hitT ? 'shock' : 'neutral', look: -0.6, pose: lt > hitT ? { armL: 2.3, armR: -2.3, elbL: 0.3, elbR: -0.3 } : {} }); if (lt < hitT + 0.05) ball(lerp(-400, 300, k), lerp(600, 780, k), 1.3, lt * 20); else puff(300, 780, 0.5, seg(lt, hitT, hitT + 0.8), '#fff'); });
  shakeAt(t, t - lt + hitT, 34); popText('MIRABA PELOTAS…', 470, lt, 0.05, '#fff', 96); tag(); }, 1);
sh(0, 0.6, (t, u, lt) => { tint('#2a4a6a', 1); speedLines(t, 'v', 0.8); screen(() => { const k = easeOut(seg(lt, 0, 0.8)); ball(W / 2, 1000, lerp(2, 11, k), lt * 6); }); shakeAt(t, t - lt + 0.25, 26); popText('…Y UNA LO MATÓ', 470, lt, 0.1, '#ff6b6b', 100); tag(); }, 1);
// P1 not a player, didn't even move: players run behind, he sits frozen
sh(1, 0, (t, u, lt) => { CP([200, 560, 1.0], [240, 540, 1.15], u); stands(t); net(t); L(1, () => { const rx = -700 + Math.sin(t * 2.5) * 260; person(rx, FLOOR, 520, RIVAL, pose('run', t), { expr: 'determined' }, t, Math.cos(t * 2.5) < 0); judge(420, t, { expr: 'neutral', look: Math.sin(t * 2.5) * -0.8 }); });
  card('NO ERA JUGADOR', 'NI SIQUIERA SE MOVÍA', seg(u, 0.35, 0.55), 330); });
// P2 New York 1983, the US Open: tilt down from the sky onto the stadium
sh(2, 0, (t, u, lt) => { camPath([0, -500, 0.85], [0, 720, 1.05], u); stands(t, { cheer: 0.8 }); net(t); L(1, () => { const P = BOUNCE(t); person(-330, FLOOR, 500, KID, P, { expr: 'determined', look: 0.6, hold: RK(P) }, t); person(330, FLOOR, 500, RIVAL, pose('stand', t, { kneeL: 0.3, kneeR: 0.3, lean: 0.15 }), { expr: 'determined', look: -0.6 }, t, true); }); L(0.12, () => birds(t, -600, -700, 5, 1.2)); card('NUEVA YORK · 1983', 'ABIERTO DE EE.UU.', seg(lt, 0.2, 0.5), 300); });
// P3 who: he walks to his chair, name card
sh(3, 0, (t, u, lt) => { const x = lerp(-200, 330, ease(seg(u, 0, 0.85))); camTo(x * 0.8 + 40, 670, 1.3); stands(t); net(t); L(1, () => { chair(420, FLOOR, 1.15); person(x, FLOOR, HP, DICK, pose(u < 0.85 ? 'walk' : 'stand', t), { expr: 'happy', look: 0.4 }, t); });
  card('DICK WERTHEIM', 'JUEZ DE LÍNEA · ~60 AÑOS', seg(lt, 0.1, 0.4), 330); });
// P4 job: sit by the net, watch the centre line (line glows)
sh(4, 0, (t, u, lt) => { CP([300, 600, 1.2], [120, 640, 0.95], u); stands(t, { hilite: u > 0.45 }); net(t); L(1, () => judge(260, t, { expr: 'determined', look: -0.8 })); popText('LÍNEA CENTRAL', 420, lt, dur(4) * 0.5, '#ffd23f', 80); });
// P5 the kid: Swedish 17-year-old bouncing the ball at the baseline
sh(5, 0, (t, u, lt) => { CP([-900, 580, 1.25], [-900, 540, 1.4], u); stands(t); L(1, () => { const P = BOUNCE(t); person(-900, FLOOR, 540, KID, P, { expr: 'determined', look: 0.6, hold: RK(P) }, t); const by = FLOOR - 40 - Math.abs(Math.sin(t * 7)) * 220; ball(-830, by, 1.0, t * 4); });
  card('STEFAN EDBERG', 'SUECIA · 17 AÑOS', seg(lt, 0.3, 0.6), 330); });
// P6 legend today vs nervous junior: trophy pops, then sweat + shaking
sh(6, 0, (t, u, lt) => { CP([-900, 540, 1.4], [-900, 500, 1.6], u); stands(t); const nerv = u > 0.5; L(1, () => { const P = nerv ? pose('stand', t, { armL: 0.6, elbL: -1.4, armR: -0.4, tilt: Math.sin(t * 30) * 0.03 }) : pose('proud', t); person(-900, FLOOR, 540, KID, P, { expr: nerv ? 'worried' : 'happy', sweat: nerv, hold: RK(P) }, t);
    if (!nerv) { const k = back(seg(lt, 0.1, 0.4)); g.save(); g.translate(-700, 560); g.scale(k, k); poly([[-60, -120], [60, -120], [40, -20], [-40, -20]]); ol('#e8c34a', 6); rr(-12, -20, 24, 60, 4); ol('#e8c34a', 5); rr(-50, 40, 100, 26, 6); ol('#8a6a1a', 5); g.restore(); } });
  popText(nerv ? 'JUVENIL NERVIOSO' : 'LEYENDA', 420, nerv ? lt - dur(6) * 0.5 : lt, 0.05, nerv ? '#7fd0ff' : '#ffd23f', 84); });
// P7 the serve: toss + full swing, ball shoots off
sh(7, 0, (t, u, lt) => { CP([-860, 520, 1.35], [-760, 500, 1.2], u); stands(t, { cheer: 0.2 }); const kT = ease(seg(u, 0, 0.45)), kH = easeIn(seg(u, 0.5, 0.62));
  L(1, () => { const P = u < 0.5 ? P_TOSS(t, kT) : P_HIT(t, kH); person(-900, FLOOR, 540, KID, P, { expr: 'determined', look: -0.3, hold: RK(P) }, t);
    if (u < 0.6) ball(-930, lerp(620, 120, easeOut(seg(u, 0.05, 0.5))) + (u > 0.5 ? (u - 0.5) * 2000 : 0), 1.0, t * 3); else ball(lerp(-850, 300, seg(u, 0.6, 0.8)), lerp(260, 700, seg(u, 0.6, 0.8)), 1.0, t * 30); });
  if (u > 0.6) speedLines(t, 'h', 0.7); shakeAt(t, st(7) + dur(7) * 0.6, 14); }, 1);
// P8 the serve curves away: ball path bends, red "!"
sh(8, 0, (t, u, lt) => { CP([-200, 560, 0.85], [100, 560, 0.9], u); stands(t); net(t); L(1, () => { for (let k = 0; k < 18; k++) { const v = (k / 18) * u; ball(lerp(-900, 300, v), FLOOR - 450 + Math.sin(v * 2.4) * 260 + v * 300, 0.6 * (k / 18), 0); } ball(lerp(-900, 300, u), FLOOR - 450 + Math.sin(u * 2.4) * 260 + u * 300, 1.2, t * 20); judge(360, t, { look: -0.8 }); });
  popText('¡SE DESVIÓ!', 420, lt, dur(8) * 0.35, '#ff6b6b', 96); }, 1);
// P9 straight at him: camera rides the ball to the judge
sh(9, 0, (t, u, lt) => { const bx = lerp(-500, 330, easeIn(u)); camTo(lerp(-300, 260, ease(u)), 690, lerp(1.12, 1.5, u)); stands(t); net(t); L(1, () => { judge(400, t, { expr: u > 0.6 ? 'shock' : 'neutral', look: -0.8 }); ball(bx, lerp(560, 760, u), 1.3, t * 25); });
  if (u > 0.3) speedLines(t, 'h', 0.6); }, 1);
// P10 hit where it hurts: cut to his face, star burst, ouch
sh(10, 0, (t, u, lt) => { camPath([400, 380, 2.1], [400, 360, 2.3], u); stands(t); L(1, () => judge(400, t, { expr: lt > 0.3 ? 'pain' : 'shock', look: 0, sweat: lt > 0.3, pose: { armL: 0.2, armR: -0.2, elbL: -2.4, elbR: 2.4, lean: 0.25 } })); shakeAt(t, t - lt + 0.25, 30);
  screen(() => { const k = back(seg(lt, 0.25, 0.5)); if (k <= 0) return; g.save(); g.translate(W / 2 + 120, 1820); g.scale(k, k); g.rotate(t * 0.8); g.beginPath(); for (let i = 0; i < 16; i++) { const r = i % 2 ? 70 : 170, a = i * Math.PI / 8; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); ol('#ffd23f', 8); g.restore(); }); popText('¡AUCH!', 420, lt, 0.3, '#ffd23f', 130); });
// P11 pushed back, the chair tips
sh(11, 0, (t, u, lt) => { CP([360, 560, 1.25], [330, 600, 1.15], u); stands(t, { still: 1 }); net(t); const k = easeIn(seg(u, 0.15, 0.85)); L(1, () => judge(400, t, { ang: 0.9 * k, expr: 'scared', look: 0, pose: { armL: 2.4 * k + 0.3, armR: -2.4 * k - 0.3, elbL: 0.2, elbR: -0.2 } })); }, 1);
// P12 here everything went wrong: freeze mid-tip, red tint, snap zoom
sh(12, 0, (t, u, lt) => { CP([330, 560, 1.3], [300, 520, 1.7], u, easeOut); stands(t, { still: 1 }); L(1, () => judge(400, t, { ang: 0.95, expr: 'scared', look: 0, pose: { armL: 2.7, armR: -2.7, elbL: 0.2, elbR: -0.2 } })); tint('#a01020', 0.2 * u); shakeAt(t, t - lt + 0.05, 20); popText('AQUÍ TODO SALIÓ MAL', 420, lt, 0.1, '#ff6b6b', 76); });
// P13 the fall happens off-frame: low shot on the court, dust puff + glasses slide into view (no impact shown)
sh(13, 0, (t, u, lt) => { camPath([200, 1000, 1.5], [220, 1020, 1.7], u); stands(t, { still: 1 }); L(1, () => { const k = seg(u, 0.2, 0.7); puff(330, FLOOR + 40, 0.9, seg(u, 0.25, 0.9), '#e8e8e0'); g.save(); g.translate(lerp(330, 40, easeOut(k)), FLOOR + 60); g.rotate(k * 3); for (const sx of [-1, 1]) { circ(sx * 26, 0, 22); ol(null, 6); } line([[-6, 0], [6, 0]], 5); g.restore(); ball(lerp(500, -100, u), FLOOR + 30, 1.1, -u * 12); }); popText('CEMENTO', 420, lt, dur(13) * 0.5, '#fff', 90); shakeAt(t, st(13) + dur(13) * 0.25, 24); }, 1);
// P14 stadium in silence: crowd frozen, hands on mouths; slow push
sh(14, 0, (t, u, lt) => { camPath([0, 700, 0.9], [0, 760, 1.05], u); stands(t, { still: 1 }); L(1.2, () => crowdRow(t, -900, 1650, 8, 520, 260, { cast: FANS, pose: (i) => i % 2 ? 'cover' : 'shock', expr: () => 'scared', talk: false, breath: false })); tint('#101030', 0.18); popText('SILENCIO', 420, lt, 0.3, '#fff', 100); });
// P15 hospital: ambulance pulls away, siren
sh(15, 0, (t, u, lt) => { camPath([-200, 560, 0.95], [200, 560, 1.05], u); hospital(t); L(1.05, () => ambulance(lerp(-900, 250, ease(seg(u, 0, 0.8))), FLOOR + 220, t)); card('FLUSHING · NUEVA YORK', 'INCONSCIENTE', seg(lt, 0.3, 0.6), 300); });
// P16 five days later: calendar 10 -> 15 sep, sepia, empty chair
sh(16, 0, (t, u, lt) => { fx({ sepia: 0.6 }); camPath([300, 580, 1.15], [300, 600, 1.3], u); stands(t, { still: 1 }); net(t); L(1, () => chair(400, FLOOR, 1.15)); screen(() => calendar(W / 2, 700, 1.0, lt)); });
// P17 the family sued: courtroom, gavel, lawsuit paper
sh(17, 0, (t, u, lt) => { camPath([0, 250, 0.85], [40, 300, 1.0], u); court(t, lt); });
// P18 since then: modern court, judge STANDING by the net; empty chair crossed out
sh(18, 0, (t, u, lt) => { CP([200, 560, 1.05], [300, 540, 1.2], u); stands(t); net(t); L(1, () => { chair(560, FLOOR, 1.15); const k = back(seg(u, 0.45, 0.65)); if (k > 0) { g.save(); g.translate(560, FLOOR - 160); g.scale(k, k); line([[-120, -120], [120, 120]], 40, OUT); line([[120, -120], [-120, 120]], 40, OUT); line([[-120, -120], [120, 120]], 26, '#e23b3b'); line([[120, -120], [-120, 120]], 26, '#e23b3b'); g.restore(); }
  person(250, FLOOR, HP, JUDGE2, pose('stand', t, { armL: 0.2, armR: -0.2 }), { expr: 'determined', look: -0.6 }, t); }); card('YA NO SE SIENTAN', 'JUNTO A LA RED', seg(u, 0.15, 0.35), 330); });
// P19 question: ball spins over the empty chair
sh(19, 0, (t, u, lt) => { CP([350, 600, 1.2], [380, 620, 1.5], u, easeIn); stands(t, { night: 0 }); net(t); L(1, () => chair(420, FLOOR, 1.15)); screen(() => { ball(W / 2, 1250 + Math.sin(t * 3) * 30, 4, t * 2); const k = back(seg(lt, 0.4, 0.7)); g.save(); g.translate(W / 2, 400); g.scale(k, k); txt('¿TE HABRÍAS SENTADO?', 0, 0, 74, '#ffd23f', 14); g.restore(); }); tag(); });
