// VID-029 — Qin Shi Huang (259–210 BC), first emperor of China. Obsessed with immortality, he sent fleets to find the isles of the
// immortals and took alchemists' pills now believed to contain mercury. He died on a tour at 49; his ministers hid the death and
// surrounded his carriage with carts of salted fish to cover the smell (Sima Qian, Shiji). No gore.
export let FRAMES = 2200;
const DAYSKY = 'kloofendal_48d_partly_cloudy_puresky_2k', DUSK = 'qwantani_dusk_2_puresky_2k';
let K, T, EMP, AL1, AL2, MI1, MI2, SG = {}, pills = [], jar, tray, soldiers = [], ships = [], carriage, cart1, cart2, horse, horse2, fishes = [], curtain, cauld, glow, hatB;
const PAL = [0, 0, 0], LAB = [200, 0, 0], WALL = [400, 0, 0], SEA = [600, 0, 0], ROAD = [800, 0, 0];
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function sign(key, txt, pos, o) { const g = K.sign(txt, pos, o); SG[key] = g; return g; }
function crownOn(C) { // mianguan: flat black board with gold rim and short bead strings at the front, on top of the head
  const g = new K.THREE.Group(); K.box(0.46, 0.035, 0.3, 0x161616, [0, 0, 0], { parent: g }); K.box(0.48, 0.015, 0.32, 0xd8a830, [0, -0.022, 0], { parent: g, metalness: 0.6, roughness: 0.3 });
  K.cyl(0.11, 0.13, 0.1, 0x161616, [0, -0.06, 0], { parent: g }); for (let i = 0; i < 5; i++) { const x = -0.18 + i * 0.09; K.sph(0.016, 0xe8c040, [x, -0.035, 0.155], { parent: g }); K.sph(0.016, 0xd83020, [x, -0.068, 0.155], { parent: g }); }
  g.position.set(0, 0.31, 0); g.rotation.x = -0.12; C.head.add(g); return g; }
function soldier(pos, a) { const g = new K.THREE.Group(); const c = 0xb07a50; K.cyl(0.26, 0.32, 0.8, c, [0, 0.6, 0], { parent: g, roughness: 0.9 }); K.box(0.6, 0.22, 0.45, 0x8a5a38, [0, 0.85, 0], { parent: g, roughness: 0.9 });
  K.sph(0.26, 0xc08a60, [0, 1.25, 0], { parent: g, roughness: 0.9 }); K.sph(0.12, 0x6a4a30, [0, 1.48, -0.05], { parent: g }); K.cyl(0.025, 0.025, 2.0, 0x5a3a20, [0.34, 1.0, 0.05], { parent: g });
  g.position.set(...pos); g.rotation.y = a; K.scene.add(g); soldiers.push({ g, base: pos.slice(), ph: rnd() * 6 }); }
function march(t, a = 1) { soldiers.forEach(s => { s.g.position.y = s.base[1] + Math.abs(Math.sin(t * 6 + s.ph * 0.2)) * 0.12 * a; }); }
function pillFly(t, v, mouth, n = 14, spread = 1.0) { // pills arcing from the jar/hand into the mouth, looping
  pills.forEach((p, i) => { if (i >= n) { p.position.set(0, -99, 0); return; } const k = ((t * 1.3 + i / n) % 1); const from = add(mouth, [0.5 * spread * Math.cos(i), -0.5, 0.6 + 0.3 * Math.sin(i * 2)]);
    const q = K.lerp(from, mouth, k); q[1] += Math.sin(k * Math.PI) * 0.6; p.position.set(...q); p.rotation.set(t * 5 + i, i, 0); }); }

