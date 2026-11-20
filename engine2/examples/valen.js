// VID-032 — Valentinian I (321–375), Western Roman emperor. Brigetio on the Danube, 17 Nov 375: Quadi envoys told him the Roman forts built on their
// land had provoked the war; he flew into such a rage, shouting, that he collapsed (a stroke) and died (Ammianus Marcellinus 30.6). He kept two she-bears,
// "Mica Aurea" and "Innocentia", near his bedchamber (Ammianus 29.3.9). No gore: the collapse is implied (falls behind the throne, laurel rolls).
export let FRAMES = 2200;
const DAYSKY = 'kloofendal_48d_partly_cloudy_puresky_2k', GREY = 'kloofendal_48d_partly_cloudy_puresky_2k';
let K, T, EMP, G1, G2, E1, E2, SVT, SG = {}, laurel, soldiers = [], bears = [], braz = [], fort, flagsT = [], headMat, gongs = [];
const TENT = [0, 0, 0], CAMP = [200, 0, 0], HALL = [400, 0, 0];
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
let seed = 13; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const V3 = () => new K.THREE.Vector3();
const headW = (C) => { C.root.updateMatrixWorld(true); const v = V3(); C.head.getWorldPosition(v); return [v.x, v.y, v.z]; };
function soldier(pos, rotY = 0) { const g = new K.THREE.Group(); K.cyl(0.22, 0.27, 0.75, 0xa8201a, [0, 0.6, 0], { parent: g }); K.sph(0.26, 0xf0dcc0, [0, 1.2, 0], { parent: g });
  K.sph(0.28, 0xc89a3a, [0, 1.3, 0], { parent: g, metalness: 0.8, roughness: 0.3 }).scale.set(1, 0.6, 1); K.box(0.06, 0.25, 0.4, 0xc8202a, [0, 1.55, 0], { parent: g });
  K.box(0.6, 0.8, 0.08, 0xa8201a, [0.0, 0.7, 0.32], { parent: g }); K.cyl(0.08, 0.08, 0.09, 0xd8a830, [0, 0.72, 0.37], { parent: g, metalness: 0.8 }).rotation.x = Math.PI / 2;
  K.box(0.04, 2.2, 0.04, 0x5a3a1a, [0.36, 1.1, 0], { parent: g }); g.position.set(...pos); g.rotation.y = rotY; K.scene.add(g); soldiers.push({ g, base: pos.slice(), ph: rnd() * 6 }); }
function standard(pos) { const g = new K.THREE.Group(); K.cyl(0.04, 0.04, 3.4, 0x5a3a1a, [0, 1.7, 0], { parent: g }); K.box(0.9, 0.06, 0.06, 0xd8a830, [0, 3.0, 0], { parent: g, metalness: 0.8 });
  const fl = K.plane(0.8, 1.0, K.std(0xffffff, { map: K.tex(256, 320, (c, w, h) => { c.fillStyle = '#a8201a'; c.fillRect(0, 0, w, h); c.fillStyle = '#f2c230'; c.font = 'bold 90px serif'; c.textAlign = 'center'; c.fillText('SPQR', w / 2, 190); c.fillRect(0, 0, w, 18); c.fillRect(0, h - 18, w, 18); }), side: K.THREE.DoubleSide }), [0, 2.45, 0], [0, 0, 0]); fl.removeFromParent(); g.add(fl);
  K.sph(0.16, 0xd8a830, [0, 3.55, 0], { parent: g, metalness: 0.8, roughness: 0.3 }).scale.set(1.6, 0.8, 0.6); g.position.set(...pos); K.scene.add(g); flagsT.push(fl); return g; }
function bear(pos, rotY) { const g = new K.THREE.Group(); const B = 0x6a4428; const b = K.sph(0.7, B, [0, 0.75, 0], { parent: g, roughness: 0.9 }); b.scale.set(1.3, 1, 1);
  const h = new K.THREE.Group(); h.position.set(0.95, 1.25, 0); g.add(h); K.sph(0.42, B, [0, 0, 0], { parent: h, roughness: 0.9 }); K.sph(0.2, 0xc8a070, [0.33, -0.08, 0], { parent: h }); K.sph(0.07, 0x1a1210, [0.5, -0.02, 0], { parent: h });
  for (const z of [-0.26, 0.26]) { K.sph(0.13, B, [-0.05, 0.36, z], { parent: h }); K.sph(0.06, 0x1a1210, [0.28, 0.1, z * 0.6], { parent: h }); }
  for (const [x, z] of [[0.6, 0.4], [0.6, -0.4], [-0.6, 0.4], [-0.6, -0.4]]) K.cyl(0.18, 0.2, 0.5, B, [x, 0.25, z], { parent: g, roughness: 0.9 });
  g.position.set(...pos); g.rotation.y = rotY; K.scene.add(g); bears.push({ g, h, base: pos.slice() }); return g; }
