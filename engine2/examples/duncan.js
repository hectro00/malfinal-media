// VID-030 — Isadora Duncan (1877–1927), mother of modern dance. Nice, 14 Sep 1927: she got into a young man's open sports car,
// shouted "Adieu, mes amis. Je vais à la gloire!", and her long silk scarf caught in the spoked rear wheel. Death implied, no gore.
export let FRAMES = 2200;
const DAYSKY = 'kloofendal_48d_partly_cloudy_puresky_2k', DUSK = 'qwantani_dusk_2_puresky_2k';
let K, T, ISA, BEN, FR1, FR2, STF, SG = {}, fans = [], scarf = [], loops, car, wheels = [], carBody, palms = [];
const STAGE = [0, 0, 0], CITY = [200, 0, 0], NICE = [400, 0, 0];
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
const SILK = 0xd8402a, NS = 18, SEGL = 0.2;
let seed = 5; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const CLR = [0xb8301e, 0x2a6aa8, 0xe0a030, 0x3a8a3a, 0x8a2a6a, 0xf2ead8, 0x1e6a6a];
function fan(pos, col, a) { const g = new K.THREE.Group(); K.cyl(0.24, 0.3, 0.7, col, [0, 0.55, 0], { parent: g }); K.sph(0.3, 0xe8c8a0, [0, 1.2, 0], { parent: g }); g.position.set(...pos); g.rotation.y = a; K.scene.add(g); fans.push({ g, base: pos.slice(), ph: rnd() * 6, a }); }
function cheer(t, a = 1) { fans.forEach(fa => { fa.g.position.y = fa.base[1] + Math.abs(Math.sin(t * 8 + fa.ph)) * 0.2 * a; }); }
function dress(C, col) { const s = K.cyl(0.2, 0.44, 0.62, col, [0, -0.22, 0], { parent: C.hips, roughness: 0.6, seg: 24 }); return s; }
const V3 = () => new K.THREE.Vector3();
function neckPos(C) { C.root.updateMatrixWorld(true); const v = V3(); C.neck.getWorldPosition(v); return [v.x, v.y - 0.02, v.z]; }
// scarf: chain of silk segments from anchor along dir, waving; optional wrap onto a wheel (center, axis z) after catchS
function scarfPath(anchor, dir, t, o = {}) {
  const pts = [anchor]; const amp = o.amp ?? 0.12, droop = o.droop ?? 0.02; const side = [-dir[2], 0, dir[0]];
  for (let i = 1; i <= NS; i++) { const s = i * SEGL; const w = Math.sin(t * (o.speed ?? 11) - s * 2.6) * amp * Math.min(1, s);
    let p = add(anchor, [dir[0] * s + side[0] * w, dir[1] * s - droop * s * s + Math.sin(t * 9 - s * 3) * amp * 0.6 * Math.min(1, s), dir[2] * s + side[2] * w]);
    if (o.wheel && s > o.catchS) { const a0 = o.ang0 + (s - o.catchS) / o.r; p = [o.wheel[0] + Math.cos(a0) * o.r, o.wheel[1] + Math.sin(a0) * o.r, o.wheel[2]]; }
    if (o.floor !== undefined) p[1] = Math.max(o.floor, p[1]); pts.push(p); }
  return pts;
}
function drawScarf(pts) { scarf.forEach((m, i) => { const a = pts[i], b = pts[i + 1]; m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2); m.lookAt(b[0], b[1], b[2]); m.rotateZ(1.1); }); }
function wheel(r) { const g = new K.THREE.Group(); const tire = new K.THREE.Mesh(new K.THREE.TorusGeometry(r, 0.07, 10, 28), K.std(0x1a1a1a, { roughness: 0.8 })); g.add(tire);
  const rim = new K.THREE.Mesh(new K.THREE.TorusGeometry(r - 0.07, 0.02, 6, 28), K.std(0xd8d0c0, { metalness: 0.8, roughness: 0.3 })); g.add(rim);
  for (let i = 0; i < 12; i++) { const sp = K.box(0.018, r * 2 - 0.12, 0.018, 0xd8d0c0, [0, 0, 0], { parent: g, metalness: 0.8, roughness: 0.3 }); sp.rotation.z = i * Math.PI / 12; }
  K.cyl(0.07, 0.07, 0.12, 0xd8d0c0, [0, 0, 0], { parent: g, metalness: 0.8 }).rotation.x = Math.PI / 2; return g; }
