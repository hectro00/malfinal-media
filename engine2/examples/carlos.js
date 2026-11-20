// VID-031 — Charles VIII of France (1470–1498). Amboise, 7 Apr 1498: on the way with Queen Anne to watch a game of jeu de paume in the castle moat,
// he struck his forehead on the lintel of a low door in an old gallery; seemed fine, watched the game, collapsed hours later and died that night (Commynes; Britannica).
// No gore: the hit is a comic bonk + dust; the death is implied (he falls, the crown rolls and stops).
export let FRAMES = 2200;
const DAYSKY = 'kloofendal_48d_partly_cloudy_puresky_2k', GOLDSKY = 'belfast_sunset_puresky_2k';
let K, T, KG, AN, G1, G2, SV1, SV2, P1, P2, SG = {}, crown, ball, puffs = [], smoke = [], soldiers = [], cannons = [], horse, fans = [], dents;
const GAL = [0, 0, 0], COURT = [200, 0, 0], CAST = [400, 0, 0], ALPS = [600, 0, 0], NAP = [640, 0, 0];
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
const KS = 0.85; // the king is short
const DOORX = 0, LINTEL = 1.75;
let seed = 9; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const V3 = () => new K.THREE.Vector3();
const headW = (C) => { C.root.updateMatrixWorld(true); const v = V3(); C.head.getWorldPosition(v); return [v.x, v.y, v.z]; };
const fleur = () => K.tex(256, 384, (c, w, h) => { c.fillStyle = '#1e3a8a'; c.fillRect(0, 0, w, h); c.fillStyle = '#f2c230';
  for (const [x, y] of [[64, 80], [192, 80], [128, 190], [64, 300], [192, 300]]) { c.beginPath(); c.ellipse(x, y - 14, 12, 26, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(x - 18, y, 9, 18, -0.7, 0, 7); c.fill(); c.beginPath(); c.ellipse(x + 18, y, 9, 18, 0.7, 0, 7); c.fill(); c.fillRect(x - 16, y + 8, 32, 7); } });
function soldier(pos, col) { const g = new K.THREE.Group(); K.cyl(0.2, 0.26, 0.75, col, [0, 0.6, 0], { parent: g }); K.sph(0.26, 0xf0dcc0, [0, 1.2, 0], { parent: g });
  K.cyl(0.04, 0.3, 0.22, 0x9aa0a8, [0, 1.46, 0], { parent: g, metalness: 0.8, roughness: 0.3 }); K.box(0.04, 2.6, 0.04, 0x5a3a1a, [0.32, 1.3, 0], { parent: g }); K.cyl(0.0, 0.07, 0.25, 0xc8c8d0, [0.32, 2.7, 0], { parent: g, metalness: 0.8 });
  g.position.set(...pos); K.scene.add(g); soldiers.push({ g, base: pos.slice(), ph: rnd() * 6 }); }
function cannon(pos, rotY) { const g = new K.THREE.Group(); const b = K.cyl(0.16, 0.22, 1.6, 0x2a2a2e, [0, 0.75, 0.2], { parent: g, metalness: 0.7, roughness: 0.35 }); b.rotation.x = Math.PI / 2 - 0.25;
  for (const s of [-1, 1]) { const w = new K.THREE.Mesh(new K.THREE.TorusGeometry(0.4, 0.07, 8, 20), K.std(0x5a3a1a)); w.position.set(s * 0.35, 0.42, 0); w.rotation.y = Math.PI / 2; g.add(w); }
  K.box(0.5, 0.25, 1.2, 0x6a4a2a, [0, 0.45, -0.1], { parent: g }); g.position.set(...pos); g.rotation.y = rotY; K.scene.add(g); cannons.push({ g, b, base: pos.slice() }); return g; }
function fan(pos, col, a) { const g = new K.THREE.Group(); K.cyl(0.24, 0.3, 0.7, col, [0, 0.55, 0], { parent: g }); K.sph(0.3, 0xf0dcc0, [0, 1.2, 0], { parent: g }); g.position.set(...pos); g.rotation.y = a; K.scene.add(g); fans.push({ g, base: pos.slice(), ph: rnd() * 6 }); }
function cheer(t, a = 1) { fans.forEach(fa => { fa.g.position.y = fa.base[1] + Math.abs(Math.sin(t * 8 + fa.ph)) * 0.2 * a; }); }
function march(t, sp = 1) { soldiers.forEach(s => { s.g.position.x = s.base[0] + ((t * 1.2 * sp) % 6); s.g.position.y = s.base[1] + Math.abs(Math.sin(t * 6 + s.ph)) * 0.06; }); }
function banner(pos, h = 3.2, rotY = 0) { const g = new K.THREE.Group(); K.cyl(0.04, 0.04, h, 0x5a3a1a, [0, h / 2, 0], { parent: g }); const fl = K.plane(1.0, 1.4, K.std(0xffffff, { map: fleur(), side: K.THREE.DoubleSide }), [0.52, h - 0.75, 0], [0, 0, 0]); fl.removeFromParent(); g.add(fl);
  g.position.set(...pos); g.rotation.y = rotY; K.scene.add(g); return { g, fl }; }
let banners = [];

export async function build(k) {
  K = k; await K.preloadEnvs(); await K.preloadSkies([DAYSKY, GOLDSKY]); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  KG = C(K.scene, { shirt: 0x1e3a8a, buttons: 0xf2c230, belt: 0xf2c230, cape: 0x1e3a8a, hair: 0x6a4a2a, seed: 71 });
  AN = C(K.scene, { shirt: 0x8a1a3a, belt: 0xf2c230, hair: 0x3a2414, hat: 'crown', hatColor: 0xf2c230, seed: 72 });
  K.cyl(0.2, 0.46, 0.62, 0x8a1a3a, [0, -0.22, 0], { parent: AN.hips, roughness: 0.6, seg: 24 });
  G1 = C(K.scene, { shirt: 0x9aa0a8, belt: 0x5a3a1a, hat: 'helmet', hatColor: 0x9aa0a8, seed: 73 }); G2 = C(K.scene, { shirt: 0x9aa0a8, belt: 0x5a3a1a, hat: 'helmet', hatColor: 0x9aa0a8, mustache: true, seed: 74 });
  SV1 = C(K.scene, { shirt: 0x6a4a2a, apron: 0xf2ead8, hair: 0x3a2414, seed: 75 }); SV2 = C(K.scene, { shirt: 0x2a5a3a, hat: 'cap', hatColor: 0x2a1a10, seed: 76 });
  P1 = C(K.scene, { shirt: 0xf2ead8, belt: 0x1e3a8a, hair: 0x2a1a10, seed: 77 }); P2 = C(K.scene, { shirt: 0xf2ead8, belt: 0xc8202a, hair: 0xd8b060, seed: 78 });
  crown = new K.THREE.Group(); const cm = await K.placeH('rpg_items_pack/Crown', [0, 0, 0], 0, 0.3).catch(() => null);
  if (cm) { cm.parent && cm.parent.remove(cm); crown.add(cm); } else K.cyl(0.2, 0.18, 0.2, 0xf2c230, [0, 0.1, 0], { parent: crown, metalness: 0.8 }); K.scene.add(crown);
  ball = K.sph(0.2, 0xf2ead8, [0, -99, 0], { roughness: 0.7 });
  for (let i = 0; i < 6; i++) puffs.push(K.sph(0.12, 0xd8c8a8, [0, -99, 0], { transparent: true, opacity: 0.18, roughness: 1 }));
  for (let i = 0; i < 6; i++) smoke.push(K.sph(0.5, 0xe8e8e8, [0, -99, 0], { transparent: true, opacity: 0.2, roughness: 1 }));

  // ---------------- GALLERY: old dark stone gallery, torches, cobwebs, rubble, the LOW DOOR in a cross wall at x=0 ----------------
  const stone = K.pbr('medieval_blocks_03', [4, 2], { tint: 0xa89880 });
  K.plane(30, 8, K.pbr('stone_tiles_02', [8, 2], { tint: 0x8a7a68 }), add(GAL, [0, 0.01, 0]));
  K.plane(30, 5, stone, add(GAL, [0, 2.5, -1.8]), [0, 0, 0]);
  K.box(0.3, 5, 1.2, 0xffffff, add(GAL, [DOORX, 2.5, -1.2]), { map: stone.map });
  K.box(0.3, 5 - LINTEL, 1.2, 0xffffff, add(GAL, [DOORX, LINTEL + (5 - LINTEL) / 2, 0.0]), { map: stone.map });
  K.box(0.4, 0.22, 1.25, 0x5a3a1a, add(GAL, [DOORX, LINTEL + 0.11, 0]), { map: K.pbr('dark_wood', [2, 1]).map });
  dents = K.sph(0.09, 0x3a2a1a, add(GAL, [DOORX - 0.33, LINTEL + 0.07, 0.0])); dents.scale.set(0.3, 0.6, 1.2);
  for (let i = 0; i < 6; i++) K.box(0.25, 0.25, 3.6, 0x4a2a14, add(GAL, [-8 + i * 3.2, 4.4, 0]), { map: K.pbr('dark_wood', [1, 2]).map });
  for (const x of [-4.5, 3.8]) { await K.placeH('survival_pack/WoodenTorch_Fire', add(GAL, [x, 1.6, -1.65]), 0, 0.9).catch(() => {}); K.pointLight(0xffa040, 5, add(GAL, [x, 2.4, -1.2]), 7); }
  for (let i = 0; i < 8; i++) K.sph(0.12 + rnd() * 0.12, 0x7a6a58, add(GAL, [-6 + rnd() * 12, 0.08, -1.5 + rnd() * 0.5]), { roughness: 1 });
  await K.placeH('medieval_village_pack/Barrel', add(GAL, [-2.6, 0, -1.35]), 0, 0.9).catch(() => {}); await K.placeH('medieval_village_pack/Crate', add(GAL, [2.0, 0, -1.4]), 0.4, 0.6).catch(() => {});
  const web = K.tex(256, 256, (c, w, h) => { c.strokeStyle = 'rgba(240,240,240,0.8)'; c.lineWidth = 2; for (let a = 0; a < 6; a++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a * 0.28) * w, Math.sin(a * 0.28) * h); c.stroke(); } for (let r = 40; r < 256; r += 40) { c.beginPath(); c.arc(0, 0, r, 0, Math.PI / 2); c.stroke(); } });
  K.plane(1.2, 1.2, K.std(0xffffff, { map: web, transparent: true, side: K.THREE.DoubleSide }), add(GAL, [DOORX - 0.3, 4.2, -1.75]), [0, 0, 0]);
  K.ray(add(GAL, [-2, 2.6, -1.0]), [0, 0, 0.35], 1.0, 5, 0xfff0c0, 0.12); K.pointLight(0xffd8a0, 3, add(GAL, [-1.2, 3.2, 1.4]), 8); K.pointLight(0xffc080, 3, add(GAL, [1.5, 3.2, 1.4]), 8);
  SG.baja = K.sign('PUERTA BAJA', add(GAL, [DOORX - 0.3, 3.1, 0]), { w: 1.9, h: 0.6, bg: '#c8202a', border: '#f2c230', rotY: -Math.PI / 2 });
  SG.atajo = K.sign('ATAJO', add(GAL, [-3.2, 3.0, -1.75]), { w: 1.6, h: 0.6, bg: '#2a1a10', border: '#f2c230' });
  SG.q = K.sign('¿TE HABRÍAS AGACHADO?', add(GAL, [-2.0, 3.4, -1.74]), { w: 4.6, h: 0.9, bg: '#c8202a', border: '#ffe9a8' });

  // ---------------- COURT: jeu de paume court in the castle moat — sloped penthouse roof, net, spectators' gallery ----------------
  K.plane(40, 24, K.pbr('stone_tiles_02', [10, 6], { tint: 0xd8c8a8 }), add(COURT, [0, 0.01, 0]));
  const brick = K.pbr('castle_brick_02_red', [6, 2], { tint: 0xd8b8a0 });
  K.plane(30, 9, brick, add(COURT, [0, 4.5, -5]), [0, 0, 0]); K.plane(14, 9, brick, add(COURT, [-10, 4.5, 2]), [0, Math.PI / 2, 0]); K.plane(14, 9, brick, add(COURT, [10, 4.5, 2]), [0, -Math.PI / 2, 0]);
  const roof = K.box(20, 0.15, 2.2, 0xffffff, add(COURT, [0, 3.0, -4.0]), { map: K.pbr('roof_slates_03', [6, 1]).map }); roof.rotation.x = 0.45;
  for (let i = 0; i < 7; i++) K.cyl(0.08, 0.08, 2.6, 0x4a2a14, add(COURT, [-9 + i * 3, 1.3, -3.1]));
  K.cyl(0.015, 0.015, 7, 0xd8d0c0, add(COURT, [0, 1.05, -0.5])).rotation.x = Math.PI / 2;
  for (let i = 0; i < 28; i++) K.box(0.03, 0.4, 0.03, 0xe8e0d0, add(COURT, [0, 0.85, -3.9 + i * 0.25]));
  K.box(0.12, 1.1, 0.12, 0x4a2a14, add(COURT, [0, 0.55, -4.0])); K.box(0.12, 1.1, 0.12, 0x4a2a14, add(COURT, [0, 0.55, 3.0]));
  K.box(6, 0.5, 1.4, 0x6a4a2a, add(COURT, [6.5, 0.25, 4.3]), { map: K.pbr('wood_table_001', [3, 1]).map }); K.box(6, 0.12, 0.08, 0x4a2a14, add(COURT, [6.5, 0.55, 3.55]));
  for (let i = 0; i < 3; i++) banners.push(banner(add(COURT, [-6 + i * 6, 0, -4.9]), 4.2));
  for (let i = 0; i < 6; i++) fan(add(COURT, [3.6 + i * 0.6 + (i > 2 ? 2.2 : 0), 0.3, 4.9]), [0x1e3a8a, 0xc8202a, 0x2a6a3a, 0xd8a830, 0x6a2a6a, 0xf2ead8][i], Math.PI);
  K.pointLight(0xffe0b0, 3, add(COURT, [0, 4, 2]), 14);
  SG.paume = K.sign('JEU DE PAUME', add(COURT, [0, 6.4, -4.95]), { w: 4.2, h: 1.0, bg: '#1e3a8a', border: '#f2c230' });
  SG.tenis = K.sign('ABUELO DEL TENIS', add(COURT, [0, 6.4, -4.93]), { w: 4.6, h: 1.0, bg: '#c8202a', border: '#f2c230' });
  SG.abril = K.sign('ABRIL · 1498', add(COURT, [-5.5, 6.0, -4.92]), { w: 3.4, h: 1.0, bg: '#2a1a10', border: '#f2c230' });

  // ---------------- CASTLE: Amboise above the Loire — towers, slate cones, river, cheering crowd ----------------
  K.plane(400, 400, K.std(0x3a6a9a, { roughness: 0.15, metalness: 0.3 }), add(CAST, [0, -0.2, 6]));
  K.plane(80, 30, K.pbr('aerial_grass_rock', [20, 8], { tint: 0x9ab070 }), add(CAST, [0, 0.02, -8]));
  const cstone = K.pbr('medieval_blocks_03', [6, 3], { tint: 0xe8dcc8 });
  K.box(16, 6, 5, 0xffffff, add(CAST, [0, 3, -12]), { map: cstone.map }); K.box(8, 4, 4, 0xffffff, add(CAST, [10, 2, -10]), { map: cstone.map });
  for (const [x, z, r, h] of [[-8, -10, 2.0, 9], [8, -10, 1.6, 8], [14.5, -9, 1.4, 6.5], [0, -14.5, 1.3, 10]]) { K.cyl(r, r, h, 0xffffff, add(CAST, [x, h / 2, z]), { map: cstone.map }); K.cyl(0, r * 1.15, r * 1.6, 0xffffff, add(CAST, [x, h + r * 0.8, z]), { map: K.pbr('roof_slates_03', [2, 2]).map, seg: 20 }); }
  const roof2 = K.box(16.4, 0.2, 5.4, 0xffffff, add(CAST, [0, 6.8, -12]), { map: K.pbr('roof_slates_03', [6, 2]).map }); roof2.rotation.x = 0.0;
  for (let i = 0; i < 8; i++) K.box(0.8, 1.2, 0.08, 0x2a3a5a, add(CAST, [-6.5 + i * 1.9, 3.6, -9.46]), { emissive: 0xffc070, emissiveIntensity: 0.25 });
  K.box(40, 0.8, 1.2, 0xffffff, add(CAST, [0, 0.4, -4.0]), { map: cstone.map });
  for (let i = 0; i < 4; i++) banners.push(banner(add(CAST, [-9 + i * 6, 0.8, -4.0]), 3.4));
  for (let r = 0; r < 2; r++) for (let i = 0; i < 12; i++) fan(add(CAST, [-6.5 + i * 1.15 + r * 0.5, 0, -1.6 + r * 1.1]), [0x1e3a8a, 0xc8202a, 0xd8a830, 0x2a6a3a, 0x6a2a6a, 0xf2ead8][(i + r) % 6], Math.PI);
  for (let i = 0; i < 6; i++) await K.placeH('nature_pack/CommonTree_' + ((i % 5) + 1), add(CAST, [-24 + i * 9, 0, -7 - (i % 2) * 3]), i, 6).catch(() => {});
  SG.amb = K.sign('AMBOISE · FRANCIA', add(CAST, [-4, 2.6, -3.3]), { w: 4.0, h: 0.9, bg: '#1e3a8a', border: '#f2c230', posts: true });
  SG.heroe = K.sign('¡VIVA EL REY!', add(CAST, [4, 2.6, -3.3]), { w: 3.4, h: 0.9, bg: '#c8202a', border: '#f2c230', posts: true });
  SG.carlos = K.sign('CARLOS VIII · 27 AÑOS', add(CAST, [0, 5.2, -9.4]), { w: 5.2, h: 1.0, bg: '#1e3a8a', border: '#f2c230' });
  SG.bajito = K.sign('BASTANTE BAJITO', add(CAST, [0, 5.2, -9.38]), { w: 4.6, h: 1.0, bg: '#c8202a', border: '#ffffff' });

  // ---------------- ALPS: snowy pass, the army marching, cannons, banners · NAPLES gate further on ----------------
  K.plane(160, 120, K.std(0xf4f6fb, { roughness: 0.75 }), add(ALPS, [0, 0.01, 0]));
  for (const [x, z, r, h] of [[-20, -40, 16, 30], [5, -50, 20, 38], [28, -42, 14, 26], [-40, -30, 12, 20], [45, -30, 10, 18]]) { K.cyl(0, r, h, 0x8a8c96, add(ALPS, [x, h / 2 - 1, z]), { roughness: 0.9, seg: 7 }); K.cyl(0, r * 0.4, h * 0.4, 0xfafcff, add(ALPS, [x, h - 1 - h * 0.2 + 0.05, z]), { seg: 7, roughness: 0.6 }); }
  for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) soldier(add(ALPS, [-14 + i * 1.5 + (r % 2) * 0.7, 0, -3.5 - r * 1.3]), [0x1e3a8a, 0x9aa0a8, 0xc8202a][r]);
  for (let i = 0; i < 4; i++) banners.push(banner(add(ALPS, [-12 + i * 4, 0, -2.4]), 3.6));
  for (let i = 0; i < 3; i++) cannon(add(ALPS, [3 + i * 3.2, 0, 0.6]), -0.3);
  horse = await K.placeH('animals_pack/Horse_White', add(ALPS, [0, 0, 2.0]), Math.PI / 2, 1.8).catch(() => null);
  for (let i = 0; i < 5; i++) await K.placeH('nature_pack/Rock_' + ((i % 5) + 1), add(ALPS, [-18 + i * 9, 0, 5 + (i % 2) * 2]), i, 1.0, { tint: 0x9a9ca8 }).catch(() => {});
  SG.alpes = K.sign('LOS ALPES', add(ALPS, [-6, 3.0, -1.2]), { w: 3.0, h: 0.9, bg: '#2a1a10', border: '#f2c230', posts: true });
  SG.mil = K.sign('25.000 SOLDADOS', add(ALPS, [-1, 3.0, -1.2]), { w: 4.0, h: 0.9, bg: '#1e3a8a', border: '#f2c230', posts: true });
  // Naples: sandstone gate + walls, palms, cheering people
  const sand = K.pbr('sandstone_blocks_05', [4, 2], { tint: 0xf0d8b0 });
  K.box(6, 6, 2, 0xffffff, add(NAP, [-5.5, 3, -4]), { map: sand.map }); K.box(6, 6, 2, 0xffffff, add(NAP, [5.5, 3, -4]), { map: sand.map }); K.box(5, 2.2, 2, 0xffffff, add(NAP, [0, 4.9, -4]), { map: sand.map });
  K.plane(30, 20, K.pbr('cobblestone_floor_04', [8, 6], { tint: 0xd8c8a8 }), add(NAP, [0, 0.03, 0]));
  for (let i = 0; i < 4; i++) await K.placeH('nature_pack/PalmTree_' + (1 + i % 4), add(NAP, [-10 + i * 6.5 + (i > 1 ? 1 : 0), 0, -6.5]), i, 7).catch(() => {});
  SG.nap = K.sign('NÁPOLES · 1495', add(NAP, [0, 6.6, -2.95]), { w: 4.0, h: 1.0, bg: '#c8202a', border: '#f2c230' });
}