function brazier(pos) { const g = new K.THREE.Group(); K.cyl(0.35, 0.18, 0.4, 0x8a6a2a, [0, 1.0, 0], { parent: g, metalness: 0.8, roughness: 0.4 }); K.cyl(0.05, 0.05, 0.85, 0x4a3a1a, [0, 0.42, 0], { parent: g, metalness: 0.6 });
  const fl = K.sph(0.25, 0xffb030, [0, 1.3, 0], { parent: g, emissive: 0xff8020, emissiveIntensity: 4 }); fl.scale.set(1, 1.5, 1); g.position.set(...pos); K.scene.add(g); braz.push({ fl, l: K.pointLight(0xff9a40, 3.5, add(pos, [0, 1.8, 0]), 8) }); }

export async function build(k) {
  K = k; await K.preloadEnvs(); await K.preloadSkies([DAYSKY, GREY]); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  EMP = C(K.scene, { shirt: 0x5a1a6a, buttons: 0xd8a830, belt: 0xd8a830, cape: 0x8a1a2a, hair: 0x5a4030, seed: 81 });
  headMat = EMP.head.children[0].material;
  G1 = C(K.scene, { shirt: 0xa8201a, belt: 0xd8a830, hat: 'helmet', hatColor: 0xc89a3a, seed: 82 }); G2 = C(K.scene, { shirt: 0xa8201a, belt: 0xd8a830, hat: 'helmet', hatColor: 0xc89a3a, mustache: true, seed: 83 });
  E1 = C(K.scene, { shirt: 0x7a5a3a, pants: 0x4a3a2a, belt: 0x2a1a10, hair: 0xd8b060, mustache: true, seed: 84 }); E2 = C(K.scene, { shirt: 0x5a6a3a, pants: 0x4a3a2a, belt: 0x2a1a10, hair: 0xa86a2a, seed: 85 });
  SVT = C(K.scene, { shirt: 0xf2ead8, belt: 0x8a6a2a, hair: 0x2a1a10, seed: 86 });
  laurel = new K.THREE.Group(); const ring = new K.THREE.Mesh(new K.THREE.TorusGeometry(0.36, 0.025, 8, 28), K.std(0xd8a830, { metalness: 0.8, roughness: 0.3 })); ring.rotation.x = Math.PI / 2; laurel.add(ring);
  for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2; const lf = K.sph(0.055, 0x3a7a2a, [Math.cos(a) * 0.37, 0.035, Math.sin(a) * 0.37], { parent: laurel }); lf.scale.set(0.45, 0.35, 1.2); lf.rotation.y = -a; lf.rotation.x = 0.5; } K.scene.add(laurel);
  // ---------------- TENT: the audience tent at Brigetio — red canvas, throne on a dais, braziers, standards ----------------
  K.plane(30, 30, K.pbr('dirty_carpet', [6, 6], { tint: 0xa87a5a }), add(TENT, [0, 0.01, 0]));
  const canvas = K.std(0xb83a2a, { roughness: 0.85, side: K.THREE.DoubleSide });
  K.plane(16, 7, canvas, add(TENT, [0, 3.5, -5]), [0, 0, 0]); K.plane(14, 7, canvas, add(TENT, [-6, 3.5, 1]), [0, Math.PI / 2, 0]); K.plane(14, 7, canvas, add(TENT, [6, 3.5, 1]), [0, -Math.PI / 2, 0]);
  for (let i = 0; i < 5; i++) K.box(0.08, 7, 0.08, 0x4a2a14, add(TENT, [-5.5 + i * 2.75, 3.5, -4.9]));
  for (let i = 0; i < 6; i++) K.plane(1.4, 6.8, K.std(i % 2 ? 0xd8a830 : 0x8a1a1a, { roughness: 0.8, side: K.THREE.DoubleSide }), add(TENT, [-5 + i * 2, 3.6, -4.95]), [0, 0, 0]);
  K.box(4, 0.4, 3, 0xffffff, add(TENT, [0, 0.2, -3.2]), { map: K.pbr('marble_01', [2, 2]).map });
  K.box(1.5, 2.6, 0.4, 0xd8a830, add(TENT, [0, 1.7, -4.3]), { metalness: 0.7, roughness: 0.35 }); K.box(1.5, 0.5, 1.1, 0x5a1a6a, add(TENT, [0, 0.75, -3.8])); for (const s of [-1, 1]) K.box(0.18, 0.5, 1.1, 0xd8a830, add(TENT, [s * 0.75, 1.15, -3.8]), { metalness: 0.7 });
  for (const x of [-3.2, 3.2]) brazier(add(TENT, [x, 0, -2.4])); brazier(add(TENT, [-3.6, 0, 1.5])); brazier(add(TENT, [3.6, 0, 1.5]));
  for (const x of [-2.2, 2.2]) standard(add(TENT, [x, 0.4, -4.0]));
  await K.placeH('rpg_items_pack/Chest_Ingots', add(TENT, [2.4, 0, -1.2]), -0.5, 0.6).catch(() => {}); await K.placeH('rpg_items_pack/Scroll', add(TENT, [-1.6, 0.45, -2.2]), 0.4, 0.25).catch(() => {});
  K.pointLight(0xffd0a0, 4, add(TENT, [0, 4.5, 0]), 14);
  SG.culpa = K.sign('«LA CULPA ES DE ROMA»', add(TENT, [0, 5.4, -4.9]), { w: 5.6, h: 1.0, bg: '#f2ead8', fg: '#1a1210', border: '#1a1210' });
  SG.paz = K.sign('EMBAJADORES', add(TENT, [0, 5.4, -4.88]), { w: 3.8, h: 1.0, bg: '#2a1a10', border: '#d8a830' });
  SG.q = K.sign('¿TE HABRÍAS AGUANTADO?', add(TENT, [0, 5.4, -4.86]), { w: 5.6, h: 1.0, bg: '#c8202a', border: '#ffe9a8' });
  // ---------------- CAMP: grey autumn Danube — river, rows of tents, legion marching, a wooden fort on the far bank ----------------
  K.plane(400, 400, K.std(0x4a6a7a, { roughness: 0.2, metalness: 0.3 }), add(CAMP, [0, -0.2, 0]));
  K.plane(120, 30, K.pbr('forrest_ground_01', [24, 6], { tint: 0x9a8a60 }), add(CAMP, [0, 0.02, -6]));
  K.plane(120, 14, K.pbr('forrest_ground_01', [24, 3], { tint: 0x8a8a60 }), add(CAMP, [0, 0.02, 24]));
  for (let i = 0; i < 6; i++) await K.placeH('survival_pack/Tent', add(CAMP, [-14 + i * 4.2, 0, -9]), 0.2, 2.2, { tint: 0xd8c8a0 }).catch(() => {});
  for (let r = 0; r < 3; r++) for (let i = 0; i < 10; i++) soldier(add(CAMP, [-12 + i * 1.3 + (r % 2) * 0.6, 0, -3 - r * 1.2]), Math.PI / 2);
  for (let i = 0; i < 3; i++) standard(add(CAMP, [-10 + i * 6, 0, -1.6]));
  fort = new K.THREE.Group(); for (let i = 0; i < 16; i++) K.cyl(0.18, 0.2, 3 + (i % 3) * 0.3, 0x7a5a3a, [-4 + i * 0.5, 1.6, 0], { parent: fort, map: K.pbr('weathered_brown_planks', [1, 2]).map });
  await K.placeH('modular_medieval_buildings_pack/WatchTowerWRoof', [0, 0, 0], 0, 6).then(m => { m.parent && m.parent.remove(m); m.position.set(4.6, 0, 0); fort.add(m); }).catch(() => {});
  fort.position.set(...add(CAMP, [6, 0, 22])); fort.rotation.y = Math.PI; K.scene.add(fort);
  for (let i = 0; i < 6; i++) await K.placeH('nature_pack/CommonTree_' + ((i % 5) + 1), add(CAMP, [-26 + i * 10, 0, 27 + (i % 2) * 2]), i, 7, { tint: 0xc89a5a }).catch(() => {});
  SG.dan = K.sign('RÍO DANUBIO · 375', add(CAMP, [4, 2.8, -1.2]), { w: 4.2, h: 0.95, bg: '#2a1a10', border: '#d8a830', posts: true });
  SG.front = K.sign('FRONTERA', add(CAMP, [6, 2.8, 20.5]), { w: 3.0, h: 0.9, bg: '#c8202a', border: '#f2ead8', posts: true, rotY: Math.PI });
  SG.fuerte = K.sign('FUERTE ROMANO', add(CAMP, [3, 4.6, 21.0]), { w: 3.6, h: 0.9, bg: '#a8201a', border: '#d8a830', rotY: Math.PI });
  // ---------------- HALL: palace hall — marble, columns, the emperor yelling at trembling generals; the bears' cages by his bedroom door ----------------
  K.plane(30, 30, K.pbr('marble_01', [8, 8], { tint: 0xd8d0c0 }), add(HALL, [0, 0.01, 0]));
  K.plane(24, 8, K.pbr('white_plaster_02', [6, 2], { tint: 0xe8d8c0 }), add(HALL, [0, 4, -5]), [0, 0, 0]); K.plane(20, 8, K.pbr('white_plaster_02', [5, 2], { tint: 0xe8d8c0 }), add(HALL, [-7, 4, 2]), [0, Math.PI / 2, 0]);
  for (let i = 0; i < 6; i++) { K.cyl(0.35, 0.4, 6.5, 0xffffff, add(HALL, [-6 + i * 2.4, 3.25, -4.0]), { map: K.pbr('marble_01', [1, 2]).map, seg: 16 }); K.box(1.0, 0.3, 1.0, 0xe8e0d0, add(HALL, [-6 + i * 2.4, 6.6, -4.0])); }
  K.plane(10, 1.0, K.std(0x5a1a6a), add(HALL, [0, 6.0, -4.95]), [0, 0, 0]);
  K.plane(2.2, 3.2, K.std(0x4a2a14, { map: K.pbr('dark_wood', [1, 2]).map }), add(HALL, [5.0, 1.6, -4.95]), [0, 0, 0]);
  for (const [x, rot] of [[3.2, Math.PI / 2 + 0.4], [6.8, Math.PI / 2 - 0.4]]) { bear(add(HALL, [x, 0, -2.6]), rot); for (let i = 0; i < 7; i++) K.cyl(0.04, 0.04, 2.6, 0x3a3a3a, add(HALL, [x - 1.2 + i * 0.4, 1.3, -1.2]), { metalness: 0.8 }); K.box(2.8, 0.1, 0.1, 0x3a3a3a, add(HALL, [x, 2.6, -1.2]), { metalness: 0.8 }); }
  SG.osa1 = K.sign('MIGAJA DE ORO', add(HALL, [3.2, 2.95, -1.15]), { w: 2.6, h: 0.6, bg: '#d8a830', fg: '#1a1210', border: '#1a1210' });
  SG.osa2 = K.sign('INOCENCIA', add(HALL, [6.8, 2.95, -1.15]), { w: 2.2, h: 0.6, bg: '#f2ead8', fg: '#1a1210', border: '#1a1210' });
  SG.val = K.sign('VALENTINIANO I', add(HALL, [-3.5, 5.0, -4.9]), { w: 4.0, h: 1.0, bg: '#5a1a6a', border: '#d8a830' });
  SG.genio = K.sign('MAL GENIO', add(HALL, [-3.5, 5.0, -4.88]), { w: 3.2, h: 1.0, bg: '#c8202a', border: '#ffffff' });
  K.pointLight(0xffe0b0, 5, add(HALL, [-2, 4.5, 0]), 14); K.pointLight(0xffc890, 3, add(HALL, [5, 3.5, 0]), 10); K.ray(add(HALL, [-4, 3.8, -2.5]), [0, 0, 0.4], 1.6, 6, 0xfff0d0, 0.12);
}

