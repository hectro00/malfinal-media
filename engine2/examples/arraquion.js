// VID-016 — Arraquión (Olimpia, 564 a. C.): pankration final; choked from behind, he twisted the rival's foot; the rival gave up; Arrhichion was already dead and was crowned champion. No gore.
export let FRAMES = 2100;
let ext, lock, SG = {}, K, T, AR, RV, J1, J2, TR, W1, W2, fans = [], stick, stick2, wreath, wreathHang = [], foot, hand, stars = [], bell, crossX;
const ARENA = [0, 0, 0], GYM = [200, 0, 0], POD = [400, 0, 0];
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
const SKIN = 0xf2c9a0;

function makeWreath(parent) {
  const g = new K.THREE.Group();
  const ring = new K.THREE.Mesh(new K.THREE.TorusGeometry(0.33, 0.035, 8, 32), K.std(0x4a6a1e)); ring.rotation.x = Math.PI / 2; g.add(ring);
  for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2; const l = K.sph(0.07, i % 2 ? 0x6a9a2a : 0x8ab83a, [Math.cos(a) * 0.34, 0.02, Math.sin(a) * 0.34], { parent: g }); l.scale.set(1.6, 0.5, 0.8); l.rotation.y = -a; }
  (parent || K.scene).add(g); return g;
}
function column(pos, h = 6, col = 0xf2ead8) {
  K.cyl(0.42, 0.48, h, col, add(pos, [0, h / 2, 0]), { seg: 16 });
  K.box(1.1, 0.25, 1.1, col, add(pos, [0, h + 0.12, 0])); K.cyl(0.55, 0.45, 0.2, col, add(pos, [0, h - 0.05, 0]));
  K.box(1.1, 0.2, 1.1, col, add(pos, [0, 0.1, 0]));
}
function fan(pos, col) { const g = new K.THREE.Group(); K.cyl(0.22, 0.26, 0.6, col, [0, 0.3, 0], { parent: g }); K.sph(0.26, 0xfffdf8, [0, 0.85, 0], { parent: g }); g.position.set(...pos); K.scene.add(g); fans.push({ g, y: pos[1], ph: Math.random() * 6 }); }

