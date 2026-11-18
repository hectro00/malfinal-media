// VID-025 — J. I. Rodale (1898–1971), organic-food pioneer. Taping The Dick Cavett Show (June 1971) he boasted he'd live to 100
// "unless I'm run down by a sugar-crazed taxi driver"; minutes later he slumped on the couch (heart attack). The episode never aired. No gore.
export let FRAMES = 2200;
const DAYSKY = 'kloofendal_48d_partly_cloudy_puresky_2k', DUSKSKY = 'qwantani_dusk_2_puresky_2k';
let K, T, RO, HO, GU, DR, TX, SG = {}, fans = [], cam, camLed, taxi, carrot, sugar, zz = [], tvGlow, tvScreen, sign100, lamps = [];
const STUDIO = [0, 0, 0], NYC = [200, 0, 0], FARM = [400, 0, 0], HOME = [600, 0, 0];
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
let _V = null; const _v = () => (_V = _V || new K.THREE.Vector3());
function holdW(C, obj, off = [0, -0.05, 0.05]) { C.root.updateMatrixWorld(true); const v = _v(); C.armR.end.getWorldPosition(v); obj.position.set(v.x + off[0], v.y + off[1], v.z + off[2]); obj.rotation.set(0, 0, 0); }
function fan(pos, col) { const g = new K.THREE.Group(); K.cyl(0.24, 0.28, 0.7, col, [0, 0.55, 0], { parent: g }); K.sph(0.3, 0xfde0c8, [0, 1.2, 0], { parent: g }); g.position.set(...pos); K.scene.add(g); fans.push({ g, base: pos.slice(), ph: Math.random() * 6 }); }
function cheer(t, a = 1) { fans.forEach(fa => { fa.g.position.y = fa.base[1] + Math.abs(Math.sin(t * 8 + fa.ph)) * 0.2 * a; fa.g.rotation.z = Math.sin(t * 6 + fa.ph) * 0.12 * a; }); }
function tvCam() { // 70s studio camera on a pedestal
  const g = new K.THREE.Group(); K.box(0.7, 0.6, 1.1, 0x3a3a40, [0, 1.6, 0], { parent: g, metalness: 0.4 }); const l = K.cyl(0.2, 0.24, 0.5, 0x1a1a1a, [0, 1.6, 0.75], { parent: g }); l.rotation.x = Math.PI / 2;
  K.cyl(0.16, 0.16, 0.02, 0x4a6ab8, [0, 1.6, 1.01], { parent: g, metalness: 0.9, roughness: 0.1 }).rotation.x = Math.PI / 2;
  K.cyl(0.08, 0.08, 1.3, 0x5a5a60, [0, 0.65, 0], { parent: g }); K.cyl(0.5, 0.5, 0.1, 0x2a2a2a, [0, 0.05, 0], { parent: g });
  camLed = K.sph(0.06, 0xff2020, [0.2, 1.98, 0.3], { parent: g, emissive: 0xff0000, emissiveIntensity: 6 }); K.sign('CBS', [0, 1.62, -0.56], { w: 0.5, h: 0.22, bg: '#2a2a30' }).visible = false;
  K.scene.add(g); return g;
}
function makeTaxi() {
  const g = new K.THREE.Group(); K.box(1.9, 0.7, 4.2, 0xf2c014, [0, 0.75, 0], { parent: g, metalness: 0.3, roughness: 0.4 }); K.box(1.7, 0.6, 2.0, 0xf2c014, [0, 1.4, -0.2], { parent: g });
  K.box(1.6, 0.5, 0.05, 0x9ac8e8, [0, 1.42, 0.82], { parent: g, metalness: 0.6, roughness: 0.1 });
  for (const s of [-1, 1]) for (const z of [-1.3, 1.3]) { const w = K.cyl(0.36, 0.36, 0.25, 0x1a1a1a, [s * 0.95, 0.36, z], { parent: g }); w.rotation.z = Math.PI / 2; }
  for (const s of [-0.6, 0.6]) K.sph(0.13, 0xfff4c0, [s, 0.85, 2.1], { parent: g, emissive: 0xfff0a0, emissiveIntensity: 3 });
  K.box(0.7, 0.22, 0.3, 0xffffff, [0, 1.82, -0.2], { parent: g, emissive: 0xffe080, emissiveIntensity: 1 });
  for (let i = 0; i < 6; i++) K.box(1.92, 0.12, 0.25, i % 2 ? 0x1a1a1a : 0xf2f2f2, [0, 0.95, -1.2 + i * 0.25], { parent: g });
  K.scene.add(g); return g;
}