export async function build(k) {
  K = k; await K.preloadEnvs(); await K.preloadSkies([DAYSKY, DUSK]); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  EMP = C(K.scene, { shirt: 0x1c1c22, belt: 0xd8a830, buttons: 0xd8a830, cape: 0x9a1a18, hair: 0x14100c, mustache: true, seed: 51 }); hatB = crownOn(EMP);
  AL1 = C(K.scene, { shirt: 0x5a3a8a, belt: 0xc8a040, hair: 0xc8c8c8, mustache: true, seed: 52 });
  AL2 = C(K.scene, { shirt: 0x2a6a5a, belt: 0x1a1210, hair: 0x2a2018, glasses: true, seed: 53 });
  MI1 = C(K.scene, { shirt: 0x8a2a2a, belt: 0x1a1210, hat: 'cap', hatColor: 0x161616, hair: 0x14100c, seed: 54 });
  MI2 = C(K.scene, { shirt: 0x2a4a8a, belt: 0x1a1210, hat: 'cap', hatColor: 0x161616, hair: 0x14100c, mustache: true, seed: 55 });
  const silver = { metalness: 1.0, roughness: 0.12 };
  for (let i = 0; i < 24; i++) pills.push(K.sph(0.07, 0xe4e8f0, [0, -99, 0], silver));
  jar = new K.THREE.Group(); K.cyl(0.22, 0.26, 0.42, 0xd8c8a0, [0, 0.21, 0], { parent: jar, roughness: 0.4 }); K.cyl(0.16, 0.2, 0.08, 0x2a6a5a, [0, 0.46, 0], { parent: jar }); for (let i = 0; i < 6; i++) K.sph(0.07, 0xe4e8f0, [Math.cos(i) * 0.1, 0.5, Math.sin(i) * 0.1], { parent: jar, ...silver }); K.scene.add(jar);
  tray = new K.THREE.Group(); K.cyl(0.42, 0.42, 0.05, 0xd8a830, [0, 0, 0], { parent: tray, metalness: 0.7, roughness: 0.3 }); for (let i = 0; i < 9; i++) K.sph(0.075, 0xe4e8f0, [Math.cos(i * 0.7) * 0.25 * (i % 3 ? 1 : 0.4), 0.06, Math.sin(i * 0.7) * 0.25 * (i % 3 ? 1 : 0.4)], { parent: tray, ...silver }); K.scene.add(tray);

  // ---------------- PALACE: black stone floor, red lacquer columns, gold dais, throne, lanterns ----------------
  K.plane(60, 40, K.pbr('stone_tiles_02', [14, 10], { tint: 0x3a3a40 }), add(PAL, [0, 0.0, 0]));
  for (let z = 0; z < 4; z++) for (const x of [-3.6, 3.6]) { K.cyl(0.32, 0.34, 6, 0xa8201a, add(PAL, [x, 3, 2 - z * 3]), { roughness: 0.35, seg: 20 }); K.box(0.9, 0.3, 0.9, 0xd8a830, add(PAL, [x, 6.0, 2 - z * 3]), { metalness: 0.6, roughness: 0.3 }); }
  K.box(16, 7, 0.3, 0xffffff, add(PAL, [0, 3.5, -9.2]), { map: K.pbr('painted_plaster_wall', [4, 2], { tint: 0x8a1c18 }).map });
  for (let i = 0; i < 4; i++) K.box(0.5, 5.0, 0.05, 0xd8a830, add(PAL, [-5.4 + i * 3.6, 3.6, -9.0]), { metalness: 0.5 });
  K.box(6, 0.5, 3.4, 0x1a1a1a, add(PAL, [0, 0.25, -6.6])); K.box(6.2, 0.06, 3.6, 0xd8a830, add(PAL, [0, 0.52, -6.6]), { metalness: 0.6, roughness: 0.3 });
  const th = new K.THREE.Group(); K.box(1.6, 0.6, 1.0, 0xd8a830, [0, 0.3, 0], { parent: th, metalness: 0.6, roughness: 0.3 }); K.box(1.8, 1.8, 0.2, 0xb02a1a, [0, 1.2, -0.45], { parent: th }); K.box(2.0, 0.2, 0.3, 0xd8a830, [0, 2.15, -0.45], { parent: th, metalness: 0.6 });
  for (const s of [-1, 1]) K.box(0.2, 0.9, 1.0, 0xd8a830, [s * 0.85, 0.75, 0], { parent: th, metalness: 0.6 }); th.position.set(...add(PAL, [0, 0.55, -7.0])); K.scene.add(th);
  for (const x of [-2.4, 2.4]) { K.sph(0.38, 0xff3a2a, add(PAL, [x, 4.6, -4.5]), { emissive: 0xff3a1a, emissiveIntensity: 0.8 }); K.cyl(0.02, 0.02, 1.4, 0x1a1a1a, add(PAL, [x, 5.5, -4.5])); }
  await K.placeH('medieval_village_pack/Cauldron', add(PAL, [-2.6, 0, -1.0]), 0, 1.0, { tint: 0xc89a40 }).catch(() => {});
  K.pointLight(0xffb070, 5, add(PAL, [0, 4, -4]), 14); K.pointLight(0xffd8a0, 3, add(PAL, [0, 3, 3]), 12);
  sign('emp', 'PRIMER EMPERADOR', add(PAL, [0, 5.6, -8.9]), { w: 5.2, h: 1.0, bg: '#1a1a1a', border: '#d8a830' });
  sign('miedo', 'SU MIEDO: MORIR', add(PAL, [0, 5.6, -8.85]), { w: 4.8, h: 1.0, bg: '#d7262a', border: '#ffffff' });
  sign('q', '¿TE LAS HABRÍAS TOMADO?', add(LAB, [-0.45, 3.45, -3.9]), { w: 4.0, h: 1.0, bg: '#d7262a', border: '#ffe9a8' });

  // ---------------- LAB: stone walls, wooden floor, cauldron with a cold silver glow, shelves of potions ----------------
  K.plane(30, 30, K.pbr('dark_wood', [8, 8]), add(LAB, [0, 0.01, 0]));
  K.box(14, 6, 0.3, 0xffffff, add(LAB, [0, 3, -4.2]), { map: K.pbr('rustic_stone_wall_02', [4, 2]).map }); K.box(0.3, 6, 10, 0xffffff, add(LAB, [-5.5, 3, 0]), { map: K.pbr('rustic_stone_wall_02', [3, 2]).map }); K.box(0.3, 6, 10, 0xffffff, add(LAB, [5.5, 3, 0]), { map: K.pbr('rustic_stone_wall_02', [3, 2]).map });
  cauld = await K.placeH('medieval_village_pack/Cauldron', add(LAB, [1.6, 0, -1.6]), 0, 1.1).catch(() => null);
  glow = K.sph(0.5, 0xcfe0ff, add(LAB, [1.6, 0.85, -1.6]), { emissive: 0xb8d0ff, emissiveIntensity: 1.2, metalness: 0.8, roughness: 0.2 }); glow.scale.set(1, 0.25, 1);
  K.pointLight(0xb8d0ff, 4, add(LAB, [1.6, 1.6, -1.6]), 8);
  await K.placeH('house_interior_pack/Bookshelf', add(LAB, [-3.2, 0, -3.7]), 0, 2.6).catch(() => {});
  await K.placeH('modular_dungeon_1/Table_Big', add(LAB, [-1.2, 0, -0.6]), 0, 0.95).catch(() => {});
  for (let i = 0; i < 6; i++) await K.placeH('modular_dungeon_pack/Potion' + (i ? i + 1 : ''), add(LAB, [-4.0 + i * 0.32, 1.32 + (i % 2) * 0.62, -3.5]), 0, 0.32).catch(() => {});
  for (let i = 0; i < 3; i++) await K.placeH('modular_dungeon_pack/Candle', add(LAB, [-2.0 + i * 0.5, 0.95, -0.9]), 0, 0.3).catch(() => {});
  K.pointLight(0xffb060, 3, add(LAB, [-1.6, 2.0, 0.2]), 8); K.ray(add(LAB, [-3.2, 3.2, -1.0]), [0, 0, 0.5], 1.4, 6, 0xffd8a0, 0.12);
  sign('alq', 'PÍLDORAS DE LA INMORTALIDAD', add(LAB, [0, 3.9, -3.95]), { w: 6.8, h: 1.0, bg: '#2a1a3a', border: '#d8a830' });
  sign('nunca', '¡NUNCA MORIRÁS!', add(LAB, [0, 3.9, -3.92]), { w: 4.6, h: 1.0, bg: '#d8a830', fg: '#1a1210', border: '#1a1210' });
  sign('merc', 'MERCURIO = VENENO', add(LAB, [-0.85, 1.75, -1.6]), { w: 1.5, h: 0.42, bg: '#1a1a1a', border: '#d7262a' });

  // ---------------- WALL: the Great Wall on the ridge, a terracotta army in ranks ----------------
  K.plane(200, 200, K.pbr('rocky_terrain_02', [40, 40], { tint: 0xa89070 }), add(WALL, [0, 0, 0]));
  for (let i = 0; i < 9; i++) await K.placeH('modular_medieval_buildings_pack/TallWallBricks', add(WALL, [-24 + i * 6, 0, -16 - i * 1.2]), -0.2, 4.0, { tint: 0xb8a080 }).catch(() => {});
  for (const x of [-18, 0, 18]) await K.placeH('modular_medieval_buildings_pack/SmallSquareTowerBricks', add(WALL, [x, 0, -16 - (x + 24) / 6 * 1.2]), 0, 7, { tint: 0xb8a080 }).catch(() => {});
  for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) soldier(add(WALL, [-5.2 + c * 1.5, 0, -2 - r * 1.6]), 0);
  sign('china', 'CHINA · 221 a.C.', add(WALL, [3.5, 3.0, 1.0]), { w: 4.2, h: 0.95, bg: '#1a1a1a', border: '#d8a830', rotY: -0.3 });

  // ---------------- SEA: a pier at dusk, three junks leaving for the isle of the immortals ----------------
  K.plane(400, 400, K.std(0x2a5a8a, { roughness: 0.2, metalness: 0.25 }), add(SEA, [0, 0, 0]));
  await K.placeH('cute_fish_pack/Dock_Long', add(SEA, [0, 0, 6]), 0, 1.2, { byW: true }).catch(() => {});
  K.box(3, 0.3, 10, 0xffffff, add(SEA, [0, 0.35, 8]), { map: K.pbr('weathered_brown_planks', [1, 3]).map });
  for (let i = 0; i < 3; i++) ships.push(await K.placeH('ships_pack/Sail_ship', add(SEA, [-6 + i * 6, 0, -6]), Math.PI, 7).catch(() => null));
  sign('isla', 'ISLA DE LOS INMORTALES →', add(SEA, [3.2, 2.6, 5.0]), { w: 5.2, h: 0.9, bg: '#1a1a1a', border: '#d8a830', rotY: -0.3 });

  // ---------------- ROAD: dirt road through bamboo, the imperial carriage, carts of fish ----------------
  K.plane(200, 200, K.pbr('aerial_grass_rock', [40, 40]), add(ROAD, [0, 0, 0])); K.plane(5, 200, K.pbr('forrest_ground_01', [2, 60]), add(ROAD, [0, 0.02, 0]), [-Math.PI / 2, 0, Math.PI / 2]);
  for (let i = 0; i < 26; i++) await K.placeH('crops_pack/Bamboo_' + (1 + i % 4), add(ROAD, [-20 + i * 1.6, 0, (i % 2 ? -4.5 : -5.5) - (i % 3)]), i, 4 + (i % 3)).catch(() => {});
  carriage = new K.THREE.Group(); const cb = await K.placeH('medieval_village_pack/Cart', [0, 0, 0], 0, 1.4, { byW: false }).catch(() => null); if (cb) { cb.removeFromParent(); carriage.add(cb); }
  K.box(0.08, 1.3, 1.3, 0xa8201a, [0.78, 1.75, 0], { parent: carriage }); for (const z of [-0.62, 0.62]) K.box(1.6, 1.3, 0.08, 0xa8201a, [0, 1.75, z], { parent: carriage }); K.box(1.9, 0.12, 1.6, 0xd8a830, [0, 2.45, 0], { parent: carriage, metalness: 0.5 });
  for (const z of [-0.62, 0.62]) K.box(0.08, 1.3, 0.08, 0xd8a830, [-0.78, 1.75, z], { parent: carriage, metalness: 0.5 });
  curtain = K.box(0.04, 1.25, 1.2, 0xd8a830, [-0.8, 1.75, 0], { parent: carriage }); K.scene.add(carriage);
  cart1 = await K.placeH('medieval_village_pack/Cart', add(ROAD, [0, 0, 0]), 0, 1.4).catch(() => null);
  cart2 = await K.placeH('medieval_village_pack/Cart', add(ROAD, [0, 0, 0]), 0, 1.4).catch(() => null);
  horse = await K.placeH('animals_pack/Horse', add(ROAD, [0, 0, 0]), 0, 1.8).catch(() => null);
  horse2 = await K.placeH('animals_pack/Horse_White', add(ROAD, [0, 0, 0]), 0, 1.8).catch(() => null);
  for (let i = 0; i < 18; i++) fishes.push(await K.placeH('fish_pack/Fish' + (1 + i % 3), [0, -99, 0], 0, 0.85, { byW: true }).catch(() => null));
  sign('49', '49 AÑOS', add(ROAD, [2.6, 3.0, -2.0]), { w: 2.6, h: 0.9, bg: '#1a1a1a', border: '#d8a830', rotY: -0.3 });
  sign('pez', 'OPERACIÓN PESCADO', add(ROAD, [0, 3.4, -3.0]), { w: 4.8, h: 0.95, bg: '#2a6a9a', border: '#ffffff' });
  sign('shh', 'NADIE DEBE SABERLO', add(ROAD, [0, 3.4, -3.05]), { w: 5.0, h: 0.95, bg: '#1a1a1a', border: '#d7262a' });
}

