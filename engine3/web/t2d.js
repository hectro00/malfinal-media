// Mal Final engine v3 "2D sobre 3D": flat cartoon characters (own design, drawn on canvas each frame) standing in
// AI-painted backgrounds turned into 3D with a depth map (displaced mesh -> real parallax). Camera always moving,
// true motion blur by sub-frame accumulation. Contract with render.mjs: window.FRAMES, window.ready, window.renderFrame(f).
import * as THREE from 'three';
const qs = new URLSearchParams(location.search); const W = +(qs.get('w') || 720), H = Math.round(W * 16 / 9);
const gl = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); gl.setSize(W, H); gl.setPixelRatio(1);
gl.outputColorSpace = THREE.SRGBColorSpace; gl.toneMapping = THREE.NoToneMapping; document.body.appendChild(gl.domElement);
const out = document.createElement('canvas'); out.width = W; out.height = H; const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000000);
const cam = new THREE.PerspectiveCamera(40, W / H, 0.05, 200);
const K = { THREE, scene, cam, W, H };
const TL = new THREE.TextureLoader();
const loadTex = (u) => new Promise((res) => TL.load(u, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; res(t); }));
const loadImg = (u) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = u; });

// ---------- backgrounds: image + depth -> displaced grid ----------
K.bgs = {};
K.bg = async (name, { width = 9, depth = 2.6, seg = 180, z = 0 } = {}) => {
  const tex = await loadTex(`bg/${name}.jpg`); const dimg = await loadImg(`bg/${name}_d.png`);
  const iw = tex.image.width, ih = tex.image.height; const height = width * ih / iw;
  const c = document.createElement('canvas'); c.width = 256; c.height = Math.round(256 * ih / iw); const g = c.getContext('2d'); g.drawImage(dimg, 0, 0, c.width, c.height);
  const D = g.getImageData(0, 0, c.width, c.height).data;
  const geo = new THREE.PlaneGeometry(width, height, seg, Math.round(seg * ih / iw)); const p = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const u = uv.getX(i), v = uv.getY(i); const px = Math.min(c.width - 1, Math.round(u * (c.width - 1))), py = Math.min(c.height - 1, Math.round((1 - v) * (c.height - 1)));
    const d = D[(py * c.width + px) * 4] / 255; p.setZ(i, Math.pow(d, 1.3) * depth);
  }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); m.position.z = z; m.visible = false; scene.add(m);
  K.bgs[name] = { mesh: m, width, height }; return K.bgs[name];
};
K.showBg = (name) => { for (const k in K.bgs) K.bgs[k].mesh.visible = k === name; };

// ---------- sprites (props / fx drawn on canvas) ----------
K.sprite = (w, h, draw, px = 256) => {
  const c = document.createElement('canvas'); c.width = px; c.height = Math.round(px * h / w); const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false }));
  m.visible = false; scene.add(m); const S = { mesh: m, c, g, tex, draw, redraw(t, st) { g.clearRect(0, 0, c.width, c.height); draw(g, c.width, c.height, t, st); tex.needsUpdate = true; } };
  S.redraw(0, {}); return S;
};

