// VID-027 — William Bullock (1813–1867), inventor of the web-fed rotary press (1863). 3 Apr 1867, installing a press for the
// Philadelphia Public Ledger, he tried to kick a slipping drive belt back onto its pulley; his leg was caught. Gangrene; died 12 Apr 1867
// during the operation. No gore: the trap is shown as a yank + paper burst; the death is implied (lamp goes out).
export let FRAMES = 2200;
const DAYSKY = 'kloofendal_48d_partly_cloudy_puresky_2k', DUSKSKY = 'qwantani_dusk_2_puresky_2k';
let K, T, BU, WK, DR, NB, SG = {}, fans = [], PR, P2, boot, papers = [], stacks = [], lampH, lampL, paperMat, bundle;
const SHOP = [0, 0, 0], STREET = [200, 0, 0], HOSP = [400, 0, 0], EXPO = [600, 0, 0];
const MAP = [0, 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], INV = {}; MAP.forEach((o, n) => (INV[o] = n)); // lines 5 and 9 cut for length
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
function fan(pos, col) { const g = new K.THREE.Group(); K.cyl(0.24, 0.28, 0.7, col, [0, 0.55, 0], { parent: g }); K.sph(0.3, 0xfde0c8, [0, 1.2, 0], { parent: g }); K.cyl(0.2, 0.22, 0.3, 0x1a1a1a, [0, 1.55, 0], { parent: g }); g.position.set(...pos); K.scene.add(g); fans.push({ g, base: pos.slice(), ph: Math.random() * 6 }); }
function cheer(t, a = 1) { fans.forEach(fa => { fa.g.position.y = fa.base[1] + Math.abs(Math.sin(t * 8 + fa.ph)) * 0.2 * a; fa.g.rotation.z = Math.sin(t * 6 + fa.ph) * 0.12 * a; }); }
function press(base) { // 1860s rotary press: iron frame, two big rollers, paper roll, flywheel + pulley joined by a leather belt
  const g = new K.THREE.Group(); const iron = 0x2e3236, brass = 0xc8a040, R = {};
  for (const z of [-1.1, 1.1]) { K.box(3.6, 0.3, 0.25, iron, [0, 0.15, z], { parent: g, metalness: 0.6, roughness: 0.4 }); K.box(0.3, 2.6, 0.25, iron, [-1.5, 1.3, z], { parent: g, metalness: 0.6 }); K.box(0.3, 2.6, 0.25, iron, [1.5, 1.3, z], { parent: g, metalness: 0.6 }); K.box(3.3, 0.22, 0.25, iron, [0, 2.55, z], { parent: g, metalness: 0.6 }); }
  R.r1 = K.cyl(0.42, 0.42, 2.0, 0x5a5e64, [0, 1.05, 0], { parent: g, metalness: 0.8, roughness: 0.3 }); R.r1.rotation.x = Math.PI / 2;
  R.r2 = K.cyl(0.42, 0.42, 2.0, 0x4a4e54, [0, 1.92, 0], { parent: g, metalness: 0.8, roughness: 0.3 }); R.r2.rotation.x = Math.PI / 2;
  for (const s of [-1, 1]) { const st = K.box(0.06, 0.06, 2.0, brass, [0, 0, 0], { parent: R.r1, metalness: 0.9 }); st.rotation.x = Math.PI / 2; st.position.set(0.3 * s, 0, 0); }
  R.roll = K.cyl(0.7, 0.7, 1.9, 0xf2ead8, [-2.6, 1.0, 0], { parent: g, roughness: 0.9 }); R.roll.rotation.x = Math.PI / 2; K.cyl(0.2, 0.2, 2.1, iron, [-2.6, 1.0, 0], { parent: g }).rotation.x = Math.PI / 2;
  const web = K.plane(2.4, 1.8, paperMat, [-1.35, 1.45, 0], [0, 0, 0.32]); g.add(web); web.rotation.set(-Math.PI / 2, 0.32, 0); web.rotation.order = 'YXZ'; R.web = web;
  R.fly = new K.THREE.Group(); R.fly.position.set(2.3, 1.5, 1.35); g.add(R.fly); const rim = K.cyl(1.2, 1.2, 0.18, 0x2a2a2e, [0, 0, 0], { parent: R.fly, metalness: 0.6 }); rim.rotation.x = Math.PI / 2;
  for (let i = 0; i < 6; i++) { const sp = K.box(0.12, 2.2, 0.1, brass, [0, 0, 0.1], { parent: R.fly, metalness: 0.9 }); sp.rotation.z = i * Math.PI / 6; }
  R.pul = new K.THREE.Group(); R.pul.position.set(0, 1.05, 1.35); g.add(R.pul); const pr = K.cyl(0.38, 0.38, 0.2, brass, [0, 0, 0], { parent: R.pul, metalness: 0.9 }); pr.rotation.x = Math.PI / 2; for (let i = 0; i < 3; i++) { const sp = K.box(0.06, 0.7, 0.06, 0x3a3a3a, [0, 0, 0.12], { parent: R.pul }); sp.rotation.z = i * Math.PI / 3; }
  R.belt = new K.THREE.Group(); g.add(R.belt); for (const y of [0.4, -0.4]) { const b = K.box(2.4, 0.06, 0.16, 0x6a3a1a, [1.15, 1.25 + y * 1.0, 1.35], { parent: R.belt, roughness: 0.7 }); b.rotation.z = y > 0 ? -0.06 : 0.06; }
  R.out = K.box(1.2, 0.08, 1.6, 0x7a5a3a, [1.9, 0.9, 0], { parent: g }); g.position.set(...base); K.scene.add(g); R.g = g; return R;
}
function spinPress(R, t, s = 1, slip = 0) { R.r1.rotation.y = t * 6 * s; R.r2.rotation.y = -t * 6 * s; R.roll.rotation.y = t * 2 * s; R.fly.rotation.z = -t * 3 * s; R.pul.rotation.z = -t * 9 * s * (1 - slip * 0.7); paperMat.map.offset.y = -t * 1.2 * s;
  R.belt.position.set(0, -slip * 0.35 + Math.sin(t * 30) * 0.04 * slip, slip * 0.25); R.belt.rotation.z = slip * (0.12 + Math.sin(t * 18) * 0.08); }
