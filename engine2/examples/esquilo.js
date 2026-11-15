// VID-021 — Esquilo (Gela, Sicilia, 456 a. C.) — LEGEND: an oracle said something from the sky would kill him; he lived outdoors; an eagle mistook his bald head for a rock and dropped a tortoise. No gore (cut to flash, tortoise walks away).
export let FRAMES = 2100;
let K, T, ES, OR, S1, S2, FA, SG = {}, eagle, tort, tort2, mask, mask2, scrolls = [], shield, spear, star, smoke = [], fans = [], laurel;
const DAYSKY = 'kloofendal_48d_partly_cloudy_puresky_2k', GOLDSKY = 'kloofendal_48d_partly_cloudy_puresky_2k', DUSKSKY = 'qwantani_dusk_2_puresky_2k', NIGHTSKY = 'kloppenheim_02_puresky_2k';
const FIELD = [0, 0, 0], THEA = [200, 0, 0], ORA = [400, 0, 0], BAT = [600, 0, 0], SKY = [800, 40, 0];
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
const ROCK = add(FIELD, [0, 0, -1]);

function makeEagle() {
  const g = new K.THREE.Group(); const b = K.sph(0.6, 0x5a3418, [0, 0, 0], { parent: g }); b.scale.set(0.8, 0.7, 1.5);
  K.sph(0.34, 0xf8f4ea, [0, 0.25, 0.85], { parent: g }); const bk = K.cyl(0.0, 0.12, 0.3, 0xf0b020, [0, 0.2, 1.25], { parent: g }); bk.rotation.x = Math.PI / 2;
  K.sph(0.06, 0x16121a, [0.18, 0.33, 1.05], { parent: g }); K.sph(0.06, 0x16121a, [-0.18, 0.33, 1.05], { parent: g });
  const wings = []; for (const s of [-1, 1]) { const piv = new K.THREE.Group(); piv.position.set(s * 0.35, 0.15, 0); const w = K.box(2.6, 0.08, 1.0, 0x6a4020, [s * 1.3, 0, 0], { parent: piv }); K.box(0.9, 0.06, 0.7, 0x3a2410, [s * 2.5, 0, -0.2], { parent: piv }); g.add(piv); wings.push(piv); void w; }
  const tl = K.box(0.7, 0.06, 0.8, 0xf2ead8, [0, 0, -1.0], { parent: g });
  g.userData.wings = wings; K.scene.add(g); return g;
}
function makeTortoise(s = 1) {
  const g = new K.THREE.Group(); const sh = new K.THREE.Mesh(new K.THREE.SphereGeometry(0.5, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), K.std(0x4a7a2a)); g.add(sh);
  const pt = K.tex(128, 128, (c) => { c.fillStyle = '#6a9a3a'; c.fillRect(0, 0, 128, 128); c.strokeStyle = '#3a5a1a'; c.lineWidth = 6; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { c.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; c.lineTo(16 + i * 32 + Math.cos(a) * 14, 16 + j * 32 + Math.sin(a) * 14); } c.closePath(); c.stroke(); } });
  sh.material = K.std(0xffffff, { map: pt });
  K.sph(0.17, 0x9ab85a, [0, 0.05, 0.6], { parent: g }); for (const [x, z] of [[-0.35, 0.3], [0.35, 0.3], [-0.35, -0.3], [0.35, -0.3]]) K.cyl(0.08, 0.08, 0.2, 0x9ab85a, [x, -0.05, z], { parent: g });
  g.scale.setScalar(s); K.scene.add(g); return g;
}
function mkMask(col) { const g = new K.THREE.Group(); const m = K.sph(0.35, col, [0, 0, 0], { parent: g }); m.scale.set(1, 1.2, 0.4); K.sph(0.06, 0x16121a, [-0.12, 0.08, 0.13], { parent: g }); K.sph(0.06, 0x16121a, [0.12, 0.08, 0.13], { parent: g }); const mo = K.box(0.18, 0.05, 0.05, 0x16121a, [0, -0.15, 0.13], { parent: g }); mo.rotation.z = 0; K.scene.add(g); return g; }
function fan(pos, col) { const g = new K.THREE.Group(); K.cyl(0.22, 0.26, 0.6, col, [0, 0.3, 0], { parent: g }); K.sph(0.26, 0xfffdf8, [0, 0.85, 0], { parent: g }); g.position.set(...pos); K.scene.add(g); fans.push({ g, y: pos[1], ph: Math.random() * 6 }); }