// ---------- cartoon characters (own design: round head, dot eyes, simple body) ----------
// design: {skin, hair, hairStyle:'side'|'bald'|'bun'|'cap'|'none', hat:null|'bowler'|'cap'|'top', shirt, shirtB, pants, shoes, tie, jacket, skirt, glasses, mustache}
const ease = (x) => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x);
function drawChar(g, cw, chh, d, s, t) {
  g.save(); g.lineJoin = 'round'; g.lineCap = 'round';
  const OUT = '#1b1b1f'; const lw = 7;
  const cx = cw / 2, base = chh - 18; const H = chh - 40; // full height in px
  const hr = H * 0.17; // head radius
  const pose = s.pose || 'idle', ph = (t * (s.speed || 1)) * Math.PI * 2;
  let bob = 0, lean = s.lean || 0, armL = 0.15, armR = -0.15, elbL = 0, elbR = 0, legL = 0, legR = 0, jump = 0;
  if (pose === 'idle') { bob = Math.sin(ph * 0.5) * 3; armL = 0.12 + Math.sin(ph * 0.5) * 0.03; armR = -armL; }
  if (pose === 'walk') { const a = Math.sin(ph); legL = a * 0.45; legR = -a * 0.45; armL = -a * 0.5 + 0.1; armR = a * 0.5 - 0.1; bob = Math.abs(Math.cos(ph)) * 8; }
  if (pose === 'run') { const a = Math.sin(ph * 1.6); legL = a * 0.85; legR = -a * 0.85; armL = -a * 1.0; armR = a * 1.0; elbL = elbR = -1.2; bob = Math.abs(Math.cos(ph * 1.6)) * 16; lean = lean || -0.22; }
  if (pose === 'slam') { armL = 1.3; armR = 0.5; lean = lean || -0.35; legL = 0.5; legR = -0.3; }
  if (pose === 'bounce') { armL = 1.6 + Math.sin(ph * 2) * 0.3; armR = -1.6 - Math.sin(ph * 2) * 0.3; lean = 0.25 * Math.sin(ph * 0.8); legL = 0.25; legR = -0.15; }
  if (pose === 'laugh') { bob = Math.abs(Math.sin(ph * 2.2)) * 12; armL = 0.5; armR = -0.5; elbL = -1.9; elbR = 1.9; lean = Math.sin(ph * 1.1) * 0.06 + 0.04; }
  if (pose === 'clap') { const a = (Math.sin(ph * 3) + 1) / 2; armL = 0.9 + a * 0.25; armR = -0.9 - a * 0.25; elbL = -1.4 - a * 0.3; elbR = 1.4 + a * 0.3; bob = a * 3; }
  if (pose === 'shock') { armL = 2.4 + Math.sin(ph * 3) * 0.08; armR = -2.4 - Math.sin(ph * 3) * 0.08; elbL = 0.3; elbR = -0.3; jump = Math.abs(Math.sin(ph * 1.5)) * 6; }
  if (pose === 'point') { armR = -1.45; elbR = 0.0; armL = 0.12; }
  if (pose === 'lean') { armR = -2.0; elbR = 0.4; armL = 0.25; lean = 0.18; legL = 0.25; legR = -0.05; }
  if (pose === 'smug') { armL = 0.5; armR = -0.5; elbL = -2.3; elbR = 2.3; bob = Math.sin(ph * 0.5) * 2; }
  if (pose === 'fall') { armL = 2.6 + Math.sin(ph * 4) * 0.4; armR = -2.6 - Math.cos(ph * 4) * 0.4; legL = 0.6 + Math.sin(ph * 4) * 0.4; legR = -0.6 - Math.sin(ph * 4) * 0.4; }
  if (pose === 'sit') { legL = 1.4; legR = 1.4; armL = 0.4; armR = -0.4; elbL = -0.8; elbR = 0.8; }
  g.translate(cx, base - jump);
  g.rotate(lean);
  const legLen = H * 0.3, hipY = -legLen - bob * 0.3, bodyH = H * 0.3, neckY = hipY - bodyH, headY = neckY - hr * 0.85;
  const bw = H * 0.19;
  const stroke = (fill) => { g.fillStyle = fill; g.fill(); g.strokeStyle = OUT; g.lineWidth = lw; g.stroke(); };
  // legs
  const leg = (sx, a, front) => {
    g.save(); g.translate(sx, hipY); g.rotate(a);
    g.beginPath(); g.roundRect(-bw * 0.17, 0, bw * 0.34, legLen * (pose === 'sit' ? 0.55 : 1.0), 10); stroke(d.skirt && front ? d.skirt : d.pants || '#2d3a55');
    g.translate(0, legLen * (pose === 'sit' ? 0.55 : 1.0)); if (pose === 'sit') g.rotate(-a);
    g.beginPath(); g.ellipse(bw * 0.12, 4, bw * 0.28, bw * 0.13, 0, 0, Math.PI * 2); stroke(d.shoes || '#222'); g.restore();
  };
  leg(-bw * 0.22, legL, true); leg(bw * 0.22, legR, false);
  // arms (behind body for the far one)
  const arm = (side, a, e, fill) => {
    g.save(); g.translate(side * bw * 0.46, neckY + bodyH * 0.12); g.rotate(a);
    const ul = H * 0.13, ll = H * 0.12, aw = bw * 0.26;
    g.beginPath(); g.roundRect(-aw / 2, 0, aw, ul, 10); stroke(fill);
    g.translate(0, ul); g.rotate(e);
    g.beginPath(); g.roundRect(-aw / 2, 0, aw, ll, 10); stroke(fill);
    g.beginPath(); g.arc(0, ll + aw * 0.35, aw * 0.55, 0, Math.PI * 2); stroke(d.skin); g.restore();
  };
  const sleeve = d.jacket || d.shirt;
  arm(1, armL, elbL, sleeve);
  // body
  g.beginPath(); g.moveTo(-bw * 0.42, neckY); g.lineTo(bw * 0.42, neckY); g.quadraticCurveTo(bw * 0.62, neckY + bodyH * 0.6, bw * 0.5, hipY + 6); g.lineTo(-bw * 0.5, hipY + 6); g.quadraticCurveTo(-bw * 0.62, neckY + bodyH * 0.6, -bw * 0.42, neckY); g.closePath();
  stroke(d.jacket || d.shirt);
  if (d.stripes) { g.save(); g.clip(); g.strokeStyle = d.stripes; g.lineWidth = 10; for (let y = neckY + 14; y < hipY; y += 26) { g.beginPath(); g.moveTo(-bw, y); g.lineTo(bw, y); g.stroke(); } g.restore(); g.strokeStyle = OUT; g.lineWidth = lw; g.stroke(); }
  if (d.jacket) { // shirt V + tie
    g.beginPath(); g.moveTo(-bw * 0.2, neckY); g.lineTo(0, neckY + bodyH * 0.45); g.lineTo(bw * 0.2, neckY); g.closePath(); stroke(d.shirt || '#f2f2f2');
    if (d.tie) { g.beginPath(); g.moveTo(-8, neckY + 4); g.lineTo(8, neckY + 4); g.lineTo(11, neckY + bodyH * 0.42); g.lineTo(0, neckY + bodyH * 0.52); g.lineTo(-11, neckY + bodyH * 0.42); g.closePath(); stroke(d.tie); }
    g.beginPath(); g.moveTo(0, neckY + bodyH * 0.5); g.lineTo(0, hipY); g.strokeStyle = OUT; g.lineWidth = 4; g.stroke();
  }
  arm(-1, armR, elbR, sleeve);
  // head
  g.save(); g.translate(0, headY); g.rotate((s.tilt || 0) + (pose === 'laugh' ? Math.sin(ph * 2.2) * 0.08 : 0));
  g.beginPath(); g.arc(0, 0, hr, 0, Math.PI * 2); stroke(d.skin);
  // hair
  if (d.hairStyle === 'side') { g.beginPath(); g.arc(0, -hr * 0.05, hr * 1.0, Math.PI * 1.05, Math.PI * 1.95); g.quadraticCurveTo(hr * 0.2, -hr * 0.55, -hr * 0.95, -hr * 0.2); g.closePath(); stroke(d.hair); }
  if (d.hairStyle === 'bun') { g.beginPath(); g.arc(0, -hr * 0.1, hr * 1.02, Math.PI * 0.95, Math.PI * 2.05); g.quadraticCurveTo(0, -hr * 0.45, -hr, -hr * 0.05); g.closePath(); stroke(d.hair); g.beginPath(); g.arc(hr * 0.15, -hr * 1.05, hr * 0.38, 0, Math.PI * 2); stroke(d.hair); }
  if (d.hairStyle === 'curly') { for (let k = 0; k < 7; k++) { const a = Math.PI * (1.0 + k / 6); g.beginPath(); g.arc(Math.cos(a) * hr * 0.85, Math.sin(a) * hr * 0.85, hr * 0.32, 0, Math.PI * 2); stroke(d.hair); } }
  if (d.hairStyle === 'long') { g.beginPath(); g.moveTo(-hr * 1.02, hr * 0.7); g.arc(0, -hr * 0.05, hr * 1.04, Math.PI * 0.95, Math.PI * 2.05); g.lineTo(hr * 1.02, hr * 0.7); g.quadraticCurveTo(hr * 0.7, -hr * 0.3, 0, -hr * 0.55); g.quadraticCurveTo(-hr * 0.7, -hr * 0.3, -hr * 1.02, hr * 0.7); g.closePath(); stroke(d.hair); }
  if (d.hat === 'cap') { g.beginPath(); g.arc(0, -hr * 0.25, hr * 0.98, Math.PI * 1.0, Math.PI * 2.0); g.closePath(); stroke(d.hatColor || '#2a3550'); g.beginPath(); g.ellipse(hr * 0.55, -hr * 0.28, hr * 0.7, hr * 0.14, 0, 0, Math.PI * 2); stroke(d.hatColor || '#2a3550'); }
  if (d.hat === 'bowler') { g.beginPath(); g.ellipse(0, -hr * 0.62, hr * 1.3, hr * 0.22, 0, 0, Math.PI * 2); stroke(d.hatColor || '#2b2b2b'); g.beginPath(); g.arc(0, -hr * 0.7, hr * 0.78, Math.PI, 0); g.closePath(); stroke(d.hatColor || '#2b2b2b'); }
  // face
  const ex = s.expr || 'neutral'; const blink = (Math.sin(t * 2.3 + (d.seed || 0)) > 0.985) && ex !== 'laugh';
  const eyeY = -hr * 0.02, eyeX = hr * 0.36, er = hr * 0.11;
  const eye = (x) => {
    g.save(); g.translate(x, eyeY);
    if (ex === 'laugh' || ex === 'happy') { g.beginPath(); g.arc(0, er * 0.6, er * 1.2, Math.PI * 1.15, Math.PI * 1.85); g.strokeStyle = OUT; g.lineWidth = 6; g.stroke(); }
    else if (blink) { g.beginPath(); g.moveTo(-er, 0); g.lineTo(er, 0); g.strokeStyle = OUT; g.lineWidth = 6; g.stroke(); }
    else { const big = ex === 'shock' || ex === 'scared' ? 1.9 : 1; if (big > 1) { g.beginPath(); g.arc(0, 0, er * big, 0, Math.PI * 2); g.fillStyle = '#fff'; g.fill(); g.strokeStyle = OUT; g.lineWidth = 4; g.stroke(); }
      g.beginPath(); g.arc(0, 0, er * (big > 1 ? 0.8 : 1), 0, Math.PI * 2); g.fillStyle = OUT; g.fill(); g.beginPath(); g.arc(-er * 0.3, -er * 0.35, er * 0.3, 0, Math.PI * 2); g.fillStyle = '#fff'; g.fill(); }
    g.restore();
  };
  eye(-eyeX); eye(eyeX);
  // brows
  g.strokeStyle = OUT; g.lineWidth = 6;
  const bro = { angry: [0.35, -0.35], smug: [-0.15, 0.25], scared: [-0.35, 0.35], shock: [-0.1, 0.1], sad: [-0.3, 0.3] }[ex] || [0, 0];
  for (const [sx, a] of [[-1, bro[0]], [1, bro[1]]]) { g.save(); g.translate(sx * eyeX, eyeY - er * 2.6 - (ex === 'shock' ? 8 : 0)); g.rotate(a * sx); g.beginPath(); g.moveTo(-er * 1.1, 0); g.lineTo(er * 1.1, 0); g.stroke(); g.restore(); }
  if (d.glasses) { g.lineWidth = 4; for (const sx of [-1, 1]) { g.beginPath(); g.arc(sx * eyeX, eyeY, er * 2.2, 0, Math.PI * 2); g.stroke(); } g.beginPath(); g.moveTo(-eyeX + er * 2.2, eyeY); g.lineTo(eyeX - er * 2.2, eyeY); g.stroke(); }
  // cheeks
  g.fillStyle = 'rgba(230,110,110,0.35)'; for (const sx of [-1, 1]) { g.beginPath(); g.ellipse(sx * hr * 0.58, hr * 0.3, hr * 0.16, hr * 0.1, 0, 0, Math.PI * 2); g.fill(); }
  // mouth
  const my = hr * 0.45; g.lineWidth = 6; g.strokeStyle = OUT;
  if (d.mustache) { g.beginPath(); g.ellipse(-hr * 0.16, my - hr * 0.13, hr * 0.2, hr * 0.08, 0.2, 0, Math.PI * 2); g.ellipse(hr * 0.16, my - hr * 0.13, hr * 0.2, hr * 0.08, -0.2, 0, Math.PI * 2); g.fillStyle = d.hair; g.fill(); }
  if (ex === 'neutral') { g.beginPath(); g.moveTo(-hr * 0.15, my); g.lineTo(hr * 0.15, my); g.stroke(); }
  if (ex === 'happy' || ex === 'smile') { g.beginPath(); g.arc(0, my - hr * 0.12, hr * 0.25, 0.2 * Math.PI, 0.8 * Math.PI); g.stroke(); }
  if (ex === 'smug') { g.beginPath(); g.moveTo(-hr * 0.2, my + 4); g.quadraticCurveTo(hr * 0.05, my + 8, hr * 0.28, my - 10); g.stroke(); }
  if (ex === 'laugh' || ex === 'grin') { const o = ex === 'laugh' ? 0.75 + Math.abs(Math.sin(t * 14)) * 0.25 : 0.6; g.beginPath(); g.moveTo(-hr * 0.32, my - hr * 0.08); g.quadraticCurveTo(0, my + hr * 0.5 * o, hr * 0.32, my - hr * 0.08); g.closePath(); g.fillStyle = '#5a1e1e'; g.fill(); g.stroke(); }
  if (ex === 'shock' || ex === 'scared') { g.beginPath(); g.ellipse(0, my + 4, hr * 0.13, hr * 0.2, 0, 0, Math.PI * 2); g.fillStyle = '#5a1e1e'; g.fill(); g.stroke(); }
  if (ex === 'angry' || ex === 'sad') { g.beginPath(); g.arc(0, my + hr * 0.12, hr * 0.2, 1.2 * Math.PI, 1.8 * Math.PI); g.stroke(); }
  if (ex === 'pain') { g.beginPath(); g.moveTo(-hr * 0.25, my); for (let k = 1; k <= 6; k++) g.lineTo(-hr * 0.25 + k * hr * 0.083, my + (k % 2 ? -6 : 6)); g.stroke(); }
  if (s.sweat) { g.fillStyle = '#7fd0ff'; g.strokeStyle = OUT; g.lineWidth = 3; g.beginPath(); g.moveTo(hr * 0.85, -hr * 0.5); g.quadraticCurveTo(hr * 1.05, -hr * 0.15, hr * 0.85, -hr * 0.05); g.quadraticCurveTo(hr * 0.65, -hr * 0.15, hr * 0.85, -hr * 0.5); g.fill(); g.stroke(); }
  g.restore(); g.restore();
}
K.char = (design, heightM = 1.75) => {
  const S = K.sprite(heightM * 0.62, heightM, (g, w, h, t, st) => drawChar(g, w, h, design, st, t), 440);
  S.mesh.geometry.translate(0, heightM / 2, 0); S.h = heightM; S.design = design; return S;
};
// place a sprite/char: pos [x,y,z] = feet point; flip mirrors
K.put = (S, pos, { flip = false, rot = 0, scale = 1, t = 0, st = {} } = {}) => {
  S.mesh.visible = true; S.mesh.position.set(...pos); S.mesh.scale.set(flip ? -scale : scale, scale, scale); S.mesh.rotation.set(0, 0, rot); S.redraw(t, st);
};
K.hideAll = () => { scene.children.forEach((o) => { if (o.isMesh && o.material && o.material.transparent) o.visible = false; }); };

