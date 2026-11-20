// Erfurt latrine disaster (1184) — v4 "real" style test (Mildly Elsewhere-like cutaway, continuous camera)
export let FRAMES = 2000;
let K, T, segs = [], beams = [], crowd = [], king, ext = {}, gas = [], dust = [], drops = [], ladder, nobles = [], walkers = [];
const FLOOR = 3.2, LIQ = -0.8, BX = [-3, 0, 3];
const R = (k) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

function pb(w, h, d, tex, pos, o = {}) { const { THREE } = K; const s = o.s ?? 1.6;
  const mat = tex ? K.pbr(tex, [Math.max(1, w / s), Math.max(1, h / s)], { tint: o.tint, bump: o.bump }) : K.std(o.col ?? 0x777777, { roughness: o.rough ?? 0.8 });
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(...pos); m.castShadow = m.receiveShadow = true; (o.parent || K.scene).add(m); return m; }
function sprite(col, size, op) { const { THREE } = K; const tx = K.tex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, opacity: op, depthWrite: false })); s.scale.setScalar(size); s.userData.noDepth = true; s.userData.noCull = true; K.scene.add(s); return s; }

export async function build(k) {
  K = k; const { THREE } = K;
  await K.preloadEnvs(); await K.preloadSkies(['kloofendal_48d_partly_cloudy_puresky_2k', 'belfast_sunset_puresky_2k']); T = await K.timing();
  FRAMES = Math.ceil((T.duration) * 30); K.CULL = 120;
  // ---------- HALL (cutaway, open towards +z) ----------
  // soil cross-section around the pit + grass on top
  pb(14, 14, 40, 'forrest_ground_01', [-13.3, -7, -16.7]); pb(14, 14, 40, 'forrest_ground_01', [13.3, -7, -16.7]);
  pb(12.6, 11.5, 8.2, 'forrest_ground_01', [0, -8.25, -0.9]); pb(12.6, 14, 32, 'forrest_ground_01', [0, -7, -20.9]);
  const grass = K.pbr('aerial_grass_rock', [12, 12]); for (const x of [-13.3, 13.3]) K.plane(14, 40, grass, [x, 0.01, -16.7]); K.plane(12.6, 32, grass, [0, 0.01, -20.9]);
  // pit (stone lined) + liquid with a cut front face
  pb(12, 2.5, 0.4, 'rustic_stone_wall_02', [0, -1.25, -4.5], { tint: 0x8a8070 }); for (const x of [-6.1, 6.1]) pb(0.4, 2.5, 7.8, 'rustic_stone_wall_02', [x, -1.25, -0.6], { tint: 0x8a8070 });
  const liq = new THREE.Mesh(new THREE.BoxGeometry(11.8, 1.7, 7.4), new THREE.MeshStandardMaterial({ color: 0x3a2610, roughness: 0.55, metalness: 0.0, envMapIntensity: 0.06 })); liq.position.set(0, LIQ - 0.85, -0.6); liq.receiveShadow = true; K.scene.add(liq);
  // walls: stone outside, plaster inside the hall
  pb(13.2, 7.5, 0.6, 'medieval_blocks_03', [0, 3.75, -4.6], { s: 2.2 });
  for (const x of [-6.6, 6.6]) pb(0.6, 7.5, 8.4, 'medieval_blocks_03', [x, 3.75, -0.7], { s: 2.2 });
  pb(12, 3.9, 0.05, 'white_plaster_02', [-0.9, 5.15, -4.27], { tint: 0xe8dcc8 });
  // window niche in back wall (the king's seat): opening x 3.9..5.1, y 3.4..5.3
  const niche = pb(1.4, 2.1, 0.55, null, [4.5, 4.35, -4.32], { col: 0x2a2420 }); niche.material = K.pbr('medieval_blocks_03', [1, 1.5]);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.6), new THREE.MeshBasicMaterial({ color: 0xcfe6ff })); glass.position.set(4.5, 4.4, -4.58); K.scene.add(glass);
  pb(1.5, 0.18, 0.75, 'medieval_blocks_03', [4.5, 3.35, -4.05]);
  // roof (cut at the front) + tie beams
  for (const s of [-1, 1]) { const r = pb(7.4, 0.3, 9.2, 'clay_roof_tiles_02', [s * 3.3, 8.6, -0.7]); r.rotation.z = -s * 0.62; }
  for (const z of [-3, 0, 2.6]) pb(13, 0.3, 0.3, 'dark_wood', [0, 7.4, z]);
  // floor: 4 hinged segments resting on 3 breakable beams (+2 wall beams)
  const piv = [-6.3, -3, 3, 6.3];
  for (let i = 0; i < 4; i++) { const g = new THREE.Group(); g.position.set(piv[i], FLOOR, 0); K.scene.add(g); g.userData.noCull = true;
    const x0 = -6.3 + i * 3.15, xc = x0 + 1.575; pb(3.15, 0.14, 7.6, 'wood_floor', [xc - piv[i], -0.07, -0.6], { parent: g, s: 1.2 });
    segs.push({ g, piv: piv[i], dir: i < 2 ? -1 : 1 }); }
  for (const x of [-6.2, 6.2]) pb(0.35, 0.42, 7.6, 'dark_wood', [x, FLOOR - 0.35, -0.6]);
  for (const x of BX) { const hs = []; for (const s of [-1, 1]) { const g = new THREE.Group(); g.position.set(x, FLOOR - 0.35, s < 0 ? -4.3 : 3.0); K.scene.add(g); g.userData.noCull = true;
      pb(0.35, 0.42, 3.65, 'dark_wood', [0, 0, -s * 1.825], { parent: g }); const rot = new THREE.Mesh(new THREE.BoxGeometry(0.37, 0.05, 3.6), new THREE.MeshStandardMaterial({ color: 0x1e2a12, roughness: 1, transparent: true, opacity: 0 })); rot.position.set(0, -0.2, -s * 1.825); g.add(rot); hs.push({ g, s, rot }); }
    beams.push({ x, hs }); }
  // benches + banner + table inside the hall
  // crowd on the floor (children of the segment under them)
  const types = ['modular_men/Adventurer', 'modular_women/Medieval', 'modular_men/Adventurer', 'modular_men/King'];
  const robes = [0x7a1a1a, 0x1e3a7a, 0x5a2a6a, 0x2a5a2a, 0x8a5a1a, 0x3a3a3a];
  for (let n = 0; n < 26; n++) { let x = -5.6 + R(n) * 11.2, z = -3.4 + R(n + 50) * 6.2; if (x > 3.6 && z < -2.5) x -= 2.5;
    const si = Math.min(3, Math.floor((x + 6.3) / 3.15)); const S = segs[si]; const t = types[n % 3 === 2 ? 1 : (n % 7 === 0 ? 3 : 0)];
    const c = robes[n % robes.length]; const P = await K.person(t, [x - S.piv, 0, z], 0, 1.68 + R(n + 9) * 0.14, { parent: S.g, recolor: { Green: c, LightGreen: c, Blue: c, LightBrown: c } });
    P.base = [x - S.piv, 0, z]; P.yaw = Math.atan2(0 - x, 0.5 - z) + (R(n + 3) - 0.5) * 1.2; P.seg = si; P.ph = R(n + 7) * 30; crowd.push(P); }
  king = await K.person('modular_men/King', [4.5, 3.44, -4.0], 0, 1.7); king.root.userData.noCull = true;
  // ladder (rescue)
  ladder = new THREE.Group(); for (const s of [-0.25, 0.25]) pb(0.08, 5.2, 0.08, 'dark_wood', [s, 2.6, 0], { parent: ladder }); for (let i = 0; i < 12; i++) pb(0.5, 0.06, 0.06, 'dark_wood', [0, 0.3 + i * 0.42, 0], { parent: ladder });
  ladder.position.set(4.5, -0.8, -3.3); ladder.rotation.x = -0.12; K.scene.add(ladder); ladder.userData.noCull = true;
  for (let i = 0; i < 14; i++) gas.push(sprite('rgba(190,200,90,0.7)', 1.6, 0));
  for (let i = 0; i < 18; i++) dust.push(sprite('rgba(200,180,150,0.7)', 0.35, 0));
  const dm = new THREE.MeshStandardMaterial({ color: 0x4a3818, roughness: 0.2 }); for (let i = 0; i < 70; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), dm); d.visible = false; d.userData.noCull = true; K.scene.add(d); drops.push(d); }
  // ---------- TOWN (x = 200) ----------
  const X = 200; const cob = K.pbr('cobblestone_floor_04', [40, 40]); K.plane(120, 120, cob, [X, 0, -20]);
  const hs = [['House_1', -9, -4, 1.57], ['House_2', 9, -6, -1.57], ['House_3', -9, -15, 1.57], ['Inn', 10, -17, -1.57], ['House_4', -9, 6, 1.57], ['House_2', 9, 5, -1.57]];
  for (const [m, x, z, r] of hs) await K.placeH(`medieval_village_pack/${m}`, [X + x, 0, z], r, 8, {});
  // stone hall front (same building, seen from the square) + cathedral tower
  pb(13, 7.5, 8, 'medieval_blocks_03', [X, 3.75, -27], { s: 2.2 }); for (const s of [-1, 1]) { const r = pb(7.4, 0.3, 8.6, 'clay_roof_tiles_02', [X + s * 3.3, 8.6, -27]); r.rotation.z = -s * 0.62; }
  pb(2.2, 3.2, 0.3, 'dark_wood', [X, 1.6, -22.9]); await K.placeH('medieval_village_pack/Bell_Tower', [X + 9, 0, -34], 0, 24);
  await K.placeH('medieval_village_pack/Cart', [X + 5, 0, -2], 0.6, 1.6); await K.placeH('medieval_village_pack/MarketStand_1', [X - 5.5, 0, 1], 1.57, 2.6); await K.placeH('medieval_village_pack/Well', [X + 4, 0, -10], 0, 2.2);
  nobles = [await K.person('modular_men/King', [X, 0, 0], 0, 1.72), await K.person('modular_men/Adventurer', [X - 1.3, 0, -0.6], 0.9, 1.75, { recolor: { Green: 0x7a1a1a, LightGreen: 0x7a1a1a } }), await K.person('modular_men/Adventurer', [X + 1.3, 0, -0.6], -0.9, 1.78, { recolor: { Green: 0x1e3a7a, LightGreen: 0x1e3a7a } })];
  for (let n = 0; n < 16; n++) { const P = await K.person(n % 3 === 1 ? 'modular_women/Medieval' : 'modular_men/Adventurer', [X, 0, 0], Math.PI, 1.68 + R(n + 4) * 0.14, { recolor: { Green: robes[n % 6], LightGreen: robes[(n + 2) % 6] } });
    P.lane = (n % 4 - 1.5) * 1.1 + (R(n) - 0.5) * 0.4; P.z0 = 8 + Math.floor(n / 4) * 2.4 + R(n + 1); P.ph = R(n + 2) * 20; walkers.push(P); }
}

