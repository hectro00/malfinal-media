// VID-017 — Sherwood Anderson (1941): famous writer swallowed the toothpick of a martini olive at his farewell party, died in Colón, Panamá. No gore.
export let FRAMES = 2100;
let K, T, AN, WF, G1, G2, G3, DR, SA, R1, R2, SG = {}, myGlass, bigGlass, trayGlasses = [], letter, door, paperFly = [], notes = [], bookA, bookB, xray, hatBed, boat, waters = [], suitcase, stars = [];
const PARTY = [0, 0, 0], OFFICE = [200, 0, 0], SHIP = [400, 0, 0], PAN = [600, 0, 0], HOSP = [800, 0, 0], TOMB = [1000, 0, 0];
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
const _v = () => new K.THREE.Vector3();
function holdW(C, obj, off = [0, -0.05, 0.05]) { C.root.updateMatrixWorld(true); const v = _v(); C.armR.end.getWorldPosition(v); obj.position.set(v.x + off[0], v.y + off[1], v.z + off[2]); obj.rotation.set(0, 0, 0); }
const TOAST = (C) => { C.armR.a.rotation.set(-2.1, 0, -0.35); C.armR.b.rotation.set(-0.7, 0, 0); };
const DRINK = (C) => { C.armR.a.rotation.set(-1.25, 0, -0.45); C.armR.b.rotation.set(-1.7, 0, 0); };

function martini(s = 1) { // origin at the base of the glass
  const g = new K.THREE.Group();
  K.cyl(0.075, 0.075, 0.012, 0xdff4ff, [0, 0.006, 0], { parent: g, transparent: true, opacity: 0.8 });
  K.cyl(0.01, 0.01, 0.2, 0xdff4ff, [0, 0.11, 0], { parent: g, transparent: true, opacity: 0.8 });
  K.cyl(0.17, 0.006, 0.17, 0xe8f8ff, [0, 0.29, 0], { parent: g, transparent: true, opacity: 0.45 });
  K.cyl(0.14, 0.02, 0.13, 0xf4f0c0, [0, 0.27, 0], { parent: g, transparent: true, opacity: 0.85 });
  const pick = new K.THREE.Group(); K.cyl(0.008, 0.008, 0.3, 0xe8c27a, [0, 0, 0], { parent: pick }); K.sph(0.045, 0x5a8a1a, [0, -0.05, 0], { parent: pick }); K.sph(0.016, 0xd8402a, [0, -0.05, 0.04], { parent: pick });
  pick.position.set(0.03, 0.33, 0); pick.rotation.z = 0.45; g.add(pick); g.userData.pick = pick; g.scale.setScalar(s); K.scene.add(g); return g;
}
function water(c, size, o = {}) {
  const tx = K.tex(256, 256, (g, w, h) => { g.fillStyle = o.base || '#2a6a9a'; g.fillRect(0, 0, w, h); g.strokeStyle = o.line || 'rgba(190,230,255,0.5)'; g.lineWidth = 5; for (let i = 0; i < 9; i++) { g.beginPath(); const y = i * 29 + 10; g.moveTo(0, y); for (let x = 0; x <= w; x += 16) g.lineTo(x, y + Math.sin(x / 20 + i) * 5); g.stroke(); } }, [size / 6, size / 6]);
  K.plane(size, size, K.std(0xffffff, { map: tx }), add(c, [0, o.y ?? -0.6, 0])); waters.push(tx);
}
function textTex(lines, o = {}) { return K.tex(512, 640, (g, w, h) => { g.fillStyle = o.bg || '#9aa0a8'; g.fillRect(0, 0, w, h); g.fillStyle = o.fg || '#2a2a30'; g.textAlign = 'center'; g.font = `900 ${o.fs || 64}px Poppins, sans-serif`; lines.forEach((l, i) => g.fillText(l, w / 2, (o.y0 || 150) + i * (o.lh || 95))); }); }