function hideAll() {
  for (const c of [KG, AN, G1, G2, SV1, SV2, P1, P2]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.hold(null); c.neck.rotation.set(0, 0, 0); }
  for (const g of Object.values(SG)) g.visible = false;
  crown.position.set(0, -99, 0); crown.rotation.set(0, 0, 0); ball.position.set(0, -99, 0);
  puffs.forEach(p => { p.position.set(0, -99, 0); p.scale.setScalar(1); }); smoke.forEach(p => { p.position.set(0, -99, 0); p.scale.setScalar(1); });
  for (const fa of fans) fa.g.position.set(...fa.base); for (const s of soldiers) s.g.position.set(...s.base);
  for (const c of cannons) { c.g.position.set(...c.base); }
  if (horse) horse.position.set(...add(ALPS, [0, 0, 2.0]));
  banners.forEach((b, i) => { b.fl.rotation.y = 0; });
}
function wave(t) { banners.forEach((b, i) => { b.fl.rotation.y = Math.sin(t * 3 + i) * 0.25; }); }
function crownOn(C, f, tilt = 0) { const h = headW(C); const s = C.root.scale.x; crown.position.set(h[0], h[1] + 0.34 * 1.42 * s, h[2]); crown.rotation.set(0, C.root.rotation.y, tilt); crown.scale.setScalar(s); }
function dust(c, t0, t) { const d = t - t0; if (d < 0 || d > 1.6) return; puffs.forEach((p, i) => { const a = i * 0.63; const r = 0.15 + d * 0.55; p.position.set(c[0] - 0.1 - d * 0.2, c[1] + Math.sin(a) * r * 0.6 + d * 0.15, c[2] + Math.cos(a) * r); p.scale.setScalar(0.4 + d * 0.8); p.material.opacity = 0.2 * (1 - d / 1.6); }); }
function boom(c, t0, t) { const d = t - t0; if (d < 0 || d > 2.2) return; smoke.forEach((p, i) => { p.position.set(c[0] + Math.sin(i * 1.7) * (0.3 + d * 0.6), c[1] + d * 0.5 + i * 0.12, c[2] + 0.6 + d * 0.8 + Math.cos(i * 2.1) * 0.3); p.scale.setScalar(0.5 + d * 0.9); p.material.opacity = 0.35 * (1 - d / 2.2); }); }
// the king walking +x into the low door: returns head world pos. hitT = time of impact (s, phrase-local)
function bonk(f, lt, hitT, o = {}) {
  const x0 = DOORX - 0.62 - hitT * 1.15; let x, expr = 'happy', arms = 'down', walk = lt * 1.7, lean = 0, tilt = 0;
  if (lt < hitT) { x = x0 + lt * 1.15; expr = o.pre || 'smug'; }
  else { const d = lt - hitT; x = DOORX - 0.62 - Math.min(0.5, d * 1.6) * (1 - Math.min(1, d) * 0.3); walk = 0; lean = -Math.min(0.35, d * 2) + (d > 0.4 ? Math.min(0.35, (d - 0.4)) : 0); expr = d < 0.9 ? 'shock' : (o.post || 'tired'); arms = d < 0.25 ? 'flail' : 'think'; }
  P(KG, { pos: add(GAL, [x, 0, 0]), yaw: Math.PI / 2 - 0.55, walk, lean, arms, expr, scale: KS, tremble: lt > hitT && lt < hitT + 0.6 ? 2 : 0 }, f);
  const h = headW(KG);
  if (lt < hitT) crownOn(KG, f); else { const d = lt - hitT; const y = h[1] + 0.48 + d * 3.2 - 4.9 * d * d; const fy = 0.06; crown.position.set(h[0] - d * 0.9, Math.max(fy, y), h[2] + d * 0.5); crown.rotation.set(d * 9, d * 4, d * 7); if (y <= fy) crown.rotation.set(Math.PI / 2 - 0.2, 0, 0.3); crown.scale.setScalar(KS); }
  dust([DOORX - 0.3, LINTEL, 0], hitT, lt); return h;
}
function galCam(f, v, near = 1) { const c = add(GAL, [DOORX - 0.9, 1.35, 0]); K.move({ p: add(c, [-0.2, 0.2, 4.4 * near]), l: add(c, [0.25, 0.05, 0]), fov: 48 }, { p: add(c, [-0.3, 0.15, 4.0 * near]), l: add(c, [0.25, 0.1, 0]), fov: 46 }, v, 0.3, f); K.focusOn(add(c, [0.3, 0.2, 0])); }
function hookShot(f, lt, v, end) { K.preset('interior', { exposure: 1.25 }); K.grade.vig.value = 0.6; bonk(f, lt, 0.35); P(AN, { pos: add(GAL, [-2.4 + Math.min(lt, 1) * 0.6, 0, 0.35]), yaw: Math.PI / 2, walk: lt < 1 ? lt * 1.6 : 0, arms: lt > 0.5 ? 'up' : 'down', expr: lt > 0.5 ? 'shock' : 'happy' }, f);
  if (lt > 0.35 && lt < 0.45) K.grade.flash.value = 0.5; galCam(f, v); }