function hideAll() {
  for (const c of [EMP, G1, G2, E1, E2, SVT]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.hold(null); c.neck.rotation.set(0, 0, 0); }
  for (const g of Object.values(SG)) g.visible = false;
  laurel.position.set(0, -99, 0); laurel.rotation.set(0, 0, 0); headMat.color.setHex(0xfffdf8);
  for (const s of soldiers) s.g.position.set(...s.base); for (const b of bears) { b.g.position.set(...b.base); b.h.rotation.set(0, 0, 0); }
}
function flicker(t, a = 1) { braz.forEach((b, i) => { const k = 1 + 0.25 * Math.sin(t * 17 + i * 2) * a + 0.15 * Math.sin(t * 29 + i); b.fl.scale.set(k, 1.5 * k, k); b.l.intensity = 3.5 * k * a; }); flagsT.forEach((fl, i) => fl.rotation.y = Math.sin(t * 2.5 + i) * 0.25); }
function laurelOn(C, tilt = 0) { const h = headW(C); const s = C.root.scale.x; laurel.position.set(h[0], h[1] + 0.23 * s, h[2]); laurel.rotation.set(tilt, C.root.rotation.y, 0); laurel.scale.setScalar(s); }
const red = (k) => { const c = new K.THREE.Color(0xfffdf8).lerp(new K.THREE.Color(0xe8402a), Math.min(1, k)); headMat.color.copy(c); };
function march(t) { soldiers.forEach(s => { s.g.position.x = s.base[0] + ((t * 1.1) % 5); s.g.position.y = s.base[1] + Math.abs(Math.sin(t * 6 + s.ph)) * 0.06; }); }
const EP = add(TENT, [0, 0.4, -3.3]);
function empRage(f, t, k, o = {}) { // emperor standing on the dais, screaming, pounding the throne arm
  red(k); const pound = Math.max(0, Math.sin(t * (o.speed || 9))); P(EMP, { pos: EP, yaw: o.yaw ?? 0, arms: o.arms || 'fists', expr: 'angry', talk: 1, tremble: 2 * k, lean: 0.12 + pound * 0.1, scale: 1.12 }, f); laurelOn(EMP, Math.sin(t * 20) * 0.08 * k); }
