// VID-019 — Molière (París, 1673): played a hypochondriac in "El enfermo imaginario", coughed for real on stage, finished the show and died hours later. No gore.
export let FRAMES = 2100;
let K, T, MO, KI, D1, D2, NB, A1, A2, A3, A4, F1, F2, SG = {}, chair, blanket, cough = [], hatBed, candles = [], flames = [], fans = [];
const STAGE = [0, 0, 0], PAL = [200, 0, 0], HOME = [400, 0, 0], MAC = [600, 0, 0];
const SH = 1.0; // stage height
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
const CHEST = (C) => { C.armL.a.rotation.set(-0.7, 0, 0.5); C.armL.b.rotation.set(-1.7, 0, 0); C.armR.a.rotation.set(-0.7, 0, -0.5); C.armR.b.rotation.set(-1.7, 0, 0); };
const MOUTH = (C) => { C.armL.a.rotation.set(0.1, 0, 0.15); C.armR.a.rotation.set(-1.9, 0, -0.5); C.armR.b.rotation.set(-1.4, 0, 0); };
const BOW = (C) => { C.armL.a.rotation.set(-0.3, 0, 1.2); C.armR.a.rotation.set(-1.2, 0, -0.2); C.armR.b.rotation.set(-1.0, 0, 0); };

function candle(pos, s = 1) { K.cyl(0.05 * s, 0.05 * s, 0.32 * s, 0xf4ecd8, add(pos, [0, 0.16 * s, 0])); const fl = K.sph(0.05 * s, 0xffd060, add(pos, [0, 0.36 * s, 0]), { emissive: 0xffb030, emissiveIntensity: 6 }); fl.scale.set(0.8, 1.5, 0.8); flames.push(fl); }
function curtainTex(col, dark) { return K.tex(256, 256, (g, w, h) => { for (let x = 0; x < w; x += 32) { const gr = g.createLinearGradient(x, 0, x + 32, 0); gr.addColorStop(0, dark); gr.addColorStop(0.5, col); gr.addColorStop(1, dark); g.fillStyle = gr; g.fillRect(x, 0, 32, h); } }, [3, 1]); }