export function frame(f, k) {
  hideAll(); const ph = K.at(f), t = f / 30, u = (i) => K.u(f, i); const lt = (i) => (f - (K.ph[i].a - 4)) / 30;
  K.preset('interior', { exposure: 1.25 }); wave(t);
  if (f < 10) K.grade.whip.value = 0;
  switch (ph) {
    case 0: { hookShot(f, lt(0), u(0)); break; }
    case 1: { // didn't even hurt at first: close on the king rubbing his forehead and laughing, queen beside him relieved
      const v = u(1); K.grade.vig.value = 0.6; const kp = add(GAL, [DOORX - 1.3, 0, 0.1]), ap = add(GAL, [DOORX - 2.2, 0, 0.5]);
      P(KG, { pos: kp, yaw: Math.PI / 2 + 0.9, arms: v < 0.5 ? 'think' : 'shrug', expr: 'laugh', talk: 1, scale: KS }, f); crownOn(KG, f, 0.25);
      P(AN, { pos: ap, yaw: Math.PI / 2 + 0.5, arms: 'akimbo', expr: 'worried' }, f);
      K.move(K.frame([kp, ap], { yaw: 0.35, h: 2.2, lookY: 1.3, pitch: -0.02, push: 0.9 }), K.frame([kp, ap], { yaw: 0.25, h: 2.2, lookY: 1.35, pitch: -0.03, push: 0.8 }), v, 0.3, f); K.focusOn(add(kp, [0, 1.5, 0])); break; }
    case 2: { // Charles VIII, 27, rather short: on the castle terrace between two TALL guards, standing on tiptoe
      K.preset('day', { exposure: 1.0, photo: DAYSKY, sunDir: [0.25, 1.0, 0.4] }); const v = u(2); SG.carlos.visible = v < 0.5; SG.bajito.visible = v >= 0.5;
      const kp = add(CAST, [0, Math.max(0, Math.sin(t * 6)) * 0.1, -7.4]); P(KG, { pos: kp, yaw: 0, arms: v < 0.5 ? 'akimbo' : 'up', expr: v < 0.5 ? 'proud' : 'smug', scale: KS }, f); crownOn(KG, f);
      P(G1, { pos: add(CAST, [-1.1, 0, -7.6]), yaw: 0.15, arms: 'cross', expr: 'neutral', scale: 1.18 }, f); P(G2, { pos: add(CAST, [1.1, 0, -7.6]), yaw: -0.15, arms: 'cross', expr: 'neutral', scale: 1.18 }, f);
      if (v >= 0.5) { G1.neck.rotation.set(0.35, -0.5, 0); G2.neck.rotation.set(0.35, 0.5, 0); }
      K.move({ p: add(CAST, [0, 1.7, -1.0]), l: add(CAST, [0, 2.2, -7.5]), fov: 50 }, { p: add(CAST, [0, 1.6, -1.6]), l: add(CAST, [0, 2.3, -7.5]), fov: 48 }, v, 0.3, f); K.focusOn(add(CAST, [0, 1.8, -7.4])); break; }
    case 3: { // crossed the Alps with 25,000 soldiers → entered Naples as a conqueror
      K.preset('day', { exposure: 1.0, photo: DAYSKY, sunDir: [0.25, 1.0, 0.4] }); const v = u(3);
      if (v < 0.55) { SG.alpes.visible = true; SG.mil.visible = v > 0.25; march(t); const hx = -6 + v * 4; if (horse) horse.position.set(...add(ALPS, [hx, 0, 1.2]));
        P(KG, { pos: add(ALPS, [hx, 0.82, 1.2]), yaw: Math.PI / 2, sit: true, arms: 'point', expr: 'proud', scale: KS }, f); crownOn(KG, f);
        K.move({ p: add(ALPS, [hx - 3, 1.1, 7.5]), l: add(ALPS, [hx + 1.5, 1.9, -1]), fov: 52 }, { p: add(ALPS, [hx - 1.5, 1.2, 7.0]), l: add(ALPS, [hx + 2.5, 2.0, -1]), fov: 52 }, v / 0.55, 0.3, f); K.focusOn(add(ALPS, [hx, 1.8, 1.2])); }
      else { const w = (v - 0.55) / 0.45; SG.nap.visible = true; cheer(t); const hx = -3 + w * 3; if (horse) horse.position.set(...add(NAP, [0, 0, 2 - w * 3])); if (horse) horse.rotation.y = Math.PI;
        P(KG, { pos: add(NAP, [0, 0.82, 2 - w * 3]), yaw: Math.PI, sit: true, arms: 'wave', expr: 'laugh', scale: KS }, f); crownOn(KG, f);
        K.move({ p: add(NAP, [1.2, 0.9, 5.5]), l: add(NAP, [0, 2.6, -4]), fov: 54 }, { p: add(NAP, [0.8, 0.9, 4.5]), l: add(NAP, [0, 2.8, -4]), fov: 52 }, w, 0.3, f); K.focusOn(add(NAP, [0, 1.8, 1.5 - w * 3])); }
      break; }
    case 4: { // cannons, horses, banners — nobody could stop him: cannons fire in a row, smoke, flash
      K.preset('day', { exposure: 1.0, photo: DAYSKY, sunDir: [0.25, 1.0, 0.4] }); const v = u(4); march(t, 1.5); const lt4 = lt(4);
      cannons.forEach((c, i) => { const tf = 0.3 + i * 0.6; const d = lt4 - tf; if (d > 0 && d < 0.3) c.g.position.z = c.base[2] - Math.sin(d / 0.3 * Math.PI) * 0.4; });
      const ci = Math.min(2, Math.max(0, Math.floor((lt4 - 0.3) / 0.6))); const cc = cannons[ci].base; boom(add(cc, [0, 0.9, 1.0]), 0.3 + ci * 0.6, lt4);
      if (lt4 > 0.3 && (lt4 - 0.3) % 0.6 < 0.07 && lt4 < 2.2) K.grade.flash.value = 0.3;
      K.move({ p: add(ALPS, [1, 0.9, 6.5]), l: add(ALPS, [7, 1.0, 0]), fov: 50 }, { p: add(ALPS, [2.5, 1.0, 5.6]), l: add(ALPS, [7.5, 1.1, 0]), fov: 48 }, v, 0.4, f); K.focusOn(add(ALPS, [6, 1, 0.6])); break; }
    case 5: { // back to his castle on the Loire as a hero: crane over the river, the crowd cheering, the king waving
      K.preset('day', { exposure: 0.95, photo: GOLDSKY, sunDir: [0.25, 1.0, 0.6] }); const v = u(5); SG.amb.visible = SG.heroe.visible = true; cheer(t, 1.2);
      const kp = add(CAST, [0, 0.8, -4.6]); P(KG, { pos: kp, yaw: 0, arms: 'wave', expr: 'laugh', scale: KS }, f); crownOn(KG, f);
      K.move({ p: add(CAST, [-6, 5.5, 9]), l: add(CAST, [0, 2.5, -6]), fov: 52 }, { p: add(CAST, [-2, 2.6, 5.5]), l: add(CAST, [0, 2.0, -5]), fov: 48 }, v, 0.2, f); K.focusOn(add(CAST, [0, 2, -4.6])); break; }
    case 6: { // re-hook: the danger was not in war — slow push into the black mouth of the old gallery door, flash
      const v = u(6); if (v < 0.08) K.grade.flash.value = 0.45; K.grade.sat.value = 0.7; K.grade.vig.value = 0.85; K.preset('interior', { exposure: 1.1 });
      SG.baja.visible = v > 0.4; const c = add(GAL, [DOORX, 1.3, 0]);
      K.move({ p: add(c, [-4.5, 0.4, 0.6]), l: c, fov: 50 }, { p: add(c, [-1.8, 0.3, 0.2]), l: add(c, [0, 0.35, 0]), fov: 42 }, K.ease(v), 0.4, f); K.focusOn(c); break; }
    case 7: { // April 1498: the tennis ball bounces toward the camera across the court
      K.preset('day', { exposure: 1.0, photo: DAYSKY, sunDir: [0.25, 1.0, 0.5] }); const v = u(7); SG.abril.visible = true; const lt7 = lt(7);
      const bx = -4 + lt7 * 2.6, by = 0.07 + Math.abs(Math.sin(lt7 * 4.2)) * 1.2 * Math.exp(-lt7 * 0.25); ball.position.set(...add(COURT, [bx, by, 1.0 + lt7 * 0.4]));
      { const bp = add(COURT, [bx, 0.6, 1.0 + lt7 * 0.4]); K.move({ p: add(bp, [1.6, 0.1, 2.4]), l: add(bp, [0, 0.3, 0]), fov: 48 }, { p: add(bp, [1.4, 0.1, 2.2]), l: add(bp, [0, 0.3, 0]), fov: 46 }, v, 0.3, f); } K.focusOn(add(COURT, [bx, by, 1])); break; }
    case 8: { // jeu de paume: two players smack the ball with their palms over the net
      K.preset('day', { exposure: 1.0, photo: DAYSKY, sunDir: [0.25, 1.0, 0.5] }); const v = u(8); SG.paume.visible = v < 0.5; SG.tenis.visible = v >= 0.5; cheer(t, 0.5); const lt8 = lt(8);
      const per = 1.4, ph8 = (lt8 % per) / per, dir = Math.floor(lt8 / per) % 2; const xa = -1.9, xb = 1.9; const bx = dir ? xb + (xa - xb) * ph8 : xa + (xb - xa) * ph8;
      ball.position.set(...add(COURT, [bx, 1.0 + Math.sin(ph8 * Math.PI) * 1.4, -0.4]));
      const hit = (side) => ({ arms: 'hammer', expr: 'happy' });
      P(P1, { pos: add(COURT, [xa - 0.4, 0, -0.6]), yaw: Math.PI / 2, ...hit(0), bounce: 0.4 }, f); P(P2, { pos: add(COURT, [xb + 0.4, 0, -0.2]), yaw: -Math.PI / 2, ...hit(1), bounce: 0.4 }, f);
      K.move({ p: add(COURT, [-4.4, 1.6, 6.0]), l: add(COURT, [0, 1.3, -0.5]), fov: 50 }, { p: add(COURT, [-5.0, 1.5, 5.4]), l: add(COURT, [0, 1.3, -0.5]), fov: 48 }, v, 0.3, f); K.focusOn(add(COURT, [bx, 1.5, -0.4])); break; }
    case 9: { // he takes Queen Anne to watch: walking arm in arm along the terrace, the king pointing ahead
      K.preset('day', { exposure: 0.95, photo: GOLDSKY, sunDir: [0.25, 1.0, 0.6] }); const v = u(9); const x = -3 + v * 3;
      const kp = add(CAST, [x, 0.8, -4.4]), ap = add(CAST, [x - 0.9, 0.8, -4.7]); P(KG, { pos: kp, yaw: Math.PI / 2, walk: t * 1.5, arms: 'point', expr: 'happy', talk: 1, scale: KS }, f); crownOn(KG, f);
      P(AN, { pos: ap, yaw: Math.PI / 2, walk: t * 1.5 + 0.5, arms: 'down', expr: 'happy' }, f);
      K.move(K.frame([kp, ap], { yaw: 0.5, h: 2.2, lookY: 1.4, pitch: -0.03, push: 0.95 }), K.frame([kp, ap], { yaw: 0.35, h: 2.2, lookY: 1.4, pitch: -0.04, push: 0.85 }), v, 0.3, f); K.focusOn(add(kp, [0, 1.5, 0])); break; }
    case 10: { // shortcut: an old, dark gallery — they walk in by torchlight, cobwebs, rubble
      const v = u(10); SG.atajo.visible = true; const x = -6 + v * 2.4; const kp = add(GAL, [x, 0, 0.1]), ap = add(GAL, [x - 1.0, 0, 0.45]);
      P(KG, { pos: kp, yaw: Math.PI / 2, walk: t * 1.6, arms: 'point', expr: 'smug', scale: KS }, f); crownOn(KG, f); P(AN, { pos: ap, yaw: Math.PI / 2, walk: t * 1.6 + 0.5, arms: 'hold2', expr: 'worried' }, f);
      K.move({ p: add(GAL, [x + 3.2, 1.3, 2.4]), l: add(GAL, [x, 1.4, 0]), fov: 50 }, { p: add(GAL, [x + 2.6, 1.2, 2.0]), l: add(GAL, [x, 1.4, 0]), fov: 48 }, v, 0.3, f); K.focusOn(add(kp, [0, 1.4, 0])); break; }
    case 11: { // re-hook: crash zoom onto the low lintel, flash, sting
      const v = u(11); if (v < 0.1) K.grade.flash.value = 0.5; K.grade.vig.value = 0.85; SG.baja.visible = true; const c = add(GAL, [DOORX - 0.3, LINTEL + 0.3, 0]);
      K.move({ p: add(c, [-3.6, -0.6, 2.4]), l: c, fov: 50 }, { p: add(c, [-1.4, -0.4, 0.7]), l: c, fov: 40 }, K.ease(Math.min(1, v * 1.7)), 0.5, f); K.focusOn(c); break; }
    case 12: { // so low that everyone ducked: a servant and two guards go through bent double, one after another (gag)
      const v = u(12); const lt12 = lt(12); const q = [SV1, G1, SV2];
      q.forEach((c, i) => { const x = DOORX - 3.0 + (lt12 - i * 0.7) * 1.4; const near = Math.abs(x - DOORX) < 1.1; P(c, { pos: add(GAL, [x, 0, 0]), yaw: Math.PI / 2, walk: t * 1.8 + i, lean: near ? 1.15 : 0.1, arms: near ? 'reach' : 'down', expr: near ? 'worried' : 'neutral' }, f); });
      K.move({ p: add(GAL, [DOORX - 0.6, 1.2, 4.4]), l: add(GAL, [DOORX - 0.4, 1.2, 0]), fov: 50 }, { p: add(GAL, [DOORX - 0.5, 1.1, 4.0]), l: add(GAL, [DOORX - 0.4, 1.2, 0]), fov: 48 }, v, 0.3, f); K.focusOn(add(GAL, [DOORX - 0.4, 1.2, 0])); break; }
    case 13: { // the king, short as he was, did NOT duck — BONK: forehead against the stone (the key action, side close-up)
      const v = u(13); const lt13 = lt(13); const hitT = (K.ph[13].b - K.ph[13].a) / 30 * 0.52; bonk(f, lt13, hitT, { pre: 'proud' });
      if (lt13 > hitT && lt13 < hitT + 0.1) K.grade.flash.value = 0.55;
      const c = add(GAL, [DOORX - 0.9, 1.5, 0]); K.move({ p: add(c, [-0.4, 0.1, 3.6]), l: add(c, [0.1, 0.05, 0]), fov: 46 }, { p: add(c, [-0.2, 0.1, 3.2]), l: add(c, [0.2, 0.1, 0]), fov: 44 }, v, lt13 > hitT ? 1.2 : 0.3, f); K.focusOn(add(c, [0.3, 0.2, 0])); break; }
    case 14: { // he laughs, dusts himself off and walks on through (now ducking a little), the queen frowning
      const v = u(14); const x = DOORX - 1.0 + v * 2.4; const near = Math.abs(x - DOORX) < 0.9;
      P(KG, { pos: add(GAL, [x, 0, 0]), yaw: Math.PI / 2, walk: v > 0.3 ? t * 1.6 : 0, lean: near ? 0.6 : 0, arms: v < 0.3 ? 'shrug' : 'wave', expr: 'laugh', talk: 1, scale: KS }, f); crownOn(KG, f, 0.3);
      if (v < 0.3) dust(add(headW(KG), [0, -0.6, 0]), 0, v * 3);
      P(AN, { pos: add(GAL, [DOORX - 1.9, 0, 0.4]), yaw: Math.PI / 2 + 0.3, arms: 'cross', expr: 'angry' }, f);
      K.move({ p: add(GAL, [DOORX + 2.6, 1.2, 2.6]), l: add(GAL, [DOORX - 0.8, 1.3, 0]), fov: 50 }, { p: add(GAL, [DOORX + 2.2, 1.2, 2.2]), l: add(GAL, [DOORX - 0.3, 1.3, 0]), fov: 48 }, v, 0.3, f); K.focusOn(add(GAL, [x, 1.4, 0])); break; }
    case 15: { // he watches the whole game, claps and chats — king and queen on the spectators' bench, ball flying past
      K.preset('day', { exposure: 1.0, photo: DAYSKY, sunDir: [0.25, 1.0, 0.5] }); const v = u(15); cheer(t, 0.8); const lt15 = lt(15);
      const kp = add(COURT, [5.4, 0.48, 4.3]), ap = add(COURT, [6.5, 0.48, 4.3]); P(KG, { pos: kp, yaw: Math.PI, sit: true, arms: v < 0.5 ? 'fists' : 'wave', expr: 'laugh', talk: v > 0.5 ? 1 : 0, scale: KS }, f); crownOn(KG, f);
      P(AN, { pos: ap, yaw: Math.PI - 0.3, sit: true, arms: 'down', expr: 'happy' }, f);
      const per = 1.4, ph15 = (lt15 % per) / per; ball.position.set(...add(COURT, [-3 + ph15 * 6, 1.0 + Math.sin(ph15 * Math.PI) * 1.4, 1.0]));
      K.move({ p: add(COURT, [5.6, 1.7, -0.6]), l: add(COURT, [6.0, 1.3, 4.3]), fov: 50 }, { p: add(COURT, [5.8, 1.6, 0.0]), l: add(COURT, [6.0, 1.3, 4.3]), fov: 48 }, v, 0.3, f); K.focusOn(add(kp, [0.5, 1.2, 0])); break; }
    case 16: { // hours later he collapses and never wakes up: he stands, sways, falls back out of frame — the crown rolls and stops (implied)
      K.preset('day', { exposure: 0.95, photo: DAYSKY, sunDir: [0.25, 1.0, -0.3] }); const v = u(16); K.grade.sat.value = 0.55; K.grade.vig.value = 0.85; const kp = add(COURT, [4.0, 0, 2.6]);
      if (v < 0.45) { const fl = Math.max(0, (v - 0.2) / 0.25); P(KG, { pos: kp, yaw: Math.PI, arms: 'think', expr: 'tired', tremble: 1, fall: Math.min(1, fl), scale: KS }, f); if (fl < 0.1) crownOn(KG, f); else crown.position.set(...add(kp, [0, 0.15, -0.5]));
        K.move({ p: add(kp, [0.4, 1.4, -4.0]), l: add(kp, [0, 1.2, 0]), fov: 48 }, { p: add(kp, [0.4, 1.3, -3.6]), l: add(kp, [0, 1.0, 0]), fov: 46 }, v / 0.45, 0.3, f); K.focusOn(add(kp, [0, 1.2, 0])); }
      else { const w = (v - 0.45) / 0.55; const s = Math.min(1, w * 1.6); const cp = add(kp, [0.8 + s * 1.6, 0.12, -0.6 - s * 0.6]); crown.position.set(...cp); crown.rotation.set(Math.PI / 2 - 0.15 * s, 0, -s * 9);
        K.move({ p: add(cp, [0.6, 0.35, -1.6]), l: cp, fov: 44 }, { p: add(cp, [0.5, 0.3, -1.3]), l: cp, fov: 42 }, w, 0.15, f); K.focusOn(cp); }
      break; }
    case 17: { // the king no wall could stop: wide of the army in the Alps, frozen, desaturated
      K.preset('day', { exposure: 1.0, photo: DAYSKY, sunDir: [0.25, 1.0, 0.4] }); const v = u(17); K.grade.sat.value = 0.5; K.grade.vig.value = 0.7;
      K.move({ p: add(ALPS, [-16, 2.5, 9]), l: add(ALPS, [-4, 2, -3]), fov: 52 }, { p: add(ALPS, [-11, 2.0, 8]), l: add(ALPS, [-2, 2, -3]), fov: 50 }, v, 0.15, f); K.focusOn(add(ALPS, [-4, 1.5, -3])); break; }
    case 18: { // was stopped by a door frame: close on the lintel, a dent, dust drifting, the crown lying under it
      const v = u(18); K.grade.sat.value = 0.7; K.grade.vig.value = 0.85; SG.baja.visible = true; crown.position.set(...add(GAL, [DOORX - 0.8, 0.12, 0.3])); crown.rotation.set(Math.PI / 2 - 0.2, 0, 0.3);
      K.move({ p: add(GAL, [DOORX - 2.6, 0.5, 1.6]), l: add(GAL, [DOORX - 0.3, LINTEL, 0]), fov: 48 }, { p: add(GAL, [DOORX - 2.1, 0.6, 1.2]), l: add(GAL, [DOORX - 0.3, LINTEL - 0.2, 0]), fov: 46 }, v, 0.15, f); K.focusOn(add(GAL, [DOORX - 0.3, LINTEL, 0])); break; }
    default: { const v = u(19); hookShot(f, lt(19), v, true); SG.q.visible = true; }
  }
}
