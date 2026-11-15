// VID-020 — La epidemia de baile (Estrasburgo, 1518): Frau Troffea danced for days; hundreds joined; doctors prescribed MORE dancing (stage + musicians); chronicles say some died of exhaustion. No gore.
export let FRAMES = 2100;
let K, T, TR, N1, N2, N3, N4, D1, D2, OF, M1, M2, SG = {}, fans = [], drum, pipe, shoes = [], door, sweatDrops = [];
const DAYSKY = 'kloofendal_48d_partly_cloudy_puresky_2k', DUSKSKY = 'belfast_sunset_puresky_2k';
const STREET = [0, 0, 0], PLAZA = [200, 0, 0], GUILD = [400, 0, 0];
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
const DANCE = ['up', 'wave', 'flail', 'up'];
function dancer(C, pos, f, t, i, o = {}) { const s = Math.sin(t * 6 + i * 1.3); P(C, { pos: add(pos, [Math.sin(t * 2 + i) * 0.15, 0, 0]), yaw: (o.yaw || 0) + Math.sin(t * 3 + i) * 0.7, arms: o.arms || DANCE[i % 4], bounce: o.bounce ?? 1, expr: o.expr || 'neutral', lean: s * 0.15, tremble: o.tremble || 0, sweat: o.sweat }, f); }
function fan(pos, col, hat) { const g = new K.THREE.Group(); K.cyl(0.24, 0.28, 0.7, col, [0, 0.55, 0], { parent: g }); K.sph(0.3, 0xfffdf8, [0, 1.2, 0], { parent: g }); for (const s of [-1, 1]) { const a = K.cyl(0.03, 0.03, 0.6, 0x16121a, [s * 0.28, 1.05, 0], { parent: g }); a.rotation.z = s * 2.6; } if (hat) K.cyl(0.2, 0.32, 0.12, hat, [0, 1.48, 0], { parent: g }); g.position.set(...pos); K.scene.add(g); fans.push({ g, base: pos.slice(), ph: Math.random() * 6 }); return g; }
function house(pos, rot, col, roof) { // half-timbered Alsatian house
  const g = new K.THREE.Group(); const tx = K.tex(256, 256, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); c.strokeStyle = '#4a2a14'; c.lineWidth = 14; c.strokeRect(0, 0, w, h); c.beginPath(); c.moveTo(0, h / 2); c.lineTo(w, h / 2); c.moveTo(w / 2, 0); c.lineTo(w / 2, h); c.moveTo(0, 0); c.lineTo(w / 2, h / 2); c.moveTo(w, 0); c.lineTo(w / 2, h / 2); c.stroke(); c.fillStyle = '#2a3a5a'; c.fillRect(30, 30, 50, 60); c.fillRect(w - 80, 30, 50, 60); c.fillStyle = '#d84a3a'; c.fillRect(26, 92, 58, 10); c.fillRect(w - 84, 92, 58, 10); }, [1, 2]);
  K.box(4, 7, 4, 0xffffff, [0, 3.5, 0], { parent: g, map: tx }); const rm = K.pbr('clay_roof_tiles_02', [2, 2], { tint: roof === 0xa8402a ? 0xffffff : 0xb8a8a0 }); const r = K.box(4.6, 0.3, 3.4, roof, [0, 8.1, 0.9], { parent: g }); r.rotation.x = -0.75; r.material = rm; const r2 = K.box(4.6, 0.3, 3.4, roof, [0, 8.1, -0.9], { parent: g }); r2.rotation.x = 0.75; r2.material = rm; K.box(3.6, 0.5, 0.2, 0, [0, 0.25, 2.02], { parent: g }).material = K.pbr('rustic_stone_wall_02', [2, 0.3]); for (const s of [-1, 1]) { const fb = K.box(0.9, 0.35, 0.35, 0x6a3a1a, [s * 1.0, 2.55, 2.1], { parent: g }); for (let q = 0; q < 3; q++) K.sph(0.13, [0xd8302a, 0xe8c030, 0xf2f2f2][q], [s * 1.0 - 0.3 + q * 0.3, 2.8, 2.15], { parent: g }); void fb; }
  g.position.set(...pos); g.rotation.y = rot; K.scene.add(g); return g;
}
export async function build(k) {
  K = k; await K.preloadEnvs(); await K.preloadSkies([DAYSKY, DUSKSKY]); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  TR = C(K.scene, { shirt: 0xc8302a, belt: 0xf2ead8, buttons: 0xf2ead8, hair: 0x8a3a1a, seed: 1 });
  N1 = C(K.scene, { shirt: 0x3a6aa8, belt: 0x4a2a14, hair: 0x8a5a2a, seed: 2 }); N2 = C(K.scene, { shirt: 0x3a8a3a, belt: 0xe8dcc0, hair: 0x2a1a10, seed: 3 });
  N3 = C(K.scene, { shirt: 0xe0a030, belt: 0x4a2a14, hair: 0x2a1a10, mustache: true, seed: 4 }); N4 = C(K.scene, { shirt: 0x8a3a8a, belt: 0xf2ead8, hair: 0x5a3418, seed: 5 });
  D1 = C(K.scene, { shirt: 0x1a1a22, cape: 0x6a1a1a, hat: 'bowler', hatColor: 0x1a1a1a, glasses: true, seed: 6 }); D2 = C(K.scene, { shirt: 0x1a1a22, cape: 0x6a1a1a, hat: 'bowler', hatColor: 0x1a1a1a, mustache: true, seed: 7 });
  OF = C(K.scene, { shirt: 0x6a1a1a, buttons: 0xe0b040, belt: 0xe0b040, hat: 'tricorn', hatColor: 0x1a1a1a, mustache: true, seed: 8 });
  M1 = C(K.scene, { shirt: 0xe8c030, belt: 0x2a6aa8, hat: 'cap', hatColor: 0xc8302a, seed: 9 }); M2 = C(K.scene, { shirt: 0x2a6aa8, belt: 0xe8c030, hair: 0x2a1a10, seed: 10 });
  drum = new K.THREE.Group(); K.cyl(0.32, 0.32, 0.4, 0xc8302a, [0, 0, 0], { parent: drum }); K.cyl(0.33, 0.33, 0.04, 0xf2ead8, [0, 0.21, 0], { parent: drum }); drum.rotation.x = Math.PI / 2; K.scene.add(drum);
  pipe = K.cyl(0.03, 0.05, 0.6, 0xe0b040, [0, -99, 0]);
  for (let i = 0; i < 4; i++) shoes.push(K.box(0.28, 0.12, 0.14, 0x5a2a14, [0, -99, 0]));

  // ---------------- STREET: Strasbourg 1518, summer noon, cobbles, timber houses ----------------
  const cob = K.tex(256, 256, (g, w, h) => { g.fillStyle = '#8a7a6a'; g.fillRect(0, 0, w, h); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { g.fillStyle = ['#a8987e', '#9a8a72', '#b4a488'][(x * 7 + y * 3) % 3]; g.beginPath(); g.ellipse(x * 16 + (y % 2) * 8 + 8, y * 16 + 8, 7, 6, 0, 0, 7); g.fill(); } }, [10, 10]);
  K.plane(60, 60, K.pbr('cobblestone_floor_04', [14, 14]), add(STREET, [0, 0.01, 0]));
  const hc = ['#f2d8a0', '#e8a8a0', '#a8c8e0', '#f2e6c8', '#c8e0a8', '#e8c890'];
  for (let i = 0; i < 6; i++) { house(add(STREET, [-6.5, 0, -10 + i * 4.2]), Math.PI / 2, hc[i], 0xa8402a); house(add(STREET, [6.5, 0, -10 + i * 4.2]), -Math.PI / 2, hc[(i + 3) % 6], 0x8a3a2a); }
  for (let i = 0; i < 3; i++) house(add(STREET, [-4.2 + i * 4.2, 0, -13]), 0, hc[(i + 1) % 6], 0xa8402a);
  K.cyl(0.7, 1.2, 16, 0xc8786a, add(STREET, [0, 8, -26])); K.cyl(0.05, 1.0, 6, 0xb8685a, add(STREET, [0, 19, -26])); // cathedral spire far
  door = K.box(1.2, 2.2, 0.15, 0x6a3a1a, add(STREET, [-4.45, 1.1, 0.2])); door.rotation.y = Math.PI / 2;
  for (let i = 0; i < 4; i++) await K.placeH(['medieval_village_pack/Barrel', 'medieval_village_pack/Crate', 'medieval_village_pack/Hay', 'medieval_village_pack/Cart'][i], add(STREET, [i % 2 ? 4.0 : -4.0, 0, -6 + i * 3]), i, [1.0, 0.8, 0.9, 1.6][i]).catch(() => {});
  
  SG.str = K.sign('ESTRASBURGO 1518', add(STREET, [0, 4.6, -10.9]), { w: 5.4, h: 1.05, bg: '#1e5a8a', border: '#f2ead8' });
  SG.par = K.sign('NO PODÍA PARAR', add(STREET, [0, 3.9, -6]), { w: 4.4, h: 1.0, bg: '#b8301e' });
  SG.sm = K.sign('SIN MÚSICA', add(STREET, [-1.6, 3.4, -4.4]), { w: 2.8, h: 0.9, bg: '#2a1a10' });
  SG.d6 = K.sign('6 DÍAS', add(STREET, [1.8, 3.4, -4.4]), { w: 2.2, h: 0.9, bg: '#2a6a3a' });
  const cols = [0xc8302a, 0x3a6aa8, 0xe0a030, 0x3a8a3a, 0x8a3a8a, 0xf2ead8, 0xe8782a];
  for (let i = 0; i < 10; i++) fan(add(STREET, [-3 + (i % 5) * 1.5, 0, -8.5 - Math.floor(i / 5) * 1.4]), cols[i % 7], i % 3 ? 0x4a2a14 : 0);

  // ---------------- PLAZA: wooden stage + musicians + crowd ----------------
  K.plane(80, 80, K.pbr('cobblestone_floor_04', [18, 18]), add(PLAZA, [0, 0.01, 0]));
  for (let i = 0; i < 5; i++) { house(add(PLAZA, [-10 + i * 5, 0, -16]), 0, hc[i], 0xa8402a); }
  for (let i = 0; i < 3; i++) { house(add(PLAZA, [-13, 0, -8 + i * 5]), Math.PI / 2, hc[i + 2], 0x8a3a2a); house(add(PLAZA, [13, 0, -8 + i * 5]), -Math.PI / 2, hc[i], 0xa8402a); }
  const _wd0 = K.tex(256, 256, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#a8784a' : '#b8885a'; g.fillRect(i * 32, 0, 31, 256); } }, [3, 2]);
  K.box(7, 1.0, 4, 0xffffff, add(PLAZA, [0, 0.5, -9])).material = K.pbr('brown_planks_03', [3, 2]); void _wd0; for (const s of [-1, 1]) K.box(0.2, 3.5, 0.2, 0x6a3a1a, add(PLAZA, [s * 3.3, 2.7, -10.8]));
  K.box(7.2, 0.9, 0.15, 0xc8302a, add(PLAZA, [0, 4.2, -10.8])); for (let i = 0; i < 8; i++) { const b = K.box(0.6, 0.6, 0.05, i % 2 ? 0xe0b040 : 0x2a6aa8, add(PLAZA, [-3 + i * 0.85, 3.65, -10.75])); b.rotation.z = Math.PI / 4; }
  SG.c400 = K.sign('400 PERSONAS', add(PLAZA, [-5.5, 4.4, -13.5]), { w: 4.0, h: 1.0, bg: '#b8301e' });
  for (const [x, z] of [[-6, -3], [6, -3], [-6, 3], [6, 3], [-4.5, -9]]) { K.cyl(0.08, 0.1, 2.6, 0x3a2a1a, add(PLAZA, [x, 1.3, z])); K.sph(0.18, 0xffb040, add(PLAZA, [x, 2.75, z]), { emissive: 0xff9020, emissiveIntensity: 5 }); K.pointLight(0xffa050, 4, add(PLAZA, [x, 3.0, z]), 9); }
  SG.mus = K.sign('MÚSICOS', add(PLAZA, [0, 5.2, -10.8]), { w: 3.0, h: 0.9, bg: '#2a6a3a' });
  for (let r = 0; r < 5; r++) for (let i = 0; i < 11; i++) fan(add(PLAZA, [-8 + i * 1.6 + (r % 2) * 0.7, 0, -5 + r * 1.7]), cols[(i + r * 2) % 7], (i + r) % 3 ? 0 : 0x4a2a14);
  for (let i = 0; i < 6; i++) await K.placeH('nature_pack/CommonTree_' + ((i % 5) + 1), add(PLAZA, [(i % 2 ? 1 : -1) * (16 + i), 0, -14 + i * 2]), i, 7).catch(() => {});

  // ---------------- GUILD: doctors' hall, dark wood, parchment ----------------
  const gf = K.tex(256, 256, (g) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? '#4a2a1a' : '#c8a878'; g.fillRect(x * 32, y * 32, 32, 32); } }, [6, 6]);
  K.plane(20, 16, K.pbr('stone_tiles_02', [5, 4]), add(GUILD, [0, 0.01, 0]));
  const gw = K.pbr('rustic_stone_wall_02', [4, 2], { tint: 0xd8b8a0 }); for (let i = 0; i < 5; i++) K.box(0.35, 0.35, 12, 0, add(GUILD, [-6 + i * 3, 6.5, 1])).material = K.pbr('dark_wood', [0.3, 3]); K.ray(add(GUILD, [3.5, 2.2, -3.0]), [0.5, 0, -0.4], 1.6, 5, 0xffe0a8, 0.14); K.plane(20, 8, gw, add(GUILD, [0, 4, -5]), [0, 0, 0]); K.plane(12, 8, gw, add(GUILD, [-7, 4, 1]), [0, Math.PI / 2, 0]);
  K.box(4, 0.15, 1.6, 0x4a2a14, add(GUILD, [0, 1.1, -2.6])); for (const [x, z] of [[-1.8, -0.7], [1.8, -0.7], [-1.8, 0.7], [1.8, 0.7]]) K.box(0.12, 1.1, 0.12, 0x2a1a10, add(GUILD, [x, 0.55, -2.6 + z]));
  for (let i = 0; i < 3; i++) await K.placeH('rpg_items_pack/' + ['Book1_Open', 'Scroll', 'Potion3_Filled'][i], add(GUILD, [-1.2 + i * 1.2, 1.18, -2.6]), i, 0.4).catch(() => {});
  await K.placeH('house_interior_pack/Bookshelf', add(GUILD, [-4.5, 0, -4.6]), 0, 3.8).catch(() => {});
  await K.placeH('house_interior_pack/Window_Large1', add(GUILD, [3.5, 2.4, -4.95]), 0, 2.2).catch(() => {});
  SG.san = K.sign('SANGRE CALIENTE', add(GUILD, [-0.4, 4.0, -4.9]), { w: 4.8, h: 1.0, bg: '#b8301e' });
  SG.mas = K.sign('¡MÁS BAILE!', add(GUILD, [-0.4, 4.0, -4.85]), { w: 4.0, h: 1.0, bg: '#2a6a3a', border: '#ffe9a8' });
  SG.q = K.sign('NADIE SABE', add(GUILD, [-0.4, 4.0, -4.85]), { w: 3.4, h: 1.0, bg: '#e0b040', fg: '#2a1a10', border: '#2a1a10' });
  K.pointLight(0xffc080, 9, add(GUILD, [0, 3.4, -1]), 12);
}