export async function build(k) {
  K = k; await K.preloadEnvs(); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  AN = C(K.scene, { shirt: 0x46506a, tie: 0xc0302a, buttons: 0xe0c070, hair: 0xb8b8b8, seed: 1 });
  WF = C(K.scene, { shirt: 0xc85a8a, hair: 0x5a3418, seed: 2 });
  G1 = C(K.scene, { shirt: 0x2a8a7a, tie: 0xe0b040, hair: 0x2a1a10, mustache: true, seed: 3 });
  G2 = C(K.scene, { shirt: 0xe0a030, hair: 0x8a2a1a, seed: 4 });
  G3 = C(K.scene, { shirt: 0x6a3a9a, tie: 0xf2ead8, hat: 'bowler', hatColor: 0x1a1a1a, seed: 5 });
  DR = C(K.scene, { shirt: 0xf2f2f2, buttons: 0x2a6aa8, hair: 0x3a2a1a, glasses: true, seed: 6 });
  SA = C(K.scene, { shirt: 0x24366e, hat: 'cap', hatColor: 0xf2f2f2, belt: 0xe0c070, seed: 7 });
  R1 = C(K.scene, { shirt: 0x7a5a3a, hair: 0x2a1a10, mustache: true, seed: 8 });
  R2 = C(K.scene, { shirt: 0x3a5a3a, tie: 0x8a2a1a, hair: 0x8a8a8a, mustache: true, seed: 9 });
  myGlass = martini(1); for (let i = 0; i < 3; i++) trayGlasses.push(martini(1));
  bigGlass = martini(9); bigGlass.position.set(...add(PARTY, [40, 0, 0]));
  for (let i = 0; i < 8; i++) stars.push(K.sph(0.07, 0xfff0a0, [0, -99, 0], { emissive: 0xffe060, emissiveIntensity: 6 }));

  // ---------------- PARTY: art-deco lounge, teal + gold, warm lamps ----------------
  const fl = K.tex(256, 256, (g) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? '#1e5a5a' : '#e8dcc0'; g.fillRect(x * 32, y * 32, 32, 32); } }, [8, 8]);
  K.plane(30, 30, K.std(0xffffff, { map: fl }), add(PARTY, [0, 0.01, 0]));
  const wl = K.tex(512, 256, (g, w, h) => { g.fillStyle = '#0f4a52'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e0b040'; g.lineWidth = 5; for (let x = 0; x < w; x += 64) { g.beginPath(); g.moveTo(x + 32, h); g.lineTo(x + 32, 60); g.moveTo(x + 12, h); g.lineTo(x + 32, 90); g.lineTo(x + 52, h); g.stroke(); } g.fillStyle = '#e0b040'; g.fillRect(0, 40, w, 10); }, [4, 1]);
  const wm = K.std(0xffffff, { map: wl }); K.plane(30, 9, wm, add(PARTY, [0, 4.5, -6]), [0, 0, 0]); K.plane(14, 9, wm, add(PARTY, [-9, 4.5, 1]), [0, Math.PI / 2, 0]); K.plane(14, 9, wm, add(PARTY, [9, 4.5, 1]), [0, -Math.PI / 2, 0]);
  K.box(7, 1.2, 0.9, 0x6a2a1a, add(PARTY, [-4.5, 0.6, -4.8])); K.box(7.2, 0.1, 1.1, 0xe0b040, add(PARTY, [-4.5, 1.25, -4.8]));
  for (let i = 0; i < 9; i++) K.cyl(0.08, 0.1, 0.45 + (i % 3) * 0.1, [0x2a6a2a, 0x8a2a1a, 0xe0c070, 0x5a3a8a][i % 4], add(PARTY, [-7.4 + i * 0.7, 1.55 + (i % 3) * 0.05, -5.6]), { emissive: 0x201008, emissiveIntensity: 0.3 });
  K.box(7, 0.08, 0.5, 0x4a2a14, add(PARTY, [-4.5, 1.3, -5.65]));
  await K.placeH('house_interior_pack/Light_Chandelier', add(PARTY, [-6.5, 3.6, -2]), 0, 1.4).catch(() => {});
  for (const x of [-7.8, 7.8]) await K.placeH('house_interior_pack/Houseplant_3', add(PARTY, [x, 0, -4.6]), 0, 1.8).catch(() => {});
  await K.placeH('house_interior_pack/Couch_Large1', add(PARTY, [5, 0, -4.6]), 0, 1.1, { tint: 0xc04040 }).catch(() => {});
  // gramophone
  const gram = new K.THREE.Group(); K.box(0.7, 0.4, 0.6, 0x6a3a1a, [0, 1.25, 0], { parent: gram }); const horn = K.cyl(0.42, 0.03, 0.8, 0xe0b040, [0.1, 1.9, 0], { parent: gram }); horn.rotation.z = -0.9; K.box(0.9, 1.05, 0.8, 0x3a1a0a, [0, 0.52, 0], { parent: gram }); gram.position.set(...add(PARTY, [2.6, 0, -4.8])); K.scene.add(gram);
  for (let i = 0; i < 5; i++) { const n = K.tex(64, 64, (g) => { g.fillStyle = '#ffe9a8'; g.font = '900 52px Poppins, sans-serif'; g.fillText('♪', 12, 50); }); const m = new K.THREE.Mesh(new K.THREE.PlaneGeometry(0.45, 0.45), new K.THREE.MeshBasicMaterial({ map: n, transparent: true })); m.position.set(0, -99, 0); K.scene.add(m); notes.push(m); }
  // side table with tray for macro shot
  K.cyl(0.6, 0.6, 0.06, 0xe0b040, add(PARTY, [-2.4, 1.0, -2.6])); K.cyl(0.06, 0.08, 1.0, 0x3a1a0a, add(PARTY, [-2.4, 0.5, -2.6]));
  K.pointLight(0xffc070, 12, add(PARTY, [0, 3.2, 1]), 14); K.pointLight(0xff9a50, 6, add(PARTY, [-4.5, 2.4, -3.8]), 7);
  SG.pal = K.sign('1 PALILLO', add(PARTY, [0.6, 3.6, -5.7]), { w: 3.6, h: 1.05, bg: '#b8301e' });
  SG.desp = K.sign('DESPEDIDA', add(PARTY, [0, 4.2, -5.8]), { w: 4.2, h: 1.0, bg: '#1e5a8a', border: '#e0b040' });
  // macro table (line 10/12) far from the room
  K.cyl(5, 5, 0.4, 0xe0b040, add(PARTY, [40, -0.2, 0])); K.plane(40, 20, wm, add(PARTY, [40, 8, -6]), [0, 0, 0]);

  // ---------------- OFFICE: paint factory office + writer corner (ochre, wood) ----------------
  const ofl = K.tex(256, 256, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#8a5a34' : '#9a6a40'; g.fillRect(0, i * 32, 256, 31); } }, [6, 6]);
  K.plane(24, 20, K.std(0xffffff, { map: ofl }), add(OFFICE, [0, 0.01, 0]));
  const owl = K.tex(512, 256, (g, w, h) => { g.fillStyle = '#d8a048'; g.fillRect(0, 0, w, h); g.fillStyle = '#c08a38'; for (let x = 0; x < w; x += 48) g.fillRect(x, 0, 18, h); g.fillStyle = '#6a3a1a'; g.fillRect(0, h - 40, w, 40); }, [3, 1]);
  const owm = K.std(0xffffff, { map: owl }); K.plane(24, 8, owm, add(OFFICE, [0, 4, -6]), [0, 0, 0]); K.plane(16, 8, owm, add(OFFICE, [-9, 4, 2]), [0, Math.PI / 2, 0]); K.plane(16, 8, owm, add(OFFICE, [9, 4, 2]), [0, -Math.PI / 2, 0]);
  // desk + typewriter + letter (left part)
  K.box(2.4, 0.1, 1.2, 0x6a3a1a, add(OFFICE, [-3, 1.1, -3.6])); for (const [x, z] of [[-1.1, -0.5], [1.1, -0.5], [-1.1, 0.5], [1.1, 0.5]]) K.box(0.1, 1.1, 0.1, 0x4a2a10, add(OFFICE, [-3 + x, 0.55, -3.6 + z]));
  const tw = new K.THREE.Group(); K.box(0.7, 0.22, 0.5, 0x1a1a1a, [0, 0.11, 0], { parent: tw }); K.box(0.62, 0.1, 0.25, 0x2a2a2a, [0, 0.27, -0.1], { parent: tw }); K.cyl(0.05, 0.05, 0.8, 0x1a1a1a, [0, 0.35, -0.18], { parent: tw }).rotation.z = Math.PI / 2; K.box(0.45, 0.4, 0.01, 0xf8f4e8, [0, 0.55, -0.2], { parent: tw }); for (let i = 0; i < 12; i++) K.cyl(0.025, 0.025, 0.02, 0xe8e0d0, [-0.25 + (i % 6) * 0.1, 0.24, 0.1 + Math.floor(i / 6) * 0.08], { parent: tw });
  tw.position.set(...add(OFFICE, [-3.4, 1.15, -3.6])); K.scene.add(tw);
  const lt = K.tex(256, 340, (g, w, h) => { g.fillStyle = '#fbf6e6'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2a3a6a'; g.lineWidth = 5; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(24, 40 + i * 30); for (let x = 24; x < (i === 4 ? 120 : 230); x += 12) g.lineTo(x, 40 + i * 30 + Math.sin(x * 0.4 + i) * 5); g.stroke(); } });
  letter = K.plane(0.55, 0.72, K.std(0xffffff, { map: lt }), add(OFFICE, [-2.4, 1.16, -3.4]), [-Math.PI / 2, 0, 0.2]);
  for (let i = 0; i < 6; i++) { const p = K.plane(0.42, 0.55, K.std(0xfbf6e6, { side: K.THREE.DoubleSide }), [0, -99, 0], [0, 0, 0]); paperFly.push(p); }
  door = await K.placeH('house_interior_pack/Door_1', add(OFFICE, [1.2, 0, -5.9]), 0, 3.0).catch(() => null);
  await K.placeH('house_interior_pack/Bookshelf', add(OFFICE, [-6.4, 0, -5.5]), 0, 3.6).catch(() => {});
  await K.placeH('house_interior_pack/Light_Desk', add(OFFICE, [-2.2, 1.15, -4.0]), 0, 0.6).catch(() => {});
  // paint cans stacked (right part)
  const pc = [0xd8302a, 0x2a6ad8, 0xe8c030, 0x3aa84a, 0xe8782a, 0x8a3ac8];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6 - r; i++) { const x = 4 + i * 0.75 + r * 0.37, y = r * 0.72; K.cyl(0.32, 0.32, 0.7, 0xb8bcc4, add(OFFICE, [x, y + 0.35, -4.8]), { metalness: 0.0 }); K.cyl(0.33, 0.33, 0.3, pc[(i + r) % 6], add(OFFICE, [x, y + 0.4, -4.8])); K.cyl(0.3, 0.3, 0.02, pc[(i + r * 2) % 6], add(OFFICE, [x, y + 0.71, -4.8])); }
  for (let i = 0; i < 4; i++) K.cyl(0.32, 0.32, 0.7, 0xb8bcc4, add(OFFICE, [6.5 - i * 0.8, 0.35, -2.8 + (i % 2) * 0.4]));
  SG.pint = K.sign('PINTURA', add(OFFICE, [5.6, 3.6, -5.85]), { w: 3.2, h: 0.95, bg: '#d8302a' });
  SG.esc = K.sign('ESCRITOR', add(OFFICE, [-3.6, 3.7, -5.85]), { w: 3.2, h: 0.95, bg: '#2a1a10' });
  SG.usa = K.sign('EE. UU.', add(OFFICE, [-0.6, 3.8, -5.85]), { w: 2.4, h: 0.9, bg: '#1e3a8a', border: '#d8302a' });
  // books: his book with readers
  const cov = K.tex(256, 340, (g, w, h) => { g.fillStyle = '#2a5a3a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e0b040'; g.lineWidth = 8; g.strokeRect(14, 14, w - 28, h - 28); g.fillStyle = '#ffe9a8'; g.textAlign = 'center'; g.font = '900 40px Poppins, sans-serif'; g.fillText('EL', w / 2, 110); g.fillText('PUEBLO', w / 2, 160); g.fillStyle = '#e0b040'; for (let i = 0; i < 4; i++) g.fillRect(50 + i * 42, 230 - i * 6, 30, 50 + i * 6); });
  const mkBook = () => { const b = new K.THREE.Group(); K.box(0.36, 0.48, 0.08, 0x2a5a3a, [0, 0, 0], { parent: b }); const fc = new K.THREE.Mesh(new K.THREE.PlaneGeometry(0.34, 0.46), new K.THREE.MeshBasicMaterial({ map: cov })); fc.position.z = 0.045; b.add(fc); K.scene.add(b); return b; };
  bookA = mkBook(); bookB = mkBook();
  SG.hem = K.sign('HEMINGWAY', add(OFFICE, [-1.2, 3.45, -1.9]), { w: 2.0, h: 0.6, bg: '#8a2a1a', rotY: 0 });
  SG.fau = K.sign('FAULKNER', add(OFFICE, [1.2, 3.45, -1.9]), { w: 2.0, h: 0.6, bg: '#1e5a8a', rotY: 0 });
  K.pointLight(0xffc080, 9, add(OFFICE, [-2, 3.4, -2]), 12); K.pointLight(0xffd8a0, 7, add(OFFICE, [4, 3.4, -2]), 10);

  // ---------------- SHIP: liner deck at dusk, sea ----------------
  water(SHIP, 400, { base: '#1e5a8a' });
  const deck = K.tex(256, 256, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#c89a62' : '#d8aa72'; g.fillRect(i * 32, 0, 31, 256); } }, [6, 2]);
  K.box(26, 0.3, 8, 0xffffff, add(SHIP, [0, -0.15, 0]), { map: deck });
  K.box(26, 4.5, 0.3, 0xc8d4e0, add(SHIP, [0, 2.1, -4])); for (let i = 0; i < 10; i++) K.cyl(0.32, 0.32, 0.08, 0x2a3a5a, add(SHIP, [-11 + i * 2.4, 2.6, -3.84]), { emissive: 0xffb860, emissiveIntensity: 0.9 }).rotation.x = Math.PI / 2;
  K.box(26, 0.3, 0.3, 0xd8302a, add(SHIP, [0, 4.4, -3.85]));
  for (let x = -12; x <= 12; x += 1.2) K.cyl(0.035, 0.035, 1.1, 0xf2f2f2, add(SHIP, [x, 0.55, 3.9])); K.cyl(0.06, 0.06, 26, 0xf2f2f2, add(SHIP, [0, 1.1, 3.9])).rotation.z = Math.PI / 2;
  const ring = new K.THREE.Mesh(new K.THREE.TorusGeometry(0.4, 0.11, 10, 24), K.std(0xff6a2a)); ring.position.set(...add(SHIP, [-3, 2.0, -3.75])); K.scene.add(ring);
  for (let i = 0; i < 2; i++) { K.cyl(1.0, 1.1, 4, 0xd8302a, add(SHIP, [-5 + i * 6, 6.6, -6])); K.cyl(1.02, 1.02, 0.8, 0x1a1a1a, add(SHIP, [-5 + i * 6, 8.3, -6])); }
  K.box(26, 4, 4, 0xf2f2f2, add(SHIP, [0, 6.4, -6.2]));
  SG.sud = K.sign('SUDAMÉRICA →', add(SHIP, [1.6, 3.3, -3.75]), { w: 3.0, h: 0.95, bg: '#2a8a5a' });
  SG.a64 = K.sign('64 AÑOS', add(SHIP, [-1.6, 3.3, -3.75]), { w: 2.2, h: 0.95, bg: '#2a1a10' });
  SG.q = K.sign('?', add(SHIP, [-6.5, 3.3, -3.75]), { w: 1.6, h: 1.1, bg: '#e0b040', fg: '#2a1a10', border: '#2a1a10' });
  suitcase = K.box(0.6, 0.45, 0.2, 0x8a4a2a, [0, -99, 0]);
  K.pointLight(0xffb860, 6, add(SHIP, [0, 3, 1]), 10);

  // ---------------- PANAMÁ port: palms, small boat ----------------
  water(PAN, 400, { base: '#1e8a8a' });
  K.box(30, 0.6, 12, 0xd8c08a, add(PAN, [0, 0.0, -9]));
  for (let i = 0; i < 9; i++) await K.placeH(`nature_pack/PalmTree_${(i % 4) + 1}`, add(PAN, [-12 + i * 3, 0.3, -6 - (i % 3) * 2]), i, 6 + (i % 2)).catch(() => {});
  const cols = [0xe8a0a0, 0xf2e2a0, 0xa0d0e8, 0xc8e8a0, 0xe8c080];
  for (let i = 0; i < 6; i++) { K.box(3, 3 + (i % 2), 3, cols[i % 5], add(PAN, [-10 + i * 4, 1.8, -12])); K.box(3.2, 0.3, 3.2, 0xc8503a, add(PAN, [-10 + i * 4, 3.4 + (i % 2), -12])); }
  K.box(10, 0.25, 3, 0x8a6440, add(PAN, [3, 0.5, -3.6]));
  boat = await K.placeH('ships_pack/Lifeboat', add(PAN, [-1, -0.5, 0]), Math.PI / 2, 1.2, { byW: false }).catch(() => null);
  SG.pan = K.sign('PANAMÁ', add(PAN, [-1.6, 3.4, -4.4]), { w: 3.2, h: 1.0, bg: '#2a8a5a', posts: true });
  // ---------------- HOSPITAL (white/green) ----------------
  const hfl = K.tex(256, 256, (g) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? '#d8e8d8' : '#f2f2ea'; g.fillRect(x * 32, y * 32, 32, 32); } }, [6, 6]);
  K.plane(20, 16, K.std(0xffffff, { map: hfl }), add(HOSP, [0, 0.01, 0]));
  const hw = K.std(0x9ad0b0); K.plane(20, 8, hw, add(HOSP, [0, 4, -5]), [0, 0, 0]); K.plane(14, 8, hw, add(HOSP, [-7, 4, 1]), [0, Math.PI / 2, 0]); K.plane(14, 8, hw, add(HOSP, [7, 4, 1]), [0, -Math.PI / 2, 0]);
  K.box(20, 0.6, 0.05, 0xf2f2ea, add(HOSP, [0, 1.2, -4.95]));
  await K.placeH('house_interior_pack/Bed_Single', add(HOSP, [-2.2, 0, -3.2]), 0, 1.0, { tint: 0xf2f2f2 }).catch(() => {});
  await K.placeH('house_interior_pack/Window_Large1', add(HOSP, [-2.2, 2.2, -4.95]), 0, 2.0).catch(() => {});
  hatBed = new K.THREE.Group(); K.cyl(0.24, 0.28, 0.22, 0x5a4a3a, [0, 0.11, 0], { parent: hatBed }); K.cyl(0.42, 0.42, 0.04, 0x5a4a3a, [0, 0.02, 0], { parent: hatBed }); K.cyl(0.285, 0.285, 0.06, 0x1a1a1a, [0, 0.07, 0], { parent: hatBed }); K.scene.add(hatBed);
  // x-ray board: dark panel with a white body outline and a toothpick drawn in the belly (cartoon)
  const xt = K.tex(512, 640, (g, w, h) => { g.fillStyle = '#0a1420'; g.fillRect(0, 0, w, h); g.strokeStyle = '#cfe8ff'; g.lineWidth = 10; g.beginPath(); g.arc(256, 120, 70, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.moveTo(170, 230); g.quadraticCurveTo(256, 200, 342, 230); g.lineTo(360, 560); g.lineTo(152, 560); g.closePath(); g.stroke(); for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(200, 270 + i * 28); g.quadraticCurveTo(256, 255 + i * 28, 312, 270 + i * 28); g.stroke(); } g.strokeStyle = '#ffd84a'; g.lineWidth = 16; g.beginPath(); g.moveTo(215, 470); g.lineTo(300, 415); g.stroke(); g.strokeStyle = '#ff4a3a'; g.lineWidth = 8; g.beginPath(); g.arc(258, 442, 62, 0, Math.PI * 2); g.stroke(); });
  xray = new K.THREE.Group(); K.box(1.9, 2.4, 0.08, 0x2a2a2a, [0, 0, 0], { parent: xray }); const xm = new K.THREE.Mesh(new K.THREE.PlaneGeometry(1.75, 2.2), new K.THREE.MeshBasicMaterial({ map: xt })); xm.position.z = 0.05; xray.add(xm); xray.position.set(...add(HOSP, [2.2, 2.3, -4.7])); K.scene.add(xray);
  K.pointLight(0xcfe8ff, 6, add(HOSP, [2.2, 2.3, -3.6]), 4);
  SG.pal2 = K.sign('PALILLO', add(HOSP, [2.2, 4.0, -4.7]), { w: 2.6, h: 0.8, bg: '#b8301e' });
  SG.y41 = K.sign('1941', add(HOSP, [-2.2, 1.05, -2.1]), { w: 1.4, h: 0.6, bg: '#2a1a10' });
  K.pointLight(0xfff0d8, 8, add(HOSP, [0, 3.6, 0]), 12);
  // ---------------- TOMB on a green hill ----------------
  K.plane(80, 80, K.std(0x5a9a3a), add(TOMB, [0, 0.01, 0]));
  for (let i = 0; i < 10; i++) await K.placeH(`nature_pack/CommonTree_${(i % 5) + 1}`, add(TOMB, [(i % 2 ? 1 : -1) * (5 + (i % 4) * 2.5), 0, -6 - (i % 3) * 3]), i, 6, { tint: 0xa0c080 }).catch(() => {});
  for (let i = 0; i < 6; i++) await K.placeH(`nature_pack/Grass`, add(TOMB, [-2.5 + i, 0, 0.6 + (i % 2) * 0.4]), i, 0.5).catch(() => {});
  const tt = textTex(['LA VIDA,', 'NO LA MUERTE,', 'ES LA GRAN', 'AVENTURA'], { bg: '#a8acb4', fs: 62, y0: 190, lh: 105 });
  const tomb = new K.THREE.Group(); K.box(2.2, 2.8, 0.5, 0xa8acb4, [0, 1.4, 0], { parent: tomb }); const tf = new K.THREE.Mesh(new K.THREE.PlaneGeometry(2.0, 2.5), new K.THREE.MeshBasicMaterial({ map: tt })); tf.position.set(0, 1.4, 0.26); tomb.add(tf); K.box(2.6, 0.3, 0.9, 0x8a8e96, [0, 0.15, 0], { parent: tomb }); tomb.position.set(...add(TOMB, [0, 0, -1])); K.scene.add(tomb);
  for (let i = 0; i < 5; i++) K.sph(0.12, [0xe8304a, 0xf2e040, 0xf2f2f2][i % 3], add(TOMB, [-0.6 + i * 0.3, 0.35, -0.45]));
}

function hideAll() {
  for (const c of [AN, WF, G1, G2, G3, DR, SA, R1, R2]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.hold(null); }
  for (const g of Object.values(SG)) g.visible = false;
  myGlass.scale.setScalar(1.25); for (const g of [myGlass, ...trayGlasses]) { if (g.parent !== K.scene) { if (g.parent) g.parent.remove(g); K.scene.add(g); } g.position.set(0, -99, 0); g.rotation.set(0, 0, 0); g.visible = true; g.userData.pick.visible = true; }
  bigGlass.userData.pick.visible = true; bigGlass.userData.pick.position.set(0.03, 0.33, 0); bigGlass.userData.pick.rotation.set(0, 0, 0.45);
  for (const b of [bookA, bookB, suitcase]) { if (b.parent !== K.scene) { if (b.parent) b.parent.remove(b); K.scene.add(b); } b.position.set(0, -99, 0); b.rotation.set(0, 0, 0); }
  for (const p of paperFly) p.position.set(0, -99, 0); for (const n of notes) n.position.set(0, -99, 0); for (const s of stars) s.position.y = -99;
  hatBed.position.set(0, -99, 0); if (door) door.rotation.y = 0;
}
function tick(f) { const t = f / 30; for (const tx of waters) tx.offset.set(Math.sin(t * 0.4) * 0.05, t * 0.04); return t; }
// hook pose: Anderson raises his martini, giant olive-on-toothpick right at his face, guests cheering behind
function hookPose(f, t, o = {}) {
  const a = add(PARTY, [0, 0, 0]);
  P(AN, { pos: a, yaw: 0.15, expr: o.expr || 'shock', look: [-0.15, 0.1], talk: o.talk || 0, armsOverride: TOAST }, f); myGlass.scale.setScalar(1.6); holdW(AN, myGlass, [0, -0.12, 0.05]);
  P(G1, { pos: add(a, [-1.5, 0, -1.6]), yaw: 0.4, expr: 'laugh', arms: 'up' }, f); P(G2, { pos: add(a, [1.6, 0, -1.5]), yaw: -0.4, expr: 'happy', arms: 'wave', bounce: 0.5 }, f);
  SG.pal.visible = true;
}
function party(f, t) { notes.forEach((n, i) => { const k = (t * 0.5 + i / 5) % 1; n.position.set(...add(PARTY, [2.8 + Math.sin(k * 6 + i) * 0.5, 2.3 + k * 2.2, -4.4])); n.rotation.z = Math.sin(t * 3 + i) * 0.3; }); }

export function frame(f, k) {
  hideAll(); const ph = K.at(f), t = tick(f), u = (i, j) => K.u(f, i, j);
  K.preset('interior', { exposure: 1.15 }); party(f, t);
  const A0 = PARTY;
  switch (ph) {
    case 0: { // HOOK: famous writer toasting, giant olive on a toothpick, 1 PALILLO sign
      hookPose(f, t);
      K.move(K.frame([A0, add(A0, [-1.5, 0, -1.6]), add(A0, [1.6, 0, -1.5])], { yaw: 0.12, pitch: -0.04, h: 3.3, lookY: 2.3, push: 0.9 }), K.frame([A0], { yaw: 0.05, pitch: -0.03, h: 3.0, lookY: 2.2, push: 0.75 }), u(0), 0.8, f); K.focusOn(add(A0, [0, 2.1, 0])); break; }
    case 1: { // how it happened looks like a joke: guests laughing, he shrugs, glass on tray
      P(AN, { pos: A0, yaw: 0.2, expr: 'worried', arms: 'shrug' }, f);
      P(G1, { pos: add(A0, [-1.3, 0, -0.6]), yaw: 0.7, expr: 'laugh', arms: 'point', bounce: 0.6 }, f); P(G3, { pos: add(A0, [1.3, 0, -0.7]), yaw: -0.7, expr: 'laugh', arms: 'cross', bounce: 0.6 }, f);
      K.move(K.frame([A0, add(A0, [-1.3, 0, -0.6]), add(A0, [1.3, 0, -0.7])], { yaw: -0.15, h: 3.2, lookY: 2.2, push: 0.95, pitch: -0.03 }), K.frame([A0, add(A0, [-1.3, 0, -0.6]), add(A0, [1.3, 0, -0.7])], { yaw: -0.05, h: 3.2, lookY: 2.2, push: 0.86 }), u(1), 0.6, f); K.focusOn(add(A0, [0, 2, 0])); break; }
    case 2: { // one of the most beloved writers in the US: proud with his book, EE.UU. + ESCRITOR signs
      K.preset('interior', { exposure: 1.2 }); const p = add(OFFICE, [-1.8, 0, -3.0]); SG.usa.visible = SG.esc.visible = true;
      P(AN, { pos: p, yaw: 0.1, expr: 'proud', arms: 'hold' }, f); holdW(AN, bookA, [0, 0.0, 0.12]);
      K.move(K.frame([p], { yaw: 0.12, h: 4.6, lookY: 2.9, pitch: -0.05, push: 1.15, lx: -0.4 }), K.frame([p], { yaw: 0.05, h: 4.4, lookY: 2.9, pitch: -0.06, push: 1.05, lx: -0.4 }), u(2), 0.5, f); K.focusOn(add(p, [0, 2.2, 0])); break; }
    case 3: { // his small-town book marked Hemingway and Faulkner: two readers amazed with the book
      K.preset('interior', { exposure: 1.2 }); const a = add(OFFICE, [-1.2, 0, -1.6]), b = add(OFFICE, [1.2, 0, -1.6]); SG.hem.visible = SG.fau.visible = true;
      P(R1, { pos: a, yaw: 0.25, expr: 'shock', arms: 'hold' }, f); holdW(R1, bookA, [0, 0.0, 0.12]);
      P(R2, { pos: b, yaw: -0.25, expr: 'shock', arms: 'hold', look: [0, -0.2] }, f); holdW(R2, bookB, [0, 0.0, 0.12]);
      K.move(K.frame([a, b], { yaw: 0.0, h: 4.2, lookY: 2.6, pitch: -0.04, push: 1.1 }), K.frame([a, b], { yaw: 0.08, h: 4.2, lookY: 2.6, pitch: -0.06, push: 1.0 }), u(3), 0.6, f); K.focusOn(add(OFFICE, [0, 2.2, -1.6])); break; }
    case 4: { // before writing he owned a paint factory: him in front of the can pyramid, PINTURA
      K.preset('interior', { exposure: 1.2 }); const p = add(OFFICE, [4.8, 0, -2.6]); SG.pint.visible = true;
      P(AN, { pos: p, yaw: -0.15, expr: 'neutral', arms: 'akimbo', look: [0.2, 0] }, f);
      K.move(K.frame([p], { yaw: -0.35, h: 4.6, lookY: 2.6, pitch: -0.05, push: 0.9 }), K.frame([p], { yaw: -0.2, h: 4.2, lookY: 2.6, pitch: -0.07, push: 0.8 }), u(4), 0.5, f); K.focusOn(add(p, [0, 2.2, 0])); break; }
    case 5: { // left a letter half-written, got up and walked out the door
      K.preset('interior', { exposure: 1.2 }); const v = u(5);
      if (v < 0.4) { // macro: the half letter on the desk, pen still on it
        K.move({ p: add(OFFICE, [-2.2, 2.2, -2.5]), l: add(OFFICE, [-2.4, 1.16, -3.4]), fov: 44 }, { p: add(OFFICE, [-2.3, 2.0, -2.75]), l: add(OFFICE, [-2.4, 1.16, -3.4]), fov: 42 }, v / 0.4, 0.3, f); K.focusOn(add(OFFICE, [-2.4, 1.16, -3.4]));
      } else { const w = (v - 0.4) / 0.6; const s = add(OFFICE, [-1.6, 0, -2.6]), e = add(OFFICE, [1.2, 0, -5.4]); const pos = K.lerp(s, e, K.ease(w)); if (door) door.rotation.y = -1.2 * Math.min(1, w * 2);
        P(AN, { pos, yaw: Math.atan2(e[0] - s[0], e[2] - s[2]), walk: t * 1.6, expr: 'happy', arms: 'down' }, f);
        K.move(K.frame([pos], { yaw: 0.5, h: 3.4, lookY: 2.1, pitch: -0.03, push: 0.9 }), K.frame([pos], { yaw: 0.35, h: 3.4, lookY: 2.1, pitch: -0.03, push: 0.85 }), w, 0.5, f); K.focusOn(add(pos, [0, 2, 0])); }
      break; }
    case 6: { // that's how his writing career began: typing furiously, pages flying
      K.preset('interior', { exposure: 1.15 }); const p = add(OFFICE, [-3.4, -0.35, -2.75]); SG.esc.visible = true;
      P(AN, { pos: p, yaw: Math.PI, sit: 1, expr: 'happy', arms: 'reach', bounce: 0.4 }, f);
      paperFly.forEach((pp, i) => { const k2 = (t * 0.7 + i / 6) % 1; pp.position.set(...add(OFFICE, [-3.4 + Math.sin(i * 2) * (0.3 + k2 * 1.2), 1.9 + k2 * 2.0, -3.7 + k2 * 0.8])); pp.rotation.set(k2 * 3 + i, i, k2 * 2); });
      K.move({ p: add(OFFICE, [-2.0, 2.35, -5.4]), l: add(OFFICE, [-3.4, 2.2, -2.8]), fov: 48 }, { p: add(OFFICE, [-2.5, 2.3, -5.2]), l: add(OFFICE, [-3.4, 2.2, -2.8]), fov: 46 }, u(6), 0.5, f); K.focusOn(add(OFFICE, [-3.4, 2.0, -3.2])); break; }
    case 7: { // at 64 he decided to fulfill a dream: South America — on the liner deck with his wife and a suitcase
      K.preset('day', { exposure: 0.92, sky: [0x3c6fc8, 0xf2b680, 0xffd29a] }); const a = add(SHIP, [0.6, 0, 0.6]), b = add(SHIP, [-0.7, 0, 0.8]); SG.sud.visible = SG.a64.visible = true;
      P(AN, { pos: a, yaw: -0.1, expr: 'happy', arms: 'point' }, f); P(WF, { pos: b, yaw: 0.2, expr: 'happy', arms: 'hold' }, f); WF.hold(suitcase, [0, -0.25, 0.05], [0, 0, 0]);
      K.move(K.frame([a, b], { yaw: -0.12, h: 4.8, lookY: 2.8, pitch: -0.05, push: 1.15 }), K.frame([a, b], { yaw: -0.02, h: 4.8, lookY: 2.8, pitch: -0.06, push: 1.05 }), u(7), 0.6, f); K.focusOn(add(SHIP, [0, 2.2, 0.7])); break; }
    case 8: { // before sailing, friends threw him a farewell party: DESPEDIDA banner, everyone toasting
      SG.desp.visible = true; const a = A0;
      P(AN, { pos: a, yaw: 0, expr: 'laugh', armsOverride: DRINK }, f); holdW(AN, myGlass, [0, -0.12, 0.05]);
      const gs = [G1, G2, G3]; gs.forEach((G, i) => { const p = add(A0, [-1.7 + i * 1.7, 0, -1.4 - (i % 2) * 0.4]); if (i === 1) p[0] += 0.0; P(G, { pos: i === 1 ? add(A0, [0, 0, -1.9]) : p, yaw: (1 - i) * 0.5, expr: 'happy', armsOverride: TOAST, bounce: 0.4 }, f); holdW(G, trayGlasses[i], [0, -0.12, 0.05]); });
      K.move(K.frame([a, add(A0, [-1.7, 0, -1.4]), add(A0, [1.7, 0, -1.4])], { yaw: 0.1, h: 4.2, lookY: 2.8, pitch: -0.06, push: 0.95 }), K.frame([a, add(A0, [-1.7, 0, -1.4]), add(A0, [1.7, 0, -1.4])], { yaw: -0.05, h: 4.2, lookY: 2.8, pitch: -0.08, push: 0.86 }), u(8), 0.6, f); K.focusOn(add(A0, [0, 2.2, -0.8])); break; }
    case 9: { // music, laughs... and martinis with olive: gramophone + dancing guests + tray
      const v = u(9);
      P(G2, { pos: add(A0, [1.4, 0, -3.2]), yaw: Math.sin(t * 3) * 0.6, expr: 'laugh', arms: 'up', bounce: 1 }, f); P(G3, { pos: add(A0, [0.2, 0, -3.0]), yaw: -Math.sin(t * 3) * 0.6, expr: 'happy', arms: 'wave', bounce: 1 }, f);
      P(AN, { pos: add(A0, [-1.0, 0, -2.6]), yaw: 0.5, expr: 'laugh', armsOverride: DRINK }, f); holdW(AN, myGlass, [0, -0.12, 0.05]);
      K.move({ p: add(A0, [3.4, 2.4, 2.4]), l: add(A0, [1.0, 2.0, -3.6]), fov: 46 }, { p: add(A0, [2.8, 2.5, 2.0]), l: add(A0, [0.6, 2.0, -3.6]), fov: 46 }, v, 0.6, f); K.focusOn(add(A0, [0.8, 2, -3.2])); break; }
    case 10: { // each olive was skewered on a wooden toothpick: MACRO of the giant glass
      const v = u(10); const g0 = add(A0, [40, 0, 0]); bigGlass.userData.pick.rotation.z = 0.45 + Math.sin(t * 2) * 0.03;
      K.move({ p: add(g0, [2.4, 3.6, 4.2]), l: add(g0, [0.2, 3.0, 0]), fov: 44 }, { p: add(g0, [1.4, 3.3, 3.0]), l: add(g0, [0.3, 3.05, 0]), fov: 42 }, v, 0.4, f); K.focusOn(add(g0, [0.3, 3.0, 0])); break; }
    case 11: { // AND HERE IT ALL WENT WRONG: dark punch-in on the glass at his mouth
      K.preset('interior', { exposure: 0.9 }); K.grade.vig.value = 0.7; const v = u(11); if (v < 0.08) K.grade.flash.value = 0.4;
      P(AN, { pos: A0, yaw: 0.0, expr: 'happy', armsOverride: DRINK, look: [0, -0.2] }, f); holdW(AN, myGlass, [0, -0.12, 0.05]);
      K.move(K.frame([A0], { yaw: 0.35, h: 2.4, lookY: 2.1, pitch: 0.0, push: 0.78 }), K.frame([A0], { yaw: 0.3, h: 2.2, lookY: 2.1, pitch: 0.0, push: 0.62 }), K.ease(v), 0.3, f); K.focusOn(add(A0, [0, 2.0, 0])); break; }
    case 12: { // he swallowed the toothpick whole and didn't notice: gulp, pick vanishes, then empty glass + happy face
      const v = u(12); const gone = v > 0.35;
      P(AN, { pos: A0, yaw: 0.1, expr: v < 0.35 ? 'neutral' : 'happy', arms: 'drink', talk: v > 0.2 && v < 0.35 ? 1 : 0, look: [0, 0.2] }, f); AN.hold(myGlass, [0, 0.02, 0.06], [gone ? 0.0 : 0.0, 0, 0]); myGlass.userData.pick.visible = !gone;
      if (v > 0.3 && v < 0.38) K.grade.flash.value = 0.3;
      if (v > 0.38) stars.slice(0, 3).forEach((s, i) => { s.position.set(...add(A0, [0.6 + i * 0.25, 2.9 + Math.sin(t * 6 + i) * 0.1, 0.3])); });
      K.move(K.frame([A0], { yaw: -0.25, h: 2.6, lookY: 2.1, pitch: 0.02, push: 0.7 }), K.frame([A0], { yaw: -0.15, h: 2.6, lookY: 2.1, pitch: 0.02, push: 0.66 }), v, 0.4, f); K.focusOn(add(A0, [0, 2.0, 0])); break; }
    case 13: { // on the ship, terrible stomach pain: night deck, clutching belly, sweating
      K.preset('night', { exposure: 1.25 }); const p = add(SHIP, [0, 0, 0.8]);
      P(AN, { pos: p, yaw: 0.2, expr: 'scared', sweat: true, tremble: 2, lean: 0.35, armsOverride: (C) => { C.armL.a.rotation.set(-0.7, 0, 0.5); C.armL.b.rotation.set(-1.6, 0, 0); C.armR.a.rotation.set(-0.7, 0, -0.5); C.armR.b.rotation.set(-1.6, 0, 0); } }, f);
      K.move(K.frame([p], { yaw: 0.45, h: 3.2, lookY: 2.0, pitch: -0.02, push: 0.85 }), K.frame([p], { yaw: 0.3, h: 3.0, lookY: 2.0, pitch: -0.03, push: 0.72 }), u(13), 0.9, f); K.focusOn(add(p, [0, 1.9, 0])); break; }
    case 14: { // nobody on board understood: ship doctor and sailor shrug, ¿? sign
      K.preset('night', { exposure: 1.25 }); const a = add(SHIP, [-6.2, 0, 0.4]), b = add(SHIP, [-4.8, 0, 0.6]), c = add(SHIP, [-7.6, 0, 0.8]); SG.q.visible = true;
      P(DR, { pos: a, yaw: 0.1, expr: 'worried', arms: 'shrug' }, f); P(SA, { pos: b, yaw: -0.3, expr: 'worried', arms: 'think' }, f); P(AN, { pos: c, yaw: 0.4, expr: 'scared', sweat: true, lean: 0.35, tremble: 2, arms: 'cross' }, f);
      K.move(K.frame([a, b, c], { yaw: 0.05, h: 3.6, lookY: 2.4, pitch: -0.04, push: 0.82 }), K.frame([a, b, c], { yaw: -0.08, h: 3.6, lookY: 2.4, pitch: -0.05, push: 0.76 }), u(14), 0.6, f); K.focusOn(add(SHIP, [-6.2, 2.0, 0.5])); break; }
    case 15: { // rushed ashore in Panama: small boat to the palm dock, sailor rowing, PANAMÁ sign
      K.preset('day', { exposure: 1.05 }); const v = u(15); SG.pan.visible = true; const bx = -4 + v * 3;
      if (boat) { boat.position.set(...add(PAN, [bx, -0.55 + Math.sin(t * 2) * 0.05, 0])); boat.rotation.z = Math.sin(t * 1.6) * 0.03; }
      P(SA, { pos: add(PAN, [bx - 0.9, -0.55, 0]), yaw: Math.PI / 2, sit: 1, expr: 'worried', arms: 'reach', lean: Math.sin(t * 5) * 0.2 }, f);
      P(AN, { pos: add(PAN, [bx + 0.7, -0.35, 0]), yaw: -Math.PI / 2, fall: 1, expr: 'tired' }, f);
      K.move(K.frame([add(PAN, [bx, 0, 0])], { yaw: 0.3, h: 3.6, lookY: 1.4, pitch: 0.32, push: 1.25, pad: 1.4 }), K.frame([add(PAN, [bx, 0, 0])], { yaw: 0.2, h: 3.4, lookY: 1.4, pitch: 0.28, push: 1.15, pad: 1.4 }), v, 0.6, f); K.focusOn(add(PAN, [bx, 1.0, 0])); break; }
    case 16: { // there they found the cause: x-ray with a toothpick inside him, doctor points, shocked
      K.preset('interior', { exposure: 1.15 }); const a = add(HOSP, [0.6, 0, -2.6]); SG.pal2.visible = true;
      P(DR, { pos: a, yaw: -0.3, expr: 'shock', arms: 'point', talk: 0.6, look: [0.4, 0.1] }, f);
      K.move({ p: add(HOSP, [-0.4, 2.3, 2.4]), l: add(HOSP, [1.6, 2.4, -4.6]), fov: 46 }, { p: add(HOSP, [0.2, 2.4, 1.4]), l: add(HOSP, [1.8, 2.5, -4.6]), fov: 44 }, u(16), 0.4, f); K.focusOn(add(HOSP, [1.6, 2.3, -4.0])); break; }
    case 17: { // died in Panama, 1941, never reached South America: empty bed, his hat on the pillow, sad doctor
      K.preset('interior', { exposure: 1.0 }); K.grade.sat.value = 0.95; SG.y41.visible = true; hatBed.position.set(...add(HOSP, [-2.2, 0.95, -3.9]));
      P(DR, { pos: add(HOSP, [-0.6, 0, -2.4]), yaw: -0.6, expr: 'sad', arms: 'down', look: [0, -0.4] }, f);
      K.move({ p: add(HOSP, [0.8, 2.6, 2.0]), l: add(HOSP, [-1.8, 1.6, -3.4]), fov: 46 }, { p: add(HOSP, [0.3, 2.3, 1.0]), l: add(HOSP, [-2.0, 1.5, -3.6]), fov: 44 }, u(17), 0.3, f); K.focusOn(add(HOSP, [-2.2, 1.2, -3.8])); break; }
    case 18: { // his tombstone: LA VIDA, NO LA MUERTE, ES LA GRAN AVENTURA
      K.preset('golden', { exposure: 1.1 });
      K.move({ p: add(TOMB, [1.2, 1.3, 4.2]), l: add(TOMB, [0, 1.6, -1]), fov: 46 }, { p: add(TOMB, [0.4, 1.4, 3.0]), l: add(TOMB, [0, 1.5, -1]), fov: 44 }, u(18), 0.3, f); K.focusOn(add(TOMB, [0, 1.5, -1])); break; }
    default: { // nobody plans their end -> loop to the hook
      hookPose(f, t);
      K.move(K.frame([A0], { yaw: 0.05, pitch: -0.03, h: 3.0, lookY: 2.2, push: 0.75 }), K.frame([A0, add(A0, [-1.5, 0, -1.6]), add(A0, [1.6, 0, -1.5])], { yaw: 0.12, pitch: -0.04, h: 3.3, lookY: 2.3, push: 0.9 }), u(19), 0.6, f); K.focusOn(add(A0, [0, 2.1, 0]));
    }
  }
}