export async function build(k) {
  K = k; await K.preloadEnvs(); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  AR = C(K.scene, { shirt: 0xc23a2a, belt: 0xe0b040, hair: 0x3a2414, seed: 1 });
  RV = C(K.scene, { shirt: 0x24366e, belt: 0x8a8a8a, hair: 0x15100c, seed: 2 });
  J1 = C(K.scene, { shirt: 0x6a2a8a, cape: 0xe8dcc0, hair: 0x9a9a9a, seed: 3 });
  J2 = C(K.scene, { shirt: 0x6a2a8a, cape: 0xe8dcc0, hair: 0x5a3418, seed: 4 });
  TR = C(K.scene, { shirt: 0x2a7a5a, buttons: 0xe0b040, hair: 0x2a1a10, mustache: true, seed: 5 });
  W1 = C(K.scene, { shirt: 0x3a8a3a, belt: 0x2a1a10, hair: 0x8a5a2a, seed: 6 });
  W2 = C(K.scene, { shirt: 0xe08a20, belt: 0x2a1a10, hair: 0x2a1a10, seed: 7 });
  stick = K.cyl(0.03, 0.03, 1.4, 0x7a4a24, [0, -99, 0]); stick2 = K.cyl(0.03, 0.03, 1.4, 0x7a4a24, [0, -99, 0]);
  J1.hold(stick, [0, -0.55, 0.02], [0, 0, 0]); J2.hold(stick2, [0, -0.05, 0.05], [Math.PI / 2, 0, 0]);
  wreath = makeWreath(); wreath.position.y = -99;
  ext = new K.THREE.Group(); K.cyl(0.026, 0.026, 0.45, 0x16121a, [0, -0.22, 0], { parent: ext }); K.sph(0.1, 0x16121a, [0, -0.47, 0], { parent: ext }); ext.position.y = -0.02; RV.armL.end.add(ext);

  // ---------------- ARENA (Olympia stadium, noon, ochre sand) ----------------
  const sand = K.tex(256, 256, (g, w, h) => { g.fillStyle = '#d9a95c'; g.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { g.fillStyle = ['#c8954a', '#e6b96c', '#cf9d52'][i % 3]; g.fillRect(Math.random() * w, Math.random() * h, 3, 3); } }, [10, 10]);
  K.plane(80, 80, K.std(0xffffff, { map: sand }), add(ARENA, [0, 0.01, 0]));
  const pit = K.tex(256, 256, (g, w, h) => { g.fillStyle = '#b8783a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 700; i++) { g.fillStyle = ['#a86a30', '#c88a48'][i % 2]; g.fillRect(Math.random() * w, Math.random() * h, 4, 2); } }, [3, 3]);
  K.plane(9, 9, K.std(0xffffff, { map: pit }), add(ARENA, [0, 0.03, 0]));
  for (const [x, z, w, d] of [[0, -4.6, 9.4, 0.25], [0, 4.6, 9.4, 0.25], [-4.6, 0, 0.25, 9.4], [4.6, 0, 0.25, 9.4]]) K.box(w, 0.25, d, 0xf2ead8, add(ARENA, [x, 0.12, z]));
  // stands: stepped embankment on three sides, packed with fans
  const cols = [0xc23a2a, 0x2a6aa8, 0xe0b040, 0x3a8a3a, 0x8a2a6a, 0xe08a20, 0xf2ead8];
  for (let r = 0; r < 4; r++) {
    K.box(30, 0.7, 1.6, 0xa8804a, add(ARENA, [0, 0.35 + r * 0.7, -8 - r * 1.6]));
    for (const s of [-1, 1]) K.box(1.6, 0.7, 24, 0xa8804a, add(ARENA, [s * (9 + r * 1.6), 0.35 + r * 0.7, -1]));
    for (let i = 0; i < 18; i++) fan(add(ARENA, [-13 + i * 1.5 + (r % 2) * 0.6, 0.7 + r * 0.7, -8 - r * 1.6]), cols[(i + r) % 7]);
    for (const s of [-1, 1]) for (let i = 0; i < 12; i++) fan(add(ARENA, [s * (9 + r * 1.6), 0.7 + r * 0.7, -11 + i * 1.6 + (r % 2) * 0.5]), cols[(i * 3 + r) % 7]);
  }
  // temple behind the stands
  for (let i = 0; i < 8; i++) column(add(ARENA, [-10.5 + i * 3, 2.8, -16]), 7);
  K.box(25, 0.8, 3, 0xf2ead8, add(ARENA, [0, 10.3, -16])); 
  K.box(25, 1.8, 0.3, 0xc8503a, add(ARENA, [0, 11.5, -15.2]));
  for (let i = 0; i < 8; i++) await K.placeH(`nature_pack/CommonTree_${(i % 5) + 1}`, add(ARENA, [(i % 2 ? 1 : -1) * (16 + (i % 3) * 3), 0, -14 + i * 3]), i, 6, { tint: 0x9ab07a });
  K.sign('OLIMPIA', add(ARENA, [0, 5.6, -14.4]), { w: 5, h: 1.2, bg: '#1e5a8a', border: '#f2ead8' });
  SG.camp = K.sign('CAMPEÓN', add(ARENA, [0.3, 3.9, -4.9]), { w: 3.2, h: 0.95, bg: '#b8301e' });
  SG.y2500 = K.sign('2500 AÑOS', add(ARENA, [3.6, 3.6, -9.2]), { w: 3.4, h: 1.0, bg: '#1e5a8a', border: '#f2ead8' });
  SG.reg = K.sign('SIN REGLAS', add(ARENA, [-0.3, 3.4, -3.2]), { w: 2.8, h: 0.9, bg: '#2a1a10' });
  SG.nm = K.sign('NO MORDER', add(ARENA, [3.3, 3.4, 0.4]), { w: 2.2, h: 0.75, bg: '#e8e2d4', fg: '#b8301e', border: '#b8301e', rotY: 0.45 });
  SG.no = K.sign('NO OJOS', add(ARENA, [3.3, 2.55, 0.4]), { w: 2.2, h: 0.75, bg: '#e8e2d4', fg: '#b8301e', border: '#b8301e', rotY: 0.45 });
  SG.fin = K.sign('FINAL', add(ARENA, [1.6, 3.6, -4.9]), { w: 2.4, h: 0.95, bg: '#e0b040', fg: '#2a1a10', border: '#2a1a10' });
  SG.nun = K.sign('NUNCA SE RINDIÓ', add(ARENA, [-9.5, 3.7, 2.0]), { w: 2.3, h: 0.7, bg: '#2a7a5a', rotY: Math.PI / 2 });
  // "no bell" prop: a bell with a red X
  bell = await K.placeH('medieval_village_pack/Bell', add(ARENA, [-5.6, 0, 3.0]), 0.5, 1.6);
  crossX = new K.THREE.Group(); for (const s of [-1, 1]) { const b = K.box(1.6, 0.18, 0.08, 0xd8201a, [0, 0, 0], { parent: crossX, emissive: 0x801010, emissiveIntensity: 0.4 }); b.rotation.z = s * 0.785; } crossX.position.set(...add(ARENA, [-5.6, 0.85, 3.6])); crossX.rotation.y = 0.5; K.scene.add(crossX);
  SG.camp2 = K.sign('SIN CAMPANA', add(ARENA, [-5.6, 2.2, 2.6]), { w: 2.4, h: 0.7, bg: '#2a1a10', rotY: 0.5 });
  // big macro foot + hand (line 13)
  foot = new K.THREE.Group(); const sole = K.sph(0.5, SKIN, [0, 0, 0], { parent: foot }); sole.scale.set(0.8, 0.55, 1.6); for (let i = 0; i < 5; i++) { const t = K.sph(0.12 - i * 0.012, SKIN, [-0.26 + i * 0.13, 0.04, 0.78 - Math.abs(i - 1) * 0.04], { parent: foot }); }
  K.cyl(0.32, 0.36, 1.2, SKIN, [0, 0.6, -0.45], { parent: foot }); foot.position.set(...add(ARENA, [30, 0.5, 0])); K.scene.add(foot);
  hand = new K.THREE.Group(); const palm = K.sph(0.42, 0xfffdf8, [0, 0, 0], { parent: hand }); palm.scale.set(1.2, 0.8, 1.1); for (let i = 0; i < 4; i++) K.sph(0.13, 0xfffdf8, [-0.45, -0.1, -0.3 + i * 0.2], { parent: hand }); K.cyl(0.08, 0.08, 1.4, 0x16121a, [0.7, 0, 0], { parent: hand }).rotation.z = Math.PI / 2; K.scene.add(hand);
  lock = new K.THREE.Group(); const ab = K.cyl(0.045, 0.045, 0.8, 0x16121a, [0.12, 0.6, 0.8], { parent: lock }); ab.rotation.z = Math.PI / 2 + 0.15; K.sph(0.07, 0x16121a, [-0.26, 0.55, 0.8], { parent: lock });
  for (const s2 of [-1, 1]) { const lb = K.cyl(0.05, 0.05, 0.75, 0x16121a, [0.05, 0.28, 0.82], { parent: lock }); lb.rotation.z = Math.PI / 2 + s2 * 0.28; K.sph(0.09, 0x16121a, [-0.3, 0.28 + s2 * 0.1, 0.84], { parent: lock }).scale.set(0.85, 0.55, 1.5); } K.scene.add(lock);
  for (let i = 0; i < 8; i++) stars.push(K.sph(0.07, 0xfff0a0, [0, -99, 0], { emissive: 0xffe060, emissiveIntensity: 6 }));
  K.plane(10, 10, K.std(0xd9a95c), add(ARENA, [30, 0.0, 0]));

  // ---------------- GYM (palaestra interior, terracotta + meander) ----------------
  const fl = K.tex(256, 256, (g, w, h) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? '#e8dcc0' : '#c8b088'; g.fillRect(x * 32, y * 32, 32, 32); } }, [6, 6]);
  K.plane(20, 16, K.std(0xffffff, { map: fl }), add(GYM, [0, 0.01, 0]));
  const wl = K.tex(512, 256, (g, w, h) => { g.fillStyle = '#b8502a'; g.fillRect(0, 0, w, h); g.fillStyle = '#2a1a10'; g.fillRect(0, 196, w, 40); g.strokeStyle = '#e0b040'; g.lineWidth = 6; for (let x = 0; x < w; x += 40) { g.beginPath(); g.moveTo(x, 230); g.lineTo(x, 202); g.lineTo(x + 30, 202); g.lineTo(x + 30, 222); g.lineTo(x + 12, 222); g.lineTo(x + 12, 212); g.stroke(); } }, [3, 1]);
  const wm = K.std(0xffffff, { map: wl }); K.plane(20, 8, wm, add(GYM, [0, 4, -6]), [0, 0, 0]); K.plane(16, 8, wm, add(GYM, [-8, 4, 0]), [0, Math.PI / 2, 0]); K.plane(16, 8, wm, add(GYM, [8, 4, 0]), [0, -Math.PI / 2, 0]);
  for (const x of [-5, 5]) column(add(GYM, [x, 0, -4.6]), 5.5);
  for (const x of [-1.4, 1.4]) { const w = makeWreath(); w.rotation.x = Math.PI / 2; w.position.set(...add(GYM, [x * 0.85, 3.0, -5.9])); w.scale.setScalar(1.3); wreathHang.push(w); }
  K.sign('2 VECES', add(GYM, [0, 4.1, -5.9]), { w: 2.8, h: 0.9, bg: '#2a1a10' });
  for (const x of [-3.2, 3.2]) await K.placeH('modular_dungeon_1/Vase', add(GYM, [x, 0, -5.2]), 0, 1.3);
  K.pointLight(0xffb870, 10, add(GYM, [0, 4, 0]), 16); K.pointLight(0xffd0a0, 8, add(POD, [1.5, 3.2, 2.5]), 9);
  // ---------------- PODIUM (sunset, temple) ----------------
  K.plane(60, 60, K.std(0xc8a070), add(POD, [0, 0.01, 0]));
  K.box(4, 0.6, 2.4, 0xf2ead8, add(POD, [0, 0.3, -1]));
  for (let i = 0; i < 6; i++) column(add(POD, [-7.5 + i * 3, 0, -6]), 6.5);
  K.box(18, 0.8, 2, 0xf2ead8, add(POD, [0, 6.9, -6]));
  K.sign('3 VECES', add(POD, [0, 5.4, -5.4]), { w: 2.8, h: 0.9, bg: '#2a1a10' });
  for (let i = 0; i < 4; i++) await K.placeH(`nature_pack/CommonTree_${i + 1}`, add(POD, [(i % 2 ? 1 : -1) * (10 + i), 0, -8 + i]), i, 6, { tint: 0x9ab07a });
  for (let i = 0; i < 14; i++) fan(add(POD, [-6.5 + i, 0, -3.6 - (i % 2) * 0.8]), cols[i % 7]);
}

