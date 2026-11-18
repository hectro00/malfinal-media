// VID-023 (v3 test) — William Huskisson, Liverpool–Manchester Railway opening, 15 Sep 1830: stepped down to the track to make peace with the Duke of Wellington and was hit by the Rocket. No gore: cut to white before impact.
export let FRAMES = 2300;
const DAYSKY = 'kloofendal_48d_partly_cloudy_puresky_2k', GOLDSKY = 'belfast_sunset_puresky_2k';
let K, T, HU, WE, OF, P1, P2, P3, SG = {}, fans = [], rocket, north, duke, door, hatT, steam = [], water, ribbon, flags = [];
const RAIL = [0, 0, 0], NIGHT = [200, 0, 0], RACE = [400, 0, 0];
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
const T1 = 0, T2 = 2.6; // track 1 (stopped train) z, track 2 (Rocket) z

function loco(col, chim, s = 1) { // early steam locomotive from primitives
  const g = new K.THREE.Group();
  const b = K.cyl(0.55, 0.55, 2.4, col, [0, 1.25, 0.2], { parent: g }); b.rotation.x = Math.PI / 2;
  K.cyl(0.58, 0.58, 0.12, 0x2a2a2a, [0, 1.25, 1.42], { parent: g }).rotation.x = Math.PI / 2;
  K.cyl(0.09, 0.14, 1.9, chim, [0, 2.6, 1.15], { parent: g }); K.cyl(0.2, 0.12, 0.25, chim, [0, 3.6, 1.15], { parent: g });
  K.box(1.3, 1.0, 0.9, 0x6a3a1a, [0, 1.0, -1.3], { parent: g }); K.box(1.4, 0.15, 3.8, 0x2a2a2a, [0, 0.55, -0.1], { parent: g });
  for (const [x, z, r] of [[-0.7, 0.9, 0.62], [0.7, 0.9, 0.62], [-0.7, -1.0, 0.42], [0.7, -1.0, 0.42]]) { const w = K.cyl(r, r, 0.12, 0xe8c030, [x, r, z], { parent: g }); w.rotation.z = Math.PI / 2; K.cyl(r * 0.25, r * 0.25, 0.14, 0x2a2a2a, [x * 1.01, r, z], { parent: g }).rotation.z = Math.PI / 2; }
  for (const s2 of [-1, 1]) { const p = K.cyl(0.07, 0.07, 1.3, 0x8a8a8a, [s2 * 0.62, 1.2, 0.5], { parent: g }); p.rotation.x = 0.5; }
  g.scale.setScalar(s); K.scene.add(g); return g;
}
function carriage(col, trim, withDoor) {
  const g = new K.THREE.Group(); K.box(1.8, 1.5, 3.2, col, [0, 1.45, 0], { parent: g }); K.box(1.95, 0.12, 3.35, trim, [0, 2.25, 0], { parent: g }); K.box(1.9, 0.12, 3.3, trim, [0, 0.72, 0], { parent: g });
  for (const z of [-1.0, 1.0]) for (const s of [-1, 1]) K.box(0.05, 0.55, 0.7, 0xcfe0ec, [s * 0.92, 1.6, z], { parent: g, metalness: 0.4 });
  for (const z of [-1.1, 1.1]) for (const s of [-1, 1]) { const w = K.cyl(0.38, 0.38, 0.1, 0x2a2a2a, [s * 0.75, 0.38, z], { parent: g }); w.rotation.z = Math.PI / 2; }
  let d = null; if (withDoor) { d = new K.THREE.Group(); d.position.set(0.93, 1.45, 0.45); K.box(0.06, 1.2, 0.9, trim, [0, 0, -0.45], { parent: d }); K.box(0.07, 0.4, 0.5, 0xcfe0ec, [0.01, 0.2, -0.45], { parent: d }); g.add(d); }
  K.scene.add(g); return { g, d };
}
function track(z, len, x0) { // two rails + sleepers strip
  const sl = K.tex(512, 64, (c, w, h) => { c.fillStyle = '#8a7a64'; c.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 32) { c.fillStyle = '#5a3a22'; c.fillRect(x + 4, 6, 18, h - 12); } }, [len / 8, 1]);
  K.plane(len, 2.2, K.std(0xffffff, { map: sl }), add(RAIL, [x0, 0.02, z]), [-Math.PI / 2, 0, 0]);
  for (const s of [-0.72, 0.72]) K.box(len, 0.12, 0.08, 0x9a9aa8, add(RAIL, [x0, 0.1, z + s]), { metalness: 0.7 });
}
function fan(pos, col, hat) { const g = new K.THREE.Group(); K.cyl(0.24, 0.28, 0.7, col, [0, 0.55, 0], { parent: g }); K.sph(0.3, 0xfffdf8, [0, 1.2, 0], { parent: g }); if (hat) K.cyl(0.18, 0.18, 0.35, hat, [0, 1.6, 0], { parent: g }); g.position.set(...pos); K.scene.add(g); fans.push({ g, base: pos.slice(), ph: Math.random() * 6 }); }

