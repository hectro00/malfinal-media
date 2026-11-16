// VID-019 — Adolfo Federico de Suecia (1771): after a huge Shrove Tuesday dinner ate 14 servings of semla in hot milk and died that night. No gore: death implied (candle out, crown on empty throne).
export let FRAMES = 2100;
let K, T, KG, C1, C2, SV, CK1, CK2, NB = [], GD = [], DR, KIDS = [], TCH, SG = {};
let spoon, flute, tray, trayBowl, bowls = [], semla, macroBowl, macroBun, lobster, plates3 = [], steam = [], bubbles = [], snow = [], quill, paper, knife, chick, boxHeld, lathe, candleBed, flameBed, smoke = [], crownProp, flames = [];
const HALL = [0, 0, 0], EXT = [200, 0, 0], PARL = [400, 0, 0], SHOP = [600, 0, 0], KIT = [800, 0, 0], BED = [1000, 0, 0], GAL = [1200, 0, 0], MAC = [60, 0, 0];
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
const _v = () => new K.THREE.Vector3();
function holdW(C, obj, off = [0, -0.05, 0.05]) { C.root.updateMatrixWorld(true); const v = _v(); C.armR.end.getWorldPosition(v); obj.position.set(v.x + off[0], v.y + off[1], v.z + off[2]); }
function holdL(C, obj, off = [0, -0.05, 0.05]) { C.root.updateMatrixWorld(true); const v = _v(); C.armL.end.getWorldPosition(v); obj.position.set(v.x + off[0], v.y + off[1], v.z + off[2]); }
const EAT = (C, t) => { const k = 0.5 + 0.5 * Math.sin(t * 5); C.armR.a.rotation.set(-1.0 - 0.35 * k, 0, -0.35); C.armR.b.rotation.set(-1.5 - 0.3 * k, 0, 0); C.armL.a.rotation.set(-0.7, 0, 0.25); C.armL.b.rotation.set(-0.6, 0, 0); };
const DRINK = (C) => { C.armR.a.rotation.set(-1.25, 0, -0.45); C.armR.b.rotation.set(-1.7, 0, 0); };
const TOAST = (C) => { C.armR.a.rotation.set(-2.1, 0, -0.35); C.armR.b.rotation.set(-0.7, 0, 0); };
const TRAY = (C) => { C.armR.a.rotation.set(-0.75, 0, -0.1); C.armR.b.rotation.set(-0.9, 0, 0); C.armL.a.rotation.set(-0.75, 0, 0.1); C.armL.b.rotation.set(-0.9, 0, 0); };
const PRAY = (C, t) => { C.armL.a.rotation.set(-1.3, 0, -0.3); C.armL.b.rotation.set(-1.2, 0, 0); C.armR.a.rotation.set(-1.3, 0, 0.3); C.armR.b.rotation.set(-1.2, 0, 0); };
const RUB = (C, t) => { const k = Math.sin(t * 14) * 0.12; C.armL.a.rotation.set(-0.8, 0, 0.45 + k); C.armL.b.rotation.set(-1.3, 0, -0.5); C.armR.a.rotation.set(-0.8, 0, -0.45 + k); C.armR.b.rotation.set(-1.3, 0, 0.5); };

// ---------- props ----------
function mkBowl(milk = true, bun = true) { const g = new K.THREE.Group();
  K.cyl(0.19, 0.12, 0.11, 0xf4f8ff, [0, 0.055, 0], { parent: g }); K.cyl(0.195, 0.195, 0.018, 0x2a5ab8, [0, 0.105, 0], { parent: g });
  if (milk) K.cyl(0.17, 0.17, 0.01, 0xfff4dc, [0, 0.1, 0], { parent: g });
  if (bun) { const b = mkSemla(0.7); b.position.set(0, 0.1, 0); g.add(b); }
  K.scene.add(g); g.position.set(0, -99, 0); return g; }
function mkSemla(s = 1) { const g = new K.THREE.Group();
  const base = K.sph(0.13, 0xd0894a, [0, 0.05, 0], { parent: g }); base.scale.set(1, 0.55, 1);
  const cream = K.sph(0.115, 0xfffaf0, [0, 0.11, 0], { parent: g }); cream.scale.set(1, 0.5, 1);
  const lid = K.sph(0.11, 0xd89a58, [0.015, 0.17, 0], { parent: g }); lid.scale.set(1, 0.42, 1); lid.rotation.z = 0.18;
  for (let i = 0; i < 7; i++) K.sph(0.012, 0xffffff, [Math.cos(i * 0.9) * 0.06, 0.205, Math.sin(i * 0.9) * 0.06], { parent: g });
  K.box(0.05, 0.02, 0.03, 0xe8c890, [0.07, 0.125, 0.06], { parent: g });
  g.scale.setScalar(s); return g; }
function mkCandle(h = 0.32) { const g = new K.THREE.Group(); K.cyl(0.035, 0.035, h, 0xfff6e6, [0, h / 2, 0], { parent: g }); const fl = K.sph(0.035, 0xffc860, [0, h + 0.05, 0], { parent: g, emissive: 0xffa030, emissiveIntensity: 5 }); fl.scale.set(0.8, 1.6, 0.8); flames.push(fl); g.userData.flame = fl; return g; }
function candelabra(pos) { const g = new K.THREE.Group(); K.cyl(0.03, 0.12, 0.5, 0xd8b040, [0, 0.25, 0], { parent: g, metalness: 0.6, roughness: 0.3 }); K.box(0.6, 0.04, 0.04, 0xd8b040, [0, 0.5, 0], { parent: g, metalness: 0.6 });
  for (const x of [-0.28, 0, 0.28]) { const c = mkCandle(0.25); c.position.set(x, 0.52, 0); g.add(c); }
  g.position.set(...pos); K.scene.add(g); return g; }
function mkLobster() { const g = new K.THREE.Group(); const R = 0xd8301e;
  const b = K.sph(0.09, R, [0, 0.06, 0], { parent: g }); b.scale.set(0.8, 0.6, 1.6);
  for (let i = 0; i < 4; i++) { const s = K.sph(0.07 - i * 0.008, R, [0, 0.05, 0.15 + i * 0.07], { parent: g }); s.scale.set(1, 0.5, 0.8); }
  const tail = K.sph(0.06, R, [0, 0.04, 0.44], { parent: g }); tail.scale.set(1.4, 0.3, 0.7);
  for (const s of [-1, 1]) { const a = K.cyl(0.015, 0.015, 0.18, R, [s * 0.1, 0.06, -0.14], { parent: g }); a.rotation.set(Math.PI / 2, 0, s * 0.6); const c = K.sph(0.06, R, [s * 0.17, 0.07, -0.25], { parent: g }); c.scale.set(0.8, 0.6, 1.4); const an = K.cyl(0.004, 0.004, 0.4, R, [s * 0.05, 0.12, -0.3], { parent: g }); an.rotation.set(Math.PI / 2 - 0.3, 0, s * 0.3); }
  for (const s of [-1, 1]) K.sph(0.015, 0x101010, [s * 0.04, 0.11, -0.1], { parent: g });
  return g; }
function plate(col = 0xf4f8ff) { const g = new K.THREE.Group(); K.cyl(0.26, 0.2, 0.025, col, [0, 0.012, 0], { parent: g }); K.cyl(0.27, 0.27, 0.008, 0x2a5ab8, [0, 0.026, 0], { parent: g }); return g; }
function mkFlute() { const g = new K.THREE.Group(); K.cyl(0.05, 0.05, 0.01, 0xe8f4ff, [0, 0.005, 0], { parent: g, transparent: true, opacity: 0.7 }); K.cyl(0.008, 0.008, 0.12, 0xe8f4ff, [0, 0.065, 0], { parent: g, transparent: true, opacity: 0.7 }); K.cyl(0.045, 0.02, 0.2, 0xf2d870, [0, 0.22, 0], { parent: g, transparent: true, opacity: 0.85, emissive: 0x403000, emissiveIntensity: 0.4 }); K.scene.add(g); return g; }
function canvasTex(w, h, fn) { return K.tex(w, h, fn); }

