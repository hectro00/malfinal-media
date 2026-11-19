// VID-026 — Martín I "el Humano" of Aragon (d. 31 May 1410). Chronicle legend: after eating a whole goose he couldn't sleep; his jester Borra said he came from
// the vineyard where he saw a deer hanging by its tail from a fig tree "as if punished for stealing figs"; the king laughed until he died. No heir → end of the House of Barcelona.
export let FRAMES = 2100;
const DAYSKY = 'kloofendal_48d_partly_cloudy_puresky_2k', GOLDSKY = 'belfast_sunset_puresky_2k';
let K, T, KG, JE, C1, C2, C3, MO, SG = {}, goose, crownK, crowns = [], deer, deerI, figs = [], flame, book, cap;
const HALL = [0, 0, 0], BED = [200, 0, 0], VINE = [400, 0, 0], THRONE = [600, 0, 0];
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
const senyera = () => K.tex(256, 512, (c, w, h) => { c.fillStyle = '#f2c230'; c.fillRect(0, 0, w, h); c.fillStyle = '#c8202a'; for (let i = 0; i < 4; i++) c.fillRect(w * (0.11 + i * 0.22), 0, w * 0.11, h); });

export async function build(k) {
  K = k; await K.preloadEnvs(); await K.preloadSkies([DAYSKY, GOLDSKY]); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  KG = C(K.scene, { shirt: 0x7a1a2a, buttons: 0xe0b040, belt: 0xe0b040, cape: 0xc8202a, hat: 'crown', hatColor: 0xe0b040, hair: 0x8a6a4a, mustache: true, seed: 31 });
  JE = C(K.scene, { shirt: 0xf2c230, pants: 0xc8202a, belt: 0x2a6a2a, buttons: 0xc8202a, hair: 0x3a2414, seed: 32 });
  C1 = C(K.scene, { shirt: 0x2a4a8a, hat: 'bowler', hatColor: 0x2a1a10, seed: 33 }); C2 = C(K.scene, { shirt: 0x6a3a8a, hair: 0x5a3418, seed: 34 }); C3 = C(K.scene, { shirt: 0x2a6a3a, hair: 0xd8d8d8, mustache: true, seed: 35 });
  MO = C(K.scene, { shirt: 0x6a4a2a, pants: 0x6a4a2a, hair: 0x4a3018, seed: 36 });
  // jester cap: two floppy horns with bells, parented to the head
  cap = new K.THREE.Group(); for (const s of [-1, 1]) { const h = K.cyl(0.0, 0.16, 0.55, s < 0 ? 0xc8202a : 0x2a6a2a, [s * 0.2, 0.38, 0], { parent: cap }); h.rotation.z = -s * 0.9; K.sph(0.07, 0xf2c230, [s * 0.44, 0.52, 0], { parent: cap, metalness: 0.7, roughness: 0.3 }); }
  K.cyl(0.36, 0.38, 0.12, 0xf2c230, [0, 0.22, 0], { parent: cap }); JE.head.add(cap);
  goose = new K.THREE.Group(); K.cyl(0.42, 0.38, 0.05, 0xf2ead8, [0, 0, 0], { parent: goose }); const gb = K.sph(0.26, 0xa8601a, [0, 0.2, 0], { parent: goose }); gb.scale.set(1.3, 0.8, 1);
  for (const s of [-1, 1]) { const l = K.cyl(0.05, 0.08, 0.28, 0x8a4a14, [s * 0.22, 0.26, 0.12], { parent: goose }); l.rotation.x = -0.8; K.sph(0.05, 0xf2ead8, [s * 0.22, 0.38, 0.26], { parent: goose }); } K.scene.add(goose);
  crownK = new K.THREE.Group(); const cm = await K.placeH('rpg_items_pack/Crown', [0, 0, 0], 0, 0.35).catch(() => null); if (cm) { cm.parent && cm.parent.remove(cm); crownK.add(cm); } K.scene.add(crownK);
  flame = K.sph(0.05, 0xffd060, add(BED, [1.6, 1.12, -2.6]), { emissive: 0xffb030, emissiveIntensity: 7 }); flame.scale.set(0.8, 1.6, 0.8);

  // ---------------- HALL: Aragonese banquet — stone, senyera banners, long table, candles ----------------
  const stone = K.pbr('medieval_blocks_03', [5, 2], { tint: 0xd8c0a0 });
  K.plane(30, 30, K.pbr('stone_tiles_02', [8, 8], { tint: 0xb89a7a }), add(HALL, [0, 0.01, 0]));
  K.plane(24, 8, stone, add(HALL, [0, 4, -6]), [0, 0, 0]); K.plane(20, 8, stone, add(HALL, [-7, 4, 2]), [0, Math.PI / 2, 0]); K.plane(20, 8, stone, add(HALL, [7, 4, 2]), [0, -Math.PI / 2, 0]);
  const sn = K.std(0xffffff, { map: senyera() }); for (let i = 0; i < 5; i++) K.plane(1.2, 2.6, sn, add(HALL, [-5 + i * 2.5, 4.6, -5.9]), [0, 0, 0]);
  K.box(1.8, 0.12, 7.5, 0x6a3a1a, add(HALL, [0, 1.0, -1.0]), { map: K.pbr('wood_table_001', [1, 4]).map }); for (const [x, z] of [[-0.7, -4.4], [0.7, -4.4], [-0.7, 2.4], [0.7, 2.4]]) K.box(0.14, 1.0, 0.14, 0x4a2a14, add(HALL, [x, 0.5, z]));
  K.box(1.8, 0.02, 7.5, 0xf2ead8, add(HALL, [0, 1.07, -1.0]));
  for (let i = 0; i < 6; i++) { const z = -4 + i * 1.3; K.cyl(0.04, 0.04, 0.3, 0xf4ecd8, add(HALL, [0, 1.25, z])); K.sph(0.04, 0xffd060, add(HALL, [0, 1.44, z]), { emissive: 0xffb030, emissiveIntensity: 6 }).scale.set(0.8, 1.6, 0.8); }
  for (let i = 0; i < 4; i++) await K.placeH('rpg_items_pack/Chalice', add(HALL, [(i % 2 ? 0.5 : -0.5), 1.08, -3.2 + i * 1.6]), 0, 0.3).catch(() => {});
  for (let i = 0; i < 3; i++) await K.placeH('rpg_items_pack/ChickenLeg', add(HALL, [(i % 2 ? -0.4 : 0.4), 1.1, -2.4 + i * 1.7]), i, 0.22).catch(() => {});
  K.box(1.4, 2.6, 0.5, 0x7a1a2a, add(HALL, [0, 1.3, -5.6])); K.box(1.0, 0.5, 0.9, 0x7a1a2a, add(HALL, [0, 0.5, -5.2]));
  K.pointLight(0xffb060, 7, add(HALL, [0, 3.2, -2]), 12); K.pointLight(0xffa040, 4, add(HALL, [-3, 2.6, 1]), 9); K.pointLight(0xffc080, 3, add(HALL, [3, 2.6, -4]), 9);
  SG.ar = K.sign('ARAGÓN · 1410', add(HALL, [0, 6.4, -5.85]), { w: 4.0, h: 0.95, bg: '#c8202a', border: '#f2c230' });
  SG.oca = K.sign('¡UN GANSO ENTERO!', add(HALL, [0, 6.4, -5.83]), { w: 4.4, h: 0.95, bg: '#2a1a10', border: '#f2c230' });
  SG.q = K.sign('¿TE HABRÍA HECHO GRACIA?', add(HALL, [0, 6.4, -5.81]), { w: 5.6, h: 1.0, bg: '#c8202a', border: '#ffe9a8' });

  // ---------------- BED: royal bedchamber at night — one candle, window to the vineyard ----------------
  K.plane(16, 16, K.pbr('weathered_brown_planks', [4, 4]), add(BED, [0, 0.01, 0]));
  const bw = K.pbr('castle_brick_02_red', [4, 2], { tint: 0x9a8ab8 }); K.plane(16, 7, bw, add(BED, [0, 3.5, -4]), [0, 0, 0]); K.plane(12, 7, bw, add(BED, [-5, 3.5, 1]), [0, Math.PI / 2, 0]);
  await K.placeH('house_interior_pack/Bed_King', add(BED, [-0.2, 0, -2.4]), 0, 1.2, { tint: 0xc8202a }).catch(() => {});
  await K.placeH('house_interior_pack/Window_Large2', add(BED, [2.6, 2.2, -3.95]), 0, 2.2).catch(() => {});
  K.plane(1.6, 1.4, sn, add(BED, [-3.2, 3.2, -3.9]), [0, 0, 0]);
  K.box(0.7, 0.9, 0.6, 0x4a2a14, add(BED, [1.6, 0.45, -2.6])); K.cyl(0.05, 0.05, 0.3, 0xf4ecd8, add(BED, [1.6, 1.05, -2.6]));
  await K.placeH('house_interior_pack/Door_1', add(BED, [-4.9, 0, -1.0]), Math.PI / 2, 2.6).catch(() => {});
  K.ray(add(BED, [2.6, 1.8, -2.8]), [0.4, 0, 0.3], 1.6, 4, 0x9ab8ff, 0.1);
  K.pointLight(0xffb060, 6, add(BED, [1.4, 1.8, -2.0]), 8); K.pointLight(0x6080c0, 3, add(BED, [2.6, 2.6, -2]), 8);
  SG.borra = K.sign('BORRA, EL BUFÓN', add(BED, [-3.0, 3.4, -3.85]), { w: 3.8, h: 0.9, bg: '#2a6a2a', border: '#f2c230' });
  SG.noche = K.sign('INDIGESTIÓN', add(BED, [-0.2, 3.6, -3.85]), { w: 3.2, h: 0.85, bg: '#2a1a10', border: '#f2c230' });

  // ---------------- VINE: vineyard at golden hour — vine rows, the fig tree, the hanging deer ----------------
  K.plane(160, 90, K.pbr('forrest_ground_01', [30, 18], { tint: 0xc8b070 }), add(VINE, [0, 0.01, 0]));
  for (let r = 0; r < 4; r++) for (let i = 0; i < 10; i++) await K.placeH('crops_pack/BushBerries_' + ((i % 2) + 1), add(VINE, [-9 + i * 2.0, 0, -3 - r * 2.2]), i, 0.9, { tint: 0x8aa040 }).catch(() => {});
  for (let r = 0; r < 4; r++) K.box(20, 0.05, 0.05, 0x5a3a1a, add(VINE, [0, 0.8, -3 - r * 2.2]));
  await K.placeH('nature_pack/CommonTree_3', add(VINE, [1.5, 0, 0]), 0, 5.2).catch(() => {});
  K.cyl(0.12, 0.08, 2.6, 0x5a3a20, add(VINE, [0.2, 3.1, 0.4])).rotation.z = Math.PI / 2 - 0.15;
  for (let i = 0; i < 10; i++) figs.push(K.sph(0.07, 0x5a2a5a, add(VINE, [-0.6 + (i % 5) * 0.5, 3.0 - (i % 2) * 0.2, 0.2 + (i % 3) * 0.3])));
  for (let i = 0; i < 6; i++) await K.placeH('nature_pack/CommonTree_' + ((i % 5) + 1), add(VINE, [-26 + i * 10, 0, -16]), i, 6.5).catch(() => {});
  deer = new K.THREE.Group(); deerI = new K.THREE.Group(); const dm = await K.placeH('animals_pack/Deer', [0, 0, 0], 0, 1.2).catch(() => null);
  if (dm) { dm.parent && dm.parent.remove(dm); deerI.add(dm); } deerI.rotation.x = Math.PI / 2; deerI.position.set(0, -0.4, -0.7); deer.add(deerI);
  K.cyl(0.015, 0.015, 0.45, 0x3a2a1a, [0, -0.2, 0], { parent: deer }); K.scene.add(deer); deer.position.set(...add(VINE, [-0.9, 3.05, 0.4]));
  SG.lad = K.sign('LADRÓN DE HIGOS', [0, -1.1, 0.35], { w: 1.6, h: 0.42, bg: '#f2ead8', fg: '#1a1210', border: '#1a1210' }); deer.add(SG.lad);
  SG.vi = K.sign('LA VIÑA DE AL LADO', add(VINE, [-4.2, 2.2, -1.2]), { w: 4.0, h: 0.9, bg: '#2a6a2a', border: '#f2c230', posts: true, rotY: 0.3 });

  // ---------------- THRONE: empty throne, the line of crowns of the dynasty ----------------
  K.plane(30, 30, K.pbr('marble_01', [8, 8], { tint: 0xc8b8a8 }), add(THRONE, [0, 0.01, 0]));
  K.plane(24, 8, stone, add(THRONE, [0, 4, -5]), [0, 0, 0]); K.plane(20, 8, stone, add(THRONE, [-7, 4, 2]), [0, Math.PI / 2, 0]);
  for (let i = 0; i < 3; i++) K.plane(1.3, 3.4, sn, add(THRONE, [-3 + i * 3, 4.6, -4.9]), [0, 0, 0]);
  K.box(3, 0.4, 2.4, 0x7a1a2a, add(THRONE, [0, 0.2, -3.6])); K.box(1.3, 2.8, 0.4, 0xe0b040, add(THRONE, [0, 1.8, -4.4]), { metalness: 0.7, roughness: 0.35 }); K.box(1.3, 0.5, 1.0, 0x7a1a2a, add(THRONE, [0, 0.75, -3.9]));
  for (let i = 0; i < 8; i++) { const x = -5.6 + i * 1.6; K.cyl(0.22, 0.28, 1.2, 0xd8c8b0, add(THRONE, [x, 0.6, -1.0]), { map: K.pbr('marble_01', [1, 1]).map }); const g = new K.THREE.Group(); const c2 = await K.placeH('rpg_items_pack/Crown', [0, 0, 0], 0, 0.3).catch(() => null); if (c2) { c2.parent && c2.parent.remove(c2); g.add(c2); } g.position.set(...add(THRONE, [x, 1.2, -1.0])); K.scene.add(g); crowns.push({ g, base: g.position.toArray() }); }
  await K.placeH('rpg_items_pack/Book1_Open', add(THRONE, [4.6, 1.05, 1.6]), 0.3, 0.3).catch(() => {}); K.box(1.4, 1.0, 0.9, 0x4a2a14, add(THRONE, [4.6, 0.5, 1.6]));
  K.cyl(0.04, 0.04, 0.28, 0xf4ecd8, add(THRONE, [5.1, 1.14, 1.4])); K.sph(0.04, 0xffd060, add(THRONE, [5.1, 1.32, 1.4]), { emissive: 0xffb030, emissiveIntensity: 6 }).scale.set(0.8, 1.6, 0.8);
  book = K.box(0.02, 0.32, 0.02, 0xf2ead8, [0, -99, 0]);
  K.pointLight(0xffb060, 6, add(THRONE, [0, 3.4, -1.6]), 12); K.pointLight(0xffc080, 1.4, add(THRONE, [3.6, 2.6, 1.0]), 6);
  SG.din = K.sign('500 AÑOS', add(THRONE, [0, 6.2, -4.85]), { w: 3.0, h: 0.95, bg: '#c8202a', border: '#f2c230' });
  SG.her = K.sign('SIN HEREDERO', add(THRONE, [0, 6.2, -4.83]), { w: 3.4, h: 0.95, bg: '#2a1a10', border: '#f2c230' });
  SG.cas = K.sign('CASPE · 1412', add(THRONE, [0, 6.2, -4.81]), { w: 3.4, h: 0.95, bg: '#1e2a6a', border: '#f2c230' });
  SG.ley = K.sign('¿LEYENDA?', add(THRONE, [4.6, 2.6, 0.6]), { w: 2.4, h: 0.8, bg: '#2a1a10', border: '#f2c230', posts: true, rotY: -0.4 });
}

