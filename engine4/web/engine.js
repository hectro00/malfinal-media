// Mal Final "toon" engine v4 — everything (sets, props, people, fx) drawn as one consistent flat-cartoon vector world.
// Parallax layers + eased camera + jointed character rig + sub-frame motion blur. Contract: window.FRAMES, window.ready, window.renderFrame(f).
const qs = new URLSearchParams(location.search);
const OW = +(qs.get('w') || 1080), OH = Math.round(OW * 16 / 9);
export const W = 1080, H = 1920, OUT = '#1d1b22';
const cv = document.createElement('canvas'); cv.width = OW; cv.height = OH; const g = cv.getContext('2d');
const acc = document.createElement('canvas'); acc.width = OW; acc.height = OH; const ag = acc.getContext('2d');
document.body.appendChild(acc);
export const K = { g, W, H, OUT, cam: { x: 0, y: 0, z: 1, rot: 0 }, shake: [0, 0], t: 0 };
// ---------- math ----------
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, u) => a + (b - a) * u;
export const ease = (x) => { x = clamp(x); return x * x * x * (x * (6 * x - 15) + 10); };
export const easeIn = (x) => { x = clamp(x); return x * x * x; };
export const easeOut = (x) => { x = clamp(x); return 1 - (1 - x) ** 3; };
export const back = (x) => { x = clamp(x); const c = 1.7; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2; };
export const R = (k) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const seg = (u, a, b) => clamp((u - a) / (b - a));
// ---------- drawing primitives ----------
export function ol(fill, lw = 6) { if (fill) { g.fillStyle = fill; g.fill(); } if (lw) { g.strokeStyle = OUT; g.lineWidth = lw; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(); } }
export function rr(x, y, w, h, r = 8) { g.beginPath(); g.roundRect(x, y, w, h, r); }
export function circ(x, y, r) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); }
export function ell(x, y, rx, ry, a = 0) { g.beginPath(); g.ellipse(x, y, Math.abs(rx), Math.abs(ry), a, 0, Math.PI * 2); }
export function line(pts, lw = 6, col = OUT) { g.beginPath(); g.moveTo(...pts[0]); for (const p of pts.slice(1)) g.lineTo(...p); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(); }
export function poly(pts) { g.beginPath(); g.moveTo(...pts[0]); for (const p of pts.slice(1)) g.lineTo(...p); g.closePath(); }
export function txt(s, x, y, size, col = '#fff', o = 10, align = 'center', font = '900') { g.font = `${font} ${size}px Poppins`; g.textAlign = align; g.textBaseline = 'middle'; g.lineJoin = 'round'; if (o) { g.strokeStyle = OUT; g.lineWidth = o; g.strokeText(s, x, y); } g.fillStyle = col; g.fillText(s, x, y); }
// layer: p = parallax depth (0 = sky at infinity, 1 = main plane, >1 = foreground)
export function L(p, fn) {
  const c = K.cam; g.save(); g.translate(W / 2 + K.shake[0] * p, H / 2 + K.shake[1] * p); g.rotate(c.rot * Math.min(1, p));
  const z = Math.pow(c.z, p); g.scale(z, z); g.translate(-c.x * p, -c.y * p); fn(g); g.restore();
}
export function screen(fn) { g.save(); fn(g); g.restore(); }
export function camTo(x, y, z = 1, rot = 0) { Object.assign(K.cam, { x, y, z, rot }); }
export function camPath(a, b, u, e = ease) { const k = e(u); camTo(lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.exp(lerp(Math.log(a[2] || 1), Math.log(b[2] || 1), k)), lerp(a[3] || 0, b[3] || 0, k)); }
export function shakeAt(t, t0, amt = 30, decay = 6) { const d = t - t0; if (d < 0 || d > 1.5) return; const a = amt * Math.exp(-decay * d); K.shake[0] += Math.sin(d * 71) * a; K.shake[1] += Math.cos(d * 53) * a * 0.8; }
export function handheld(t, a = 6) { K.shake[0] += Math.sin(t * 1.3) * a + Math.sin(t * 3.7) * a * 0.3; K.shake[1] += Math.sin(t * 1.1 + 2) * a * 0.8; }