// collapse state c 0..1 (beam 0 first, then 3, then -3; segments drop into the pit)
function collapse(c, f, crack = 0) {
  const bt = [0.0, 0.22, 0.42]; // break time per beam index BX
  const order = [1, 2, 0];
  beams.forEach((b, i) => { const st = bt[order.indexOf(i)]; const d = Math.max(0, Math.min(1, (c - st) / 0.3)); const pre = c <= st ? crack * (i === 1 ? 1 : 0) : 0;
    for (const h of b.hs) { h.g.rotation.x = -h.s * (pre * 0.09 + d * 1.1); h.g.position.y = FLOOR - 0.35 - Math.max(0, d - 0.6) * 9; } });
  const st = [0.42, 0.05, 0.06, 0.22];
  segs.forEach((s, i) => { const d = Math.max(0, Math.min(1, (c - st[i]) / 0.42)); const a = Math.min(1, d * 1.6);
    s.g.rotation.z = (i < 2 ? -1 : 1) * a * a * 0.9;
    s.g.position.y = FLOOR - Math.max(0, d - 0.45) / 0.55 * (FLOOR - LIQ - 0.12) * Math.min(1, Math.max(0, d - 0.45) / 0.55);
    s.d = d; });
  crowd.forEach((P) => { const d = segs[P.seg].d; const sunk = Math.max(0, d - 0.9) * 10;
    K.posePerson(P, d > 0.02 ? { pos: [P.base[0], -sunk * 0.9, P.base[2]], yaw: P.yaw, arms: 'flail', fall: Math.min(1, d * 2) } : { pos: P.base, yaw: P.yaw, arms: (P.ph | 0) % 3 === 0 ? 'talk' : 'down', look: [0, 0] }, f + P.ph);
    P.root.visible = sunk < 1.6; });
  // splash drops around segments hitting the liquid
  let k = 0; drops.forEach((d) => (d.visible = false));
  segs.forEach((s, i) => { const u = (s.d - 0.85) / 0.15; if (u <= 0 || u >= 1.4) return; for (let j = 0; j < 17 && k < drops.length; j++, k++) { const dr = drops[k]; const a = R(i * 31 + j) * 6.28, v = 1.5 + R(j + i) * 2.5;
      dr.position.set(s.piv + (i < 2 ? 1.5 : -1.5) + Math.cos(a) * v * u, LIQ + 3.2 * u - 4.5 * u * u + 0.1, -0.6 + Math.sin(a) * v * u * 0.8); dr.visible = dr.position.y > LIQ - 0.05; } });
}