export async function build(k) {
  K = k; await K.preloadEnvs(); await K.preloadSkies([DAYSKY, GOLDSKY, DUSKSKY]); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  ES = C(K.scene, { shirt: 0xd8c08a, cape: 0x2a6aa8, belt: 0xe0b040, seed: 1 }); // bald: no hair
  OR = C(K.scene, { shirt: 0x6a2a8a, cape: 0xe0b040, hair: 0x15100c, seed: 2 });
  S1 = C(K.scene, { shirt: 0xb8301e, belt: 0xe0b040, hat: 'helmet', hatColor: 0xd8a040, seed: 3 }); S2 = C(K.scene, { shirt: 0xb8301e, belt: 0xe0b040, hat: 'helmet', hatColor: 0xd8a040, mustache: true, seed: 4 });
  FA = C(K.scene, { shirt: 0x8a6a3a, belt: 0x4a2a14, hair: 0x5a3418, hat: 'cap', hatColor: 0xc8a060, seed: 5 });
  eagle = makeEagle(); tort = makeTortoise(0.55); tort2 = makeTortoise(0.55);
  mask = mkMask(0xf2ead8); mask2 = mkMask(0xe0b040);
  for (let i = 0; i < 6; i++) { const s = K.cyl(0.08, 0.08, 0.6, 0xf2e6c8, [0, -99, 0]); s.rotation.z = Math.PI / 2; scrolls.push(s); }
  shield = K.cyl(0.55, 0.55, 0.08, 0xd8a040, [0, -99, 0], { metalness: 0.5 }); spear = K.cyl(0.03, 0.03, 2.4, 0x6a3a1a, [0, -99, 0]);
  star = K.sph(0.09, 0xffffff, [0, -99, 0], { emissive: 0xffffff, emissiveIntensity: 8 }); star.scale.set(1, 1, 1);
  laurel = new K.THREE.Group(); const ring = new K.THREE.Mesh(new K.THREE.TorusGeometry(0.3, 0.035, 8, 28), K.std(0x4a6a1e)); ring.rotation.x = Math.PI / 2; laurel.add(ring); for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; const l = K.sph(0.06, 0x6a9a2a, [Math.cos(a) * 0.31, 0.02, Math.sin(a) * 0.31], { parent: laurel }); l.scale.set(1.6, 0.5, 0.8); } K.scene.add(laurel);
  for (let i = 0; i < 12; i++) { const sm = K.sph(0.3, 0xe8e0f8, [0, -99, 0], { transparent: true, opacity: 0.14 }); sm.userData.noDepth = true; smoke.push(sm); }

  // ---------------- FIELD: Sicily, golden grass, olive trees, rocks, sea ----------------
  const gr = K.tex(256, 256, (g, w, h) => { g.fillStyle = '#c8a84a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 1200; i++) { g.fillStyle = ['#d8b85a', '#b8983a', '#a8b04a'][i % 3]; g.fillRect(Math.random() * w, Math.random() * h, 2, 6); } }, [14, 14]);
  K.plane(120, 120, K.pbr('aerial_grass_rock', [24, 24], { tint: 0xe8f0a0 }), add(FIELD, [0, 0.01, 0]));
  
  for (let i = 0; i < 4; i++) await K.placeH('nature_pack/Rock_' + (i + 1), add(FIELD, [[-4, 11, -7, 8][i], 0, [-6, -14, -12, -10][i]]), i, [1.4, 1.1, 2.2, 1.8][i]).catch(() => {});
  await K.placeH('nature_pack/Rock_6', ROCK, 0.3, 0.75, { tint: 0xc8b8a0 }).catch(() => { K.box(1.4, 0.75, 1.0, 0xb8a890, add(ROCK, [0, 0.37, 0])); });
  for (let i = 0; i < 9; i++) await K.placeH('nature_pack/CommonTree_' + ((i % 5) + 1), add(FIELD, [(i % 2 ? 1 : -1) * (6 + (i % 4) * 3.5), 0, -8 - (i % 3) * 5]), i, 4.5, { tint: 0x9ab07a }).catch(() => {});
  for (let i = 0; i < 26; i++) await K.placeH(['nature_pack/Bush_1', 'nature_pack/Bush_2', 'nature_pack/BushBerries_1', 'nature_pack/Plant_2', 'nature_pack/Flowers'][i % 5], add(FIELD, [Math.sin(i * 2.3) * (4 + (i % 7) * 3), 0, -3 - (i % 9) * 3.2]), i, [1.0, 1.2, 0.9, 0.7, 0.5][i % 5], { tint: 0xc8d890 }).catch(() => {});
  for (let i = 0; i < 12; i++) await K.placeH('nature_pack/CommonTree_' + ((i % 5) + 1), add(FIELD, [(i % 2 ? 1 : -1) * (14 + (i % 5) * 6), 0, -22 - (i % 4) * 8]), i, 6, { tint: 0x9ab07a }).catch(() => {});
  for (let i = 0; i < 10; i++) await K.placeH('nature_pack/Grass', add(FIELD, [-3 + (i % 5) * 1.4, 0, 0.8 + Math.floor(i / 5) * 0.8]), i, 0.5).catch(() => {});
  // tiny house with roof he leaves behind (left)
  await K.placeH('medieval_village_pack/House_2', add(FIELD, [-9.5, 0, -3]), 0.6, 4.5).catch(() => {});
  const DROCK = add(FIELD, [5, 0, -5]); K.sph(0.9, 0x9a9088, add(DROCK, [0, 0.45, 0])).scale.set(1.3, 0.6, 1.0);
  
  SG.tor = K.sign('TORTUGA DEL CIELO', add(FIELD, [0, 4.6, -6]), { w: 5.0, h: 1.0, bg: '#b8301e' });
  SG.ley = K.sign('LEYENDA', add(FIELD, [-1.8, 3.6, -5]), { w: 2.6, h: 0.9, bg: '#6a2a8a', border: '#e0b040' });
  SG.sic = K.sign('SICILIA', add(FIELD, [2.4, 3.4, -6]), { w: 2.6, h: 0.9, bg: '#1e5a8a', border: '#f2ead8', posts: true });
  SG.sin = K.sign('SIN TECHOS', add(FIELD, [-6.4, 3.2, -4.5]), { w: 3.0, h: 0.9, bg: '#2a1a10', rotY: 0.4 });
  SG.cal = K.sign('CALVO', add(FIELD, [1.6, 3.4, -4.0]), { w: 2.2, h: 0.85, bg: '#e0b040', fg: '#2a1a10', border: '#2a1a10' });
  SG.y456 = K.sign('456 a. C.', add(FIELD, [1.8, 2.6, -3.4]), { w: 2.4, h: 0.85, bg: '#2a1a10' });

  // ---------------- THEATRE: Greek amphitheatre, white stone, masks ----------------
  K.plane(80, 80, K.pbr('rocky_terrain_02', [16, 16]), add(THEA, [0, 0.01, 0]));
  K.cyl(4, 4, 0.2, 0xf2ead8, add(THEA, [0, 0.1, 0]), { seg: 40 });
  for (let r = 0; r < 6; r++) { const ring = new K.THREE.Mesh(new K.THREE.CylinderGeometry(7 + r * 1.4, 7 + r * 1.4, 0.6, 48, 1, true, -Math.PI * 0.85, Math.PI * 1.7), K.pbr('sandstone_blocks_05', [12, 0.4], { side: K.THREE.DoubleSide })); ring.position.set(...add(THEA, [0, 0.3 + r * 0.6, 0])); ring.rotation.y = Math.PI; K.scene.add(ring); for (let i = 0; i < 12; i++) { const a = Math.PI + (-0.75 + i / 11 * 1.5) * Math.PI * 0.85; if ((i + r) % 2) fan(add(THEA, [Math.sin(a) * (7.2 + r * 1.4), 0.6 + r * 0.6, Math.cos(a) * (7.2 + r * 1.4)]), [0xb8301e, 0x2a6aa8, 0xe0a030, 0x3a8a3a, 0x8a2a6a][(i + r) % 5]); } }
  for (let i = 0; i < 5; i++) { K.cyl(0.35, 0.4, 5, 0xf2ead8, add(THEA, [-4 + i * 2, 2.5, -6])); } K.box(10, 0.6, 1.2, 0xf2ead8, add(THEA, [0, 5.3, -6]));
  SG.tea = K.sign('TEATRO', add(THEA, [0, 6.4, -6]), { w: 2.8, h: 0.9, bg: '#1e5a8a', border: '#f2ead8' });
  SG.dec = K.sign('70 TRAGEDIAS', add(THEA, [2.6, 3.6, -5.4]), { w: 3.4, h: 0.9, bg: '#b8301e' });

  // ---------------- ORACLE: Delphi temple, purple smoke ----------------
  K.plane(40, 40, K.pbr('stone_tiles_02', [8, 8]), add(ORA, [0, 0.01, 0]));
  for (let i = 0; i < 6; i++) { K.cyl(0.4, 0.45, 6, 0xf2ead8, add(ORA, [-5 + i * 2, 3, -4])); } K.box(12, 0.8, 1.4, 0xf2ead8, add(ORA, [0, 6.4, -4])); K.plane(14, 8, K.pbr('rustic_stone_wall_02', [3, 2], { tint: 0x8a7aa8 }), add(ORA, [0, 4, -5.5]), [0, 0, 0]); K.ray(add(ORA, [0, 3.2, -2.4]), [0, 0, 0], 1.4, 5, 0xc8a0ff, 0.12);
  K.cyl(0.6, 0.8, 1.0, 0xc8a040, add(ORA, [0, 0.5, -2.4]), { metalness: 0.5 }); const fire = K.sph(0.35, 0xff9030, add(ORA, [0, 1.15, -2.4]), { emissive: 0xff6010, emissiveIntensity: 5 }); fire.scale.y = 1.5;
  SG.cie = K.sign('DEL CIELO', add(ORA, [0, 5.0, -5.3]), { w: 3.4, h: 0.95, bg: '#b8301e' });
  SG.del = K.sign('ORÁCULO', add(ORA, [0, 5.0, -5.32]), { w: 3.0, h: 0.95, bg: '#6a2a8a', border: '#e0b040' });
  K.pointLight(0xff8040, 9, add(ORA, [0, 2.2, -1.4]), 8); K.pointLight(0xa080ff, 5, add(ORA, [-3, 3, 0]), 10);

  // ---------------- BATTLE: Marathon plain ----------------
  K.plane(80, 80, K.pbr('forrest_ground_01', [16, 16], { tint: 0xe8d890 }), add(BAT, [0, 0.01, 0]));
  for (let i = 0; i < 14; i++) { const g = new K.THREE.Group(); K.cyl(0.22, 0.26, 0.7, 0xb8301e, [0, 0.55, 0], { parent: g }); K.sph(0.28, 0xfffdf8, [0, 1.15, 0], { parent: g }); K.sph(0.3, 0xd8a040, [0, 1.25, 0], { parent: g }).scale.y = 0.7; K.cyl(0.45, 0.45, 0.06, 0xd8a040, [0, 0.7, 0.3], { parent: g }).rotation.x = Math.PI / 2; const sp = K.cyl(0.025, 0.025, 2.2, 0x6a3a1a, [0.3, 1.2, 0], { parent: g }); sp.rotation.x = 0.3; g.position.set(...add(BAT, [-7 + (i % 7) * 2.2, 0, -4 - Math.floor(i / 7) * 2])); K.scene.add(g); fans.push({ g, y: 0, ph: i }); }
  for (let i = 0; i < 3; i++) await K.placeH('nature_pack/Rock_' + (i + 2), add(BAT, [-8 + i * 7, 0, -12]), i, 2.5).catch(() => {});
  K.cloud(add(BAT, [0, 16, -30]), 3);
  SG.mar = K.sign('MARATÓN', add(BAT, [0, 4.2, -7]), { w: 3.2, h: 1.0, bg: '#b8301e', posts: true });
  // ---------------- SKY: just clouds ----------------
  for (let i = 0; i < 6; i++) K.cloud(add(SKY, [-12 + i * 5, -6 + (i % 3) * 2, -18 - (i % 2) * 6]), 2 + (i % 3) * 0.6);
}

function hideAll() {
  for (const c of [ES, OR, S1, S2, FA]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.hold(null); }
  for (const g of Object.values(SG)) g.visible = false;
  for (const o of [eagle, tort, tort2, mask, mask2, shield, spear, star, laurel, ...scrolls]) { if (o.parent !== K.scene) { if (o.parent) o.parent.remove(o); K.scene.add(o); } o.position.set(0, -99, 0); o.rotation.set(0, 0, 0); }
  for (const s of scrolls) s.rotation.z = Math.PI / 2; for (const s of smoke) s.position.set(0, -99, 0);
}
function flyEagle(pos, t, yaw = 0, flap = 1) { eagle.position.set(...pos); eagle.rotation.set(0.1, yaw, Math.sin(t * 1.5) * 0.15); const a = Math.sin(t * 9) * 0.55 * flap; eagle.userData.wings[0].rotation.z = -a; eagle.userData.wings[1].rotation.z = a; }
function sitting(f, t, o = {}) { const p = add(ROCK, [0, 0.25, 0.1]); P(ES, { pos: p, yaw: o.yaw ?? 0, sit: 1, expr: o.expr || 'happy', look: o.look || [0, 0], arms: o.arms || 'down', lean: o.lean || 0 }, f); return p; }

export function frame(f, k) {
  hideAll(); const ph = K.at(f), t = f / 30, u = (i) => K.u(f, i);
  K.preset('golden', { exposure: 1.1, photo: GOLDSKY });
  fans.forEach(fa => { fa.g.position.y = fa.y + Math.abs(Math.sin(t * 6 + fa.ph)) * 0.08; });
  const head = add(ROCK, [0, 1.55, 0.1]);
  const hook = (v, rev) => { const p = sitting(f, t, { expr: 'happy', look: [0, 0] }); SG.tor.visible = true; const y = 2.2 - 0.8 * (rev ? 1 - v : v); tort.position.set(...add(head, [0.15, y, 0])); tort.rotation.set(t * 3, t * 2, 0.6); flyEagle(add(head, [1.4, 5.2, -2.5]), t, 0.5, 1); };
  switch (ph) {
    case 0: { const v = u(0); hook(v); K.move({ p: add(ROCK, [1.2, 0.9, 5.0]), l: add(head, [0, 1.4, 0]), fov: 50 }, { p: add(ROCK, [0.9, 0.9, 4.4]), l: add(head, [0, 1.3, 0]), fov: 48 }, v, 0.7, f); K.focusOn(add(head, [0, 0.8, 0])); break; }
    case 1: { // legend: he saw it coming — nervously staring at the sky
      SG.ley.visible = true; const p = add(FIELD, [0, 0, 1.0]); P(ES, { pos: p, yaw: 0.2, expr: 'worried', look: [0, 0.6], arms: 'hold2', sweat: true }, f);
      K.move(K.frame([p], { yaw: 0.35, h: 2.6, lookY: 1.9, pitch: -0.08, push: 0.85 }), K.frame([p], { yaw: 0.2, h: 2.6, lookY: 2.0, pitch: -0.1, push: 0.75 }), u(1), 0.5, f); K.focusOn(add(p, [0, 2, 0])); break; }
    case 2: { // one of the fathers of Greek theatre: in the orchestra holding a mask, crowd
      K.preset('day', { exposure: 1.05, photo: DAYSKY }); SG.tea.visible = true; const p = add(THEA, [0, 0.2, 0]); P(ES, { pos: p, yaw: 0, expr: 'proud', arms: 'hold' }, f); ES.hold(mask, [0, 0.1, 0.15], [0, 0, 0]);
      K.move(K.frame([p], { yaw: 0.25, h: 3.0, lookY: 2.0, pitch: -0.08, push: 0.95 }), K.frame([p], { yaw: 0.1, h: 3.0, lookY: 2.0, pitch: -0.1, push: 0.82 }), u(2), 0.5, f); K.focusOn(add(p, [0, 2, 0])); break; }
    case 3: { // dozens of tragedies... and fought at Marathon
      const v = u(3);
      if (v < 0.45) { K.preset('day', { exposure: 1.05, photo: DAYSKY }); SG.dec.visible = true; const p = add(THEA, [0.6, 0.2, -1.0]); P(ES, { pos: p, yaw: -0.2, expr: 'smug', arms: 'hold2' }, f); scrolls.forEach((s, i) => s.position.set(...add(p, [-1.0 + (i % 3) * 0.2, 0.15 + Math.floor(i / 3) * 0.16, 0.6]))); mask2.position.set(...add(p, [-1.2, 2.0, -0.5]));
        K.move(K.frame([p], { yaw: -0.3, h: 2.8, lookY: 1.8, pitch: -0.05, push: 0.9 }), K.frame([p], { yaw: -0.2, h: 2.8, lookY: 1.8, pitch: -0.06, push: 0.82 }), v / 0.45, 0.5, f); K.focusOn(add(p, [0, 1.8, 0])); }
      else { K.preset('day', { exposure: 1.0, photo: DAYSKY }); SG.mar.visible = true; const p = add(BAT, [0, 0, 0]); P(ES, { pos: p, yaw: 0.1, expr: 'angry', arms: 'fists', bounce: 0.3 }, f); shield.position.set(...add(p, [0.45, 1.05, 0.4])); shield.rotation.set(Math.PI / 2, 0, 0.2);
        P(S1, { pos: add(p, [-1.5, 0, -0.8]), yaw: 0.3, expr: 'angry', arms: 'fists' }, f); P(S2, { pos: add(p, [1.6, 0, -0.9]), yaw: -0.3, expr: 'angry', arms: 'point' }, f);
        K.move(K.frame([p, add(p, [-1.5, 0, -0.8]), add(p, [1.6, 0, -0.9])], { yaw: 0.15, h: 3.0, lookY: 1.9, pitch: -0.06, push: 0.9 }), K.frame([p, add(p, [-1.5, 0, -0.8]), add(p, [1.6, 0, -0.9])], { yaw: 0.0, h: 3.0, lookY: 1.9, pitch: -0.08, push: 0.8 }), (v - 0.45) / 0.55, 0.9, f); K.focusOn(add(p, [0, 2, 0])); }
      break; }
    case 4: { // an oracle gave him a terrible warning
      K.preset('night', { exposure: 1.3 }); SG.del.visible = true; const o = add(ORA, [-1.2, 0, -1.6]), e = add(ORA, [1.4, 0, -0.6]);
      smoke.forEach((s, i) => { const k2 = (t * 0.25 + i / 8) % 1; s.position.set(...add(ORA, [Math.sin(i * 2 + t) * 0.4, 1.4 + k2 * 4, -2.4 + Math.cos(i) * 0.3])); s.scale.setScalar(0.6 + k2 * 1.6); });
      P(OR, { pos: o, yaw: 0.6, expr: 'angry', arms: 'point', talk: 0.7 }, f); P(ES, { pos: e, yaw: -0.8, expr: 'scared', arms: 'hold2' }, f);
      K.move(K.frame([o, e], { yaw: 0.1, h: 3.0, lookY: 2.0, pitch: -0.05, push: 0.92 }), K.frame([o, e], { yaw: -0.05, h: 3.0, lookY: 2.0, pitch: -0.06, push: 0.84 }), u(4), 0.5, f); K.focusOn(add(ORA, [0, 2, -1.2])); break; }
    case 5: { // he'd die from something falling from the sky: oracle points UP, DEL CIELO, he looks up
      K.preset('night', { exposure: 1.3 }); SG.cie.visible = true; const o = add(ORA, [-1.0, 0, -1.6]), e = add(ORA, [1.2, 0, -0.8]);
      smoke.forEach((s, i) => { const k2 = (t * 0.25 + i / 8) % 1; s.position.set(...add(ORA, [Math.sin(i * 2 + t) * 0.4, 1.4 + k2 * 4, -2.4])); s.scale.setScalar(0.6 + k2 * 1.6); });
      P(OR, { pos: o, yaw: 0.4, expr: 'shock', arms: 'up' }, f); P(ES, { pos: e, yaw: -0.5, expr: 'shock', look: [0, 0.6], sweat: true, arms: 'hold2', tremble: 1 }, f);
      K.move(K.frame([e], { yaw: -0.4, h: 2.5, lookY: 1.9, pitch: -0.12, push: 0.8 }), K.frame([e], { yaw: -0.3, h: 2.5, lookY: 1.9, pitch: -0.14, push: 0.7 }), u(5), 0.5, f); K.focusOn(add(e, [0, 2, 0])); break; }
    case 6: { // decision: live far from roofs and walls — walks away from his house
      const v = u(6); SG.sin.visible = true; const s = add(FIELD, [-7.5, 0, -0.8]), e = add(FIELD, [-3.5, 0, 0.4]); const pos = K.lerp(s, e, v);
      P(ES, { pos, yaw: 1.3, walk: t * 1.6, expr: 'smug', arms: 'hold' }, f); scrolls[0].position.set(...add(pos, [0.3, 1.0, 0.2]));
      K.move(K.frame([pos], { yaw: 0.8, h: 3.4, lookY: 2.0, pitch: -0.05, push: 1.1, lx: -1.2 }), K.frame([pos], { yaw: 0.6, h: 3.2, lookY: 2.0, pitch: -0.05, push: 1.0, lx: -1.0 }), v, 0.5, f); K.focusOn(add(pos, [0, 2, 0])); break; }
    case 7: { // to the countryside in Sicily, always outdoors: wide golden field, sea, SICILIA
      SG.sic.visible = true; const p = add(FIELD, [0.8, 0, 0.6]); P(ES, { pos: p, yaw: 0.0, expr: 'happy', arms: 'up', bounce: 0.3 }, f);
      K.move({ p: add(FIELD, [3.5, 2.2, 7.5]), l: add(FIELD, [0, 2.2, -4]), fov: 48 }, { p: add(FIELD, [2.4, 2.0, 6.0]), l: add(FIELD, [0.4, 2.1, -4]), fov: 46 }, u(7), 0.4, f); K.focusOn(add(p, [0, 1.8, 0])); break; }
    case 8: { // but that wasn't the strangest: dark punch on him from behind, bald head glowing
      K.preset('golden', { exposure: 0.85, photo: GOLDSKY }); K.grade.vig.value = 0.7; const v = u(8); if (v < 0.08) K.grade.flash.value = 0.35;
      const p = sitting(f, t, { expr: 'neutral' });
      K.move(K.frame([p], { yaw: 0.6, h: 2.3, lookY: 1.6, pitch: 0.02, push: 0.85 }), K.frame([p], { yaw: 0.55, h: 2.2, lookY: 1.6, pitch: 0.02, push: 0.66 }), K.ease(v), 0.3, f); K.focusOn(add(head, [0, 0, 0])); break; }
    case 9: { // old... and completely bald: close-up, a sparkle pings off his head, CALVO
      SG.cal.visible = true; const p = sitting(f, t, { expr: 'smug', arms: 'cross' }); const v = u(9);
      const k2 = (v * 2.2) % 1; star.position.set(...add(head, [0.12, 0.33 + 0.05 * Math.sin(t * 9), 0.05])); star.scale.setScalar(k2 < 0.3 ? 0.5 + k2 * 6 : 0.3);
      K.move(K.frame([p], { yaw: -0.3, h: 2.2, lookY: 1.65, pitch: 0.12, push: 0.72 }), K.frame([p], { yaw: -0.2, h: 2.1, lookY: 1.7, pitch: 0.16, push: 0.62 }), v, 0.4, f); K.focusOn(add(head, [0, 0, 0])); break; }
    case 10: { // sitting in the sun, calm, nothing above: wide, empty sky
      const p = sitting(f, t, { expr: 'happy', arms: 'cross', lean: -0.1 }); FA.root.visible = false;
      K.move({ p: add(ROCK, [-3.0, 1.0, 5.0]), l: add(ROCK, [0, 2.4, 0]), fov: 46 }, { p: add(ROCK, [-2.2, 1.0, 4.2]), l: add(ROCK, [0, 2.6, 0]), fov: 46 }, u(10), 0.3, f); K.focusOn(add(head, [0, -0.4, 0])); break; }
    case 11: { // overhead flew an eagle with a tortoise in its talons: sky shot
      K.preset('day', { exposure: 1.05, photo: DAYSKY }); const v = u(11); const ep = add(SKY, [-4 + v * 6, 0, -6]);
      flyEagle(ep, t, Math.PI / 2, 1); tort.position.set(...add(ep, [0, -0.85, 0])); tort.rotation.set(0, 0, 0);
      K.move({ p: add(ep, [-1.6, -1.2, 6]), l: ep, fov: 46 }, { p: add(ep, [1.0, -1.0, 5]), l: ep, fov: 44 }, v, 0.4, f); K.focusOn(ep); break; }
    case 12: { // eagles break shells by dropping them on rocks: demo on a rock, ROCA
      const v = u(12); const r = add(FIELD, [5, 0, -5]); const y = 4 - 4 * Math.min(1, v * 1.6);
      tort2.position.set(...add(r, [0, 0.95 + Math.max(0, y), 0])); tort2.rotation.set(y > 0 ? t * 2 : 0, 0, y > 0 ? 0.4 : 0); flyEagle(add(r, [0.6, 5.2 + v * 1.0, -1.5]), t, -0.4, 1);
      if (v > 0.62 && v < 0.68) K.grade.flash.value = 0.3;
      K.move({ p: add(r, [3.0, 1.4, 7.5]), l: add(r, [0, 2.8, 0]), fov: 50 }, { p: add(r, [2.4, 1.2, 6.5]), l: add(r, [0, 2.2, 0]), fov: 48 }, v, 0.4, f); K.focusOn(add(r, [0, 1.5, 0])); break; }
    case 13: { // AND HERE IT ALL WENT WRONG: dark, eagle looking down
      K.preset('golden', { exposure: 0.85, photo: GOLDSKY }); K.grade.vig.value = 0.75; const v = u(13); if (v < 0.08) K.grade.flash.value = 0.4; const ep = add(head, [0, 9, 0]);
      flyEagle(ep, t, 0, 0.6); eagle.rotation.x = 0.5; tort.position.set(...add(ep, [0, -0.85, 0.2]));
      K.move({ p: add(ep, [1.6, -1.2, 6.0]), l: add(ep, [0, -0.2, 0]), fov: 44 }, { p: add(ep, [1.0, -1.0, 4.6]), l: add(ep, [0, -0.2, 0]), fov: 42 }, K.ease(v), 0.3, f); K.focusOn(ep); break; }
    case 14: { // from the sky his shiny head looked like a rock: POV from above, glint
      sitting(f, t, { expr: 'happy', look: [0, -0.3] }); const v = u(14); star.position.set(...add(head, [0, 0.32, 0])); star.scale.setScalar(1 + Math.sin(t * 10) * 0.5);
      flyEagle(add(head, [1.5, 7.2, 3.6]), t, 0.3, 0.6); tort.position.set(...add(head, [1.5, 6.4, 3.6]));
      K.move({ p: add(head, [0.2, 9.5, 4.2]), l: head, fov: 40 }, { p: add(head, [0.1, 7.5, 3.4]), l: head, fov: 38 }, v, 0.3, f); K.focusOn(head); break; }
    case 15: { // the eagle let go of the tortoise: falling — cut to white before impact
      const v = u(15); sitting(f, t, { expr: v > 0.5 ? 'shock' : 'happy', look: [0, v > 0.5 ? 0.6 : 0] }); const y = 6.5 * (1 - Math.min(1, v * 1.15));
      tort.position.set(...add(head, [0.05, 0.45 + y, 0])); tort.rotation.set(t * 4, t * 3, 0.5);
      if (v > 0.8) { K.grade.flash.value = Math.min(1, (v - 0.8) * 6); }
      K.move({ p: add(ROCK, [1.2, 0.7, 3.6]), l: add(head, [0, 1.5, 0]), fov: 50 }, { p: add(ROCK, [0.9, 0.7, 3.0]), l: add(head, [0, 0.8, 0]), fov: 48 }, v, 0.6, f); K.focusOn(add(head, [0, 0.6, 0])); break; }
    case 16: { // so, says the legend, died the father of tragedy: empty rock, his laurel + scroll, tortoise strolls away; 456 a. C.
      K.grade.sat.value = 0.9; const v = u(16); SG.y456.visible = SG.ley.visible = true;
      laurel.position.set(...add(ROCK, [-0.2, 0.78, 0.2])); laurel.rotation.set(0.1, 0, 0.15); scrolls[0].position.set(...add(ROCK, [0.4, 0.8, 0.2]));
      tort.position.set(...add(ROCK, [1.2 + v * 1.2, 0.12, 0.2 + v * 0.4])); tort.rotation.set(0, 1.2, 0);
      K.move({ p: add(ROCK, [2.6, 1.3, 4.2]), l: add(ROCK, [0.4, 0.7, 0.3]), fov: 46 }, { p: add(ROCK, [1.8, 1.1, 3.4]), l: add(ROCK, [0.6, 0.6, 0.4]), fov: 44 }, v, 0.3, f); K.focusOn(add(ROCK, [0.5, 0.6, 0.4])); break; }
    case 17: { // he fled from the sky... and the sky found him: low angle, eagle circling the sunset
      K.preset('golden', { exposure: 1.1, photo: GOLDSKY }); const v = u(17); const c = add(ROCK, [0, 6, -1]); flyEagle(add(c, [Math.cos(t * 0.8) * 1.8, 0, Math.sin(t * 0.8) * 1.2]), t, -t * 0.8 + Math.PI / 2, 0.8);
      K.move({ p: add(ROCK, [0.8, 1.2, 5.5]), l: add(c, [0, -0.5, 0]), fov: 48 }, { p: add(ROCK, [0.4, 1.0, 4.6]), l: c, fov: 46 }, v, 0.3, f); K.focusOn(c); break; }
    default: { const v = u(18); hook(v, true); K.move({ p: add(ROCK, [0.9, 0.9, 4.4]), l: add(head, [0, 1.3, 0]), fov: 48 }, { p: add(ROCK, [1.2, 0.9, 5.0]), l: add(head, [0, 1.4, 0]), fov: 50 }, v, 0.7, f); K.focusOn(add(head, [0, 0.8, 0])); }
  }
}
