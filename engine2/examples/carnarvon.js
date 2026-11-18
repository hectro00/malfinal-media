// VID-024 — Lord Carnarvon (1866–1923): financed the Tutankhamun dig; a mosquito bite on his cheek, nicked while shaving, got infected; died in Cairo 5 Apr 1923.
// Legend: Cairo's lights went out at that moment and his dog in England howled and died ("maldición del faraón"). No gore: empty bed + hat, dog lies down.
export let FRAMES = 2200;
const DAYSKY = 'kloofendal_48d_partly_cloudy_puresky_2k', GOLDSKY = 'belfast_sunset_puresky_2k', DUSKSKY = 'qwantani_dusk_2_puresky_2k';
let K, T, CA, CR, W1, W2, NB, SG = {}, mos, bag, candle, razor, foam, coins = [], sand = [], cityWin = [], dog, moonL, hatB, mask, lid, steps = [], pile, paper, bump, therm;
const DIG = [0, 0, 0], TOMB = [200, 0, 0], HOTEL = [400, 0, 0], CITY = [600, 0, 0], MANOR = [800, 0, 0];
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
let _V = null; const _v = () => (_V = _V || new K.THREE.Vector3());
function headW(C, off) { C.root.updateMatrixWorld(true); const v = new K.THREE.Vector3(); C.head.getWorldPosition(v); const r = C.root.rotation.y; return [v.x + off[0] * Math.cos(r) + off[2] * Math.sin(r), v.y + off[1], v.z - off[0] * Math.sin(r) + off[2] * Math.cos(r)]; }
function holdW(C, obj, off = [0, -0.05, 0.05]) { C.root.updateMatrixWorld(true); const v = _v(); C.armR.end.getWorldPosition(v); obj.position.set(v.x + off[0], v.y + off[1], v.z + off[2]); obj.rotation.set(0, 0, 0); }

function mosquito() { // big readable mosquito: striped body, long legs, needle, flapping wings
  const g = new K.THREE.Group();
  const b = K.sph(0.1, 0x141210, [0, 0, -0.14], { parent: g }); b.scale.set(0.6, 0.6, 2.8);
  for (let i = 0; i < 3; i++) { const r = K.sph(0.1, 0xb8b0a0, [0, 0, -0.1 - i * 0.12], { parent: g }); r.scale.set(0.63, 0.63, 0.12); }
  K.sph(0.09, 0x2a2420, [0, 0.03, 0.14], { parent: g }); K.sph(0.065, 0x2a2420, [0, 0.06, 0.24], { parent: g });
  for (const s of [-1, 1]) K.sph(0.03, 0xb8301e, [s * 0.04, 0.09, 0.28], { parent: g, emissive: 0x601010 });
  const pr = K.cyl(0.008, 0.004, 0.32, 0x1a1410, [0, 0.0, 0.44], { parent: g }); pr.rotation.x = Math.PI / 2 + 0.25;
  for (let i = 0; i < 3; i++) for (const s of [-1, 1]) { const l = K.cyl(0.01, 0.006, 0.8, 0x141210, [s * 0.26, -0.2, 0.1 - i * 0.14], { parent: g }); l.rotation.z = s * 1.0; l.rotation.x = (i - 1) * 0.4; }
  const wl = new K.THREE.Group(), wr = new K.THREE.Group(); wl.position.set(-0.05, 0.1, 0.05); wr.position.set(0.05, 0.1, 0.05);
  const wg = K.sph(0.3, 0xe8f4ff, [-0.32, 0, -0.08], { parent: wl, transparent: true, opacity: 0.6 }); wg.scale.set(1, 0.03, 0.32); const wh = K.sph(0.3, 0xe8f4ff, [0.32, 0, -0.08], { parent: wr, transparent: true, opacity: 0.6 }); wh.scale.set(1, 0.03, 0.32);
  g.add(wl); g.add(wr); g.userData.w = [wl, wr]; g.rotation.order = 'YXZ'; K.scene.add(g); return g;
}
function flap(m, t) { const a = 0.25 + 0.55 * Math.sin(t * 77); m.userData.w[0].rotation.z = a; m.userData.w[1].rotation.z = -a; }
function putMos(p, yaw, t, s = 1, bob = 1, pitch = 0) { mos.position.set(p[0], p[1] + Math.sin(t * 9) * 0.04 * bob, p[2]); mos.rotation.set(pitch + 0.15 * Math.sin(t * 5), yaw, 0); mos.scale.setScalar(s); flap(mos, t); }
function hat(col) { const g = new K.THREE.Group(); K.sph(0.2, col, [0, 0.1, 0], { parent: g }).scale.set(1, 0.7, 1); K.cyl(0.32, 0.32, 0.03, col, [0, 0.02, 0], { parent: g }); K.scene.add(g); return g; }