export async function build(k) {
  K = k; await K.preloadEnvs(); await K.preloadSkies([DAYSKY, GOLDSKY]); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  HU = C(K.scene, { shirt: 0x1e2a4a, buttons: 0xe0b040, tie: 0xf2f2f2, hat: 'top', hatColor: 0x1a1a1a, hair: 0x8a8a8a, seed: 1 });
  WE = C(K.scene, { shirt: 0xb8301e, buttons: 0xe0b040, belt: 0xf2f2f2, hat: 'tricorn', hatColor: 0x1a1a1a, hair: 0xd8d8d8, seed: 2 });
  OF = C(K.scene, { shirt: 0x2a5a3a, buttons: 0xe0b040, hat: 'cap', hatColor: 0x1a1a1a, mustache: true, seed: 3 });
  P1 = C(K.scene, { shirt: 0x6a3a8a, hat: 'top', hatColor: 0x3a2a1a, seed: 4 }); P2 = C(K.scene, { shirt: 0xc8702a, hair: 0x5a3418, seed: 5 }); P3 = C(K.scene, { shirt: 0x3a6aa8, hat: 'bowler', hatColor: 0x2a1a10, mustache: true, seed: 6 });
  rocket = loco(0xe8c030, 0xf2f2f2); north = loco(0x2a5a3a, 0x2a2a2a);
  duke = carriage(0xb8301e, 0xe0b040, true); door = duke.d;
  hatT = new K.THREE.Group(); K.cyl(0.2, 0.2, 0.42, 0x1a1a1a, [0, 0.21, 0], { parent: hatT }); K.cyl(0.32, 0.32, 0.04, 0x1a1a1a, [0, 0.02, 0], { parent: hatT }); K.scene.add(hatT);
  for (let i = 0; i < 14; i++) { const s = K.sph(0.35, 0xf2f2f2, [0, -99, 0], { transparent: true, opacity: 0.55 }); s.userData.noDepth = true; steam.push(s); }
  water = K.cyl(0.08, 0.08, 1.4, 0x6ab8f0, [0, -99, 0], { transparent: true, opacity: 0.8 });

  // ---------------- RAIL: Parkside, 1830 — embankment, two tracks, grandstands, flags ----------------
  K.plane(160, 80, K.pbr('aerial_grass_rock', [30, 16], { tint: 0xc8e8a0 }), add(RAIL, [0, 0.01, 0]));
  K.plane(160, 6.5, K.pbr('coast_sand_rocks_02', [40, 2]), add(RAIL, [0, 0.015, 1.3]));
  track(T1, 160, 0); track(T2, 160, 0);
  // the stopped train on track 1: green loco + carriages (the Duke's red one is ours)
  const L1 = loco(0x2a5a3a, 0x2a2a2a); L1.position.set(...add(RAIL, [-9, 0, T1])); L1.rotation.y = -Math.PI / 2;
  for (let i = 0; i < 3; i++) { const c = carriage([0x3a6aa8, 0xc8702a, 0x6a3a8a][i], 0xf2ead8, false); c.g.position.set(...add(RAIL, [-5 - i * 3.6, 0, T1])); c.g.rotation.y = Math.PI / 2; }
  duke.g.position.set(...add(RAIL, [0, 0, T1])); duke.g.rotation.y = -Math.PI / 2; // door faces track 2 (+z)
  // water tank (Parkside)
  K.box(2.2, 1.6, 2.2, 0x6a3a1a, add(RAIL, [-13, 3.4, -2.2])); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) K.box(0.18, 2.6, 0.18, 0x4a2a14, add(RAIL, [-13 + x * 0.9, 1.3, -2.2 + z * 0.9])); const sp = K.cyl(0.12, 0.12, 1.6, 0x4a2a14, add(RAIL, [-12.2, 2.6, -1.2])); sp.rotation.x = 0.9;
  // grandstands + crowd behind (z negative) and far side
  for (let r = 0; r < 3; r++) { K.box(30, 0.5, 1.4, 0x8a5a34, add(RAIL, [2, 0.25 + r * 0.6, -6 - r * 1.4])); for (let i = 0; i < 20; i++) fan(add(RAIL, [-12 + i * 1.5 + (r % 2) * 0.7, 0.5 + r * 0.6, -6 - r * 1.4]), [0xb8301e, 0x2a6aa8, 0xe0a030, 0x3a8a3a, 0x8a2a6a, 0xf2ead8][(i + r) % 6], (i + r) % 3 ? 0 : 0x1a1a1a); }
  K.box(30, 0.3, 6, 0xb8301e, add(RAIL, [2, 4.8, -8.2])); for (let i = 0; i < 6; i++) K.box(0.18, 4.8, 0.18, 0xf2ead8, add(RAIL, [-12 + i * 5.6, 2.4, -5.4]));
  for (let i = 0; i < 16; i++) { const fl = K.box(0.6, 0.4, 0.04, [0xb8301e, 0xf2f2f2, 0x2a3a8a][i % 3], add(RAIL, [-13 + i * 1.8, 5.4, -5.3])); flags.push(fl); }
  for (let i = 0; i < 10; i++) await K.placeH('nature_pack/CommonTree_' + ((i % 5) + 1), add(RAIL, [-30 + i * 7, 0, 14 + (i % 3) * 4]), i, 6).catch(() => {});
  for (let i = 0; i < 6; i++) await K.placeH('nature_pack/CommonTree_' + ((i % 5) + 1), add(RAIL, [-40 + i * 16, 0, -18]), i, 7).catch(() => {});
  ribbon = K.box(0.08, 0.6, 3.2, 0xb8301e, [0, -99, 0]);
  SG.ina = K.sign('INAUGURACIÓN', add(RAIL, [2, 5.9, -5.2]), { w: 4.6, h: 1.0, bg: '#b8301e', border: '#f2ead8' });
  SG.y30 = K.sign('1830 · PRIMER TREN', add(RAIL, [-8, 3.0, -4.6]), { w: 5.0, h: 1.0, bg: '#1e2a4a', border: '#e0b040', posts: true });
  SG.hus = K.sign('HUSKISSON', add(RAIL, [-2.4, 3.6, -4.6]), { w: 3.2, h: 0.9, bg: '#1e2a4a', posts: true });
  SG.pm = K.sign('PRIMER MINISTRO', add(RAIL, [2.6, 3.6, -4.6]), { w: 4.2, h: 0.9, bg: '#b8301e', posts: true });
  SG.pel = K.sign('PELEADOS', add(RAIL, [0.4, 4.0, -4.6]), { w: 3.0, h: 0.95, bg: '#2a1a10', posts: true });
  SG.no = K.sign('¡NO SE BAJEN!', add(RAIL, [-4.2, 3.6, -4.6]), { w: 3.8, h: 1.0, bg: '#e0b040', fg: '#2a1a10', border: '#2a1a10', posts: true });
  SG.roc = K.sign('ROCKET', add(RAIL, [14, 3.4, 5.6]), { w: 2.8, h: 0.95, bg: '#e8c030', fg: '#2a1a10', border: '#2a1a10', posts: true, rotY: -0.6 });
  SG.q = K.sign('¿TE HABRÍAS BAJADO?', add(RAIL, [0.6, 4.2, -4.5]), { w: 5.6, h: 1.0, bg: '#b8301e', border: '#ffe9a8', posts: true });
  SG.hook = K.sign('ATROPELLADO EN LA INAUGURACIÓN', add(RAIL, [-1.0, 4.2, -4.5]), { w: 6.6, h: 1.0, bg: '#b8301e', border: '#ffe9a8', posts: true });

  // ---------------- RACE: dusk run to the doctor (motion lines) ----------------
  K.plane(400, 60, K.pbr('aerial_grass_rock', [60, 10], { tint: 0xd8c890 }), add(RACE, [0, 0.01, 0]));
  const sl = K.tex(512, 64, (c, w, h) => { c.fillStyle = '#8a7a64'; c.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 32) { c.fillStyle = '#5a3a22'; c.fillRect(x + 4, 6, 18, h - 12); } }, [50, 1]);
  K.plane(400, 2.2, K.std(0xffffff, { map: sl }), add(RACE, [0, 0.02, 0]), [-Math.PI / 2, 0, 0]);
  for (const s of [-0.72, 0.72]) K.box(400, 0.12, 0.08, 0x9a9aa8, add(RACE, [0, 0.1, s]), { metalness: 0.7 });
  for (let i = 0; i < 24; i++) await K.placeH('nature_pack/CommonTree_' + ((i % 5) + 1), add(RACE, [-80 + i * 7, 0, (i % 2 ? 1 : -1) * (6 + (i % 3) * 3)]), i, 6).catch(() => {});
  for (let i = 0; i < 30; i++) K.box(0.03, 0.03, 1 + (i % 3), 0xffffff, add(RACE, [-2 + (i % 6) * 0.4, 0.6 + (i % 5) * 0.4, -3 + i * 0.25]), { transparent: true, opacity: 0.5 }).userData.noDepth = true;
  SG.rec = K.sign('¡VELOCIDAD RÉCORD!', add(RACE, [6, 3.0, -4]), { w: 5.0, h: 1.0, bg: '#e0b040', fg: '#2a1a10', border: '#2a1a10', posts: true, rotY: -0.3 });

  // ---------------- NIGHT: Eccles vicarage bedroom, one candle ----------------
  K.plane(16, 16, K.pbr('weathered_brown_planks', [4, 4]), add(NIGHT, [0, 0.01, 0]));
  const hw = K.pbr('white_plaster_02', [4, 2], { tint: 0x8a9ac8 }); K.plane(16, 7, hw, add(NIGHT, [0, 3.5, -4]), [0, 0, 0]); K.plane(10, 7, hw, add(NIGHT, [-5, 3.5, 1]), [0, Math.PI / 2, 0]);
  await K.placeH('house_interior_pack/Bed_King', add(NIGHT, [-1.4, 0, -2.6]), 0, 1.1, { tint: 0xf2ead8 }).catch(() => {});
  await K.placeH('house_interior_pack/Window_Large1', add(NIGHT, [1.6, 2.4, -3.95]), 0, 2.0).catch(() => {});
  K.box(0.7, 0.8, 0.6, 0x4a2a14, add(NIGHT, [0.6, 0.4, -3.2])); K.cyl(0.06, 0.06, 0.35, 0xf4ecd8, add(NIGHT, [0.6, 0.98, -3.2])); K.sph(0.06, 0xffd060, add(NIGHT, [0.6, 1.2, -3.2]), { emissive: 0xffb030, emissiveIntensity: 6 }).scale.set(0.8, 1.5, 0.8);
  K.ray(add(NIGHT, [1.6, 1.8, -2.4]), [0.5, 0, 0.3], 1.6, 4, 0x9ab8ff, 0.12);
  K.pointLight(0xffb060, 6, add(NIGHT, [0.6, 1.6, -2.6]), 7); K.pointLight(0x6080c0, 3, add(NIGHT, [1.6, 2.6, -2]), 8);
  SG.noche = K.sign('ESA NOCHE', add(NIGHT, [-1.4, 3.0, -3.9]), { w: 2.6, h: 0.8, bg: '#2a1a10' });
}