export async function build(k) {
  K = k; await K.preloadEnvs(); await K.preloadSkies(['qwantani_dusk_2_puresky_2k']); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  KG = C(K.scene, { shirt: 0x2a4aa8, cape: 0xb0202a, buttons: 0xf3c537, belt: 0xf3c537, hat: 'crown', hair: 0xf2f2f2, blush: true, seed: 1 });
  C1 = C(K.scene, { shirt: 0xd88aa8, hair: 0xe8e0d0, hat: 'wig', hatColor: 0xf2f2f2, seed: 2 });
  C2 = C(K.scene, { shirt: 0x3a8a6a, tie: 0xf2ead8, hat: 'wig', hatColor: 0xe8e8e8, mustache: true, seed: 3 });
  SV = C(K.scene, { shirt: 0x2a2a3a, buttons: 0xf3c537, belt: 0xf2f2f2, hair: 0x3a2a1a, seed: 4 });
  CK1 = C(K.scene, { shirt: 0xf2f2f2, apron: 0xe8e0d0, hat: 'chef', hatColor: 0xffffff, mustache: true, seed: 5 });
  CK2 = C(K.scene, { shirt: 0xf2f2f2, belt: 0xb0202a, hat: 'chef', hatColor: 0xffffff, hair: 0x8a4a1a, seed: 6 });
  DR = C(K.scene, { shirt: 0x1a1a1a, buttons: 0xf2f2f2, hat: 'wig', hatColor: 0xd8d8d8, glasses: true, seed: 7 });
  const nbc = [0x8a2a2a, 0x2a3a6a, 0x5a3a7a, 0x2a6a4a, 0xa86a2a];
  for (let i = 0; i < 5; i++) NB.push(C(K.scene, { shirt: nbc[i], hat: 'wig', hatColor: [0xf2f2f2, 0xd8d0c0, 0xe8e8e8][i % 3], mustache: i % 2 === 0, buttons: 0xf3c537, seed: 10 + i }));
  for (let i = 0; i < 2; i++) GD.push(C(K.scene, { shirt: 0x1e3a8a, belt: 0xf3c537, buttons: 0xf3c537, hat: 'tricorn', hatColor: 0x1a1a1a, seed: 20 + i }));
  for (let i = 0; i < 3; i++) KIDS.push(C(K.scene, { shirt: [0xe8a030, 0x3a8ad8, 0xd84a6a][i], hair: [0x3a2a1a, 0xe8c070, 0x8a3a1a][i], seed: 30 + i }));
  TCH = C(K.scene, { shirt: 0x4a6a3a, glasses: true, hair: 0x5a5a5a, seed: 40 });

  // shared props
  spoon = new K.THREE.Group(); K.cyl(0.008, 0.008, 0.2, 0xe0c060, [0, 0.1, 0], { parent: spoon, metalness: 0.7 }); const sb = K.sph(0.03, 0xe0c060, [0, 0.21, 0], { parent: spoon, metalness: 0.7 }); sb.scale.set(1, 0.4, 1.3); K.scene.add(spoon);
  flute = mkFlute();
  tray = new K.THREE.Group(); K.cyl(0.32, 0.32, 0.025, 0xd8b040, [0, 0, 0], { parent: tray, metalness: 0.6, roughness: 0.3 }); K.scene.add(tray);
  trayBowl = mkBowl(true, true); trayBowl.scale.setScalar(1.0);
  for (let i = 0; i < 14; i++) bowls.push(mkBowl(false, false));
  for (let i = 0; i < 6; i++) { const s = K.sph(0.04, 0xffffff, [0, -99, 0], { transparent: true, opacity: 0.35 }); steam.push(s); }
  for (let i = 0; i < 10; i++) bubbles.push(K.sph(0.008, 0xfff8d0, [0, -99, 0], { emissive: 0xfff0a0, emissiveIntensity: 1.5 }));
  quill = new K.THREE.Group(); K.cyl(0.006, 0.006, 0.35, 0xf2f2f2, [0, 0.17, 0], { parent: quill }); const fe = K.sph(0.05, 0xf8f8f8, [0, 0.28, 0], { parent: quill }); fe.scale.set(0.35, 1.8, 0.1); K.scene.add(quill);
  paper = K.plane(0.24, 0.3, K.std(0xfbf4e0, { side: K.THREE.DoubleSide }), [0, -99, 0], [-0.5, 0, 0]);
  knife = new K.THREE.Group(); K.box(0.025, 0.12, 0.01, 0xd8dce4, [0, 0.08, 0], { parent: knife, metalness: 0.6 }); K.box(0.03, 0.08, 0.03, 0x5a3a1a, [0, -0.02, 0], { parent: knife }); K.scene.add(knife);
  chick = await K.placeH('rpg_items_pack/ChickenLeg', [0, -99, 0], 0, 0.3).catch(() => K.sph(0.1, 0xb86a2a, [0, -99, 0]));
  boxHeld = new K.THREE.Group(); K.box(0.22, 0.12, 0.16, 0x9a5a2a, [0, 0, 0], { parent: boxHeld }); K.box(0.23, 0.03, 0.17, 0xf3c537, [0, 0.07, 0], { parent: boxHeld }); K.scene.add(boxHeld);
  crownProp = await K.placeH('rpg_items_pack/Crown', [0, -99, 0], 0, 0.3, { tint: 0xf3c537 }).catch(() => K.cyl(0.18, 0.16, 0.16, 0xf3c537, [0, -99, 0], { metalness: 0.7 })); crownProp.scale.multiplyScalar(0.55);
  for (let i = 0; i < 70; i++) snow.push(K.sph(0.035, 0xffffff, [0, -99, 0], { emissive: 0xffffff, emissiveIntensity: 0.6 }));
  for (let i = 0; i < 6; i++) smoke.push(K.sph(0.04, 0xc8c8d0, [0, -99, 0], { transparent: true, opacity: 0.4 }));

  // ================= HALL: rococo dining hall, pale blue + gold, candlelight, winter night =================
  K.plane(30, 24, K.pbr('marble_01', [8, 6]), add(HALL, [0, 0.005, 0]));
  const wallM = K.pbr('painted_plaster_wall', [6, 2], { tint: 0x9cc4ea });
  K.plane(20, 7, wallM, add(HALL, [0, 3.5, -3.6]), [0, 0, 0]); K.plane(14, 7, wallM, add(HALL, [-7, 3.5, 2]), [0, Math.PI / 2, 0]); K.plane(14, 7, wallM, add(HALL, [7, 3.5, 2]), [0, -Math.PI / 2, 0]);
  K.box(20, 0.12, 0.1, 0xe8c050, add(HALL, [0, 1.1, -3.55]), { metalness: 0.5 }); K.box(20, 0.2, 0.15, 0xe8c050, add(HALL, [0, 5.0, -3.55]), { metalness: 0.5 });
  for (let x = -6; x <= 6; x += 2.4) { K.box(0.35, 5, 0.12, 0xf4f0e8, add(HALL, [x, 2.5, -3.52])); K.box(0.45, 0.2, 0.18, 0xe8c050, add(HALL, [x, 4.95, -3.5]), { metalness: 0.5 }); }
  const winT = canvasTex(256, 384, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0a1440'); gr.addColorStop(1, '#3a5aa0'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#ffffff'; for (let i = 0; i < 90; i++) { g.beginPath(); g.arc(Math.random() * w, Math.random() * h, 1.5 + Math.random() * 2.5, 0, 7); g.fill(); } g.fillStyle = '#e8eef8'; g.fillRect(0, h - 40, w, 40); g.strokeStyle = '#f4f0e8'; g.lineWidth = 12; g.strokeRect(6, 6, w - 12, h - 12); g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke(); });
  for (const x of [-4.8, 4.8]) { const wm = new K.THREE.Mesh(new K.THREE.PlaneGeometry(1.6, 2.6), new K.THREE.MeshBasicMaterial({ map: winT })); wm.position.set(...add(HALL, [x, 2.7, -3.5])); K.scene.add(wm); K.box(1.9, 0.15, 0.25, 0xe8c050, add(HALL, [x, 4.1, -3.45])); }
  const portT = canvasTex(256, 320, (g, w, h) => { g.fillStyle = '#2a4a3a'; g.fillRect(0, 0, w, h); g.fillStyle = '#f2ead8'; g.beginPath(); g.arc(w / 2, 130, 60, 0, 7); g.fill(); g.fillStyle = '#2a4aa8'; g.fillRect(70, 190, 116, 130); g.fillStyle = '#f3c537'; g.fillRect(88, 58, 80, 22); g.fillStyle = '#1a1a1a'; g.fillRect(105, 120, 10, 14); g.fillRect(142, 120, 10, 14); });
  for (const x of [-2.4, 2.4]) { K.box(1.3, 1.6, 0.08, 0xe8c050, add(HALL, [x, 3.1, -3.52]), { metalness: 0.5 }); const pm = new K.THREE.Mesh(new K.THREE.PlaneGeometry(1.1, 1.4), new K.THREE.MeshBasicMaterial({ map: portT })); pm.position.set(...add(HALL, [x, 3.1, -3.47])); K.scene.add(pm); }
  // long table with white cloth + gold runner
  K.box(7.4, 0.08, 1.5, 0xf8f8f2, add(HALL, [0, 0.92, 0])); K.box(7.42, 0.5, 1.52, 0xf2f2ea, add(HALL, [0, 0.66, 0])); K.box(7.0, 0.01, 0.35, 0xe8c050, add(HALL, [0, 0.965, 0]));
  // throne chair + side chairs
  K.box(1.0, 2.3, 0.15, 0xb0202a, add(HALL, [0, 1.15, -1.62])); K.box(1.1, 0.12, 0.2, 0xe8c050, add(HALL, [0, 2.32, -1.62]), { metalness: 0.5 }); K.sph(0.12, 0xe8c050, add(HALL, [0, 2.45, -1.62]), { metalness: 0.5 });
  K.box(0.8, 0.1, 0.7, 0xb0202a, add(HALL, [0, 0.48, -1.2]));
  for (const x of [-1.7, 1.7]) { K.box(0.7, 1.5, 0.1, 0x2a5a9a, add(HALL, [x, 0.95, -1.6])); K.box(0.7, 0.1, 0.6, 0x2a5a9a, add(HALL, [x, 0.48, -1.2])); }
  for (const x of [-2.6, 2.6]) candelabra(add(HALL, [x, 0.96, 0.15]));
  for (const x of [-1.7, 1.7]) { const p = plate(); p.position.set(...add(HALL, [x, 0.96, -0.4])); K.scene.add(p); }
  const pk = plate(); pk.position.set(...add(HALL, [0, 0.96, -0.38])); K.scene.add(pk);
  // fruit/food dressing on the table
  for (let i = 0; i < 6; i++) K.sph(0.07, [0xd8302a, 0xe8b030, 0x6aa83a][i % 3], add(HALL, [-3.2 + i * 0.12, 1.02, 0.35 + (i % 2) * 0.1]));
  await K.placeH('house_interior_pack/Light_Chandelier', add(HALL, [0, 4.9, -1.6]), 0, 1.3).catch(() => {});
  await K.placeH('house_interior_pack/Light_Chandelier', add(HALL, [-4.5, 4.9, -1.6]), 0, 1.3).catch(() => {});
  for (const x of [-6.2, 6.2]) await K.placeH('house_interior_pack/Houseplant_3', add(HALL, [x, 0, -3.0]), 0, 1.8).catch(() => {});
  await K.placeH('house_interior_pack/Door_Double', add(HALL, [6.95, 0, -0.5]), -Math.PI / 2, 3.0).catch(() => {});
  K.pointLight(0xffc888, 10, add(HALL, [0, 2.8, 0.8]), 9); K.pointLight(0xffb070, 5, add(HALL, [-2.6, 1.9, 0.4]), 5); K.pointLight(0xffb070, 5, add(HALL, [2.6, 1.9, 0.4]), 5); K.pointLight(0x8ab0ff, 3, add(HALL, [0, 3, -3]), 8);
  SG.cuantas = K.sign('¿CUÁNTOS?', add(MAC, [0, 1.42, -1.2]), { w: 0.85, h: 0.3, bg: '#2a4aa8' });
  SG.n14 = K.sign('14 POSTRES', add(HALL, [-0.9, 3.0, -3.3]), { w: 2.8, h: 0.85, bg: '#b0202a' });
  SG.otro = K.sign('¡OTRO!', add(HALL, [-1.9, 2.6, -3.3]), { w: 1.8, h: 0.75, bg: '#b0202a' });
  // ================= MACRO table (close food shots): cloth + bokeh candles behind =================
  K.box(4, 0.1, 3, 0xf8f8f2, add(MAC, [0, 0.9, 0])); K.box(4, 0.01, 0.4, 0xe8c050, add(MAC, [0, 0.955, -0.6]));
  K.plane(10, 6, wallM, add(MAC, [0, 3, -3]), [0, 0, 0]);
  for (let i = 0; i < 5; i++) { const c = mkCandle(0.35); c.position.set(...add(MAC, [-1.6 + i * 0.8, 0.95, -1.3])); K.scene.add(c); }
  K.pointLight(0xffc080, 6, add(MAC, [0, 2.0, 0.8]), 5); K.pointLight(0xffa860, 4, add(MAC, [0, 1.6, -1.0]), 4);
  macroBowl = mkBowl(true, false); macroBun = mkSemla(1);  K.scene.add(macroBun);
  semla = mkSemla(1); K.scene.add(semla);
  lobster = mkLobster(); const lp = plate(); lp.add(lobster); lobster.position.y = 0.03; lp.position.set(...add(MAC, [0, 0.96, 0])); K.scene.add(lp); lobster.userData.plate = lp;
  // caviar, chucrut, arenque
  { const p1 = plate(); const cb = K.cyl(0.1, 0.08, 0.06, 0xd8d8e0, [0, 0.05, 0], { parent: p1 }); for (let i = 0; i < 30; i++) K.sph(0.012, 0x101018, [Math.cos(i) * 0.06 * Math.random(), 0.085, Math.sin(i) * 0.06 * Math.random()], { parent: p1, metalness: 0.3, roughness: 0.2 });
    const p2 = plate(); for (let i = 0; i < 22; i++) { const s = K.cyl(0.006, 0.006, 0.18, 0xe8e0a0, [Math.cos(i * 2.1) * 0.08, 0.04 + (i % 4) * 0.012, Math.sin(i * 1.7) * 0.08], { parent: p2 }); s.rotation.set(Math.PI / 2, i, 0.4 * i); }
    const p3 = plate(); for (const s of [-1, 1]) { const fb = K.sph(0.05, 0xb8c4d0, [s * 0.06, 0.04, 0], { parent: p3, metalness: 0.5, roughness: 0.3 }); fb.scale.set(0.6, 0.45, 3); const tl = K.cyl(0.0, 0.05, 0.08, 0x8a96a8, [s * 0.06, 0.04, 0.19], { parent: p3 }); tl.rotation.x = Math.PI / 2; }
    for (const p of [p1, p2, p3]) { K.scene.add(p); plates3.push(p); } }

  // ================= EXT: palace in the snow at dusk =================
  K.plane(160, 160, K.std(0xeef4ff, { roughness: 0.9 }), add(EXT, [0, 0.01, 0]));
  K.box(40, 12, 6, 0xffffff, add(EXT, [0, 6, -18]), { map: undefined }).material = K.pbr('white_plaster_02', [8, 3], { tint: 0xf0dcb8 });
  K.box(40.5, 1.2, 6.5, 0x4a7a6a, add(EXT, [0, 12.4, -18]));
  for (let r = 0; r < 3; r++) for (let i = 0; i < 12; i++) { const w = new K.THREE.Mesh(new K.THREE.PlaneGeometry(1.3, 2.0), new K.THREE.MeshBasicMaterial({ color: (i + r) % 4 ? 0xffd890 : 0xffb860 })); w.position.set(...add(EXT, [-17 + i * 3.1, 2.4 + r * 3.4, -14.94])); K.scene.add(w); K.box(1.6, 0.2, 0.3, 0xf4f0e8, add(EXT, [-17 + i * 3.1, 1.3 + r * 3.4, -14.85])); }
  K.box(4, 4.5, 0.4, 0x5a3a1a, add(EXT, [0, 2.25, -14.9])); K.box(4.6, 0.6, 0.6, 0xe8c050, add(EXT, [0, 4.8, -14.8]));
  for (let i = 0; i < 14; i++) { const m = K.sph(0.9 + (i % 3) * 0.4, 0xffffff, add(EXT, [(i % 2 ? 1 : -1) * (3 + (i % 7) * 2.2), 0, -4 - (i % 4) * 2.4])); m.scale.y = 0.35; }
  for (const x of [-4.5, 4.5]) { K.cyl(0.07, 0.09, 3.6, 0x1a1a1a, add(EXT, [x, 1.8, -6])); K.sph(0.28, 0xffd890, add(EXT, [x, 3.75, -6]), { emissive: 0xffb050, emissiveIntensity: 4 }); K.pointLight(0xffb060, 6, add(EXT, [x, 3.6, -5.6]), 8); }
  for (let i = 0; i < 6; i++) await K.placeH(`nature_pack/PineTree_${(i % 5) + 1}`, add(EXT, [(i % 2 ? 1 : -1) * (12 + (i % 3) * 3), 0, -8 - (i % 3) * 3]), i, 7, { tint: 0xd8e8f0 }).catch(() => {});
  SG.sto = K.sign('ESTOCOLMO 1771', add(EXT, [0, 3.3, -7.0]), { w: 3.4, h: 0.9, bg: '#1e3a8a' });
  K.pointLight(0xffd8a0, 8, add(EXT, [0, 4, -10]), 16);

  // ================= PARL: riksdag hall, dark wood + red =================
  K.plane(24, 20, K.pbr('wood_floor', [6, 5]), add(PARL, [0, 0.01, 0]));
  const pw = K.pbr('dark_wood', [5, 2], { tint: 0xc08060 }); K.plane(24, 9, pw, add(PARL, [0, 4.5, -7]), [0, 0, 0]); K.plane(16, 9, pw, add(PARL, [-8, 4.5, 0]), [0, Math.PI / 2, 0]); K.plane(16, 9, pw, add(PARL, [8, 4.5, 0]), [0, -Math.PI / 2, 0]);
  K.box(9, 1.2, 0.8, 0x6a2a1a, add(PARL, [0, 0.6, -3.0])); K.box(9.2, 0.1, 1.0, 0xe8c050, add(PARL, [0, 1.22, -3.0])); K.box(9, 0.6, 2, 0x5a2a1a, add(PARL, [0, 0.3, -4.6]));
  K.plane(3, 10, K.std(0xa01a2a), add(PARL, [0, 0.02, 1]));
  for (let i = 0; i < 4; i++) K.box(1.4, 3.2, 0.1, [0xb0202a, 0x1e3a8a][i % 2], add(PARL, [-6 + i * 4, 4.6, -6.9]));
  K.box(0.7, 0.5, 0.6, 0x6a3a1a, add(PARL, [0, 0.25, 1.75])); K.box(0.6, 1.1, 0.1, 0xb0202a, add(PARL, [0, 1.3, 1.95]));
  SG.parl = K.sign('PARLAMENTO', add(PARL, [0, 5.2, -6.8]), { w: 4.6, h: 1.1, bg: '#1e3a8a' });
  K.pointLight(0xffd0a0, 9, add(PARL, [0, 3.6, -1]), 12); K.pointLight(0xffc080, 5, add(PARL, [0, 2.5, 3]), 6);

  // ================= SHOP: royal workshop, stone + planks, window shaft =================
  K.plane(20, 16, K.pbr('brown_planks_03', [5, 4]), add(SHOP, [0, 0.01, 0]));
  const sw = K.pbr('rustic_stone_wall_02', [4, 2]); K.plane(20, 8, sw, add(SHOP, [0, 4, -4]), [0, 0, 0]); K.plane(12, 8, sw, add(SHOP, [-6, 4, 2]), [0, Math.PI / 2, 0]); K.plane(12, 8, sw, add(SHOP, [6, 4, 2]), [0, -Math.PI / 2, 0]);
  K.box(2.8, 0.12, 1.0, 0x8a5a2a, add(SHOP, [0, 1.05, -0.3])); for (const [x, z] of [[-1.3, -0.7], [1.3, -0.7], [-1.3, 0.1], [1.3, 0.1]]) K.box(0.12, 1.0, 0.12, 0x5a3a1a, add(SHOP, [x, 0.5, z]));
  lathe = new K.THREE.Group(); const lc = K.cyl(0.07, 0.07, 0.5, 0xc89a5a, [0, 0, 0], { parent: lathe }); lc.rotation.z = Math.PI / 2; K.box(0.12, 0.22, 0.14, 0x3a3a3a, [-0.32, -0.04, 0], { parent: lathe }); K.box(0.12, 0.22, 0.14, 0x3a3a3a, [0.32, -0.04, 0], { parent: lathe }); lathe.position.set(...add(SHOP, [-0.6, 1.24, -0.2])); K.scene.add(lathe);
  K.box(2.6, 0.08, 0.5, 0x6a4a2a, add(SHOP, [1.6, 2.2, -3.7])); K.box(2.6, 0.08, 0.5, 0x6a4a2a, add(SHOP, [1.6, 2.9, -3.7]));
  const bc = [0x9a5a2a, 0x7a3a1a, 0xb87a3a, 0x5a3a1a];
  for (let i = 0; i < 14; i++) { const b = K.box(0.26, 0.16, 0.2, bc[i % 4], add(SHOP, [0.6 + (i % 7) * 0.33, 2.33 + Math.floor(i / 7) * 0.7, -3.6])); K.box(0.27, 0.03, 0.21, 0xf3c537, [0, 0.09, 0], { parent: b }); }
  for (let i = 0; i < 4; i++) { const b = K.box(0.24, 0.14, 0.18, bc[i], add(SHOP, [0.3 + i * 0.3, 1.18, 0.0])); K.box(0.25, 0.03, 0.19, 0xf3c537, [0, 0.08, 0], { parent: b }); }
  for (let i = 0; i < 12; i++) K.box(0.08, 0.01, 0.03, 0xe8c890, add(SHOP, [-1 + Math.sin(i) * 0.6, 0.02, 0.5 + Math.cos(i * 2) * 0.5]));
  const swin = new K.THREE.Mesh(new K.THREE.PlaneGeometry(1.6, 2.0), new K.THREE.MeshBasicMaterial({ color: 0xcfe4ff })); swin.position.set(...add(SHOP, [-2.4, 2.8, -3.95])); K.scene.add(swin);
  K.ray(add(SHOP, [-2.4, 2.0, -3.5]), [0.4, 0, 0.3], 1.4, 4, 0xfff0d0, 0.12);
  K.pointLight(0xffd8a0, 8, add(SHOP, [0, 3.2, 1.2]), 9); K.pointLight(0xcfe4ff, 4, add(SHOP, [-2.4, 2.6, -2.8]), 6);
  SG.caj = K.sign('CAJITAS', add(SHOP, [1.6, 3.6, -3.9]), { w: 2.2, h: 0.65, bg: '#6a3a1a' });

  // ================= KIT: palace kitchen, brick + copper, fire =================
  K.plane(20, 16, K.pbr('stone_tiles_02', [6, 5]), add(KIT, [0, 0.01, 0]));
  const kw = K.pbr('red_brick', [5, 2]); K.plane(20, 8, kw, add(KIT, [0, 4, -4]), [0, 0, 0]); K.plane(12, 8, kw, add(KIT, [-6, 4, 2]), [0, Math.PI / 2, 0]); K.plane(12, 8, kw, add(KIT, [6, 4, 2]), [0, -Math.PI / 2, 0]);
  await K.placeH('house_interior_pack/Fireplace', add(KIT, [-2.6, 0, -3.6]), 0, 2.4).catch(() => {});
  K.sph(0.4, 0xff8020, add(KIT, [-2.6, 0.5, -3.3]), { emissive: 0xff6010, emissiveIntensity: 4 }).scale.set(1.4, 0.8, 0.6);
  K.pointLight(0xff8a40, 8, add(KIT, [-2.6, 1.0, -2.6]), 7);
  K.box(3.0, 0.1, 1.0, 0x8a6a4a, add(KIT, [1.4, 1.0, -2.6])); K.box(3.0, 0.95, 0.9, 0x6a4a2a, add(KIT, [1.4, 0.5, -2.6]));
  for (let i = 0; i < 9; i++) { const s = mkSemla(0.9); s.position.set(...add(KIT, [0.3 + (i % 5) * 0.45, 1.05, -2.8 + Math.floor(i / 5) * 0.35])); K.scene.add(s); }
  K.box(3.2, 0.08, 0.45, 0x6a4a2a, add(KIT, [1.4, 2.6, -3.75])); for (let i = 0; i < 8; i++) { const b = mkBowl(false, false); b.position.set(...add(KIT, [0.1 + i * 0.36, 2.64, -3.7])); }
  for (let i = 0; i < 5; i++) { const pan = K.cyl(0.22, 0.22, 0.05, 0xc87a3a, add(KIT, [-0.6 + i * 0.5, 3.4, -3.92]), { metalness: 0.7, roughness: 0.3 }); pan.rotation.x = Math.PI / 2; }
  SG.otro2 = K.sign('¿OTRO MÁS?', add(KIT, [1.6, 4.1, -3.9]), { w: 2.8, h: 0.8, bg: '#b0202a' });
  K.pointLight(0xffd8a0, 7, add(KIT, [0.8, 3.2, 1.0]), 9);

  // ================= BED: royal bedroom, night, candle =================
  K.plane(16, 16, K.pbr('wood_floor', [4, 4], { tint: 0x9a7a6a }), add(BED, [0, 0.01, 0]));
  const bw = K.pbr('painted_plaster_wall', [4, 2], { tint: 0x4a5a9a }); K.plane(16, 7, bw, add(BED, [0, 3.5, -3.5]), [0, 0, 0]); K.plane(12, 7, bw, add(BED, [-5, 3.5, 2]), [0, Math.PI / 2, 0]); K.plane(12, 7, bw, add(BED, [5, 3.5, 2]), [0, -Math.PI / 2, 0]);
  K.box(2.0, 0.5, 2.8, 0x6a3a1a, add(BED, [0, 0.25, -1.9])); K.box(1.9, 0.25, 2.7, 0xf4f0e8, add(BED, [0, 0.62, -1.9])); K.box(2.1, 2.4, 0.15, 0x6a3a1a, add(BED, [0, 1.2, -3.3])); K.box(2.0, 0.12, 0.18, 0xe8c050, add(BED, [0, 2.45, -3.3]));
  const pil = K.box(1.2, 0.18, 0.5, 0xffffff, add(BED, [0, 0.83, -2.95]));
  SG.blank = K.box(1.92, 0.4, 2.15, 0x2a3a8a, add(BED, [0, 0.95, -1.4]));
  for (const x of [-1.3, 1.3]) { K.box(0.2, 3.2, 0.2, 0x6a3a1a, add(BED, [x * 0.8, 1.6, -0.6])); }
  K.box(2.4, 0.15, 3.0, 0xb0202a, add(BED, [0, 3.2, -1.9]));
  K.box(0.6, 0.7, 0.5, 0x5a3a1a, add(BED, [1.6, 0.35, -2.6]));
  candleBed = mkCandle(0.3); candleBed.position.set(...add(BED, [1.6, 0.72, -2.6])); K.scene.add(candleBed); flameBed = candleBed.userData.flame;
  SG.bedLight = K.pointLight(0xffb060, 6, add(BED, [1.4, 1.4, -2.2]), 6);
  const bwin = new K.THREE.Mesh(new K.THREE.PlaneGeometry(1.4, 2.2), new K.THREE.MeshBasicMaterial({ map: winT })); bwin.position.set(...add(BED, [-2.8, 2.4, -3.45])); K.scene.add(bwin);
  K.pointLight(0x7a9aff, 3, add(BED, [-2.4, 2.4, -2.4]), 6);
  SG.bowlBed = mkBowl(false, false);

  // ================= GAL: museum gallery, portrait, kids =================
  K.plane(20, 16, K.pbr('checkered_pavement_tiles', [5, 4]), add(GAL, [0, 0.01, 0]));
  const gw = K.pbr('painted_plaster_wall', [4, 2], { tint: 0xe8d090 }); K.plane(20, 8, gw, add(GAL, [0, 4, -4]), [0, 0, 0]); K.plane(12, 8, gw, add(GAL, [-6, 4, 2]), [0, Math.PI / 2, 0]); K.plane(12, 8, gw, add(GAL, [6, 4, 2]), [0, -Math.PI / 2, 0]);
  const bigP = canvasTex(512, 640, (g, w, h) => { g.fillStyle = '#2a4a3a'; g.fillRect(0, 0, w, h); g.fillStyle = '#f2ead8'; g.beginPath(); g.arc(w / 2, 250, 120, 0, 7); g.fill(); g.fillStyle = '#2a4aa8'; g.beginPath(); g.ellipse(w / 2, 600, 190, 200, 0, 0, 7); g.fill(); g.fillStyle = '#f3c537'; g.fillRect(170, 110, 172, 40); for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(170 + i * 57, 112); g.lineTo(198 + i * 57, 60); g.lineTo(226 + i * 57, 112); g.fill(); } g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(215, 240, 12, 0, 7); g.arc(297, 240, 12, 0, 7); g.fill(); g.strokeStyle = '#1a1a1a'; g.lineWidth = 8; g.beginPath(); g.arc(w / 2, 290, 40, 0.2, Math.PI - 0.2); g.stroke(); g.fillStyle = '#d0894a'; g.beginPath(); g.ellipse(360, 470, 70, 42, 0, 0, 7); g.fill(); g.fillStyle = '#fffaf0'; g.beginPath(); g.ellipse(360, 445, 64, 22, 0, 0, 7); g.fill(); g.fillStyle = '#d89a58'; g.beginPath(); g.ellipse(362, 425, 54, 22, 0.15, 0, 7); g.fill(); });
  K.box(2.6, 3.2, 0.15, 0xe8c050, add(GAL, [0, 3.1, -3.9]), { metalness: 0.5 }); { const m = new K.THREE.Mesh(new K.THREE.PlaneGeometry(2.2, 2.75), new K.THREE.MeshBasicMaterial({ map: bigP })); m.position.set(...add(GAL, [0, 3.1, -3.8])); K.scene.add(m); }
  for (const x of [-3.8, 3.8]) { K.box(1.4, 1.8, 0.1, 0xe8c050, add(GAL, [x, 3.0, -3.92]), { metalness: 0.5 }); const m = new K.THREE.Mesh(new K.THREE.PlaneGeometry(1.2, 1.6), new K.THREE.MeshBasicMaterial({ map: portT })); m.position.set(...add(GAL, [x, 3.0, -3.85])); K.scene.add(m); }
  K.cyl(0.04, 0.04, 0.9, 0xe8c050, add(GAL, [-1.6, 0.45, -2.6])); K.cyl(0.04, 0.04, 0.9, 0xe8c050, add(GAL, [1.6, 0.45, -2.6])); const rope = K.cyl(0.03, 0.03, 3.2, 0xb0202a, add(GAL, [0, 0.82, -2.6])); rope.rotation.z = Math.PI / 2;
  SG.plq = K.sign('EL REY QUE COMIÓ HASTA MORIR', add(GAL, [0, 5.0, -3.85]), { w: 3.6, h: 0.5, bg: '#1a1a1a' });
  K.pointLight(0xffe0b0, 8, add(GAL, [0, 4.5, -1.5]), 8); K.pointLight(0xffd8a0, 6, add(GAL, [0, 2.5, 2.5]), 9);
}