function hideAll() {
  for (const c of [AR, RV, J1, J2, TR, W1, W2]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); }
  for (const s of stars) s.position.y = -99;
  if (wreath.parent !== K.scene) { wreath.parent.remove(wreath); K.scene.add(wreath); }
  wreath.position.set(0, -99, 0); wreath.rotation.set(0, 0, 0); wreath.scale.setScalar(1);
  stick.visible = stick2.visible = true; for (const g of Object.values(SG)) g.visible = false; crossX.visible = false;
  foot.rotation.set(0, 0, 0); lock.visible = false; ext.visible = false; hand.position.set(0, -99, 0); hand.rotation.set(0, 0, 0);
}
function cheer(t, amp = 1) { for (const F of fans) F.g.position.y = F.y + Math.abs(Math.sin(t * 7 + F.ph)) * 0.18 * amp; }
function crown(C, y = 0.2) { wreath.position.set(0, y, 0); wreath.scale.setScalar(0.72); C.head.add(wreath); }
// AR held up by judge J1 (hook + loop)
function hookPose(f, t, drop = 0) {
  const a = add(ARENA, [0, 0, 0]), j = add(ARENA, [0.85, 0, -0.2]);
  P(AR, { pos: a, yaw: 0.15, expr: 'out', blink: 0, headTilt: 0.62, armsOverride: (C) => { C.armR.a.rotation.set(0, 0, 0.1); C.armL.a.rotation.set(-0.2, 0, 2.7 - drop * 2.6); C.armL.b.rotation.set(0, 0, 0); } }, f);
  P(J1, { pos: j, yaw: -0.5, expr: drop > 0 ? 'shock' : 'proud', talk: drop > 0 ? 0 : 0.6, armsOverride: (C) => { C.armR.a.rotation.set(-2.7 + drop * 2.2, 0, -0.5); C.armR.b.rotation.set(0, 0, 0); } }, f);
  crown(AR); stick.visible = false;
}
// chokehold: RV behind AR, one arm around the neck; legs crossed around the waist. Both seated on the sand.
function choke(f, t, o = {}) {
  const a = add(ARENA, [0, -0.48, 0.6]), r = add(ARENA, [0.62, -0.48, 0.05]);
  P(AR, { pos: a, yaw: 0, sit: 1, lean: 0.15, expr: o.arExpr || 'scared', sweat: true, blush: o.blush ?? true, tremble: o.tremble ?? 2, blink: o.arBlink, headTilt: o.tilt || 0, arms: o.arArms || 'reach', armsOverride: o.arOv }, f);
  P(RV, { pos: r, yaw: 0, sit: 1, lean: 0.25, expr: o.rvExpr || 'angry', talk: o.rvTalk || 0, armsOverride: o.rvOv || ((C) => { C.armR.a.rotation.set(-1.5, 0, 0.55); C.armR.b.rotation.set(0, 0, 1.4); C.armL.a.rotation.set(-1.2, 0, -0.5); C.armL.b.rotation.set(0, 0, -1.2); C.legL.a.rotation.set(-1.45, 0, 0.75); C.legR.a.rotation.set(-1.45, 0, -0.75); C.legL.b.rotation.set(0, 0, -1.3); C.legR.b.rotation.set(0, 0, 1.3); }) }, f);
  for (const C of [AR, RV]) { C.legL.b.rotation.x = 0; C.legR.b.rotation.x = 0; } lock.visible = !o.noLock; lock.position.set(...ARENA); AR.legL.a.rotation.set(-1.45, 0, 0.15); AR.legR.a.rotation.set(-1.45, 0, -0.15);
}