function hideAll() {
  for (const c of [HU, WE, OF, P1, P2, P3]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.hold(null); }
  for (const g of Object.values(SG)) g.visible = false;
  for (const fa of fans) { fa.g.position.set(...fa.base); fa.g.visible = true; }
  for (const s of steam) s.position.set(0, -99, 0); water.position.set(0, -99, 0);
  rocket.position.set(0, -99, 0); rocket.rotation.set(0, -Math.PI / 2, 0); north.position.set(0, -99, 0); north.rotation.set(0, -Math.PI / 2, 0);
  if (hatT.parent !== K.scene) { hatT.parent.remove(hatT); K.scene.add(hatT); } hatT.position.set(0, -99, 0); hatT.rotation.set(0, 0, 0);
  door.rotation.y = 0; ribbon.position.set(0, -99, 0);
}
function cheer(t, a = 1) { fans.forEach(fa => { fa.g.position.y = fa.base[1] + Math.abs(Math.sin(t * 7 + fa.ph)) * 0.22 * a; }); flags.forEach((fl, i) => { fl.rotation.y = Math.sin(t * 4 + i) * 0.4; }); }
function puff(t, at, n = 8, rate = 1.2) { for (let i = 0; i < n; i++) { const k = (t * rate + i / n) % 1; steam[i].position.set(at[0] + k * 1.6, at[1] + k * 2.6, at[2] + Math.sin(i * 3) * 0.3); steam[i].scale.setScalar(0.5 + k * 1.8); } }
const DOOR = add(RAIL, [0.45, 0, T1 + 0.95]); // Duke's carriage door, track side

