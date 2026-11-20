// VID-033 — Alexander, King of the Hellenes (1893–1920). 2 Oct 1920, Tatoi estate: his German shepherd Fritz attacked the pet
// Barbary macaque of the vineyard steward; trying to separate them, a second monkey bit him on the leg and torso. Wounds cleaned,
// not cauterized → sepsis, died 25 Oct 1920 (age 27). Churchill: "a quarter of a million persons died of this monkey's bite".
// No gore: the bite is a cling + flash; the death is implied (empty bed, crown on the pillow).
export let FRAMES = 2200;
const DAYSKY = 'kloofendal_48d_partly_cloudy_puresky_2k';
let K, T, AL, AL2, ST, AS, PR, G1, G2, DR, MN, SG = {}, dog, M1, M2, crown, figs = [], cloth, basin, therm, quill, blanket, ballots = [];
const VINE = [0, 0, 0], PALX = [200, 0, 0], THR = [400, 0, 0], ROOM = [600, 0, 0], STUDY = [800, 0, 0];
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
const FUR = 0x8a5a32, SKIN = 0xe8c8a0;

function makeMonkey(seed) { // original cartoon macaque: round head, tan face, big eyes, curled tail
  const g = new K.THREE.Group(); const body = new K.THREE.Group(); g.add(body);
  const torso = K.sph(0.2, FUR, [0, 0.42, 0], { parent: body, roughness: 0.9 }); torso.scale.set(1, 1.25, 0.9);
  K.sph(0.13, SKIN, [0, 0.4, 0.1], { parent: body, roughness: 0.8 }).scale.set(1, 1.3, 0.5);
  const head = new K.THREE.Group(); head.position.set(0, 0.78, 0.02); body.add(head);
  K.sph(0.2, FUR, [0, 0, 0], { parent: head, roughness: 0.9 });
  const face = K.sph(0.15, SKIN, [0, -0.02, 0.1], { parent: head, roughness: 0.8 }); face.scale.set(1.1, 0.95, 0.6);
  for (const s of [-1, 1]) { K.sph(0.07, SKIN, [s * 0.2, 0.03, 0], { parent: head }).scale.set(0.5, 1, 1);
    K.sph(0.045, 0xffffff, [s * 0.065, 0.03, 0.18], { parent: head }); K.sph(0.022, 0x16121a, [s * 0.065, 0.03, 0.215], { parent: head }); }
  const brow = K.box(0.2, 0.025, 0.03, 0x4a2a14, [0, 0.1, 0.18], { parent: head });
  const mouth = K.box(0.08, 0.02, 0.02, 0x4a1a14, [0, -0.09, 0.19], { parent: head });
  const limb = (x, y, len) => { const a = new K.THREE.Group(); a.position.set(x, y, 0); body.add(a); K.cyl(0.035, 0.035, len, FUR, [0, -len / 2, 0], { parent: a }); K.sph(0.05, SKIN, [0, -len, 0], { parent: a }); return a; };
  const armL = limb(0.17, 0.58, 0.38), armR = limb(-0.17, 0.58, 0.38), legL = limb(0.1, 0.25, 0.25), legR = limb(-0.1, 0.25, 0.25);
  const tail = []; for (let i = 0; i < 8; i++) tail.push(K.sph(0.03, FUR, [0, 0.3, -0.18 - i * 0.06], { parent: body }));
  K.scene.add(g); return { g, body, head, armL, armR, legL, legR, tail, brow, mouth, ph: seed };
}
function poseMonkey(M, pos, yaw, t, o = {}) {
  M.g.position.set(...pos); M.g.rotation.set(o.pitch || 0, yaw, o.roll || 0); M.g.scale.setScalar(o.s || 1);
  const run = o.run || 0, ph = t * 14 + M.ph;
  M.body.position.y = run ? Math.abs(Math.sin(ph)) * 0.15 : Math.abs(Math.sin(t * 3 + M.ph)) * 0.02;
  M.body.rotation.x = run ? 0.5 : (o.lean || 0);
  const sw = run ? Math.sin(ph) * 1.0 : 0;
  M.armL.rotation.set(o.arms === 'up' ? -2.8 : o.arms === 'grab' ? -1.6 : sw - 0.2, 0, 0.2); M.armR.rotation.set(o.arms === 'up' ? -2.8 : o.arms === 'grab' ? -1.6 : -sw - 0.2, 0, -0.2);
  M.legL.rotation.x = o.sit ? -1.4 : -sw * 0.8; M.legR.rotation.x = o.sit ? -1.4 : sw * 0.8;
  M.tail.forEach((s, i) => { const a = i * 0.35; s.position.set(Math.sin(t * 4 + i * 0.6 + M.ph) * 0.03 * i, 0.3 + Math.sin(a) * 0.25 * (o.curl ?? 1), -0.18 - Math.cos(a) * 0.06 * i); });
  M.mouth.scale.set(o.angry ? 1.4 : 1, o.angry ? 3.5 : 1, 1); M.brow.rotation.z = o.angry ? 0.35 : 0; M.head.rotation.set(o.look ? o.look[1] : 0, o.look ? o.look[0] : 0, 0);
}
function hideMonkey(M) { M.g.position.set(0, -99, 0); M.g.rotation.set(0, 0, 0); M.g.scale.setScalar(1); }
function vineRow(z, x0, x1) {
  for (let x = x0; x <= x1; x += 1.4) { K.cyl(0.04, 0.04, 1.5, 0x6a4a2a, add(VINE, [x, 0.75, z]));
    for (let k = 0; k < 3; k++) { const y = 1.0 + (k % 2) * 0.25, xx = x + 0.45 * k; K.sph(0.34 + ((x * 7 + k) % 3) * 0.04, k % 2 ? 0x4a8a2a : 0x3a7a24, add(VINE, [xx, y, z + ((k % 2) - 0.5) * 0.15]), { roughness: 0.85 }); }
    if ((x * 3) % 2 < 1) for (let q = 0; q < 4; q++) K.sph(0.05, 0x5a2a6a, add(VINE, [x + 0.6 + (q % 2) * 0.07, 0.72 - Math.floor(q / 2) * 0.08, z + 0.3]), { roughness: 0.4 }); }
  K.box(x1 - x0, 0.01, 0.01, 0x8a8a8a, add(VINE, [(x0 + x1) / 2, 1.3, z]));
}