function hideAll() {
  for (const c of [KG, JE, C1, C2, C3, MO]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.hold(null); }
  for (const g of Object.values(SG)) g.visible = false; SG.lad.visible = true;
  goose.position.set(0, -99, 0); goose.scale.setScalar(1); crownK.position.set(0, -99, 0); crownK.rotation.set(0, 0, 0); book.position.set(0, -99, 0);
  for (const c of crowns) { c.g.position.set(...c.base); c.g.rotation.set(0, 0, 0); }
  deer.rotation.set(0, 0, 0); figs.forEach((fg, i) => fg.position.set(...add(VINE, [-0.6 + (i % 5) * 0.5, 3.0 - (i % 2) * 0.2, 0.2 + (i % 3) * 0.3]))); flame.visible = true;
}
function swing(t, a = 1) { deer.rotation.z = Math.sin(t * 2.2) * 0.25 * a; deer.rotation.y = Math.sin(t * 1.3) * 0.3 * a; }
const KB = add(BED, [-0.2, 0.6, -2.2]), JB = add(BED, [1.2, 0, -0.8]); // king in bed, jester at bedside
const KT = add(HALL, [0, 0.4, -4.9]); // king's seat at the head of the table
function hookShot(f, t, v, rev) { // frame 0: the king laughing uncontrollably at the banquet, crown bouncing off his head, the jester mid-joke
  K.preset('candle', { exposure: 1.5 });
  P(KG, { pos: KT, yaw: 0, sit: 1, expr: 'laugh', arms: 'flail', bounce: 1.4, tremble: 2, lean: -0.15, talk: 1 }, f);
  P(JE, { pos: add(HALL, [1.4, 0, -3.4]), yaw: -0.9, expr: 'laugh', arms: 'up', bounce: 1.2 }, f);
  const k = rev ? 1 - v : v; crownK.position.set(...add(KT, [0.25 * k, 2.45 + Math.abs(Math.sin(t * 9)) * 0.35, 0.1])); crownK.rotation.set(0.6 * Math.sin(t * 7), t * 3, 0.5 * Math.sin(t * 9));
  KG.root.updateMatrixWorld(true);
  K.move({ p: add(KT, [1.6, 2.0, 4.0]), l: add(KT, [0.3, 1.6, 0]), fov: 48 }, { p: add(KT, [1.2, 1.9, 3.0]), l: add(KT, [0.3, 1.7, 0]), fov: 46 }, v, 0.7, f); K.focusOn(add(KT, [0, 1.6, 0]));
}