function hideAll() {
  for (const c of [EMP, AL1, AL2, MI1, MI2]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.hold(null); c.neck.rotation.set(0, 0, 0); }
  for (const g of Object.values(SG)) g.visible = false;
  pills.forEach(p => p.position.set(0, -99, 0)); jar.position.set(0, -99, 0); jar.rotation.set(0, 0, 0); tray.position.set(0, -99, 0);
  ships.forEach((s, i) => { if (s) { s.position.set(...add(SEA, [-6 + i * 6, 0, -6])); s.scale.setScalar(s.userData.s0 || (s.userData.s0 = s.scale.x)); } });
  soldiers.forEach(s => s.g.position.set(...s.base));
  carriage.position.set(0, -99, 0); curtain.scale.set(1, 1, 1);
  for (const o of [cart1, cart2, horse, horse2]) if (o) o.position.set(0, -99, 0);
  fishes.forEach(f => f && f.position.set(0, -99, 0));
}
// procession on the road: carriage at x0, fish carts before/behind, horses pulling; returns carriage world pos
function procession(t, x0, o = {}) {
  const bob = Math.sin(t * 6) * 0.03, cp = add(ROAD, [x0, bob, 0]); carriage.position.set(...cp); carriage.rotation.set(0, Math.PI / 2, Math.sin(t * 4) * 0.02);
  if (horse) { horse.position.set(...add(ROAD, [x0 + 2.6, 0, 0])); horse.rotation.y = Math.PI / 2; }
  if (o.fish) { if (cart1) { cart1.position.set(...add(ROAD, [x0 - 3.4, bob, 0.1])); cart1.rotation.y = Math.PI / 2; } if (cart2) { cart2.position.set(...add(ROAD, [x0 + 5.4, bob, 0.1])); cart2.rotation.y = Math.PI / 2; }
    if (horse2) { horse2.position.set(...add(ROAD, [x0 + 7.8, 0, 0])); horse2.rotation.y = Math.PI / 2; }
    fishes.forEach((f, i) => { if (!f) return; const c = i < 9 ? x0 - 3.4 : x0 + 5.4; const j = i % 9; const fl = o.flop && j === 4 ? Math.abs(Math.sin(t * 7)) * 0.5 : 0;
      f.position.set(...add(ROAD, [c - 0.6 + (j % 3) * 0.6, 1.25 + Math.floor(j / 3) * 0.3 + fl, -0.4 + (j % 3) * 0.4])); f.rotation.set(0, j * 1.3, fl ? Math.sin(t * 9) : 0.3); }); }
  return cp;
}
function emperor(f, o) { P(EMP, { pos: o.pos, yaw: o.yaw ?? 0, expr: o.expr || 'neutral', arms: o.arms || 'down', talk: o.talk || 0, lean: o.lean || 0, tremble: o.tr || 0, sweat: o.sweat, walk: o.walk || 0, sit: o.sit, fall: o.fall }, f); }
const MOUTH = add(LAB, [-0.6, 2.05, 0.35]);
function hookShot(f, t, v, end) { // frame 0: the emperor gulping a stream of silver pills, eyes wide, jar tipping, cold glow behind
  K.preset('interior', { exposure: 1.15 }); const p = add(LAB, [-0.6, 0, 0.2]);
  emperor(f, { pos: p, yaw: 0.25, expr: v > 0.55 && !end ? 'shock' : 'happy', arms: 'drink', tr: v > 0.55 ? 0.6 : 0, sweat: v > 0.55 });
  pillFly(t, v, add(p, [0.05, 1.95, 0.25]), 12, 0.8); jar.position.set(...add(p, [0.55, 1.15, 0.75])); jar.rotation.set(0.6 + Math.sin(t * 3) * 0.2, 0, -0.9);
  K.move({ p: add(p, [-0.5, 1.7, 2.9]), l: add(p, [0.15, 1.8, 0]), fov: 46 }, { p: add(p, [-0.4, 1.75, 2.4]), l: add(p, [0.15, 1.85, 0]), fov: 44 }, v, 0.4, f); K.focusOn(add(p, [0, 1.8, 0]));
}