export async function build(k) {
  K = k; await K.preloadEnvs(); await K.preloadSkies([DAYSKY]); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  AL = C(K.scene, { shirt: 0x1e4a8a, belt: 0xf2c230, buttons: 0xf2c230, hair: 0x2a1a10, mustache: true, hat: 'crown', hatColor: 0xf2c230, seed: 81 });
  AL2 = C(K.scene, { shirt: 0x1e4a8a, belt: 0xf2c230, buttons: 0xf2c230, hair: 0x2a1a10, mustache: true, seed: 81 });
  ST = C(K.scene, { shirt: 0x8a6a3a, pants: 0x4a3a2a, belt: 0x2a1a10, hat: 'cap', hatColor: 0xd8c080, hair: 0x5a5a5a, mustache: true, seed: 82 });
  AS = C(K.scene, { shirt: 0xf2ead8, belt: 0x8ab0d8, hair: 0x1a1210, seed: 83 }); K.cyl(0.2, 0.44, 0.62, 0xf2ead8, [0, -0.22, 0], { parent: AS.hips, roughness: 0.6 });
  PR = C(K.scene, { shirt: 0x1a1a1a, hat: 'top', hatColor: 0x1a1a1a, hair: 0xd8d8d8, seed: 84 });
  G1 = C(K.scene, { shirt: 0x8a2a4a, belt: 0x1a1210, hair: 0xd8b060, seed: 85 }); K.cyl(0.2, 0.44, 0.62, 0x8a2a4a, [0, -0.22, 0], { parent: G1.hips, roughness: 0.6 });
  G2 = C(K.scene, { shirt: 0x2a5a4a, belt: 0x1a1210, hair: 0x3a2414, mustache: true, glasses: true, seed: 86 });
  DR = C(K.scene, { shirt: 0xf2f2f2, belt: 0x6a6a6a, hair: 0x8a8a8a, glasses: true, seed: 87 });
  MN = C(K.scene, { shirt: 0x2a2a3a, tie: 0x8a1a1a, buttons: 0xd8d8d8, hair: 0xc8a070, seed: 88 });
  M1 = makeMonkey(0.3); M2 = makeMonkey(2.1);
  dog = new K.THREE.Group(); const dm = await K.placeH('animals_pack/Husky', [0, 0, 0], 0, 0.95).catch(() => null); if (dm) { dm.parent && dm.parent.remove(dm); dog.add(dm); } K.scene.add(dog);
  crown = new K.THREE.Group(); K.cyl(0.2, 0.17, 0.16, 0xf2c230, [0, 0, 0], { parent: crown, metalness: 0.8, roughness: 0.3, seg: 20 });
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; K.sph(0.035, i % 2 ? 0xd7262a : 0x2a6ad8, [Math.sin(a) * 0.19, 0.12, Math.cos(a) * 0.19], { parent: crown }); } K.scene.add(crown);
  cloth = K.box(0.16, 0.04, 0.12, 0xffffff, [0, -99, 0]); basin = K.cyl(0.3, 0.22, 0.16, 0xd8d8e8, [0, -99, 0], { metalness: 0.5, roughness: 0.3 });
  therm = new K.THREE.Group(); K.box(0.5, 1.6, 0.06, 0xf2ead8, [0, 0, 0], { parent: therm }); therm.bar = K.box(0.14, 1.0, 0.07, 0xd7262a, [0, -0.3, 0.01], { parent: therm }); K.sph(0.13, 0xd7262a, [0, -0.72, 0.02], { parent: therm }); K.scene.add(therm);
  quill = new K.THREE.Group(); K.box(0.02, 0.4, 0.02, 0xf2f2f2, [0, 0.15, 0], { parent: quill }); K.box(0.07, 0.25, 0.01, 0xf2f2f2, [0, 0.22, 0], { parent: quill }); K.scene.add(quill);
  blanket = K.box(1.3, 0.25, 1.1, 0x2a4a8a, [0, -99, 0], { roughness: 0.9 });

  // ---------------- VINE: Tatoi estate, vineyard rows under pines, white villa ----------------
  K.plane(200, 200, K.pbr('forrest_ground_01', [40, 40]), add(VINE, [0, 0.01, 0]));
  K.plane(60, 2.2, K.pbr('grassy_cobblestone', [20, 1]), add(VINE, [0, 0.02, 0]));
  for (const z of [-1.7, -5.0, -8.3]) vineRow(z, -16, 16);
  for (const z of [6.5, 9.8]) vineRow(z, -16, 16);
  for (let i = 0; i < 10; i++) await K.placeH('nature_pack/CommonTree_' + (1 + i % 5), add(VINE, [-24 + i * 5.5, 0, -13 - (i % 3) * 2]), i, 8 + (i % 3)).catch(() => {});
  SG.tree = await K.placeH('nature_pack/CommonTree_3', add(VINE, [5.0, 0, -3.3]), 0.5, 6.5).catch(() => null);
  K.box(10, 4.5, 4, 0xffffff, add(VINE, [-8, 2.25, -22]), { map: K.pbr('white_plaster_02', [3, 2]).map });
  K.box(10.6, 0.3, 4.6, 0xb8501a, add(VINE, [-8, 4.6, -22]), { map: K.pbr('clay_roof_tiles_02', [3, 1]).map });
  for (let i = 0; i < 4; i++) K.box(1.0, 1.4, 0.1, 0x2a5a9a, add(VINE, [-11.5 + i * 2.3, 2.6, -19.9]));
  SG.tatoi = K.sign('TATOI · 1920', add(VINE, [-2.6, 2.5, -2.9]), { w: 3.4, h: 0.9, bg: '#1e4a8a', border: '#ffffff', posts: true });
  SG.fritz = K.sign('FRITZ', add(VINE, [1.5, 2.4, -2.9]), { w: 2.2, h: 0.9, bg: '#d7262a', border: '#ffffff', posts: true });
  SG.q = K.sign('¿LOS HABRÍAS SEPARADO?', add(VINE, [0.5, 3.0, -2.9]), { w: 5.6, h: 1.0, bg: '#d7262a', border: '#ffe9a8' });

  // ---------------- PALX: Athens, white neoclassical palace, Greek flags ----------------
  K.plane(120, 120, K.pbr('marble_01', [30, 30], { tint: 0xd8d0c0 }), add(PALX, [0, 0.01, 0]));
  K.box(22, 9, 1, 0xffffff, add(PALX, [0, 4.5, -8]), { map: K.pbr('beige_wall_001', [6, 3]).map });
  for (let i = 0; i < 8; i++) K.cyl(0.4, 0.45, 6.5, 0xf2ece0, add(PALX, [-7 + i * 2, 3.25, -6.6]), { roughness: 0.5 });
  K.box(17, 0.8, 1.6, 0xf2ece0, add(PALX, [0, 6.9, -6.6])); 
  for (let s = 0; s < 4; s++) K.box(18, 0.25, 0.8, 0xe8e0d0, add(PALX, [0, 0.125 + s * 0.25, -5.6 + s * -0.0 + (3 - s) * 0.8]));
  const flag = K.tex(512, 340, (g, w, h) => { for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? '#ffffff' : '#1d5fb8'; g.fillRect(0, i * h / 9, w, h / 9 + 1); } g.fillStyle = '#1d5fb8'; g.fillRect(0, 0, w * 0.37, h * 5 / 9); g.fillStyle = '#fff'; g.fillRect(w * 0.15, 0, w * 0.07, h * 5 / 9); g.fillRect(0, h * 2 / 9, w * 0.37, h / 9); });
  SG.flags = []; for (const x of [-9, 9]) { K.cyl(0.06, 0.06, 8, 0xd8d0c0, add(PALX, [x, 4, -4]), { metalness: 0.6 }); const fl = K.plane(2.4, 1.6, K.std(0xffffff, { map: flag, side: K.THREE.DoubleSide }), add(PALX, [x + 1.2, 7.1, -4]), [0, 0, 0]); SG.flags.push(fl); }
  SG.atenas = K.sign('ATENAS · 1920', add(PALX, [0, 8.3, -5.6]), { w: 4.0, h: 1.0, bg: '#1e4a8a', border: '#ffffff' });

  // ---------------- THR: throne room + war map table ----------------
  K.plane(40, 40, K.pbr('marble_01', [10, 10]), add(THR, [0, 0.01, 0]));
  K.box(16, 7, 0.4, 0xffffff, add(THR, [0, 3.5, -5]), { map: K.pbr('painted_plaster_wall', [4, 2]).map, color: 0x9ab8e8 });
  for (const x of [-6, 6]) K.box(0.4, 7, 12, 0xd8e4f4, add(THR, [x, 3.5, 0]));
  K.box(2.2, 0.5, 1.6, 0x8a1a2a, add(THR, [0, 0.25, -3.6])); K.box(1.4, 2.6, 0.3, 0xf2c230, add(THR, [0, 1.8, -4.3]), { metalness: 0.7, roughness: 0.3 }); K.box(1.2, 0.6, 1.0, 0x8a1a2a, add(THR, [0, 0.8, -3.7]));
  for (let i = 0; i < 2; i++) await K.placeH('house_interior_pack/Light_Chandelier', add(THR, [-2.5 + i * 5, 5.0, -2.5]), 0, 1.2).catch(() => {});
  K.pointLight(0xffe0b0, 5, add(THR, [0, 4, 1]), 12); K.ray(add(THR, [-3, 3.5, -2]), [0, 0, 0.3], 1.4, 7, 0xfff0d0, 0.12);
  const mapT = K.tex(1024, 700, (g, w, h) => { g.fillStyle = '#7ab0d8'; g.fillRect(0, 0, w, h); g.fillStyle = '#d8c48a'; g.beginPath(); g.moveTo(120, 80); g.lineTo(420, 60); g.lineTo(470, 300); g.lineTo(380, 520); g.lineTo(260, 640); g.lineTo(180, 420); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(560, 120); g.lineTo(1000, 100); g.lineTo(1000, 600); g.lineTo(620, 560); g.lineTo(560, 300); g.closePath(); g.fill(); g.fillStyle = '#1a1210'; g.font = '900 64px Poppins, sans-serif'; g.fillText('GRECIA', 160, 340); g.fillText('ANATOLIA', 660, 360); });
  K.box(4.0, 0.9, 2.6, 0x5a3a1a, add(THR, [3.2, 0.45, 1.2]), { map: K.pbr('dark_wood', [2, 1]).map }); K.plane(3.8, 2.4, K.std(0xffffff, { map: mapT }), add(THR, [3.2, 0.92, 1.2]));
  for (let i = 0; i < 10; i++) { const fg = new K.THREE.Group(); K.cyl(0.07, 0.09, 0.22, i < 5 ? 0x1d5fb8 : 0xd7262a, [0, 0.11, 0], { parent: fg }); K.sph(0.06, i < 5 ? 0x1d5fb8 : 0xd7262a, [0, 0.27, 0], { parent: fg }); const bp = add(THR, [2.0 + (i % 5) * 0.55 + (i < 5 ? -0.3 : 0.6), 0.92, 0.6 + (i % 2) * 0.6]); fg.position.set(...bp); fg.base = bp; K.scene.add(fg); figs.push(fg); }
  SG.guerra = K.sign('GUERRA', add(THR, [3.2, 3.6, -4.7]), { w: 2.6, h: 0.9, bg: '#d7262a', border: '#ffffff' });
  SG.caos = K.sign('¡CAOS!', add(THR, [3.2, 3.6, -4.65]), { w: 2.6, h: 0.9, bg: '#1a1210', border: '#d7262a' });

  // ---------------- ROOM: royal bedroom + small chapel corner (candles, icon) ----------------
  K.plane(40, 40, K.pbr('wood_floor', [8, 8]), add(ROOM, [0, 0.01, 0]));
  K.box(14, 6, 0.3, 0xffffff, add(ROOM, [0, 3, -4]), { map: K.pbr('white_plaster_02', [4, 2]).map, color: 0xe8dcc8 });
  K.box(0.3, 6, 10, 0xe8dcc8, add(ROOM, [-6, 3, 0]));
  await K.placeH('house_interior_pack/Bed_King', add(ROOM, [2.2, 0, -2.4]), 0, 1.1, { tint: 0xf2ead8 }).catch(() => {});
  await K.placeH('house_interior_pack/NightStand_1', add(ROOM, [0.4, 0, -3.3]), 0, 0.6).catch(() => {});
  await K.placeH('house_interior_pack/Curtains_Double', add(ROOM, [4.8, 0, -3.8]), 0, 3.6).catch(() => {});
  K.box(1.2, 1.0, 0.6, 0x8a6a3a, add(ROOM, [-3.8, 0.5, -3.4])); K.box(0.7, 0.9, 0.05, 0xf2c230, add(ROOM, [-3.8, 1.8, -3.84]), { metalness: 0.6 });
  K.plane(0.55, 0.75, K.std(0x8a3a2a), add(ROOM, [-3.8, 1.8, -3.81]), [0, 0, 0]);
  for (let i = 0; i < 5; i++) { K.cyl(0.04, 0.04, 0.3, 0xf2ead8, add(ROOM, [-4.3 + i * 0.25, 1.15, -3.3])); K.sph(0.035, 0xffd27a, add(ROOM, [-4.3 + i * 0.25, 1.34, -3.3]), { emissive: 0xffb040, emissiveIntensity: 2 }); }
  K.pointLight(0xffc890, 4, add(ROOM, [-3.8, 2.0, -2.5]), 8); K.pointLight(0xffd8b0, 4, add(ROOM, [2, 3, 0.5]), 10);
  await K.placeH('house_interior_pack/Door_1', add(ROOM, [-1.8, 0, -3.84]), 0, 2.6).catch(() => {});
  SG.secreto = K.sign('BODA SECRETA', add(ROOM, [-3.8, 3.2, -3.8]), { w: 3.4, h: 0.85, bg: '#1a1210', border: '#f2c230' });
  SG.sin = K.sign('SOLO LA LIMPIAN', add(ROOM, [2.2, 3.7, -3.8]), { w: 4.0, h: 0.85, bg: '#d7262a', border: '#ffffff' });
  therm.position.set(0, -99, 0);

  // ---------------- STUDY: a British minister's desk, rainy window ----------------
  K.plane(30, 30, K.pbr('dirty_carpet', [6, 6], { tint: 0x8a3a3a }), add(STUDY, [0, 0.01, 0]));
  K.box(12, 6, 0.3, 0xffffff, add(STUDY, [0, 3, -3.5]), { map: K.pbr('dark_wood', [4, 2]).map });
  await K.placeH('house_interior_pack/Bookshelf', add(STUDY, [-2.6, 0, -3.1]), 0, 3.0).catch(() => {}); await K.placeH('house_interior_pack/Bookshelf', add(STUDY, [2.8, 0, -3.1]), 0, 3.0).catch(() => {});
  K.box(2.4, 0.9, 1.1, 0x4a2a14, add(STUDY, [0, 0.45, -0.6]), { map: K.pbr('wood_table_001', [1, 1]).map }); K.box(0.8, 0.02, 0.6, 0xf2ead8, add(STUDY, [0.1, 0.92, -0.5]));
  await K.placeH('house_interior_pack/Light_Desk', add(STUDY, [-0.9, 0.9, -0.8]), 0, 0.6).catch(() => {}); K.pointLight(0xffd8a0, 1.6, add(STUDY, [-1.2, 1.4, -0.9]), 5);
  K.cyl(0.18, 0.2, 0.32, 0x1a1a1a, add(STUDY, [0.9, 1.06, -0.8])); K.cyl(0.3, 0.3, 0.02, 0x1a1a1a, add(STUDY, [0.9, 0.91, -0.8]));
  SG.vidas = K.sign('250.000 VIDAS', add(STUDY, [0, 3.0, -3.3]), { w: 4.4, h: 1.0, bg: '#1a1210', border: '#d7262a' });
  SG.uk = K.sign('LONDRES', add(STUDY, [0, 4.2, -3.3]), { w: 2.6, h: 0.7, bg: '#1e2a4a', border: '#ffffff' });
}

