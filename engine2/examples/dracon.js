// VID-028 — Draco, first lawgiver of Athens (~621 BC; "draconian"). Per the Suda, at the theatre of Aegina his admirers greeted him
// the Greek way, throwing their hats and cloaks on him — so many that he suffocated, and was buried in that same theatre. Legend. No gore.
export let FRAMES = 2200;
const GOLD = 'belfast_sunset_puresky_2k', DAYSKY = 'kloofendal_48d_partly_cloudy_puresky_2k', DUSK = 'qwantani_dusk_2_puresky_2k';
let K, T, DRC, TH, GU, H1, H2, SG = {}, fans = [], items = [], tablet, cabbage, book, boat, sea;
const THEA = [0, 0, 0], ATH = [200, 0, 0], SEA = [400, 0, 0];
const add = (a, b) => a.map((x, i) => x + b[i]);
const P = (c, p, f) => K.poseChar(c, p, f);
const CLR = [0xb8301e, 0x2a6aa8, 0xe0a030, 0x3a8a3a, 0x8a2a6a, 0xf2ead8, 0xd86a2a, 0x1e6a6a];
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function fan(pos, col, a) { const g = new K.THREE.Group(); K.cyl(0.24, 0.3, 0.7, col, [0, 0.55, 0], { parent: g }); K.sph(0.3, 0xe8c8a0, [0, 1.2, 0], { parent: g }); g.position.set(...pos); g.rotation.y = a; K.scene.add(g); fans.push({ g, base: pos.slice(), ph: rnd() * 6, a }); }
function cheer(t, a = 1) { fans.forEach(fa => { fa.g.position.y = fa.base[1] + Math.abs(Math.sin(t * 8 + fa.ph)) * 0.22 * a; fa.g.rotation.z = Math.sin(t * 6 + fa.ph) * 0.14 * a; }); }
const D0 = add(THEA, [0, 0, 0]); // Draco's spot in the orchestra
function makeItem(i) { // half cloaks (draped slabs), half petasos hats (wide brim + crown)
  const g = new K.THREE.Group(); const col = CLR[i % CLR.length];
  if (i % 2) { K.box(1.0, 0.07, 0.75, col, [0, 0, 0], { parent: g, roughness: 0.95 }); K.box(0.9, 0.06, 0.2, col, [0, -0.05, 0.42], { parent: g, roughness: 0.95 }).rotation.x = 0.5; }
  else { K.cyl(0.42, 0.42, 0.04, 0xc8a060 - (i % 3) * 0x101008, [0, 0, 0], { parent: g, roughness: 0.9, seg: 20 }); K.cyl(0.17, 0.2, 0.2, 0xa88040, [0, 0.11, 0], { parent: g, seg: 16 }); }
  K.scene.add(g);
  const r = Math.sqrt(rnd()) * 0.85, an = rnd() * 6.28, lvl = i / 70;
  const land = add(D0, [Math.cos(an) * r * (1 - lvl * 0.5), 0.1 + lvl * 2.0 * (1 - r * 0.5), Math.sin(an) * r * (1 - lvl * 0.5)]);
  return { g, land, rot: [rnd() * 0.5 - 0.25, rnd() * 6.28, rnd() * 0.5 - 0.25], from: null, i };
}
function pile(t, k, inflight = 0.18) { // k in [0,1]: share of the 70 items thrown; each flies ~0.9 s in a high arc from a random fan
  const N = items.length; items.forEach((it, i) => { const ti = i / N; if (ti > k) { it.g.position.set(0, -99, 0); return; }
    const fly = Math.min(1, (k - ti) / inflight); const fr = it.from;
    const p = K.lerp(fr, it.land, fly); p[1] += Math.sin(fly * Math.PI) * 2.6; it.g.position.set(...p);
    it.g.rotation.set(it.rot[0] + (1 - fly) * 8, it.rot[1] + (1 - fly) * 5, it.rot[2]); }); }