export function frame(f, k) {
  hideAll(); const ph = K.at(f), t = f / 30, u = (i) => K.u(f, i);
  K.preset('interior', { exposure: 1.1 });
  if (f < 10) K.grade.whip.value = 0;
  switch (ph) {
    case 0: { if (u(0) < 0.05) K.grade.flash.value = 0.4 * (1 - u(0) / 0.05); hookShot(f, t, u(0)); break; }
    case 1: { // teaser: at night a mysterious procession passes, one fish slips off a cart toward the lens
      K.preset('dusk', { exposure: 1.6, photo: DUSK }); K.grade.vig.value = 0.7; const v = u(1); const cp = procession(t, 3 - v * 4, { fish: true });
      const fsh = fishes[4]; if (fsh) { fsh.position.set(...add(ROAD, [3 - v * 4 - 3.4 + 0.3, 1.9 - v * 1.4 + Math.sin(v * 3) * 0.4, 0.4 + v * 2.6])); fsh.rotation.set(t * 4, t * 2, 0); }
      const cx = 3 - v * 4 - 3.4; K.move({ p: add(ROAD, [cx + 1.2, 2.0, 4.6]), l: add(ROAD, [cx, 1.4, 0]), fov: 50 }, { p: add(ROAD, [cx + 1.0, 1.9, 4.0]), l: add(ROAD, [cx, 1.4, 0]), fov: 48 }, v, 0.2, f); K.focusOn(add(ROAD, [0.5, 1.3, 1.5])); break; }
    case 2: { // China, 2,200 years ago: the young ruler strides in front of his army, pointing forward
      K.preset('day', { exposure: 1.0, photo: DAYSKY }); SG.china.visible = true; const v = u(2); march(t, 1); const p = add(WALL, [-0.8 + 1.2 * v, 0, 1.0]);
      emperor(f, { pos: p, yaw: Math.PI / 2 - 0.5, walk: t * 1.8, arms: 'point', expr: 'angry' }); hatB.visible = false;
      K.move(K.frame([p], { yaw: 0.45, h: 2.6, lookY: 1.4, pitch: -0.03, push: 1.5 }), K.frame([p], { yaw: 0.35, h: 2.6, lookY: 1.4, pitch: -0.04, push: 1.35 }), v, 0.3, f); K.focusOn(add(p, [0, 1.4, 0])); break; }
    case 3: { // first emperor of China: he sits on the throne, two ministers bow up and down
      SG.emp.visible = true; const v = u(3); hatB.visible = true; const tp = add(PAL, [0, 1.15, -6.9]);
      emperor(f, { pos: tp, yaw: 0, sit: true, arms: 'akimbo', expr: 'proud' });
      const bow = Math.max(0, Math.sin(t * 4)) * 0.8; P(MI1, { pos: add(PAL, [-0.9, 0, -4.2]), yaw: 0.25 + Math.PI, lean: bow, expr: 'happy', arms: 'hold2' }, f); P(MI2, { pos: add(PAL, [0.9, 0, -4.2]), yaw: -0.25 + Math.PI, lean: bow, expr: 'happy', arms: 'hold2' }, f);
      K.move({ p: add(PAL, [0.3, 1.6, -0.6]), l: add(PAL, [0, 1.8, -6.5]), fov: 50 }, { p: add(PAL, [0.2, 1.7, -1.4]), l: add(PAL, [0, 1.9, -6.5]), fov: 48 }, v, 0.2, f); K.focusOn(add(tp, [0, 1, 0])); break; }
    case 4: { // walls, palaces, a huge army: crane over the terracotta ranks to the Great Wall
      K.preset('day', { exposure: 1.0, photo: DAYSKY }); const v = u(4); march(t, 1.2);
      K.move({ p: add(WALL, [-7, 2.0, 6]), l: add(WALL, [0, 1.4, -6]), fov: 52 }, { p: add(WALL, [5, 6.5, 6]), l: add(WALL, [0, 2.5, -12]), fov: 54 }, v, 0.2, f); K.focusOn(add(WALL, [0, 1.5, -4])); break; }
    case 5: { // but one terrible fear: dying — night palace, close on his worried face, trembling
      K.preset('night', { exposure: 2.2 }); K.grade.vig.value = 0.75; SG.miedo.visible = true; const v = u(5); const tp = add(PAL, [0, 1.15, -6.9]);
      emperor(f, { pos: tp, yaw: 0, sit: true, arms: 'cross', expr: 'scared', tr: 0.7, sweat: true });
      K.move({ p: add(tp, [0.5, 1.9, 4.2]), l: add(tp, [0, 1.7, 0]), fov: 46 }, { p: add(tp, [0.3, 1.9, 2.8]), l: add(tp, [0, 1.8, 0]), fov: 42 }, v, 0.15, f); K.focusOn(add(tp, [0, 1.8, 0])); break; }
    case 6: { // he sends ships: on the pier at dusk, pointing out to sea, junks sliding away
      K.preset('dusk', { exposure: 1.6, photo: DUSK }); SG.isla.visible = true; const v = u(6); const p = add(SEA, [0.2, 0.5, 6.5]);
      ships.forEach((s, i) => { if (s) { s.position.set(...add(SEA, [-6 + i * 6, Math.sin(t * 1.5 + i) * 0.15, -6 - v * 6])); s.rotation.z = Math.sin(t * 1.2 + i) * 0.04; } });
      emperor(f, { pos: p, yaw: Math.PI, arms: 'point', expr: 'proud', talk: 0.6 });
      K.move({ p: add(p, [1.9, 2.1, 3.4]), l: add(p, [-0.4, 1.5, -2.5]), fov: 52 }, { p: add(p, [1.6, 2.0, 2.9]), l: add(p, [-0.4, 1.5, -2.5]), fov: 50 }, v, 0.3, f); K.focusOn(add(p, [0, 1.6, 0])); break; }
    case 7: { // the ships set sail... and never return: low on the empty pier, ships shrink into the horizon
      K.preset('dusk', { exposure: 1.5, photo: DUSK }); const v = u(7); const p = add(SEA, [0.2, 0.5, 8.5]);
      ships.forEach((s, i) => { if (s) { const d = 12 + v * 70; s.position.set(...add(SEA, [-6 + i * 6 + (i - 1) * v * 8, -v * 2.5, -6 - d])); } });
      emperor(f, { pos: p, yaw: Math.PI, arms: 'down', expr: v > 0.5 ? 'sad' : 'worried' });
      K.move({ p: add(p, [1.3, 1.9, 3.0]), l: add(p, [-0.3, 1.5, -6]), fov: 52 }, { p: add(p, [1.1, 1.9, 2.6]), l: add(p, [-0.3, 1.5, -6]), fov: 50 }, v, 0.15, f); K.focusOn(add(p, [0, 1.5, 0])); break; }
    case 8: { // re-hook: crash zoom onto the bubbling silver cauldron, flash
      K.preset('interior', { exposure: 1.15 }); const v = u(8); if (v < 0.1) K.grade.flash.value = 0.45; K.grade.vig.value = 0.7;
      glow.scale.set(1 + Math.sin(t * 9) * 0.05, 0.25 + Math.abs(Math.sin(t * 7)) * 0.1, 1);
      K.move({ p: add(LAB, [1.6, 2.6, 4.0]), l: add(LAB, [1.6, 0.9, -1.6]), fov: 50 }, { p: add(LAB, [1.6, 1.9, 0.2]), l: add(LAB, [1.6, 0.9, -1.6]), fov: 40 }, K.ease(Math.min(1, v * 1.8)), 0.5, f); K.focusOn(add(LAB, [1.6, 0.9, -1.6])); break; }
    case 9: { // alchemists cook the pills: one stirs, the other lifts the tray of shiny silver pills from the glow
      K.preset('interior', { exposure: 1.15 }); SG.alq.visible = true; const v = u(9); glow.scale.set(1, 0.25 + Math.abs(Math.sin(t * 7)) * 0.1, 1);
      P(AL1, { pos: add(LAB, [2.7, 0, -1.4]), yaw: -1.3, arms: 'hammer', expr: 'smug' }, f);
      const ap = add(LAB, [0.6, 0, -0.9]); P(AL2, { pos: ap, yaw: 0.4, arms: 'hold2', expr: 'happy' }, f); tray.position.set(...add(ap, [0.1, 1.25 + v * 0.35, 0.5]));
      K.move(K.frame([add(LAB, [2.7, 0, -1.4]), ap], { yaw: 0.1, h: 2.4, lookY: 1.3, pitch: -0.04, push: 0.95 }), K.frame([add(LAB, [2.7, 0, -1.4]), ap], { yaw: -0.05, h: 2.4, lookY: 1.3, pitch: -0.05, push: 0.85 }), v, 0.3, f); K.focusOn(add(ap, [0.1, 1.4, 0.5])); break; }
    case 10: { // "you will never die": the alchemist kneels and offers the tray; the emperor smug
      K.preset('interior', { exposure: 1.15 }); SG.nunca.visible = true; const v = u(10); const ep = add(LAB, [-1.6, 0, 0.4]), ap = add(LAB, [0.2, 0, 0.6]);
      emperor(f, { pos: ep, yaw: 1.2, arms: 'akimbo', expr: 'smug' }); P(AL1, { pos: ap, yaw: -1.6, lean: 0.5, arms: 'hold2', expr: 'happy', talk: 1 }, f); tray.position.set(...add(ap, [-0.55, 1.05, 0.0]));
      K.move(K.frame([ep, ap], { yaw: 0.05, h: 2.4, lookY: 1.4, pitch: -0.04, push: 0.95 }), K.frame([ep, ap], { yaw: -0.1, h: 2.4, lookY: 1.4, pitch: -0.05, push: 0.85 }), v, 0.3, f); K.focusOn(add(ep, [0.8, 1.4, 0])); break; }
    case 11: { // he takes them, one after another: close-up, pills arcing in, a counter of empty jars
      K.preset('interior', { exposure: 1.15 }); const v = u(11); const p = add(LAB, [-0.6, 0, 0.2]); emperor(f, { pos: p, yaw: 0.25, expr: 'happy', arms: 'drink' });
      pillFly(t * 1.6, v, add(p, [0.05, 1.95, 0.25]), 6 + Math.floor(v * 14), 0.6); jar.position.set(...add(p, [0.55, 1.15, 0.75])); jar.rotation.set(0.6, 0, -0.9);
      K.move({ p: add(p, [-1.2, 1.9, 2.4]), l: add(p, [0.1, 1.8, 0]), fov: 44 }, { p: add(p, [-0.9, 1.9, 1.9]), l: add(p, [0.1, 1.85, 0]), fov: 40 }, v, 0.3, f); K.focusOn(add(p, [0, 1.85, 0])); break; }
    case 12: { // re-hook: and here it all went wrong — flash, desaturate, he clutches his belly, sweating
      K.preset('interior', { exposure: 1.1 }); const v = u(12); if (v < 0.1) K.grade.flash.value = 0.45; K.grade.sat.value = 0.7; K.grade.vig.value = 0.8; const p = add(LAB, [-0.6, 0, 0.2]);
      emperor(f, { pos: p, yaw: 0.25, expr: 'scared', arms: 'cross', tr: 1, sweat: true, lean: 0.25 });
      K.move({ p: add(p, [0.3, 1.2, 3.2]), l: add(p, [0, 1.7, 0]), fov: 50 }, { p: add(p, [0.3, 1.3, 2.4]), l: add(p, [0, 1.7, 0]), fov: 46 }, K.ease(Math.min(1, v * 1.6)), 0.4, f); K.focusOn(add(p, [0, 1.7, 0])); break; }
    case 13: { // on a journey, at 49, the emperor collapses inside his carriage (seen through the window)
      K.preset('day', { exposure: 1.0, photo: DAYSKY }); SG['49'].visible = true; const v = u(13); const cp = procession(t, -1 + v * 1.5, {});
      emperor(f, { pos: add(cp, [0, 0.6, 0]), yaw: Math.PI / 2, sit: true, expr: v < 0.45 ? 'tired' : 'out', arms: 'down' }); if (v > 0.45) EMP.root.rotation.z = -Math.min(1, (v - 0.45) * 4) * 0.9;
      curtain.scale.set(1, 1, 0.01); // window open
      K.move({ p: add(cp, [0.6, 2.5, 4.4]), l: add(cp, [0, 2.3, 0]), fov: 46 }, { p: add(cp, [0.5, 2.4, 3.8]), l: add(cp, [0, 2.25, 0]), fov: 44 }, v, 0.3, f); K.focusOn(add(cp, [0, 1.9, 0])); break; }
    case 14: { // the ministers hide the news: one shuts the curtain, the other shushes, and the march goes on
      K.preset('day', { exposure: 1.0, photo: DAYSKY }); SG.shh.visible = true; const v = u(14); const x0 = 0.5 + v * 2.5; const cp = procession(t, x0, {});
      P(MI1, { pos: add(ROAD, [x0 - 0.4, 0, 1.4]), yaw: 0.2, walk: t * 1.5, arms: 'think', expr: 'worried' }, f); P(MI2, { pos: add(ROAD, [x0 + 1.0, 0, 1.3]), yaw: -0.2, walk: t * 1.5, arms: 'point', expr: 'smug' }, f);
      curtain.scale.set(1, 1, Math.max(0.01, Math.min(1, v * 2.5)));
      SG.shh.position.set(...add(ROAD, [x0 + 0.3, 3.3, -2.0]));
      K.move(K.frame([add(ROAD, [x0 - 0.4, 0, 1.4]), add(ROAD, [x0 + 1.0, 0, 1.3])], { yaw: 0.15, h: 2.5, lookY: 1.4, pitch: -0.05, push: 0.95, pad: 1.4 }), K.frame([add(ROAD, [x0 - 0.4, 0, 1.4]), add(ROAD, [x0 + 1.0, 0, 1.3])], { yaw: 0.0, h: 2.5, lookY: 1.4, pitch: -0.05, push: 0.9, pad: 1.4 }), v, 0.3, f); K.focusOn(add(ROAD, [x0 + 0.3, 1.4, 1.3])); break; }
    case 15: { // to hide the smell: carts piled with fish around the carriage, a fish flopping, a minister pinching his nose
      K.preset('day', { exposure: 1.0, photo: DAYSKY }); SG.pez.visible = true; const v = u(15); const x0 = 3 + v * 2; const cp = procession(t, x0, { fish: true, flop: true }); SG.pez.position.set(...add(ROAD, [x0 - 2.4, 3.1, -1.5]));
      P(MI1, { pos: add(ROAD, [x0 - 1.6, 0, 1.6]), yaw: 0.3, walk: t * 1.5, arms: 'think', expr: 'tired', tremble: 0.3 }, f);
      K.move({ p: add(ROAD, [x0 - 4.2, 2.6, 4.6]), l: add(ROAD, [x0 - 2.4, 1.4, 0]), fov: 52 }, { p: add(ROAD, [x0 - 3.4, 2.8, 4.2]), l: add(ROAD, [x0 - 2.0, 1.4, 0]), fov: 52 }, v, 0.3, f); K.focusOn(add(ROAD, [x0 - 2, 1.3, 0.5])); break; }
    case 16: { // and the pills of immortality? — the jar alone on the table, spotlit, slow orbit
      K.preset('interior', { exposure: 1.0 }); K.grade.vig.value = 0.8; const v = u(16); const jp = add(LAB, [-1.2, 0.95, -0.4]); jar.position.set(...jp); jar.rotation.y = t * 0.6;
      K.move({ p: add(jp, [1.8, 0.9, 2.2]), l: add(jp, [0, 0.3, 0]), fov: 44 }, { p: add(jp, [-0.6, 0.9, 2.6]), l: add(jp, [0, 0.3, 0]), fov: 42 }, v, 0.15, f); K.focusOn(add(jp, [0, 0.3, 0])); break; }
    case 17: { // believed to be mercury, pure poison: a pill falls into a bowl and splits into liquid silver beads
      K.preset('interior', { exposure: 1.05 }); SG.merc.visible = true; K.grade.sat.value = 0.75; const v = u(17); const jp = add(LAB, [-1.2, 0.95, -0.4]); jar.position.set(...jp);
      pills.forEach((p, i) => { if (i > 9) return; const sp = Math.max(0, v - 0.3) * 2; const a = i * 0.63; p.position.set(...add(jp, [0.55 + Math.cos(a) * sp * 0.5 * (i ? 1 : 0), 0.04 + (i ? 0 : Math.max(0, 0.9 - v * 3)), 0.25 + Math.sin(a) * sp * 0.5 * (i ? 1 : 0)])); p.scale.setScalar(i ? 0.6 : 1); });
      K.move({ p: add(jp, [0.5, 1.2, 2.6]), l: add(jp, [0.3, 0.5, 0]), fov: 46 }, { p: add(jp, [0.5, 1.1, 2.2]), l: add(jp, [0.3, 0.5, 0]), fov: 44 }, v, 0.15, f); K.focusOn(add(jp, [0.5, 0.1, 0.25])); break; }
    case 18: { // the man who never wanted to die: the empty throne at dusk, his crown resting on the seat, push in
      K.preset('interior', { exposure: 1.25 }); K.grade.sat.value = 0.85; K.grade.vig.value = 0.6; const v = u(18);
      EMP.head.remove(hatB); K.scene.add(hatB); hatB.position.set(...add(PAL, [0, 1.25, -6.95])); hatB.rotation.set(0, 0.3, 0); hatB.scale.setScalar(2.2);
      K.move({ p: add(PAL, [0, 2.0, -3.0]), l: add(PAL, [0, 1.3, -7]), fov: 46 }, { p: add(PAL, [0, 1.8, -4.6]), l: add(PAL, [0, 1.25, -7]), fov: 42 }, v, 0.15, f); K.focusOn(add(PAL, [0, 1.3, -6.9])); break; }
    default: { const v = u(19); hookShot(f, t, v, true); SG.q.visible = true; const p = add(LAB, [-0.6, 0, 0.2]); K.move({ p: add(p, [0.15, 1.7, 3.9]), l: add(p, [0.15, 2.5, 0]), fov: 50 }, { p: add(p, [0.15, 1.7, 3.5]), l: add(p, [0.15, 2.55, 0]), fov: 48 }, v, 0.3, f); }
  }
  if (ph !== 18 && hatB.parent !== EMP.head) { hatB.removeFromParent(); EMP.head.add(hatB); hatB.position.set(0, 0.36, 0); hatB.rotation.set(-0.12, 0, 0); hatB.scale.setScalar(1); }
  if (ph !== 2) hatB.visible = true;
}