function makeCar() { // small open two-seater racer, faces +x
  const g = new K.THREE.Group(); const R = 0xb8201a;
  carBody = K.box(2.8, 0.5, 1.1, R, [0, 0.55, 0], { parent: g, roughness: 0.25, metalness: 0.3 }); K.box(1.1, 0.42, 0.9, R, [1.15, 0.62, 0], { parent: g, roughness: 0.25, metalness: 0.3 });
  K.box(0.1, 0.4, 0.9, 0x8a8a8a, [1.72, 0.62, 0], { parent: g, metalness: 0.9, roughness: 0.2 }); K.cyl(0.11, 0.11, 0.06, 0xfff0c0, [1.75, 0.72, 0.32], { parent: g, emissive: 0xfff0c0, emissiveIntensity: 0.4 }).rotation.z = Math.PI / 2;
  for (const z of [-0.28, 0.28]) { K.box(0.12, 0.55, 0.46, 0x3a2a1a, [-0.55, 0.95, z], { parent: g, roughness: 0.7 }); K.box(0.5, 0.12, 0.46, 0x3a2a1a, [-0.32, 0.72, z], { parent: g, roughness: 0.7 }); }
  const sw = new K.THREE.Mesh(new K.THREE.TorusGeometry(0.15, 0.02, 6, 20), K.std(0x1a1a1a)); sw.position.set(0.05, 1.0, 0.28); sw.rotation.y = Math.PI / 2; sw.rotation.x = 0.5; g.add(sw);
  K.box(0.05, 0.25, 0.9, 0xcfe8ff, [0.35, 1.0, 0], { parent: g, transparent: true, opacity: 0.35, metalness: 0.5 });
  for (const [x, z] of [[1.05, 0.62], [1.05, -0.62], [-1.05, 0.62], [-1.05, -0.62]]) { const w = wheel(0.4); w.position.set(x, 0.4, z); g.add(w); wheels.push(w); }
  K.box(0.9, 0.05, 0.25, R, [1.05, 0.85, 0.62], { parent: g }); K.box(0.9, 0.05, 0.25, R, [1.05, 0.85, -0.62], { parent: g });
  K.scene.add(g); return g; }
const RW = [-1.05, 0.4, 0.62]; // rear wheel on Isadora's side (local)
const carW = (l) => { const v = new K.THREE.Vector3(...l); car.localToWorld(v); return [v.x, v.y, v.z]; };