function tablet6(base) { const g = new K.THREE.Group(); const m = K.pbr('marble_01', [1, 1]); K.box(1.6, 2.2, 0.25, 0xffffff, [0, 1.1, 0], { parent: g, map: m.map });
  const tx = K.tex(512, 704, (c, w, h) => { c.fillStyle = '#e8e0d0'; c.fillRect(0, 0, w, h); c.fillStyle = '#4a3a2a'; c.font = 'bold 56px serif'; c.fillText('ΝΟΜΟΙ', 160, 80); c.font = '34px serif'; for (let y = 140; y < h - 30; y += 46) c.fillText('ΘΑΝΑΤΟΣ · ΘΑΝΑΤΟΣ', 40, y); });
  K.plane(1.4, 1.95, K.std(0xffffff, { map: tx }), [0, 1.1, 0.13], [0, 0, 0]).removeFromParent(); const face = K.plane(1.4, 1.95, K.std(0xffffff, { map: tx }), [0, 1.1, 0.13], [0, 0, 0]); g.add(face);
  g.position.set(...base); K.scene.add(g); return g; }

export async function build(k) {
  K = k; await K.preloadEnvs(); await K.preloadSkies([GOLD, DAYSKY, DUSK]); T = await K.timing(); FRAMES = Math.ceil(T.duration * 30) + 6;
  const C = K.makeChar;
  DRC = C(K.scene, { shirt: 0xf2ead8, belt: 0xc8a040, cape: 0x2a4a8a, hair: 0xd8d8d8, seed: 41 });
  TH = C(K.scene, { shirt: 0x8a6a3a, belt: 0x3a2a1a, hair: 0x1a1210, mustache: true, seed: 42 });
  GU = C(K.scene, { shirt: 0xb8301e, belt: 0x3a2a1a, hat: 'helmet', hatColor: 0xc8a040, hair: 0x2a1a10, seed: 43 });
  H1 = C(K.scene, { shirt: 0x3a8a3a, belt: 0x3a2a1a, hair: 0x4a2a10, seed: 44 });
  H2 = C(K.scene, { shirt: 0xe0a030, belt: 0x3a2a1a, hair: 0x1a1210, seed: 45 });
  cabbage = K.sph(0.28, 0x6ab84a, [0, -99, 0], { roughness: 0.8 });
  book = await K.placeH('rpg_items_pack/Book1_Open', [0, -99, 0], 0, 0.6).catch(() => null);

  // ---------------- THEATRE of Aegina: stone tiers in a horseshoe, stage with columns, golden sea light ----------------
  const sand = K.pbr('sandstone_blocks_05', [1, 1]);
  K.cyl(5.5, 5.5, 0.12, 0xffffff, add(THEA, [0, 0.06, 0]), { map: K.pbr('stone_tiles_02', [4, 4]).map, seg: 48 });
  K.plane(160, 160, K.pbr('rocky_terrain_02', [30, 30], { tint: 0xc8b088 }), add(THEA, [0, 0.0, 0]));
  for (let r = 0; r < 7; r++) { const R = 6.2 + r * 1.05, y = 0.25 + r * 0.5; const n = 14 + r * 2;
    for (let i = 0; i < n; i++) { const a = -1.35 + 2.7 * i / (n - 1); const b = K.box(2.7 * R / n + 0.12, 0.5, 1.05, 0xffffff, add(THEA, [Math.sin(a) * R, y, Math.cos(a) * R]), { map: sand.map, normalMap: sand.normalMap }); b.rotation.y = a;
      if (r < 6 && i % 1 === 0) fan(add(THEA, [Math.sin(a) * (R + 0.1), y + 0.25, Math.cos(a) * (R + 0.1)]), CLR[(i * 3 + r) % CLR.length], a + Math.PI); } }
  K.box(12, 0.8, 2.6, 0xffffff, add(THEA, [0, 0.4, -6.2]), { map: sand.map });
  for (let i = 0; i < 7; i++) K.cyl(0.28, 0.32, 4.2, 0xf2ead8, add(THEA, [-5.4 + i * 1.8, 2.9, -7.0]), { roughness: 0.6, seg: 16 });
  K.box(12.4, 0.5, 1.0, 0xe8dcc8, add(THEA, [0, 5.2, -7.0])); K.box(12.4, 4.6, 0.3, 0xffffff, add(THEA, [0, 2.9, -7.6]), { map: K.pbr('white_plaster_02', [3, 1], { tint: 0xd8c8a8 }).map });
  for (let i = 0; i < 70; i++) items.push(makeItem(i));
  items.forEach((it, i) => { const fa = fans[(i * 37) % fans.length]; it.from = add(fa.base, [0, 1.6, 0]); });
  K.pointLight(0xffd8a0, 5, add(THEA, [0, 4, -3]), 14); K.pointLight(0xffe0c0, 3, add(THEA, [0, 3, 4]), 12);
  SG.eg = K.sign('EGINA · TEATRO', add(THEA, [0, 6.2, -7.2]), { w: 4.6, h: 0.95, bg: '#1e2a4a', border: '#e0b040' });
  SG.q = K.sign('¿LE HABRÍAS TIRADO TU CHAMARRA?', add(THEA, [0, 6.2, -7.15]), { w: 7.2, h: 1.0, bg: '#d7262a', border: '#ffe9a8' });
  SG.ley = K.sign('SEGÚN LA LEYENDA', add(THEA, [0, 6.2, -7.1]), { w: 4.6, h: 0.95, bg: '#1a1210', border: '#e0b040' });
  SG.tomb = new K.THREE.Group(); K.box(1.0, 0.7, 0.5, 0xffffff, [0, 0.35, 0], { parent: SG.tomb, map: K.pbr('marble_01', [1, 1]).map }); SG.tomb.add(K.sign('ΔΡΑΚΩΝ', [0, 0.45, 0.26], { w: 0.9, h: 0.32, bg: '#d8d0c0', fg: '#3a2a1a', border: '#8a7a6a' })); SG.tomb.position.set(...add(D0, [0, 0.12, -1.6])); SG.tomb.rotation.y = Math.PI; K.scene.add(SG.tomb);

  // ---------------- ATHENS: marble stoa, the law tablet, a market stall with cabbages ----------------
  K.plane(60, 40, K.pbr('marble_01', [12, 8], { tint: 0xd8d0c0 }), add(ATH, [0, 0.01, 0]));
  for (let i = 0; i < 9; i++) K.cyl(0.32, 0.36, 5.0, 0xf2ead8, add(ATH, [-8 + i * 2.0, 2.5, -4.5]), { roughness: 0.55, seg: 16 });
  K.box(19, 0.6, 1.4, 0xe8dcc8, add(ATH, [0, 5.3, -4.5])); K.box(19, 5.0, 0.3, 0xffffff, add(ATH, [0, 2.5, -5.6]), { map: K.pbr('white_plaster_02', [4, 1], { tint: 0xc8b898 }).map });
  tablet = tablet6(add(ATH, [-1.6, 0, -2.6]));
  await K.placeH('medieval_village_pack/MarketStand_1', add(ATH, [4.6, 0, -2.2]), -0.4, 2.6).catch(() => {});
  for (let i = 0; i < 6; i++) K.sph(0.26, 0x6ab84a, add(ATH, [4.0 + (i % 3) * 0.5, 1.15, -1.9 + Math.floor(i / 3) * 0.4]), { roughness: 0.8 });
  await K.placeH('house_interior_pack/Houseplant_5', add(ATH, [-6.5, 0, -3.6]), 0, 1.8).catch(() => {});
  K.pointLight(0xffe8c8, 4, add(ATH, [0, 3.5, 2]), 12);
  SG.ath = K.sign('ATENAS · 621 a.C.', add(ATH, [0, 4.4, -5.4]), { w: 4.6, h: 0.95, bg: '#1e2a4a', border: '#e0b040' });
  SG.col = K.sign('ROBAR UNA COL = MUERTE', add(ATH, [3.6, 3.6, -1.6]), { w: 5.0, h: 0.95, bg: '#d7262a', border: '#ffffff', rotY: -0.3 });
  SG.drac = K.sign('DRACONIANO: MUY, MUY DURO', add(ATH, [0, 4.4, -5.38]), { w: 6.2, h: 0.95, bg: '#1a1210', border: '#e0b040' });
  SG.star = K.sign('¡DRACÓN! ¡DRACÓN!', add(ATH, [0, 4.4, -5.36]), { w: 4.8, h: 0.95, bg: '#e0b040', fg: '#1a1210', border: '#1a1210' });
  SG.muerte = K.sign('TODO SE CASTIGA CON LA MUERTE', add(ATH, [0, 4.4, -5.34]), { w: 7.0, h: 0.95, bg: '#1a1210', border: '#d7262a' });
  SG.agora = []; for (let i = 0; i < 12; i++) { const fa = fans.length; fan(add(ATH, [-4 + (i % 6) * 1.2, 0, 2.4 + Math.floor(i / 6) * 1.1]), CLR[i % CLR.length], Math.PI); SG.agora.push(fans[fa]); }

  // ---------------- SEA: the Saronic gulf, a sailing boat heading for Aegina ----------------
  sea = K.plane(400, 400, K.std(0x2a6a9a, { roughness: 0.25, metalness: 0.2 }), add(SEA, [0, 0, 0]));
  boat = await K.placeH('ships_pack/BoatWSail', add(SEA, [0, 0, 0]), Math.PI / 2, 4.0).catch(() => null);
  for (let i = 0; i < 3; i++) await K.placeH('nature_pack/Rock_' + (i + 1), add(SEA, [-20 + i * 6, -0.5, -40]), i, 9 + i * 3).catch(() => {});
  SG.isla = K.sign('RUMBO A EGINA', add(SEA, [3.0, 3.2, 1.0]), { w: 3.8, h: 0.9, bg: '#1e2a4a', border: '#e0b040', rotY: -0.4 });
}

