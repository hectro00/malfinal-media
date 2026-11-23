// engine4 shared library: scenery helpers, crowd, shot table + frame/post machinery. Scenes: import * from './lib.js'.
import { K, W, H, OUT, clamp, lerp, ease, R, ol, rr, circ, ell, line, poly, txt, L, cloud, bird, person, pose, sky } from './engine.js';
const g = K.g;
const TM = await (await fetch('timing.json')).json();
export const PH = TM.phrases;
export const FRAMES = Math.ceil((PH[PH.length - 1].end + 1.4) * 30);
export const st = (p) => PH[p].start, en = (p) => PH[p].end, dur = (p) => PH[p].end - PH[p].start;
// shot table: sh(phrase, fractionOfPhraseWhereShotStarts, fn(t, u, lt), fast) ; fast=1 -> heavier motion blur
export const S = []; export const sh = (p, a, fn, fast = 0) => S.push([p, a, fn, fast]);
export function shotStart(i) { const [p, fa] = S[i]; if (fa > 0) return PH[p].start + (PH[p].end - PH[p].start) * fa; return p === 0 ? 0 : PH[p - 1].end + 0.03; }
export let FX = { film: 0, sepia: 0 }; export function fx(o) { Object.assign(FX, o); }
export const CROWD = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({ skin: ['#f2c9a0', '#e0a97f', '#c98e62', '#f5d2b3', '#e8b98f', '#b97f58'][i % 6], hair: ['#2b1d14', '#5a3b22', '#141414', '#7a5a3a', '#999'][i % 5], hairStyle: ['side', 'bald', 'side', 'bun', 'curly'][i % 5],
  hat: ['bowler', 'top', 'cap', null, 'bowler'][i % 5], coat: ['#3a4250', '#5a4636', '#2f3b2f', '#6b2f3a', '#45405a'][i % 5], mustache: i % 3 === 0, pants: '#2a2a30', shoes: '#1b1b1b', seed: 20 + i }));