export function frame(f, k) {
  hideAll(); const ph = K.at(f), t = f / 30, u = (i, j) => K.u(f, i, j);
  K.preset('day', { exposure: 1.1 }); cheer(t, 0.4);
  const A0 = ARENA; const SHOW = { camp: [0, 1, 15, 18], y2500: [2], reg: [3], nm: [4], no: [4], fin: [7, 8], nun: [11], camp2: [10] }; for (const n in SHOW) if (SHOW[n].includes(ph)) SG[n].visible = true; crossX.visible = ph === 10;
  switch (ph) {
    case 0: { // HOOK: limp champion held up by the judge, wreath, CAMPEÓN sign, crowd roaring
      cheer(t, 1.3); hookPose(f, t);
      K.move(K.frame([add(A0, [0, 0, 0]), add(A0, [0.85, 0, -0.2])], { yaw: 0.1, pitch: -0.06, h: 3.4, lookY: 2.3, push: 0.95, pad: 1.35 }), K.frame([add(A0, [0, 0, 0]), add(A0, [0.85, 0, -0.2])], { yaw: 0.0, pitch: -0.08, h: 3.4, lookY: 2.4, push: 0.85, pad: 1.35 }), u(0), 0.8, f); K.focusOn(add(A0, [0.2, 2.2, 0])); break; }
    case 1: { // the judge lets go: the arm drops, crowd freezes
      const v = u(1), drop = K.ease(Math.min(1, v * 2.5)); hookPose(f, t, drop); cheer(t, 0);
      K.move(K.frame([A0], { yaw: 0.1, h: 2.9, lookY: 2.3, push: 0.66, pitch: 0.0 }), K.frame([A0], { yaw: 0.05, h: 2.9, lookY: 2.35, push: 0.54 }), v, 0.6, f); K.focusOn(add(A0, [0, 2.3, 0])); break; }
    case 2: { // 2500 years ago, Greece, pankration: crane over the packed stadium
      cheer(t, 1.2); P(W1, { pos: add(A0, [-0.9, 0, 0]), yaw: 1.2, arms: 'fists', expr: 'angry' }, f); P(W2, { pos: add(A0, [0.9, 0, 0]), yaw: -1.2, arms: 'fists', expr: 'angry' }, f);
      K.move({ p: add(A0, [6, 14, 20]), l: add(A0, [0, 3, -8]), fov: 48 }, { p: add(A0, [2.5, 3.4, 9]), l: add(A0, [0.5, 2.6, -6]), fov: 46 }, u(2), 0.4, f); K.focusOn(add(A0, [0, 2, 0])); K.lens.aperture.value = 0.2; break; }
    case 3: { // almost no rules: punch, kick
      const v = u(3), hit = Math.sin(v * Math.PI * 3); cheer(t, 1);
      P(W1, { pos: add(A0, [-0.55, 0, 0]), yaw: 1.4, expr: 'angry', arms: 'fists', lean: v > 0.5 ? -0.25 : 0.15, armsOverride: (C) => { if (v > 0.5) { C.legR.a.rotation.set(-1.55, 0, 0); C.legR.b.rotation.set(0, 0, 0); } else { C.armR.a.rotation.set(-1.55, 0, -0.1); C.armR.b.rotation.set(0, 0, 0); } } }, f);
      P(W2, { pos: add(A0, [0.55 + (v > 0.5 ? 0.25 : 0), 0, 0]), yaw: -1.3, expr: v > 0.3 ? 'shock' : 'angry', arms: 'flail', lean: -0.15 }, f);
      if ((v > 0.28 && v < 0.36) || (v > 0.7 && v < 0.78)) K.grade.flash.value = 0.35;
      stars.forEach((s, i) => { if (v > 0.3) { const a = t * 5 + i; s.position.set(...add(A0, [0.7 + Math.cos(a) * 0.45, 2.75, Math.sin(a) * 0.45])); } });
      K.move(K.frame([add(A0, [-0.7, 0, 0]), add(A0, [0.7, 0, 0])], { yaw: 0.2, pitch: -0.02, h: 4.0, lookY: 2.4, push: 1.0 }), K.frame([add(A0, [-0.7, 0, 0]), add(A0, [0.7, 0, 0])], { yaw: 0.12, pitch: -0.03, h: 4.0, lookY: 2.4, push: 0.92 }), v, 1.2, f); K.focusOn(add(A0, [0, 2, 0])); break; }
    case 4: { // only two bans: no biting, no eyes — W1 opens mouth to bite, J2 points at the signs
      const v = u(4); const p1 = add(A0, [3.6, 0, 1.4]), p2 = add(A0, [4.4, 0, 2.2]);
      P(W1, { pos: p1, yaw: 0.9, expr: v < 0.5 ? 'shock' : 'scared', arms: 'reach', talk: v < 0.5 ? 1 : 0, tremble: v < 0.5 ? 0 : 2 }, f);
      P(J2, { pos: p2, yaw: -0.6, expr: 'angry', arms: 'point', talk: 0.7 }, f); stick2.visible = false;
      K.move(K.frame([p1, p2], { yaw: 0.4, h: 4.0, lookY: 2.5, pitch: -0.03, push: 0.95, pad: 1.2 }), K.frame([p1, p2], { yaw: 0.5, h: 4.0, lookY: 2.5, pitch: -0.05, push: 0.88, pad: 1.2 }), v, 0.6, f); K.focusOn(add(A0, [4.6, 1.6, 1.4])); break; }
    case 5: { // judges with a stick hit the cheater — comic whack + stars
      const v = u(5); const p1 = add(A0, [-1.0, 0, 1.0]), p2 = add(A0, [-0.1, 0, 0.8]);
      const k2 = Math.max(0, Math.sin(v * Math.PI * 4));
      P(J1, { pos: p1, yaw: 1.2, expr: 'angry', arms: 'hammer', armsOverride: (C) => { C.armR.a.rotation.set(-2.6 + 1.8 * k2, 0, -0.3); } }, f);
      P(W2, { pos: p2, yaw: 1.3, lean: k2 > 0.8 ? 0.25 : 0, expr: k2 > 0.8 ? 'shock' : 'scared', arms: 'flail', bounce: k2 > 0.8 ? 1 : 0, tremble: 2 }, f);
      if (k2 > 0.9) K.grade.flash.value = 0.25;
      stars.forEach((s, i) => { const a = t * 5 + i * 0.8; s.position.set(...add(p2, [Math.cos(a) * 0.5, 2.7, Math.sin(a) * 0.5])); });
      K.move(K.frame([p1, p2], { yaw: 0.6, h: 4.0, lookY: 2.3, pitch: -0.02, push: 0.9 }), K.frame([p1, p2], { yaw: 0.45, h: 4.0, lookY: 2.4, pitch: -0.03, push: 0.92 }), v, 0.8, f); K.focusOn(add(A0, [-0.5, 2, 0.9])); break; }
    case 6: { // Arraquión, the champion, already won twice: GYM, proud, 2 wreaths on the wall
      K.preset('interior', { exposure: 1.2 }); const p = add(GYM, [0, 0, -3.6]);
      P(AR, { pos: p, yaw: 0, expr: 'proud', arms: 'akimbo', bounce: 0 }, f);
      K.move(K.frame([p], { yaw: 0.3, pitch: -0.08, h: 4.0, lookY: 2.6, push: 0.72 }), K.frame([p], { yaw: 0.15, pitch: -0.1, h: 4.0, lookY: 2.6, push: 0.62 }), u(6), 0.5, f); K.focusOn(add(p, [0, 2.4, 0])); break; }
    case 7: { // but his third final was the strangest: back in the arena, FINAL sign, punch-in on his worried face
      K.preset('day', { exposure: 1.0 }); K.grade.vig.value = 0.55; const p = add(A0, [1.2, 0, -1.2]);
      P(AR, { pos: p, yaw: -0.2, expr: 'worried', arms: 'fists', look: [0.3, 0] }, f);
      K.move(K.frame([p], { yaw: -0.25, h: 3.6, lookY: 2.6, push: 0.85, pitch: -0.05 }), K.frame([p], { yaw: -0.15, h: 3.2, lookY: 2.5, push: 0.62 }), K.ease(u(7)), 0.4, f); K.focusOn(add(p, [0, 2.3, 0])); break; }
    case 8: { // the rival jumps him from behind
      const v = u(8); cheer(t, 1.2); const p = add(A0, [0, 0, 0.6]); const j = K.ease(Math.min(1, v * 1.6));
      P(AR, { pos: p, yaw: 0.2, expr: v > 0.5 ? 'shock' : 'neutral', arms: v > 0.5 ? 'flail' : 'fists' }, f);
      P(RV, { pos: add(p, [1.6 - j * 1.55, Math.sin(j * Math.PI) * 0.8, -1.6 + j * 1.15]), yaw: 0.2 - j * 0.6, expr: 'angry', arms: 'reach', run: j < 1, walk: t * 2 }, f);
      K.move(K.frame([p, add(p, [1.2, 0, -1.2])], { yaw: 0.5, h: 3.0, pitch: -0.05, push: 0.82 }), K.frame([p, add(p, [0.4, 0, -0.6])], { yaw: 0.35, h: 3.0, pitch: -0.06, push: 0.74 }), v, 1.4, f); K.focusOn(add(p, [0, 2, 0])); break; }
    case 9: { // legs around the waist, arm around the neck: low close from the sand
      cheer(t, 1); choke(f, t, { tremble: 3 });
      K.move(K.frame([add(A0, [0, 0, 0.6]), add(A0, [0.42, 0, 0.2])], { yaw: 0.7, h: 2.6, lookY: 1.05, pitch: 0.06, push: 1.05 }), K.frame([add(A0, [0, 0, 0.6]), add(A0, [0.42, 0, 0.2])], { yaw: 0.55, h: 2.6, lookY: 1.05, pitch: 0.05, push: 0.95 }), u(9), 0.9, f); K.focusOn(add(A0, [0, 1.6, 0.6])); break; }
    case 10: { // no bell: crossed-out bell, then his fist trembling, NOT raising
      const v = u(10);
      if (v < 0.45) { K.move({ p: add(A0, [-4.6, 1.9, 8.2]), l: add(A0, [-5.6, 1.6, 2.8]), fov: 44 }, { p: add(A0, [-4.9, 1.8, 7.4]), l: add(A0, [-5.6, 1.6, 2.8]), fov: 44 }, v / 0.45, 0.4, f); K.focusOn(add(A0, [-5.6, 1.4, 3.0])); choke(f, t); }
      else { choke(f, t, { arArms: 'fists', tremble: 4, arOv: (C) => { C.armL.a.rotation.set(-1.0 + Math.sin(t * 20) * 0.08, 0, 0.6); C.armL.b.rotation.set(-1.6, 0, 0); } });
        K.move(K.frame([add(A0, [0, 0, 0.6])], { yaw: -0.4, h: 2.2, lookY: 1.05, pitch: 0.02, push: 0.8 }), K.frame([add(A0, [0, 0, 0.6])], { yaw: -0.3, h: 2.2, lookY: 1.05, pitch: 0.0, push: 0.7 }), (v - 0.45) / 0.55, 1.0, f); K.focusOn(add(A0, [0, 1.5, 0.6])); }
      break; }
    case 11: { // the trainer shouts from the stands: "what a fine epitaph: he never gave up!"
      cheer(t, 1); const p = add(A0, [-9.0, 0.7, 2.0]);
      P(TR, { pos: p, yaw: Math.PI / 2, expr: 'shock', talk: 1, bounce: 0.4, armsOverride: (C) => { C.armL.a.rotation.set(-2.2, 0, 0.45); C.armL.b.rotation.set(-1.9, 0, 0); C.armR.a.rotation.set(-2.2, 0, -0.45); C.armR.b.rotation.set(-1.9, 0, 0); } }, f);
      K.move(K.frame([p], { yaw: Math.PI / 2 + 0.35, h: 3.6, lookY: 2.4, pitch: -0.06, push: 0.86 }), K.frame([p], { yaw: Math.PI / 2 + 0.2, h: 3.4, lookY: 2.4, pitch: -0.08, push: 0.72 }), u(11), 0.8, f); K.focusOn(add(p, [0, 2.2, 0])); break; }
    case 12: { // then he did something desperate: dark punch-in on his eyes
      K.preset('day', { exposure: 0.85 }); K.grade.vig.value = 0.65; cheer(t, 0); choke(f, t, { arExpr: 'angry', tremble: 1, blush: true });
      K.move(K.frame([add(A0, [0, 0, 0.6])], { yaw: 0.3, h: 2.4, lookY: 1.45, push: 0.8, pitch: 0.02 }), K.frame([add(A0, [0, 0, 0.6])], { yaw: 0.2, h: 2.4, lookY: 1.45, push: 0.66, pitch: 0.03 }), K.ease(u(12)), 0.5, f); K.focusOn(add(A0, [0, 1.8, 0.6])); break; }
    case 13: { // macro: the hand grabs the rival's foot and twists it, stars of pain
      const v = u(13); const fp = add(ARENA, [30, 0.5, 0]); const tw = K.ease(Math.max(0, (v - 0.35) / 0.4));
      foot.rotation.set(0, 0, -tw * 1.4); hand.position.set(...add(fp, [0.95 - Math.min(1, v * 2.5) * 0.3, 0.45, 0.1])); hand.rotation.z = -tw * 1.4;
      if (tw > 0.95) stars.forEach((s, i) => { const a = t * 6 + i * 0.8; s.position.set(...add(fp, [Math.cos(a) * 0.9, 1.2 + Math.sin(a * 2) * 0.1, Math.sin(a) * 0.9])); });
      if (v > 0.74 && v < 0.8) K.grade.flash.value = 0.45;
      K.move({ p: add(fp, [1.6, 1.4, 3.4]), l: add(fp, [0, 0.4, 0.2]), fov: 44 }, { p: add(fp, [1.2, 1.1, 2.6]), l: add(fp, [0, 0.4, 0.2]), fov: 42 }, v, 0.8, f); K.focusOn(add(fp, [0, 0.4, 0.2])); break; }
    case 14: { // the rival screams and raises his hand: crowd jumps up
      const v = u(14); cheer(t, 1.5);
      choke(f, t, { arExpr: 'out', arArms: 'down', tremble: 0, blush: false, rvExpr: 'shock', rvTalk: 1, rvOv: (C) => { C.armR.a.rotation.set(-1.5, 0, 0.55); C.armR.b.rotation.set(0, 0, 1.4); C.armL.a.rotation.set(-0.2, 0, 0.3 + 2.0 * K.ease(Math.min(1, v * 2))); C.armL.b.rotation.set(0, 0, 0.4 * K.ease(Math.min(1, v * 2))); ext.visible = true; C.legL.a.rotation.set(-1.45, 0, 0.75); C.legR.a.rotation.set(-1.45, 0, -0.75); C.legL.b.rotation.set(0, 0, -1.3); C.legR.b.rotation.set(0, 0, 1.3); } });
      for (const F of fans) F.g.position.y = F.y + 0.25 + Math.abs(Math.sin(t * 9 + F.ph)) * 0.25; K.move(K.frame([add(A0, [0.7, 0, 0.35])], { yaw: 0.1, h: 3.2, lookY: 1.3, pitch: -0.03, push: 0.85 }), K.frame([add(A0, [0.7, 0, 0.35])], { yaw: 0.05, h: 3.2, lookY: 1.35, pitch: -0.05, push: 0.78 }), v, 1.0, f); K.focusOn(add(A0, [0, 1.8, 0.4])); break; }
    case 15: { // the judges declare Arraquión winner: judges in the foreground pointing, CAMPEÓN sign
      cheer(t, 1.4); const a = add(A0, [0, 0, 0.6]);
      P(AR, { pos: add(a, [0, -0.48, 0]), yaw: 0, sit: 1, lean: 0.1, expr: 'out', headTilt: 0.35 }, f); AR.legL.b.rotation.x = AR.legR.b.rotation.x = 0;
      P(J1, { pos: add(A0, [-0.85, 0, 2.3]), yaw: Math.PI + 0.35, expr: 'proud', arms: 'point', talk: 0.8 }, f); P(J2, { pos: add(A0, [0.85, 0, 2.3]), yaw: Math.PI - 0.35, expr: 'proud', arms: 'point' }, f); stick.visible = stick2.visible = false;
      K.move(K.frame([a, add(A0, [-0.85, 0, 2.3]), add(A0, [0.85, 0, 2.3])], { yaw: 0.0, h: 3.8, lookY: 2.1, pitch: -0.03, push: 0.92 }), K.frame([a, add(A0, [-0.85, 0, 2.3]), add(A0, [0.85, 0, 2.3])], { yaw: -0.06, h: 3.8, lookY: 2.2, pitch: -0.05, push: 0.84 }), u(15), 0.6, f); K.focusOn(add(A0, [0, 1.8, 1.2])); break; }
    case 16: { // only one problem: he wasn't breathing — lying peacefully, judges lean over, worried (no gore)
      cheer(t, 0); K.grade.sat.value = 0.95; const a = add(A0, [0, 0.05, 1.0]);
      P(AR, { pos: a, yaw: 0, fall: 1, expr: 'out' }, f);
      P(J1, { pos: add(A0, [-1.3, 0, -0.3]), yaw: 0.6, expr: 'worried', lean: 0.35 }, f); P(J2, { pos: add(A0, [1.3, 0, -0.1]), yaw: -0.6, expr: 'worried', lean: 0.35, arms: 'shrug' }, f);
      K.move({ p: add(A0, [0.4, 8.6, 3.8]), l: add(A0, [0, 0.4, -0.2]), fov: 46 }, { p: add(A0, [0.2, 6.4, 2.8]), l: add(A0, [0, 0.4, 0.0]), fov: 44 }, u(16), 0.3, f); K.focusOn(add(A0, [0, 0.4, 0.2])); break; }
    case 17: { // they crowned his body — PODIUM at sunset, the wreath lowers onto him, 3 VECES
      K.preset('golden', { exposure: 1.15 }); const v = u(17); const a = add(POD, [0, 0.6, -0.05]);
      P(AR, { pos: a, yaw: 0, sit: 1, expr: 'out', headTilt: 0.3, lean: 0.05 }, f);
      P(J1, { pos: add(POD, [1.0, 0.6, -0.6]), yaw: -0.9, expr: 'sad', arms: 'reach' }, f); stick.visible = false;
      const down = K.ease(Math.min(1, v * 2.2)); if (down < 1) { wreath.scale.setScalar(1.02); wreath.rotation.x = 0.55 * (1 - down); wreath.position.set(...add(a, [0.0, 3.4 - down * 1.4, 0.0])); } else crown(AR, 0.3);
      for (const F of fans) F.g.position.y = F.y;
      K.move(K.frame([a, add(POD, [1.0, 0.6, -0.6])], { yaw: 0.15, h: 4.0, lookY: 2.4, pitch: -0.05, push: 0.95 }), K.frame([a], { yaw: 0.05, h: 3.4, lookY: 2.3, pitch: 0.1, push: 0.82 }), v, 0.4, f); K.focusOn(add(a, [0, 2.3, 0])); break; }
    default: { // nobody plans their end -> loop to the hook
      cheer(t, 1.3); hookPose(f, t);
      K.move(K.frame([A0, add(A0, [0.85, 0, -0.2])], { yaw: 0.0, pitch: -0.08, h: 3.4, lookY: 2.4, push: 0.85, pad: 1.35 }), K.frame([A0, add(A0, [0.85, 0, -0.2])], { yaw: 0.1, pitch: -0.06, h: 3.4, lookY: 2.3, push: 0.95, pad: 1.35 }), u(18), 0.6, f); K.focusOn(add(A0, [0.2, 2.2, 0]));
    }
  }
}