function hideAll() {
  for (const c of [KG, C1, C2, SV, CK1, CK2, DR, TCH, ...NB, ...GD, ...KIDS]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(1); c.hold(null); }
  for (const [k, g] of Object.entries(SG)) if (g.isGroup && k !== 'bowlBed') g.visible = false;
  for (const o of [spoon, flute, tray, trayBowl, quill, paper, knife, chick, boxHeld, crownProp, macroBowl, macroBun, semla, SG.bowlBed]) { if (o.parent !== K.scene) { if (o.parent) o.parent.remove(o); K.scene.add(o); } o.position.set(0, -99, 0); o.rotation.set(0, 0, 0); o.visible = true; }
  paper.rotation.set(-0.5, 0, 0);
  for (const b of bowls) b.position.set(0, -99, 0);
  for (const p of [...steam, ...bubbles, ...snow, ...smoke]) p.position.set(0, -99, 0);
  lobster.userData.plate.position.set(...add(MAC, [0, -99, 0])); for (const p of plates3) p.position.set(0, -99, 0);
  candleBed.visible = true; flameBed.scale.set(0.8, 1.6, 0.8); flameBed.visible = true; SG.bedLight.intensity = 6;
}
function tick(f) { const t = f / 30; for (const fl of flames) { const k = 1 + Math.sin(t * 17 + fl.id) * 0.12; fl.scale.set(0.8 * k, 1.6 * k, 0.8 * k); } return t; }
const K0 = () => add(HALL, [0, 0, -1.2]);
function stack(n, base = add(HALL, [0.62, 0.965, -0.25])) { for (let i = 0; i < 14; i++) { if (i < n) bowls[i].position.set(base[0] + Math.sin(i * 1.7) * 0.015, base[1] + i * 0.1, base[2] + Math.cos(i * 1.3) * 0.015); } }
function steamAt(c, t, r = 0.12) { steam.forEach((s, i) => { const k = (t * 0.45 + i / steam.length) % 1; s.position.set(c[0] + Math.sin(i * 2.3 + t) * r * (0.4 + k), c[1] + k * 0.55, c[2] + Math.cos(i * 1.7) * r * 0.5); s.scale.setScalar(0.25 + k * 0.7); s.material.opacity = 0.2 * (1 - k); }); }
function seatedTable(f, t, o = {}) { // king + courtiers seated at the banquet
  const k = K0(); P(KG, { pos: k, yaw: 0, sit: 1, expr: o.kExpr || 'happy', blush: true, look: o.kLook || [0, -0.15], talk: o.talk || 0, armsOverride: o.kArms === undefined ? EAT : o.kArms, arms: o.kArmsName }, f);
  if (o.spoon !== false && (o.kArms === undefined || o.kArms === EAT)) { holdW(KG, spoon, [0, -0.02, 0.0]); spoon.rotation.set(-0.9, 0, 0); }
  P(C1, { pos: add(HALL, [-1.7, 0, -1.2]), yaw: 0.35, sit: 1, expr: o.cExpr || 'shock', arms: o.cArms || 'down', lean: o.cLean || 0, sweat: o.cSweat, look: [0.4, 0] }, f);
  P(C2, { pos: add(HALL, [1.7, 0, -1.2]), yaw: -0.35, sit: 1, expr: o.cExpr || 'shock', arms: o.cArms || 'down', lean: o.cLean || 0, sweat: o.cSweat, look: [-0.4, 0] }, f);
}
function hook(f, t, n = 13) { seatedTable(f, t, { kExpr: 'happy', cExpr: 'shock' }); stack(n);
  // servant arriving with one more bowl
  const sp = add(HALL, [-0.85, 0, -0.95]); P(SV, { pos: sp, yaw: 0.45, expr: 'worried', sweat: true, armsOverride: TRAY }, f); holdW(SV, tray, [0.1, 0.02, 0.05]); trayBowl.position.set(tray.position.x, tray.position.y + 0.015, tray.position.z); steamAt([tray.position.x, tray.position.y + 0.15, tray.position.z], t, 0.08);
  SG.otro.visible = true; }