export async function build(k) {
  K = k; await K.preloadEnvs(); await K.preloadSkies([DAYSKY, DUSK]); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  ISA = C(K.scene, { shirt: 0xf2ead8, belt: 0xd8a830, hair: 0x8a3a1a, seed: 61 }); dress(ISA, 0xf2ead8); K.sph(0.12, 0x8a3a1a, [0, 0.12, -0.27], { parent: ISA.head });
  BEN = C(K.scene, { shirt: 0x2a4a6a, belt: 0x1a1210, hat: 'cap', hatColor: 0x5a4a3a, hair: 0x2a1a10, glasses: true, seed: 62 });
  FR1 = C(K.scene, { shirt: 0x6a2a6a, belt: 0x1a1210, hair: 0x1a1210, mustache: true, seed: 63 });
  FR2 = C(K.scene, { shirt: 0x2a6a5a, hair: 0xd8b060, seed: 64 }); dress(FR2, 0x2a6a5a);
  STF = C(K.scene, { shirt: 0xf0a0b8, belt: 0x8a2a4a, hair: 0x1a1210, seed: 65 }); dress(STF, 0xf0a0b8);
  for (let i = 0; i < NS; i++) scarf.push(K.box(0.17, 0.05, SEGL + 0.03, SILK, [0, -99, 0], { roughness: 0.5, side: K.THREE.DoubleSide }));
  loops = new K.THREE.Group(); for (let i = 0; i < 2; i++) { const r = new K.THREE.Mesh(new K.THREE.TorusGeometry(0.2 - i * 0.015, 0.05, 8, 20), K.std(SILK, { roughness: 0.5 })); r.rotation.x = Math.PI / 2; r.position.y = i * 0.07; loops.add(r); } K.scene.add(loops);
  car = makeCar();

  // ---------------- STAGE: red velvet curtains, wooden boards, footlights, an audience ----------------
  K.plane(40, 40, K.pbr('wood_floor', [8, 8]), add(STAGE, [0, 0.01, 0]));
  K.box(14, 1.0, 6, 0xffffff, add(STAGE, [0, 0.5, -2]), { map: K.pbr('brown_planks_03', [4, 2]).map });
  K.box(14, 8, 0.3, 0x2a0a10, add(STAGE, [0, 4, -5.2]));
  for (let i = 0; i < 14; i++) K.cyl(0.32, 0.32, 8, 0x9a1020, add(STAGE, [-6.5 + i * 0.5 + (i > 6 ? 6 : 0), 4.5, -4.8 + (i % 2) * 0.2]), { roughness: 0.8, seg: 10 });
  K.box(14, 1.2, 0.5, 0x9a1020, add(STAGE, [0, 8.0, -4.6]), { roughness: 0.8 }); K.box(14.2, 0.2, 0.6, 0xd8a830, add(STAGE, [0, 7.4, -4.4]), { metalness: 0.6 });
  for (let i = 0; i < 12; i++) K.sph(0.08, 0xfff0c0, add(STAGE, [-5.5 + i, 1.05, 0.9]), { emissive: 0xffe0a0, emissiveIntensity: 1.2 });
  for (let r = 0; r < 4; r++) for (let i = 0; i < 12; i++) fan(add(STAGE, [-6 + i * 1.1 + (r % 2) * 0.5, -0.3 + r * 0.35, 3.2 + r * 1.1]), CLR[(i + r * 3) % CLR.length], Math.PI);
  K.pointLight(0xffe0b0, 6, add(STAGE, [0, 4.5, 2.5]), 12); K.pointLight(0xffb0a0, 3, add(STAGE, [-3, 3, -2]), 8); K.ray(add(STAGE, [0, 4.5, -1.0]), [0, 0, 0], 2.2, 7, 0xfff0d0, 0.14);
  SG.isa = K.sign('ISADORA DUNCAN', add(STAGE, [0, 6.4, -4.4]), { w: 5.0, h: 1.0, bg: '#1a1210', border: '#d8a830' });
  SG.desc = K.sign('DESCALZA · SIN CORSÉ', add(STAGE, [0, 6.4, -4.38]), { w: 5.4, h: 1.0, bg: '#d7262a', border: '#ffffff' });
  SG.q = K.sign('¿TE LA HABRÍAS PUESTO?', add(NICE, [0, 3.2, -4.0]), { w: 6.0, h: 1.0, bg: '#d7262a', border: '#ffe9a8' });

  // ---------------- CITY at night: theatre façades with her posters (Paris, London, New York) ----------------
  K.plane(80, 80, K.pbr('cobblestone_floor_04', [16, 16]), add(CITY, [0, 0.01, 0]));
  const bl = ['2Story_Columns_Mat', '3Story_Balcony_Mat', '2Story_Sign_Mat', '4Story_Center_Mat', '2Story_Wide_Mat'];
  for (let i = 0; i < 5; i++) await K.placeH('buildings_pack_3/' + bl[i], add(CITY, [-10 + i * 5, 0, -6]), 0, 7 + (i % 2) * 2).catch(() => {});
  for (let i = 0; i < 4; i++) await K.placeH('street_pack/Streetlight_Single', add(CITY, [-7.5 + i * 5, 0, -2.5]), 0, 4.2).catch(() => {});
  for (let i = 0; i < 4; i++) K.pointLight(0xffd8a0, 3, add(CITY, [-7.5 + i * 5, 3.8, -2.0]), 8);
  const poster = (txt, x) => { const g = new K.THREE.Group(); K.box(2.0, 2.8, 0.06, 0xf2e0c0, [0, 0, 0], { parent: g });
    const tx = K.tex(400, 560, (c, w, h) => { c.fillStyle = '#f2e0c0'; c.fillRect(0, 0, w, h); c.fillStyle = '#d7262a'; c.fillRect(0, 0, w, 90); c.fillStyle = '#fff'; c.font = 'bold 60px sans-serif'; c.textAlign = 'center'; c.fillText(txt, w / 2, 66);
      c.fillStyle = '#1a1210'; c.beginPath(); c.arc(200, 210, 46, 0, 7); c.fill(); c.fillRect(185, 250, 30, 140); c.strokeStyle = '#1a1210'; c.lineWidth = 14; c.beginPath(); c.moveTo(200, 280); c.lineTo(90, 200); c.moveTo(200, 280); c.lineTo(320, 190); c.moveTo(200, 385); c.lineTo(120, 500); c.moveTo(200, 385); c.lineTo(290, 480); c.stroke();
      c.strokeStyle = '#d8402a'; c.lineWidth = 16; c.beginPath(); c.moveTo(200, 250); c.bezierCurveTo(300, 260, 330, 360, 380, 330); c.stroke(); c.fillStyle = '#1a1210'; c.font = 'bold 40px serif'; c.fillText('ISADORA', w / 2, 540); });
    const pl = K.plane(1.9, 2.7, K.std(0xffffff, { map: tx }), [0, 0, 0.04], [0, 0, 0]); pl.removeFromParent(); g.add(pl); g.position.set(...add(CITY, [x, 2.0, -3.6])); K.scene.add(g); return g; };
  SG.p1 = poster('PARÍS', -3.2); SG.p2 = poster('LONDRES', 0); SG.p3 = poster('NUEVA YORK', 3.2);
  SG.lleno = K.sign('¡LLENO TOTAL!', add(CITY, [0, 4.3, -3.5]), { w: 4.0, h: 0.95, bg: '#d8a830', fg: '#1a1210', border: '#1a1210' });

  // ---------------- NICE: seaside promenade at dusk, palms, café terrace, the road ----------------
  K.plane(400, 400, K.std(0x2a6a9a, { roughness: 0.2, metalness: 0.25 }), add(NICE, [0, -0.3, 0]));
  K.plane(200, 14, K.pbr('checkered_pavement_tiles', [60, 4], { tint: 0xb8b0a0 }), add(NICE, [0, 0.01, -1]), [-Math.PI / 2, 0, 0]);
  K.plane(200, 4, K.pbr('cobblestone_floor_04', [60, 2], { tint: 0x808080 }), add(NICE, [0, 0.02, 1.2]), [-Math.PI / 2, 0, 0]);
  for (let i = 0; i < 12; i++) palms.push(await K.placeH('crops_pack/PalmTree_' + (1 + i % 4), add(NICE, [-30 + i * 5, 0, -4.5]), i, 6 + (i % 3)).catch(() => null));
  for (let i = 0; i < 6; i++) await K.placeH('buildings_pack_3/' + bl[i % 5], add(NICE, [-25 + i * 10, 0, -11]), 0, 8).catch(() => {});
  for (let i = 0; i < 3; i++) { await K.placeH('house_interior_pack/Chair_1', add(NICE, [-4.5 + i * 1.3, 0, -2.6]), Math.PI, 0.9).catch(() => {}); }
  K.cyl(0.5, 0.5, 0.06, 0xf2ead8, add(NICE, [-3.9, 0.78, -2.8])); K.cyl(0.05, 0.05, 0.78, 0x2a2a2a, add(NICE, [-3.9, 0.39, -2.8]));
  K.box(5, 0.08, 2.2, 0xd8402a, add(NICE, [-3.9, 2.6, -3.0])).rotation.x = 0.25;
  SG.nice = K.sign('NIZA · 1927', add(NICE, [3.5, 3.2, -3.8]), { w: 3.6, h: 0.95, bg: '#1e2a4a', border: '#e0b040' });
  SG.gloria = K.sign('«¡ME VOY A LA GLORIA!»', add(NICE, [0, 3.2, -3.9]), { w: 6.2, h: 1.0, bg: '#1a1210', border: '#d8a830' });
  SG.radios = K.sign('RUEDAS DE RADIOS', add(NICE, [2.0, 3.2, -3.85]), { w: 4.6, h: 0.95, bg: '#1a1210', border: '#d7262a' });
  K.pointLight(0xffc890, 4, add(NICE, [-3.9, 2.4, -2.4]), 8);
}