function flyPapers(base, t, k = 1, spread = 1) { papers.forEach((p, i) => { const ph = (t * 1.4 + i / papers.length) % 1; p.position.set(...add(base, [ph * 2.6 * spread, Math.sin(ph * Math.PI) * 1.6 * k + 0.2, (i % 5 - 2) * 0.35 * spread])); p.rotation.set(ph * 6 + i, ph * 4, ph * 3); }); }

export async function build(k) {
  K = k; await K.preloadEnvs(); await K.preloadSkies([DAYSKY, DUSKSKY]); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  BU = C(K.scene, { shirt: 0x3a3028, buttons: 0xc8a040, tie: 0x8a1e1e, hat: 'bowler', hatColor: 0x1a1a1a, hair: 0x4a3020, mustache: true, seed: 31 });
  WK = C(K.scene, { shirt: 0x6a7a8a, belt: 0x3a2a1a, hat: 'cap', hatColor: 0x3a3a3a, hair: 0x1a1210, seed: 32 });
  DR = C(K.scene, { shirt: 0xf2f2f2, buttons: 0x2a2a2a, glasses: true, hair: 0xc8c8c8, seed: 33 });
  NB = C(K.scene, { shirt: 0xb8862a, hat: 'cap', hatColor: 0x6a3a1a, hair: 0x8a4a20, seed: 34 });
  const ptx = K.tex(512, 512, (c, w, h) => { c.fillStyle = '#f2ead8'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a2a2a'; for (let y = 12; y < h; y += 14) for (let x = 14; x < w - 20; x += 64) c.fillRect(x, y, 48 - (y * 7 + x) % 20, 5); c.font = 'bold 54px serif'; c.fillText('THE LEDGER', 60, 70); }, [1, 2]);
  paperMat = K.std(0xffffff, { map: ptx, roughness: 0.9, side: K.THREE.DoubleSide });
  for (let i = 0; i < 18; i++) { const p = K.plane(0.55, 0.75, paperMat, [0, -99, 0], [0, 0, 0]); papers.push(p); }
  boot = new K.THREE.Group(); K.box(0.32, 0.22, 0.6, 0x1a1210, [0, 0, 0.12], { parent: boot, roughness: 0.6 }); K.cyl(0.15, 0.15, 0.5, 0x1a1210, [0, 0.3, 0], { parent: boot }); K.cyl(0.16, 0.16, 0.4, 0x2a2a30, [0, 0.7, 0], { parent: boot }); K.scene.add(boot);
  bundle = new K.THREE.Group(); for (let i = 0; i < 6; i++) K.box(0.6, 0.06, 0.8, 0xf2ead8, [0, i * 0.065, 0], { parent: bundle, map: ptx }); K.box(0.62, 0.42, 0.04, 0x8a5a2a, [0, 0.18, 0], { parent: bundle }); K.scene.add(bundle);

  // ---------------- SHOP: 1867 press hall, Philadelphia Public Ledger — brick, beams, gas lamps, the big press ----------------
  K.plane(30, 30, K.pbr('weathered_brown_planks', [6, 6]), add(SHOP, [0, 0.01, 0]));
  const brick = K.pbr('red_brick', [6, 2]); K.plane(24, 8, brick, add(SHOP, [0, 4, -5]), [0, 0, 0]); K.plane(20, 8, brick, add(SHOP, [-7, 4, 2]), [0, Math.PI / 2, 0]); K.plane(20, 8, brick, add(SHOP, [8, 4, 2]), [0, -Math.PI / 2, 0]);
  for (let i = 0; i < 5; i++) K.box(16, 0.35, 0.35, 0x3a2a1a, add(SHOP, [0, 6.2, -4 + i * 2.4]));
  for (const x of [-4, 0, 4]) { K.box(1.6, 2.4, 0.1, 0x9ac8e8, add(SHOP, [x, 4.2, -4.94]), { emissive: 0x6a88a8, emissiveIntensity: 0.6 }); K.ray(add(SHOP, [x + 0.6, 3.2, -3.2]), [0.5, 0, 0.35], 1.4, 5, 0xffe0b0, 0.1); }
  PR = press(add(SHOP, [0, 0, -1.6]));
  for (let i = 0; i < 4; i++) { const s = new K.THREE.Group(); for (let j = 0; j < 8; j++) K.box(0.6, 0.06, 0.8, 0xf2ead8, [0, j * 0.065, 0], { parent: s, map: ptx }); s.position.set(...add(SHOP, [3.6 + (i % 2) * 0.8, 0, -0.2 + Math.floor(i / 2) * 1.0])); K.scene.add(s); stacks.push(s); }
  for (let i = 0; i < 3; i++) await K.placeH('medieval_village_pack/Crate', add(SHOP, [-5 + i * 0.9, 0, -3.8]), i, 0.8).catch(() => {});
  await K.placeH('medieval_village_pack/Barrel', add(SHOP, [-5.6, 0, -2.4]), 0, 1.0).catch(() => {});
  await K.placeH('house_interior_pack/Shelf_Large', add(SHOP, [5.6, 0, -4.4]), 0, 2.4).catch(() => {});
  for (const x of [-3, 3]) { K.cyl(0.03, 0.03, 1.2, 0x1a1a1a, add(SHOP, [x, 5.6, -0.5])); K.sph(0.2, 0xffd890, add(SHOP, [x, 5.0, -0.5]), { emissive: 0xffb040, emissiveIntensity: 3 }); }
  lampH = K.pointLight(0xffc880, 6, add(SHOP, [0, 4.5, 1.5]), 12); K.pointLight(0xffe0b0, 4, add(SHOP, [-3, 3.0, 2.5]), 9); K.pointLight(0x9ab0d0, 2, add(SHOP, [3, 4, -3]), 9);
  SG.l12 = K.sign('12.000 HOJAS / HORA', add(SHOP, [0, 4.7, -4.9]), { w: 5.2, h: 0.95, bg: '#1e2a4a', border: '#e0b040' });
  SG.fil = K.sign('FILADELFIA · 1867', add(SHOP, [0, 4.7, -4.88]), { w: 4.8, h: 0.95, bg: '#3a1a10', border: '#e0b040' });
  SG.mal = K.sign('¡PARE LA MÁQUINA!', add(SHOP, [0, 4.7, -4.86]), { w: 4.8, h: 0.95, bg: '#d7262a', border: '#ffffff' });
  SG.vivo = K.sign('VIVO… POR AHORA', add(SHOP, [0, 4.7, -4.84]), { w: 4.4, h: 0.95, bg: '#1a1a2a', border: '#e0b040' });
  SG.q = K.sign('¿LA HABRÍAS APAGADO?', add(SHOP, [0, 4.7, -4.82]), { w: 5.4, h: 0.95, bg: '#d7262a', border: '#ffe9a8' });

  // ---------------- EXPO: 1863 unveiling — red curtain, crowd in top hats, banner ----------------
  K.plane(30, 30, K.pbr('wood_floor', [6, 6]), add(EXPO, [0, 0.01, 0]));
  K.plane(20, 8, K.pbr('painted_plaster_wall', [4, 2], { tint: 0x8a2a2a }), add(EXPO, [0, 4, -5]), [0, 0, 0]);
  P2 = press(add(EXPO, [0, 0, -1.8]));
  SG.cur = new K.THREE.Group(); for (let i = 0; i < 7; i++) K.box(0.9, 3.4, 0.12, 0xa81e1e, [-2.7 + i * 0.9, 1.7, 0.03 * (i % 2)], { parent: SG.cur, roughness: 0.9 }); SG.cur.position.set(...add(EXPO, [0, 0, 0.2])); K.scene.add(SG.cur);
  for (let r = 0; r < 2; r++) for (let i = 0; i < 10; i++) fan(add(EXPO, [-4.5 + i * 1.0 + r * 0.4, 0, 3.4 + r * 1.2]), [0x2a2a3a, 0x5a3a2a, 0x3a4a3a, 0x6a2a2a, 0xd8c8a8][(i + r) % 5]);
  fans.forEach(fa => fa.g.rotation.y = Math.PI);
  K.pointLight(0xfff0d8, 7, add(EXPO, [0, 4.5, 2]), 12); K.pointLight(0xffc890, 4, add(EXPO, [-3, 3, 4]), 10);
  SG.y63 = K.sign('1863 · LA IMPRENTA QUE SE ALIMENTA SOLA', add(EXPO, [0, 4.6, -4.9]), { w: 8.0, h: 1.0, bg: '#1a1210', border: '#e0b040' });

  // ---------------- STREET: 1860s brick street, newsboys, bundles of papers ----------------
  K.plane(120, 40, K.pbr('cobblestone_floor_04', [24, 8]), add(STREET, [0, 0.01, 0]));
  const bld = ['2Story_Sign_Mat', '3Story_Balcony_Mat', '2Story_Columns_Mat', '3Story_Slim_Mat', '2Story_Wide_Mat', '4Story_Mat'];
  for (let i = 0; i < 8; i++) await K.placeH('buildings_pack_3/' + bld[i % 6], add(STREET, [-21 + i * 6, 0, -8]), 0, 7 + (i % 3) * 2).catch(() => {});
  for (let i = 0; i < 4; i++) await K.placeH('street_pack/Streetlight_Single', add(STREET, [-9 + i * 6, 0, -3.6]), 0, 4.0).catch(() => {});
  await K.placeH('medieval_village_pack/Cart', add(STREET, [3.5, 0, -1.8]), 0.4, 1.6).catch(() => {});
  for (let i = 0; i < 5; i++) { const s = bundle.clone(); s.position.set(...add(STREET, [-2.5 + i * 0.7, 0, -1.2 - (i % 2) * 0.7])); K.scene.add(s); }
  SG.fam = K.sign('¡TODO EL PAÍS LA QUIERE!', add(STREET, [0, 5.6, -4.6]), { w: 6.0, h: 1.1, bg: '#d7262a', border: '#ffe9a8' });
  SG.muere = K.sign('¡MUERE EL INVENTOR!', add(STREET, [0.4, 3.0, -1.2]), { w: 3.6, h: 0.9, bg: '#1a1210', border: '#ffffff' });
  SG.f67 = K.sign('FILADELFIA · 1867', add(STREET, [-1.5, 3.2, 3.6]), { w: 4.2, h: 0.95, bg: '#3a1a10', border: '#e0b040', posts: true, rotY: 0.2 });

  // ---------------- HOSP: 1867 sickroom — bed, oil lamp, doctor's bag ----------------
  K.plane(14, 14, K.pbr('wood_floor', [4, 4]), add(HOSP, [0, 0.01, 0]));
  const wp = K.pbr('white_plaster_02', [4, 2], { tint: 0xc8c0a8 }); K.plane(14, 6, wp, add(HOSP, [0, 3, -3]), [0, 0, 0]); K.plane(12, 6, wp, add(HOSP, [-4, 3, 1]), [0, Math.PI / 2, 0]);
  await K.placeH('house_interior_pack/Bed_Single', add(HOSP, [0, 0, -1.6]), 0, 0.9).catch(() => {});
  await K.placeH('house_interior_pack/NightStand_1', add(HOSP, [1.4, 0, -2.4]), 0, 0.7).catch(() => {});
  await K.placeH('house_interior_pack/Window_Large1', add(HOSP, [-1.8, 1.2, -2.95]), 0, 2.0).catch(() => {});
  lampL = K.sph(0.13, 0xffd890, add(HOSP, [1.4, 0.95, -2.4]), { emissive: 0xffa030, emissiveIntensity: 4 }); SG.lampP = K.pointLight(0xffb060, 5, add(HOSP, [1.3, 1.4, -1.8]), 7);
  SG.dia = K.sign('DÍAS DESPUÉS…', add(HOSP, [0, 2.7, -2.9]), { w: 3.6, h: 0.85, bg: '#1a1a2a', border: '#e0b040' });
  SG.abr = K.sign('12 ABRIL 1867', add(HOSP, [0.5, 2.6, -2.88]), { w: 3.0, h: 0.85, bg: '#1a1210', border: '#ffffff' });
}

function hideAll() {
  for (const c of [BU, WK, DR, NB]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.hold(null); c.neck.rotation.set(0, 0, 0); }
  for (const [k2, g] of Object.entries(SG)) if (k2 !== 'lampP') g.visible = false;
  SG.cur.visible = true; SG.cur.position.set(...add(EXPO, [0, 0, 0.2])); SG.lampP.intensity = 5; lampL.visible = true;
  for (const fa of fans) { fa.g.position.set(...fa.base); fa.g.rotation.set(0, Math.PI, 0); }
  for (const o of [boot, bundle]) { o.position.set(0, -99, 0); o.rotation.set(0, 0, 0); o.scale.set(1, 1, 1); }
  papers.forEach(p => p.position.set(0, -99, 0)); stacks.forEach((s, i) => s.scale.set(1, 1, 1));
  spinPress(PR, 0, 0, 0); spinPress(P2, 0, 0, 0);
}
const MACH = add(SHOP, [0.2, 0, 0.2]); // where Bullock stands, in front of the belt side
function hookShot(f, t, v, rev) { // frame 0: Bullock yanked toward the spinning rollers, arms flailing, papers bursting, worker screaming
  K.preset('interior', { exposure: 1.5 }); spinPress(PR, t, 1.4, 1); SG.mal.visible = true; flyPapers(add(SHOP, [0.6, 1.2, 0.2]), t, 1.2, 1.2);
  const k2 = rev ? 0.3 + 0.3 * v : 0.3 + Math.min(0.7, v * 1.6);
  P(BU, { pos: add(MACH, [0.9 - k2 * 0.6, 0, 0.3]), yaw: 0.7, lean: -0.35 * k2, arms: 'flail', expr: 'scared', tremble: 1 }, f);
  P(WK, { pos: add(SHOP, [-1.9, 0, 1.0]), yaw: 0.9, arms: 'reach', expr: 'shock', talk: 1, lean: 0.2 }, f);
  K.move({ p: add(SHOP, [2.6, 1.3, 3.8]), l: add(SHOP, [0.6, 1.3, 0.0]), fov: 52 }, { p: add(SHOP, [2.2, 1.25, 3.2]), l: add(SHOP, [0.6, 1.3, 0.0]), fov: 48 }, v, 0.6, f); K.focusOn(add(MACH, [0.5, 1.3, 0.3]));
}

export function frame(f, k) {
  hideAll(); const ph = MAP[K.at(f)] ?? 19, t = f / 30, u = (i) => K.u(f, INV[i] ?? 0);
  K.preset('interior', { exposure: 1.5 });
  if (f < 10) K.grade.whip.value = 0;
  switch (ph) {
    case 0: { if (u(0) < 0.06) K.grade.flash.value = 0.5 * (1 - u(0) / 0.06); hookShot(f, t, u(0)); break; }
    case 1: { // gag: a big boot swings in slow motion at the slipping belt
      const v = u(1); spinPress(PR, t, 0.6, 0.8); K.grade.vig.value = 0.6;
      boot.position.set(...add(SHOP, [1.6 - 0.6 * K.ease(v), 1.0 + 0.25 * Math.sin(v * Math.PI), 1.9 - 0.4 * K.ease(v)])); boot.rotation.set(-0.9 + v * 0.9, -0.5, 0);
      K.move({ p: add(SHOP, [2.6, 1.3, 3.9]), l: add(SHOP, [1.1, 1.05, 1.2]), fov: 40 }, { p: add(SHOP, [2.3, 1.25, 3.5]), l: add(SHOP, [1.0, 1.05, 1.2]), fov: 38 }, v, 0.2, f); K.focusOn(add(SHOP, [1.1, 1.0, 1.6])); break; }
    case 2: { // 1863 unveiling: Bullock pulls the red curtain off his press, the crowd applauds
      const v = u(2); cheer(t, Math.min(1, v * 2)); SG.y63.visible = true; spinPress(P2, t, v > 0.5 ? 0.8 : 0, 0);
      SG.cur.position.set(...add(EXPO, [Math.max(0, v - 0.35) * 14, 0, 0.2])); const p = add(EXPO, [-1.6, 0, 1.2]);
      P(BU, { pos: p, yaw: 0.9, arms: v < 0.4 ? 'reach' : 'point', expr: v < 0.4 ? 'smug' : 'proud', talk: v > 0.5 ? 0.6 : 0 }, f);
      K.move({ p: add(EXPO, [-0.2, 3.4, 6.8]), l: add(EXPO, [-0.8, 1.3, -0.2]), fov: 52 }, { p: add(EXPO, [-0.3, 3.0, 5.8]), l: add(EXPO, [-0.9, 1.4, -0.2]), fov: 50 }, v, 0.3, f); K.focusOn(add(EXPO, [-1, 1.4, -0.5])); break; }
    case 3: { // the paper web runs from the giant roll into the rollers, camera tracking along it
      const v = u(3); spinPress(P2, t, 1, 0); SG.cur.position.set(0, -99, 0);
      K.move({ p: add(EXPO, [-3.6, 2.4, 1.4]), l: add(EXPO, [-2.4, 1.1, -1.8]), fov: 46 }, { p: add(EXPO, [-0.6, 2.4, 1.6]), l: add(EXPO, [0.2, 1.4, -1.8]), fov: 44 }, v, 0.2, f); K.focusOn(add(EXPO, [-1.2, 1.3, -1.8])); break; }
    case 4: { // 12,000 sheets an hour: papers shoot out, the stack grows, crowd goes wild
      const v = u(4); spinPress(P2, t, 1.6, 0); SG.cur.position.set(0, -99, 0); cheer(t, 1.4); flyPapers(add(EXPO, [1.6, 1.0, -1.8]), t * 1.6, 1.0, 1.0);
      stacks[0].position.set(...add(EXPO, [2.4, 0, -0.4])); stacks[0].scale.set(1, 1 + v * 3, 1);
      K.move({ p: add(EXPO, [4.4, 1.6, 3.4]), l: add(EXPO, [1.6, 1.2, -1.2]), fov: 50 }, { p: add(EXPO, [3.8, 1.8, 2.6]), l: add(EXPO, [1.8, 1.4, -1.2]), fov: 46 }, v, 0.3, f); K.focusOn(add(EXPO, [2.2, 1.2, -0.6])); break; }
    case 5: { // the whole country wants it: newsboy waves the paper, Bullock strolls by, proud
      K.preset('day', { exposure: 1.05, photo: DAYSKY }); SG.fam.visible = true; const v = u(5); const p = add(STREET, [-3 + 4 * v, 0, 1.2]);
      P(BU, { pos: p, yaw: Math.PI / 2, walk: t * 2, expr: 'proud', arms: 'wave' }, f);
      P(NB, { pos: add(STREET, [1.4, 0, 0.2]), yaw: 0.3, expr: 'happy', talk: 1, arms: 'up', bounce: 1 }, f); NB.hold(bundle);
      K.move(K.frame([p, add(STREET, [1.4, 0, 0.2])], { yaw: 0.3, h: 2.4, lookY: 1.6, pitch: -0.05, push: 1.0 }), K.frame([p, add(STREET, [1.4, 0, 0.2])], { yaw: 0.2, h: 2.4, lookY: 1.6, pitch: -0.06, push: 0.92 }), v, 0.3, f); K.focusOn(add(p, [0, 1.6, 0])); break; }
    case 6: { // four years later, Philadelphia: dusk, Bullock walks to the newspaper with his toolbox
      K.preset('dusk', { exposure: 2.5, photo: DUSKSKY }); SG.f67.visible = true; const v = u(6); const p = add(STREET, [2.0 - 3.0 * v, 0, 0.6 - 1.0 * v]);
      P(BU, { pos: p, yaw: -Math.PI / 2 - 0.3, walk: t * 2, expr: 'neutral', arms: 'hold' }, f); BU.hold(bundle);
      K.move({ p: add(STREET, [-3.5, 1.3, 7.5]), l: add(STREET, [1, 2.6, -3]), fov: 48 }, { p: add(STREET, [-2.8, 1.2, 6.4]), l: add(STREET, [0.5, 2.8, -3]), fov: 46 }, v, 0.3, f); K.focusOn(add(p, [0, 1.6, 0])); break; }
    case 7: { // he checks every wheel himself: hammering at the frame, rollers ticking around, close-up
      SG.fil.visible = true; const v = u(7); spinPress(PR, t, 0.5, 0); const p = add(SHOP, [-1.2, 0, 0.3]);
      P(BU, { pos: p, yaw: 0.3, arms: 'hammer', expr: 'neutral', lean: 0.15 }, f);
      if (v < 0.5) K.move(K.frame([p], { yaw: 0.5, h: 2.0, lookY: 1.4, pitch: -0.04, push: 0.85 }), K.frame([p], { yaw: 0.4, h: 2.0, lookY: 1.4, pitch: -0.05, push: 0.78 }), v * 2, 0.2, f);
      else K.move({ p: add(SHOP, [0.8, 1.3, 2.0]), l: add(SHOP, [0.2, 1.1, -0.6]), fov: 40 }, { p: add(SHOP, [0.6, 1.3, 1.6]), l: add(SHOP, [0.2, 1.1, -0.6]), fov: 38 }, (v - 0.5) * 2, 0.2, f); K.focusOn(add(SHOP, [-0.4, 1.2, -0.6])); break; }
    case 8: { // the leather belt keeps slipping off its pulley — Bullock throws up his hands
      const v = u(8); const sl = Math.min(1, Math.max(0, (v - 0.2) * 2)); spinPress(PR, t, 0.9, sl); const p = add(SHOP, [1.6, 0, 1.6]);
      P(BU, { pos: p, yaw: -0.5, arms: sl > 0.5 ? 'shrug' : 'point', expr: sl > 0.5 ? 'angry' : 'worried' }, f);
      K.move({ p: add(SHOP, [3.8, 1.8, 4.6]), l: add(SHOP, [1.0, 1.3, 0.2]), fov: 46 }, { p: add(SHOP, [3.4, 1.7, 4.0]), l: add(SHOP, [0.9, 1.3, 0.2]), fov: 44 }, v, 0.2, f); K.focusOn(add(SHOP, [1.0, 1.3, -0.2])); break; }
    case 9: { // the huge machine keeps turning: low angle on the flywheel, worker steps back
      const v = u(9); spinPress(PR, t, 1.2, 1); P(WK, { pos: add(SHOP, [-1.6, 0, 1.4]), yaw: 0.6, arms: 'cross', expr: 'worried' }, f);
      K.move({ p: add(SHOP, [3.6, 0.5, 3.4]), l: add(SHOP, [2.3, 1.9, -0.3]), fov: 54 }, { p: add(SHOP, [3.2, 0.45, 3.0]), l: add(SHOP, [2.2, 2.0, -0.3]), fov: 50 }, v, 0.3, f); K.focusOn(add(SHOP, [2.3, 1.5, -0.25])); break; }
    case 10: { // re-hook: crash zoom onto the flapping belt, lamps flicker
      const v = u(10); if (v < 0.1) K.grade.flash.value = 0.45; K.grade.vig.value = 0.8; spinPress(PR, t, 1.3, 1);
      K.preset('interior', { exposure: 1.1 + 0.25 * Math.sin(t * 25) });
      K.move({ p: add(SHOP, [3.0, 2.4, 6.4]), l: add(SHOP, [1.0, 1.3, -0.2]), fov: 48 }, { p: add(SHOP, [1.4, 1.4, 2.1]), l: add(SHOP, [1.0, 1.25, -0.2]), fov: 38 }, K.ease(Math.min(1, v * 1.8)), 0.5, f); K.focusOn(add(SHOP, [1.0, 1.25, -0.2])); break; }
    case 11: { // impatient, he leans in and pushes the belt with his FOOT — worker reaching out "no!"
      const v = u(11); spinPress(PR, t, 1.1, 1 - Math.min(1, v * 1.5) * 0.4); const p = add(MACH, [1.2, 0, 0.5]);
      P(BU, { pos: p, yaw: 0.5, arms: 'cross', expr: 'angry', lean: -0.25 }, f);
      P(WK, { pos: add(SHOP, [-1.4, 0, 1.4]), yaw: 0.7, arms: 'reach', expr: 'scared', talk: v > 0.5 ? 1 : 0 }, f);
      boot.position.set(...add(p, [-0.35 - 0.35 * K.ease(v), 0.45 + 0.4 * Math.sin(v * Math.PI), -0.4 - 0.3 * v])); boot.rotation.set(-0.4, 0.4, 0);
      K.move(K.frame([p], { yaw: 0.7, h: 1.5, lookY: 1.2, pitch: -0.05, push: 1.0 }), K.frame([p], { yaw: 0.6, h: 1.5, lookY: 1.2, pitch: -0.06, push: 0.92 }), v, 0.2, f); K.focusOn(add(p, [-0.4, 0.8, 0])); break; }
    case 12: { // the machine yanks him in: violent shake, papers burst, cut before anything is seen
      const v = u(12); if (v < 0.08) K.grade.flash.value = 0.6; spinPress(PR, t, 1.6, 1); flyPapers(add(SHOP, [0.6, 1.0, 0.4]), t * 2, 1.4, 1.4); SG.mal.visible = true;
      const k2 = Math.min(1, v * 2.5); P(BU, { pos: add(MACH, [0.9 - k2 * 0.7, 0, 0.3]), yaw: -0.4, lean: 0.5 * k2, arms: 'flail', expr: 'shock', tremble: 1.5 }, f);
      K.move({ p: add(SHOP, [1.8, 1.6, 3.2]), l: add(SHOP, [0.4, 1.2, 0]), fov: 46 }, { p: add(SHOP, [1.6, 1.5, 2.8]), l: add(SHOP, [0.3, 1.2, 0]), fov: 44 }, v, 1.4, f); K.focusOn(add(MACH, [0.4, 1.3, 0.3])); break; }
    case 13: { // pulled out alive: worker drags him clear, the press finally stopped
      SG.vivo.visible = true; const v = u(13); const p = add(SHOP, [-0.6 - 1.2 * v, 0.25, 2.2]);
      P(BU, { pos: p, yaw: 0.2, expr: 'worried', arms: 'down' }, f); BU.root.rotation.x = -1.2; BU.root.position.y = 0.35;
      P(WK, { pos: add(p, [-0.9, -0.25, 0.1]), yaw: Math.PI / 2, lean: -0.3, arms: 'hold2', expr: 'worried', walk: t * 1.2 }, f);
      K.move({ p: add(SHOP, [-0.4, 2.6, 5.6]), l: add(SHOP, [-1.2, 0.8, 1.6]), fov: 46 }, { p: add(SHOP, [-0.6, 2.4, 5.0]), l: add(SHOP, [-1.6, 0.8, 1.8]), fov: 44 }, v, 0.2, f); K.focusOn(add(p, [0, 0.6, 0])); break; }
    case 14: { // days later the wound gets infected: in bed, sweating, oil lamp
      K.preset('night', { exposure: 2.3 }); SG.dia.visible = true; const v = u(14); const bp = add(HOSP, [0, 0.62, -0.7]);
      P(BU, { pos: bp, yaw: 0, expr: 'tired', arms: 'down', sweat: 1 }, f); BU.root.rotation.x = -Math.PI / 2 + 0.15;
      K.move({ p: add(HOSP, [2.6, 2.0, -0.4]), l: add(HOSP, [0, 0.9, -2.2]), fov: 50 }, { p: add(HOSP, [2.3, 1.9, -0.6]), l: add(HOSP, [0, 0.9, -2.3]), fov: 48 }, v, 0.15, f); K.focusOn(add(HOSP, [0, 0.8, -1.8])); break; }
    case 15: { // the doctor comes in with his bag and decides to operate
      K.preset('night', { exposure: 2.3 }); const v = u(15); const bp = add(HOSP, [0, 0.62, -0.7]); const dp = add(HOSP, [-1.6 + 0.6 * Math.min(1, v * 2), 0, 0.2]);
      P(BU, { pos: bp, yaw: 0, expr: 'worried', arms: 'down', sweat: 1 }, f); BU.root.rotation.x = -Math.PI / 2 + 0.15;
      P(DR, { pos: dp, yaw: 0.9, walk: v < 0.5 ? t * 2 : 0, expr: 'worried', arms: v < 0.5 ? 'hold' : 'point', talk: v > 0.5 ? 0.7 : 0 }, f); DR.hold(v < 0.5 ? bundle : null); if (v < 0.5) bundle.scale.set(0.6, 0.6, 0.6);
      K.move(K.frame([dp, add(HOSP, [0, 0, -1.6])], { yaw: 0.7, h: 2.2, lookY: 1.2, pitch: -0.1, push: 1.0 }), K.frame([dp, add(HOSP, [0, 0, -1.6])], { yaw: 0.6, h: 2.2, lookY: 1.2, pitch: -0.11, push: 0.92 }), v, 0.2, f); K.focusOn(add(dp, [0, 1.4, 0])); break; }
    case 16: { // he dies during the operation: the lamp gutters out, the doctor lowers his head
      bundle.scale.set(1, 1, 1); const v = u(16); const dim = Math.max(0, 1 - Math.max(0, v - 0.45) * 3); K.preset('night', { exposure: 1.3 + 1.0 * dim }); SG.lampP.intensity = 5 * dim; lampL.visible = dim > 0.05; SG.abr.visible = v > 0.5; K.grade.sat.value = 0.7; K.grade.vig.value = 0.75;
      P(DR, { pos: add(HOSP, [-0.9, 0, -0.4]), yaw: 0.8, expr: 'sad', arms: 'down', lean: 0.25 }, f);
      K.move({ p: add(HOSP, [-0.4, 1.8, 2.8]), l: add(HOSP, [0.4, 1.2, -2.2]), fov: 44 }, { p: add(HOSP, [-0.2, 1.7, 2.2]), l: add(HOSP, [0.5, 1.2, -2.2]), fov: 42 }, v, 0.15, f); K.focusOn(add(HOSP, [1.0, 1.1, -2.2])); break; }
    case 17: { // the man who printed thousands an hour: the press alone, papers flying, slow-mo
      K.preset('interior', { exposure: 1.1 }); K.grade.sat.value = 0.85; const v = u(17); spinPress(PR, t * 0.4, 1, 0); flyPapers(add(SHOP, [1.6, 1.0, -1.6]), t * 0.5, 1.2, 1.1);
      K.move({ p: add(SHOP, [-2.6, 1.6, 4.4]), l: add(SHOP, [0.4, 1.4, -1.6]), fov: 46 }, { p: add(SHOP, [-1.6, 1.8, 3.6]), l: add(SHOP, [0.8, 1.6, -1.6]), fov: 44 }, v, 0.2, f); K.focusOn(add(SHOP, [0.6, 1.4, -1.4])); break; }
    case 18: { // ...ended up in all of them: newsboy shouting the headline in the street
      K.preset('day', { exposure: 1.0, photo: DAYSKY }); K.grade.sat.value = 0.9; SG.muere.visible = true; const v = u(18); const p = add(STREET, [0.4, 0, 1.0]);
      P(NB, { pos: p, yaw: 0.2, expr: 'shock', talk: 1, arms: 'up', bounce: 0.6 }, f);
      K.move(K.frame([p], { yaw: 0.25, h: 1.6, lookY: 2.0, pitch: 0.05, push: 1.4 }), K.frame([p], { yaw: 0.15, h: 1.6, lookY: 2.1, pitch: 0.06, push: 1.3 }), v, 0.3, f); K.focusOn(add(p, [0, 1.6, 0])); break; }
    default: { const v = u(19); hookShot(f, t, v, true); SG.mal.visible = false; SG.q.visible = true; }
  }
}