function hideAll() {
  for (const c of [AL, AL2, ST, AS, PR, G1, G2, DR, MN]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(1); c.hold(null); c.neck.rotation.set(0, 0, 0); }
  for (const [k, g] of Object.entries(SG)) { if (k === 'tree') continue; if (Array.isArray(g)) continue; g.visible = false; }
  hideMonkey(M1); hideMonkey(M2); dog.position.set(0, -99, 0); dog.rotation.set(0, 0, 0);
  for (const o of [crown, cloth, basin, therm, quill, blanket]) { o.position.set(0, -99, 0); o.rotation.set(0, 0, 0); o.scale.setScalar(1); }
  figs.forEach(fg => { fg.position.set(...fg.base); fg.rotation.set(0, 0, 0); });
}
function poseDog(pos, yaw, t, o = {}) { dog.position.set(pos[0], pos[1] + (o.run ? Math.abs(Math.sin(t * 13)) * 0.12 : 0), pos[2]); dog.rotation.set(o.run ? Math.sin(t * 13) * 0.08 : 0, yaw, 0); }
function legPos(C) { C.root.updateMatrixWorld(true); const v = new K.THREE.Vector3(); C.legR.b.getWorldPosition(v); return [v.x, v.y, v.z]; }
function hookShot(f, t, v, end) { // the second monkey mid-leap onto the king's leg in the vineyard, Fritz barking, king in shock
  K.preset('day', { photo: DAYSKY, sunDir: [0.25, 1.0, 0.3] });
  const kp = add(VINE, [0.4, 0, 0.0]); P(AL, { pos: kp, yaw: 0.35, arms: 'flail', expr: 'shock', lean: -0.1, tremble: 0.3 }, f);
  const lp = legPos(AL); const a = Math.min(1, 0.3 + v * 1.8); const from = add(lp, [1.1, 1.1, 0.5]); const to = add(lp, [0.18, -0.25, 0.22]);
  poseMonkey(M2, K.lerp(from, to, K.ease(a)).map((x, i) => i === 1 ? x + Math.sin(a * Math.PI) * 0.4 : x), -1.9 + a * 0.6, t, { arms: 'grab', angry: true, pitch: 0.3 * (1 - a), lean: 0.3 });
  poseDog(add(VINE, [-0.5, 0, 1.1]), 0.9, t, { run: 0 }); dog.rotation.x = Math.sin(t * 20) * 0.04;
  K.move({ p: add(kp, [1.6, 1.1, 3.4]), l: add(kp, [0.3, 1.0, 0]), fov: 50 }, { p: add(kp, [1.3, 1.0, 2.9]), l: add(kp, [0.3, 1.0, 0]), fov: 48 }, v, 0.6, f); K.focusOn(add(kp, [0.3, 1.0, 0]));
}