// ---------- camera, timing, shots ----------
const sm = (x) => (x < 0 ? 0 : x > 1 ? 1 : x * x * x * (x * (6 * x - 15) + 10));
K.ease = sm; K.lerp = (a, b, u) => a.map((v, i) => v + (b[i] - v) * u);
K.camAt = (p, l, fov) => { cam.position.set(...p); cam.lookAt(...l); if (fov) { cam.fov = fov; cam.updateProjectionMatrix(); } };
K.shots = [];
K.frameState = null;
let S = null;
async function init() {
  S = await import('./scene.js'); await S.build(K);
  window.FRAMES = S.FRAMES; window.ready = true;
}
// motion blur: average N sub-frames over half a frame; N grows with camera speed
window.renderFrame = (f) => {
  const pos = []; const N0 = 1;
  const probe = (tf) => { S.frame(tf, K); cam.updateMatrixWorld(); return cam.position.clone().add(new THREE.Vector3(0, 0, -1).applyQuaternion(cam.quaternion).multiplyScalar(3)); };
  const a = probe(f - 0.25), b = probe(f + 0.25); const v = a.distanceTo(b);
  const N = Math.max(1, Math.min(10, Math.round(v * 40)));
  octx.globalAlpha = 1; octx.clearRect(0, 0, W, H);
  for (let k = 0; k < N; k++) {
    const tf = N === 1 ? f : f - 0.25 + 0.5 * k / (N - 1); S.frame(tf, K); gl.render(scene, cam);
    octx.globalAlpha = 1 / (k + 1); octx.drawImage(gl.domElement, 0, 0);
  }
  if (S.post) S.post(octx, f, K);
  return out.toDataURL('image/jpeg', 0.93);
};
init();