function envoys(f, t, scared, o = {}) { const a = add(TENT, [-0.9, 0, 0.6]), b = add(TENT, [0.9, 0, 0.8]); const lean = scared ? -0.2 : 0;
  P(E1, { pos: add(a, [0, 0, scared ? Math.min(0.6, scared) : 0]), yaw: Math.PI + 0.25, arms: scared ? 'up' : (o.arms || 'shrug'), expr: scared ? 'scared' : (o.expr || 'smug'), talk: o.talk || 0, lean, tremble: scared ? 1 : 0 }, f);
  P(E2, { pos: add(b, [0, 0, scared ? Math.min(0.6, scared) : 0]), yaw: Math.PI - 0.25, arms: scared ? 'flail' : 'cross', expr: scared ? 'shock' : 'smug', lean, tremble: scared ? 1 : 0 }, f); return [a, b]; }
function hookShot(f, t, v, end) { K.preset('interior', { exposure: 1.2 }); flicker(t, 1.6); K.grade.vig.value = 0.6; empRage(f, t, 0.85 + 0.15 * Math.sin(t * 8), { speed: 11 }); envoys(f, t, 0.3 + v * 0.3);
  if (end && v < 0.06) K.grade.flash.value = 0.3 * (1 - v / 0.06);
  const h = add(EP, [0, 2.1, 0]); K.move({ p: add(h, [0.9, -0.5, 3.0]), l: add(h, [0, -0.2, 0]), fov: 48 }, { p: add(h, [0.6, -0.45, 2.4]), l: add(h, [0, -0.15, 0]), fov: 46 }, v, 1.0, f); K.focusOn(h); }