export async function build(k) {
  K = k; await K.preloadEnvs(); await K.preloadSkies([DAYSKY, GOLDSKY, DUSKSKY]); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  CA = C(K.scene, { shirt: 0xe8dcc0, buttons: 0x6a4a2a, tie: 0x2a3a6a, hat: 'bowler', hatColor: 0x5a4a34, hair: 0x8a7a6a, mustache: true, seed: 11 });
  CR = C(K.scene, { shirt: 0x8a6a44, pants: 0x4a3a2a, tie: 0x7a1a1a, hat: 'bowler', hatColor: 0x2a1a10, hair: 0x3a2414, mustache: true, seed: 12 });
  W1 = C(K.scene, { shirt: 0xf2ead8, pants: 0xf2ead8, hair: 0x1a1210, seed: 13 }); W2 = C(K.scene, { shirt: 0xd8c8a8, pants: 0xd8c8a8, hat: 'cap', hatColor: 0xf2ead8, hair: 0x1a1210, seed: 14 });
  NB = C(K.scene, { shirt: 0x3a6aa8, hat: 'cap', hatColor: 0x2a2a2a, hair: 0x2a1a10, seed: 15 });
  mos = mosquito();
  bag = K.sph(0.16, 0x8a6a3a, [0, -99, 0]); bag.scale.set(1, 1.15, 1);
  candle = new K.THREE.Group(); K.cyl(0.035, 0.035, 0.22, 0xf4ecd8, [0, 0.11, 0], { parent: candle }); const fl = K.sph(0.035, 0xffd060, [0, 0.27, 0], { parent: candle, emissive: 0xffb030, emissiveIntensity: 7 }); fl.scale.set(0.8, 1.6, 0.8); K.scene.add(candle);
  razor = new K.THREE.Group(); K.box(0.04, 0.16, 0.02, 0x2a1a10, [0, -0.06, 0], { parent: razor }); K.box(0.05, 0.12, 0.006, 0xdadfe8, [0.03, 0.06, 0], { parent: razor, metalness: 0.8, roughness: 0.2 }); K.scene.add(razor);
  foam = K.sph(0.2, 0xffffff, [0, -99, 0]); foam.scale.set(1.1, 0.6, 0.6);
  bump = K.sph(0.035, 0xd87070, [0, -99, 0]);
  therm = K.cyl(0.015, 0.015, 0.2, 0xe8f0f8, [0, -99, 0]);
  hatB = hat(0x5a4a34);
  for (let i = 0; i < 12; i++) coins.push(K.cyl(0.06, 0.06, 0.015, 0xf0c040, [0, -99, 0], { metalness: 0.8, roughness: 0.25, emissive: 0x5a3a00 }));
  for (let i = 0; i < 14; i++) sand.push(K.sph(0.05, 0xe0c890, [0, -99, 0]));

  // ---------------- DIG: Valley of the Kings, 1922 — sand, cliffs, tent, palms, a stairway under the sand ----------------
  const sandT = K.tex(512, 512, (c, w, h) => { c.fillStyle = '#e8c88c'; c.fillRect(0, 0, w, h); for (let i = 0; i < 2600; i++) { c.fillStyle = ['#d8b478', '#f2d8a4', '#c8a068'][i % 3]; c.fillRect(Math.random() * w, Math.random() * h, 3 + (i % 4), 2 + (i % 3)); } }, [30, 18]);
  K.plane(160, 90, K.std(0xffffff, { map: sandT, roughness: 1 }), add(DIG, [0, 0.01, 0]));
  const cliff = K.pbr('sandstone_blocks_05', [6, 2], { tint: 0xe8c08a });
  for (let i = 0; i < 7; i++) K.box(14, 9 + (i % 3) * 3, 6, 0xe8c08a, add(DIG, [-40 + i * 13, 4, -16 - (i % 2) * 4]), { map: cliff.map, normalMap: cliff.normalMap });
  K.box(10, 6, 5, 0xe8c08a, add(DIG, [-14, 3, -6]), { map: cliff.map, normalMap: cliff.normalMap });
  await K.placeH('survival_pack/Tent', add(DIG, [6, 0, -5]), -0.4, 2.6).catch(() => {});
  for (let i = 0; i < 6; i++) await K.placeH('nature_pack/PalmTree_' + ((i % 4) + 1), add(DIG, [12 + i * 4, 0, -8 - (i % 2) * 5]), i, 6.5).catch(() => {});
  for (let i = 0; i < 4; i++) await K.placeH('survival_pack/Shovel', add(DIG, [4.5 + i * 0.4, 0, -2.8]), 0.3 * i, 1.4).catch(() => {});
  for (const x of [-1.2, 1.2]) K.box(0.6, 1.7, 3.4, 0xe8c890, add(DIG, [x, 0.85, 0.8]), { map: cliff.map });
  K.box(3.0, 2.2, 0.5, 0xe8c890, add(DIG, [0, 1.1, -0.95]), { map: cliff.map }); K.box(1.0, 1.4, 0.05, 0x0a0604, add(DIG, [0, 0.7, -0.69]));
  for (let i = 0; i < 6; i++) { const top = 1.5 - i * 0.27; steps.push(K.box(1.8, top, 0.5, 0xf0d8a8, add(DIG, [0, top / 2, 2.2 - i * 0.5]), { map: cliff.map })); }
  pile = K.box(1.8, 1.7, 3.0, 0xffffff, add(DIG, [0, 0.85, 1.0]), { map: sandT });
  SG.y22 = K.sign('EGIPTO · 1922', add(DIG, [-8.4, 3.2, -1.6]), { w: 3.8, h: 0.95, bg: '#b8301e', border: '#ffe9a8', posts: true, rotY: 0.2 });
  SG.anos = K.sign('5 AÑOS CAVANDO', add(DIG, [-3.8, 3.2, -1.8]), { w: 4.0, h: 0.95, bg: '#2a1a10', border: '#e0b040', posts: true, rotY: -0.2 });

  // ---------------- TOMB: antechamber, sealed door, gold everywhere, candle light ----------------
  const st = K.pbr('sandstone_blocks_05', [4, 2], { tint: 0xd8b07a });
  K.plane(16, 16, K.pbr('stone_tiles_02', [5, 5], { tint: 0xc8a878 }), add(TOMB, [0, 0.01, 0]));
  K.plane(16, 6, st, add(TOMB, [0, 3, -4]), [0, 0, 0]); K.plane(14, 6, st, add(TOMB, [-5, 3, 1]), [0, Math.PI / 2, 0]); K.plane(14, 6, st, add(TOMB, [5, 3, 1]), [0, -Math.PI / 2, 0]);
  K.plane(16, 14, K.std(0x3a2a1a), add(TOMB, [0, 5.2, 1]), [Math.PI / 2, 0, 0]);
  // sealed plaster door with seals + a dark hole (left part of the back wall)
  const seal = K.tex(512, 512, (c, w, h) => { c.fillStyle = '#d8c8a0'; c.fillRect(0, 0, w, h); c.fillStyle = '#8a6a44'; for (let y = 40; y < h; y += 90) for (let x = 30; x < w; x += 110) { c.beginPath(); c.ellipse(x + (y % 180 ? 50 : 0), y, 26, 34, 0, 0, 7); c.fill(); } });
  K.box(2.4, 3.2, 0.1, 0xffffff, add(TOMB, [-2.4, 1.6, -3.9]), { map: seal });
  K.box(0.5, 0.45, 0.11, 0x0a0604, add(TOMB, [-2.4, 2.0, -3.84]));
  // treasure: gold boxes, statues, chariot wheels, the golden coffin
  const gold = (w, h, d, p) => K.box(w, h, d, 0xe0b040, add(TOMB, p), { metalness: 0.85, roughness: 0.28, emissive: 0x3a2400 });
  gold(1.2, 0.8, 0.8, [1.8, 0.4, -3.0]); gold(0.8, 0.6, 0.6, [3.2, 0.3, -2.4]); gold(0.9, 0.5, 0.7, [0.6, 0.25, -3.3]);
  for (const x of [0.2, 3.9]) { K.cyl(0.18, 0.22, 1.7, 0x1a1410, add(TOMB, [x, 0.85, -3.4])); K.sph(0.26, 0x1a1410, add(TOMB, [x, 1.95, -3.4])); K.box(0.5, 0.18, 0.28, 0xe0b040, add(TOMB, [x, 2.2, -3.4]), { metalness: 0.85, roughness: 0.3 }); }
  for (const z of [-1.2, 0.6]) { const w = K.cyl(0.7, 0.7, 0.08, 0xe0b040, add(TOMB, [4.6, 0.75, z]), { metalness: 0.85, roughness: 0.3 }); w.rotation.z = Math.PI / 2; }
  await K.placeH('rpg_items_pack/Chest_Ingots', add(TOMB, [2.6, 0, -1.6]), -0.4, 0.7).catch(() => {});
  await K.placeH('rpg_items_pack/Chalice', add(TOMB, [1.8, 0.8, -3.0]), 0, 0.35).catch(() => {});
  await K.placeH('rpg_items_pack/Crown', add(TOMB, [3.2, 0.6, -2.4]), 0, 0.3).catch(() => {});
  // inner chamber (right side): coffin + golden mask
  gold(1.0, 0.7, 2.4, [2.6, 0.35, 2.4]); lid = gold(1.02, 0.12, 2.42, [2.6, 0.76, 2.4]);
  mask = new K.THREE.Group(); K.sph(0.4, 0xe0b040, [0, 0, 0], { parent: mask, metalness: 0.85, roughness: 0.25, emissive: 0x3a2400 }).scale.set(0.85, 1, 0.6);
  for (let i = 0; i < 6; i++) K.box(0.95 - i * 0.04, 0.06, 0.1, i % 2 ? 0x2a4ab0 : 0xe0b040, [0, 0.32 - i * 0.12, -0.24], { parent: mask, metalness: 0.6 });
  for (const s of [-1, 1]) { K.sph(0.07, 0xffffff, [s * 0.13, 0.08, 0.22], { parent: mask }); K.sph(0.035, 0x101010, [s * 0.13, 0.08, 0.28], { parent: mask }); }
  for (const s of [-1, 1]) for (let i = 0; i < 5; i++) K.box(0.22, 0.12, 0.3, i % 2 ? 0x2a4ab0 : 0xe0b040, [s * 0.42, 0.2 - i * 0.13, 0.0], { parent: mask, metalness: 0.6 });
  K.box(0.8, 0.14, 0.5, 0xe0b040, [0, 0.42, 0], { parent: mask, metalness: 0.7 }); K.box(0.07, 0.18, 0.07, 0x2a4ab0, [0, -0.45, 0.12], { parent: mask }); K.scene.add(mask);
  K.pointLight(0xffb060, 3, add(TOMB, [-0.6, 2.8, -0.6]), 9); K.pointLight(0xffc070, 5, add(TOMB, [2.6, 2.6, 0.8]), 8); K.pointLight(0xff9a40, 3, add(TOMB, [2.4, 1.8, -1.8]), 6);
  SG.tut = K.sign('TUTANKAMÓN', add(TOMB, [1.6, 3.6, -3.85]), { w: 3.6, h: 0.9, bg: '#1e2a6a', border: '#e0b040' });
  SG.mar = K.sign('¡MARAVILLOSAS!', add(TOMB, [-1.0, 3.7, -3.85]), { w: 3.6, h: 0.9, bg: '#b8301e', border: '#ffe9a8' });
  SG.mil = K.sign('3.000 AÑOS', add(TOMB, [2.6, 3.4, 4.0]), { w: 3.0, h: 0.9, bg: '#1e2a6a', border: '#e0b040', rotY: Math.PI });
  SG.q = K.sign('¿TÚ HABRÍAS ENTRADO?', add(TOMB, [0.6, 3.6, -3.84]), { w: 5.4, h: 1.0, bg: '#b8301e', border: '#ffe9a8' });

  // ---------------- HOTEL: Cairo hotel room — mirror + basin, bed, arched window ----------------
  K.plane(14, 14, K.pbr('wood_floor', [4, 4]), add(HOTEL, [0, 0.01, 0]));
  const hw = K.pbr('painted_plaster_wall', [4, 2], { tint: 0xe8d0a8 }); K.plane(14, 6, hw, add(HOTEL, [0, 3, -4]), [0, 0, 0]); K.plane(12, 6, hw, add(HOTEL, [-5, 3, 1]), [0, Math.PI / 2, 0]); K.plane(12, 6, hw, add(HOTEL, [5, 3, 1]), [0, -Math.PI / 2, 0]);
  await K.placeH('house_interior_pack/Bathroom_Sink', add(HOTEL, [-2.6, 0, -3.6]), 0, 1.0).catch(() => {});
  await K.placeH('house_interior_pack/Bathroom_Mirror1', add(HOTEL, [-2.6, 1.35, -3.95]), 0, 1.0).catch(() => {});
  await K.placeH('house_interior_pack/Bed_King', add(HOTEL, [2.2, 0, -2.4]), 0, 1.1, { tint: 0xf2ead8 }).catch(() => {});
  await K.placeH('house_interior_pack/NightStand_1', add(HOTEL, [0.4, 0, -3.3]), 0, 0.7).catch(() => {});
  await K.placeH('house_interior_pack/Window_Large1', add(HOTEL, [4.95, 1.6, -0.5]), -Math.PI / 2, 2.2).catch(() => {});
  await K.placeH('house_interior_pack/Chair_1', add(HOTEL, [-0.6, 0, -0.6]), 0.4, 1.0).catch(() => {});
  await K.placeH('house_interior_pack/Houseplant_3', add(HOTEL, [-4.2, 0, -3.2]), 0, 1.3).catch(() => {});
  K.ray(add(HOTEL, [3.4, 1.8, -0.5]), [0, 0.9, 0.3], 1.6, 4, 0xffe0b0, 0.13);
  K.pointLight(0xffd8a0, 4, add(HOTEL, [0, 3.2, -1.5]), 9);
  SG.mes = K.sign('MESES DESPUÉS', add(HOTEL, [0.6, 3.3, -3.9]), { w: 3.8, h: 0.9, bg: '#2a1a10', border: '#e0b040' });
  SG.dia = [1, 2, 3].map(n => K.sign('DÍA ' + n, add(HOTEL, [0.6, 3.3, -3.88]), { w: 2.2, h: 0.9, bg: '#b8301e', border: '#ffe9a8' }));
  SG.cai = K.sign('EL CAIRO · 1923', add(HOTEL, [0.6, 3.3, -3.86]), { w: 3.8, h: 0.9, bg: '#1e2a4a', border: '#e0b040' });

  // ---------------- CITY: Cairo at night — flat roofs, domes, minarets, lit windows that go dark ----------------
  K.plane(200, 120, K.pbr('sandstone_blocks_05', [40, 24], { tint: 0x8a7050 }), add(CITY, [0, 0.01, 0]));
  const bw = K.pbr('beige_wall_001', [2, 2], { tint: 0xd8c0a0 });
  for (let i = 0; i < 26; i++) {
    const x = -26 + (i % 13) * 4.2, z = -10 - Math.floor(i / 13) * 9 - (i % 3), h = 4 + ((i * 7) % 5) * 1.6;
    K.box(3.6, h, 3.6, 0xffffff, add(CITY, [x, h / 2, z]), { map: bw.map, normalMap: bw.normalMap });
    for (let r = 0; r < Math.floor(h / 1.8); r++) for (const dx of [-0.9, 0.9]) cityWin.push(K.box(0.5, 0.7, 0.05, 0xffc870, add(CITY, [x + dx, 1.2 + r * 1.6, z + 1.83]), { emissive: 0xffa030, emissiveIntensity: 2.2 }));
    if (i % 5 === 2) K.sph(1.6, 0xd8c8a8, add(CITY, [x, h, z]));
    if (i % 6 === 4) { K.cyl(0.35, 0.45, 9, 0xd8c8a8, add(CITY, [x + 1.8, 4.5, z + 1])); K.sph(0.6, 0xd8c8a8, add(CITY, [x + 1.8, 9.3, z + 1])); }
  }
  for (let i = 0; i < 6; i++) await K.placeH('nature_pack/PalmTree_' + ((i % 4) + 1), add(CITY, [-14 + i * 6, 0, -3]), i, 5).catch(() => {});
  moonL = K.sph(2.2, 0xfff4d8, add(CITY, [10, 22, -60]), { emissive: 0xfff0c0, emissiveIntensity: 2 });
  SG.luz = K.sign('APAGÓN', add(CITY, [0, 3.0, -2.6]), { w: 3.0, h: 0.95, bg: '#1a1a2a', border: '#ffe9a8', posts: true });
  paper = K.sign('¡MALDICIÓN!', add(CITY, [0, -99, 0]), { w: 2.4, h: 1.1, bg: '#f2ead8', fg: '#1a1210', border: '#1a1210' });

  // ---------------- MANOR: England, Highclere at night — lawn, house, the dog ----------------
  K.plane(120, 80, K.pbr('aerial_grass_rock', [24, 16], { tint: 0x6a8a6a }), add(MANOR, [0, 0.01, 0]));
  const brick = K.pbr('castle_brick_02_red', [6, 3], { tint: 0xb8a890 });
  K.box(22, 9, 6, 0xffffff, add(MANOR, [0, 4.5, -14]), { map: brick.map, normalMap: brick.normalMap }); for (const x of [-11, 11]) K.box(3.5, 13, 3.5, 0xffffff, add(MANOR, [x, 6.5, -12]), { map: brick.map });
  for (let i = 0; i < 10; i++) K.box(0.8, 1.2, 0.05, 0xffc870, add(MANOR, [-8 + i * 1.8, 3 + (i % 2) * 3, -10.95]), { emissive: 0xffa030, emissiveIntensity: 1.6 });
  for (let i = 0; i < 6; i++) await K.placeH('nature_pack/CommonTree_' + ((i % 5) + 1), add(MANOR, [-16 + i * 6.5, 0, -6 - (i % 2) * 3]), i, 6).catch(() => {});
  dog = new K.THREE.Group(); const dm = await K.placeH('animals_pack/Husky', [0, 0, 0], 0, 0.9).catch(() => null); if (dm) { dm.parent && dm.parent.remove(dm); dog.add(dm); } K.scene.add(dog);
  K.sph(2.0, 0xfff4d8, add(MANOR, [-6, 16, -40]), { emissive: 0xfff0c0, emissiveIntensity: 2 });
  SG.ing = K.sign('INGLATERRA', add(MANOR, [3.2, 2.6, -2.4]), { w: 3.0, h: 0.9, bg: '#1e2a4a', border: '#e0b040', posts: true, rotY: -0.3 });
}