function hideAll() {
  for (const c of [DRC, TH, GU, H1, H2]) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.hold(null); c.neck.rotation.set(0, 0, 0); }
  for (const [k2, g] of Object.entries(SG)) if (k2 !== 'agora' && k2 !== 'tomb') g.visible = false;
  SG.tomb.visible = false;
  for (const fa of fans) { fa.g.position.set(...fa.base); fa.g.rotation.set(0, fa.a, 0); }
  items.forEach(it => it.g.position.set(0, -99, 0)); cabbage.position.set(0, -99, 0); if (SG.agora) SG.agora.forEach(fa => fa.g.position.y = -99);
  if (book) book.position.set(0, -99, 0);
}
function draco(f, t, o = {}) { P(DRC, { pos: o.pos || D0, yaw: o.yaw ?? Math.PI, expr: o.expr || 'happy', arms: o.arms || 'wave', talk: o.talk || 0, lean: o.lean || 0, tremble: o.tr || 0 }, f); }
function hookShot(f, t, v, rev) { // frame 0: Draco half-buried in flying cloaks and hats, arms flailing, packed theatre cheering behind
  K.preset('day', { exposure: 1.0, photo: DAYSKY }); cheer(t, 1.4); const k2 = rev ? 0.55 + 0.25 * v : 0.5 + v * 0.4;
  pile(t, k2); draco(f, t, { expr: 'scared', arms: 'flail', tr: 1 });
  K.move({ p: add(THEA, [1.2, 2.0, -4.4]), l: add(THEA, [0, 1.3, 1.5]), fov: 52 }, { p: add(THEA, [0.9, 1.9, -3.6]), l: add(THEA, [0, 1.3, 1.5]), fov: 48 }, v, 0.5, f); K.focusOn(add(D0, [0, 1.2, 0]));
}