export function frame(f, k) {
  hideAll(); const ph = K.at(f), t = f / 30, u = (i) => K.u(f, i);
  K.preset('interior', { exposure: 1.2 }); flicker(t);
  if (f < 10) K.grade.whip.value = 0;
  switch (ph) {
    case 0: { hookShot(f, t, u(0)); break; }
    case 1: { // almost nothing made him angry: envoy shrugs, spreading his hands, smug — the emperor glaring behind
      const v = u(1); red(0.3); P(EMP, { pos: EP, yaw: 0, arms: 'cross', expr: 'angry', scale: 1.12 }, f); laurelOn(EMP); const [a] = envoys(f, t, 0, { arms: 'shrug', talk: 1 });
      K.move({ p: add(a, [1.8, 1.8, 2.8]), l: add(a, [0.4, 1.6, -2]), fov: 48 }, { p: add(a, [1.6, 1.8, 2.4]), l: add(a, [0.4, 1.7, -2]), fov: 46 }, v, 0.3, f); K.focusOn(add(a, [0, 1.5, 0])); break; }
    case 2: { // Valentinian I, emperor of the West: marble hall, he strides forward with the laurel, generals salute
      K.preset('interior', { exposure: 1.2 }); const v = u(2); SG.val.visible = true; const ep = add(HALL, [-3.5 + v * 1.2, 0, -1.6]);
      P(EMP, { pos: ep, yaw: 0.3, walk: t * 1.4, arms: 'point', expr: 'proud', scale: 1.12 }, f); laurelOn(EMP);
      const g1 = add(HALL, [-1.0, 0, -2.4]), g2 = add(HALL, [-0.3, 0, -2.0]); P(G1, { pos: g1, yaw: -1.6, arms: 'wave', expr: 'neutral' }, f); P(G2, { pos: g2, yaw: -1.8, arms: 'wave', expr: 'neutral' }, f);
      K.move(K.frame([ep, g1, g2], { yaw: 0.1, h: 2.4, lookY: 1.5, pitch: -0.02, push: 0.95 }), K.frame([ep, g1, g2], { yaw: 0.0, h: 2.4, lookY: 1.5, pitch: -0.03, push: 0.88 }), v, 0.3, f); K.focusOn(add(ep, [0, 1.8, 0])); break; }
    case 3: { // a huge soldier with a terrible temper: low angle, he towers, arms crossed, scowling
      const v = u(3); SG.genio.visible = true; const ep = add(HALL, [-3.0, 0, -1.6]); red(0.25); P(EMP, { pos: ep, yaw: 0.1, arms: 'akimbo', expr: 'angry', scale: 1.25 }, f); laurelOn(EMP);
      K.move({ p: add(ep, [0.3, 0.45, 2.6]), l: add(ep, [0, 2.4, 0]), fov: 52 }, { p: add(ep, [0.2, 0.45, 2.2]), l: add(ep, [0, 2.5, 0]), fov: 50 }, v, 0.3, f); K.focusOn(add(ep, [0, 2.2, 0])); break; }
    case 4: { // he shouts so loud his generals tremble: generals shaking, helmets rattling, the emperor yelling into their faces
      const v = u(4); const ep = add(HALL, [-2.6, 0, -1.0]); red(0.6); P(EMP, { pos: ep, yaw: Math.PI / 2, arms: 'fists', expr: 'angry', talk: 1, lean: 0.25, tremble: 1, scale: 1.12 }, f); laurelOn(EMP);
      const g1 = add(HALL, [-1.3, 0, -1.2]), g2 = add(HALL, [-0.6, 0, -0.6]); P(G1, { pos: g1, yaw: -Math.PI / 2, arms: 'up', expr: 'scared', tremble: 3, lean: -0.25 }, f); P(G2, { pos: g2, yaw: -Math.PI / 2 - 0.3, arms: 'flail', expr: 'shock', tremble: 3, lean: -0.2 }, f);
      K.move(K.frame([ep, g1, g2], { yaw: 0.05, h: 2.4, lookY: 1.5, pitch: -0.02, push: 0.95 }), K.frame([ep, g1, g2], { yaw: -0.05, h: 2.4, lookY: 1.5, pitch: -0.03, push: 0.86 }), v, 0.8, f); K.focusOn(add(ep, [0.8, 1.6, 0])); break; }
    case 5: { // he kept two she-bears by his bedroom, named "Golden Crumb" and "Innocence": the bears pace and the emperor pats one (gag)
      const v = u(5); SG.osa1.visible = SG.osa2.visible = true; bears.forEach((b, i) => { b.g.position.x = b.base[0] + Math.sin(t * 1.5 + i * 2) * 0.35; b.h.rotation.z = Math.sin(t * 3 + i) * 0.15; });
      const ep = add(HALL, [5.0, 0, 0.6]); P(EMP, { pos: ep, yaw: 0.5, arms: 'point', expr: 'happy', scale: 1.0 }, f); laurelOn(EMP);
      K.move({ p: add(HALL, [5.0, 2.0, 7.6]), l: add(HALL, [5.0, 1.3, -1.8]), fov: 52 }, { p: add(HALL, [5.0, 1.9, 7.0]), l: add(HALL, [5.0, 1.4, -1.8]), fov: 50 }, v, 0.3, f); K.focusOn(add(HALL, [5, 1.3, -1.5])); break; }
    case 6: { // year 375, on the banks of the Danube: crane over the grey river and the camp
      K.preset('day', { exposure: 0.95, photo: GREY, sunDir: [0.25, 1.0, 0.3] }); const v = u(6); SG.dan.visible = true; march(t);
      K.move({ p: add(CAMP, [-8, 7, 14]), l: add(CAMP, [0, 1.5, -3]), fov: 54 }, { p: add(CAMP, [-3, 3.2, 10]), l: add(CAMP, [2, 1.5, -3]), fov: 50 }, v, 0.2, f); K.focusOn(add(CAMP, [0, 1.5, -3])); break; }
    case 7: { // a neighbouring tribe attacks the empire's borders: across the river, the frontier sign and the burning-torch raiders running (silhouettes)
      K.preset('day', { exposure: 0.95, photo: GREY, sunDir: [0.25, 1.0, 0.3] }); const v = u(7); SG.front.visible = true; const x = -4 + v * 6;
      P(E1, { pos: add(CAMP, [x, 0, 19]), yaw: Math.PI / 2, run: 1, walk: t * 2.4, arms: 'fists', expr: 'angry' }, f); P(E2, { pos: add(CAMP, [x - 1.4, 0, 19.6]), yaw: Math.PI / 2, run: 1, walk: t * 2.4 + 0.4, arms: 'flail', expr: 'angry' }, f);
      K.move({ p: add(CAMP, [x - 1, 1.4, 13.5]), l: add(CAMP, [x + 1.5, 1.6, 20]), fov: 50 }, { p: add(CAMP, [x, 1.4, 14]), l: add(CAMP, [x + 2, 1.6, 20]), fov: 48 }, v, 0.3, f); K.focusOn(add(CAMP, [x, 1.4, 19])); break; }
    case 8: { // the emperor arrives with his army... and the tribe asks for peace: legion marches past, the emperor on foot in front pointing
      K.preset('day', { exposure: 0.95, photo: GREY, sunDir: [0.25, 1.0, 0.3] }); const v = u(8); march(t); const ep = add(CAMP, [-2 + v * 2, 0, -0.4]);
      P(EMP, { pos: ep, yaw: Math.PI / 2, walk: t * 1.2, arms: 'point', expr: 'angry', scale: 1.12 }, f); laurelOn(EMP);
      K.move({ p: add(ep, [3.5, 1.0, 4.2]), l: add(ep, [0, 1.8, -1.5]), fov: 52 }, { p: add(ep, [3.0, 1.0, 3.6]), l: add(ep, [0, 1.9, -1.5]), fov: 50 }, v, 0.3, f); K.focusOn(add(ep, [0, 1.7, 0])); break; }
    case 9: { // they send envoys to talk: the two envoys walk into the tent between the braziers, a servant lifts the flap
      const v = u(9); SG.paz.visible = true; const z = 2.0 - v * 1.2; P(E1, { pos: add(TENT, [-0.8, 0, z]), yaw: Math.PI, walk: t * 1.4, arms: 'hold2', expr: 'neutral' }, f); P(E2, { pos: add(TENT, [0.8, 0, z + 0.3]), yaw: Math.PI, walk: t * 1.4 + 0.5, arms: 'down', expr: 'neutral' }, f);
      P(EMP, { pos: EP, yaw: 0, sit: true, arms: 'cross', expr: 'smug', scale: 1.12 }, f); EMP.root.position.y = EP[1] + 0.05; laurelOn(EMP);
      K.move({ p: add(TENT, [0.3, 3.7, 5.6]), l: add(TENT, [0, 1.2, -1.6]), fov: 50 }, { p: add(TENT, [0.2, 3.5, 5.0]), l: add(TENT, [0, 1.3, -1.6]), fov: 48 }, v, 0.3, f); K.focusOn(add(TENT, [0, 1.5, z])); break; }
    case 10: { // re-hook: crash zoom on the emperor's twitching eye, flash
      const v = u(10); if (v < 0.1) K.grade.flash.value = 0.45; K.grade.vig.value = 0.8; red(0.35); P(EMP, { pos: EP, yaw: 0, sit: true, arms: 'cross', expr: 'angry', tremble: 0.6, scale: 1.12 }, f); EMP.root.position.y = EP[1] + 0.05; laurelOn(EMP);
      const h = headW(EMP); K.move({ p: add(h, [0.4, -0.2, 4.0]), l: h, fov: 48 }, { p: add(h, [0.15, 0, 1.6]), l: h, fov: 40 }, K.ease(Math.min(1, v * 1.7)), 0.5, f); K.focusOn(h); break; }
    case 11: { // the envoys say, very calmly, it was Rome's fault: envoy shrugs and points at the emperor, sign «LA CULPA ES DE ROMA»
      const v = u(11); SG.culpa.visible = v > 0.35; red(0.45); P(EMP, { pos: EP, yaw: 0, sit: true, arms: 'cross', expr: 'angry', tremble: 0.5, scale: 1.12 }, f); EMP.root.position.y = EP[1] + 0.05; laurelOn(EMP);
      const [a, b] = envoys(f, t, 0, { arms: v < 0.5 ? 'shrug' : 'point', talk: 1, expr: 'smug' });
      K.move({ p: add(TENT, [0.6, 3.3, 4.8]), l: add(TENT, [0, 1.3, -1.4]), fov: 50 }, { p: add(TENT, [0.5, 3.1, 4.3]), l: add(TENT, [0, 1.4, -1.4]), fov: 48 }, v, 0.3, f); K.focusOn(add(a, [0, 1.5, 0])); break; }
    case 12: { // that the Roman forts on their land provoked them: the wooden fort and watchtower on the far bank, slow push
      K.preset('day', { exposure: 0.95, photo: GREY, sunDir: [0.25, 1.0, 0.3] }); const v = u(12); SG.fuerte.visible = true;
      K.move({ p: add(CAMP, [3, 1.2, 12]), l: add(CAMP, [4, 2.6, 22]), fov: 52 }, { p: add(CAMP, [3.5, 1.4, 14.5]), l: add(CAMP, [4, 2.8, 22]), fov: 48 }, v, 0.2, f); K.focusOn(add(CAMP, [4, 2, 22])); break; }
    case 13: { // re-hook: "and here it all went wrong" — he stands up in one jerk, flash, braziers flare
      const v = u(13); if (v < 0.1) K.grade.flash.value = 0.5; K.grade.vig.value = 0.85; flicker(t, 1.8); red(0.5 + v * 0.2); const s = Math.min(1, v * 3);
      P(EMP, { pos: EP, yaw: 0, sit: s < 0.5, arms: 'fists', expr: 'angry', talk: v > 0.3 ? 1 : 0, tremble: 1.5, scale: 1.12 }, f); laurelOn(EMP); envoys(f, t, 0.1);
      K.move({ p: add(EP, [-1.6, 0.6, 3.6]), l: add(EP, [0, 2.0, 0]), fov: 50 }, { p: add(EP, [-1.2, 0.6, 2.8]), l: add(EP, [0, 2.1, 0]), fov: 46 }, K.ease(v), 0.8, f); K.focusOn(add(EP, [0, 2, 0])); break; }
    case 14: { // turns red, yells, pounds the throne: full rage, red face, pounding, envoys backing away (key action)
      const v = u(14); flicker(t, 1.8); empRage(f, t, 0.6 + v * 0.4, { arms: 'hammer', speed: 8 }); envoys(f, t, 0.2 + v * 0.5);
      K.move({ p: add(EP, [2.4, 0.9, 3.4]), l: add(EP, [-0.3, 1.8, 0]), fov: 50 }, { p: add(EP, [1.9, 0.9, 2.8]), l: add(EP, [-0.3, 1.9, 0]), fov: 48 }, v, 1.0, f); K.focusOn(add(EP, [0, 1.9, 0])); break; }
    case 15: { // shouts so hard... he suddenly loses his voice: mouth open, no sound, freezes, colour drains; braziers dim
      const v = u(15); const k2 = v < 0.5 ? 1 : 1 - (v - 0.5) * 1.2; flicker(t, v < 0.5 ? 1.8 : 0.6); red(k2); K.grade.sat.value = v > 0.5 ? 0.6 : 1;
      P(EMP, { pos: EP, yaw: 0, arms: v < 0.5 ? 'fists' : 'think', expr: v < 0.5 ? 'angry' : 'shock', talk: v < 0.5 ? 1 : 0, tremble: v < 0.5 ? 2 : 0.6, scale: 1.12 }, f); laurelOn(EMP);
      const h = headW(EMP); K.move({ p: add(h, [0.5, -0.3, 2.4]), l: add(h, [0, -0.1, 0]), fov: 46 }, { p: add(h, [0.35, -0.25, 1.8]), l: add(h, [0, -0.1, 0]), fov: 44 }, v, v < 0.5 ? 0.8 : 0.1, f); K.focusOn(h); break; }
    case 16: { // he collapses in front of the envoys and doesn't get up: he tips back behind the throne; the laurel rolls down the dais (implied)
      const v = u(16); K.grade.sat.value = 0.45; K.grade.vig.value = 0.9; flicker(t, 0.4);
      if (v < 0.45) { const fl = Math.max(0, (v - 0.15) / 0.3); P(EMP, { pos: EP, yaw: 0, arms: 'think', expr: 'tired', fall: Math.min(1, fl) * 0.9, scale: 1.12 }, f); envoys(f, t, 0.6);
        if (fl < 0.15) laurelOn(EMP); else laurel.position.set(...add(EP, [0.4, 0.07, 0.7]));
        K.move({ p: add(EP, [3.4, 1.5, 1.0]), l: add(EP, [0, 1.3, -0.3]), fov: 50 }, { p: add(EP, [3.0, 1.4, 0.8]), l: add(EP, [0, 1.1, -0.3]), fov: 48 }, v / 0.45, 0.2, f); K.focusOn(add(EP, [0, 1.6, 0])); }
      else { const w = (v - 0.45) / 0.55; const s = Math.min(1, w * 1.5); const lp = add(TENT, [0.4 + s * 1.2, 0.07 + (s < 0.4 ? 0.4 * (1 - s / 0.4) : 0), -1.4 + s * 1.6]); laurel.position.set(...lp); laurel.rotation.set(0.12, s * 6, 0.05);
        K.move({ p: add(lp, [0.8, 0.5, 1.6]), l: lp, fov: 44 }, { p: add(lp, [0.6, 0.4, 1.3]), l: lp, fov: 42 }, w, 0.1, f); K.focusOn(lp); }
      break; }
    case 17: { // the man who made his enemies tremble: the legion standing still in the grey camp, standards dipping, desaturated
      K.preset('day', { exposure: 0.9, photo: GREY, sunDir: [0.25, 1.0, 0.3] }); const v = u(17); K.grade.sat.value = 0.45; K.grade.vig.value = 0.75;
      K.move({ p: add(CAMP, [-14, 2.0, 6]), l: add(CAMP, [-4, 1.6, -3]), fov: 50 }, { p: add(CAMP, [-10, 1.8, 5]), l: add(CAMP, [-2, 1.6, -3]), fov: 48 }, v, 0.15, f); K.focusOn(add(CAMP, [-5, 1.5, -3])); break; }
    case 18: { // was defeated by his own scream: empty throne, the braziers dying, the laurel lying on the carpet
      const v = u(18); K.grade.sat.value = 0.6; K.grade.vig.value = 0.85; flicker(t, 0.3); laurel.position.set(...add(TENT, [1.6, 0.07, 0.2])); laurel.rotation.set(0.1, 0.4, 0.05);
      K.move({ p: add(TENT, [2.4, 0.5, 2.6]), l: add(TENT, [0.6, 1.0, -3.6]), fov: 48 }, { p: add(TENT, [2.0, 0.6, 2.0]), l: add(TENT, [0.4, 1.2, -3.6]), fov: 46 }, v, 0.15, f); K.focusOn(add(TENT, [0.5, 1.0, -3.0])); break; }
    default: { const v = u(19); hookShot(f, t, v, true); SG.q.visible = true; }
  }
}