function hideAll() {
  for (const c of [CA, CR, W1, W2, NB]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.hold(null); }
  for (const g of Object.values(SG)) (Array.isArray(g) ? g : [g]).forEach(x => (x.visible = false));
  for (const o of [mos, bag, candle, razor, foam, bump, therm, hatB, mask, dog, paper]) { o.position.set(0, -99, 0); o.rotation.set(0, 0, 0); o.scale.setScalar(1); }
  foam.scale.set(1.1, 0.6, 0.6); bag.scale.set(1, 1.15, 1);
  for (const c of coins) c.position.set(0, -99, 0); for (const s of sand) s.position.set(0, -99, 0);
  for (const w of cityWin) w.scale.setScalar(1);
  lid.position.set(...add(TOMB, [2.6, 0.76, 2.4])); lid.rotation.set(0, 0, 0); pile.position.set(...add(DIG, [0, 0.85, 1.0])); pile.scale.set(1, 1, 1);
}
const DOORH = add(TOMB, [-2.4, 0, -3.0]); // in front of the sealed door
const MIR = add(HOTEL, [-2.6, 0, -2.7]); // in front of the mirror
const BED = add(HOTEL, [2.2, 0, -2.4]);
function hookShot(f, t, v, rev) { // frame 0: mosquito diving at Carnarvon's cheek inside the golden tomb
  K.preset('candle', { exposure: 1.5 }); K.grade.vig.value = 0.5;
  const p = add(TOMB, [1.2, 0, -1.0]); P(CA, { pos: p, yaw: 0.25, expr: 'shock', arms: 'flail', tremble: 2, lean: -0.15 }, f);
  const k = rev ? 1 - v : v; const b = headW(CA, [0.5, 0.12, 0.32]), a = add(b, [0.5, 0.6, 0.8]); const mp = K.lerp(a, b, Math.min(1, 0.45 + k * 1.3));
  putMos(mp, -2.3, t, 1.0, 1, 0.55);
  K.move({ p: add(p, [0.9, 1.9, 3.4]), l: add(p, [0.2, 1.9, 0]), fov: 50 }, { p: add(p, [0.7, 1.95, 2.7]), l: add(p, [0.2, 1.95, 0]), fov: 48 }, v, 0.8, f); K.focusOn(add(p, [0.3, 1.9, 0.3]));
}