function hideAll() {
  for (const c of [ISA, BEN, FR1, FR2, STF]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.hold(null); c.neck.rotation.set(0, 0, 0); }
  for (const g of Object.values(SG)) g.visible = false;
  scarf.forEach(m => m.position.set(0, -99, 0)); loops.position.set(0, -99, 0);
  car.position.set(0, -99, 0); car.rotation.set(0, 0, 0);
  for (const fa of fans) fa.g.position.set(...fa.base);
}
function placeCar(x, t, spin, z = 1.2) { car.position.set(...add(NICE, [x, 0, z])); wheels.forEach(w => w.rotation.z = -spin); return car.position; }
function isaInCar(f, o = {}) { const p = carW([-0.32, 0.0, 0.28]); P(ISA, { pos: p, yaw: o.yaw ?? Math.PI / 2 - 0.5, sit: true, arms: o.arms || 'wave', expr: o.expr || 'happy', talk: o.talk || 0, lean: o.lean || 0 }, f); ISA.root.position.y = p[1] + 0.02; return p; }
function benInCar(f, o = {}) { const p = carW([-0.32, 0.0, -0.28]); P(BEN, { pos: p, yaw: Math.PI / 2 + 0.2, sit: true, arms: o.arms || 'reach', expr: o.expr || 'smug' }, f); return p; }
function neckLoops(C) { const n = neckPos(C); loops.position.set(n[0], n[1] - 0.05, n[2]); return n; }
function hookShot(f, t, v, end) { // frame 0: the car racing along the promenade at dusk, the scarf streaming back toward the spinning rear wheel
  K.preset('day', { exposure: 0.95, photo: DUSK, sunDir: [0.25, 1.0, -0.15] }); const x = -2 + v * 3; placeCar(x, t, t * 14); isaInCar(f, { arms: 'up', expr: v > 0.6 && !end ? 'shock' : 'laugh' }); benInCar(f);
  const n = neckLoops(ISA); drawScarf(scarfPath(n, [-0.93, -0.25, 0.25], t, { amp: 0.16, droop: 0.03, floor: 0.08 }));
  const rw = carW(RW); K.move({ p: add(rw, [2.6, 1.0, 2.6]), l: add(rw, [0.5, 0.75, -0.1]), fov: 50 }, { p: add(rw, [2.3, 0.95, 2.2]), l: add(rw, [0.5, 0.8, -0.1]), fov: 48 }, v, 0.6, f); K.focusOn(add(rw, [0.3, 0.6, 0]));
}