export function frame(f, k) {
  hideAll(); const ph = K.at(f), t = f / 30, u = (i) => K.u(f, i);
  K.preset('day', { exposure: 1.0, photo: DAYSKY });
  if (f < 10) K.grade.whip.value = 0;
  switch (ph) {
    case 0: { if (u(0) < 0.06) K.grade.flash.value = 0.5 * (1 - u(0) / 0.06); hookShot(f, t, u(0)); break; }
    case 1: { // the weapon: one hat spinning in slow motion straight at the lens, dark vignette
      const v = u(1); K.grade.vig.value = 0.7; cheer(t, 0.3); const it = items[0]; it.g.position.set(...add(THEA, [0.2 - v * 0.2, 2.2 - v * 0.3, 4.5 - v * 2.5])); it.g.rotation.set(0.6, t * 4, 0.3);
      const c = items[1]; c.g.position.set(...add(THEA, [-0.9 + v * 0.3, 2.6 - v * 0.2, 5.5 - v * 2.0])); c.g.rotation.set(t * 3, 0.4, t * 2);
      K.move({ p: add(THEA, [0, 2.0, -1.2]), l: add(THEA, [0, 2.0, 4]), fov: 46 }, { p: add(THEA, [0, 2.0, -1.4]), l: add(THEA, [0, 2.0, 4]), fov: 44 }, v, 0.2, f); K.focusOn(add(THEA, [0, 2.1, 1.5])); break; }
    case 2: { // Athens: Draco chisels the first laws on a marble tablet
      K.preset('day', { exposure: 1.05, photo: DAYSKY }); SG.ath.visible = true; const v = u(2); const p = add(ATH, [-0.4, 0, -1.9]);
      P(DRC, { pos: p, yaw: -Math.PI / 2 - 0.4, arms: 'hammer', expr: 'angry' }, f);
      K.move(K.frame([p, add(ATH, [-1.6, 0, -2.6])], { yaw: 0.35, h: 2.4, lookY: 1.4, pitch: -0.05, push: 1.0 }), K.frame([p, add(ATH, [-1.6, 0, -2.6])], { yaw: 0.25, h: 2.4, lookY: 1.4, pitch: -0.06, push: 0.9 }), v, 0.2, f); K.focusOn(add(ATH, [-0.4, 1.4, -1.9])); break; }
    case 3: { // gag: a man pockets a cabbage, a guard points — steal a cabbage = death
      K.preset('day', { exposure: 1.05, photo: DAYSKY }); SG.col.visible = true; const v = u(3); const tp = add(ATH, [3.4 - 1.6 * Math.max(0, v - 0.4), 0, -0.9]);
      P(TH, { pos: tp, yaw: v < 0.4 ? 0.6 : -Math.PI / 2, walk: v > 0.4 ? t * 3 : 0, expr: v < 0.5 ? 'smug' : 'scared', arms: 'hold' }, f); TH.hold(cabbage, [0, 0, 0.1]);
      P(GU, { pos: add(ATH, [1.0, 0, 0.2]), yaw: 1.0, expr: 'angry', arms: 'point', talk: v > 0.5 ? 1 : 0 }, f);
      K.move(K.frame([tp, add(ATH, [1.0, 0, 0.2])], { yaw: 0.1, h: 2.3, lookY: 1.4, pitch: -0.05, push: 1.0 }), K.frame([tp, add(ATH, [1.0, 0, 0.2])], { yaw: 0.0, h: 2.3, lookY: 1.4, pitch: -0.06, push: 0.92 }), v, 0.3, f); K.focusOn(add(tp, [0, 1.3, 0])); break; }
    case 4: { // "draconian": a giant open book on the tablet plinth, Draco smug beside it
      K.preset('day', { exposure: 1.05, photo: DAYSKY }); SG.drac.visible = true; const v = u(4); if (book) { book.position.set(...add(ATH, [0.6, 0.05, -1.0])); book.rotation.y = 0.3; book.scale.setScalar(2.2); }
      const p = add(ATH, [-0.9, 0, -0.8]); P(DRC, { pos: p, yaw: 0.6, arms: 'akimbo', expr: 'smug' }, f);
      K.move({ p: add(ATH, [-0.3, 2.6, 3.4]), l: add(ATH, [-0.2, 1.0, -0.9]), fov: 52 }, { p: add(ATH, [-0.3, 2.4, 2.8]), l: add(ATH, [-0.2, 1.0, -0.9]), fov: 50 }, v, 0.2, f); K.focusOn(add(ATH, [0.2, 0.9, -1.0])); break; }
    case 5: { // still, people adored him: agora crowd cheering, Draco waving like a star
      K.preset('day', { exposure: 1.05, photo: DAYSKY }); SG.star.visible = true; const v = u(5); SG.agora.forEach(fa => { fa.g.position.y = fa.base[1] + Math.abs(Math.sin(t * 8 + fa.ph)) * 0.25; });
      const p = add(ATH, [-0.4 + 1.2 * v, 0, 0.2]); P(DRC, { pos: p, yaw: Math.PI - 0.3, walk: t * 1.6, arms: 'wave', expr: 'proud' }, f);
      K.move({ p: add(ATH, [0.4, 1.7, -3.2]), l: add(ATH, [0.2, 1.3, 1.2]), fov: 50 }, { p: add(ATH, [0.6, 1.7, -2.8]), l: add(ATH, [0.4, 1.3, 1.2]), fov: 48 }, v, 0.3, f); K.focusOn(add(p, [0, 1.4, 0])); break; }
    case 6: { // the boat to Aegina, Draco waving from the deck, sea bobbing
      K.preset('day', { exposure: 1.0, photo: DAYSKY }); SG.isla.visible = true; const v = u(6); const bx = -3 + 4 * v;
      if (boat) { boat.position.set(...add(SEA, [bx, Math.sin(t * 2) * 0.12, 0])); boat.rotation.z = Math.sin(t * 1.6) * 0.04; }
      P(DRC, { pos: add(SEA, [bx, 0.55 + Math.sin(t * 2) * 0.12, 0.3]), yaw: 0.4, arms: 'wave', expr: 'happy' }, f);
      K.move({ p: add(SEA, [bx + 4.5, 2.2, 8.0]), l: add(SEA, [bx, 1.6, 0]), fov: 46 }, { p: add(SEA, [bx + 3.5, 2.0, 7.0]), l: add(SEA, [bx, 1.7, 0]), fov: 44 }, v, 0.3, f); K.focusOn(add(SEA, [bx, 1.6, 0.3])); break; }
    case 7: { // the theatre, packed to the top: sweeping crane shot over the tiers
      cheer(t, 0.6); SG.eg.visible = true; const v = u(7);
      K.move({ p: add(THEA, [-6, 6.5, -6]), l: add(THEA, [0, 2, 6]), fov: 56 }, { p: add(THEA, [5, 5.5, -5.5]), l: add(THEA, [0, 2, 6]), fov: 54 }, v, 0.2, f); K.focusOn(add(THEA, [0, 2, 8])); break; }
    case 8: { // Draco walks into the orchestra, greets... the crowd goes wild
      cheer(t, 0.4 + v8(u(8))); const v = u(8); const p = add(THEA, [-3.5 + 3.5 * Math.min(1, v * 1.5), 0.12, 0]);
      draco(f, t, { pos: p, yaw: v < 0.6 ? Math.PI / 2 + 0.6 : Math.PI, arms: 'wave', expr: 'happy' }); DRC.root.visible = true;
      K.move({ p: add(THEA, [-1.4, 1.8, -5.2]), l: add(THEA, [-1.0, 1.4, 2]), fov: 52 }, { p: add(THEA, [-0.6, 1.8, -4.6]), l: add(THEA, [-0.3, 1.4, 2]), fov: 50 }, v, 0.3, f); K.focusOn(add(p, [0, 1.4, 0])); break; }
    case 9: { // re-hook: crash zoom onto a fan raising his cloak over his head
      const v = u(9); if (v < 0.1) K.grade.flash.value = 0.45; K.grade.vig.value = 0.75; cheer(t, 1.5); const fa = fans[40]; const it = items[3];
      it.g.position.set(...add(fa.base, [0, 1.7 + Math.abs(Math.sin(t * 9)) * 0.3, 0])); it.g.rotation.set(0, t * 6, 0.3);
      K.move({ p: add(fa.base, [-3.0, 1.0, -6.0]), l: add(fa.base, [0, 1.3, 0]), fov: 50 }, { p: add(fa.base, [-0.8, 1.4, -2.0]), l: add(fa.base, [0, 1.4, 0]), fov: 40 }, K.ease(Math.min(1, v * 1.8)), 0.5, f); K.focusOn(add(fa.base, [0, 1.4, 0])); break; }
    case 10: { // the custom: they throw their cloaks and hats to applaud — the first ones fly from the tiers
      cheer(t, 1.6); const v = u(10); pile(t, 0.04 + v * 0.12, 0.3); draco(f, t, { arms: 'wave', expr: 'happy' });
      K.move({ p: add(THEA, [2.6, 1.4, -3.4]), l: add(THEA, [0.6, 1.8, 2]), fov: 56 }, { p: add(THEA, [2.2, 1.3, -3.0]), l: add(THEA, [0.6, 2.0, 2]), fov: 54 }, v, 0.3, f); K.focusOn(add(THEA, [0, 2.0, 2])); break; }
    case 11: { // first a hat, then a cloak, then a hundred more — raining onto him
      cheer(t, 1.6); const v = u(11); pile(t, 0.16 + v * 0.34); draco(f, t, { arms: v < 0.5 ? 'wave' : 'up', expr: v < 0.6 ? 'happy' : 'worried' });
      K.move(K.frame([D0], { yaw: Math.PI + 0.4, h: 2.4, lookY: 1.6, pitch: -0.08, push: 1.0 }), K.frame([D0], { yaw: Math.PI + 0.3, h: 2.4, lookY: 1.6, pitch: -0.1, push: 0.9 }), v, 0.3, f); K.focusOn(add(D0, [0, 1.4, 0])); break; }
    case 12: { // he smiles... and vanishes under a mountain of clothes
      cheer(t, 1.8); const v = u(12); pile(t, 0.5 + v * 0.5); draco(f, t, { arms: 'flail', expr: v < 0.3 ? 'happy' : 'scared', tr: 0.6 }); if (v > 0.8) DRC.root.visible = false;
      K.move({ p: add(THEA, [2.4, 2.2, -4.6]), l: add(D0, [0, 1.2, 0]), fov: 46 }, { p: add(THEA, [1.8, 2.0, -3.8]), l: add(D0, [0, 1.0, 0]), fov: 44 }, v, 0.3, f); K.focusOn(add(D0, [0, 1.0, 0])); break; }
    case 13: { // re-hook: low angle on the silent mound, flash
      const v = u(13); if (v < 0.1) K.grade.flash.value = 0.4; K.grade.vig.value = 0.7; cheer(t, 1.2); pile(t, 1, 0.001);
      K.move({ p: add(D0, [1.6, 0.35, -2.4]), l: add(D0, [0, 1.3, 0]), fov: 50 }, { p: add(D0, [1.2, 0.3, -1.9]), l: add(D0, [0, 1.4, 0]), fov: 48 }, v, 0.2, f); K.focusOn(add(D0, [0, 1.0, 0])); break; }
    case 14: { // nobody hears him over the applause: wide on the roaring crowd, the mound in the middle, one hand waving
      cheer(t, 1.8); const v = u(14); pile(t, 1, 0.001); P(DRC, { pos: add(D0, [0, -0.9, 0]), yaw: Math.PI, arms: 'up', expr: 'scared' }, f); DRC.root.rotation.z = Math.sin(t * 7) * 0.15;
      K.move({ p: add(THEA, [0, 3.2, -6.0]), l: add(THEA, [0, 1.6, 4]), fov: 56 }, { p: add(THEA, [0.4, 3.0, -5.2]), l: add(THEA, [0, 1.5, 4]), fov: 54 }, v, 0.2, f); K.focusOn(add(D0, [0, 1, 0])); break; }
    case 15: { // they finally pull the clothes away — he is lying still (eyes 'out'), the crowd falls silent
      cheer(t, 0); const v = u(15); pile(t, Math.max(0.03, 0.5 - v * 0.6), 0.001); K.grade.sat.value = 0.8;
      P(DRC, { pos: add(D0, [0, 0.25, 0]), yaw: Math.PI, arms: 'down', expr: 'out' }, f); DRC.root.rotation.x = -Math.PI / 2;
      P(H1, { pos: add(D0, [-1.3, 0, -0.4]), yaw: 1.2, arms: 'reach', expr: 'worried', lean: 0.3 }, f); P(H2, { pos: add(D0, [1.3, 0, -0.5]), yaw: -1.2, arms: 'hold2', expr: 'scared' }, f);
      K.move({ p: add(D0, [0.6, 4.2, 2.0]), l: add(D0, [0, 0.3, -0.5]), fov: 50 }, { p: add(D0, [0.5, 3.9, 1.7]), l: add(D0, [0, 0.3, -0.5]), fov: 48 }, v, 0.15, f); K.focusOn(add(D0, [0, 0.4, 0])); break; }
    case 16: { // buried right there: empty theatre at dusk, a small marble marker in the orchestra, cloaks left on the tiers
      K.preset('dusk', { exposure: 1.6, photo: DUSK }); fans.forEach(fa => fa.g.position.set(0, -99, 0)); SG.tomb.visible = true; const v = u(16);
      items.slice(0, 10).forEach((it, i) => { it.g.position.set(...add(THEA, [-5 + i * 1.1, 0.55 + (i % 3) * 0.5, 6.4 + (i % 3) * 1.05])); it.g.rotation.set(0, i, 0); });
      K.move({ p: add(THEA, [0, 1.4, -5.2]), l: add(D0, [0, 0.6, -1.6]), fov: 48 }, { p: add(THEA, [0, 1.1, -4.0]), l: add(D0, [0, 0.5, -1.6]), fov: 44 }, v, 0.15, f); K.focusOn(add(D0, [0, 0.4, -1.6])); break; }
    case 17: { // the man who punished everything with death: the law tablet, cold light, push in
      K.preset('day', { exposure: 0.9, photo: DAYSKY }); K.grade.sat.value = 0.7; K.grade.vig.value = 0.6; SG.muerte.visible = true; const v = u(17);
      K.move({ p: add(ATH, [-1.2, 1.6, 1.4]), l: add(ATH, [-1.6, 1.3, -2.6]), fov: 46 }, { p: add(ATH, [-1.4, 1.5, 0.4]), l: add(ATH, [-1.6, 1.25, -2.6]), fov: 44 }, v, 0.15, f); K.focusOn(add(ATH, [-1.6, 1.2, -2.5])); break; }
    case 18: { // died of too much love: one last hat drifts down onto the marker — "according to the legend"
      K.preset('dusk', { exposure: 1.6, photo: DUSK }); fans.forEach(fa => fa.g.position.set(0, -99, 0)); SG.tomb.visible = true; SG.ley.visible = true; const v = u(18); const it = items[0];
      it.g.position.set(...add(D0, [Math.sin(t * 2) * 0.4 * (1 - v), 0.95 + (1 - Math.min(1, v * 1.3)) * 3.0, -1.6])); it.g.rotation.set(Math.sin(t * 3) * 0.3 * (1 - v), t, 0);
      K.move({ p: add(D0, [1.4, 1.3, 1.2]), l: add(D0, [0, 1.2, -1.6]), fov: 44 }, { p: add(D0, [1.0, 1.2, 0.6]), l: add(D0, [0, 1.0, -1.6]), fov: 42 }, v, 0.15, f); K.focusOn(add(D0, [0, 1.0, -1.6])); break; }
    default: { const v = u(19); hookShot(f, t, v, true); SG.q.visible = true; }
  }
}
function v8(v) { return Math.min(1.4, Math.max(0, v - 0.5) * 3); }