function hideFX() { gas.forEach((g) => (g.material.opacity = 0)); dust.forEach((d) => (d.material.opacity = 0)); beams.forEach((b) => b.hs.forEach((h) => (h.rot.material.opacity = 0))); ladder.visible = false; }
function gasFX(f, amt) { gas.forEach((g, i) => { const t = ((f / 30) * 0.25 + R(i)) % 1; g.position.set(-4 + R(i + 3) * 8, LIQ + t * 3.6, -1 + R(i + 8) * 3.8); g.scale.setScalar(1.2 + t * 2); g.material.opacity = amt * 0.55 * Math.sin(t * Math.PI); }); }
function dustFX(f, x, amt, t0) { dust.forEach((d, i) => { const t = Math.max(0, (f - t0) / 30 * 0.8 - R(i) * 0.3); d.position.set(x + (R(i + 2) - 0.5) * 0.8, FLOOR - 0.5 - t * 2.2, 0.8 + R(i + 6) * 2.2); d.material.opacity = amt * 0.85 * Math.max(0, 1 - t); d.scale.setScalar(0.5 + t * 0.6); }); }

export function frame(f, k) {
  K = k; const i = K.at(f), u = K.u(f, i); hideFX();
  K.preset('day', { photo: 'kloofendal_48d_partly_cloudy_puresky_2k', sunDir: [0.35, 0.75, 0.6], sunI: 3.0, exposure: 1.0, fog: [0xcfdff0, 60, 320] });
  K.shadowSpan = 16; K.posePerson(king, { pos: [4.5, 3.44, -4.0], yaw: 0, sit: 1, arms: 'sitlap', sitDrop: -0.85 }, f);
  nobles.forEach((P, j) => K.posePerson(P, { arms: j === 0 ? 'down' : 'talk', look: [0, 0], t: f + j * 11 }, f));
  walkers.forEach((P) => K.posePerson(P, { pos: [200 + P.lane, 0, 99], yaw: Math.PI }, f));
  let c = 0, crack = 0; const M = (A, B, uu, sh = 0.5) => K.move(A, B, uu, sh, f);
  switch (i) {
    case 0: c = 0.08 + u * 0.3; M({ p: [3, 5.2, 9.5], l: [0, 1.8, -1], fov: 48 }, { p: [1.2, 4.3, 7.8], l: [0, 1.9, -1], fov: 46 }, u, 1.2); break;
    case 1: M({ p: [200.3, 1.8, 6.2], l: [200, 1.25, -0.4], fov: 40 }, { p: [202.9, 2.0, 5.0], l: [200, 1.25, -0.4], fov: 40 }, u); break;
    case 2: M({ p: [200, 2.2, 5], l: [200, 2.6, -8], fov: 40 }, { p: [200, 15, 12], l: [200, 4, -24], fov: 42 }, u, 0.3); break;
    case 3: walkers.forEach((P) => { const z = P.z0 - (f + P.ph) / 30 * 1.25 * 1.0 - u * 2; K.posePerson(P, { pos: [200 + P.lane, 0, Math.max(-22.4, z)], yaw: Math.PI, walk: 1, t: f + P.ph }, f); P.root.visible = z > -22.3; });
      M({ p: [201.5, 1.2, -6], l: [200, 1.5, 4], fov: 40 }, { p: [201.2, 1.4, -10], l: [200, 1.4, 2], fov: 40 }, u); break;
    case 4: M({ p: [-4.2, 5.1, 4.6], l: [-2, 4.1, -2], fov: 42 }, { p: [3, 5.0, 4.6], l: [4.2, 4.0, -2.4], fov: 42 }, u); break;
    case 5: M({ p: [0, 4.6, 5.6], l: [0, 3.9, -1.5], fov: 44 }, { p: [0, 0.0, 8.5], l: [0, -0.7, -1.5], fov: 44 }, u, 0.3); break;
    case 6: M({ p: [0, 1.6, 15], l: [0, 1.3, -1], fov: 44 }, { p: [0, 2.8, 25], l: [0, 1.6, -1], fov: 44 }, u, 0.2); break;
    case 7: crack = Math.min(1, u * 3); dustFX(f, 0, crack, K.ph[7].a); M({ p: [1.7, 3.2, 5.6], l: [0, 2.95, 2.0], fov: 38 }, { p: [1.0, 3.05, 4.7], l: [0, 2.95, 2.2], fov: 38 }, u, 0.9); break;
    case 8: crack = 1; gasFX(f, 1); beams.forEach((b) => b.hs.forEach((h) => (h.rot.material.opacity = Math.min(0.85, 0.15 + u)))); M({ p: [-1.6, 1.8, 5.6], l: [0, 2.5, 1.5], fov: 42 }, { p: [1.5, 2.1, 5.0], l: [0, 2.6, 1.0], fov: 42 }, u, 0.3); break;
    case 9: c = u * 0.15; crack = 1; dustFX(f, 0, 1, K.ph[9].a); M({ p: [1.8, 1.4, 6.5], l: [1.5, 2.8, 0], fov: 40 }, { p: [1.2, 1.6, 6], l: [1.2, 2.6, 0], fov: 40 }, u, 0.7); break;
    case 10: c = 0.15 + u * 0.2; dustFX(f, -3, 1, K.ph[10].a); M({ p: [4.5, 2.2, 7], l: [3, 2.6, -0.5], fov: 40 }, { p: [-4.5, 2.2, 7], l: [-3, 2.4, -0.5], fov: 40 }, u, 0.6); break;
    case 11: c = 0.35 + u * 0.65; M({ p: [3.8, 4.4, 11], l: [4.0, 2.6, -1], fov: 46 }, { p: [3.4, 3.2, 9.5], l: [3.6, 1.3, -1], fov: 46 }, u, 1.0); break;
    case 12: c = 1; K.grade.sat.value = 0.8; K.grade.vig.value = 0.25; M({ p: [0, 6.5, 7.5], l: [0, -0.8, -1], fov: 44 }, { p: [0, 5.6, 6.6], l: [0, -0.8, -1], fov: 44 }, u, 0.15); break;
    case 13: c = 1; M({ p: [2.2, 4.3, 0.6], l: [4.5, 3.9, -4.2], fov: 40 }, { p: [3.2, 4.1, -1.2], l: [4.5, 3.95, -4.2], fov: 38 }, u, 0.3); break;
    case 14: { c = 1; K.posePerson(king, { pos: [4.5, 3.44, -4.15], yaw: 0, arms: 'cling', look: [0, 0.3] }, f); ladder.visible = u > 0.45; ladder.position.y = -0.8 - 6 * Math.max(0, 1 - (u - 0.45) / 0.35);
      M({ p: [4.2, 4.1, -2.2], l: [4.5, 4.0, -4.2], fov: 40 }, { p: [1.5, 3, 6.5], l: [4, 2.6, -3.5], fov: 42 }, u, 0.3); break; }
    case 15: c = 1; K.preset('golden', { photo: 'belfast_sunset_puresky_2k' }); M({ p: [2, 5, 20], l: [0, 2.5, -1], fov: 42 }, { p: [4, 11, 38], l: [0, 3, -1], fov: 42 }, u, 0.2); break;
    default: c = 0; M({ p: [1, 4.6, 8], l: [4.5, 3.9, -4.2], fov: 42 }, { p: [3.6, 4.1, -0.8], l: [4.5, 3.9, -4.2], fov: 40 }, u, 0.4);
  }
  collapse(c, f, crack);
}