export function frame(f, k) {
  hideAll(); const ph = K.at(f), t = f / 30, u = (i) => K.u(f, i);
  K.preset('golden', { exposure: 1.05, photo: GOLDSKY });
  switch (ph) {
    case 0: { hookShot(f, t, u(0)); if (f < 10) K.grade.whip.value = 0; break; }
    case 1: { // tease: Cairo night, the city lights going out row by row
      K.preset('night', { exposure: 2.3 }); const v = u(1); const cut = Math.floor(cityWin.length * Math.max(0, (v - 0.35) / 0.6)); for (let i = 0; i < cut; i++) cityWin[(i * 37) % cityWin.length].scale.setScalar(0.001);
      K.move({ p: add(CITY, [-6, 3.0, 12]), l: add(CITY, [0, 5, -12]), fov: 50 }, { p: add(CITY, [-3, 3.6, 9]), l: add(CITY, [1, 5.5, -12]), fov: 46 }, v, 0.3, f); K.focusOn(add(CITY, [0, 5, -11])); break; }
    case 2: { K.preset('day', { exposure: 1.1, photo: DAYSKY }); // Egypt 1922: Carnarvon tossing coins from a money bag to the diggers
      SG.y22.visible = SG.anos.visible = true; const v = u(2); const a = add(DIG, [-7.6, 0, 1.2]), b = add(DIG, [-5.4, 0, 0.8]), c = add(DIG, [-4.2, 0, 1.4]);
      P(CA, { pos: a, yaw: 0.5, expr: 'proud', arms: 'hold' }, f); holdW(CA, bag, [0, -0.1, 0.1]);
      P(W1, { pos: b, yaw: -0.6, expr: 'happy', arms: 'reach', bounce: 0.6 }, f); P(W2, { pos: c, yaw: -0.8, expr: 'happy', arms: 'up', bounce: 0.6 }, f);
      coins.forEach((cn, i) => { const k2 = (t * 1.2 + i / coins.length) % 1; cn.position.set(...add(a, [0.5 + k2 * 2.0, 1.7 + Math.sin(k2 * Math.PI) * 1.3 - k2 * 0.8, -0.1 + (i % 3) * 0.15])); cn.rotation.set(t * 8 + i, i, 0); });
      if (v < 0.5) K.move(K.frame([a, b, c], { yaw: 0.15, h: 3.2, lookY: 1.8, pitch: -0.06, push: 0.95 }), K.frame([a, b, c], { yaw: 0.05, h: 3.2, lookY: 1.8, pitch: -0.08, push: 0.88 }), v * 2, 0.4, f);
      else K.move(K.frame([a, b], { yaw: 0.6, h: 2.4, lookY: 1.8, pitch: -0.02, push: 0.85 }), K.frame([a, b], { yaw: 0.5, h: 2.4, lookY: 1.8, pitch: -0.03, push: 0.78 }), (v - 0.5) * 2, 0.4, f); K.focusOn(add(a, [0.8, 1.8, 0])); break; }
    case 3: { K.preset('day', { exposure: 1.1, photo: DAYSKY }); // Carter digs: sand flying, the stairway appears under the sand
      const v = u(3); const p = add(DIG, [1.1, 0, 3.7]); P(CR, { pos: p, yaw: -1.6, expr: v > 0.6 ? 'shock' : 'worried', arms: v > 0.6 ? 'point' : 'hammer', sweat: 1 }, f);
      P(W1, { pos: add(DIG, [-1.1, 0, 3.7]), yaw: 1.4, arms: 'hammer', expr: 'tired' }, f);
      const pk = Math.max(0.04, 1 - Math.min(1, v * 1.25)); pile.scale.y = pk; pile.position.y = DIG[1] + 0.85 * pk;
      sand.forEach((s, i) => { const k2 = (t * 1.8 + i / sand.length) % 1; s.position.set(...add(DIG, [0.4 - k2 * 1.6 + (i % 4) * 0.2, 1.2 + Math.sin(k2 * Math.PI) * 1.4, 2.0 + (i % 3) * 0.3])); });
      if (v < 0.5) K.move(K.frame([p], { yaw: -0.5, h: 2.6, lookY: 1.5, pitch: -0.05, push: 0.9 }), K.frame([p], { yaw: -0.6, h: 2.6, lookY: 1.5, pitch: -0.06, push: 0.82 }), v * 2, 0.4, f);
      else K.move({ p: add(DIG, [-0.8, 4.0, 8.6]), l: add(DIG, [0, 1.0, 1.2]), fov: 46 }, { p: add(DIG, [-0.5, 4.4, 7.6]), l: add(DIG, [0, 0.8, 1.0]), fov: 46 }, (v - 0.5) * 2, 0.4, f); K.focusOn(add(DIG, [0.4, 0.4, 1.4])); break; }
    case 4: { // hole in the sealed door; Carter raises a candle to it
      K.preset('candle', { exposure: 1.15 }); const v = u(4); const p = add(DOORH, [0.25, 0, 0.1]); P(CR, { pos: p, yaw: Math.PI - 0.9, expr: 'worried', arms: 'hold', lean: 0.1 }, f); holdW(CR, candle, [0, -0.04, 0]);
      K.move({ p: add(DOORH, [2.4, 1.9, 1.0]), l: add(DOORH, [-0.2, 1.8, -0.6]), fov: 46 }, { p: add(DOORH, [2.0, 1.9, 0.6]), l: add(DOORH, [-0.2, 1.9, -0.6]), fov: 44 }, v, 0.4, f); K.focusOn(add(DOORH, [0, 2.0, -0.8])); break; }
    case 5: { // "¿Ves algo?" — Carter's face lit gold, Carnarvon behind
      K.preset('candle', { exposure: 1.1 }); const v = u(5); const a = add(DOORH, [0.1, 0, 0.2]), b = add(DOORH, [1.2, 0, 0.9]);
      P(CR, { pos: a, yaw: v < 0.5 ? Math.PI - 0.2 : 0.5, expr: v < 0.5 ? 'shock' : 'laugh', arms: 'hold', talk: v > 0.5 ? 0.8 : 0 }, f); holdW(CR, candle, [0, -0.04, 0]);
      P(CA, { pos: b, yaw: -0.8, expr: v < 0.5 ? 'worried' : 'happy', arms: v < 0.5 ? 'think' : 'up', talk: v < 0.5 ? 0.8 : 0 }, f);
      if (v > 0.5) SG.mar.visible = true;
      K.move(K.frame([a, b], { yaw: 0.55, h: 2.8, lookY: 1.9, pitch: -0.02, push: 0.9 }), K.frame([a, b], { yaw: 0.4, h: 2.8, lookY: 1.9, pitch: -0.03, push: 0.8 }), v, 0.4, f); K.focusOn(add(a, [0, 1.9, 0])); break; }
    case 6: { // treasure: slide over gold, the coffin lid lifts, the golden mask rises
      K.preset('candle', { exposure: 1.6 }); SG.mil.visible = true; const v = u(6); const lv = Math.min(1, Math.max(0, (v - 0.35) / 0.4));
      lid.position.y = TOMB[1] + 0.76 + lv * 0.8; lid.position.x = TOMB[0] + 2.6 + lv * 0.9; lid.rotation.z = -lv * 0.5;
      mask.position.set(...add(TOMB, [2.6, 0.9 + lv * 0.55, 2.4])); mask.rotation.y = Math.PI;
      K.move({ p: add(TOMB, [0.2, 1.6, -1.0]), l: add(TOMB, [2.6, 1.0, 2.4]), fov: 46 }, { p: add(TOMB, [1.2, 1.9, 0.0]), l: add(TOMB, [2.6, 1.2, 2.4]), fov: 40 }, v, 0.3, f); K.focusOn(add(TOMB, [2.6, 1.2, 2.4])); break; }
    case 7: { // re-hook: "aquí empieza lo raro" — mosquito crossing a desert dusk sky, huge in frame
      K.preset('golden', { exposure: 1.1, photo: GOLDSKY, sunDir: [0.4, 0.5, 0.7] }); K.grade.vig.value = 0.6; const v = u(7); if (v < 0.08) K.grade.flash.value = 0.35;
      putMos(add(DIG, [-0.9 + 1.8 * v, 2.3, 3.2]), Math.PI / 2 + 0.4, t, 1.1);
      K.move({ p: add(DIG, [0, 1.6, 5.4]), l: add(DIG, [0, 2.6, 0]), fov: 46 }, { p: add(DIG, [0.2, 1.6, 5.0]), l: add(DIG, [0.2, 2.7, 0]), fov: 44 }, v, 0.2, f); K.focusOn(add(DIG, [0, 2.4, 3.0])); break; }
    case 8: { // months later: the mosquito lands on his cheek; he slaps too late
      K.preset('interior', { exposure: 1.25 }); SG.mes.visible = true; const v = u(8); const p = add(HOTEL, [-0.6, 0, -0.6]);
      P(CA, { pos: p, yaw: 0.3, sit: 1, expr: v < 0.55 ? 'neutral' : (v < 0.75 ? 'shock' : 'angry'), arms: v > 0.62 ? 'wave' : 'hold' }, f);
      const cheek = headW(CA, [0.4, -0.05, 0.3]); putMos(K.lerp(add(cheek, [0.6, 0.4, 0.9]), cheek, Math.min(1, v * 1.8)), -2.2, t, 0.6, v < 0.55 ? 1 : 0);
      if (v > 0.68) mos.position.set(...add(cheek, [0.9, 0.5, 0.6]));
      K.move({ p: add(p, [1.6, 1.6, 2.6]), l: add(p, [0.3, 1.4, 0.2]), fov: 44 }, { p: add(p, [1.2, 1.6, 2.0]), l: add(p, [0.3, 1.5, 0.3]), fov: 40 }, v, 0.3, f); K.focusOn(cheek); break; }
    case 9: { // shaving in the mirror: the razor slips over the bite
      K.preset('interior', { exposure: 1.25 }); const v = u(9); const p = MIR;
      P(CA, { pos: p, yaw: Math.PI, expr: v < 0.6 ? 'neutral' : 'shock', arms: 'think', tremble: v > 0.6 ? 2 : 0 }, f);
      foam.position.set(...headW(CA, [0, -0.26, 0.46])); foam.scale.set(1.2, 0.55, 0.5); const fc = headW(CA, [0.26, -0.1, 0.44]);
      razor.position.set(...headW(CA, [0.32, -0.18 + Math.sin(t * 6) * 0.06, 0.5])); if (v > 0.6) bump.position.set(...fc);
      K.move({ p: add(MIR, [2.3, 2.0, -1.05]), l: add(MIR, [-0.4, 1.5, 0.2]), fov: 60 }, { p: add(MIR, [2.1, 1.95, -1.0]), l: add(MIR, [-0.4, 1.55, 0.2]), fov: 58 }, v, 0.3, f); K.focusOn(add(MIR, [0, 1.6, -0.2])); break; }
    case 10: { // infection: in bed, fever, DAY 1-2-3
      K.preset('interior', { exposure: 1.1 }); K.grade.sat.value = 0.9; const v = u(10); SG.dia[Math.min(2, Math.floor(v * 3))].visible = true;
      const p = add(BED, [0, 0.55, 0.1]); P(CA, { pos: p, yaw: 0, sit: 1, lean: -0.3 - 0.4 * v, expr: v < 0.5 ? 'worried' : 'tired', tremble: 2, sweat: 1, arms: 'down' }, f);
      therm.position.set(...add(p, [0.12, 1.25, 0.35])); therm.rotation.z = 1.2;
      K.move({ p: add(BED, [2.2, 2.4, 3.2]), l: add(BED, [0, 1.2, 0]), fov: 46 }, { p: add(BED, [1.4, 2.2, 2.4]), l: add(BED, [0, 1.2, 0]), fov: 44 }, v, 0.3, f); K.focusOn(add(p, [0, 1.2, 0])); break; }
    case 11: { // re-hook: storm-dark city, fast push toward his lit window
      K.preset('night', { exposure: 2.3 }); K.grade.vig.value = 0.7; const v = u(11); if (v < 0.08) K.grade.flash.value = 0.4;
      K.move({ p: add(CITY, [4, 2.0, 14]), l: add(CITY, [0, 6, -10]), fov: 50 }, { p: add(CITY, [1, 4.5, 2]), l: add(CITY, [0.9, 6, -10]), fov: 40 }, K.ease(v), 0.6, f); K.focusOn(add(CITY, [0, 6, -10])); break; }
    case 12: { // dies in Cairo, April 1923: empty bed, his hat on the pillow, candle
      K.preset('night', { exposure: 2.2 }); K.grade.sat.value = 0.8; SG.cai.visible = true; hatB.position.set(...add(BED, [0, 1.05, -0.6])); hatB.rotation.z = 0.2;
      candle.position.set(...add(HOTEL, [0.4, 0.72, -3.3]));
      K.move({ p: add(BED, [-1.6, 2.4, 3.0]), l: add(BED, [0, 1.0, -0.5]), fov: 46 }, { p: add(BED, [-1.0, 2.1, 2.0]), l: add(BED, [0, 1.0, -0.6]), fov: 44 }, u(12), 0.2, f); K.focusOn(add(BED, [0, 1.05, -0.6])); break; }
    case 13: { // that instant: every light in the city goes out; APAGÓN
      K.preset('night', { exposure: 2.3 }); const v = u(13); SG.luz.visible = v > 0.45; if (v > 0.35) { for (const w of cityWin) w.scale.setScalar(0.001); } if (v > 0.35 && v < 0.42) K.grade.flash.value = 0.5;
      K.move({ p: add(CITY, [0, 2.4, 6]), l: add(CITY, [0, 4.5, -12]), fov: 52 }, { p: add(CITY, [0, 2.2, 4.5]), l: add(CITY, [0, 4.5, -12]), fov: 50 }, v, 0.2, f); K.focusOn(add(CITY, [0, 3, -2.6])); break; }
    case 14: { // England: the dog howls at the moon, then lies down for good
      K.preset('night', { exposure: 2.4 }); SG.ing.visible = true; const v = u(14); const lay = Math.min(1, Math.max(0, (v - 0.62) / 0.25));
      dog.position.set(...add(MANOR, [0, 0, 0])); dog.rotation.set(-0.35 * (1 - lay) * Math.min(1, v * 3), 0.6, lay * 1.35); dog.position.y = lay * 0.25;
      K.move({ p: add(MANOR, [-2.4, 0.8, 3.0]), l: add(MANOR, [0, 0.7, 0]), fov: 46 }, { p: add(MANOR, [-1.8, 0.7, 2.3]), l: add(MANOR, [0, 0.6, 0]), fov: 44 }, v, 0.2, f); K.focusOn(add(MANOR, [0, 0.6, 0])); break; }
    case 15: { // newspapers: newsboy shouting, the front page spins into the lens
      K.preset('day', { exposure: 1.05, photo: DAYSKY }); const v = u(15); const p = add(CITY, [-1.2, 0, 1.6]);
      P(NB, { pos: p, yaw: 0.3, expr: 'shock', arms: 'up', talk: 1, bounce: 0.6 }, f);
      const s = Math.min(1, v * 1.6); paper.position.set(...add(CITY, [0.9, 2.3, 3.0 + s * 1.2])); paper.rotation.set(0, (1 - s) * Math.PI * 4, 0); paper.scale.setScalar(0.3 + 0.55 * s);
      K.move({ p: add(CITY, [0.6, 1.9, 8.4]), l: add(CITY, [0.2, 1.8, 0]), fov: 44 }, { p: add(CITY, [0.6, 1.9, 7.8]), l: add(CITY, [0.3, 1.9, 0]), fov: 44 }, v, 0.3, f); K.focusOn(add(CITY, [0.6, 1.9, 4.6])); break; }
    case 16: { // gag: the giant golden mask vs. the tiny mosquito resting on a gold bar in the foreground
      K.preset('candle', { exposure: 1.6 }); const v = u(16); mask.position.set(...add(TOMB, [2.6, 1.5, 2.4])); mask.rotation.y = Math.PI; lid.position.set(...add(TOMB, [3.5, 1.5, 2.4])); lid.rotation.z = -0.5;
      putMos(add(TOMB, [2.3, 1.38, 0.6]), 0.6, t, 0.4, 0.2);
      K.move({ p: add(TOMB, [2.0, 1.45, -0.4]), l: add(TOMB, [2.4, 1.4, 0.6]), fov: 40 }, { p: add(TOMB, [1.8, 1.55, -0.8]), l: add(TOMB, [2.6, 1.5, 2.4]), fov: 42 }, K.ease(v), 0.1, f); K.focusOn(v < 0.5 ? add(TOMB, [2.3, 1.4, 0.6]) : add(TOMB, [2.6, 1.5, 2.4])); break; }
    default: { const v = u(17); hookShot(f, t, v, true); SG.q.visible = true; }
  }
}