// ---------- character rig ----------
// d: design {skin,hair,hairStyle,hat,hatColor,shirt,jacket,pants,shoes,tie,mustache,beard,glasses,coat(long),suit(Franz),dummy}
// p: pose joints (radians) {lean,bob,legL,legR,kneeL,kneeR,armL,armR,elbL,elbR,tilt,jump}; s: {expr,talk,look,wing,canopy,wrap,flap,sweat}
export const POSES = {
  stand: {}, point: { armR: -1.5, elbR: 0 }, shock: { armL: 2.5, armR: -2.5, elbL: 0.3, elbR: -0.3 },
  plead: { armL: 1.0, armR: -1.0, elbL: -1.7, elbR: 1.7, lean: 0.12, kneeL: 0.25, kneeR: 0.25 },
  no: { armR: -1.1, elbR: -1.3, armL: 0.15 }, proud: { armL: 0.55, armR: -0.55, elbL: -2.3, elbR: 2.3, lean: -0.06 },
  wings: { armL: 1.45, armR: -1.45, elbL: 0.05, elbR: -0.05 }, crouch: { armL: 0.9, armR: -0.9, elbL: -0.4, elbR: 0.4, lean: 0.25, kneeL: 1.3, kneeR: 1.3, legL: -0.55, legR: -0.55, bob: -40 },
  leap: { armL: 2.6, armR: -2.6, elbL: 0.1, elbR: -0.1, lean: -0.1, legL: 0.25, legR: -0.35, kneeL: 0.3, kneeR: 0.2 },
  rail: { armL: 1.3, armR: -1.3, elbL: 0.1, elbR: -0.1, legR: -1.25, kneeR: 1.55, lean: -0.04 },
  wrap: { armL: 0.05, armR: -0.05, elbL: -0.2, elbR: 0.2, legL: 0.05, legR: -0.05 },
  sit: { legL: -1.5, legR: -1.5, kneeL: 1.5, kneeR: 1.5, armL: 0.4, armR: -0.4, elbL: -0.8, elbR: 0.8 },
  write: { armL: 0.7, armR: -0.4, elbL: -1.9, elbR: 1.6 }, carry: { armL: 0.9, armR: -0.9, elbL: -1.2, elbR: 1.2 },
  stamp: { armR: -2.9, elbR: -0.2 }, think: { armR: -0.5, elbR: 2.5, armL: 0.6, elbL: -1.6, tilt: 0.12 },
  cover: { armL: 0.9, armR: -0.9, elbL: -2.6, elbR: 2.6, kneeL: 0.2, kneeR: 0.2, lean: 0.1 },
};
export function pose(name, t = 0, extra = {}) {
  const P = Object.assign({ lean: 0, bob: 0, legL: 0, legR: 0, kneeL: 0, kneeR: 0, armL: 0.14, armR: -0.14, elbL: 0, elbR: 0, tilt: 0, jump: 0 }, POSES[name] || {});
  const ph = t * Math.PI * 2;
  if (name === 'stand' || name === 'proud' || name === 'plead' || name === 'think') { P.bob += Math.sin(ph * 0.5) * 3; P.armL += Math.sin(ph * 0.5) * 0.03; P.armR -= Math.sin(ph * 0.5) * 0.03; }
  if (name === 'plead') { P.armL += Math.sin(ph * 1.6) * 0.15; P.armR -= Math.sin(ph * 1.6) * 0.15; }
  if (name === 'walk') { const a = Math.sin(ph); P.legL = a * 0.45; P.legR = -a * 0.45; P.kneeL = Math.max(0, -Math.cos(ph)) * 0.5; P.kneeR = Math.max(0, Math.cos(ph)) * 0.5; P.armL = -a * 0.45 + 0.12; P.armR = a * 0.45 - 0.12; P.elbL = -0.3; P.elbR = 0.3; P.bob = Math.abs(Math.cos(ph)) * 7; }
  if (name === 'run') { const a = Math.sin(ph * 1.5); P.legL = a * 0.8; P.legR = -a * 0.8; P.kneeL = 0.3 + Math.max(0, -Math.cos(ph * 1.5)) * 1.1; P.kneeR = 0.3 + Math.max(0, Math.cos(ph * 1.5)) * 1.1; P.armL = -a * 0.9; P.armR = a * 0.9; P.elbL = -1.3; P.elbR = 1.3; P.bob = Math.abs(Math.cos(ph * 1.5)) * 14; P.lean = -0.2; }
  if (name === 'climb') { const a = Math.sin(ph); P.legL = -0.5 - a * 0.45; P.legR = -0.5 + a * 0.45; P.kneeL = 0.9 + a * 0.5; P.kneeR = 0.9 - a * 0.5; P.armL = 0.3 + a * 0.3; P.armR = -0.6 + a * 0.3; P.elbL = -0.6; P.elbR = 0.6; P.lean = -0.18; P.bob = Math.abs(Math.cos(ph)) * 10; }
  if (name === 'shock') { P.jump = Math.abs(Math.sin(ph * 1.5)) * 6; P.armL += Math.sin(ph * 3) * 0.08; P.armR -= Math.sin(ph * 3) * 0.08; }
  if (name === 'clap') { const a = (Math.sin(ph * 3) + 1) / 2; P.armL = 0.9 + a * 0.25; P.armR = -0.9 - a * 0.25; P.elbL = -1.4 - a * 0.3; P.elbR = 1.4 + a * 0.3; P.bob = a * 3; }
  if (name === 'no') { P.tilt = Math.sin(ph * 2.2) * 0.16; P.armR += Math.sin(ph * 2.2) * 0.25; }
  if (name === 'fall') { P.armL = 2.4 + Math.sin(ph * 4) * 0.5; P.armR = -2.4 - Math.cos(ph * 4.3) * 0.5; P.legL = 0.5 + Math.sin(ph * 3.6) * 0.5; P.legR = -0.5 - Math.sin(ph * 3.1) * 0.5; P.kneeL = 0.6; P.kneeR = 0.6; }
  if (name === 'crank') { P.armR = -0.9 + Math.sin(ph * 2) * 0.35; P.elbR = 1.2 + Math.cos(ph * 2) * 0.5; P.armL = 0.4; P.elbL = -1.2; P.lean = 0.12; }
  if (name === 'wings' || name === 'rail') { P.armL += Math.sin(ph * 2.5) * 0.06; P.armR -= Math.sin(ph * 2.7) * 0.06; }
  if (name === 'cover') { P.bob += Math.sin(ph * 2.5) * 2; }
  return Object.assign(P, extra);
}
export function mixPose(a, b, u) { const o = {}; for (const k in a) o[k] = lerp(a[k], b[k] ?? a[k], u); return o; }

