// VID-018 — Aerovagón (Rusia, 1921): Abakovsky put an aircraft engine + propeller on a rail car; on the way back from Tula it derailed at full speed, 6 of 22 died, him included. No gore.
export let FRAMES = 2100;
let K, T, AB, O1, O2, O3, D1, D2, D3, W1, W2, SG = {}, wag, wag2, loco, smoke = [], dust = [], bulb, chain, engineW, candles = [], cap, capRail, propG, heads = [], stars = [];
const TRACK = [0, 0, 0], SHOP = [200, 0, 0], STA = [400, 0, 0], KREM = [600, 0, 0];
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);

function makeWagon() { // front = +z. origin on the rails.
  const g = new K.THREE.Group();
  const win = K.tex(512, 128, (c, w, h) => { c.fillStyle = '#3a6a4a'; c.fillRect(0, 0, w, h); for (let i = 0; i < 6; i++) { c.fillStyle = '#ffe2a0'; c.fillRect(20 + i * 82, 24, 60, 60); c.fillStyle = '#fffdf8'; c.beginPath(); c.arc(50 + i * 82, 70, 20, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#16121a'; c.lineWidth = 4; c.stroke(); } c.fillStyle = '#e0c040'; c.fillRect(0, 100, w, 10); });
  const wm = K.std(0xffffff, { map: win }), body = K.std(0x3a6a4a);
  const box = new K.THREE.Mesh(new K.THREE.BoxGeometry(2.4, 2.2, 6), [wm, wm, body, body, body, body]); box.position.set(0, 1.75, -1.2); box.castShadow = true; g.add(box);
  K.box(2.6, 0.2, 6.4, 0x8a2a1a, [0, 2.95, -1.2], { parent: g }); // roof
  K.box(2.4, 0.3, 9.2, 0x2a2a2a, [0, 0.55, 0.2], { parent: g }); // chassis
  const nose = K.box(2.4, 0.9, 2.4, 0x3a6a4a, [0, 1.15, 3.3], { parent: g }); // open cab low walls
  K.box(2.2, 0.1, 2.2, 0x6a4a2a, [0, 0.72, 3.3], { parent: g });
  nose.scale.set(1, 1, 1);
  // engine on a frame above the cab
  for (const [x, z] of [[-1.0, 2.3], [1.0, 2.3], [-1.0, 4.3], [1.0, 4.3]]) K.cyl(0.05, 0.05, 3.4, 0x2a2a2a, [x, 2.3, z], { parent: g });
  K.box(2.2, 0.15, 2.2, 0x2a2a2a, [0, 4.0, 3.3], { parent: g });
  const eng = new K.THREE.Group(); g.add(eng); K.cyl(0.55, 0.45, 1.6, 0x9aa0a8, [0, 4.5, 3.4], { parent: eng }).rotation.x = Math.PI / 2;
  for (let i = 0; i < 6; i++) { const c = K.box(0.2, 0.5, 0.25, 0x6a6e76, [0, 4.5, 3.4], { parent: eng }); c.rotation.z = -i * Math.PI / 3; c.position.set(Math.sin(i * Math.PI / 3) * 0.6, 4.5 + Math.cos(i * Math.PI / 3) * 0.6, 3.0); }
  const prop = new K.THREE.Group(); K.sph(0.25, 0xd8302a, [0, 0, 0], { parent: prop }); for (const s of [0, Math.PI]) { const b = K.box(0.26, 1.2, 0.08, 0x8a5a2a, [0, 0.6, 0], { parent: new K.THREE.Group() }); const arm = new K.THREE.Group(); arm.add(b); arm.rotation.z = s; prop.add(arm); }
  prop.position.set(0, 4.5, 4.35); g.add(prop);
  const blur = new K.THREE.Mesh(new K.THREE.CircleGeometry(1.25, 32), new K.THREE.MeshBasicMaterial({ color: 0xe8e0d0, transparent: true, opacity: 0.0, depthWrite: false })); blur.position.set(0, 4.5, 4.42); g.add(blur);
  for (const z of [-3.2, -0.8, 1.6, 3.8]) for (const x of [-0.75, 0.75]) { const w = K.cyl(0.4, 0.4, 0.15, 0x1a1a1a, [x, 0.4, z], { parent: g }); w.rotation.z = Math.PI / 2; }
  const cl = new K.THREE.PointLight(0xffd8a0, 7, 6, 1.6); cl.position.set(1.8, 3.2, 4.2); g.add(cl);
  g.userData = { prop, blur, eng }; K.scene.add(g); return g;
}
function rails(c, len = 220) {
  const sl = K.tex(64, 256, (g, w, h) => { g.fillStyle = '#7a6a50'; g.fillRect(0, 0, w, h); g.fillStyle = '#5a3a1e'; for (let y = 0; y < h; y += 32) g.fillRect(0, y, w, 18); }, [1, len / 8]);
  K.plane(3.2, len, K.std(0xffffff, { map: sl }), add(c, [0, 0.03, 0]));
  for (const x of [-0.75, 0.75]) K.box(0.1, 0.16, len, 0x8a8e96, add(c, [x, 0.1, 0]));
}
function fanHead(pos, col) { const g = new K.THREE.Group(); K.cyl(0.22, 0.26, 0.6, col, [0, 0.3, 0], { parent: g }); K.sph(0.26, 0xfffdf8, [0, 0.85, 0], { parent: g }); g.position.set(...pos); K.scene.add(g); heads.push({ g, y: pos[1], ph: Math.random() * 6 }); return g; }
function puff(arr, n, col, size) { for (let i = 0; i < n; i++) { const s = K.sph(size, col, [0, -99, 0], { transparent: true, opacity: 0.85 }); arr.push(s); } }

export async function build(k) {
  K = k; await K.preloadEnvs(); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  AB = C(K.scene, { shirt: 0x2a2a2a, belt: 0x8a5a2a, buttons: 0xe0c040, hat: 'cap', hatColor: 0x3a2a1a, hair: 0xd8a040, seed: 1 });
  O1 = C(K.scene, { shirt: 0x5a5a3a, belt: 0x2a1a10, hat: 'cap', hatColor: 0x5a5a3a, mustache: true, seed: 2 });
  O2 = C(K.scene, { shirt: 0x3a3a4a, tie: 0xd8302a, hat: 'bowler', hatColor: 0x1a1a1a, seed: 3 });
  O3 = C(K.scene, { shirt: 0x6a4a3a, hair: 0x2a1a10, glasses: true, seed: 4 });
  D1 = C(K.scene, { shirt: 0x2a5a9a, tie: 0xf2f2f2, hair: 0xe0c070, seed: 5 });
  D2 = C(K.scene, { shirt: 0x9a3a2a, hair: 0x1a1a1a, seed: 6 });
  D3 = C(K.scene, { shirt: 0x2a7a4a, tie: 0xe0b040, hair: 0x8a5a2a, seed: 7 });
  W1 = C(K.scene, { shirt: 0xc8a040, apron: 0x6a4a2a, hat: 'cap', hatColor: 0x3a3a3a, seed: 8 });
  W2 = C(K.scene, { shirt: 0x8a6ac8, hair: 0x5a3418, seed: 9 });
  wag = makeWagon(); wag2 = makeWagon();
  for (let i = 0; i < 8; i++) stars.push(K.sph(0.07, 0xfff0a0, [0, -99, 0], { emissive: 0xffe060, emissiveIntensity: 6 }));
  puff(smoke, 10, 0xe8e8e8, 0.5); puff(dust, 22, 0xe0cca8, 1.0);
  cap = new K.THREE.Group(); K.cyl(0.28, 0.3, 0.16, 0x7a5a3a, [0, 0.08, 0], { parent: cap }); const vis = K.box(0.36, 0.03, 0.22, 0x1a1a1a, [0, 0.02, 0.28], { parent: cap }); K.scene.add(cap);

  // ---------------- TRACK: summer birch forest, golden light ----------------
  const grass = K.tex(256, 256, (g, w, h) => { g.fillStyle = '#6aa83a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { g.fillStyle = ['#5a982a', '#7ab84a', '#8ac050'][i % 3]; g.fillRect(Math.random() * w, Math.random() * h, 2, 5); } }, [30, 30]);
  K.plane(260, 260, K.std(0xffffff, { map: grass }), add(TRACK, [0, 0.0, 0]));
  rails(TRACK);
  for (let i = 0; i < 26; i++) { const s = i % 2 ? 1 : -1; const tz = -60 + i * 5; if (s > 0 && tz > -12 && tz < 14) continue; if (s < 0 && tz > 6 && tz < 36) continue; await K.placeH(`nature_pack/BirchTree_${(i % 5) + 1}`, add(TRACK, [s * (6 + (i * 7) % 9), 0, -60 + i * 5]), i, 7 + (i % 3)).catch(() => {}); }
  for (let i = 0; i < 14; i++) await K.placeH(`nature_pack/Grass`, add(TRACK, [(i % 2 ? 1 : -1) * (2.3 + (i % 3) * 0.6), 0, -20 + i * 3]), i, 0.6).catch(() => {});
  SG.hook = K.sign('TREN + HÉLICE', [1.32, 1.9, -1.2], { w: 4.0, h: 1.0, bg: '#b8301e', rotY: Math.PI / 2 }); K.scene.remove(SG.hook); wag.add(SG.hook);
  SG.tula = K.sign('TULA', add(TRACK, [3.6, 2.6, -14]), { w: 2.6, h: 0.9, bg: '#1e5a8a', posts: true, rotY: -0.4 });
  SG.reg = K.sign('REGRESO', add(TRACK, [3.6, 2.6, -14]), { w: 3.0, h: 0.9, bg: '#2a1a10', posts: true, rotY: -0.4 });
  SG.why = K.sign('¿POR QUÉ?', add(TRACK, [-1.0, 3.9, 34.2]), { w: 2.6, h: 0.8, bg: '#e0b040', fg: '#2a1a10', border: '#2a1a10', rotY: -0.5 });
  SG.six = K.sign('6 DE 22', add(TRACK, [-2.8, 2.6, 40]), { w: 3.0, h: 0.95, bg: '#2a1a10', posts: true, rotY: 0.3 });
  for (let i = 0; i < 6; i++) { const c = new K.THREE.Group(); K.cyl(0.07, 0.07, 0.35, 0xf2ead8, [0, 0.18, 0], { parent: c }); K.sph(0.06, 0xffc040, [0, 0.42, 0], { parent: c, emissive: 0xff9020, emissiveIntensity: 4 }); c.position.set(...add(TRACK, [-1.6, 0.0, 39 + i * 0.5])); K.scene.add(c); candles.push(c); }
  // fallen propeller in the grass
  propG = new K.THREE.Group(); K.sph(0.25, 0xd8302a, [0, 0, 0], { parent: propG }); for (const s of [0, Math.PI]) { const a = new K.THREE.Group(); K.box(0.32, 1.7, 0.08, 0x8a5a2a, [0, 0.85, 0], { parent: a }); a.rotation.z = s; propG.add(a); } propG.position.set(...add(TRACK, [-5, 0.25, 50])); propG.rotation.x = -Math.PI / 2 + 0.25; K.scene.add(propG);
  // ---------------- WORKSHOP: red-brick depot ----------------
  const fl = K.tex(256, 256, (g) => { g.fillStyle = '#5a5248'; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 400; i++) { g.fillStyle = ['#4a443c', '#6a6258'][i % 2]; g.fillRect(Math.random() * 256, Math.random() * 256, 6, 3); } }, [6, 6]);
  K.plane(30, 24, K.std(0xffffff, { map: fl }), add(SHOP, [0, 0.01, 0]));
  const brick = K.tex(256, 256, (g, w, h) => { g.fillStyle = '#e8d8c0'; g.fillRect(0, 0, w, h); for (let y = 0; y < 16; y++) for (let x = 0; x < 8; x++) { g.fillStyle = ['#a8402a', '#b84a30', '#983828'][(x + y) % 3]; g.fillRect(x * 32 + (y % 2) * 16 + 1, y * 16 + 1, 30, 14); } }, [6, 2]);
  const bw = K.std(0xffffff, { map: brick }); K.plane(30, 10, bw, add(SHOP, [0, 5, -8]), [0, 0, 0]); K.plane(20, 10, bw, add(SHOP, [-11, 5, 0]), [0, Math.PI / 2, 0]); K.plane(20, 10, bw, add(SHOP, [11, 5, 0]), [0, -Math.PI / 2, 0]);
  for (let i = 0; i < 4; i++) { K.box(2.2, 3, 0.1, 0x9ad0e8, add(SHOP, [-7.5 + i * 5, 5.5, -7.9]), { emissive: 0x6a9ab8, emissiveIntensity: 0.6 }); }
  rails(add(SHOP, [0, 0, 0]), 22);
  for (let i = 0; i < 4; i++) await K.placeH('survival_pack/Barrel', add(SHOP, [-6 + (i % 2) * 0.9, 0, -5.5 - (i > 1 ? 0.9 : 0)]), i, 1.1).catch(() => {});
  K.box(3, 1, 1.2, 0x6a4a2a, add(SHOP, [6, 0.5, -5.6])); for (let i = 0; i < 5; i++) K.cyl(0.05, 0.05, 0.6, 0x8a8e96, add(SHOP, [5 + i * 0.4, 1.3, -5.6]));
  engineW = new K.THREE.Group(); K.cyl(0.55, 0.45, 1.6, 0x9aa0a8, [0, 0, 0], { parent: engineW }).rotation.x = Math.PI / 2; for (let i = 0; i < 6; i++) { const c = K.box(0.2, 0.5, 0.25, 0x6a6e76, [Math.sin(i * Math.PI / 3) * 0.6, Math.cos(i * Math.PI / 3) * 0.6, -0.4], { parent: engineW }); c.rotation.z = -i * Math.PI / 3; } K.scene.add(engineW);
  chain = K.cyl(0.04, 0.04, 6, 0x4a4a4a, [0, -99, 0]); K.box(20, 0.4, 0.4, 0xd8a030, add(SHOP, [0, 8.2, 0]));
  bulb = new K.THREE.Group(); K.sph(0.28, 0xfff080, [0, 0.1, 0], { parent: bulb, emissive: 0xffe040, emissiveIntensity: 3 }); K.cyl(0.12, 0.12, 0.18, 0x8a8e96, [0, -0.22, 0], { parent: bulb }); K.scene.add(bulb);
  SG.y25 = K.sign('25 AÑOS', add(SHOP, [-3.2, 4.0, -7.85]), { w: 2.8, h: 0.9, bg: '#2a1a10' });
  SG.aero = K.sign('AEROVAGÓN', add(SHOP, [2.5, 4.6, -7.85]), { w: 4.4, h: 1.1, bg: '#b8301e' });
  K.pointLight(0xffc080, 10, add(SHOP, [0, 5, 0]), 16);
  // ---------------- STATION: Moscow platform, red banners ----------------
  K.plane(80, 60, K.std(0x8a8478), add(STA, [0, 0.0, 0]));
  rails(add(STA, [0, 0, 0]), 80); K.box(40, 0.9, 5, 0xb8aa90, add(STA, [-4.6, 0.45, 0]), { map: fl });
  const stw = K.tex(256, 256, (g, w, h) => { g.fillStyle = '#e8d8b0'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8b890'; for (let x = 0; x < w; x += 64) g.fillRect(x, 0, 10, h); g.fillStyle = '#3a6a8a'; g.fillRect(20, 60, 30, 70); g.fillRect(84, 60, 30, 70); g.fillRect(148, 60, 30, 70); g.fillRect(212, 60, 30, 70); }, [5, 1]);
  K.plane(40, 9, K.std(0xffffff, { map: stw }), add(STA, [-7.1, 4.5, 0]), [0, Math.PI / 2, 0]);
  for (let i = 0; i < 6; i++) { K.box(0.9, 3.2, 0.05, 0xc8201a, add(STA, [-7.0 + 0.05, 5.2, -12 + i * 4.5]), {}).rotation.y = Math.PI / 2; }
  K.pointLight(0xffe0b0, 10, add(STA, [-4, 4, 0]), 18); K.pointLight(0xffe0b0, 8, add(STA, [-4, 4, -8]), 14);
  loco = new K.THREE.Group(); K.cyl(1.0, 1.0, 5, 0x2a4a3a, [0, 1.9, 0.5], { parent: loco }).rotation.x = Math.PI / 2; K.box(2.4, 2.6, 2.2, 0x2a4a3a, [0, 2.1, -2.6], { parent: loco }); K.cyl(0.32, 0.45, 1.3, 0x2a2a2a, [0, 3.4, 2.4], { parent: loco }); K.box(2.6, 0.4, 6.5, 0x8a1a1a, [0, 0.6, -0.4], { parent: loco });
  for (const z of [-2.6, -0.8, 1.2, 2.6]) for (const x of [-0.8, 0.8]) K.cyl(0.55, 0.55, 0.15, 0x8a1a1a, [x, 0.55, z], { parent: loco }).rotation.z = Math.PI / 2;
  K.scene.add(loco);
  SG.y21 = K.sign('1921', add(STA, [-6.9, 3.6, 4]), { w: 2.4, h: 1.0, bg: '#2a1a10', rotY: Math.PI / 2 });
  SG.ofi = K.sign('VIAJE OFICIAL', add(STA, [-6.9, 3.6, -3]), { w: 4.0, h: 1.0, bg: '#c8201a', rotY: Math.PI / 2 });
  SG.n22 = K.sign('22 → TULA', add(STA, [-6.9, 3.0, 4.5]), { w: 3.6, h: 1.0, bg: '#1e5a8a', rotY: Math.PI / 2 });
  const cols = [0xc23a2a, 0x2a6aa8, 0xe0b040, 0x3a8a3a, 0x8a2a6a, 0xe08a20, 0xf2ead8, 0x5a5a3a];
  for (let i = 0; i < 22; i++) fanHead(add(STA, [-5.8 + (i % 3) * 0.8, 0.9, 1 + Math.floor(i / 3) * 0.9]), cols[i % 8]);
  // flags of several countries (generic stripes)
  SG.flags = new K.THREE.Group(); [[0xd8302a, 0xf2f2f2], [0x2a5aa8, 0xe0c040], [0x2a8a4a, 0xf2f2f2]].forEach((c, i) => { const fl2 = K.tex(128, 96, (g) => { g.fillStyle = '#' + c[0].toString(16).padStart(6, '0'); g.fillRect(0, 0, 128, 96); g.fillStyle = '#' + c[1].toString(16).padStart(6, '0'); g.fillRect(0, 32, 128, 32); }); const m = new K.THREE.Mesh(new K.THREE.PlaneGeometry(1.2, 0.9), new K.THREE.MeshBasicMaterial({ map: fl2, side: K.THREE.DoubleSide })); m.position.set(-1.5 + i * 1.5, 3.4, 0); SG.flags.add(m); K.cyl(0.03, 0.03, 3.6, 0x4a3a2a, [-1.5 + i * 1.5 - 0.6, 1.8, 0], { parent: SG.flags }); }); SG.flags.position.set(...add(STA, [-4.2, 0.9, -8])); SG.flags.rotation.y = Math.PI / 2; K.scene.add(SG.flags);
  // ---------------- KREMLIN WALL at dusk ----------------
  K.plane(80, 60, K.std(0x5a8a3a), add(KREM, [0, 0, 0]));
  K.box(40, 7, 2, 0xa8302a, add(KREM, [0, 3.5, -6]), { map: brick }); for (let i = 0; i < 20; i++) { const m = K.box(1.0, 1.2, 2, 0xa8302a, add(KREM, [-19 + i * 2, 7.6, -6])); }
  K.box(4, 13, 4, 0xa8302a, add(KREM, [9, 6.5, -6.5])); const sp = K.cyl(0.01, 2.2, 4, 0x2a6a4a, add(KREM, [9, 15, -6.5]), { seg: 8 }); K.sph(0.35, 0xd8302a, add(KREM, [9, 17.2, -6.5]), { emissive: 0xd8302a, emissiveIntensity: 2 });
  for (let i = 0; i < 9; i++) K.sph(0.16, [0xe8304a, 0xf2e040, 0xf2f2f2][i % 3], add(KREM, [-1.6 + i * 0.4, 0.2, -4.6]));
  K.box(4, 0.5, 1.2, 0x6a6a6a, add(KREM, [0, 0.25, -4.6]));
  SG.krem = K.sign('KREMLIN', add(KREM, [0, 4.0, -4.9]), { w: 3.6, h: 1.0, bg: '#2a1a10', border: '#e0b040' });
}

function hideAll() {
  for (const c of [AB, O1, O2, O3, D1, D2, D3, W1, W2]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); if (c.root.parent !== K.scene) { c.root.parent.remove(c.root); K.scene.add(c.root); } }
  for (const g of Object.values(SG)) g.visible = false;
  for (const w of [wag, wag2]) { w.position.set(0, -99, 0); w.rotation.set(0, 0, 0); w.userData.blur.material.opacity = 0; w.visible = true; w.userData.prop.visible = true; w.userData.eng.visible = true; }
  for (const s of [...smoke, ...dust, ...stars]) s.position.set(0, -99, 0);
  loco.position.set(...add(STA, [0, 0, 6])); engineW.position.set(0, -99, 0); chain.position.set(0, -99, 0); bulb.position.set(0, -99, 0);
  cap.position.set(0, -99, 0); cap.rotation.set(0, 0, 0); for (const h of heads) { h.g.position.y = h.y; h.g.visible = false; } propG.rotation.z = 0;
}
function spin(w, t, speed = 1) { w.userData.prop.rotation.z = t * 40 * speed; w.userData.blur.material.opacity = 0.14 * Math.min(1, speed); }
function rideAB(w, f, o = {}) { // AB stands in the open front cab
  P(AB, { pos: [0, 0.72, 3.0], yaw: 0, expr: o.expr || 'happy', arms: o.arms || 'wave', tremble: o.tremble || 0, sweat: o.sweat }, f); w.add(AB.root);
}
function hookShot(f, t, z) { // the aerowagon racing toward camera on the forest track
  wag.position.set(...add(TRACK, [0, Math.sin(t * 30) * 0.02, z])); spin(wag, t, 1); rideAB(wag, f, { expr: 'happy', arms: 'up' }); SG.hook.visible = true;
}

export function frame(f, k) {
  hideAll(); const ph = K.at(f), t = f / 30, u = (i, j) => K.u(f, i, j);
  K.preset('day', { exposure: 1.05 });
  switch (ph) {
    case 0: { const v = u(0); const z = -8 + v * 9; hookShot(f, t, z);
      K.move({ p: add(TRACK, [9.0, 3.4, z + 10.5]), l: add(TRACK, [-0.2, 2.6, z + 0.6]), fov: 48 }, { p: add(TRACK, [8.4, 3.3, z + 9.6]), l: add(TRACK, [-0.2, 2.7, z + 0.8]), fov: 46 }, v, 1.4, f); K.focusOn(add(TRACK, [0, 2.4, z + 3])); break; }
    case 1: { // it worked... that was the problem: it whooshes past, he waves proudly, then side view
      const v = u(1); const z = -4 + v * 14; wag.position.set(...add(TRACK, [0, 0, z])); spin(wag, t, 1); rideAB(wag, f, { expr: v < 0.6 ? 'proud' : 'worried', arms: v < 0.6 ? 'wave' : 'down' });
      K.move({ p: add(TRACK, [8.5, 3.0, 5]), l: add(TRACK, [0, 2.4, z + 1]), fov: 46 }, { p: add(TRACK, [8.0, 3.0, 7]), l: add(TRACK, [0, 2.6, z + 1]), fov: 44 }, v, 1.0, f); K.focusOn(add(TRACK, [0, 2.4, z + 2])); break; }
    case 2: { // Russia 1921, trains slow and old: crawling black steam loco, bored passengers, smoke
      K.preset('day', { exposure: 1.2, sky: [0x7a8aa0, 0xa8b0b8, 0xd0d4d8] }); const v = u(2); SG.y21.visible = true; loco.position.set(...add(STA, [0, 0, 2 + v * 1.2]));
      smoke.forEach((s, i) => { const k2 = (t * 0.3 + i / 10) % 1; s.position.set(...add(STA, [Math.sin(i) * 0.3, 4.2 + k2 * 4, 4.6 + v * 1.2 - k2 * 2])); s.scale.setScalar(0.6 + k2 * 1.6); });
      P(O1, { pos: add(STA, [-3.2, 0.9, 0.5]), yaw: 1.2, expr: 'tired', arms: 'cross' }, f); P(O3, { pos: add(STA, [-3.6, 0.9, -1.0]), yaw: 1.0, expr: 'tired', arms: 'think' }, f);
      K.move({ p: add(STA, [-6.4, 2.8, 7.5]), l: add(STA, [-1.5, 2.2, -0.5]), fov: 48 }, { p: add(STA, [-6.0, 2.8, 6.5]), l: add(STA, [-1.5, 2.3, -0.5]), fov: 46 }, v, 0.5, f); K.focusOn(add(STA, [-1, 2, 1])); break; }
    case 3: { // a 25-year-old chauffeur had a crazy idea: light bulb pops above his head
      K.preset('interior', { exposure: 1.2 }); const v = u(3); const p = add(SHOP, [-2.0, 0, -3.0]); SG.y25.visible = true;
      P(AB, { pos: p, yaw: 0.2, expr: v < 0.45 ? 'neutral' : 'happy', arms: v < 0.45 ? 'think' : 'up' }, f);
      if (v > 0.45) { bulb.position.set(...add(p, [0, 3.5 + Math.sin(t * 8) * 0.05, 0])); if (v < 0.52) K.grade.flash.value = 0.3; }
      K.move(K.frame([p], { yaw: 0.3, h: 4.0, lookY: 2.6, pitch: -0.06, push: 0.75 }), K.frame([p], { yaw: 0.15, h: 4.0, lookY: 2.7, pitch: -0.08, push: 0.66 }), v, 0.5, f); K.focusOn(add(p, [0, 2.4, 0])); break; }
    case 4: { // took a wagon, mounted an airplane engine... and a giant propeller: engine lowers on a chain, then prop spins up
      K.preset('interior', { exposure: 1.2 }); const v = u(4); wag.position.set(...add(SHOP, [0, 0, -1]));
      const down = K.ease(Math.min(1, v / 0.5)); const engP = add(SHOP, [0, 4.5 + (1 - down) * 3, -1 + 3.4]);
      if (down < 1) { engineW.position.set(...engP); chain.position.set(...add(engP, [0, 3.4, 0])); wag.userData.eng.visible = false; }
      wag.userData.prop.visible = v > 0.55; if (v > 0.55) spin(wag, t, (v - 0.55) * 2.2);
      P(AB, { pos: add(SHOP, [-2.4, 0, 2.2]), yaw: 0.7, expr: v > 0.55 ? 'laugh' : 'happy', arms: v > 0.55 ? 'up' : 'point', bounce: v > 0.55 ? 0.6 : 0 }, f);
      P(W1, { pos: add(SHOP, [2.4, 0, 2.0]), yaw: -0.7, expr: 'shock', arms: 'hammer' }, f);
      K.move({ p: add(SHOP, [6.5, 3.6, 8.5]), l: add(SHOP, [0, 3.2, 1.5]), fov: 46 }, { p: add(SHOP, [5.5, 3.2, 7.5]), l: add(SHOP, [0, 3.2, 1.8]), fov: 46 }, v, 0.5, f); K.focusOn(add(SHOP, [0, 3, 2])); break; }
    case 5: { // he called it the AEROVAGÓN: sign, proud pose by the nose
      K.preset('interior', { exposure: 1.2 }); wag.position.set(...add(SHOP, [0, 0, -1])); spin(wag, t, 0.3); SG.aero.visible = true; const p = add(SHOP, [2.4, 0, 3.0]);
      P(AB, { pos: p, yaw: -0.3, expr: 'proud', arms: 'akimbo' }, f);
      K.move(K.frame([p, add(SHOP, [0, 0, 3])], { yaw: 0.2, h: 5.2, lookY: 3.0, pitch: -0.05, push: 0.95 }), K.frame([p, add(SHOP, [0, 0, 3])], { yaw: 0.05, h: 5.2, lookY: 3.2, pitch: -0.08, push: 0.85 }), u(5), 0.5, f); K.focusOn(add(p, [0, 2.4, 0])); break; }
    case 6: { // tests: like a plane without wings, everyone amazed — onlookers, hats fly as it zooms past
      const v = u(6); const z = -22 + v * 40; wag.position.set(...add(TRACK, [0, 0, z])); spin(wag, t, 1); rideAB(wag, f, { expr: 'laugh', arms: 'up' });
      const a = add(TRACK, [3.2, 0, 0.4]), b = add(TRACK, [4.4, 0, -0.6]); const passed = z > -2;
      P(D2, { pos: a, yaw: -1.2, expr: passed ? 'shock' : 'happy', arms: passed ? 'up' : 'point', lean: passed ? -0.2 : 0 }, f); P(W2, { pos: b, yaw: -1.0, expr: 'shock', arms: passed ? 'flail' : 'wave' }, f);
      if (passed) { cap.position.set(...add(a, [-0.5 * (z + 2) * 0.1, 3.0 + (z + 2) * 0.08, 0])); cap.rotation.set(t * 4, 0, t * 3); }
      K.move({ p: add(TRACK, [8.2, 2.0, 7]), l: add(TRACK, [2.0, 2.4, -1]), fov: 46 }, { p: add(TRACK, [7.6, 2.0, 6.0]), l: add(TRACK, [1.6, 2.4, -1]), fov: 46 }, v, 1.2, f); K.focusOn(add(TRACK, [3.4, 2, 0])); break; }
    case 7: { // official trip with important guests: officials on the platform, VIAJE OFICIAL
      K.preset('day', { exposure: 1.25 }); SG.ofi.visible = true; const a = add(STA, [-3.6, 0.9, -2.2]), b = add(STA, [-4.6, 0.9, -3.4]), c = add(STA, [-3.4, 0.9, -4.2]);
      P(O1, { pos: a, yaw: 1.5, expr: 'proud', arms: 'akimbo' }, f); P(O2, { pos: b, yaw: 1.3, expr: 'smug', arms: 'cross' }, f); P(O3, { pos: c, yaw: 1.6, expr: 'neutral', arms: 'hold' }, f);
      K.move(K.frame([a, b, c], { yaw: 1.3, h: 4.6, lookY: 2.8, pitch: -0.05, push: 1.1 }), K.frame([a, b, c], { yaw: 1.45, h: 4.6, lookY: 2.8, pitch: -0.07, push: 1.0 }), u(7), 0.5, f); K.focusOn(add(STA, [-3.8, 2.6, -3])); break; }
    case 8: { // 22 people boarded toward Tula: crowd of 22 heads by the aerowagon, sign 22 → TULA
      K.preset('day', { exposure: 1.25 }); SG.n22.visible = true; loco.position.set(0, -99, 0); wag.position.set(...add(STA, [0, 0, 4])); spin(wag, t, 0.2);
      for (const h of heads) h.g.visible = true; for (const h of heads) h.g.position.y = h.y + Math.abs(Math.sin(t * 6 + h.ph)) * 0.12;
      K.move({ p: add(STA, [-3.4, 7.5, 15]), l: add(STA, [-3.6, 1.2, 4.5]), fov: 46 }, { p: add(STA, [-3.2, 6.8, 13.5]), l: add(STA, [-3.6, 1.2, 4.5]), fov: 46 }, u(8), 0.5, f); K.focusOn(add(STA, [-3, 1.6, 5])); break; }
    case 9: { // among them, communist leaders from several countries: 3 delegates + flags
      K.preset('day', { exposure: 1.25 }); SG.flags.visible = true; const a = add(STA, [-3.2, 0.9, -7.2]), b = add(STA, [-3.2, 0.9, -8.6]), c = add(STA, [-3.2, 0.9, -10]);
      P(D1, { pos: a, yaw: Math.PI / 2, expr: 'proud', arms: 'wave' }, f); P(D2, { pos: b, yaw: Math.PI / 2, expr: 'happy', arms: 'point' }, f); P(D3, { pos: c, yaw: Math.PI / 2, expr: 'smug', arms: 'akimbo' }, f);
      K.move(K.frame([a, b, c], { yaw: Math.PI / 2 + 0.2, h: 4.4, lookY: 2.8, pitch: -0.05, push: 0.95 }), K.frame([a, b, c], { yaw: Math.PI / 2 + 0.05, h: 4.4, lookY: 2.8, pitch: -0.07, push: 0.88 }), u(9), 0.5, f); K.focusOn(b); break; }
    case 10: { // the outward trip was a total success... but the return remained: TULA sign → REGRESO sign
      K.preset('golden', { exposure: 1.1 }); const v = u(10); const z = -22 + v * 6; wag.position.set(...add(TRACK, [0, 0, z])); spin(wag, t, 0.6); rideAB(wag, f, { expr: v < 0.55 ? 'laugh' : 'worried', arms: v < 0.55 ? 'up' : 'down' });
      (v < 0.55 ? SG.tula : SG.reg).visible = true; if (v > 0.53 && v < 0.58) K.grade.flash.value = 0.25;
      K.move({ p: add(TRACK, [5.6, 2.4, -6]), l: add(TRACK, [1.2, 2.6, -16]), fov: 46 }, { p: add(TRACK, [5.0, 2.6, -8]), l: add(TRACK, [1.4, 2.6, -16]), fov: 46 }, v, 0.6, f); K.focusOn(add(TRACK, [1, 2.4, -15])); break; }
    case 11: { // way back to Moscow at full speed: dusk, close on AB in the cab, wind, shake
      K.preset('golden', { exposure: 1.3 }); const v = u(11); const z = 10 + v * 16; wag.position.set(...add(TRACK, [0, Math.sin(t * 40) * 0.03, z])); spin(wag, t, 1.2); rideAB(wag, f, { expr: 'worried', arms: 'reach', tremble: 2 });
      K.move({ p: add(TRACK, [3.4, 2.9, z + 4.2]), l: add(TRACK, [0, 2.4, z + 2.8]), fov: 48 }, { p: add(TRACK, [3.1, 2.9, z + 3.8]), l: add(TRACK, [0, 2.5, z + 2.8]), fov: 46 }, v, 2.2, f); K.focusOn(add(TRACK, [0, 2.6, z + 3])); break; }
    case 12: { // AND HERE IT ALL WENT WRONG: macro wheel on the rail, sparks, vignette
      K.preset('dusk', { exposure: 1.2 }); K.grade.vig.value = 0.6; const v = u(12); if (v < 0.08) K.grade.flash.value = 0.4; const z = 30; wag.position.set(...add(TRACK, [0, Math.sin(t * 50) * 0.04, z])); spin(wag, t, 1.2);
      stars.forEach((s, i) => { const k2 = (t * 3 + i / 8) % 1; s.position.set(...add(TRACK, [0.75 + k2 * 0.6, 0.25 + Math.sin(i) * 0.2, z + 1.6 - k2 * 1.5])); });
      K.move({ p: add(TRACK, [2.0, 0.6, z + 3.2]), l: add(TRACK, [0.75, 0.4, z + 1.6]), fov: 44 }, { p: add(TRACK, [1.7, 0.55, z + 2.8]), l: add(TRACK, [0.75, 0.4, z + 1.6]), fov: 42 }, v, 1.5, f); K.focusOn(add(TRACK, [0.75, 0.4, z + 1.6])); break; }
    case 13: { // DERAIL: jumps off the rails, tips, slides into the grass, dust cloud (cut before impact)
      K.preset('dusk', { exposure: 1.1 }); const v = u(13); const j = K.ease(Math.min(1, v / 0.6)); const z = 32 + v * 8;
      wag.position.set(...add(TRACK, [j * 3.6, Math.sin(j * Math.PI) * 1.4, z])); wag.rotation.set(0, j * 0.5, -j * 0.9); spin(wag, t, 1 - j * 0.6);
      if (v > 0.35) dust.forEach((s, i) => { const k2 = Math.min(1, (v - 0.35) / 0.65); const a = i / dust.length * Math.PI * 2; s.position.set(...add(TRACK, [3.6 + Math.cos(a) * (1 + k2 * 4), 0.6 + (i % 4) * 0.6 * k2 + k2, z + Math.sin(a) * (1 + k2 * 4)])); s.scale.setScalar(0.6 + k2 * 1.8); });
      if (v > 0.55 && v < 0.62) K.grade.flash.value = 0.5;
      K.move({ p: add(TRACK, [-9, 4.6, 22]), l: add(TRACK, [1.6, 1.8, 37]), fov: 46 }, { p: add(TRACK, [-9.5, 4.8, 23]), l: add(TRACK, [2.2, 1.8, 38]), fov: 46 }, v, 2.0, f); K.focusOn(add(TRACK, [2, 1.6, 37])); break; }
    case 14: { // it was never known exactly why: dust settles, tipped wagon, official shrugs, ¿POR QUÉ?
      K.preset('golden', { exposure: 1.15 }); const v = u(14); wag.position.set(...add(TRACK, [3.6, 0.4, 40])); wag.rotation.set(0, 0.5, -0.9); wag.userData.prop.rotation.z = 1.2; SG.why.visible = true;
      dust.forEach((s, i) => { const a = i / dust.length * Math.PI * 2; s.position.set(...add(TRACK, [3.6 + Math.cos(a) * 5, 1.2 + (i % 4) * 0.5 - v * 0.6, 40 + Math.sin(a) * 5])); s.scale.setScalar(2.2 - v * 1.2); });
      const p = add(TRACK, [-1.4, 0, 34.5]); P(O1, { pos: p, yaw: 0.4, expr: 'worried', arms: 'shrug' }, f);
      K.move(K.frame([p], { yaw: -0.5, h: 4.4, lookY: 2.6, pitch: -0.05, push: 0.9 }), K.frame([p], { yaw: -0.35, h: 4.4, lookY: 2.6, pitch: -0.06, push: 0.82 }), v, 0.4, f); K.focusOn(add(p, [0, 2.2, 0])); break; }
    case 15: { // of 22 on board, six died: six candles by the track, sign 6 DE 22
      K.preset('dusk', { exposure: 1.2 }); SG.six.visible = true;
      K.move({ p: add(TRACK, [1.8, 1.9, 46]), l: add(TRACK, [-1.9, 1.2, 40]), fov: 46 }, { p: add(TRACK, [1.4, 1.8, 45]), l: add(TRACK, [-1.9, 1.2, 40.2]), fov: 46 }, u(15), 0.3, f); K.focusOn(add(TRACK, [-1.6, 0.4, 40.2])); break; }
    case 16: { // one of them was the inventor himself: his cap alone on the rail
      K.preset('golden', { exposure: 1.15 }); cap.position.set(...add(TRACK, [0.75, 0.2, 37])); cap.rotation.set(0, 0.4, 0.12);
      K.move({ p: add(TRACK, [2.4, 1.7, 39.8]), l: add(TRACK, [0.75, 0.25, 37]), fov: 44 }, { p: add(TRACK, [2.0, 1.5, 39.2]), l: add(TRACK, [0.75, 0.25, 37]), fov: 42 }, u(16), 0.3, f); K.focusOn(add(TRACK, [0.75, 0.3, 37])); break; }
    case 17: { // buried beside the Kremlin wall: red wall at dusk, flowers, KREMLIN
      K.preset('golden', { exposure: 1.15 }); SG.krem.visible = true;
      K.move({ p: add(KREM, [3.5, 1.6, 6]), l: add(KREM, [0, 3.4, -5]), fov: 48 }, { p: add(KREM, [2.4, 1.5, 4.4]), l: add(KREM, [0, 3.2, -5]), fov: 46 }, u(17), 0.3, f); K.focusOn(add(KREM, [0, 2.4, -4.6])); break; }
    case 18: { // fast... too fast: the propeller in the grass slowly turning to a stop
      K.preset('golden', { exposure: 1.1 }); const v = u(18); propG.rotation.z = (1 - Math.pow(1 - v, 2)) * 3.0; wag.position.set(...add(TRACK, [3.6, 0.4, 40])); wag.rotation.set(0, 0.5, -0.9); wag.userData.prop.visible = false;
      K.move({ p: add(TRACK, [-6.8, 2.6, 55.5]), l: add(TRACK, [-3.0, 0.6, 46.5]), fov: 46 }, { p: add(TRACK, [-6.9, 2.3, 54.6]), l: add(TRACK, [-3.0, 0.5, 46.5]), fov: 44 }, v, 0.3, f); K.focusOn(add(TRACK, [-5, 0.3, 50])); break; }
    default: { const v = u(19); const z = -8 + v * 9; hookShot(f, t, z);
      K.move({ p: add(TRACK, [8.4, 3.3, z + 9.6]), l: add(TRACK, [-0.2, 2.7, z + 0.8]), fov: 46 }, { p: add(TRACK, [9.0, 3.4, z + 10.5]), l: add(TRACK, [-0.2, 2.6, z + 0.6]), fov: 48 }, v, 1.4, f); K.focusOn(add(TRACK, [0, 2.6, z + 3]));
    }
  }
}