export async function build(k) {
  K = k; await K.preloadEnvs(); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  MO = C(K.scene, { shirt: 0x2a8a4a, buttons: 0xe0b040, belt: 0x6a3a1a, hat: 'wig', mustache: true, seed: 1 });
  KI = C(K.scene, { shirt: 0x1e3a9a, cape: 0xb8301e, buttons: 0xe0b040, hat: 'crown', mustache: true, seed: 2 });
  D1 = C(K.scene, { shirt: 0x1a1a22, buttons: 0xf2f2f2, hat: 'top', hatColor: 0x1a1a1a, glasses: true, seed: 3 });
  D2 = C(K.scene, { shirt: 0x1a1a22, buttons: 0xf2f2f2, hat: 'top', hatColor: 0x1a1a1a, mustache: true, seed: 4 });
  NB = C(K.scene, { shirt: 0xc85a8a, cape: 0xe0b040, hat: 'wig', seed: 5 });
  A1 = C(K.scene, { shirt: 0xb8301e, hair: 0x3a2414, seed: 6 }); A2 = C(K.scene, { shirt: 0x3a6aa8, hat: 'tricorn', hatColor: 0x2a1a10, seed: 7 });
  A3 = C(K.scene, { shirt: 0xe0a030, hair: 0x8a2a1a, seed: 8 }); A4 = C(K.scene, { shirt: 0x6a3a9a, hair: 0x15100c, mustache: true, seed: 9 });
  F1 = C(K.scene, { shirt: 0x8a5a2a, hair: 0x5a3418, seed: 10 }); F2 = C(K.scene, { shirt: 0xc8503a, hair: 0x2a1a10, seed: 11 });
  for (let i = 0; i < 7; i++) cough.push(K.sph(0.12, 0xf2f2f2, [0, -99, 0], { transparent: true, opacity: 0.85 }));

  // ---------------- STAGE: 1673 Paris theatre, red velvet, candle footlights ----------------
  const fl = K.tex(256, 256, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#8a5a34' : '#a06a3e'; g.fillRect(i * 32, 0, 31, 256); } }, [6, 3]);
  K.box(16, SH, 8, 0xffffff, add(STAGE, [0, SH / 2, -2]), { map: fl });
  K.box(16, 0.25, 0.3, 0xe0b040, add(STAGE, [0, SH - 0.1, 2.05]));
  K.plane(40, 30, K.std(0x3a1a14), add(STAGE, [0, 0.01, 6]));
  const bd = K.tex(512, 256, (g, w, h) => { g.fillStyle = '#e8c890'; g.fillRect(0, 0, w, h); g.fillStyle = '#d0a870'; for (let x = 0; x < w; x += 64) g.fillRect(x, 0, 24, h); g.fillStyle = '#6a8ac8'; g.fillRect(180, 50, 150, 110); g.strokeStyle = '#6a3a1a'; g.lineWidth = 10; g.strokeRect(180, 50, 150, 110); g.beginPath(); g.moveTo(255, 50); g.lineTo(255, 160); g.moveTo(180, 105); g.lineTo(330, 105); g.stroke(); g.fillStyle = '#7a4a24'; g.fillRect(0, h - 40, w, 40); }, [2, 1]);
  K.plane(16, 9, K.std(0xffffff, { map: bd }), add(STAGE, [0, SH + 4.5, -5.9]));
  const ct = curtainTex('#c8202a', '#5a0a10'); const cm = K.std(0xffffff, { map: ct });
  for (const s of [-1, 1]) { K.box(3.2, 10, 0.4, 0xffffff, add(STAGE, [s * 6.6, 5, 1.6]), { map: ct }); K.box(1.6, 10, 0.4, 0xffffff, add(STAGE, [s * 7.6, 5, -3]), { map: ct }); }
  K.box(16, 1.8, 0.4, 0xffffff, add(STAGE, [0, 8.4, 1.6]), { map: ct }); K.box(16, 0.3, 0.45, 0xe0b040, add(STAGE, [0, 7.5, 1.6]));
  for (let i = 0; i < 13; i++) candle(add(STAGE, [-6 + i, SH, 1.75]), 1.2);
  // Argan's armchair + table with bottles of medicine
  chair = new K.THREE.Group(); K.box(1.1, 0.5, 1.0, 0xb8301e, [0, 0.45, 0], { parent: chair }); K.box(1.1, 1.4, 0.2, 0xb8301e, [0, 1.0, -0.45], { parent: chair }); for (const s of [-1, 1]) K.box(0.18, 0.8, 1.0, 0x8a1a14, [s * 0.55, 0.6, 0], { parent: chair }); K.box(1.2, 0.15, 0.15, 0xe0b040, [0, 1.72, -0.45], { parent: chair });
  chair.position.set(...add(STAGE, [0, SH, -2.2])); K.scene.add(chair);
  K.box(0.9, 0.9, 0.7, 0x6a3a1a, add(STAGE, [1.5, SH + 0.45, -2.3])); for (let i = 0; i < 4; i++) K.cyl(0.07, 0.09, 0.32, [0x3a8a3a, 0x8a2a6a, 0x2a6aa8, 0xe0a030][i], add(STAGE, [1.25 + (i % 2) * 0.3, SH + 1.06, -2.45 + Math.floor(i / 2) * 0.3]));
  blanket = K.box(1.0, 0.08, 0.9, 0xe8dcc0, [0, -99, 0]);
  SG.enf = K.sign('EL ENFERMO IMAGINARIO', add(STAGE, [0, SH + 5.2, -5.7]), { w: 6.4, h: 1.0, bg: '#1e5a3a', border: '#e0b040' });
  SG.med = K.sign('MÉDICOS', add(STAGE, [-3.2, SH + 3.6, -5.7]), { w: 2.6, h: 0.85, bg: '#1a1a22' });
  SG.nob = K.sign('NOBLES', add(STAGE, [3.2, SH + 3.6, -5.7]), { w: 2.4, h: 0.85, bg: '#8a2a6a' });
  SG.mur = K.sign('¿ACTUANDO?', add(STAGE, [-3.4, SH + 3.4, -5.7]), { w: 3.0, h: 0.95, bg: '#b8301e' });
  // audience benches + extra crowd (simple fans)
  for (let r = 0; r < 3; r++) K.box(10, 0.45, 0.5, 0x5a3418, add(STAGE, [0, 0.22, 3.6 + r * 1.6]));
  const cols = [0xb8301e, 0x3a6aa8, 0xe0a030, 0x3a8a3a, 0x8a2a6a, 0xf2ead8];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { if (r === 0 && i > 2 && i < 7) continue; const g = new K.THREE.Group(); K.cyl(0.24, 0.28, 0.65, cols[(i + r) % 6], [0, 0.75, 0], { parent: g }); K.sph(0.27, 0xfffdf8, [0, 1.3, 0], { parent: g }); g.position.set(...add(STAGE, [-4 + i, 0, 3.7 + r * 1.6])); K.scene.add(g); fans.push({ g, ph: i * 1.7 + r }); }
  K.pointLight(0xffc070, 14, add(STAGE, [0, SH + 2.2, 0.5]), 12); K.pointLight(0xff9050, 5, add(STAGE, [0, 3, 6]), 10);
  // dressing room corner (stage left, behind the curtain): mirror + friends
  K.plane(6, 6, K.std(0x5a2a3a), add(STAGE, [-12, 3, -3]), [0, Math.PI / 2, 0]);
  K.box(1.4, 1.8, 0.1, 0xe0b040, add(STAGE, [-11.9, SH + 2.2, -2.5]), {}).rotation.y = Math.PI / 2;
  K.box(1.2, 1.6, 0.05, 0xcfe0ec, add(STAGE, [-11.84, SH + 2.2, -2.5]), { metalness: 0.6 }).rotation.y = Math.PI / 2;
  candle(add(STAGE, [-11.4, SH + 0.9, -1.4]), 1.4); K.box(1.0, 0.9, 1.6, 0x6a3a1a, add(STAGE, [-11.4, SH + 0.45, -1.8]));
  SG.t50 = K.sign('50 TRABAJADORES', add(STAGE, [0, SH + 4.0, -5.7]), { w: 5.2, h: 1.0, bg: '#2a1a10' });
  SG.pul = K.sign('PULMONES', add(STAGE, [-11.8, SH + 3.9, -1.0]), { w: 2.6, h: 0.85, bg: '#b8301e', rotY: Math.PI / 2 });

  // ---------------- PALACE: Versailles blue + gold ----------------
  const pf = K.tex(256, 256, (g) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? '#1e3a7a' : '#f2e2b0'; g.fillRect(x * 32, y * 32, 32, 32); } }, [8, 8]);
  K.plane(30, 30, K.std(0xffffff, { map: pf }), add(PAL, [0, 0.01, 0]));
  const pw = K.tex(512, 256, (g, w, h) => { g.fillStyle = '#2a4a9a'; g.fillRect(0, 0, w, h); g.fillStyle = '#e0b040'; for (let x = 0; x < w; x += 64) for (let y = 30; y < h; y += 64) { g.beginPath(); g.arc(x + 32, y, 9, 0, 7); g.fill(); g.fillRect(x + 29, y, 6, 22); } g.fillRect(0, 0, w, 14); }, [4, 1]);
  K.plane(30, 10, K.std(0xffffff, { map: pw }), add(PAL, [0, 5, -6]));
  K.box(3.2, 0.5, 2.4, 0xb8301e, add(PAL, [0, 0.25, -4.2])); const th = new K.THREE.Group(); K.box(1.5, 0.6, 1.2, 0xe0b040, [0, 0.8, 0], { parent: th }); K.box(1.5, 2.6, 0.25, 0xe0b040, [0, 1.8, -0.5], { parent: th }); K.box(1.2, 2.2, 0.1, 0x1e3a9a, [0, 1.8, -0.36], { parent: th }); th.position.set(...add(PAL, [0, 0, -4.4])); K.scene.add(th);
  for (const x of [-5, 5]) { K.cyl(0.45, 0.5, 9, 0xf2e2b0, add(PAL, [x, 4.5, -5])); K.box(1.2, 0.3, 1.2, 0xe0b040, add(PAL, [x, 9, -5])); }
  await K.placeH('house_interior_pack/Light_Chandelier', add(PAL, [0, 5.4, -1.5]), 0, 1.6).catch(() => {});
  SG.luis = K.sign('LUIS XIV', add(PAL, [0, 5.0, -5.85]), { w: 3.0, h: 0.95, bg: '#b8301e' });
  K.pointLight(0xffd890, 12, add(PAL, [0, 4, 0]), 14);

  // ---------------- HOME: night bedroom, single candle ----------------
  const hf = K.tex(256, 256, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#5a3a24' : '#6a4a2e'; g.fillRect(0, i * 32, 256, 31); } }, [5, 5]);
  K.plane(16, 16, K.std(0xffffff, { map: hf }), add(HOME, [0, 0.01, 0]));
  K.plane(16, 7, K.std(0x3a4a6a), add(HOME, [0, 3.5, -4])); K.plane(10, 7, K.std(0x3a4a6a), add(HOME, [-5, 3.5, 1]), [0, Math.PI / 2, 0]);
  await K.placeH('house_interior_pack/Bed_King', add(HOME, [-1.4, 0, -2.6]), 0, 1.1, { tint: 0xb8301e }).catch(() => {});
  await K.placeH('house_interior_pack/Window_Large1', add(HOME, [1.6, 2.4, -3.95]), 0, 2.0).catch(() => {});
  K.box(0.7, 0.8, 0.6, 0x4a2a14, add(HOME, [0.6, 0.4, -3.2])); candle(add(HOME, [0.6, 0.8, -3.2]), 1.3);
  hatBed = new K.THREE.Group(); for (const s of [-1, 1]) for (let i = 0; i < 3; i++) K.sph(0.11, 0xf4f0e6, [s * 0.3, 0.05 - i * 0.15, -0.05], { parent: hatBed }); K.sph(0.31, 0xf4f0e6, [0, 0.03, 0], { parent: hatBed }); K.scene.add(hatBed);
  SG.y73 = K.sign('1673', add(HOME, [-1.4, 3.0, -3.9]), { w: 1.6, h: 0.7, bg: '#2a1a10' });
  K.pointLight(0xffb060, 7, add(HOME, [0.6, 1.6, -2.6]), 7); K.pointLight(0x6080c0, 3, add(HOME, [1.6, 2.6, -2]), 8);

  // ---------------- MACRO: playbill on a brick wall ----------------
  const br = K.tex(256, 256, (g) => { g.fillStyle = '#7a3a2a'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#9a4a32'; for (let y = 0; y < 8; y++) for (let x = 0; x < 4; x++) g.fillRect(x * 64 + (y % 2) * 32 + 3, y * 32 + 3, 58, 26); }, [4, 4]);
  K.plane(12, 12, K.std(0xffffff, { map: br }), add(MAC, [0, 3, -1]));
  const pb = K.tex(512, 720, (g, w, h) => { g.fillStyle = '#f2e6c8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#6a2a1a'; g.lineWidth = 14; g.strokeRect(20, 20, w - 40, h - 40); g.fillStyle = '#6a2a1a'; g.textAlign = 'center'; g.font = '900 54px Poppins, sans-serif'; g.fillText('MOLIÈRE', w / 2, 120); g.font = '900 62px Poppins, sans-serif'; g.fillStyle = '#1e5a3a'; g.fillText('EL ENFERMO', w / 2, 300); g.fillText('IMAGINARIO', w / 2, 380); g.fillStyle = '#b8301e'; g.font = '900 96px Poppins, sans-serif'; g.fillText('1673', w / 2, 560); g.fillStyle = '#6a2a1a'; g.font = '700 34px Poppins, sans-serif'; g.fillText('COMEDIA', w / 2, 640); });
  K.plane(2.4, 3.4, K.std(0xffffff, { map: pb }), add(MAC, [0, 2.6, -0.95]));
  candle(add(MAC, [-1.6, 0.6, 0]), 2); candle(add(MAC, [1.6, 0.6, 0]), 2); K.box(5, 0.6, 1, 0x4a2a14, add(MAC, [0, 0.3, 0]));
  K.pointLight(0xffb060, 8, add(MAC, [0, 2.6, 1.5]), 6);
}

function hideAll() {
  for (const c of [MO, KI, D1, D2, NB, A1, A2, A3, A4, F1, F2]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.hold(null); }
  for (const g of Object.values(SG)) g.visible = false;
  for (const c of cough) c.position.set(0, -99, 0);
  blanket.position.set(0, -99, 0); blanket.rotation.set(0, 0, 0); hatBed.position.set(0, -99, 0);
  for (const fa of fans) fa.g.visible = true;
}
function tick(f) { const t = f / 30; flames.forEach((fl, i) => { const s = 1 + Math.sin(t * 13 + i * 2.1) * 0.15; fl.scale.set(0.8 * s, 1.5 * (2 - s), 0.8 * s); }); return t; }
function crowd(t, laugh) { fans.forEach(fa => { fa.g.position.y = laugh ? Math.abs(Math.sin(t * 7 + fa.ph)) * 0.18 : 0; fa.g.rotation.z = laugh ? Math.sin(t * 6 + fa.ph) * 0.08 : 0; }); }
function puffs(t, c, n = 4) { for (let i = 0; i < n; i++) { const k = (t * 1.6 + i / n) % 1; cough[i].position.set(c[0] + 0.25 + k * 0.6, c[1] + Math.sin(i * 3) * 0.15 + k * 0.3, c[2] + 0.3 + k * 0.4); cough[i].scale.setScalar(0.5 + k * 1.2); } }
// Argan in his armchair (Molière on stage); collapse 0..1
function argan(f, t, o = {}) {
  const p = add(STAGE, [0, SH - 0.28, -2.05]);
  P(MO, { pos: p, yaw: 0, sit: 1, expr: o.expr || 'shock', lean: o.lean || 0, look: o.look || [0, 0.1], talk: o.talk || 0, tremble: o.tremble || 0, armsOverride: o.arms || CHEST }, f);
  if (o.collapse) { MO.root.rotation.z = -0.5 * o.collapse; MO.root.position.x += 0.25 * o.collapse; }
  blanket.position.set(...add(p, [0, 0.95, 0.35])); blanket.rotation.x = -0.25;
  SG.enf.visible = true;
}

export function frame(f, k) {
  hideAll(); const ph = K.at(f), t = tick(f), u = (i) => K.u(f, i);
  K.preset('candle', { exposure: 1.15 }); crowd(t, false);
  const S0 = add(STAGE, [0, SH, -2.1]);
  switch (ph) {
    case 0: { // HOOK: Molière in the armchair, mid-collapse coughing, audience heads laughing in the foreground
      const v = u(0); crowd(t, true); argan(f, t, { expr: 'shock', collapse: 0.35 + 0.25 * Math.sin(t * 5) ** 2, tremble: 2 }); puffs(t, add(S0, [0, 2.3, 0.2]));
      K.move({ p: add(STAGE, [0.8, 2.1, 4.6]), l: add(S0, [0, 1.9, 0]), fov: 46 }, { p: add(STAGE, [0.4, 2.2, 3.6]), l: add(S0, [0, 1.9, 0]), fov: 44 }, v, 0.8, f); K.focusOn(add(S0, [0, 1.8, 0])); break; }
    case 1: { // audience thought it was part of the play: reverse shot, laughing crowd
      crowd(t, true); const a = add(STAGE, [-1.0, 0, 3.6]), b = add(STAGE, [1.0, 0, 3.6]);
      P(A1, { pos: a, yaw: Math.PI * 0 + 0.0, expr: 'laugh', arms: 'point', bounce: 0.8 }, f); P(A2, { pos: b, yaw: 0, expr: 'laugh', arms: 'cross', bounce: 0.8 }, f);
      P(A3, { pos: add(STAGE, [0, 0, 5.2]), yaw: 0, expr: 'laugh', arms: 'up', bounce: 0.8 }, f);
      K.move(K.frame([a, b], { yaw: Math.PI - 0.12, h: 3.2, lookY: 1.9, pitch: 0.06, push: 0.9 }), K.frame([a, b], { yaw: Math.PI + 0.05, h: 3.2, lookY: 1.9, pitch: 0.04, push: 0.8 }), u(1), 0.6, f);
      // camera on stage looking at audience: characters face +z → rotate them toward stage camera
      A1.root.rotation.y = Math.PI; A2.root.rotation.y = Math.PI; A3.root.rotation.y = Math.PI; K.focusOn(add(STAGE, [0, 1.6, 3.8])); break; }
    case 2: { // most famous comedy author in France: proud bow on stage
      const p = add(STAGE, [0, SH, -0.6]); SG.enf.visible = true; crowd(t, true);
      P(MO, { pos: p, yaw: 0, expr: 'proud', armsOverride: BOW, lean: 0.25 * Math.max(0, Math.sin(t * 2.5)) }, f);
      K.move(K.frame([p], { yaw: 0.25, h: 2.8, lookY: 1.8, pitch: -0.05, push: 0.95 }), K.frame([p], { yaw: 0.1, h: 2.8, lookY: 1.8, pitch: -0.06, push: 0.8 }), u(2), 0.5, f); K.focusOn(add(p, [0, 2, 0])); break; }
    case 3: { // mocked nobles, false sages... and above all doctors
      const v = u(3); const m = add(STAGE, [0.6, SH, -1.0]);
      if (v < 0.45) { const n = add(STAGE, [-1.0, SH, -1.4]); SG.nob.visible = true; P(NB, { pos: n, yaw: 0.4, expr: 'smug', arms: 'akimbo' }, f); P(MO, { pos: m, yaw: -0.5, expr: 'laugh', arms: 'point', bounce: 0.5 }, f);
        K.move(K.frame([n, m], { yaw: 0.1, h: 3.0, lookY: 1.9, pitch: -0.04, push: 0.9 }), K.frame([n, m], { yaw: 0.0, h: 3.0, lookY: 1.9, pitch: -0.05, push: 0.82 }), v / 0.45, 0.5, f); K.focusOn(add(STAGE, [0, SH + 1.9, -1.2])); }
      else { const a = add(STAGE, [-1.6, SH, -1.6]), b = add(STAGE, [-0.4, SH, -1.8]); SG.med.visible = true; P(D1, { pos: a, yaw: 0.3, expr: 'angry', arms: 'cross' }, f); P(D2, { pos: b, yaw: 0.2, expr: 'worried', arms: 'think' }, f); P(MO, { pos: add(m, [0.6, 0, 0]), yaw: -0.6, expr: 'laugh', arms: 'point', bounce: 0.6 }, f);
        K.move(K.frame([a, b, add(m, [0.6, 0, 0])], { yaw: -0.1, h: 3.0, lookY: 1.9, pitch: -0.04, push: 0.92 }), K.frame([a, b, add(m, [0.6, 0, 0])], { yaw: 0.05, h: 3.0, lookY: 1.9, pitch: -0.05, push: 0.84 }), (v - 0.45) / 0.55, 0.5, f); K.focusOn(add(STAGE, [-0.6, SH + 1.9, -1.6])); }
      break; }
    case 4: { // King Louis XIV laughing out loud at his plays
      K.preset('interior', { exposure: 1.15 }); const p = add(PAL, [0, 0.5, -4.3]), m = add(PAL, [2.0, 0, -2.4]); SG.luis.visible = true;
      P(KI, { pos: add(p, [0, -0.3, 0.1]), yaw: 0, sit: 1, expr: 'laugh', arms: 'up', bounce: 0.6 }, f); P(MO, { pos: m, yaw: -0.7, expr: 'happy', armsOverride: BOW }, f);
      K.move(K.frame([p, m], { yaw: -0.2, h: 3.4, lookY: 2.0, pitch: -0.05, push: 0.9 }), K.frame([p, m], { yaw: -0.08, h: 3.4, lookY: 2.0, pitch: -0.06, push: 0.8 }), u(4), 0.5, f); K.focusOn(add(PAL, [0.8, 2, -3.6])); break; }
    case 5: { // a real problem: very sick lungs — dressing room, hand on chest, PULMONES
      const p = add(STAGE, [-10.6, SH, -2.2]); SG.pul.visible = true;
      P(MO, { pos: p, yaw: -0.9, expr: 'worried', sweat: true, armsOverride: CHEST, tremble: 1 }, f); puffs(t, add(p, [0, 2.2, 0]), 2);
      K.move(K.frame([p], { yaw: -0.9, h: 2.6, lookY: 1.9, pitch: -0.02, push: 0.85 }), K.frame([p], { yaw: -0.75, h: 2.6, lookY: 1.9, pitch: -0.03, push: 0.72 }), u(5), 0.6, f); K.focusOn(add(p, [0, 2, 0])); break; }
    case 6: { // coughing non-stop... and still acting: coughs then bows to the cheering crowd
      const v = u(6); const p = add(STAGE, [0, SH, -0.7]); crowd(t, v > 0.5); SG.enf.visible = true;
      if (v < 0.5) { P(MO, { pos: p, yaw: 0.1, expr: 'tired', lean: 0.3, armsOverride: MOUTH, tremble: 2 }, f); puffs(t, add(p, [0, 2.2, 0]), 5); }
      else P(MO, { pos: p, yaw: 0, expr: 'happy', armsOverride: BOW, lean: 0.25 }, f);
      K.move(K.frame([p], { yaw: -0.3, h: 2.6, lookY: 1.9, pitch: -0.03, push: 0.8 }), K.frame([p], { yaw: 0.2, h: 2.9, lookY: 1.9, pitch: -0.05, push: 0.9 }), v, 0.6, f); K.focusOn(add(p, [0, 2, 0])); break; }
    case 7: { // 1673: premiere of his last comedy — the playbill
      K.preset('candle', { exposure: 1.2 }); const v = u(7);
      K.move({ p: add(MAC, [1.0, 2.4, 4.4]), l: add(MAC, [0, 2.6, -1]), fov: 46 }, { p: add(MAC, [0.2, 2.6, 3.0]), l: add(MAC, [0, 2.6, -1]), fov: 44 }, v, 0.3, f); K.focusOn(add(MAC, [0, 2.6, -1])); break; }
    case 8: { // he played a man who PRETENDED to be sick: smug in the armchair with blanket, doctors around
      argan(f, t, { expr: 'smug', arms: (C) => { C.armL.a.rotation.set(-0.4, 0, 0.3); C.armR.a.rotation.set(-0.9, 0, -0.2); C.armR.b.rotation.set(-1.6, 0, 0); } });
      const a = add(STAGE, [-1.4, SH, -1.6]), b = add(STAGE, [1.4, SH, -1.5]); P(D1, { pos: a, yaw: 0.6, expr: 'worried', arms: 'reach' }, f); P(D2, { pos: b, yaw: -0.6, expr: 'worried', arms: 'think' }, f);
      K.move(K.frame([a, b, S0], { yaw: 0.12, h: 3.1, lookY: 1.9, pitch: -0.03, push: 0.92 }), K.frame([a, b, S0], { yaw: -0.05, h: 3.1, lookY: 1.9, pitch: -0.05, push: 0.84 }), u(8), 0.5, f); K.focusOn(add(S0, [0, 1.9, 0])); break; }
    case 9: { // but that wasn't the worst: dark punch-in, he coughs into his hand
      K.preset('candle', { exposure: 0.9 }); K.grade.vig.value = 0.7; const v = u(9); if (v < 0.08) K.grade.flash.value = 0.35;
      argan(f, t, { expr: 'worried', arms: MOUTH, tremble: 1 }); puffs(t, add(S0, [0, 2.3, 0.2]), 3);
      K.move(K.frame([S0], { yaw: 0.35, h: 2.2, lookY: 1.7, pitch: 0.0, push: 0.8 }), K.frame([S0], { yaw: 0.3, h: 2.1, lookY: 1.7, pitch: 0.0, push: 0.62 }), K.ease(v), 0.3, f); K.focusOn(add(S0, [0, 1.8, 0])); break; }
    case 10: { // 4th show: friends begging him not to go on stage (dressing room)
      const p = add(STAGE, [-10.6, SH, -2.0]), a = add(STAGE, [-9.6, SH, -0.8]), b = add(STAGE, [-10.0, SH, -3.4]); SG.pul.visible = true;
      P(MO, { pos: p, yaw: 0.6, expr: 'tired', armsOverride: CHEST }, f); P(F1, { pos: a, yaw: -2.3, expr: 'worried', arms: 'reach' }, f); P(F2, { pos: b, yaw: -0.6, expr: 'scared', arms: 'hold2' }, f);
      K.move(K.frame([p, a, b], { yaw: -1.1, h: 3.0, lookY: 1.9, pitch: -0.03, push: 0.9 }), K.frame([p, a, b], { yaw: -0.95, h: 3.0, lookY: 1.9, pitch: -0.04, push: 0.82 }), u(10), 0.6, f); K.focusOn(add(p, [0, 2, 0])); break; }
    case 11: { // 50 workers lived from that show: stagehands lined up behind him
      const p = add(STAGE, [0, SH, -0.6]); SG.t50.visible = true; const crew = [A1, A2, A3, A4, F1, F2];
      crew.forEach((c, i) => P(c, { pos: add(STAGE, [-3.0 + i * 1.2, SH, -3.4 + (i % 2) * 0.3]), yaw: 0, expr: i % 2 ? 'worried' : 'neutral', arms: i % 3 === 0 ? 'hold2' : 'cross' }, f));
      for (const fa of fans) fa.g.visible = false;
      P(MO, { pos: p, yaw: 0, expr: 'proud', arms: 'akimbo' }, f);
      K.move(K.frame([p, add(STAGE, [-3, SH, -3.4]), add(STAGE, [3, SH, -3.4])], { yaw: 0.08, h: 3.2, lookY: 2.0, pitch: -0.05, push: 0.95 }), K.frame([p, add(STAGE, [-3, SH, -3.4]), add(STAGE, [3, SH, -3.4])], { yaw: -0.05, h: 3.2, lookY: 2.0, pitch: -0.06, push: 0.86 }), u(11), 0.5, f); K.focusOn(add(p, [0, 2, -1])); break; }
    case 12: { // AND HERE IT ALL WENT WRONG: dark, low angle on the armchair
      K.preset('candle', { exposure: 0.85 }); K.grade.vig.value = 0.75; const v = u(12); if (v < 0.08) K.grade.flash.value = 0.4;
      argan(f, t, { expr: 'neutral', arms: CHEST });
      K.move({ p: add(STAGE, [1.4, SH + 0.6, 1.8]), l: add(S0, [0, 1.9, 0]), fov: 44 }, { p: add(STAGE, [0.9, SH + 0.7, 1.0]), l: add(S0, [0, 1.9, 0]), fov: 42 }, K.ease(v), 0.3, f); K.focusOn(add(S0, [0, 1.8, 0])); break; }
    case 13: { // mid-scene he coughs for real and collapses
      const v = u(13); const c = Math.min(1, Math.max(0, (v - 0.45) / 0.25));
      argan(f, t, { expr: v < 0.45 ? 'scared' : 'out', arms: v < 0.45 ? MOUTH : CHEST, tremble: v < 0.45 ? 3 : 0, collapse: c }); if (v < 0.5) puffs(t, add(S0, [0, 2.3, 0.2]), 6);
      if (v > 0.44 && v < 0.5) K.grade.flash.value = 0.4;
      K.move(K.frame([S0], { yaw: -0.3, h: 2.6, lookY: 1.6, pitch: 0.0, push: 0.78 }), K.frame([S0], { yaw: -0.2, h: 2.6, lookY: 1.5, pitch: 0.02, push: 0.7 }), v, 0.6 + c, f); K.focusOn(add(S0, [0, 1.6, 0])); break; }
    case 14: { // many laughed: they thought it was part of the comedy
      crowd(t, true); const a = add(STAGE, [-1.0, 0, 3.6]), b = add(STAGE, [1.0, 0, 3.6]), c = add(STAGE, [0, 0, 5.2]);
      P(A4, { pos: a, expr: 'laugh', arms: 'point', bounce: 0.9 }, f); P(A2, { pos: b, expr: 'laugh', arms: 'up', bounce: 0.9 }, f); P(A1, { pos: c, expr: 'laugh', arms: 'wave', bounce: 0.9 }, f);
      for (const C of [A4, A2, A1]) C.root.rotation.y = Math.PI;
      K.move(K.frame([a, b], { yaw: Math.PI + 0.15, h: 3.0, lookY: 1.9, pitch: 0.08, push: 0.85 }), K.frame([a, b], { yaw: Math.PI - 0.05, h: 3.0, lookY: 1.9, pitch: 0.05, push: 0.76 }), u(14), 0.7, f); K.focusOn(add(STAGE, [0, 1.6, 3.8])); break; }
    case 15: { // finished the play as he could... hours later he died at home
      const v = u(15);
      if (v < 0.5) { const p = add(STAGE, [0, SH, -0.7]); crowd(t, true); SG.enf.visible = true; P(MO, { pos: p, yaw: 0, expr: 'tired', armsOverride: BOW, lean: 0.4, tremble: 1, sweat: true }, f);
        K.move(K.frame([p], { yaw: 0.2, h: 2.8, lookY: 1.9, pitch: -0.04, push: 0.9 }), K.frame([p], { yaw: 0.1, h: 2.8, lookY: 1.9, pitch: -0.05, push: 0.8 }), v / 0.5, 0.5, f); K.focusOn(add(p, [0, 2, 0])); }
      else { K.preset('night', { exposure: 1.2 }); K.grade.sat.value = 0.9; SG.y73.visible = true; hatBed.position.set(...add(HOME, [-1.4, 1.05, -3.3]));
        P(F1, { pos: add(HOME, [0.6, 0, -1.6]), yaw: -0.7, expr: 'sad', arms: 'down', look: [0, -0.4] }, f);
        K.move({ p: add(HOME, [1.4, 2.4, 2.4]), l: add(HOME, [-1.2, 1.2, -3.0]), fov: 46 }, { p: add(HOME, [0.9, 2.2, 1.4]), l: add(HOME, [-1.3, 1.1, -3.1]), fov: 44 }, (v - 0.5) / 0.5, 0.3, f); K.focusOn(add(HOME, [-1.3, 1.1, -3.2])); }
      break; }
    case 16: { // he mocked doctors... died playing a sick man: the two stage doctors bow their top hats over the empty armchair
      K.preset('candle', { exposure: 1.0 }); SG.enf.visible = true; blanket.position.set(...add(S0, [0, 0.75, 0.1])); blanket.rotation.x = -0.6;
      const a = add(STAGE, [-1.2, SH, -1.4]), b = add(STAGE, [1.2, SH, -1.4]);
      P(D1, { pos: a, yaw: 0.5, expr: 'sad', armsOverride: BOW, lean: 0.35 }, f); P(D2, { pos: b, yaw: -0.5, expr: 'sad', armsOverride: BOW, lean: 0.35 }, f);
      K.move(K.frame([a, b, S0], { yaw: 0.0, h: 3.0, lookY: 1.8, pitch: -0.04, push: 0.95 }), K.frame([a, b, S0], { yaw: 0.0, h: 3.0, lookY: 1.8, pitch: -0.05, push: 0.82 }), u(16), 0.3, f); K.focusOn(add(S0, [0, 1.6, 0])); break; }
    default: { // loop to hook
      const v = u(17); crowd(t, true); argan(f, t, { expr: 'shock', collapse: 0.35 + 0.25 * Math.sin(t * 5) ** 2, tremble: 2 }); puffs(t, add(S0, [0, 2.3, 0.2]));
      K.move({ p: add(STAGE, [0.4, 2.2, 3.6]), l: add(S0, [0, 1.9, 0]), fov: 44 }, { p: add(STAGE, [0.8, 2.1, 4.6]), l: add(S0, [0, 1.9, 0]), fov: 46 }, v, 0.8, f); K.focusOn(add(S0, [0, 1.8, 0]));
    }
  }
}