export function frame(f, k) {
  hideAll(); const ph = K.at(f), t = f / 30, u = (i) => K.u(f, i);
  K.preset('day', { photo: DAYSKY, sunDir: [0.25, 1.0, 0.3] });
  if (f < 10) K.grade.whip.value = 0;
  SG.flags.forEach((fl, i) => { fl.rotation.y = Math.sin(t * 3 + i) * 0.25; });
  switch (ph) {
    case 0: { if (u(0) < 0.05) K.grade.flash.value = 0.2 * (1 - u(0) / 0.05); hookShot(f, t, u(0)); break; }
    case 1: { // open loop: crash zoom on the monkey grinning between the vines
      K.grade.vig.value = 0.7; const v = u(1); const mp = add(VINE, [2.5, 0.55, -1.25]); poseMonkey(M2, mp, 0.2, t, { sit: true, angry: true, look: [0.3, 0] });
      K.move({ p: add(mp, [0.8, 0.6, 3.5]), l: add(mp, [0, 0.7, 0]), fov: 48 }, { p: add(mp, [0.3, 0.55, 1.6]), l: add(mp, [0, 0.75, 0]), fov: 42 }, K.ease(v), 0.4, f); K.focusOn(add(mp, [0, 0.7, 0])); break; }
    case 2: { // Athens 1920: crane down the white palace, flags waving; the young king walks down the steps
      SG.atenas.visible = true; const v = u(2); const kp = add(PALX, [0, 0, -3.0 + v * 3.0]);
      P(AL, { pos: kp, yaw: 0, walk: t * 1.6, arms: 'wave', expr: 'happy' }, f);
      K.move({ p: add(PALX, [2, 7.5, 12]), l: add(PALX, [0, 5.5, -6]), fov: 52 }, { p: add(PALX, [1.0, 2.6, 6.5]), l: add(PALX, [0, 2.5, -3]), fov: 50 }, v, 0.2, f); K.focusOn(kp); break; }
    case 3: { // king almost by accident: a crown falls from above onto his bare head, he jumps in surprise
      K.preset('interior', { exposure: 1.15 }); const v = u(3); const kp = add(THR, [0, 0, -1.5]);
      P(AL2, { pos: kp, yaw: 0, arms: v < 0.55 ? 'down' : 'shrug', expr: v < 0.55 ? 'neutral' : 'shock', bounce: v > 0.55 && v < 0.7 ? 1 : 0 }, f);
      AL2.root.updateMatrixWorld(true); const hv = AL2.head.localToWorld(new K.THREE.Vector3(0, 0.33, 0)); const hs = new K.THREE.Vector3(); AL2.head.getWorldScale(hs); crown.scale.setScalar(hs.x * 1.1); const hatY = hv.y;
      const cy = K.lerp(hatY + 2.6, hatY, K.ease(Math.min(1, v * 1.9))); crown.position.set(hv.x, cy, hv.z); crown.rotation.y = t * 4 * (1 - Math.min(1, v * 1.9));
      K.move(K.frame([kp], { yaw: 0.15, h: 3.2, lookY: 1.8, pitch: -0.04, push: 1.0 }), K.frame([kp], { yaw: 0.05, h: 3.0, lookY: 1.8, pitch: -0.05, push: 0.92 }), v, 0.3, f); K.focusOn(add(kp, [0, 1.8, 0])); break; }
    case 4: { // the country at war: figurines slide on the map table, the king leans over, worried
      K.preset('interior', { exposure: 1.15 }); SG.guerra.visible = true; const v = u(4); const kp = add(THR, [3.2, 0, -0.6]);
      P(AL, { pos: kp, yaw: 0, arms: 'think', expr: 'worried', lean: 0.25 }, f);
      figs.forEach((fg, i) => { fg.position.x = fg.base[0] + (i < 5 ? 1 : -1) * Math.sin(Math.min(1, v * 1.2) * Math.PI / 2) * 0.35; });
      K.move({ p: add(THR, [4.6, 2.6, 4.2]), l: add(THR, [3.2, 1.2, 0.6]), fov: 48 }, { p: add(THR, [4.0, 2.2, 3.4]), l: add(THR, [3.2, 1.3, 0.4]), fov: 46 }, v, 0.3, f); K.focusOn(add(THR, [3.2, 1.2, 0.6])); break; }
    case 5: { // secret wedding by candlelight; at u>0.5 the door opens and two courtiers peek in, scandalised
      K.preset('candle', { exposure: 1.6 }); SG.secreto.visible = true; const v = u(5); const kp = add(ROOM, [-4.2, 0, -2.0]), ap = add(ROOM, [-3.3, 0, -2.0]);
      P(AL, { pos: kp, yaw: -0.5, arms: 'hold', expr: 'happy' }, f); P(AS, { pos: ap, yaw: 0.5, arms: 'hold', expr: 'happy', blush: 1 }, f);
      if (v < 0.5) K.move(K.frame([kp, ap], { yaw: 0.1, h: 2.4, lookY: 1.4, pitch: -0.03, push: 0.95 }), K.frame([kp, ap], { yaw: 0.0, h: 2.4, lookY: 1.4, pitch: -0.04, push: 0.85 }), v * 2, 0.3, f);
      else { const g1 = add(ROOM, [-1.4, 0, -2.8]), g2 = add(ROOM, [-2.1, 0, -2.6]); P(G1, { pos: g1, yaw: -0.9, arms: 'cross', expr: 'shock' }, f); P(G2, { pos: g2, yaw: -0.8, arms: 'point', expr: 'angry', talk: 1 }, f);
        K.move(K.frame([kp, g1], { yaw: 0.35, h: 2.4, lookY: 1.4, pitch: -0.03, push: 0.95 }), K.frame([kp, g1], { yaw: 0.3, h: 2.4, lookY: 1.4, pitch: -0.04, push: 0.9 }), (v - 0.5) * 2, 0.3, f); }
      K.focusOn(add(kp, [0.5, 1.4, 0])); break; }
    case 6: { // his refuge: crane over the vineyard and pines toward the white villa
      SG.tatoi.visible = true; const v = u(6);
      K.move({ p: add(VINE, [8, 7, 12]), l: add(VINE, [-4, 1.5, -10]), fov: 54 }, { p: add(VINE, [4, 3.2, 8]), l: add(VINE, [-2, 1.4, -6]), fov: 50 }, v, 0.2, f); K.focusOn(add(VINE, [-4, 1.5, -10])); break; }
    case 7: { // walking with his shepherd dog Fritz down the vine aisle (tracking)
      SG.fritz.visible = true; const v = u(7); const x = -4 + v * 3.5; const kp = add(VINE, [x, 0, 0.2]); const dp = add(VINE, [x + 1.0, 0, 0.6]);
      P(AL, { pos: kp, yaw: Math.PI / 2 - 0.55, walk: t * 1.8, arms: 'wave', expr: 'happy' }, f); poseDog(dp, Math.PI / 2, t, { run: 1 });
      K.move(K.frame([kp, dp], { yaw: 0.25, h: 2.4, lookY: 1.2, pitch: 0.0, push: 0.95 }), K.frame([kp, dp], { yaw: 0.2, h: 2.4, lookY: 1.2, pitch: -0.02, push: 0.9 }), 0.5, 0.2, f); K.focusOn(add(kp, [0.5, 1.2, 0])); break; }
    case 8: { // re-hook: whip into the leaves — a monkey's face pops out, flash
      const v = u(8); if (v < 0.1) K.grade.flash.value = 0.45; K.grade.vig.value = 0.75; const mp = add(VINE, [1.0, 0.35 + Math.min(1, v * 3) * 0.45, -1.35]);
      poseMonkey(M1, mp, 0, t, { sit: true, look: [Math.sin(t * 5) * 0.4, 0] });
      K.move({ p: add(mp, [-0.5, 0.9, 3.0]), l: add(mp, [0, 0.8, 0]), fov: 50 }, { p: add(mp, [-0.2, 0.85, 1.6]), l: add(mp, [0, 0.8, 0]), fov: 44 }, K.ease(Math.min(1, v * 1.6)), 0.4, f); K.focusOn(add(mp, [0, 0.8, 0])); break; }
    case 9: { // the steward's pet: he hands the monkey a grape bunch, the monkey eats happily
      const v = u(9); const sp = add(VINE, [-1.0, 0, 0.0]); const mp = add(VINE, [0.0, 0, 0.1]);
      P(ST, { pos: sp, yaw: 1.1, arms: 'reach', expr: 'happy', talk: 0.5 }, f); poseMonkey(M1, mp, -1.3, t, { sit: true, arms: 'up', look: [0, -0.2] });
      K.move(K.frame([sp, mp], { yaw: 0.1, h: 2.2, lookY: 1.0, pitch: -0.02, push: 0.9 }), K.frame([sp, mp], { yaw: -0.05, h: 2.2, lookY: 1.0, pitch: -0.03, push: 0.82 }), v, 0.3, f); K.focusOn(add(mp, [-0.5, 0.9, 0])); break; }
    case 10: { // Fritz charges, the monkey flees down the aisle (low tracking chase)
      const v = u(10); const x = -3 + v * 6; const mp = add(VINE, [x + 1.4, 0, 0.1]), dp = add(VINE, [x, 0, 0.2]);
      poseMonkey(M1, mp, Math.PI / 2, t, { run: 1 }); poseDog(dp, Math.PI / 2, t, { run: 1 });
      K.move({ p: add(dp, [0.4, 0.7, 3.2]), l: add(dp, [0.8, 0.5, 0]), fov: 50 }, { p: add(dp, [0.4, 0.7, 3.0]), l: add(dp, [0.8, 0.5, 0]), fov: 50 }, 0.5, 0.5, f); K.focusOn(add(dp, [0.7, 0.5, 0])); break; }
    case 11: { // the king runs in to separate them, arms out — and a second monkey drops from the pine above
      const v = u(11); const kp = add(VINE, [3.6 - v * 0.6, 0, 0.0]), dp = add(VINE, [4.6, 0, 0.4]), m1 = add(VINE, [5.5, 0, 0.0]);
      P(AL, { pos: kp, yaw: Math.PI / 2, run: v < 0.6 ? 1 : 0, walk: t * 2.5, arms: 'reach', expr: 'worried' }, f); poseDog(dp, -Math.PI / 2, t, {}); dog.rotation.x = Math.sin(t * 18) * 0.05;
      poseMonkey(M1, m1, -Math.PI / 2, t, { arms: 'up', angry: true });
      if (v > 0.45) { const a = Math.min(1, (v - 0.45) * 2.5); poseMonkey(M2, add(VINE, [5.0 - a * 1.2, 4.2 - a * 3.6, -3.0 + a * 2.6]), -1.0, t, { arms: 'up', angry: true }); }
      K.move({ p: add(kp, [1.0, 1.9, 4.4]), l: add(kp, [1.0, 1.5, -0.5]), fov: 52 }, { p: add(kp, [1.0, 2.1, 4.0]), l: add(kp, [1.0, 1.8, -0.5]), fov: 52 }, v, 0.3, f); K.focusOn(add(kp, [0.8, 1.4, 0])); break; }
    case 12: { // re-hook: freeze-frame close on the second monkey mid-air, desaturated, flash
      const v = u(12); if (v < 0.1) K.grade.flash.value = 0.45; K.grade.sat.value = 0.75; K.grade.vig.value = 0.8;
      const mp = add(VINE, [3.6, 1.2 - v * 0.15, -0.2]); poseMonkey(M2, mp, 0.7, t, { arms: 'up', angry: true, lean: 0.4 });
      K.move({ p: add(mp, [1.6, 0.6, 2.4]), l: add(mp, [0, 0.6, 0]), fov: 46 }, { p: add(mp, [1.1, 0.55, 1.6]), l: add(mp, [0, 0.6, 0]), fov: 42 }, K.ease(Math.min(1, v * 1.5)), 0.4, f); K.focusOn(add(mp, [0, 0.6, 0])); break; }
    case 13: { // it clings to his leg — the king's shocked face, flash, cut before anything shows
      const v = u(13); const kp = add(VINE, [3.0, 0, 0.0]); P(AL, { pos: kp, yaw: 0.6, arms: 'flail', expr: v < 0.3 ? 'shock' : 'scared', tremble: 0.6 }, f);
      const lp = legPos(AL); poseMonkey(M2, add(lp, [0.16, -0.3, 0.2]), 0.6 + Math.PI, t, { arms: 'grab', angry: true, s: 0.9 });
      if ((v > 0.3 && v < 0.34) || (v > 0.6 && v < 0.64)) K.grade.flash.value = 0.35;
      K.move(K.frame([kp], { yaw: 0.5, h: 2.4, lookY: 1.3, pitch: 0.02, push: 0.85 }), K.frame([kp], { yaw: 0.45, h: 2.0, lookY: 1.6, pitch: 0.0, push: 0.8 }), v, v > 0.3 ? 0.9 : 0.3, f); K.focusOn(add(kp, [0, 1.4, 0])); break; }
    case 14: { // a doctor only dabs the wound with a cloth (no cauterizing); king sits on the bed edge, wincing
      K.preset('interior', { exposure: 1.1 }); SG.sin.visible = true; const v = u(14); const kp = add(ROOM, [1.0, 0.25, -1.0]), dp = add(ROOM, [2.1, 0, -0.4]);
      P(AL, { pos: kp, yaw: 0.6, sit: true, arms: 'down', expr: 'worried' }, f); P(DR, { pos: dp, yaw: -1.6, arms: 'reach', expr: 'neutral', lean: 0.3 }, f);
      const lp = legPos(AL); cloth.position.set(lp[0] + 0.12, lp[1] + Math.sin(t * 6) * 0.05, lp[2] + 0.12); basin.position.set(...add(ROOM, [2.0, 0.08, 0.5]));
      K.move(K.frame([kp, dp], { yaw: 0.0, h: 2.4, lookY: 1.2, pitch: -0.02, push: 0.9 }), K.frame([kp, dp], { yaw: -0.1, h: 2.4, lookY: 1.2, pitch: -0.03, push: 0.82 }), v, 0.3, f); K.focusOn(add(kp, [0.5, 1.2, 0])); break; }
    case 15: { // fever: king sitting up in bed, sweating, a giant thermometer climbs into the red
      K.preset('candle', { exposure: 1.5 }); K.grade.vig.value = 0.7; const v = u(15); const kp = add(ROOM, [2.2, 0.55, -2.6]);
      P(AL, { pos: kp, yaw: 0, sit: true, arms: 'down', expr: v < 0.6 ? 'tired' : 'sad', sweat: 1, tremble: 0.3 }, f); blanket.position.set(...add(ROOM, [2.2, 0.75, -2.1]));
      therm.position.set(...add(ROOM, [3.25, 1.9, -2.7])); therm.bar.scale.y = 0.4 + v * 0.95; therm.bar.position.y = -0.72 + (0.4 + v * 0.95) * 0.5;
      K.move({ p: add(ROOM, [2.6, 2.0, 1.8]), l: add(ROOM, [2.75, 1.6, -2.4]), fov: 48 }, { p: add(ROOM, [2.7, 1.9, 1.3]), l: add(ROOM, [2.75, 1.7, -2.4]), fov: 48 }, v, 0.2, f); K.focusOn(add(kp, [0, 1.2, 0])); break; }
    case 16: { // the young king dies: empty bed, the crown on the pillow → the map table: figurines topple, ¡CAOS!
      const v = u(16);
      if (v < 0.45) { K.preset('candle', { exposure: 1.4 }); K.grade.sat.value = 0.6; K.grade.vig.value = 0.85; crown.position.set(...add(ROOM, [2.2, 0.72, -3.0])); crown.rotation.z = 0.3;
        K.move({ p: add(ROOM, [2.6, 1.6, -0.6]), l: add(ROOM, [2.2, 0.8, -3.0]), fov: 40 }, { p: add(ROOM, [2.5, 1.4, -1.0]), l: add(ROOM, [2.2, 0.8, -3.0]), fov: 38 }, v / 0.45, 0.15, f); K.focusOn(add(ROOM, [2.2, 0.8, -3.0])); }
      else { K.preset('interior', { exposure: 1.1 }); SG.caos.visible = true; const w = (v - 0.45) / 0.55; if (w < 0.08) K.grade.flash.value = 0.45;
        figs.forEach((fg, i) => { const a = Math.min(1, Math.max(0, w * 3 - i * 0.15)); fg.rotation.set(a * 1.5 * (i % 2 ? 1 : -1), 0, a * 1.3 * (i % 3 ? 1 : -1)); fg.position.y = fg.base[1] + Math.sin(a * Math.PI) * 0.3; });
        K.move({ p: add(THR, [4.4, 2.6, 3.4]), l: add(THR, [3.2, 0.9, 1.0]), fov: 46 }, { p: add(THR, [3.8, 2.1, 2.6]), l: add(THR, [3.2, 0.9, 1.0]), fov: 44 }, w, 0.6, f); K.focusOn(add(THR, [3.2, 0.95, 1.0])); }
      break; }
    case 17: { // London: a British minister writes by lamplight — "250.000 vidas"
      K.preset('interior', { exposure: 1.1 }); SG.vidas.visible = true; SG.uk.visible = true; const v = u(17); const mp = add(STUDY, [0.1, 0.3, 0.2]);
      P(MN, { pos: mp, yaw: Math.PI, sit: true, arms: 'hammer', expr: 'worried', lean: 0.3 }, f);
      quill.position.set(...add(STUDY, [0.05 + Math.sin(t * 7) * 0.12, 0.98, -0.45])); quill.rotation.z = 0.4;
      K.move({ p: add(STUDY, [1.4, 2.3, -3.0]), l: add(STUDY, [0.1, 1.2, 0.2]), fov: 50 }, { p: add(STUDY, [1.2, 2.2, -2.8]), l: add(STUDY, [0.1, 1.3, 0.2]), fov: 46 }, v, 0.2, f); K.focusOn(add(STUDY, [0.1, 1.3, 0.2])); break; }
    case 18: { // gag: Fritz and the monkey sit side by side in the vineyard, looking at camera as if nothing happened
      const v = u(18); const dp = add(VINE, [-0.5, 0, 0.2]), mp = add(VINE, [0.35, 0, 0.25]);
      poseDog(dp, 0.2, t, {}); poseMonkey(M2, mp, -0.2, t, { sit: true, look: [Math.sin(t * 2) * 0.3, 0] });
      K.move({ p: add(VINE, [0.0, 0.8, 3.0]), l: add(VINE, [0, 0.55, 0.2]), fov: 46 }, { p: add(VINE, [0.0, 0.75, 2.3]), l: add(VINE, [0, 0.55, 0.2]), fov: 44 }, v, 0.15, f); K.focusOn(add(VINE, [0, 0.55, 0.2])); break; }
    default: { const v = u(19); hookShot(f, t, v, true); SG.q.visible = true; }
  }
}