// draw person with feet at (x,y), total height h px (world units). flip mirrors.
export function person(x, y, h, d, P, s = {}, t = 0, flip = false) {
  g.save(); g.translate(x, y - (P.jump || 0) * h / 300); g.scale((flip ? -1 : 1) * h / 300, h / 300); g.lineJoin = 'round'; g.lineCap = 'round';
  const Hh = 300, hr = Hh * 0.17, lw = 7;
  if (s.shadow !== false) { ell(0, 4, 95, 16); g.fillStyle = 'rgba(20,15,30,0.2)'; g.fill(); }
  g.rotate(P.lean || 0);
  const leg1 = Hh * 0.155, leg2 = Hh * 0.155, hipY = -(leg1 + leg2) - (P.bob || 0) * 0.3, bodyH = Hh * 0.3, neckY = hipY - bodyH, headY = neckY - hr * 0.85, bw = Hh * 0.19;
  const st = (fill) => { g.fillStyle = fill; g.fill(); g.strokeStyle = OUT; g.lineWidth = lw; g.stroke(); };
  const pants = d.pants || '#2d3a55', coat = d.suit ? '#6e5a44' : (d.coat || d.jacket || d.shirt || '#c44');
  // forward kinematics for hands / knees (used by wings)
  const fk = (ox, oy, a1, l1, a2, l2) => { const x1 = ox - Math.sin(a1) * l1, y1 = oy + Math.cos(a1) * l1; const x2 = x1 - Math.sin(a1 + a2) * l2, y2 = y1 + Math.cos(a1 + a2) * l2; return [[x1, y1], [x2, y2]]; };
  const shL = [bw * 0.46, neckY + bodyH * 0.12], shR = [-bw * 0.46, neckY + bodyH * 0.12];
  const ul = Hh * 0.13, ll = Hh * 0.13;
  const [eL, hL] = fk(shL[0], shL[1], -P.armL, ul, -P.elbL, ll), [eR, hR] = fk(shR[0], shR[1], -P.armR, ul, -P.elbR, ll);
  // ----- Franz's flying suit: wings (fabric between arm and leg) + canopy -----
  const wing = s.wing || 0, flap = (k) => Math.sin(t * 22 + k) * 8 * (s.flap ?? 1);
  if (d.suit && wing > 0.02) {
    for (const [sh, el, hd, sx] of [[shL, eL, hL, 1], [shR, eR, hR, -1]]) {
      g.beginPath(); g.moveTo(...sh); g.lineTo(...el); g.lineTo(hd[0] + sx * 10, hd[1]);
      const kx = sx * bw * 0.9 * wing + sx * 20, ky = hipY + leg1 * 1.6;
      g.quadraticCurveTo(lerp(hd[0], kx, 0.5) + sx * 30 * wing + flap(sx), lerp(hd[1], ky, 0.5) + 30 + flap(sx + 1), kx, ky);
      g.lineTo(sx * bw * 0.3, hipY + 10); g.closePath(); st('#8a7356');
      g.save(); g.clip(); g.strokeStyle = 'rgba(40,30,20,0.35)'; g.lineWidth = 4; for (let k = 1; k < 5; k++) { g.beginPath(); g.moveTo(sh[0], sh[1]); g.lineTo(lerp(hd[0], kx, k / 5), lerp(hd[1], ky, k / 5) + 20); g.stroke(); } g.restore();
    }
  }
  if (d.suit && (s.canopy || 0) > 0.02) {
    const c = s.canopy, half = s.half || 0, cy = headY - hr * 2.2 - 70 * c, cw = 150 * c, chh = 90 * c;
    const fl = Math.sin(t * 25) * 14 * half;
    g.strokeStyle = 'rgba(30,25,20,0.8)'; g.lineWidth = 3; for (const sx of [-1, -0.4, 0.4, 1]) { g.beginPath(); g.moveTo(sx * cw * (sx < 0 ? 1 - half * 0.6 : 1), cy + 8); g.lineTo(sx * 22, neckY + 10); g.stroke(); }
    g.beginPath(); g.moveTo(-cw * (1 - half * 0.6), cy + 8); g.quadraticCurveTo(-cw * 0.9 + fl, cy - chh * (1 - half * 0.7), 0, cy - chh * (1 - half * 0.3)); g.quadraticCurveTo(cw * 0.95, cy - chh * 0.95, cw, cy + 8 + fl * 0.6);
    for (let k = 0; k < 6; k++) g.quadraticCurveTo(cw - (k + 0.5) * cw * (2 - half * 0.6) / 6, cy + 24 + fl * (k % 2 ? 1 : -1), cw - (k + 1) * cw * (2 - half * 0.6) / 6, cy + 8);
    g.closePath(); st('#d9cdb0'); g.save(); g.clip(); g.strokeStyle = 'rgba(120,100,70,0.5)'; g.lineWidth = 5; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(k * cw * 0.35, cy + 10); g.quadraticCurveTo(k * cw * 0.2, cy - chh * 0.6, 0, cy - chh); g.stroke(); } g.restore();
  }
  // legs
  const limb = (a, b, wdt, fill) => { const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), L0 = Math.hypot(b[0] - a[0], b[1] - a[1]); g.save(); g.translate(...a); g.rotate(ang - Math.PI / 2); g.beginPath(); g.roundRect(-wdt / 2, -6, wdt, L0 + 12, wdt / 2); st(fill); g.restore(); };
  const [kL2, fL2] = fk(-bw * 0.22, hipY, P.legL, leg1, P.kneeL, leg2), [kR2, fR2] = fk(bw * 0.22, hipY, P.legR, leg1, P.kneeR, leg2);
  const legs = [[[-bw * 0.22, hipY], kL2, fL2, 1], [[bw * 0.22, hipY], kR2, fR2, -1]];
  for (const [hp, kn, ft, sx] of legs) { limb(hp, kn, bw * 0.36, pants); limb(kn, ft, bw * 0.32, d.dummy ? pants : pants); ell(ft[0] + bw * 0.1, ft[1] + 4, bw * 0.28, bw * 0.13); st(d.shoes || '#222'); }
  const sleeve = coat;
  const arm = (sh, el, hd) => { limb(sh, el, bw * 0.28, sleeve); limb(el, hd, bw * 0.26, sleeve); circ(hd[0], hd[1] + 2, bw * 0.15); st(d.skin); };
  arm(shL, eL, hL);
  // body (long coat reaches the knees)
  const bot = d.dress ? hipY + leg1 * 1.75 : d.coat || d.suit ? hipY + leg1 * 0.8 : hipY + 6; const flare = d.dress ? 0.95 : (d.coat || d.suit ? 0.58 : 0.5);
  g.beginPath(); g.moveTo(-bw * 0.42, neckY); g.lineTo(bw * 0.42, neckY); g.quadraticCurveTo(bw * 0.62, neckY + bodyH * 0.6, bw * flare, bot); g.lineTo(-bw * flare, bot); g.quadraticCurveTo(-bw * 0.62, neckY + bodyH * 0.6, -bw * 0.42, neckY); g.closePath(); st(coat);
  if (d.suit) { g.save(); g.clip(); g.strokeStyle = 'rgba(40,30,20,0.35)'; g.lineWidth = 4; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(-bw * 0.6, neckY + 30 + k * 34); g.quadraticCurveTo(0, neckY + 42 + k * 34, bw * 0.6, neckY + 30 + k * 34); g.stroke(); } g.restore(); for (let k = 0; k < 4; k++) { circ(0, neckY + 26 + k * 28, 5); st('#c9a24a'); } }
  if (d.police) { line([[0, neckY + 8], [0, bot]], 4); for (let k = 0; k < 4; k++) { circ(0, neckY + 22 + k * 22, 5); st('#e8c34a'); } }
  if (d.jacket && !d.suit) { poly([[-bw * 0.2, neckY], [0, neckY + bodyH * 0.45], [bw * 0.2, neckY]]); st(d.shirt || '#f2f2f2'); if (d.tie) { poly([[-8, neckY + 4], [8, neckY + 4], [11, neckY + bodyH * 0.42], [0, neckY + bodyH * 0.52], [-11, neckY + bodyH * 0.42]]); st(d.tie); } }
  if (d.dummy) { line([[-bw * 0.4, neckY + bodyH * 0.5], [bw * 0.4, neckY + bodyH * 0.5]], 3); for (let k = -3; k <= 3; k++) line([[k * 12, neckY + bodyH * 0.5 - 7], [k * 12 + 4, neckY + bodyH * 0.5 + 7]], 3); }
  arm(shR, eR, hR);
  if (s.hold) s.hold(hR, hL, g);
  // wrapped fabric spiral (suit collapsed around the body)
  if (d.suit && (s.wrap || 0) > 0.02) {
    const w = s.wrap; g.save(); g.globalAlpha = 1;
    for (let k = 0; k < 4; k++) { const yy = lerp(neckY + 10, hipY + leg1 * 1.2, k / 3.5); g.beginPath(); g.moveTo(-bw * 0.75, yy + 18); g.quadraticCurveTo(0, yy - 16 + Math.sin(t * 20 + k) * 5, bw * 0.75, yy + 6); g.lineTo(bw * 0.75, yy + 6 + 26 * w); g.quadraticCurveTo(0, yy + 12 + 26 * w, -bw * 0.75, yy + 18 + 26 * w); g.closePath(); st('#d9cdb0'); }
    const tl = 160 * w; g.beginPath(); g.moveTo(-30, neckY); g.bezierCurveTo(-60 + Math.sin(t * 24) * 30, neckY - tl * 0.5, 50 + Math.sin(t * 20) * 40, neckY - tl * 0.8, Math.sin(t * 17) * 50, neckY - tl - 40); g.bezierCurveTo(40, neckY - tl * 0.6, 60, neckY - tl * 0.3, 30, neckY); g.closePath(); st('#d9cdb0');
    g.restore();
  }
  // head
  g.save(); g.translate(0, headY); g.rotate(P.tilt || 0);
  circ(0, 0, hr); st(d.skin);
  if (d.dummy) { g.strokeStyle = 'rgba(60,40,20,0.5)'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, hr * 0.98, -0.3, 0.3); g.stroke(); }
  const hs = d.hairStyle;
  if (hs === 'side') { g.beginPath(); g.arc(0, -hr * 0.05, hr * 1.0, Math.PI * 1.05, Math.PI * 1.95); g.quadraticCurveTo(hr * 0.2, -hr * 0.55, -hr * 0.95, -hr * 0.2); g.closePath(); st(d.hair); }
  if (hs === 'bald') { g.beginPath(); g.arc(0, 0, hr * 1.0, Math.PI * 0.85, Math.PI * 1.15); g.closePath(); st(d.hair); g.beginPath(); g.arc(0, 0, hr * 1.0, -Math.PI * 0.15, Math.PI * 0.15); g.closePath(); st(d.hair); }
  if (hs === 'bun') { g.beginPath(); g.arc(0, -hr * 0.1, hr * 1.02, Math.PI * 0.95, Math.PI * 2.05); g.quadraticCurveTo(0, -hr * 0.45, -hr, -hr * 0.05); g.closePath(); st(d.hair); circ(hr * 0.15, -hr * 1.05, hr * 0.38); st(d.hair); }
  if (hs === 'curly') { for (let k = 0; k < 7; k++) { const a = Math.PI * (1.0 + k / 6); circ(Math.cos(a) * hr * 0.85, Math.sin(a) * hr * 0.85, hr * 0.32); st(d.hair); } }
  if (d.hat === 'bowler') { ell(0, -hr * 0.62, hr * 1.3, hr * 0.22); st(d.hatColor || '#2b2b2b'); g.beginPath(); g.arc(0, -hr * 0.7, hr * 0.78, Math.PI, 0); g.closePath(); st(d.hatColor || '#2b2b2b'); }
  if (d.hat === 'top') { ell(0, -hr * 0.66, hr * 1.25, hr * 0.2); st('#222'); rr(-hr * 0.7, -hr * 1.75, hr * 1.4, hr * 1.1, 6); st('#222'); rr(-hr * 0.7, -hr * 0.95, hr * 1.4, hr * 0.18, 2); st('#7a2b2b'); }
  if (d.hat === 'kepi') { g.beginPath(); g.moveTo(-hr * 0.8, -hr * 0.55); g.lineTo(-hr * 0.68, -hr * 1.35); g.lineTo(hr * 0.68, -hr * 1.35); g.lineTo(hr * 0.8, -hr * 0.55); g.closePath(); st('#2a3a6a'); rr(-hr * 0.82, -hr * 0.7, hr * 1.64, hr * 0.2, 3); st('#c22'); ell(hr * 0.4, -hr * 0.52, hr * 0.6, hr * 0.12); st('#111'); }
  if (d.hat === 'bicorne') { g.beginPath(); g.moveTo(-hr * 1.5, -hr * 0.55); g.quadraticCurveTo(0, -hr * 1.9, hr * 1.5, -hr * 0.55); g.quadraticCurveTo(0, -hr * 0.85, -hr * 1.5, -hr * 0.55); g.closePath(); st('#1d1d24'); circ(hr * 0.2, -hr * 1.05, hr * 0.14); st('#c0392b'); }
  if (d.hat === 'plume') { ell(0, -hr * 0.72, hr * 1.1, hr * 0.2); st(d.hatColor || '#f2e6d0'); g.beginPath(); g.arc(0, -hr * 0.78, hr * 0.6, Math.PI, 0); g.closePath(); st(d.hatColor || '#f2e6d0'); g.beginPath(); g.moveTo(hr * 0.3, -hr * 1.1); g.bezierCurveTo(hr * 0.9, -hr * 2.2, hr * 1.6, -hr * 1.6, hr * 1.3, -hr * 1.0); g.quadraticCurveTo(hr * 1.0, -hr * 1.6, hr * 0.3, -hr * 1.1); g.closePath(); st(d.plume || '#e05a7a'); }
  if (d.hat === 'cap') { g.beginPath(); g.arc(0, -hr * 0.25, hr * 0.98, Math.PI, Math.PI * 2); g.closePath(); st(d.hatColor || '#3a3f55'); ell(hr * 0.55, -hr * 0.28, hr * 0.7, hr * 0.14); st(d.hatColor || '#3a3f55'); }
  if (d.suit && s.hood) { g.beginPath(); g.arc(0, -hr * 0.1, hr * 1.12, Math.PI * 0.9, Math.PI * 2.1); g.closePath(); st('#8a7356'); rr(-hr * 0.8, -hr * 0.55, hr * 1.6, hr * 0.42, 8); st('#3b3b3b'); ell(-hr * 0.38, -hr * 0.34, hr * 0.26, hr * 0.17); st('#bfe3f2'); ell(hr * 0.38, -hr * 0.34, hr * 0.26, hr * 0.17); st('#bfe3f2'); }
  // face
  const ex = s.expr || 'neutral', look = s.look || 0; const eyeY = -hr * 0.02, eyeX = hr * 0.36, er = hr * 0.11;
  const blink = (Math.sin(t * 2.3 + (d.seed || 0) * 1.7) > 0.986) && ex !== 'laugh';
  if (d.dummy) { for (const sx of [-1, 1]) { line([[sx * eyeX - er, eyeY - er], [sx * eyeX + er, eyeY + er]], 5); line([[sx * eyeX + er, eyeY - er], [sx * eyeX - er, eyeY + er]], 5); } line([[-hr * 0.3, hr * 0.42], [hr * 0.3, hr * 0.42]], 4); for (let k = -2; k <= 2; k++) line([[k * hr * 0.13, hr * 0.36], [k * hr * 0.13, hr * 0.48]], 3); }
  else {
    for (const sx of [-1, 1]) {
      g.save(); g.translate(sx * eyeX + look * er * 0.7, eyeY);
      if (ex === 'laugh' || ex === 'happy') { g.beginPath(); g.arc(0, er * 0.6, er * 1.2, Math.PI * 1.15, Math.PI * 1.85); g.strokeStyle = OUT; g.lineWidth = 6; g.stroke(); }
      else if (blink || ex === 'closed') { line([[-er, 0], [er, 0]], 6); }
      else { const big = ex === 'shock' || ex === 'scared' ? 1.9 : 1; if (big > 1) { circ(0, 0, er * big); g.fillStyle = '#fff'; g.fill(); g.strokeStyle = OUT; g.lineWidth = 4; g.stroke(); } circ(look * er * 0.4, 0, er * (big > 1 ? 0.75 : 1)); g.fillStyle = OUT; g.fill(); circ(-er * 0.3 + look * er * 0.4, -er * 0.35, er * 0.3); g.fillStyle = '#fff'; g.fill(); }
      g.restore();
    }
    const bro = { angry: [0.35, -0.35], determined: [0.3, -0.3], smug: [-0.15, 0.25], scared: [-0.35, 0.35], worried: [-0.35, 0.35], shock: [-0.1, 0.1], sad: [-0.3, 0.3] }[ex] || [0, 0];
    for (const [sx, a] of [[-1, bro[0]], [1, bro[1]]]) { g.save(); g.translate(sx * eyeX + look * er * 0.7, eyeY - er * 2.6 - (ex === 'shock' ? 8 : 0)); g.rotate(a * sx); line([[-er * 1.1, 0], [er * 1.1, 0]], 6); g.restore(); }
  }
  if (d.glasses) { g.strokeStyle = OUT; g.lineWidth = 4; for (const sx of [-1, 1]) { circ(sx * eyeX, eyeY, er * 2.2); g.stroke(); } }
  if (!d.dummy) { g.fillStyle = 'rgba(230,110,110,0.35)'; for (const sx of [-1, 1]) { ell(sx * hr * 0.58, hr * 0.3, hr * 0.16, hr * 0.1); g.fill(); } }
  const my = hr * 0.45;
  if (d.mustache) { for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(0, my - hr * 0.2); g.quadraticCurveTo(sx * hr * 0.3, my - hr * 0.3, sx * hr * 0.5, my - hr * 0.02); g.quadraticCurveTo(sx * hr * 0.3, my - hr * 0.1, 0, my - hr * 0.08); g.closePath(); g.fillStyle = d.hair; g.fill(); g.strokeStyle = OUT; g.lineWidth = 3; g.stroke(); } }
  if (d.beard) { g.beginPath(); g.arc(0, hr * 0.25, hr * 0.75, 0.15 * Math.PI, 0.85 * Math.PI); g.quadraticCurveTo(0, hr * 1.25, hr * 0.68, hr * 0.55); g.closePath(); st(d.hair); }
  if (!d.dummy) {
    const talk = s.talk ? Math.abs(Math.sin(t * 13)) * Math.abs(Math.sin(t * 5.3 + 1)) : 0;
    g.strokeStyle = OUT; g.lineWidth = 6;
    if (talk > 0.05 || ex === 'talk') { ell(0, my + 4, hr * 0.17, hr * (0.06 + 0.16 * talk)); g.fillStyle = '#5a1e1e'; g.fill(); g.lineWidth = 5; g.stroke(); }
    else if (ex === 'neutral' || ex === 'determined' || ex === 'closed') { line([[-hr * 0.15, my + 2], [hr * 0.15, my + 2]], 6); }
    else if (ex === 'happy' || ex === 'smile') { g.beginPath(); g.arc(0, my - hr * 0.12, hr * 0.25, 0.2 * Math.PI, 0.8 * Math.PI); g.stroke(); }
    else if (ex === 'smug') { g.beginPath(); g.moveTo(-hr * 0.2, my + 4); g.quadraticCurveTo(hr * 0.05, my + 8, hr * 0.28, my - 10); g.stroke(); }
    else if (ex === 'laugh' || ex === 'grin') { const o = ex === 'laugh' ? 0.75 + Math.abs(Math.sin(t * 14)) * 0.25 : 0.6; g.beginPath(); g.moveTo(-hr * 0.32, my - hr * 0.08); g.quadraticCurveTo(0, my + hr * 0.5 * o, hr * 0.32, my - hr * 0.08); g.closePath(); g.fillStyle = '#5a1e1e'; g.fill(); g.stroke(); }
    else if (ex === 'shock' || ex === 'scared') { ell(0, my + 6, hr * 0.13, hr * 0.2); g.fillStyle = '#5a1e1e'; g.fill(); g.stroke(); }
    else if (ex === 'worried' || ex === 'sad' || ex === 'angry') { g.beginPath(); g.arc(0, my + hr * 0.14, hr * 0.2, 1.2 * Math.PI, 1.8 * Math.PI); g.stroke(); }
    else if (ex === 'pain') { g.beginPath(); g.moveTo(-hr * 0.25, my); for (let k = 1; k <= 6; k++) g.lineTo(-hr * 0.25 + k * hr * 0.083, my + (k % 2 ? -6 : 6)); g.stroke(); }
  }
  if (s.sweat) { g.beginPath(); g.moveTo(hr * 0.85, -hr * 0.5); g.quadraticCurveTo(hr * 1.05, -hr * 0.15, hr * 0.85, -hr * 0.05); g.quadraticCurveTo(hr * 0.65, -hr * 0.15, hr * 0.85, -hr * 0.5); g.fillStyle = '#7fd0ff'; g.fill(); g.strokeStyle = OUT; g.lineWidth = 3; g.stroke(); }
  if (s.breath) { const ph = (t * 0.6 + (d.seed || 0) * 0.37) % 1; if (ph < 0.6) { g.globalAlpha = 0.55 * (1 - ph / 0.6); circ(hr * 0.7 + ph * 90, my + 10 - ph * 30, 10 + ph * 40); g.fillStyle = '#fff'; g.fill(); g.globalAlpha = 1; } }
  g.restore(); g.restore();
}
// ---------- shared props / set pieces ----------
export function cloud(x, y, s, col = '#fbfbfb') { g.save(); g.translate(x, y); g.scale(s, s); g.beginPath(); g.arc(-60, 10, 40, Math.PI * 0.5, Math.PI * 1.5); g.arc(-20, -20, 45, Math.PI, Math.PI * 1.9); g.arc(35, -10, 40, Math.PI * 1.2, Math.PI * 2); g.arc(70, 15, 30, Math.PI * 1.5, Math.PI * 0.5); g.closePath(); ol(col, 5); g.restore(); }
export function bird(x, y, s, t) { const f = Math.sin(t * 14) * 0.6; g.save(); g.translate(x, y); g.scale(s, s); g.beginPath(); g.moveTo(-20, -f * 12); g.quadraticCurveTo(-10, -8, 0, 0); g.quadraticCurveTo(10, -8, 20, -f * 12); g.strokeStyle = OUT; g.lineWidth = 4; g.stroke(); g.restore(); }
export function tree(x, y, s, seed = 1, t = 0) {
  g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = '#4a3527'; g.lineCap = 'round';
  const br = (len, ang, w, dpt) => { if (dpt === 0 || len < 8) return; g.save(); g.rotate(ang + Math.sin(t * 1.5 + dpt + seed) * 0.02 * (6 - dpt)); g.lineWidth = w + 5; g.strokeStyle = OUT; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -len); g.stroke(); g.lineWidth = w; g.strokeStyle = '#5b4230'; g.stroke(); g.translate(0, -len); br(len * 0.72, -0.45 + (R(seed + dpt) - 0.5) * 0.3, w * 0.68, dpt - 1); br(len * 0.68, 0.42 + (R(seed * 3 + dpt) - 0.5) * 0.3, w * 0.66, dpt - 1); g.restore(); };
  br(110, 0, 18, 6); g.restore();
}
export function lamp(x, y, s, on = 0) { g.save(); g.translate(x, y); g.scale(s, s); rr(-7, -260, 14, 260, 4); ol('#2f3a3a'); rr(-20, -8, 40, 10, 3); ol('#2f3a3a'); poly([[-22, -300], [22, -300], [14, -260], [-14, -260]]); ol(on ? '#ffe9a8' : '#dfe6d6'); poly([[-26, -300], [26, -300], [0, -330]]); ol('#2f3a3a'); g.restore(); }
// a Paris block: mansard roof, cream stone, rows of windows with balconies
export function building(x, y, w, h, o = {}) {
  const c = o.col || '#e9dcc3', roof = o.roof || '#6b7a8a', flo = o.floors || Math.max(2, Math.round(h / 120));
  rr(x, y - h, w, h, 2); ol(c, o.lw ?? 6);
  poly([[x - 8, y - h], [x + w + 8, y - h], [x + w - 14, y - h - 70], [x + 14, y - h - 70]]); ol(roof, o.lw ?? 6);
  for (let i = 0; i < Math.floor(w / 90); i++) { const cx = x + 30 + i * 90; if (o.chim !== false && i % 2 === 0) { rr(cx + 12, y - h - 105, 22, 45, 2); ol('#a5776a', o.lw ?? 5); } rr(cx, y - h - 55, 30, 32, 14); ol('#cfd8de', 4); }
  const fh = h / flo;
  for (let f = 0; f < flo; f++) for (let i = 0; i < Math.floor(w / 90); i++) {
    const wx = x + 25 + i * 90, wy = y - h + f * fh + fh * 0.22; const lit = o.lit && R(i * 7 + f * 13 + x) > 0.6;
    rr(wx, wy, 40, fh * 0.55, 3); ol(lit ? '#ffe6a3' : '#7f9bb0', 4);
    if (f === 1 || f === flo - 2) { rr(wx - 8, wy + fh * 0.55 - 4, 56, 10, 2); ol('#3b3b3b', 3); }
  }
  if (o.door) { rr(x + w / 2 - 35, y - fh * 0.85, 70, fh * 0.85, 30); ol('#5a3d2c'); }
}
// Eiffel-style lattice tower (own stylized drawing). Origin = centre of base on the ground; s = px per metre. Returns key points.
export function tower(x, y, s, o = {}) {
  const col = o.col || '#8b6a4c', dark = '#6c5039', lw = o.lw ?? Math.max(2, Math.min(7, s * 0.9));
  const P = (bx, hy) => [x + bx * s, y - hy * s]; // bx: metres from centre, hy: metres up
  const halfW = (hy) => hy < 57 ? lerp(62, 36, hy / 57) : hy < 115 ? lerp(34, 18, (hy - 57) / 58) : hy < 276 ? lerp(17, 2.2, Math.pow((hy - 115) / 161, 0.8)) : 2.2;
  g.save();
  // legs (front pair), lattice by X bracing
  const legPoly = (sx) => [P(sx * 62, 0), P(sx * 40, 0), P(sx * 26, 57), P(sx * 36, 57)];
  for (const sx of [-1, 1]) {
    poly(legPoly(sx)); ol(col, lw);
    g.save(); poly(legPoly(sx)); g.clip(); g.strokeStyle = dark; g.lineWidth = Math.max(1.5, lw * 0.5);
    for (let k = 0; k < 10; k++) { const a = k * 5.7, b = a + 5.7; line([P(sx * lerp(62, 36, a / 57), a), P(sx * lerp(40, 26, b / 57), b)], g.lineWidth, dark); line([P(sx * lerp(40, 26, a / 57), a), P(sx * lerp(62, 36, b / 57), b)], g.lineWidth, dark); }
    g.restore();
  }
  // arch between legs
  g.beginPath(); g.moveTo(...P(-40, 0)); g.quadraticCurveTo(...P(0, 62), ...P(40, 0)); g.lineTo(...P(36, 0)); g.quadraticCurveTo(...P(0, 54), ...P(-36, 0)); g.closePath(); ol(col, lw);
  // section 1->2 and spire
  const sec = (h0, h1, n) => { const pts = [P(-halfW(h0), h0), P(halfW(h0), h0), P(halfW(h1), h1), P(-halfW(h1), h1)]; poly(pts); ol(col, lw); g.save(); poly(pts); g.clip(); for (let k = 0; k < n; k++) { const a = lerp(h0, h1, k / n), b = lerp(h0, h1, (k + 1) / n); line([P(-halfW(a), a), P(halfW(b), b)], Math.max(1.5, lw * 0.45), dark); line([P(halfW(a), a), P(-halfW(b), b)], Math.max(1.5, lw * 0.45), dark); } g.restore(); };
  sec(57, 115, 6); sec(122, 276, 18);
  // platforms
  const deck = (hy, hw, th) => { rr(...P(-hw, hy + th), hw * 2 * s, th * s, 2); ol(col, lw); g.save(); g.strokeStyle = dark; g.lineWidth = Math.max(1, lw * 0.4); for (let k = -hw; k < hw; k += 3) { g.beginPath(); g.arc(...P(k + 1.5, hy), 1.3 * s, Math.PI, 0); g.stroke(); } g.restore(); rr(...P(-hw - 1, hy + th + 2.4), (hw + 1) * 2 * s, 2.4 * s, 1); ol(dark, lw * 0.7); };
  deck(57, 40, 7); deck(115, 22, 5); rr(...P(-4, 284), 8 * s, 8 * s, 2); ol(col, lw); line([P(0, 284), P(0, 312)], Math.max(2, s * 1.2));
  if (o.flag !== false) { const t = K.t; g.beginPath(); g.moveTo(...P(0, 312)); for (let k = 0; k <= 6; k++) g.lineTo(...P(k * 2.4, 312 - 0.6 * k + Math.sin(t * 9 - k) * 1.2)); for (let k = 6; k >= 0; k--) g.lineTo(...P(k * 2.4, 306 - 0.6 * k + Math.sin(t * 9 - k) * 1.2)); g.closePath(); ol('#e04848', Math.max(1.5, lw * 0.5)); }
  g.restore();
  return { deck1: P(0, 64), base: P(0, 0) };
}
export function filmCam(x, y, s, t, crank = true) { // vintage hand-cranked cinematograph on a tripod
  g.save(); g.translate(x, y); g.scale(s, s);
  for (const a of [-0.35, 0, 0.35]) line([[0, -150], [Math.sin(a) * 160, 0]], 9, '#5b4230');
  rr(-55, -230, 110, 85, 8); ol('#3a2c22'); rr(55, -205, 40, 34, 6); ol('#222'); circ(102, -188, 14); ol('#7fb3c9', 4);
  circ(-28, -262, 30); ol('#3a2c22'); circ(28, -262, 30); ol('#3a2c22');
  g.save(); g.translate(-28, -262); g.rotate(t * 8); line([[-18, 0], [18, 0]], 4, '#888'); g.restore(); g.save(); g.translate(28, -262); g.rotate(t * 8); line([[0, -18], [0, 18]], 4, '#888'); g.restore();
  const a = crank ? t * 9 : 0; line([[-55, -185], [-75, -185]], 6); line([[-75, -185], [-75 + Math.cos(a) * 22, -185 + Math.sin(a) * 22]], 6); circ(-75 + Math.cos(a) * 22, -185 + Math.sin(a) * 22, 6); ol('#c9a24a', 3);
  g.restore();
}
export function puff(x, y, s, k, col = '#e9e2d6') { // k 0..1 dust/smoke burst
  if (k <= 0 || k >= 1) return; g.save(); g.globalAlpha = 1 - k;
  for (let i = 0; i < 9; i++) { const a = -Math.PI * (0.05 + 0.9 * i / 8), r = easeOut(k) * 160 * s * (0.7 + R(i) * 0.5); circ(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.6, (30 + k * 50) * s * (0.6 + R(i + 3) * 0.6)); ol(col, 4); }
  g.restore();
}
export function speedLines(t, dir = 'v', amt = 1, col = 'rgba(255,255,255,0.75)') {
  g.save(); g.strokeStyle = col; g.lineCap = 'round';
  for (let i = 0; i < 26; i++) { const x = R(i) * W, len = 120 + R(i + 5) * 260, sp = 2400 + R(i + 9) * 1600; const y = ((R(i + 2) * H * 1.6 - t * sp) % (H * 1.6) + H * 1.6) % (H * 1.6) - H * 0.3; g.lineWidth = (3 + R(i + 4) * 6) * amt; g.beginPath(); if (dir === 'v') { g.moveTo(x, y); g.lineTo(x, y + len); } else { g.moveTo(y, x); g.lineTo(y + len, x); } g.stroke(); }
  g.restore();
}
export function sky(top, bot, y0 = 0, y1 = H) { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(-W * 4, -H * 4, W * 9, H * 9); }
export function wind(t, n = 10, amt = 1, y0 = 0, y1 = H) { g.save(); g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 6; g.lineCap = 'round'; for (let i = 0; i < n; i++) { const y = lerp(y0, y1, R(i + 40)), sp = 900 + R(i) * 700, x = ((R(i + 7) * W * 2 + t * sp) % (W * 1.8)) - W * 0.4, l = 140 + R(i + 3) * 160; g.globalAlpha = 0.5 * amt; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + l * 0.3, y - 12, x + l * 0.6, y + 12, x + l, y + Math.sin(t * 3 + i) * 10); g.stroke(); } g.restore(); }

// ---------- frame loop ----------
let S = null;
async function init() { S = await import('./' + (qs.get('s') || 'scene.js')); if (S.build) await S.build(K); window.FRAMES = S.FRAMES; window.ready = true; }
window.renderFrame = (f) => {
  const N = S.blurN ? S.blurN(f) : 1;
  ag.globalAlpha = 1; ag.clearRect(0, 0, OW, OH);
  for (let k = 0; k < N; k++) {
    const tf = N === 1 ? f : f - 0.35 + 0.7 * k / (N - 1);
    g.setTransform(OW / W, 0, 0, OW / W, 0, 0); g.globalAlpha = 1; g.clearRect(0, 0, W, H);
    K.t = tf / 30; K.shake = [0, 0]; K.cam = { x: 0, y: 0, z: 1, rot: 0 }; S.frame(tf, K);
    ag.globalAlpha = 1 / (k + 1); ag.drawImage(cv, 0, 0);
  }
  ag.globalAlpha = 1;
  if (S.post) { ag.save(); ag.setTransform(OW / W, 0, 0, OW / W, 0, 0); S.post(ag, f, K); ag.restore(); }
  return acc.toDataURL('image/jpeg', 0.92);
};
init();