export function frame(f, k) {
  hideAll(); const ph = K.at(f), t = f / 30, u = (i) => K.u(f, i);
  K.preset('candle', { exposure: 1.5 });
  switch (ph) {
    case 0: { if (u(0) < 0.06) K.grade.flash.value = 0.5 * (1 - u(0) / 0.06); hookShot(f, t, u(0)); break; }
    case 1: { // tease: the deer hanging by its tail from the fig tree, swinging
      K.preset('golden', { exposure: 1.15, photo: GOLDSKY }); swing(t, 1.2); const v = u(1);
      K.move({ p: add(VINE, [-3.2, 2.0, 5.0]), l: add(VINE, [-0.9, 2.4, 0.4]), fov: 46 }, { p: add(VINE, [-2.6, 2.2, 4.0]), l: add(VINE, [-0.9, 2.5, 0.4]), fov: 44 }, v, 0.3, f); K.focusOn(add(VINE, [-0.9, 2.4, 0.4])); break; }
    case 2: { // Aragón 1410: crane down the banquet table, courtiers toasting, the king at the head
      SG.ar.visible = true; const v = u(2);
      P(KG, { pos: KT, yaw: 0, sit: 1, expr: 'proud', arms: 'wave' }, f);
      P(C1, { pos: add(HALL, [-1.2, 0, -3.0]), yaw: Math.PI / 2, expr: 'happy', arms: 'drink', bounce: 0.4 }, f); P(C2, { pos: add(HALL, [1.2, 0, -2.0]), yaw: -Math.PI / 2, expr: 'laugh', arms: 'drink', bounce: 0.4 }, f); P(C3, { pos: add(HALL, [-1.2, 0, -0.6]), yaw: Math.PI / 2, expr: 'happy', arms: 'wave' }, f);
      K.move({ p: add(HALL, [0, 4.6, 5.0]), l: add(HALL, [0, 1.2, -3]), fov: 48 }, { p: add(HALL, [0.4, 2.6, 2.6]), l: add(HALL, [0, 1.6, -4.4]), fov: 46 }, K.ease(v), 0.3, f); K.focusOn(add(KT, [0, 1.6, 0])); break; }
    case 3: { // a whole goose, all by himself: the roast shrinks bite by bite, courtiers stare
      SG.oca.visible = true; const v = u(3); goose.position.set(...add(KT, [0, 0.67, 0.8])); goose.scale.setScalar(Math.max(0.25, 1 - v * 0.85));
      P(KG, { pos: KT, yaw: 0, sit: 1, expr: 'happy', arms: 'drink', talk: Math.abs(Math.sin(t * 8)) }, f);
      P(C1, { pos: add(HALL, [-1.2, 0, -3.6]), yaw: Math.PI / 2 - 0.4, expr: 'shock', arms: 'down' }, f); P(C2, { pos: add(HALL, [1.2, 0, -3.6]), yaw: -Math.PI / 2 + 0.4, expr: 'shock', arms: 'up' }, f);
      K.move(K.frame([KT, add(HALL, [-1.2, 0, -3.6]), add(HALL, [1.2, 0, -3.6])], { yaw: 0, h: 2.4, lookY: 1.4, pitch: 0.02, push: 0.95 }), K.frame([KT, add(HALL, [-1.2, 0, -3.6]), add(HALL, [1.2, 0, -3.6])], { yaw: 0.1, h: 2.4, lookY: 1.4, pitch: 0.0, push: 0.85 }), v, 0.3, f); K.focusOn(add(KT, [0, 1.3, 0.6])); break; }
    case 4: { // indigestion: tossing in bed, clutching his belly, sweating
      K.preset('night', { exposure: 2.3 }); SG.noche.visible = true; const v = u(4);
      P(KG, { pos: KB, yaw: Math.sin(t * 3) * 0.4, sit: 1, lean: -0.3, expr: 'worried', arms: 'cross', sweat: 1, tremble: 1 }, f);
      K.move({ p: add(KB, [1.6, 1.8, 3.2]), l: add(KB, [0, 1.0, 0]), fov: 46 }, { p: add(KB, [1.1, 1.7, 2.4]), l: add(KB, [0, 1.1, 0]), fov: 44 }, v, 0.3, f); K.focusOn(add(KB, [0, 1.2, 0])); break; }
    case 5: { // in bursts Borra, the favourite jester — cartwheel-hop through the door
      K.preset('night', { exposure: 2.3 }); SG.borra.visible = true; const v = u(5); const p = K.lerp(add(BED, [-4.2, 0, -0.6]), JB, Math.min(1, v * 1.4));
      P(JE, { pos: p, yaw: Math.PI / 2 - 0.3, walk: v < 0.7 ? t * 2.5 : 0, bounce: 1.6, expr: 'laugh', arms: v < 0.7 ? 'up' : 'wave' }, f);
      P(KG, { pos: KB, yaw: -0.4, sit: 1, lean: -0.2, expr: 'tired', arms: 'down' }, f);
      K.move(K.frame([p, KB], { yaw: 0.2, h: 2.6, lookY: 1.4, pitch: -0.04, push: 1.0, pad: 1.2 }), K.frame([p, KB], { yaw: 0.05, h: 2.6, lookY: 1.4, pitch: -0.05, push: 0.9, pad: 1.2 }), v, 0.4, f); K.focusOn(add(p, [0, 1.5, 0])); break; }
    case 6: { // "where do you come from?" — the king sits up and asks
      K.preset('night', { exposure: 2.3 }); const v = u(6);
      P(KG, { pos: KB, yaw: 0.5, sit: 1, expr: 'neutral', arms: 'shrug', talk: 0.9 }, f); P(JE, { pos: JB, yaw: -1.2, expr: 'smug', arms: 'akimbo' }, f);
      K.move(K.frame([KB], { yaw: 0.6, h: 2.0, lookY: 1.1, pitch: 0.0, push: 0.85 }), K.frame([KB], { yaw: 0.45, h: 2.0, lookY: 1.15, pitch: 0.0, push: 0.75 }), v, 0.3, f); K.focusOn(add(KB, [0, 1.3, 0])); break; }
    case 7: { // Borra points out the window: "from the vineyard next door"
      K.preset('night', { exposure: 2.3 }); const v = u(7);
      P(JE, { pos: JB, yaw: Math.PI - 0.6, expr: 'happy', arms: 'point', talk: 0.9, bounce: 0.4 }, f); P(KG, { pos: KB, yaw: 0.4, sit: 1, expr: 'neutral' }, f);
      K.move(K.frame([JB], { yaw: -0.7, h: 2.6, lookY: 1.6, pitch: -0.03, push: 0.9 }), K.frame([JB], { yaw: -0.55, h: 2.6, lookY: 1.6, pitch: -0.04, push: 0.8 }), v, 0.3, f); K.focusOn(add(JB, [0, 1.7, 0])); break; }
    case 8: { // the vineyard: a deer hanging from a fig tree by its tail
      K.preset('golden', { exposure: 1.15, photo: GOLDSKY }); SG.vi.visible = true; swing(t); const v = u(8);
      K.move({ p: add(VINE, [-6, 1.6, 9]), l: add(VINE, [-0.6, 2.4, 0]), fov: 48 }, { p: add(VINE, [-3.6, 1.8, 5.4]), l: add(VINE, [-0.9, 2.6, 0.4]), fov: 44 }, v, 0.3, f); K.focusOn(add(VINE, [-0.9, 2.4, 0.4])); break; }
    case 9: { // "as if punished for stealing figs": close on the deer, figs dropping, LADRÓN DE HIGOS tag
      K.preset('golden', { exposure: 1.15, photo: GOLDSKY }); swing(t, 0.7); const v = u(9);
      figs.forEach((fg, i) => { const k2 = Math.max(0, (t * 0.9 + i / figs.length) % 1.4 - 0.4); fg.position.y -= k2 * k2 * 3.0; });
      K.move({ p: add(VINE, [-2.6, 1.8, 4.0]), l: add(VINE, [-0.9, 2.1, 0.4]), fov: 44 }, { p: add(VINE, [-2.3, 1.85, 3.6]), l: add(VINE, [-0.9, 2.15, 0.4]), fov: 42 }, v, 0.2, f); K.focusOn(add(VINE, [-0.9, 1.9, 0.6])); break; }
    case 10: { // re-hook: dark push on the king's face — the grin starts
      K.preset('night', { exposure: 2.2 }); K.grade.vig.value = 0.75; const v = u(10); if (v < 0.08) K.grade.flash.value = 0.4;
      P(KG, { pos: KB, yaw: 0.4, sit: 1, expr: v < 0.5 ? 'neutral' : 'happy', arms: 'down', tremble: v > 0.5 ? 1 : 0 }, f);
      K.move({ p: add(KB, [0.9, 1.75, 1.6]), l: add(KB, [0.1, 1.45, 0]), fov: 40 }, { p: add(KB, [0.7, 1.7, 1.15]), l: add(KB, [0.1, 1.5, 0]), fov: 38 }, K.ease(v), 0.2, f); K.focusOn(add(KB, [0, 1.5, 0])); break; }
    case 11: { // he can't stop laughing: thrashing with laughter, the jester laughing along
      K.preset('night', { exposure: 2.3 }); const v = u(11);
      P(KG, { pos: KB, yaw: 0.3 + Math.sin(t * 5) * 0.2, sit: 1, lean: -0.2 + Math.sin(t * 11) * 0.12, expr: 'laugh', arms: 'flail', bounce: 1.5, talk: 1 }, f);
      P(JE, { pos: JB, yaw: -1.1, expr: v < 0.6 ? 'laugh' : 'worried', arms: v < 0.6 ? 'akimbo' : 'shrug', bounce: v < 0.6 ? 1 : 0 }, f);
      K.move(K.frame([KB, JB], { yaw: 0.25, h: 2.6, lookY: 1.3, pitch: -0.04, push: 0.95, pad: 1.15 }), K.frame([KB, JB], { yaw: 0.1, h: 2.6, lookY: 1.3, pitch: -0.05, push: 0.86, pad: 1.15 }), v, 0.5, f); K.focusOn(add(KB, [0, 1.3, 0])); break; }
    case 12: { // laughing so hard he runs out of air... falls back, still; the candle goes out
      K.preset('night', { exposure: 2.2 }); const v = u(12); const out = v > 0.62;
      P(KG, { pos: KB, yaw: 0.3, sit: 1, lean: out ? -0.75 : -0.2 + Math.sin(t * 12) * 0.15, expr: out ? 'out' : 'laugh', arms: out ? 'down' : 'flail', tremble: out ? 0 : 3, talk: out ? 0 : 1 }, f);
      P(JE, { pos: JB, yaw: -1.1, expr: out ? 'shock' : 'worried', arms: out ? 'up' : 'shrug' }, f);
      flame.visible = !out; if (out && v < 0.68) K.grade.flash.value = 0.3; if (out) K.grade.vig.value = 0.75;
      K.move(K.frame([KB, JB], { yaw: 0.35, h: 2.6, lookY: 1.3, pitch: -0.04, push: 0.9, pad: 1.15 }), K.frame([KB, JB], { yaw: 0.3, h: 2.6, lookY: 1.2, pitch: -0.05, push: 0.82, pad: 1.15 }), v, 0.3, f); K.focusOn(add(KB, [0, 1.2, 0])); break; }
    case 13: { // re-hook: the empty throne, his crown left on the seat
      K.preset('candle', { exposure: 1.4 }); K.grade.vig.value = 0.7; const v = u(13); if (v < 0.08) K.grade.flash.value = 0.35;
      crownK.position.set(...add(THRONE, [0, 1.02, -3.8]));
      K.move({ p: add(THRONE, [0, 1.6, 2.6]), l: add(THRONE, [0, 1.4, -3.8]), fov: 46 }, { p: add(THRONE, [0, 1.5, 0.6]), l: add(THRONE, [0, 1.3, -3.8]), fov: 42 }, K.ease(v), 0.2, f); K.focusOn(add(THRONE, [0, 1.1, -3.8])); break; }
    case 14: { // no heir: the row of dynasty crowns — the last one topples off its pedestal
      K.preset('candle', { exposure: 1.4 }); SG.din.visible = u(14) < 0.5; SG.her.visible = u(14) >= 0.5; const v = u(14); const fl = Math.min(1, Math.max(0, (v - 0.55) / 0.3));
      const L = crowns[7]; L.g.position.set(L.base[0] + fl * 0.5, L.base[1] - fl * fl * 1.2, L.base[2] + fl * 0.3); L.g.rotation.z = -fl * 1.8;
      K.move({ p: add(THRONE, [-6.5, 1.8, 3.0]), l: add(THRONE, [-1.0, 1.3, -1.0]), fov: 46 }, { p: add(THRONE, [-2.0, 1.7, 3.2]), l: add(THRONE, [4.2, 1.2, -1.0]), fov: 46 }, v, 0.2, f); K.focusOn(add(THRONE, [3.6, 1.2, -1.0])); break; }
    case 16: { // all for a deer in a fig tree: slow pull-back from the swinging deer
      K.preset('golden', { exposure: 1.1, photo: GOLDSKY }); swing(t); const v = u(16);
      K.move({ p: add(VINE, [-1.8, 2.4, 3.0]), l: add(VINE, [-0.9, 2.3, 0.4]), fov: 44 }, { p: add(VINE, [-4.0, 2.8, 8.0]), l: add(VINE, [-0.6, 2.4, 0.2]), fov: 46 }, v, 0.2, f); K.focusOn(add(VINE, [-0.9, 2.3, 0.4])); break; }
    case 17: { // the chronicles: a monk writing it down by candlelight — "¿LEYENDA?"
      K.preset('candle', { exposure: 1.4 }); SG.ley.visible = true; const v = u(17); const p = add(THRONE, [4.6, 0, 2.5]);
      P(MO, { pos: p, yaw: Math.PI, expr: 'tired', arms: 'hammer', lean: 0.2 }, f);
      K.move(K.frame([p, add(THRONE, [4.6, 0, 1.6])], { yaw: 0.7, h: 2.4, lookY: 1.3, pitch: 0.1, push: 0.95 }), K.frame([p, add(THRONE, [4.6, 0, 1.6])], { yaw: 0.55, h: 2.4, lookY: 1.2, pitch: 0.12, push: 0.85 }), v, 0.2, f); K.focusOn(add(THRONE, [4.6, 1.1, 1.6])); break; }
    case 15: { // two years later another family takes the crown: a new crown descends onto the empty throne, CASPE 1412
      K.preset('candle', { exposure: 1.4 }); SG.cas.visible = true; const v = u(15); const d = Math.min(1, v * 1.4);
      crownK.position.set(...add(THRONE, [0, 1.02 + (1 - d) * 2.4, -3.8])); crownK.rotation.y = t * 1.5;
      K.move({ p: add(THRONE, [2.4, 2.0, 2.8]), l: add(THRONE, [0, 1.9, -3.8]), fov: 48 }, { p: add(THRONE, [2.0, 1.9, 2.2]), l: add(THRONE, [0, 1.7, -3.8]), fov: 46 }, v, 0.2, f); K.focusOn(add(THRONE, [0, 1.3, -3.8])); break; }
    case 18: { // "careful who tells you jokes after dinner": Borra winks at the lens over the banquet table, holding up a goose leg
      K.preset('candle', { exposure: 1.4 }); const v = u(18); const p = add(HALL, [0.9, 0, -2.0]);
      P(JE, { pos: p, yaw: 0.2, expr: v < 0.5 ? 'smug' : 'laugh', arms: 'point', talk: 0.8, bounce: 0.3 }, f);
      goose.position.set(...add(HALL, [0, 1.12, -2.2])); goose.scale.setScalar(0.6);
      K.move(K.frame([p], { yaw: 0.3, h: 2.4, lookY: 1.7, pitch: -0.02, push: 0.85 }), K.frame([p], { yaw: 0.15, h: 2.4, lookY: 1.7, pitch: -0.03, push: 0.72 }), v, 0.3, f); K.focusOn(add(p, [0, 1.8, 0])); break; }
    default: { const v = u(19); hookShot(f, t, v, true); SG.q.visible = true; }
  }
}