function hideAll() {
  for (const c of [TR, N1, N2, N3, N4, D1, D2, OF, M1, M2]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.hold(null); }
  for (const g of Object.values(SG)) g.visible = false;
  for (const fa of fans) { fa.g.position.set(...fa.base); fa.g.rotation.set(0, 0, 0); fa.g.visible = true; }
  drum.position.set(0, -99, 0); pipe.position.set(0, -99, 0); for (const s of shoes) s.position.set(0, -99, 0); door.rotation.y = Math.PI / 2;
}
function crowdDance(t, amp = 1, slump = 0) { fans.forEach(fa => { const k = Math.sin(t * 7 + fa.ph); fa.g.position.y = fa.base[1] + Math.abs(k) * 0.25 * amp * (1 - slump); fa.g.rotation.y = Math.sin(t * 3 + fa.ph) * 0.8 * amp; fa.g.rotation.z = k * 0.15 * amp + slump * (fa.ph > 3 ? 1.4 : 0); fa.g.position.y -= slump * (fa.ph > 3 ? 0.35 : 0); }); }

export function frame(f, k) {
  hideAll(); const ph = K.at(f), t = f / 30, u = (i) => K.u(f, i);
  K.preset('day', { exposure: 1.05, photo: DAYSKY }); crowdDance(t, 0);
  const A0 = add(STREET, [0, 0, -2]);
  const hook = (v) => { crowdDance(t, 1); SG.par.visible = true; dancer(TR, A0, f, t, 0, { expr: 'worried', arms: 'up' }); dancer(N1, add(A0, [-1.6, 0, -1.6]), f, t, 1, { expr: 'neutral' }); dancer(N3, add(A0, [1.6, 0, -1.6]), f, t, 2, { expr: 'scared' }); };
  switch (ph) {
    case 0: { hook(u(0)); K.move(K.frame([A0, add(A0, [-1.6, 0, -1.6]), add(A0, [1.6, 0, -1.6])], { yaw: 0.15, h: 3.0, lookY: 2.0, pitch: -0.05, push: 0.85 }), K.frame([A0], { yaw: 0.05, h: 2.8, lookY: 2.0, pitch: -0.04, push: 0.72 }), u(0), 0.9, f); K.focusOn(add(A0, [0, 2, 0])); break; }
    case 1: { // and worst: the dance was contagious — neighbors catching it in a ring
      crowdDance(t, 1); const ring = [N1, N2, N3, N4]; ring.forEach((c, i) => { const a = t * 0.8 + i * Math.PI / 2; dancer(c, add(A0, [Math.sin(a) * 1.8, 0, Math.cos(a) * 1.4 - 0.4]), f, t, i, { expr: i % 2 ? 'scared' : 'neutral' }); }); dancer(TR, A0, f, t, 0, { expr: 'worried' });
      K.move({ p: add(A0, [0, 6.5, 4.5]), l: add(A0, [0, 1, -0.4]), fov: 46 }, { p: add(A0, [1.2, 5.6, 3.8]), l: add(A0, [0, 1, -0.4]), fov: 46 }, u(1), 0.5, f); K.focusOn(add(A0, [0, 1.5, 0])); break; }
    case 2: { // Strasbourg, summer 1518: establishing street, sign
      SG.str.visible = true; const v = u(2);
      K.move({ p: add(STREET, [1.2, 1.6, 8]), l: add(STREET, [0, 4.0, -10]), fov: 48 }, { p: add(STREET, [0.4, 2.2, 4.5]), l: add(STREET, [0, 4.4, -10]), fov: 46 }, v, 0.3, f); K.focusOn(add(STREET, [0, 3, -9])); break; }
    case 3: { // Frau Troffea steps out the door and starts dancing
      const v = u(3); const s = add(STREET, [-4.0, 0, 0.2]), e = add(STREET, [-2.0, 0, 0.6]); door.rotation.y = Math.PI / 2 - 1.4 * Math.min(1, v * 3);
      const pos = K.lerp(s, e, K.ease(Math.min(1, v * 2)));
      if (v < 0.45) P(TR, { pos, yaw: 1.2, walk: t * 1.6, expr: 'neutral' }, f); else dancer(TR, e, f, t, 0, { expr: 'neutral', arms: 'wave' });
      K.move(K.frame([pos], { yaw: 0.6, h: 3.0, lookY: 1.9, pitch: -0.04, push: 1.0 }), K.frame([e], { yaw: 0.4, h: 2.8, lookY: 1.9, pitch: -0.05, push: 0.85 }), v, 0.5, f); K.focusOn(add(pos, [0, 2, 0])); break; }
    case 4: { // no music, no smile, just dancing: close-up, blank face
      SG.sm.visible = true; dancer(TR, A0, f, t, 0, { expr: 'neutral', arms: 'up', bounce: 0.8 });
      K.move(K.frame([A0], { yaw: -0.2, h: 2.4, lookY: 1.9, pitch: 0.02, push: 0.8 }), K.frame([A0], { yaw: -0.05, h: 2.3, lookY: 1.9, pitch: 0.02, push: 0.66 }), u(4), 0.7, f); K.focusOn(add(A0, [0, 2.1, 0])); break; }
    case 5: { // day and night almost a week: night half, tired + sweating, 6 DÍAS
      const v = u(5); SG.d6.visible = true; if (v > 0.45) { K.preset('night', { exposure: 1.3 }); if (v < 0.5) K.grade.flash.value = 0.3; }
      dancer(TR, A0, f, t, 0, { expr: v > 0.45 ? 'tired' : 'neutral', sweat: v > 0.45, arms: v > 0.45 ? 'flail' : 'up', bounce: v > 0.45 ? 0.6 : 1 });
      K.move(K.frame([A0], { yaw: 0.35, h: 3.2, lookY: 2.0, pitch: -0.05, push: 0.95 }), K.frame([A0], { yaw: 0.15, h: 3.0, lookY: 2.0, pitch: -0.05, push: 0.85 }), v, 0.6, f); K.focusOn(add(A0, [0, 2, 0])); break; }
    case 6: { // then the neighbors started dancing too: two join her, shocked
      const v = u(6); const a = add(A0, [-1.5, 0, -0.8]), b = add(A0, [1.5, 0, -0.8]);
      dancer(TR, A0, f, t, 0, { expr: 'tired' }); if (v < 0.35) { P(N2, { pos: a, yaw: 0.6, expr: 'shock', arms: 'point' }, f); P(N3, { pos: b, yaw: -0.6, expr: 'shock', arms: 'shrug' }, f); } else { dancer(N2, a, f, t, 1, { expr: 'scared' }); dancer(N3, b, f, t, 2, { expr: 'scared' }); }
      K.move(K.frame([A0, a, b], { yaw: -0.15, h: 3.0, lookY: 2.0, pitch: -0.05, push: 0.92 }), K.frame([A0, a, b], { yaw: 0.0, h: 3.0, lookY: 2.0, pitch: -0.05, push: 0.84 }), v, 0.6, f); K.focusOn(add(A0, [0, 2, -0.4])); break; }
    case 7: { // but that wasn't the strangest: dark punch on her blank face
      K.preset('day', { exposure: 0.85, photo: DAYSKY }); K.grade.vig.value = 0.7; const v = u(7); if (v < 0.08) K.grade.flash.value = 0.35;
      dancer(TR, A0, f, t, 0, { expr: 'out', arms: 'up', bounce: 0.5 });
      K.move(K.frame([A0], { yaw: 0.3, h: 2.2, lookY: 2.0, pitch: 0.0, push: 0.8 }), K.frame([A0], { yaw: 0.25, h: 2.1, lookY: 2.0, pitch: 0.0, push: 0.6 }), K.ease(v), 0.3, f); K.focusOn(add(A0, [0, 2.2, 0])); break; }
    case 8: { // in a month, hundreds dancing: plaza crane shot full of dancers, 400
      crowdDance(t, 1); SG.c400.visible = true; const p = add(PLAZA, [0, 0, -1]);
      [N1, N2, N3, N4].forEach((c, i) => dancer(c, add(p, [-2.4 + i * 1.6, 0, 1.8 + (i % 2) * 0.6]), f, t, i, { expr: i % 2 ? 'tired' : 'scared' }));
      K.move({ p: add(PLAZA, [3, 4.2, 8.5]), l: add(PLAZA, [0, 1.6, -4]), fov: 48 }, { p: add(PLAZA, [-1.5, 6.5, 7.5]), l: add(PLAZA, [0, 1.4, -4]), fov: 48 }, u(8), 0.5, f); K.focusOn(add(PLAZA, [0, 1.6, 0])); break; }
    case 9: { // the authorities called the doctors
      K.preset('interior', { exposure: 1.15 }); const a = add(GUILD, [1.6, 0, -1.2]), b = add(GUILD, [-1.4, 0, -1.4]), c = add(GUILD, [0.1, 0, -1.0]);
      P(OF, { pos: a, yaw: -0.6, expr: 'worried', arms: 'point', talk: 0.6 }, f); P(D1, { pos: b, yaw: 0.4, expr: 'neutral', arms: 'think' }, f); P(D2, { pos: c, yaw: 0.1, expr: 'neutral', arms: 'cross' }, f);
      K.move(K.frame([a, b, c], { yaw: 0.15, h: 3.0, lookY: 2.0, pitch: -0.05, push: 0.92 }), K.frame([a, b, c], { yaw: 0.02, h: 3.0, lookY: 2.0, pitch: -0.06, push: 0.84 }), u(9), 0.5, f); K.focusOn(add(GUILD, [0, 2, -1.2])); break; }
    case 10: { // diagnosis: hot blood. And the cure... more dancing
      K.preset('interior', { exposure: 1.15 }); const v = u(10); const b = add(GUILD, [-1.2, 0, -1.6]), a = add(GUILD, [1.4, 0, -0.8]);
      if (v < 0.5) { SG.san.visible = true; P(D1, { pos: b, yaw: 0.3, expr: 'smug', arms: 'point', talk: 0.6 }, f); P(OF, { pos: a, yaw: -0.6, expr: 'shock', arms: 'hold2' }, f); }
      else { SG.mas.visible = true; P(D1, { pos: b, yaw: 0.3, expr: 'happy', arms: 'up', bounce: 0.6 }, f); P(D2, { pos: add(GUILD, [0.2, 0, -1.9]), yaw: 0, expr: 'happy', arms: 'wave', bounce: 0.6 }, f); P(OF, { pos: a, yaw: -0.6, expr: 'shock', arms: 'shrug' }, f); }
      K.move(K.frame([a, b], { yaw: 0.1, h: 3.4, lookY: 2.3, pitch: -0.05, push: 0.9 }), K.frame([a, b], { yaw: -0.05, h: 3.4, lookY: 2.3, pitch: -0.06, push: 0.84 }), v, 0.5, f); K.focusOn(add(GUILD, [0, 2.2, -1.4])); break; }
    case 11: { // they built a stage and hired musicians
      const st = add(PLAZA, [0, 1.0, -9]); SG.mus.visible = true; crowdDance(t, 0.4);
      P(M1, { pos: add(st, [-1.0, 0, 0.4]), yaw: 0.2, expr: 'happy', arms: 'hammer' }, f); drum.position.set(...add(st, [-0.6, 0.9, 0.9]));
      P(M2, { pos: add(st, [1.0, 0, 0.4]), yaw: -0.2, expr: 'happy', arms: 'drink', bounce: 0.4 }, f); M2.hold(pipe, [0, 0.0, 0.2], [Math.PI / 2.4, 0, 0]);
      K.move(K.frame([add(st, [-1, 0, 0.4]), add(st, [1, 0, 0.4])], { yaw: 0.2, h: 3.0, lookY: 2.0, pitch: -0.1, push: 0.95 }), K.frame([add(st, [-1, 0, 0.4]), add(st, [1, 0, 0.4])], { yaw: 0.05, h: 3.0, lookY: 2.0, pitch: -0.12, push: 0.86 }), u(11), 0.5, f); K.focusOn(add(st, [0, 2, 0.4])); break; }
    case 12: { // AND HERE IT ALL WENT WRONG: dusk, dark punch on the stage
      K.preset('dusk', { exposure: 1.3, photo: DUSKSKY, sunI: 3.4, hemiI: 1.1 }); K.grade.vig.value = 0.7; const v = u(12); if (v < 0.08) K.grade.flash.value = 0.4; crowdDance(t, 1);
      const st = add(PLAZA, [0, 1.0, -9]); P(M1, { pos: add(st, [-1.0, 0, 0.4]), yaw: 0.2, expr: 'worried', arms: 'hammer' }, f); drum.position.set(...add(st, [-0.6, 0.9, 0.9]));
      K.move({ p: add(PLAZA, [0, 1.6, 2]), l: add(st, [-0.8, 1.8, 0]), fov: 44 }, { p: add(PLAZA, [-0.4, 1.8, -2]), l: add(st, [-0.8, 1.9, 0]), fov: 42 }, K.ease(v), 0.4, f); K.focusOn(add(st, [-0.8, 1.8, 0.4])); break; }
    case 13: { // the music only attracted more dancers: crowd surges, musicians playing on
      K.preset('dusk', { exposure: 1.35, photo: DUSKSKY, sunI: 3.4, hemiI: 1.1 }); crowdDance(t, 1.2); SG.mus.visible = true; const st = add(PLAZA, [0, 1.0, -9]);
      P(M1, { pos: add(st, [-1.0, 0, 0.4]), yaw: 0.2, expr: 'happy', arms: 'hammer' }, f); drum.position.set(...add(st, [-0.6, 0.9, 0.9])); P(M2, { pos: add(st, [1.0, 0, 0.4]), yaw: -0.2, expr: 'happy', arms: 'drink', bounce: 0.4 }, f); M2.hold(pipe, [0, 0.0, 0.2], [Math.PI / 2.4, 0, 0]);
      [N1, N2, N3, N4, TR].forEach((c, i) => dancer(c, add(PLAZA, [-3 + i * 1.5, 0, -5.5 + (i % 2) * 0.8]), f, t, i, { expr: 'tired', yaw: Math.PI }));
      K.move({ p: add(PLAZA, [1.5, 2.2, 1.5]), l: add(PLAZA, [0, 1.8, -8]), fov: 48 }, { p: add(PLAZA, [-1.0, 2.6, 0.5]), l: add(PLAZA, [0, 1.9, -8]), fov: 48 }, u(13), 0.6, f); K.focusOn(add(PLAZA, [0, 1.8, -5.5])); break; }
    case 14: { // exhausted, many fell... some never got up: dusk, crowd slumped, shoes on cobbles
      K.preset('dusk', { exposure: 1.3, photo: DUSKSKY, sunI: 3.4, hemiI: 1.1 }); K.grade.sat.value = 0.85; const v = u(14); crowdDance(t, 0.3 * (1 - v), Math.min(1, v * 1.5));
      const p = add(PLAZA, [0, 0, 1.5]); for (const fa of fans) if (Math.hypot(fa.base[0] - p[0], fa.base[2] - p[2]) < 3.2) fa.g.visible = false; P(N3, { pos: add(p, [-0.6, -0.5, 0]), yaw: Math.PI / 2, fall: 1, expr: 'out' }, f); P(N2, { pos: add(p, [1.6, 0, -0.6]), yaw: -0.4, sit: 1, expr: 'tired', sweat: true, arms: 'down', lean: 0.4 }, f);
      shoes.forEach((s, i) => s.position.set(...add(p, [-1.8 + i * 0.9, 0.06, 1.0 + (i % 2) * 0.5])));
      K.move({ p: add(p, [1.8, 1.6, 4.6]), l: add(p, [0.4, 0.9, -0.6]), fov: 46 }, { p: add(p, [1.2, 1.4, 3.8]), l: add(p, [0.4, 0.8, -0.6]), fov: 44 }, v, 0.3, f); K.focusOn(add(p, [0, 0.6, 0])); break; }
    case 15: { // nobody knows for sure what caused it
      K.preset('interior', { exposure: 1.1 }); SG.q.visible = true; const a = add(GUILD, [-1.2, 0, -1.4]), b = add(GUILD, [1.2, 0, -1.4]);
      P(D1, { pos: a, yaw: 0.3, expr: 'worried', arms: 'shrug' }, f); P(D2, { pos: b, yaw: -0.3, expr: 'worried', arms: 'think' }, f);
      K.move(K.frame([a, b], { yaw: -0.12, h: 3.2, lookY: 2.2, pitch: -0.05, push: 0.92 }), K.frame([a, b], { yaw: 0.05, h: 3.2, lookY: 2.2, pitch: -0.06, push: 0.84 }), u(15), 0.5, f); K.focusOn(add(GUILD, [0, 2.2, -1.4])); break; }
    case 16: { // a whole city... dancing toward its end: rising crane over the dusk plaza
      K.preset('dusk', { exposure: 1.35, photo: DUSKSKY, sunI: 3.4, hemiI: 1.1 }); crowdDance(t, 1); const v = u(16);
      K.move({ p: add(PLAZA, [0, 2.0, 7]), l: add(PLAZA, [0, 1.5, -3]), fov: 48 }, { p: add(PLAZA, [0, 11, 12]), l: add(PLAZA, [0, 0.5, -4]), fov: 50 }, K.ease(v), 0.3, f); K.focusOn(add(PLAZA, [0, 1, -2])); break; }
    default: { hook(u(17)); K.move(K.frame([A0], { yaw: 0.05, h: 2.8, lookY: 2.0, pitch: -0.04, push: 0.72 }), K.frame([A0, add(A0, [-1.6, 0, -1.6]), add(A0, [1.6, 0, -1.6])], { yaw: 0.15, h: 3.0, lookY: 2.0, pitch: -0.05, push: 0.85 }), u(17), 0.9, f); K.focusOn(add(A0, [0, 2, 0])); }
  }
}