export async function build(k) {
  K = k; await K.preloadEnvs(); await K.preloadSkies([DAYSKY, DUSKSKY]); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  RO = C(K.scene, { shirt: 0x8a8a90, buttons: 0x2a2a2a, tie: 0x2a5a2a, glasses: true, hair: 0xe0e0e0, seed: 21 });
  HO = C(K.scene, { shirt: 0x1e2a4a, buttons: 0xe0e0e0, tie: 0xb8301e, hair: 0x5a3a20, seed: 22 });
  GU = C(K.scene, { shirt: 0x8a5a2a, tie: 0xe0b040, hair: 0x1a1210, mustache: true, seed: 23 });
  DR = C(K.scene, { shirt: 0xf2f2f2, buttons: 0x2a6aa8, glasses: true, hair: 0x2a1a10, seed: 24 });
  TX = C(K.scene, { shirt: 0x3a6a3a, hat: 'cap', hatColor: 0x1a1a1a, hair: 0x2a1a10, mustache: true, seed: 25 });
  carrot = new K.THREE.Group(); const cr = K.cyl(0.07, 0.01, 0.45, 0xf07a1a, [0, 0, 0], { parent: carrot }); cr.rotation.x = Math.PI; for (let i = 0; i < 3; i++) K.box(0.03, 0.18, 0.01, 0x3a9a3a, [-0.04 + i * 0.04, 0.3, 0], { parent: carrot }); K.scene.add(carrot);
  sugar = new K.THREE.Group(); K.box(0.4, 0.55, 0.25, 0xf2f2f2, [0, 0, 0], { parent: sugar }); const sl = K.sign('AZÚCAR', [0, 0, 0.13], { w: 0.38, h: 0.2, bg: '#2a6aa8', border: '#ffffff' }); sugar.add(sl); K.scene.add(sugar);
  for (let i = 0; i < 3; i++) zz.push(K.sign('Z', [0, -99, 0], { w: 0.4, h: 0.4, bg: '#2a6aa8', border: '#ffffff' }));
  cam = tvCam(); taxi = makeTaxi();

  // ---------------- STUDIO: 1971 talk show — blue set, skyline backdrop, desk, couch, bleachers ----------------
  K.plane(30, 30, K.pbr('dark_wood', [6, 6]), add(STUDIO, [0, 0.01, 0]));
  K.cyl(4.2, 4.2, 0.2, 0x8a5a3a, add(STUDIO, [0.5, 0.1, -1.5]), { map: K.pbr('wood_floor', [3, 3]).map, seg: 48 });
  const sky = K.tex(1024, 512, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1a2a6a'); gr.addColorStop(1, '#6a4a8a'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) { const bw = 30 + (i * 37) % 50, bh = 120 + (i * 71) % 260, x = i * 40; c.fillStyle = '#0e1430'; c.fillRect(x, h - bh, bw, bh); c.fillStyle = '#ffd870'; for (let y = h - bh + 10; y < h - 8; y += 18) for (let xx = x + 5; xx < x + bw - 6; xx += 12) if ((xx + y + i) % 3) c.fillRect(xx, y, 5, 8); } });
  K.plane(16, 6, K.std(0xffffff, { map: sky, emissive: 0x222244 }), add(STUDIO, [0.5, 3, -5.2]), [0, 0, 0]);
  const curt = K.pbr('painted_plaster_wall', [4, 2], { tint: 0x3a4aa8 }); K.plane(16, 7, curt, add(STUDIO, [-7, 3.5, 0]), [0, Math.PI / 2, 0]); K.plane(16, 7, curt, add(STUDIO, [8, 3.5, 0]), [0, -Math.PI / 2, 0]);
  K.box(2.2, 1.0, 0.9, 0x6a3a1a, add(STUDIO, [2.6, 0.7, -2.2]), { map: K.pbr('wood_table_001', [1, 1]).map });
  await K.placeH('house_interior_pack/Chair_2', add(STUDIO, [2.6, 0.2, -3.0]), 0, 1.0).catch(() => {});
  await K.placeH('house_interior_pack/Couch_Medium1', add(STUDIO, [-0.9, 0.2, -2.6]), 0, 0.9, { tint: 0xb8301e }).catch(() => {});
  await K.placeH('house_interior_pack/Houseplant_5', add(STUDIO, [-3.6, 0.2, -3.6]), 0, 1.6).catch(() => {});
  await K.placeH('house_interior_pack/Houseplant_2', add(STUDIO, [4.4, 0.2, -3.4]), 0, 1.4).catch(() => {});
  await K.placeH('house_interior_pack/Table_RoundSmall', add(STUDIO, [0.9, 0.2, -2.1]), 0, 0.5).catch(() => {});
  for (let i = 0; i < 6; i++) { const x = -4 + i * 1.8; K.cyl(0.18, 0.25, 0.5, 0x1a1a1a, add(STUDIO, [x, 5.6, 1.5])); lamps.push(K.sph(0.16, 0xfff4d8, add(STUDIO, [x, 5.35, 1.55]), { emissive: 0xfff0c0, emissiveIntensity: 3 })); }
  for (let r = 0; r < 3; r++) { K.box(14, 0.4, 1.3, 0x4a2a1a, add(STUDIO, [0.5, 0.2 + r * 0.5, 4.6 + r * 1.3])); for (let i = 0; i < 12; i++) fan(add(STUDIO, [-5 + i * 0.95 + (r % 2) * 0.4, 0.4 + r * 0.5, 4.6 + r * 1.3]), [0xb8301e, 0x2a6aa8, 0xe0a030, 0x3a8a3a, 0x8a2a6a, 0xf2ead8][(i + r) % 6]); }
  fans.forEach(fa => fa.g.rotation.y = Math.PI);
  K.pointLight(0xfff0d8, 7, add(STUDIO, [0.5, 4.5, 1.0]), 12); K.pointLight(0x8aa0ff, 3, add(STUDIO, [-4, 3, -3]), 9); K.pointLight(0xffc890, 3, add(STUDIO, [0.5, 3, 5]), 10);
  SG.air = K.sign('AL AIRE', add(STUDIO, [-3.2, 4.4, -5.0]), { w: 2.2, h: 0.8, bg: '#d7262a', border: '#ffffff' });
  SG.mejor = K.sign('¡NUNCA ME SENTÍ MEJOR!', add(STUDIO, [0.5, 4.6, -5.0]), { w: 5.4, h: 0.9, bg: '#2a6a2a', border: '#ffe9a8' });
  SG.med = K.sign('¡UN MÉDICO!', add(STUDIO, [0.5, 4.6, -5.0]), { w: 3.4, h: 0.9, bg: '#d7262a', border: '#ffffff' });
  SG.ed = K.sign('72 AÑOS', add(STUDIO, [0.5, 4.6, -4.98]), { w: 2.6, h: 0.9, bg: '#1a1a2a', border: '#e0b040' });
  SG.q = K.sign('¿HABRÍAS SEGUIDO GRABANDO?', add(STUDIO, [0.5, 4.6, -4.96]), { w: 6.0, h: 0.95, bg: '#d7262a', border: '#ffe9a8' });
  sign100 = K.sign('¡VIVIRÉ 100 AÑOS!', add(STUDIO, [0.5, 3.6, -4.9]), { w: 4.4, h: 0.9, bg: '#e0b040', fg: '#1a1210', border: '#1a1210' });

  // ---------------- NYC: 1971 avenue — towers, yellow cabs, streetlights ----------------
  K.plane(200, 16, K.pbr('checkered_pavement_tiles', [40, 4], { tint: 0x7a7a80 }), add(NYC, [0, 0.01, 6]));
  K.plane(200, 10, K.std(0x2a2a2e), add(NYC, [0, 0.015, 0]));
  for (let i = 0; i < 30; i++) K.box(0.3, 0.02, 2.0, 0xf2f2f2, add(NYC, [-60 + i * 4, 0.03, 0]));
  const tw = K.pbr('red_brick', [3, 8], { tint: 0xb89a8a }), tw2 = K.pbr('beige_wall_001', [3, 8], { tint: 0x9aa0b0 });
  for (let i = 0; i < 18; i++) { const h = 14 + (i * 13) % 22, x = -36 + i * 4.6; const m = i % 2 ? tw : tw2; K.box(4.2, h, 5, 0xffffff, add(NYC, [x, h / 2, -9 - (i % 3)]), { map: m.map, normalMap: m.normalMap });
    for (let y = 2; y < h - 1; y += 2.2) for (const dx of [-1.2, 0, 1.2]) if ((i + y + dx * 3) % 3 > 0.5) K.box(0.6, 0.9, 0.05, 0xffd870, add(NYC, [x + dx, y, -6.45 - (i % 3)]), { emissive: 0xffb040, emissiveIntensity: 1.4 }); }
  for (let i = 0; i < 8; i++) await K.placeH('street_pack/Streetlight_Single', add(NYC, [-20 + i * 6, 0, 5.5]), Math.PI, 4.2).catch(() => {});
  for (let i = 0; i < 3; i++) { const t2 = makeTaxi(); t2.position.set(...add(NYC, [-14 + i * 9, 0, -2.6])); t2.rotation.y = Math.PI / 2; }
  SG.ny = K.sign('NUEVA YORK · 1971', add(NYC, [-1.5, 3.4, 4.4]), { w: 4.4, h: 0.95, bg: '#1e2a4a', border: '#e0b040', posts: true, rotY: 0.2 });
  SG.show = K.sign('EL SHOW MÁS FAMOSO', add(NYC, [3, 5.2, -6.3]), { w: 6.0, h: 1.2, bg: '#d7262a', border: '#ffe9a8' });
  SG.cien = K.sign('100 AÑOS', add(NYC, [-4, 3.4, 4.4]), { w: 2.8, h: 0.95, bg: '#e0b040', fg: '#1a1210', border: '#1a1210', posts: true });

  // ---------------- FARM: Pennsylvania organic farm — crops, barn, fence ----------------
  K.plane(160, 90, K.pbr('forrest_ground_01', [30, 18], { tint: 0xa8c870 }), add(FARM, [0, 0.01, 0]));
  for (let r = 0; r < 5; r++) for (let i = 0; i < 9; i++) await K.placeH('crops_pack/' + ['Carrot_3', 'Lettuce_3', 'Beet_3', 'Carrot_4', 'Corn_3'][r % 5], add(FARM, [-4 + i * 1.0, 0, -1.5 - r * 1.2]), i, 0.6).catch(() => {});
  K.box(6, 4, 5, 0xb8301e, add(FARM, [6, 2, -9]), { map: K.pbr('brown_planks_03', [3, 2], { tint: 0xd85040 }).map }); K.box(6.4, 0.3, 5.4, 0x3a2a1a, add(FARM, [6, 4.1, -9]));
  for (let i = 0; i < 10; i++) await K.placeH('nature_pack/CommonTree_' + ((i % 5) + 1), add(FARM, [-24 + i * 5.5, 0, -14 - (i % 2) * 4]), i, 6).catch(() => {});
  for (let i = 0; i < 8; i++) await K.placeH('medieval_village_pack/Fence', add(FARM, [-6 + i * 2.0, 0, 2.6]), 0, 1.0).catch(() => {});
  await K.placeH('house_interior_pack/Trashcan_Cylindric', add(FARM, [1.6, 0, 0.6]), 0, 0.9).catch(() => {});
  SG.org = K.sign('100% ORGÁNICO', add(FARM, [-3.2, 2.6, -0.6]), { w: 3.6, h: 0.9, bg: '#2a6a2a', border: '#ffe9a8', posts: true, rotY: 0.25 });
  SG.noaz = K.sign('CERO AZÚCAR', add(FARM, [3.6, 2.6, -0.8]), { w: 3.2, h: 0.9, bg: '#d7262a', border: '#ffffff', posts: true, rotY: -0.25 });

  // ---------------- HOME: 1971 living room, an old TV with static ----------------
  K.plane(14, 14, K.pbr('dirty_carpet', [4, 4], { tint: 0xc8a878 }), add(HOME, [0, 0.01, 0]));
  const wp = K.pbr('painted_plaster_wall', [4, 2], { tint: 0xd8b870 }); K.plane(14, 6, wp, add(HOME, [0, 3, -4]), [0, 0, 0]); K.plane(12, 6, wp, add(HOME, [-5, 3, 1]), [0, Math.PI / 2, 0]);
  await K.placeH('house_interior_pack/Couch_Large1', add(HOME, [0, 0, 2.0]), Math.PI, 1.0, { tint: 0xa86a3a }).catch(() => {});
  await K.placeH('house_interior_pack/Light_Floor2', add(HOME, [-2.4, 0, -2.8]), 0, 1.8).catch(() => {});
  await K.placeH('house_interior_pack/Houseplant_1', add(HOME, [2.6, 0, -3.2]), 0, 1.2).catch(() => {});
  K.box(1.6, 1.2, 1.0, 0x5a3a1a, add(HOME, [0, 1.0, -3.2]), { map: K.pbr('dark_wood', [1, 1]).map }); for (const s of [-0.5, 0.5]) K.box(0.08, 0.5, 0.08, 0x2a1a10, add(HOME, [s, 0.25, -3.2]));
  tvScreen = K.plane(1.1, 0.85, K.std(0x9aa0a8, { emissive: 0x9aa8c0, emissiveIntensity: 0.9 }), add(HOME, [-0.15, 1.02, -2.69]), [0, 0, 0]);
  tvGlow = K.pointLight(0x9ab8ff, 3, add(HOME, [0, 1.2, -2.0]), 6);
  SG.noemi = K.sign('NUNCA SE EMITIÓ', add(HOME, [0, 2.4, -3.9]), { w: 3.8, h: 0.9, bg: '#1a1a2a', border: '#e0b040' });
}

function hideAll() {
  for (const c of [RO, HO, GU, DR, TX]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.hold(null); c.neck.rotation.set(0, 0, 0); }
  for (const g of Object.values(SG)) g.visible = false;
  for (const fa of fans) { fa.g.position.set(...fa.base); fa.g.rotation.set(0, Math.PI, 0); }
  for (const o of [carrot, sugar, taxi, cam]) { o.position.set(0, -99, 0); o.rotation.set(0, 0, 0); }
  for (const z of zz) z.position.set(0, -99, 0);
  sign100.position.set(...add(STUDIO, [0.5, 3.6, -4.9])); sign100.rotation.set(0, 0, 0); sign100.visible = false; camLed.visible = true; lamps.forEach(l => (l.visible = true));
}
const COUCH = add(STUDIO, [-0.9, 0.25, -2.35]), HOST = add(STUDIO, [2.6, 0.25, -2.95]), GUEST = add(STUDIO, [0.1, 0.25, -2.4]);
function seated(f, t, o = {}) { // the three on set: host behind desk, guest chair, Rodale on the couch
  P(HO, { pos: HOST, yaw: o.hy ?? -0.5, sit: 1, expr: o.he || 'happy', talk: o.ht || 0, arms: o.ha || 'down', lean: o.hl || 0 }, f);
  if (o.guest) P(GU, { pos: GUEST, yaw: 0.5, sit: 1, expr: 'happy', talk: o.gt || 0, arms: 'shrug' }, f);
  P(RO, { pos: COUCH, yaw: o.ry ?? 0.35, sit: 1, expr: o.re || 'happy', arms: o.ra || 'down', lean: o.rl || 0, talk: o.rt || 0 }, f);
  if (o.tilt) { RO.neck.rotation.z = -o.tilt * 0.7; RO.neck.rotation.x = o.tilt * 0.35; }
}
function hookShot(f, t, v, rev) { // frame 0: Rodale's head drops on the couch while the host keeps smiling — ON AIR blinking, crowd laughing
  K.preset('interior', { exposure: 1.3 }); cheer(t, 0.8); SG.air.visible = Math.floor(t * 3) % 2 === 0;
  const k = rev ? 1 - v * 0.5 : Math.min(1, 0.4 + v * 1.2);
  seated(f, t, { guest: true, gt: 0.7, re: 'out', tilt: k, rl: 0.15 * k, he: 'laugh', ht: 0.6 });
  K.move({ p: add(COUCH, [1.6, 1.7, 3.6]), l: add(COUCH, [0.3, 1.3, 0]), fov: 46 }, { p: add(COUCH, [1.2, 1.6, 2.6]), l: add(COUCH, [0.1, 1.3, 0]), fov: 44 }, v, 0.5, f); K.focusOn(add(COUCH, [0, 1.3, 0]));
}

export function frame(f, k) {
  hideAll(); const ph = K.at(f), t = f / 30, u = (i) => K.u(f, i);
  K.preset('interior', { exposure: 1.3 });
  switch (ph) {
    case 0: { if (u(0) < 0.06) K.grade.flash.value = 0.5 * (1 - u(0) / 0.06); hookShot(f, t, u(0)); break; }
    case 1: { // the cameras kept rolling: push into the camera lens, red light blinking
      const v = u(1); cam.position.set(...add(STUDIO, [1.0, 0.2, 2.2])); cam.rotation.y = Math.PI - 0.15; camLed.visible = Math.floor(t * 4) % 2 === 0; SG.air.visible = true;
      seated(f, t, { re: 'out', tilt: 1, guest: true, gt: 0.6 });
      K.move({ p: add(STUDIO, [2.6, 2.0, 5.0]), l: add(STUDIO, [1.0, 1.7, 2.2]), fov: 44 }, { p: add(STUDIO, [1.8, 1.9, 4.0]), l: add(STUDIO, [1.0, 1.7, 2.2]), fov: 40 }, v, 0.3, f); K.focusOn(add(STUDIO, [1.0, 1.7, 2.2])); break; }
    case 2: { // New York 1971: Rodale power-walking down the avenue munching a carrot, cabs behind
      K.preset('day', { exposure: 1.05, photo: DAYSKY }); SG.ny.visible = true; const v = u(2); const p = add(NYC, [-6 + 4 * v, 0, 3.4]);
      P(RO, { pos: p, yaw: Math.PI / 2, walk: t * 2.2, expr: 'proud', arms: 'hold' }, f); holdW(RO, carrot, [0, 0.05, 0.05]); carrot.rotation.z = 0.5;
      K.move(K.frame([p], { yaw: 0.55, h: 2.6, lookY: 1.6, pitch: -0.05, push: 1.0 }), K.frame([p], { yaw: 0.35, h: 2.6, lookY: 1.6, pitch: -0.06, push: 0.9 }), v, 0.4, f); K.focusOn(add(p, [0, 1.6, 0])); break; }
    case 3: { // organic food, no sugar: on his farm he bins a sugar bag, crops all around
      K.preset('day', { exposure: 1.05, photo: DAYSKY }); SG.org.visible = SG.noaz.visible = true; const v = u(3); const p = add(FARM, [0.2, 0, 0.8]);
      P(RO, { pos: p, yaw: 0.6, expr: v < 0.5 ? 'angry' : 'smug', arms: v < 0.5 ? 'hold' : 'point' }, f);
      if (v < 0.45) holdW(RO, sugar, [0, -0.1, 0.1]); else { const k2 = Math.min(1, (v - 0.45) / 0.25); sugar.position.set(...K.lerp(add(p, [0.6, 1.4, 0.3]), add(FARM, [1.6, 0.9, 0.6]), k2)); sugar.position.y += Math.sin(k2 * Math.PI) * 0.8; sugar.rotation.z = k2 * 3; }
      K.move(K.frame([p, add(FARM, [1.6, 0, 0.6])], { yaw: 0.25, h: 2.6, lookY: 1.5, pitch: -0.05, push: 1.0 }), K.frame([p, add(FARM, [1.6, 0, 0.6])], { yaw: 0.05, h: 2.6, lookY: 1.5, pitch: -0.06, push: 0.9 }), v, 0.3, f); K.focusOn(add(p, [0.5, 1.4, 0])); break; }
    case 4: { // invited to the most famous show: dusk avenue, marquee, he walks to the stage door
      K.preset('dusk', { exposure: 1.2, photo: DUSKSKY }); SG.show.visible = true; const v = u(4); const p = add(NYC, [1.0 + 1.6 * v, 0, 1.8 - 3.0 * v]);
      P(RO, { pos: p, yaw: Math.PI - 0.4, walk: t * 2, expr: 'happy', arms: 'wave' }, f);
      K.move({ p: add(NYC, [-1.5, 1.4, 8.5]), l: add(NYC, [2.5, 3.2, -4]), fov: 48 }, { p: add(NYC, [-0.8, 1.2, 7.2]), l: add(NYC, [3, 4.0, -5]), fov: 46 }, v, 0.3, f); K.focusOn(add(p, [0, 1.6, 0])); break; }
    case 5: { // walks on stage, waves at the crowd, brags "never felt better"
      cheer(t, 1); SG.mejor.visible = u(5) > 0.5; const v = u(5); const p = add(STUDIO, [-3.0 + 2.4 * Math.min(1, v * 1.6), 0.2, -1.2]);
      P(RO, { pos: p, yaw: v < 0.6 ? Math.PI / 2 : 0.2, walk: v < 0.6 ? t * 2 : 0, expr: 'proud', arms: v < 0.6 ? 'wave' : 'fists', talk: v > 0.6 ? 0.8 : 0 }, f);
      P(HO, { pos: add(STUDIO, [1.4, 0.2, -1.4]), yaw: -0.8, expr: 'happy', arms: 'wave' }, f);
      K.move(K.frame([p, add(STUDIO, [1.4, 0, -1.4])], { yaw: 0.1, h: 2.8, lookY: 1.7, pitch: -0.04, push: 1.0, pad: 1.25 }), K.frame([p, add(STUDIO, [1.4, 0, -1.4])], { yaw: -0.05, h: 2.8, lookY: 1.7, pitch: -0.05, push: 0.92, pad: 1.25 }), v, 0.3, f); K.focusOn(add(p, [0, 1.7, 0])); break; }
    case 6: { // gag: "unless a sugar-crazed taxi driver runs me over" — cab charging at the lens, driver gobbling candy
      K.preset('day', { exposure: 1.05, photo: DAYSKY }); SG.cien.visible = true; const v = u(6); const z = -14 + 13 * v;
      taxi.position.set(...add(NYC, [0.5, 0.05 + Math.abs(Math.sin(t * 14)) * 0.08, z])); taxi.rotation.set(0, Math.sin(t * 7) * 0.12, Math.sin(t * 9) * 0.04);
      P(TX, { pos: add(NYC, [0.1, 0.55, z + 0.1]), yaw: 0, sit: 1, expr: 'laugh', arms: 'up', bounce: 1.5 }, f);
      K.move({ p: add(NYC, [1.6, 1.0, 4.5]), l: add(NYC, [0.3, 1.3, -6]), fov: 48 }, { p: add(NYC, [1.6, 0.9, 4.8]), l: add(NYC, [0.3, 1.2, -2]), fov: 50 }, v, 0.9, f); K.focusOn(add(NYC, [0.5, 1.2, z + 1.5])); break; }
    case 7: { // the crowd laughs its head off — reverse shot on the bleachers
      cheer(t, 1.6); const v = u(7);
      K.move({ p: add(STUDIO, [0.5, 2.0, 1.0]), l: add(STUDIO, [0.5, 1.4, 6]), fov: 50 }, { p: add(STUDIO, [-0.5, 2.2, 1.6]), l: add(STUDIO, [0.0, 1.5, 6]), fov: 46 }, v, 0.4, f); K.focusOn(add(STUDIO, [0.5, 1.2, 5.2])); break; }
    case 8: { // re-hook: dark close-up, his eyelids getting heavy
      K.grade.vig.value = 0.75; const v = u(8); if (v < 0.08) K.grade.flash.value = 0.35; K.preset('interior', { exposure: 1.05 });
      seated(f, t, { re: v < 0.5 ? 'neutral' : 'tired', rl: 0.05 });
      K.move({ p: add(COUCH, [0.8, 1.75, 1.5]), l: add(COUCH, [0.05, 1.55, 0]), fov: 40 }, { p: add(COUCH, [0.6, 1.7, 1.1]), l: add(COUCH, [0.05, 1.55, 0]), fov: 38 }, K.ease(v), 0.2, f); K.focusOn(add(COUCH, [0, 1.55, 0])); break; }
    case 9: { // host interviews the next guest... Rodale closes his eyes on the couch
      cheer(t, 0.2); const v = u(9); seated(f, t, { guest: true, gt: 0.8, hy: -0.9, ht: 0.5, re: v < 0.5 ? 'tired' : 'out', tilt: v > 0.6 ? 0.3 : 0 });
      K.move(K.frame([COUCH, GUEST, HOST], { yaw: 0.05, h: 2.4, lookY: 1.3, pitch: -0.04, push: 1.0, pad: 1.1 }), K.frame([COUCH, GUEST, HOST], { yaw: -0.08, h: 2.4, lookY: 1.3, pitch: -0.05, push: 0.92, pad: 1.1 }), v, 0.3, f); K.focusOn(add(GUEST, [0, 1.3, 0])); break; }
    case 10: { // head drops to one side — floating Z's like he's snoring
      const v = u(10); seated(f, t, { re: 'out', tilt: Math.min(1, v * 2), rl: 0.12 });
      zz.forEach((z, i) => { const k2 = (t * 0.6 + i / 3) % 1; z.position.set(...add(COUCH, [0.35 + k2 * 0.6, 1.9 + k2 * 1.0, 0.2])); z.scale.setScalar(0.6 + k2 * 0.6); });
      K.move({ p: add(COUCH, [1.2, 1.8, 2.4]), l: add(COUCH, [0.2, 1.6, 0]), fov: 42 }, { p: add(COUCH, [1.0, 1.8, 2.0]), l: add(COUCH, [0.2, 1.7, 0]), fov: 42 }, v, 0.2, f); K.focusOn(add(COUCH, [0.1, 1.5, 0])); break; }
    case 11: { // the host jokes: "are we boring you?" — leaning over the desk, smug grin
      cheer(t, 0.7); const v = u(11); seated(f, t, { hy: -1.1, he: 'smug', ht: 0.9, ha: 'point', hl: 0.2, re: 'out', tilt: 1, guest: true });
      K.move(K.frame([HOST, COUCH], { yaw: -0.5, h: 2.4, lookY: 1.3, pitch: -0.03, push: 0.95, pad: 1.1 }), K.frame([HOST, COUCH], { yaw: -0.6, h: 2.4, lookY: 1.3, pitch: -0.04, push: 0.86, pad: 1.1 }), v, 0.3, f); K.focusOn(add(HOST, [0, 1.3, 0])); break; }
    case 12: { // re-hook: crash zoom onto the motionless face, lights flicker
      const v = u(12); if (v < 0.1) K.grade.flash.value = 0.45; K.grade.vig.value = 0.8; lamps.forEach((l, i) => (l.visible = Math.floor(t * 10 + i) % 3 !== 0));
      K.preset('interior', { exposure: 0.95 + 0.2 * Math.sin(t * 25) }); seated(f, t, { re: 'out', tilt: 1, he: 'shock', hy: -1.0 });
      K.move({ p: add(COUCH, [3.5, 2.2, 6.0]), l: add(COUCH, [0.1, 1.5, 0]), fov: 46 }, { p: add(COUCH, [0.6, 1.7, 1.4]), l: add(COUCH, [0.1, 1.55, 0]), fov: 38 }, K.ease(Math.min(1, v * 1.8)), 0.6, f); K.focusOn(add(COUCH, [0, 1.5, 0])); break; }
    case 13: { // no answer: host on his feet, a doctor running down from the bleachers
      lamps.forEach(l => (l.visible = true)); cheer(t, 0); SG.med.visible = true; const v = u(13);
      P(HO, { pos: add(STUDIO, [1.6, 0.2, -1.6]), yaw: -0.4, expr: 'scared', arms: 'up' }, f);
      const d = K.lerp(add(STUDIO, [2.4, 0.2, 3.6]), add(STUDIO, [0.2, 0.2, -1.2]), v); P(DR, { pos: d, yaw: Math.PI + 0.5, run: t * 3, expr: 'worried', arms: 'reach' }, f);
      seated(f, t, { re: 'out', tilt: 1 }); HO.root.visible = true;
      K.move({ p: add(STUDIO, [-3.6, 2.2, 4.2]), l: add(STUDIO, [0.6, 1.2, 0]), fov: 48 }, { p: add(STUDIO, [-3.0, 2.0, 3.4]), l: add(STUDIO, [0.3, 1.2, -0.6]), fov: 46 }, v, 0.6, f); K.focusOn(add(STUDIO, [0.4, 1.3, -0.6])); break; }
    case 14: { // heart attack at 72: empty couch, his glasses-less carrot left on the cushion, one spotlight
      K.preset('interior', { exposure: 0.9 }); K.grade.sat.value = 0.75; K.grade.vig.value = 0.7; SG.ed.visible = true; lamps.forEach((l, i) => (l.visible = i === 2));
      carrot.position.set(...add(COUCH, [0.1, 0.62, 0.1])); carrot.rotation.set(0, 0, Math.PI / 2);
      K.move({ p: add(COUCH, [0.2, 1.8, 3.6]), l: add(COUCH, [0, 1.4, -0.5]), fov: 44 }, { p: add(COUCH, [0.1, 1.6, 2.8]), l: add(COUCH, [0, 1.2, -0.5]), fov: 42 }, u(14), 0.2, f); K.focusOn(add(COUCH, [0.1, 0.7, 0.1])); break; }
    case 15: { // the episode never aired: living-room TV hissing static
      K.preset('night', { exposure: 2.2 }); SG.noemi.visible = true; const v = u(15); tvScreen.material.emissiveIntensity = 0.6 + 0.6 * Math.abs(Math.sin(t * 37)); tvScreen.material.color.setHSL(0.6, 0.05, 0.4 + 0.3 * Math.abs(Math.sin(t * 53)));
      K.move({ p: add(HOME, [0.8, 1.6, 3.6]), l: add(HOME, [0, 1.2, -3]), fov: 46 }, { p: add(HOME, [0.4, 1.4, 1.6]), l: add(HOME, [0, 1.1, -3]), fov: 42 }, v, 0.2, f); K.focusOn(add(HOME, [0, 1.1, -2.7])); break; }
    case 16: { // gag: the "I'll live to 100!" banner drops off its hooks onto the empty stage
      K.preset('interior', { exposure: 1.0 }); K.grade.sat.value = 0.85; const v = u(16); sign100.visible = true; lamps.forEach((l, i) => (l.visible = i % 2 === 0));
      const dr = Math.max(0, (v - 0.3) / 0.5); sign100.rotation.z = Math.min(1, dr * 2) * 0.6; sign100.position.y = 3.6 - Math.min(1, dr) * dr * 3.0;
      K.move({ p: add(STUDIO, [0.5, 2.4, 2.2]), l: add(STUDIO, [0.5, 2.6, -4.9]), fov: 46 }, { p: add(STUDIO, [0.5, 2.0, 1.4]), l: add(STUDIO, [0.5, 1.8, -4.9]), fov: 46 }, v, 0.2, f); K.focusOn(add(STUDIO, [0.5, 2.6, -4.9])); break; }
    default: { const v = u(17); hookShot(f, t, v, true); SG.air.visible = false; SG.q.visible = true; }
  }
}