export function frame(f, k) {
  hideAll(); const ph = K.at(f), t = f / 30, u = (i) => K.u(f, i);
  K.preset('day', { exposure: 0.95, photo: DUSK, sunDir: [0.25, 1.0, -0.15] });
  if (f < 10) K.grade.whip.value = 0;
  switch (ph) {
    case 0: { if (u(0) < 0.05) K.grade.flash.value = 0.4 * (1 - u(0) / 0.05); hookShot(f, t, u(0)); break; }
    case 1: { // what she shouted makes it worse: close on Isadora standing in the parked car, arms open, shouting
      K.grade.vig.value = 0.7; const v = u(1); placeCar(0, t, 0); const p = carW([-0.32, 0.25, -0.28]);
      P(ISA, { pos: p, yaw: Math.PI - 0.5, arms: 'up', expr: 'laugh', talk: 1 }, f); const n = neckLoops(ISA); drawScarf(scarfPath(n, [-0.5, -0.8, -0.3], t, { amp: 0.08, droop: 0.05, floor: 0.4, speed: 4 }));
      K.move({ p: add(p, [0.4, 1.4, -3.0]), l: add(p, [0, 1.75, 0]), fov: 46 }, { p: add(p, [0.3, 1.45, -2.4]), l: add(p, [0, 1.8, 0]), fov: 44 }, v, 0.3, f); K.focusOn(add(p, [0, 1.8, 0])); break; }
    case 2: { // the dancer who changed dance: on stage, spinning, arms up, scarf flowing
      K.preset('interior', { exposure: 1.15 }); SG.isa.visible = true; cheer(t, 0.4); const v = u(2); const p = add(STAGE, [0.8 - v * 1.6, 1.0, -1.2]);
      P(ISA, { pos: p, yaw: t * 2.2, arms: 'up', expr: 'happy', bounce: 0.6 }, f); const n = neckPos(ISA); const a = t * 2.2 + Math.PI; drawScarf(scarfPath(n, [Math.sin(a) * 0.8, -0.35, Math.cos(a) * 0.8], t, { amp: 0.18, floor: 1.05 }));
      K.move(K.frame([p], { yaw: 0.25, h: 2.4, lookY: 1.3, pitch: 0.0, push: 1.1 }), K.frame([p], { yaw: 0.1, h: 2.4, lookY: 1.3, pitch: -0.02, push: 1.0 }), v, 0.3, f); K.focusOn(add(p, [0, 1.3, 0])); break; }
    case 3: { // barefoot, Greek tunic — next to a stiff dancer in a pink corset who can barely move
      K.preset('interior', { exposure: 1.15 }); SG.desc.visible = true; const v = u(3); const p = add(STAGE, [-1.0, 1.0, -1.0]), q = add(STAGE, [1.2, 1.0, -1.4]);
      P(ISA, { pos: p, yaw: t * 1.8, arms: 'wave', expr: 'happy', bounce: 0.8 }, f); P(STF, { pos: q, yaw: -0.4, arms: 'akimbo', expr: 'tired', tremble: 0.2 }, f);
      const n = neckPos(ISA); const a = t * 1.8 + Math.PI; drawScarf(scarfPath(n, [Math.sin(a) * 0.8, -0.4, Math.cos(a) * 0.8], t, { amp: 0.16, floor: 1.05 }).slice(0, NS + 1));
      K.move(K.frame([p, q], { yaw: 0.1, h: 2.4, lookY: 1.3, pitch: -0.02, push: 0.95 }), K.frame([p, q], { yaw: -0.05, h: 2.4, lookY: 1.3, pitch: -0.03, push: 0.88 }), v, 0.3, f); K.focusOn(add(p, [1, 1.3, 0])); break; }
    case 4: { // packed theatres in Paris, London, New York: tracking past three posters at night
      K.preset('night', { exposure: 2.4 }); const v = u(4); SG.p1.visible = SG.p2.visible = SG.p3.visible = true; SG.lleno.visible = v > 0.5; const x = -3.6 + v * 7.2;
      K.move({ p: add(CITY, [x - 0.6, 1.9, 2.6]), l: add(CITY, [x + 0.3, 2.1, -3.6]), fov: 52 }, { p: add(CITY, [x - 0.6, 1.9, 2.6]), l: add(CITY, [x + 0.3, 2.1, -3.6]), fov: 52 }, 0.5, 0.2, f); K.focusOn(add(CITY, [x + 1, 2.0, -3.6])); break; }
    case 5: { // her signature: an endless silk scarf — she twirls it high above her head
      K.preset('interior', { exposure: 1.15 }); cheer(t, 0.8); const v = u(5); const p = add(STAGE, [0, 1.0, -0.8]);
      P(ISA, { pos: p, yaw: 0.2, arms: 'up', expr: 'proud' }, f); const n = neckPos(ISA); const pts = scarfPath(add(n, [0, 0.6, 0]), [Math.cos(t * 3) * 0.7, 0.2, Math.sin(t * 3) * 0.7], t, { amp: 0.25, droop: 0.06, floor: 1.05 }); drawScarf(pts);
      K.move({ p: add(p, [0.4, 1.4, 3.6]), l: add(p, [0, 2.0, 0]), fov: 50 }, { p: add(p, [0.3, 1.3, 3.0]), l: add(p, [0, 2.1, 0]), fov: 48 }, v, 0.3, f); K.focusOn(add(p, [0, 1.8, 0])); break; }
    case 6: { // Nice, 1927: crane over the promenade at dusk, palms and the sea
      SG.nice.visible = true; const v = u(6); placeCar(4, t, 0);
      K.move({ p: add(NICE, [-6, 5.5, 10]), l: add(NICE, [2, 1.5, -2]), fov: 54 }, { p: add(NICE, [-2, 3.0, 8]), l: add(NICE, [2, 1.5, -2]), fov: 50 }, v, 0.2, f); K.focusOn(add(NICE, [2, 1.5, -2])); break; }
    case 7: { // a young man invites her: leaning on his car, waving her over from the café terrace
      const v = u(7); placeCar(1.5, t, 0); const bp = add(NICE, [0.2, 0, 0.0]), ip = add(NICE, [-2.4, 0, -1.6]);
      P(BEN, { pos: bp, yaw: -2.2, arms: 'wave', expr: 'smug', talk: 1, lean: -0.1 }, f); P(ISA, { pos: ip, yaw: 0.9, arms: 'akimbo', expr: 'happy' }, f); const n = neckLoops(ISA); drawScarf(scarfPath(n, [0, -0.95, -0.2], t, { amp: 0.04, droop: 0.0, floor: 0.04, speed: 3 }));
      K.move(K.frame([bp, ip], { yaw: -0.15, h: 2.4, lookY: 1.4, pitch: -0.04, push: 0.95 }), K.frame([bp, ip], { yaw: -0.25, h: 2.4, lookY: 1.4, pitch: -0.05, push: 0.88 }), v, 0.3, f); K.focusOn(add(bp, [-1, 1.4, 0])); break; }
    case 8: { // the car: an open roadster, spoked wheels — slow orbit, then close on a wheel
      SG.radios.visible = true; const v = u(8); placeCar(0, t, t * 2); const c = car.position; const a = -1.9 + v * 0.9;
      K.move({ p: [c.x + Math.cos(a) * 4.4, 1.4, c.z + Math.sin(a) * 4.4], l: [c.x, 0.7, c.z], fov: 46 }, { p: [c.x + Math.cos(a) * 4.2, 1.3, c.z + Math.sin(a) * 4.2], l: [c.x, 0.7, c.z], fov: 46 }, 0.5, 0.2, f); K.focusOn([c.x, 0.7, c.z]); break; }
    case 9: { // re-hook: crash zoom into the spokes of the rear wheel, flash
      const v = u(9); if (v < 0.1) K.grade.flash.value = 0.45; K.grade.vig.value = 0.75; placeCar(0, t, t * 1.5); const rw = carW(RW);
      K.move({ p: add(rw, [-1.5, 0.9, 3.4]), l: rw, fov: 50 }, { p: add(rw, [-0.3, 0.45, 1.1]), l: rw, fov: 40 }, K.ease(Math.min(1, v * 1.8)), 0.5, f); K.focusOn(rw); break; }
    case 10: { // she wraps the scarf around her neck twice, tail hanging over the side of the car
      const v = u(10); placeCar(0, t, 0); isaInCar(f, { arms: v < 0.6 ? 'think' : 'hold2', expr: 'smug', yaw: Math.PI / 2 - 0.9 }); benInCar(f);
      const n = neckLoops(ISA); loops.scale.setScalar(v < 0.4 ? 0.7 + v : 1.1); drawScarf(scarfPath(n, [-0.55, -0.55, 0.5], t, { amp: 0.06, droop: 0.08, floor: 0.06, speed: 4 }));
      K.move({ p: add(n, [1.3, 0.2, 1.9]), l: add(n, [0, 0.25, 0]), fov: 46 }, { p: add(n, [1.1, 0.2, 1.6]), l: add(n, [0, 0.25, 0]), fov: 44 }, v, 0.3, f); K.focusOn(add(n, [0, 0.1, 0])); break; }
    case 11: { // goodbye, friends: she waves from the car; friends at the café wave back — "I'm off to glory!"
      SG.gloria.visible = true; const v = u(11); placeCar(0, t, 0); isaInCar(f, { arms: 'wave', expr: 'laugh', talk: 1, yaw: Math.PI / 2 + 1.1 }); benInCar(f);
      P(FR1, { pos: add(NICE, [-3.4, 0, -2.0]), yaw: 0.6, arms: 'wave', expr: 'happy' }, f); P(FR2, { pos: add(NICE, [-4.6, 0, -2.2]), yaw: 0.7, arms: 'wave', expr: 'happy' }, f);
      const n = neckLoops(ISA); drawScarf(scarfPath(n, [-0.55, -0.55, 0.5], t, { amp: 0.06, droop: 0.08, floor: 0.06, speed: 4 }));
      const ip = carW([-0.32, 0, -0.28]); K.move(K.frame([ip, add(NICE, [-4.0, 0, -2.1])], { yaw: 0.25, h: 2.4, lookY: 1.4, pitch: -0.04, push: 0.95 }), K.frame([ip, add(NICE, [-4.0, 0, -2.1])], { yaw: 0.15, h: 2.4, lookY: 1.4, pitch: -0.05, push: 0.88 }), v, 0.3, f); K.focusOn(add(ip, [0, 1.3, 0])); break; }
    case 12: { // re-hook: the engine roars, flash, desaturate, the car jolts
      const v = u(12); if (v < 0.1) K.grade.flash.value = 0.45; K.grade.sat.value = 0.75; K.grade.vig.value = 0.8; placeCar(Math.sin(t * 40) * 0.03, t, t * 3); isaInCar(f, { arms: 'up', expr: 'laugh' }); benInCar(f, { arms: 'reach', expr: 'smug' });
      const n = neckLoops(ISA); drawScarf(scarfPath(n, [-0.55, -0.55, 0.5], t, { amp: 0.06, droop: 0.08, floor: 0.06 }));
      const c = car.position; K.move({ p: [c.x + 3.6, 0.6, c.z - 2.6], l: [c.x, 0.9, c.z], fov: 48 }, { p: [c.x + 2.8, 0.55, c.z - 2.0], l: [c.x, 0.9, c.z], fov: 46 }, K.ease(Math.min(1, v * 1.5)), 0.6, f); K.focusOn([c.x, 0.9, c.z]); break; }
    case 13: { // the car pulls away, the end of the scarf flies backwards in the wind (tracking side shot)
      const v = u(13); const x = v * v * 6; placeCar(x, t, x / 0.4); isaInCar(f, { arms: 'up', expr: 'laugh' }); benInCar(f);
      const n = neckLoops(ISA); drawScarf(scarfPath(n, [-0.9, -0.15 - v * 0.25, 0.38], t, { amp: 0.12 + v * 0.06, droop: 0.02, floor: 0.08 }));
      const c = car.position; K.move({ p: [c.x - 0.5, 1.4, c.z + 5.2], l: [c.x - 0.5, 1.0, c.z], fov: 46 }, { p: [c.x - 0.4, 1.3, c.z + 4.8], l: [c.x - 0.6, 0.9, c.z], fov: 46 }, v, 0.4, f); K.focusOn([c.x - 0.5, 1.0, c.z]); break; }
    case 14: { // it lands right on the rear wheel: low close-up, silk tail dropping between the spokes
      const v = u(14); const x = 6 + v * 3; placeCar(x, t, x / 0.4); isaInCar(f, { arms: 'up', expr: 'laugh' });
      const n = neckLoops(ISA); const rw = carW(RW); const d = [rw[0] - n[0], rw[1] - n[1], rw[2] - n[2]]; const L = Math.hypot(...d); const dir = K.lerp([-0.9, -0.3, 0.3], d.map(q => q / L), Math.min(1, v * 1.3));
      drawScarf(scarfPath(n, dir, t, { amp: 0.1 * (1 - v), droop: 0.0, floor: 0.08 }));
      K.move({ p: add(rw, [-0.6, 0.05, 1.6]), l: add(rw, [0.2, 0.35, 0]), fov: 46 }, { p: add(rw, [-0.4, 0.05, 1.3]), l: add(rw, [0.15, 0.3, 0]), fov: 44 }, v, 0.4, f); K.focusOn(rw); break; }
    case 15: { // the spokes grab it — one jerk: the silk winds onto the wheel, flash and hard cut to black-red grade
      const v = u(15); const x = 9 + Math.min(v, 0.35) * 2; placeCar(x, t, x / 0.4); const rw = carW(RW); const n = carW([-0.32, 1.45, 0.28]);
      const d = [rw[0] - n[0], rw[1] - n[1], rw[2] - n[2]]; const L = Math.hypot(...d); const catchS = Math.max(0.8, L - v * 1.6);
      drawScarf(scarfPath(n, d.map(q => q / L), t, { amp: 0, droop: 0, wheel: rw, r: 0.42, catchS, ang0: -t * 18 }));
      if (v > 0.35 && v < 0.45) K.grade.flash.value = 0.6; if (v > 0.45) { K.grade.sat.value = 0.3; K.grade.vig.value = 0.9; }
      K.move({ p: add(rw, [-0.5, 0.15, 1.3]), l: add(rw, [0.1, 0.3, 0]), fov: 44 }, { p: add(rw, [-0.4, 0.15, 1.0]), l: add(rw, [0.1, 0.3, 0]), fov: 40 }, v, v > 0.35 ? 1.2 : 0.3, f); K.focusOn(rw); break; }
    case 16: { // the car stops; she doesn't move — wide from the café, friends running toward the stopped car
      const v = u(16); K.grade.sat.value = 0.6; K.grade.vig.value = 0.7; placeCar(10, t, 0); const rw = carW(RW);
      P(FR1, { pos: add(NICE, [5 + v * 3, 0, -0.5]), yaw: Math.PI / 2, run: 1, walk: t * 2.5, arms: 'reach', expr: 'scared' }, f); P(FR2, { pos: add(NICE, [4 + v * 2.5, 0, -1.2]), yaw: Math.PI / 2, run: 1, walk: t * 2.5, arms: 'flail', expr: 'scared' }, f);
      drawScarf(scarfPath(carW([-0.32, 1.45, 0.28]), [0, -1, 0], 0, { amp: 0, droop: 0, wheel: rw, r: 0.42, catchS: 1.0, ang0: 2.0 }));
      K.move({ p: add(NICE, [13.5, 2.4, 6.0]), l: add(NICE, [8.0, 0.8, 0.0]), fov: 50 }, { p: add(NICE, [13.0, 2.2, 5.4]), l: add(NICE, [8.0, 0.8, 0.0]), fov: 48 }, v, 0.2, f); K.focusOn(add(NICE, [8.5, 0.8, 0.5])); break; }
    case 17: { // the woman who made a scarf famous: empty stage, one spotlight on the silk lying on the boards
      K.preset('interior', { exposure: 1.0 }); K.grade.vig.value = 0.85; const v = u(17); const a = add(STAGE, [-1.6, 1.03, -1.0]);
      drawScarf(Array.from({ length: NS + 1 }, (_, i) => add(a, [i * 0.19, 0, Math.sin(i * 0.7) * 0.25])));
      K.move({ p: add(STAGE, [0.2, 2.6, 2.2]), l: add(STAGE, [0, 1.0, -1.0]), fov: 46 }, { p: add(STAGE, [0.1, 2.2, 1.2]), l: add(STAGE, [0, 1.0, -1.0]), fov: 42 }, v, 0.15, f); K.focusOn(add(STAGE, [0, 1.0, -1.0])); break; }
    case 18: { // went to glory because of it: the scarf lifts off the road and floats up into the dusk sky
      const v = u(18); K.grade.sat.value = 0.9; const a = add(NICE, [1, 0.6 + v * 3.5, 1.0]);
      drawScarf(scarfPath(a, [0.8, -0.5, 0.2], t, { amp: 0.25, droop: 0.0, speed: 4 }));
      K.move({ p: add(a, [-0.6, -1.8, 3.4]), l: add(a, [0.9, -0.3, 0]), fov: 52 }, { p: add(a, [-0.5, -1.6, 3.0]), l: add(a, [0.9, -0.3, 0]), fov: 50 }, v, 0.15, f); K.focusOn(add(a, [0.8, 0, 0])); break; }
    default: { const v = u(19); hookShot(f, t, v, true); SG.q.visible = true; }
  }
}