export function frame(f, k) {
  hideAll(); const ph = K.at(f), t = f / 30, u = (i) => K.u(f, i);
  K.preset('day', { exposure: 1.05, photo: DAYSKY }); cheer(t, 0.3);
  const rocketAt = (x) => { rocket.position.set(...add(RAIL, [x, 0, T2])); puff(t, add(RAIL, [x + 1.2, 3.6, T2]), 8, 1.6); };
  const hookShot = (v, rev) => { // frame 0: Rocket charging at camera, Huskisson clinging to the open door, shocked
    cheer(t, 1); SG.hook.visible = true; door.rotation.y = -1.1 - 0.15 * Math.sin(t * 9);
    P(HU, { pos: add(DOOR, [0.2, 0, 0.9]), yaw: -0.6, expr: 'shock', arms: 'reach', tremble: 3, lean: -0.2 }, f);
    rocketAt(9 - 6 * (rev ? 1 - v : v)); // Rocket rushing in from the right on track 2
    K.move({ p: add(RAIL, [-3.8, 1.25, 3.9]), l: add(RAIL, [3.0, 1.7, 2.0]), fov: 54 }, { p: add(RAIL, [-3.0, 1.2, 3.7]), l: add(RAIL, [3.0, 1.7, 2.0]), fov: 52 }, v, 1.0, f); K.focusOn(add(DOOR, [0.2, 1.8, 0.9]));
  };
  switch (ph) {
    case 0: { if (u(0) < 0.06) K.grade.flash.value = 0.5 * (1 - u(0) / 0.06); hookShot(u(0)); break; }
    case 1: { // why he stepped down to the track: low shot of his shoes landing on the gravel
      const v = u(1); const y = Math.max(0, 0.9 * (1 - v * 2.2)); P(HU, { pos: add(DOOR, [0.1, y, 0.8]), yaw: 0.3, expr: 'smug', arms: 'hold' }, f); door.rotation.y = -1.2;
      K.move({ p: add(DOOR, [2.6, 1.0, 4.8]), l: add(DOOR, [0.1, 1.3, 0.8]), fov: 46 }, { p: add(DOOR, [2.2, 0.9, 4.2]), l: add(DOOR, [0.1, 1.2, 0.8]), fov: 46 }, v, 0.4, f); K.focusOn(add(DOOR, [0.1, 1, 0.8])); break; }
    case 2: { // England 1830: world's first passenger train — crane over stands + train
      cheer(t, 1); SG.y30.visible = SG.ina.visible = true; const v = u(2);
      K.move({ p: add(RAIL, [-14, 2.2, 9]), l: add(RAIL, [-6, 2.2, -3]), fov: 50 }, { p: add(RAIL, [-10, 6.5, 11]), l: add(RAIL, [-4, 1.6, -3]), fov: 50 }, K.ease(v), 0.3, f); K.focusOn(add(RAIL, [-6, 1.5, -1])); break; }
    case 3: { // thousands came: the crowd jumping, hats up
      cheer(t, 1.4); SG.ina.visible = true; const a = add(RAIL, [-1.2, 0, -3.8]), b = add(RAIL, [0.6, 0, -4.0]), c = add(RAIL, [2.2, 0, -3.7]);
      P(P1, { pos: a, yaw: 0.2, expr: 'happy', arms: 'up', bounce: 1 }, f); P(P2, { pos: b, yaw: 0, expr: 'laugh', arms: 'wave', bounce: 1 }, f); P(P3, { pos: c, yaw: -0.2, expr: 'happy', arms: 'up', bounce: 1 }, f);
      K.move(K.frame([a, b, c], { yaw: 0.2, h: 3.4, lookY: 2.0, pitch: -0.08, push: 0.95 }), K.frame([a, b, c], { yaw: -0.05, h: 3.4, lookY: 2.0, pitch: -0.1, push: 0.86 }), u(3), 0.5, f); K.focusOn(add(b, [0, 2, 0])); break; }
    case 4: { // Huskisson, important politician: proud, tips his top hat at the window of his carriage
      SG.hus.visible = true; const p = add(RAIL, [-3.0, 0, T1 + 1.6]); P(HU, { pos: p, yaw: 0.2, expr: 'proud', arms: 'wave' }, f);
      K.move(K.frame([p], { yaw: 0.45, h: 2.7, lookY: 1.9, pitch: -0.04, push: 0.85 }), K.frame([p], { yaw: 0.25, h: 2.7, lookY: 1.9, pitch: -0.05, push: 0.75 }), u(4), 0.5, f); K.focusOn(add(p, [0, 2, 0])); break; }
    case 5: { // in another carriage: the Duke of Wellington, prime minister
      SG.pm.visible = true; const p = add(RAIL, [1.6, 0, T1 + 1.5]); P(WE, { pos: p, yaw: -0.2, expr: 'smug', arms: 'akimbo' }, f);
      K.move(K.frame([p], { yaw: -0.45, h: 2.7, lookY: 1.9, pitch: -0.04, push: 0.85 }), K.frame([p], { yaw: -0.25, h: 2.7, lookY: 1.9, pitch: -0.05, push: 0.75 }), u(5), 0.5, f); K.focusOn(add(p, [0, 2, 0])); break; }
    case 6: { // years of feud: both turn their backs, arms crossed, PELEADOS
      SG.pel.visible = true; const a = add(RAIL, [-1.4, 0, T1 + 1.6]), b = add(RAIL, [1.4, 0, T1 + 1.6]); const v = u(6);
      P(HU, { pos: a, yaw: v < 0.4 ? 0.9 : -0.6, expr: 'angry', arms: 'cross' }, f); P(WE, { pos: b, yaw: v < 0.4 ? -0.9 : 0.6, expr: 'angry', arms: 'cross' }, f);
      K.move(K.frame([a, b], { yaw: 0.05, h: 3.0, lookY: 1.9, pitch: -0.04, push: 0.92 }), K.frame([a, b], { yaw: -0.05, h: 3.0, lookY: 1.9, pitch: -0.05, push: 0.84 }), v, 0.6, f); K.focusOn(add(RAIL, [0, 2, T1 + 1.6])); break; }
    case 7: { // halfway the train stopped to take water: tank pouring, steam
      const v = u(7); water.position.set(...add(RAIL, [-11.6, 1.6, -0.6])); water.scale.y = 1 + 0.1 * Math.sin(t * 20); puff(t, add(RAIL, [-9, 3.6, 0]), 10, 0.8);
      K.move({ p: add(RAIL, [-7.0, 2.2, 6.5]), l: add(RAIL, [-11.8, 2.4, -1.2]), fov: 48 }, { p: add(RAIL, [-8.0, 2.0, 5.4]), l: add(RAIL, [-11.8, 2.3, -1.2]), fov: 46 }, v, 0.3, f); K.focusOn(add(RAIL, [-11.5, 2, -1.0])); break; }
    case 8: { // clear order: don't get off — official raising a finger, NO SE BAJEN
      SG.no.visible = true; const p = add(RAIL, [-2.6, 0, T1 + 1.7]); P(OF, { pos: p, yaw: 0.3, expr: 'angry', arms: 'point', talk: 0.8 }, f);
      K.move(K.frame([p], { yaw: 0.35, h: 2.5, lookY: 1.9, pitch: 0.02, push: 0.8 }), K.frame([p], { yaw: 0.2, h: 2.4, lookY: 1.9, pitch: 0.03, push: 0.68 }), u(8), 0.6, f); K.focusOn(add(p, [0, 2, 0])); break; }
    case 9: { // he ignored it: walks along the track to the Duke, offers his hand
      const v = u(9); const s = add(RAIL, [-4.5, 0, T1 + 1.8]), e = add(RAIL, [0.4, 0, T1 + 1.8]); const pos = K.lerp(s, e, Math.min(1, v * 1.4));
      P(HU, { pos, yaw: v < 0.7 ? Math.PI / 2 : -0.3, walk: v < 0.7 ? t * 1.6 : 0, expr: 'happy', arms: v < 0.7 ? 'down' : 'reach' }, f);
      P(WE, { pos: add(RAIL, [1.3, 0.4, T1 + 1.2]), yaw: -0.8, expr: 'shock', arms: 'cross' }, f);
      K.move(K.frame([pos, add(RAIL, [1.3, 0, T1 + 1.2])], { yaw: 0.25, h: 3.0, lookY: 1.9, pitch: -0.03, push: 0.95 }), K.frame([pos, add(RAIL, [1.3, 0, T1 + 1.2])], { yaw: 0.1, h: 3.0, lookY: 1.9, pitch: -0.04, push: 0.88 }), v, 0.5, f); K.focusOn(add(pos, [0, 2, 0])); break; }
    case 10: { // but that wasn't the worst: dark punch on his smiling face, a rumble behind
      K.preset('day', { exposure: 0.85, photo: DAYSKY }); K.grade.vig.value = 0.7; const v = u(10); if (v < 0.08) K.grade.flash.value = 0.35;
      const p = add(RAIL, [0.4, 0, T1 + 1.8]); P(HU, { pos: p, yaw: -0.3, expr: 'happy', arms: 'reach' }, f); rocketAt(30);
      K.move(K.frame([p], { yaw: 0.6, h: 2.2, lookY: 2.0, pitch: 0.0, push: 0.75 }), K.frame([p], { yaw: 0.55, h: 2.1, lookY: 2.0, pitch: 0.0, push: 0.6 }), K.ease(v), 0.4, f); K.focusOn(add(p, [0, 2.1, 0])); break; }
    case 11: { // on the other track came the fastest loco in the world: the Rocket
      const v = u(11); SG.roc.visible = true; rocketAt(26 - 10 * v);
      K.move({ p: add(RAIL, [8, 1.0, 6.2]), l: add(RAIL, [22, 1.8, T2]), fov: 44 }, { p: add(RAIL, [7, 0.9, 5.6]), l: add(RAIL, [17, 1.8, T2]), fov: 42 }, v, 0.8, f); K.focusOn(add(RAIL, [18, 1.6, T2])); break; }
    case 12: { // everyone screamed... the others climbed back in time
      cheer(t, 0); const v = u(12); rocketAt(15 - 4 * v);
      const a = add(RAIL, [-2.0, Math.min(0.6, v * 1.2), T1 + 1.3]), b = add(RAIL, [-0.8, Math.min(0.6, v), T1 + 1.3]);
      P(P1, { pos: a, yaw: Math.PI, expr: 'scared', arms: 'flail', run: t * 3 }, f); P(P3, { pos: b, yaw: Math.PI, expr: 'shock', arms: 'up', run: t * 3 }, f);
      P(HU, { pos: add(RAIL, [0.6, 0, T1 + 1.8]), yaw: 0.9, expr: 'scared', arms: 'flail', tremble: 2 }, f);
      K.move(K.frame([a, b, add(RAIL, [0.6, 0, T1 + 1.8])], { yaw: 0.4, h: 3.0, lookY: 1.9, pitch: -0.03, push: 0.95 }), K.frame([a, b, add(RAIL, [0.6, 0, T1 + 1.8])], { yaw: 0.3, h: 3.0, lookY: 1.9, pitch: -0.04, push: 0.86 }), v, 1.0, f); K.focusOn(add(RAIL, [-0.4, 2, T1 + 1.5])); break; }
    case 13: { // AND HERE IT ALL WENT WRONG: dark, the Rocket's chimney fills the frame
      K.preset('day', { exposure: 0.8, photo: DAYSKY }); K.grade.vig.value = 0.75; const v = u(13); if (v < 0.08) K.grade.flash.value = 0.4; rocketAt(9 - 2 * v);
      K.move({ p: add(RAIL, [4.5, 0.6, 6.0]), l: add(RAIL, [8, 2.4, T2]), fov: 46 }, { p: add(RAIL, [4.0, 0.6, 5.0]), l: add(RAIL, [7.6, 2.6, T2]), fov: 44 }, K.ease(v), 0.8, f); K.focusOn(add(RAIL, [7.5, 2.4, T2])); break; }
    case 14: { // he clung to the door... the door swung open... the Rocket couldn't brake → white cut
      const v = u(14); const sw = Math.min(1, Math.max(0, (v - 0.3) / 0.25)); door.rotation.y = -0.2 - 1.2 * sw;
      P(HU, { pos: add(DOOR, [0.15 + 0.7 * sw, 0, 0.6 + 0.5 * sw]), yaw: -0.4, expr: 'shock', arms: 'reach', tremble: 3, lean: -0.25 * sw }, f);
      rocketAt(9 - 7.5 * v); cheer(t, 0);
      if (v > 0.86) K.grade.flash.value = Math.min(1, (v - 0.86) * 8);
      K.move({ p: add(RAIL, [-3.8, 1.25, 3.9]), l: add(RAIL, [3.0, 1.7, 2.0]), fov: 54 }, { p: add(RAIL, [-3.0, 1.2, 3.7]), l: add(RAIL, [3.0, 1.7, 2.0]), fov: 52 }, v, 0.9 + v, f); K.focusOn(add(DOOR, [0.4, 1.8, 1.0])); break; }
    case 15: { // to the doctor in another train at record speed: low tracking shot, dusk
      K.preset('golden', { exposure: 1.1, photo: GOLDSKY }); SG.rec.visible = true; const v = u(15); const x = -20 + 40 * v; north.position.set(...add(RACE, [x, 0, 0])); north.rotation.y = Math.PI / 2;
      for (let i = 0; i < 8; i++) { const k2 = (t * 2 + i / 8) % 1; steam[i].position.set(...add(RACE, [x - 1.2 - k2 * 3, 3.6 + k2 * 0.8, 0])); steam[i].scale.setScalar(0.5 + k2 * 1.6); }
      K.move({ p: add(RACE, [x + 5.5, 1.5, 6.5]), l: add(RACE, [x, 1.6, 0]), fov: 50 }, { p: add(RACE, [x + 3.5, 1.4, 6.0]), l: add(RACE, [x, 1.6, 0]), fov: 50 }, v, 1.0, f); K.focusOn(add(RACE, [x, 1.4, 0])); break; }
    case 16: { // but he died that same night: empty bed, his top hat on the pillow, candle
      K.preset('night', { exposure: 1.2 }); K.grade.sat.value = 0.85; SG.noche.visible = true; hatT.position.set(...add(NIGHT, [-1.4, 1.02, -3.25])); hatT.rotation.z = 0.2;
      K.move({ p: add(NIGHT, [1.4, 2.4, 2.4]), l: add(NIGHT, [-1.2, 1.1, -3.0]), fov: 46 }, { p: add(NIGHT, [0.9, 2.2, 1.4]), l: add(NIGHT, [-1.3, 1.1, -3.1]), fov: 44 }, u(16), 0.3, f); K.focusOn(add(NIGHT, [-1.3, 1.1, -3.2])); break; }
    case 17: { // first great train accident... at its own inauguration: top hat on the rail, ribbon, crowd silent
      K.preset('golden', { exposure: 1.45, photo: GOLDSKY }); cheer(t, 0); SG.ina.visible = true; hatT.position.set(...add(RAIL, [12, 0.16, T2 - 0.72])); hatT.rotation.z = Math.PI / 2;
      ribbon.position.set(...add(RAIL, [11.0, 0.06, T2 + 0.5])); ribbon.rotation.set(0, 0.5, Math.PI / 2);
      K.move({ p: add(RAIL, [15.5, 0.7, T2 + 2.6]), l: add(RAIL, [11.6, 0.4, T2 - 0.8]), fov: 44 }, { p: add(RAIL, [14.6, 0.6, T2 + 2.0]), l: add(RAIL, [11.8, 0.35, T2 - 0.8]), fov: 42 }, u(17), 0.2, f); K.focusOn(add(RAIL, [12, 0.3, T2 - 0.7])); break; }
    default: { // question + loop back to frame 0
      const v = u(18); hookShot(v, true); SG.hook.visible = false; SG.q.visible = true;
    }
  }
}