export const SKYT = '#9cc0dc', SKYB = '#f4dcc0';
export function clouds(t, y0 = -700, n = 5, sc = 1) { for (let i = 0; i < n; i++) cloud(((R(i) * 2600 + t * (20 + R(i + 1) * 25)) % 2600) - 1300, y0 + R(i + 3) * 380, (0.8 + R(i + 5) * 0.9) * sc); }
export function birds(t, x0, y0, n = 5, s = 1, vx = 140) { for (let i = 0; i < n; i++) bird(x0 + t * vx + (R(i) - 0.5) * 260 * s, y0 + (R(i + 9) - 0.5) * 160 * s + Math.sin(t * 2 + i) * 12, 0.9 * s, t + i * 0.37); }
export function skyline(y, s = 1, col = '#b9c6d3', seed = 1) { // far Paris silhouette
  g.save(); g.fillStyle = col; g.strokeStyle = 'rgba(40,40,60,0.35)'; g.lineWidth = 3;
  let x = -1700;
  while (x < 1700) { const w = (120 + R(x * 0.01 + seed) * 160) * s, h = (140 + R(x * 0.013 + seed) * 220) * s; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - h); g.lineTo(x + 18 * s, y - h - 40 * s); g.lineTo(x + w - 18 * s, y - h - 40 * s); g.lineTo(x + w, y - h); g.lineTo(x + w, y); g.closePath(); g.fill(); g.stroke();
    if (R(x + seed) > 0.5) { g.fillRect(x + w * 0.3, y - h - 70 * s, 16 * s, 34 * s); } x += w + 4; }
  g.beginPath(); g.arc(-520 * s, y - 330 * s, 90 * s, Math.PI, 0); g.fill(); g.stroke(); g.fillRect(-530 * s, y - 470 * s, 20 * s, 60 * s); g.fillRect(-640 * s, y - 330 * s, 240 * s, 330 * s);
  g.restore();
}
export function ground(y, col = '#9fb27e', col2 = '#8aa06b') { g.fillStyle = col; g.fillRect(-3000, y, 6000, 3000); g.strokeStyle = OUT; g.lineWidth = 6; g.beginPath(); g.moveTo(-3000, y); g.lineTo(3000, y); g.stroke(); g.fillStyle = col2; for (let i = 0; i < 40; i++) { ell(-2400 + R(i) * 4800, y + 30 + R(i + 1) * 500, 60 + R(i + 2) * 120, 10 + R(i + 3) * 14); g.fill(); } }
export function smoke(x, y, t, s = 1) { for (let k = 0; k < 5; k++) { const ph = (t * 0.25 + k / 5) % 1; g.globalAlpha = 0.6 * (1 - ph); circ(x + Math.sin(ph * 6 + k) * 20 * s + ph * 80 * s, y - ph * 220 * s, (12 + ph * 40) * s); ol('#eef0f2', 3); } g.globalAlpha = 1; }
export function frost(t) { g.save(); for (let i = 0; i < 40; i++) { const x = ((R(i) * W * 1.4 + t * (80 + R(i + 2) * 120)) % (W * 1.4)) - W * 0.2, y = ((R(i + 5) * H + t * (60 + R(i + 3) * 60)) % H); g.globalAlpha = 0.5; circ(x, y, 3 + R(i + 7) * 4); g.fillStyle = '#fff'; g.fill(); } g.restore(); }
export function vign(a = 0.35) { const gr = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(10,8,20,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
export function crowdRow(t, x0, y, n, h, sp, o = {}) {
  for (let i = 0; i < n; i++) { const CC = o.cast || CROWD, d = CC[(i + (o.off || 0)) % CC.length], P = pose(o.pose ? o.pose(i) : (R(i + 3) > 0.7 ? 'point' : 'stand'), t + i * 0.37); person(x0 + i * sp + (R(i) - 0.5) * sp * 0.4, y + R(i + 2) * 20, h * (0.92 + R(i + 1) * 0.16), d, P, { expr: o.expr ? o.expr(i) : (R(i + 5) > 0.5 ? 'neutral' : 'talk'), talk: o.talk ?? R(i + 4) > 0.6, look: o.look ?? 0, breath: o.breath ?? true }, t, R(i + 6) > 0.5 && !o.noflip); }
}
// tower deck at 57 m seen from the side (deck floor y = 300 in world, rail at x = 250)
export function blurN(f) { return S[cur(f / 30)][3] ? 5 : 2; }
function cur(t) { let i = S.length - 1; for (let k = 0; k < S.length - 1; k++) if (t < shotStart(k + 1)) { i = k; break; } return i; }
export function frame(f, k) {
  FX.film = 0; FX.sepia = 0;
  const t = f / 30, i = cur(t), a = shotStart(i), b = i + 1 < S.length ? shotStart(i + 1) : FRAMES / 30;
  const u = clamp((t - a) / Math.max(0.01, b - a)); S[i][2](t, u, Math.max(0, t - a));
  // quick whip-pan transition into the next shot (last 4 frames)
  const rem = (b - t) * 30; if (rem < 3 && i + 1 < S.length) { const kk = 1 - rem / 3; g.save(); g.fillStyle = `rgba(255,255,255,${0.25 * kk})`; g.fillRect(0, 0, W, H); g.restore(); }
  vign(0.32);
}
export function post(o, f, k) {
  if (FX.sepia) { o.save(); o.globalCompositeOperation = 'saturation'; o.fillStyle = `rgba(128,128,128,${FX.sepia})`; o.fillRect(0, 0, W, H); o.restore(); }
  if (FX.film) { o.save(); o.globalCompositeOperation = 'saturation'; o.fillStyle = '#808080'; o.fillRect(0, 0, W, H); o.globalCompositeOperation = 'multiply'; o.fillStyle = '#e8cf9e'; o.fillRect(0, 0, W, H); o.globalCompositeOperation = 'source-over';
    o.fillStyle = `rgba(255,240,210,${0.06 + 0.06 * R(f)})`; o.fillRect(0, 0, W, H); o.strokeStyle = 'rgba(40,30,20,0.5)'; o.lineWidth = 2; for (let i = 0; i < 3; i++) { const x = R(f * 3 + i) * W; o.beginPath(); o.moveTo(x, 0); o.lineTo(x + 10, H); o.stroke(); }
    o.fillStyle = '#111'; o.fillRect(0, 0, 70, H); o.fillRect(W - 70, 0, 70, H); o.fillStyle = '#e8e0cc'; const off = (f * 18) % 120; for (let y = -120; y < H; y += 120) { o.beginPath(); o.roundRect(18, y + off, 34, 60, 8); o.fill(); o.beginPath(); o.roundRect(W - 52, y + off, 34, 60, 8); o.fill(); } o.restore(); }
  // paper grain (shared across the whole video so it reads as one film)
  o.save(); o.globalAlpha = 0.05; for (let i = 0; i < 220; i++) { o.fillStyle = R(i + f) > 0.5 ? '#000' : '#fff'; o.fillRect(R(i * 3 + f) * W, R(i * 7 + f * 2) * H, 3, 3); } o.restore();
}