export function frame(f, kk) {
  hideAll(); const ph = K.at(f), t = tick(f), u = (i, j) => K.u(f, i, j);
  K.preset('interior', { exposure: 1.1 });
  const k = K0();
  switch (ph) {
    case 0: { // HOOK: king eats from a tower of 13 empty bowls, servant brings one more
      hook(f, t, 13);
      K.move(K.frame([k, add(HALL, [-0.85, 0, -0.95]), add(HALL, [0.8, 0, -0.2])], { yaw: -0.12, pitch: 0.18, h: 2.0, lookY: 1.7, push: 0.82, pad: 1.05 }), K.frame([k, add(HALL, [-0.85, 0, -0.95]), add(HALL, [0.8, 0, -0.2])], { yaw: -0.04, pitch: 0.16, h: 1.9, lookY: 1.7, push: 0.75, pad: 1.05 }), u(0), 0.6, f); K.focusOn(add(k, [0.3, 1.4, 0.3])); break; }
    case 1: { // not one serving — wait to hear how many: macro of the semla bowl, steam, ¿CUÁNTOS?
      const c = add(MAC, [0, 0.95, 0]); macroBowl.position.set(...c); macroBun.position.set(c[0], c[1] + 0.1, c[2]); macroBun.rotation.y = t * 0.3; steamAt([c[0], c[1] + 0.25, c[2]], t); SG.cuantas.visible = true;
      K.move({ p: add(c, [0.5, 0.45, 1.5]), l: add(c, [0, 0.3, -0.5]), fov: 44 }, { p: add(c, [0.3, 0.4, 1.15]), l: add(c, [0, 0.3, -0.5]), fov: 42 }, u(1), 0.3, f); K.focusOn(add(c, [0, 0.15, 0])); break; }
    case 2: { // Stockholm 1771, carnival Tuesday: snowy palace at dusk, guards, snow falling
      K.preset('dusk', { exposure: 1.3, photo: 'qwantani_dusk_2_puresky_2k' });
      const a = add(EXT, [-2.2, 0, -8.5]), b = add(EXT, [2.2, 0, -8.5]); SG.sto.visible = true;
      P(GD[0], { pos: a, yaw: 0.1, expr: 'neutral', arms: 'down', tremble: 0.6 }, f); P(GD[1], { pos: b, yaw: -0.1, expr: 'neutral', arms: 'down', tremble: 0.6 }, f);
      snow.forEach((s, i) => { const kq = (t * 0.25 + i / 70) % 1; s.position.set(...add(EXT, [-6 + (i * 1.37) % 12 + Math.sin(t + i) * 0.3, 7 - kq * 7, -9 + (i * 0.71) % 9])); });
      K.move({ p: add(EXT, [0.8, 1.4, 3.0]), l: add(EXT, [0.8, 3.6, -14]), fov: 50 }, { p: add(EXT, [0.3, 1.6, 1.0]), l: add(EXT, [0.3, 3.4, -14]), fov: 48 }, u(2), 0.4, f); K.focusOn(add(EXT, [0, 2.5, -8])); break; }
    case 3: { // he was king... but parliament ruled: nobles shouting, tiny king signing papers
      SG.parl.visible = true; const kp = add(PARL, [0, 0, 1.6]);
      NB.forEach((N, i) => P(N, { pos: add(PARL, [-3.2 + i * 1.6, 0.6, -4.3]), yaw: (2 - i) * 0.08, expr: 'angry', arms: i % 2 ? 'point' : 'fists', talk: 0.8, bounce: 0.3 }, f));
      P(KG, { pos: kp, yaw: Math.PI, sit: 1, expr: 'tired', armsOverride: (C) => { C.armR.a.rotation.set(-1.0, 0, -0.2); C.armR.b.rotation.set(-0.8, 0, 0); C.armL.a.rotation.set(-0.9, 0, 0.3); C.armL.b.rotation.set(-0.7, 0, 0); }, look: [0, -0.3] }, f);
      holdW(KG, quill, [0, 0, 0]); quill.rotation.set(0.5, 0, 0.3 + Math.sin(t * 9) * 0.15); holdL(KG, paper, [0, 0.05, 0]);
      const v = u(3);
      if (v < 0.5) K.move({ p: add(PARL, [2.4, 2.0, 4.6]), l: add(PARL, [0, 1.6, -3]), fov: 46 }, { p: add(PARL, [1.6, 2.1, 4.0]), l: add(PARL, [-0.3, 1.7, -3]), fov: 46 }, v / 0.5, 0.4, f);
      else K.move({ p: add(PARL, [-0.9, 2.1, -1.4]), l: add(kp, [0, 1.15, 0]), fov: 46 }, { p: add(PARL, [-0.6, 2.0, -1.0]), l: add(kp, [0, 1.15, 0]), fov: 44 }, (v - 0.5) / 0.5, 0.3, f);
      K.focusOn(v < 0.5 ? add(PARL, [0, 2, -3]) : add(kp, [0, 1.2, 0])); break; }
    case 4: { // carving little wooden boxes... and eating
      const kp = add(SHOP, [-0.4, 0, -1.1]); const v = u(4); SG.caj.visible = true; lathe.children[0].rotation.x = t * 20;
      if (v < 0.55) { P(KG, { pos: kp, yaw: 0, expr: 'proud', arms: 'hold2', look: [0, -0.35] }, f); holdW(KG, knife, [0, 0, 0.05]); knife.rotation.set(1.2, 0, 0.4 + Math.sin(t * 8) * 0.2); holdL(KG, boxHeld, [0.05, 0.02, 0.05]);
        K.move(K.frame([kp, add(SHOP, [-0.6, 0, -0.2])], { yaw: 0.35, h: 2.7, lookY: 1.5, pitch: 0.08, push: 0.8 }), K.frame([kp, add(SHOP, [-0.6, 0, -0.2])], { yaw: 0.22, h: 2.6, lookY: 1.5, pitch: 0.08, push: 0.74 }), v / 0.55, 0.4, f); }
      else { P(KG, { pos: kp, yaw: 0.2, expr: 'laugh', blush: true, armsOverride: DRINK, bounce: 0.2 }, f); holdW(KG, chick, [0, 0.0, 0.05]); chick.rotation.set(0.4, 0, -0.6);
        K.move(K.frame([kp], { yaw: -0.25, h: 2.6, lookY: 1.65, pitch: 0.02, push: 0.8 }), K.frame([kp], { yaw: -0.15, h: 2.5, lookY: 1.65, pitch: 0.02, push: 0.72 }), (v - 0.55) / 0.45, 0.4, f); }
      K.focusOn(add(kp, [0, 1.6, 0])); break; }
    case 5: { // that night he sat at the table with royal hunger: crane down the hall, king rubbing hands
      seatedTable(f, t, { kExpr: 'happy', kArms: RUB, cExpr: 'happy', spoon: false });
      P(SV, { pos: add(HALL, [-3.4, 0, -1.6]), yaw: 0.3, expr: 'neutral', armsOverride: TRAY }, f);
      K.move({ p: add(HALL, [0.5, 3.6, 5.2]), l: add(HALL, [0, 1.2, -1.2]), fov: 46 }, { p: add(HALL, [0.2, 1.75, 2.6]), l: add(HALL, [0, 1.35, -1.2]), fov: 44 }, u(5), 0.4, f); K.focusOn(add(k, [0, 1.4, 0])); break; }
    case 6: { // First, lobster: macro
      const lp = lobster.userData.plate; lp.position.set(...add(MAC, [0, 0.96, 0])); lp.rotation.y = 0.4 + u(6) * 0.3;
      K.move({ p: add(MAC, [0.2, 1.45, 0.9]), l: add(MAC, [0, 1.0, 0]), fov: 42 }, { p: add(MAC, [0.1, 1.3, 0.62]), l: add(MAC, [0, 1.0, 0]), fov: 40 }, u(6), 0.3, f); K.focusOn(add(MAC, [0, 1.0, 0])); break; }
    case 7: { // caviar, sauerkraut, smoked herring: plates slide in one by one (top-down)
      const v = u(7); plates3.forEach((p, i) => { const a = Math.min(1, Math.max(0, (v - i * 0.25) / 0.18)); const z = -0.6 + i * 0.6; p.position.set(...add(MAC, [(1 - K.ease(a)) * 2.5, 0.96, z])); });
      K.move({ p: add(MAC, [0, 3.3, 0.35]), l: add(MAC, [0, 0.96, 0.0]), fov: 46 }, { p: add(MAC, [0, 3.0, 0.3]), l: add(MAC, [0, 0.96, 0.0]), fov: 46 }, v, 0.2, f); K.focusOn(add(MAC, [0, 0.96, 0.1])); break; }
    case 8: { // washed down with champagne: king drinks, courtiers toast
      seatedTable(f, t, { kExpr: 'happy', kArms: DRINK, cExpr: 'happy', cArms: 'wave', spoon: false });
      holdW(KG, flute, [0, -0.12, 0.04]);
      bubbles.forEach((b, i) => { const q = (t * 0.8 + i / 10) % 1; b.position.set(flute.position.x + Math.sin(i * 3) * 0.02, flute.position.y + 0.15 + q * 0.15, flute.position.z + Math.cos(i * 2) * 0.02); });
      K.move(K.frame([k], { yaw: 0.3, h: 1.9, lookY: 1.5, pitch: 0.02, push: 0.85 }), K.frame([k], { yaw: 0.2, h: 1.8, lookY: 1.5, pitch: 0.02, push: 0.75 }), u(8), 0.4, f); K.focusOn(add(k, [0, 1.5, 0])); break; }
    case 9: { // anyone would have stopped. He was just starting: courtiers stuffed, king fists up
      const v = u(9); const st = v > 0.5;
      seatedTable(f, t, { kExpr: st ? 'smug' : 'neutral', kArms: null, kArmsName: st ? 'fists' : 'down', cExpr: 'tired', cLean: -0.25, cSweat: true, spoon: false });
      if (v > 0.5 && v < 0.56) K.grade.flash.value = 0.35;
      for (const x of [-1.7, 1.7]) {} // plates already there
      if (!st) K.move(K.frame([add(HALL, [-1.7, 0, -1.2]), k], { yaw: 0.35, h: 2.0, lookY: 1.45, pitch: 0.06, push: 0.72 }), K.frame([add(HALL, [-1.7, 0, -1.2]), k], { yaw: 0.45, h: 2.0, lookY: 1.45, pitch: 0.06, push: 0.66 }), v / 0.5, 0.3, f);
      else K.move(K.frame([k], { yaw: -0.05, h: 2.2, lookY: 1.45, pitch: 0.04, push: 0.85 }), K.frame([k], { yaw: 0.0, h: 2.1, lookY: 1.45, pitch: 0.04, push: 0.72 }), K.ease((v - 0.5) / 0.5), 0.3, f);
      K.focusOn(add(k, [0, 1.4, 0])); break; }
    case 10: { // his favorite dessert: sweet bun with cream and almond — servant arrives; macro semla
      const v = u(10);
      if (v < 0.5) { seatedTable(f, t, { kExpr: 'shock', kArms: null, kArmsName: 'reach', cExpr: 'shock', spoon: false, kLook: [0.5, 0] });
        const w = K.ease(v / 0.5); const sp = K.lerp(add(HALL, [2.4, 0, -0.95]), add(HALL, [0.9, 0, -0.95]), w); P(SV, { pos: sp, yaw: -Math.PI / 2, walk: w < 1 ? t * 1.6 : 0, expr: 'proud', armsOverride: TRAY }, f); holdW(SV, tray, [0.12, 0.02, 0]); semla.position.set(tray.position.x, tray.position.y + 0.015, tray.position.z);
        K.move(K.frame([k, add(HALL, [1.6, 0, -0.95])], { yaw: 0.1, h: 2.3, lookY: 1.5, pitch: 0.08, push: 0.92 }), K.frame([k, add(HALL, [1.2, 0, -0.95])], { yaw: 0.05, h: 2.3, lookY: 1.5, pitch: 0.08, push: 0.86 }), v / 0.5, 0.4, f); K.focusOn(add(k, [0.5, 1.4, 0])); }
      else { const c = add(MAC, [0, 0.96, 0]); const pl = plates3[0]; semla.position.set(...c); semla.rotation.y = t * 0.4; semla.scale.setScalar(1.2);
        K.move({ p: add(c, [0.55, 0.32, 0.6]), l: add(c, [0, 0.12, 0]), fov: 40 }, { p: add(c, [0.35, 0.26, 0.45]), l: add(c, [0, 0.12, 0]), fov: 38 }, (v - 0.5) / 0.5, 0.2, f); K.focusOn(add(c, [0, 0.12, 0])); }
      break; }
    case 11: { // served in a bowl of hot milk: bun drops into the milk, splash of steam
      semla.scale.setScalar(1); const v = u(11); const c = add(MAC, [0, 0.95, 0]); macroBowl.position.set(...c);
      const dy = Math.max(0, 1 - K.ease(v / 0.45)) * 0.6; macroBun.position.set(c[0], c[1] + 0.1 + dy, c[2]); macroBun.rotation.y = t * 0.3; steamAt([c[0], c[1] + 0.2, c[2]], t);
      K.move({ p: add(c, [-0.7, 0.6, 0.85]), l: add(c, [0, 0.22, 0]), fov: 42 }, { p: add(c, [-0.45, 0.45, 0.65]), l: add(c, [0, 0.18, 0]), fov: 40 }, v, 0.3, f); K.focusOn(add(c, [0, 0.15, 0])); break; }
    case 12: { // ate one, asked for another, and another: tower grows 1 -> 6, servant rushing
      const v = u(12); const n = 1 + Math.floor(v * 6);
      seatedTable(f, t, { kExpr: v > 0.3 ? 'laugh' : 'happy', cExpr: 'shock' }); stack(n);
      const sp = K.lerp(add(HALL, [3.4, 0, -0.6]), add(HALL, [1.6, 0, -0.6]), (v * 3) % 1); P(SV, { pos: sp, yaw: -Math.PI / 2, run: 1, walk: t * 2.4, expr: 'worried', sweat: true, armsOverride: TRAY }, f); holdW(SV, tray, [0.12, 0.02, 0]); trayBowl.position.set(tray.position.x, tray.position.y + 0.015, tray.position.z);
      K.move(K.frame([k, add(HALL, [1.4, 0, -0.6])], { yaw: -0.3, h: 2.1, lookY: 1.4, pitch: 0.0, push: 0.9 }), K.frame([k, add(HALL, [1.2, 0, -0.6])], { yaw: -0.4, h: 2.1, lookY: 1.4, pitch: 0.0, push: 0.82 }), v, 0.4, f); K.focusOn(add(k, [0.5, 1.4, 0])); break; }
    case 13: { // cooks don't know whether to serve... or pray
      SG.otro2.visible = true; const v = u(13); const a = add(KIT, [0.4, 0, -1.2]), b = add(KIT, [1.9, 0, -1.3]);
      P(CK1, { pos: a, yaw: 0.25, expr: 'worried', sweat: true, armsOverride: TRAY, tremble: 1 }, f); holdW(CK1, tray, [-0.12, 0.02, 0]); trayBowl.position.set(tray.position.x, tray.position.y + 0.015, tray.position.z);
      P(CK2, { pos: b, yaw: -0.25, expr: v > 0.5 ? 'scared' : 'worried', armsOverride: v > 0.5 ? PRAY : null, arms: 'shrug', look: v > 0.5 ? [0, 0.35] : [-0.4, 0] }, f);
      if (v < 0.5) K.move(K.frame([a, b], { yaw: 0.1, h: 2.4, lookY: 1.6, pitch: 0.0, push: 0.95 }), K.frame([a, b], { yaw: 0.0, h: 2.4, lookY: 1.6, pitch: 0.0, push: 0.88 }), v / 0.5, 0.4, f);
      else K.move(K.frame([b], { yaw: -0.3, h: 2.7, lookY: 1.5, pitch: 0.06, push: 0.85 }), K.frame([b], { yaw: -0.2, h: 2.6, lookY: 1.5, pitch: 0.06, push: 0.78 }), (v - 0.5) / 0.5, 0.3, f);
      K.focusOn(v < 0.5 ? add(KIT, [1.1, 1.6, -1.2]) : add(b, [0, 1.7, 0])); break; }
    case 14: { // that same night the king felt very ill: in bed, sweating; doctor with candle light
      K.preset('candle', { exposure: 1.25 }); const kp = add(BED, [0, 0.82, -1.0]);
      P(KG, { pos: kp, yaw: 0, fall: 1, expr: 'scared', sweat: true, tremble: 1.5 }, f);
      P(DR, { pos: add(BED, [-1.35, 0, -1.6]), yaw: 1.1, expr: 'worried', arms: 'think', look: [0, -0.3] }, f);
      K.move({ p: add(BED, [0.3, 2.7, -1.2]), l: add(BED, [-0.3, 1.0, -2.75]), fov: 50 }, { p: add(BED, [0.2, 2.55, -1.5]), l: add(BED, [-0.3, 1.0, -2.75]), fov: 48 }, u(14), 0.4, f); K.focusOn(add(BED, [0, 1.0, -2.6])); break; }
    case 15: { // and soon after... he died: candle goes out next to his crown and an empty bowl
      K.preset('candle', { exposure: 1.2 }); const v = u(15); const c = add(BED, [1.6, 0.7, -2.6]);
      crownProp.position.set(c[0] - 0.12, c[1] + 0.02, c[2] + 0.12); crownProp.rotation.set(0, 0.5, 0.25); SG.bowlBed.position.set(c[0] + 0.15, c[1], c[2] + 0.1);
      const out = v > 0.55; flameBed.visible = !out; if (!out) flameBed.scale.multiplyScalar(1 - v * 0.9); SG.bedLight.intensity = out ? 0.6 : 6 * (1 - v);
      if (out) smoke.forEach((s, i) => { const q = ((v - 0.55) * 2 + i / 6) % 1; s.position.set(c[0] + Math.sin(q * 6 + i) * 0.04, c[1] + 0.4 + q * 0.6, c[2]); s.material.opacity = 0.4 * (1 - q); s.scale.setScalar(0.6 + q * 1.5); });
      if (v > 0.85) K.grade.black.value = (v - 0.85) / 0.15 * 0.6;
      K.move({ p: add(c, [-0.9, 0.7, 1.5]), l: add(c, [0, 0.25, 0]), fov: 40 }, { p: add(c, [-0.7, 0.6, 1.2]), l: add(c, [0, 0.25, 0]), fov: 40 }, v, 0.2, f); K.focusOn(add(c, [0, 0.2, 0])); break; }
    case 16: { // how many desserts? FOURTEEN: empty throne, crown on the seat, tower of 14 bowls, sign
      K.preset('interior', { exposure: 1.0 }); const v = u(16); const n = v < 0.5 ? Math.min(14, 1 + Math.floor(v / 0.5 * 13)) : 14; stack(n);
      crownProp.position.set(...add(HALL, [0, 0.99, -0.4])); crownProp.rotation.set(0, 0.3, 0);
      P(C1, { pos: add(HALL, [-1.7, 0, -1.2]), yaw: 0.35, sit: 1, expr: 'sad', look: [0.4, -0.2] }, f); P(C2, { pos: add(HALL, [1.7, 0, -1.2]), yaw: -0.35, sit: 1, expr: 'sad', look: [-0.4, -0.2] }, f);
      if (v >= 0.55) { SG.n14.visible = true; if (v < 0.6) K.grade.flash.value = 0.4; }
      K.move({ p: add(HALL, [0.9, 1.9, 3.4]), l: add(HALL, [-0.1, 1.95, -1.5]), fov: 50 }, { p: add(HALL, [0.6, 1.9, 2.9]), l: add(HALL, [-0.1, 2.05, -1.5]), fov: 50 }, v, 0.3, f); K.focusOn(add(HALL, [0.78, 1.5, -0.2])); break; }
    case 17: { // in Sweden he is remembered as the king who ate himself to death: kids at his portrait
      SG.plq.visible = true; const kp = [add(GAL, [-0.9, 0, -1.2]), add(GAL, [0, 0, -1.0]), add(GAL, [0.9, 0, -1.2])];
      KIDS.forEach((C, i) => P(C, { pos: kp[i], yaw: Math.PI + (i - 1) * 0.3, scale: 0.72, expr: i === 1 ? 'shock' : 'laugh', arms: i === 1 ? 'point' : 'down', look: [0, 0.4] }, f));
      P(TCH, { pos: add(GAL, [-2.0, 0, -1.6]), yaw: 2.6, expr: 'neutral', arms: 'point', talk: 0.6 }, f);
      K.move({ p: add(GAL, [0.4, 1.7, 3.6]), l: add(GAL, [0, 2.9, -3.8]), fov: 50 }, { p: add(GAL, [0.1, 1.8, 2.8]), l: add(GAL, [0, 3.1, -3.8]), fov: 50 }, u(17), 0.4, f); K.focusOn(add(GAL, [0, 2.6, -3.8])); break; }
    default: { // nobody plans their end -> loop to the hook framing
      hook(f, t, 13);
      K.move(K.frame([k, add(HALL, [-0.85, 0, -0.95]), add(HALL, [0.8, 0, -0.2])], { yaw: -0.04, pitch: 0.16, h: 1.9, lookY: 1.7, push: 0.75, pad: 1.05 }), K.frame([k, add(HALL, [-0.85, 0, -0.95]), add(HALL, [0.8, 0, -0.2])], { yaw: -0.12, pitch: 0.18, h: 2.0, lookY: 1.7, push: 0.82, pad: 1.05 }), u(18), 0.6, f); K.focusOn(add(k, [0.3, 1.4, 0.3]));
    }
  }
}
