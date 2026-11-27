"""Synthesized music bed + SFX stems for the Bennett short, plus the level-locked mix.
Usage: python3 audio.py web/timing.json voice.wav out_dir
"""
import json, sys, numpy as np, soundfile as sf
SR = 48000
tim = json.load(open(sys.argv[1])); voice, vsr = sf.read(sys.argv[2]); out = sys.argv[3]
if voice.ndim > 1: voice = voice.mean(1)
if vsr != SR:
    import scipy.signal as ss; voice = ss.resample_poly(voice, SR, vsr)
N = int(tim['duration'] * SR); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
P = tim['phrases']; st = lambda i: P[i]['start']; en = lambda i: P[i]['end']
rng = np.random.default_rng(7)
t_ = lambda d: np.arange(int(d * SR)) / SR
def env(n, a=0.005, r=0.2):
    e = np.ones(n); na = max(1, min(n, int(a * SR))); nr = max(1, min(n, int(r * SR)))
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr) ** 2; return e
def lp(x, k=8):  # cheap low-pass
    return np.convolve(x, np.ones(k) / k, 'same')
def place(buf, x, t, g=1.0):
    i = int(t * SR); j = min(len(buf), i + len(x));
    if i < len(buf) and j > i: buf[i:j] += x[:j - i] * g
noise = lambda d: rng.standard_normal(int(d * SR))
# ---------- instruments ----------
def pluck(f, d=0.35, g=0.5):
    t = t_(d); x = (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(4 * np.pi * f * t) + 0.15 * np.sin(6 * np.pi * f * t)) * np.exp(-t * 9); return x * g
def kick(g=0.9):
    t = t_(0.25); f = 110 * np.exp(-t * 18) + 45; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14) * g
def tick(g=0.18):
    x = noise(0.03); x = x - lp(x, 6); return x * env(len(x), 0.001, 0.03) * g
def pad(f, d, g=0.12):
    t = t_(d); x = sum(np.sin(2 * np.pi * f * k * t + k) / k for k in (1, 2, 3)) ; return lp(x, 4) * env(len(t), 0.4, 0.6) * g
def drone(f, d, g=0.2):
    t = t_(d); x = np.sin(2 * np.pi * f * t) + 0.6 * np.sin(2 * np.pi * f * 1.5 * t) + 0.3 * np.sin(2 * np.pi * f * 0.5 * t); return x * env(len(t), 1.0, 1.2) * g * (0.8 + 0.2 * np.sin(2 * np.pi * 0.25 * t))
# ---------- music: ancient war drums + low horn (frame drum / taiko-like) ----------
music = np.zeros(N)
N2F = lambda n: 440 * 2 ** ((n - 69) / 12)
def horn(f, d, g=0.2):
    t = t_(d); ph = np.cumsum(f * (1 + 0.003 * np.sin(2 * np.pi * 5 * t))) / SR; x = (2 * (ph % 1) - 1); x = lp(lp(x, 18), 18); return x * env(len(t), 0.15, 0.4) * g
def tom(f=90, g=0.5):
    t = t_(0.4); fr = f * (1 + 0.6 * np.exp(-t * 25)); return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 9) * g
def drums(t0, t1, bpm=100, g=1.0, busy=True):
    beat = 60 / bpm; t = t0; k = 0
    while t < t1:
        if k % 4 in (0, 2): place(music, tom(70, 0.6 * g), t)
        if busy and k % 4 == 3: place(music, tom(110, 0.35 * g), t); place(music, tom(110, 0.3 * g), t + beat / 2)
        place(music, tick(0.12 * g), t); t += beat; k += 1
def hornline(t0, t1, notes, g=0.12):
    d = (t1 - t0) / len(notes)
    for i, n in enumerate(notes): place(music, horn(N2F(n), d * 1.05, g), t0 + i * d)
dur = lambda p: en(p) - st(p)
# Paris waltz (accordion-ish pluck + pad) -> dark drone -> London minor
def waltz(t0, t1, root=60, bpm=150, g=0.12, minor=False):
    beat = 60 / bpm; t = t0; k = 0; ch = [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] if not minor else [[0, 3, 7], [5, 8, 12], [7, 10, 14], [0, 3, 7]]
    while t < t1:
        c = ch[(k // 3) % 4]
        if k % 3 == 0: place(music, pluck(N2F(root - 12 + c[0]), 0.5, g * 1.3), t)
        else:
            for n in c: place(music, pluck(N2F(root + n), 0.3, g * 0.5), t)
        if k % 6 == 0: place(music, pad(N2F(root + c[1]), beat * 6, g * 0.6), t)
        t += beat; k += 1
# ---------- sfx ----------
sfx = np.zeros(N)
def whoosh(d=0.6, g=0.5):
    x = noise(d); x = lp(x, 30) * np.sin(np.linspace(0, np.pi, len(x))) ** 2; return x * g
def rumble(d=1.5, g=0.6):
    x = lp(noise(d), 120); x /= np.abs(x).max() + 1e-9; return x * env(len(x), 0.02, d * 0.6) * g
def crash(d=0.8, g=0.6):
    x = noise(d) * np.exp(-t_(d) * 6); return (x - lp(x, 3)) * g
def clank(g=0.6):
    t = t_(0.9); x = sum(np.sin(2 * np.pi * f * t) for f in (420, 1130, 1870)) * np.exp(-t * 5); return x * g / 3
def creak(d=0.9, g=0.35):
    t = t_(d); f = 180 + 60 * np.sin(2 * np.pi * 1.3 * t); x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.5; return lp(x, 12) * env(len(t), 0.1, 0.3) * g
def step(g=0.35):
    x = lp(noise(0.06), 10) * env(int(0.06 * SR), 0.002, 0.05); return x * g
def splash(d=1.2, g=0.6):
    x = noise(d); x = lp(x, 6) * np.exp(-t_(d) * 2.5); return x * g
def boom(g=0.9):
    r = rumble(1.2, 0.7); k = np.zeros(len(r)); kk = kick(1.0); k[:len(kk)] = kk
    return (k * 1.2 + r) * g
def coin(g=0.4):
    t = t_(0.35); x = (np.sin(2 * np.pi * 2637 * t) + np.sin(2 * np.pi * 3520 * t)) * np.exp(-t * 14); return x * g
def knock(g=0.7):
    t = t_(0.18); x = np.sin(2 * np.pi * 180 * t) * np.exp(-t * 30) + lp(noise(0.18), 4) * np.exp(-t * 40) * 0.5; return x * g
def sting(g=0.7):
    t = t_(1.6); x = (np.sin(2 * np.pi * 55 * t) + 0.5 * np.sin(2 * np.pi * 82.4 * t)) * np.exp(-t * 2); return x * g
def heart(g=0.6):
    t = t_(0.5); x = np.sin(2 * np.pi * 50 * t) * np.exp(-t * 22); y = np.sin(2 * np.pi * 45 * t) * np.exp(-t * 20)
    o = np.zeros(int(0.5 * SR)); o += x; s0 = int(0.18 * SR); o[s0:] += y[:len(o) - s0] * 0.7; return o * g
def windn(d, g=0.3):
    x = lp(noise(d), 25); m = 0.6 + 0.4 * np.sin(2 * np.pi * 0.3 * t_(d)) * np.sin(2 * np.pi * 0.13 * t_(d) + 1); x = x / (np.abs(x).max() + 1e-9) * m; return x * env(len(x), 0.5, 0.6) * g
def flutter(d, g=0.3):
    x = noise(d) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 22 * t_(d)))); x = lp(x, 5); return x * env(len(x), 0.05, 0.2) * g
def murmur(d, g=0.25):
    x = np.zeros(int(d * SR))
    for k in range(int(d * 6)):
        s = int(rng.uniform(0, d - 0.6) * SR); tt = t_(0.5); f = rng.uniform(140, 260); v = np.sin(2 * np.pi * f * tt * (1 + 0.05 * np.sin(2 * np.pi * 7 * tt))) * env(len(tt), 0.05, 0.2)
        v = lp(v, 6); x[s:s + len(v)] += v * rng.uniform(0.2, 0.5)
    return x * env(len(x), 0.4, 0.6) * g
def projector(d, g=0.3):
    x = np.zeros(int(d * SR)); p = int(SR / 18)
    for i in range(0, len(x) - 400, p): c = tick(0.5)[:400]; x[i:i + len(c)] += c
    return (x + lp(noise(d), 50) * 0.2) * g
def gasp(g=0.4):
    x = lp(noise(0.5), 3) * env(int(0.5 * SR), 0.05, 0.3); return x * g
def whistle(d, g=0.3):
    t = t_(d); f = 1400 - 800 * t / d; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.1, 0.1) * g
def stampS(g=0.9):
    return knock(g) * 1.3
dur = lambda p: en(p) - st(p)
fps = 30
def neigh(g=0.5):
    t = t_(0.9); f = 700 + 300 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 2) - 250 * t; x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.4 + np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR) * 0.3
    return lp(x, 5) * env(len(t), 0.03, 0.5) * g
def gallop(t0, t1, g=0.4, rate=2.2):
    k = 0; t = t0
    while t < t1:
        for o in (0, 0.08, 0.17): place(sfx, knock(g * 0.8), t + o)
        t += 1 / rate
def rainS(d, g=0.25): x = noise(d); x = x - lp(x, 4); return x * env(len(x), 0.4, 0.5) * g
def thunder(g=0.8): r = rumble(2.4, 0.8); c = crash(0.3, 0.6); r[:len(c)] += c; return r * g
def waves(d, g=0.35):
    x = lp(noise(d), 40); m = 0.5 + 0.5 * np.sin(2 * np.pi * 0.35 * t_(d)) ** 2; x = x / (np.abs(x).max() + 1e-9) * m; return x * env(len(x), 0.5, 0.6) * g
def gulp(g=0.6):
    t = t_(0.18); f = 300 - 900 * t; x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 18); return x * g
def pour(d, g=0.3):
    x = noise(d); x = x - lp(x, 3); m = 0.6 + 0.4 * np.sin(2 * np.pi * 9 * t_(d)); return x * m * env(len(x), 0.05, 0.2) * g
def chug(t0, t1, g=0.4):
    t = t0
    while t < t1: place(sfx, knock(g * 0.7), t); place(sfx, tick(0.15), t + 0.12); t += 0.28
def clink(g=0.5):
    t = t_(0.5); x = sum(np.sin(2 * np.pi * f * t) for f in (2200, 3300, 4700)) * np.exp(-t * 9); return x * g / 3
def whistleT(g=0.4):
    t = t_(1.2); x = (np.sin(2 * np.pi * 720 * t) + 0.6 * np.sin(2 * np.pi * 905 * t)) * env(len(t), 0.05, 0.4); return lp(x, 3) * g
def bubbles(d, g=0.3):
    x = np.zeros(int(d * SR))
    for k in range(int(d * 9)):
        s0 = int(rng.uniform(0, d - 0.1) * SR); tt = t_(0.08); f0 = rng.uniform(500, 1200); b = np.sin(2 * np.pi * np.cumsum(f0 + 2500 * tt) / SR) * np.exp(-tt * 40); x[s0:s0 + len(b)] += b
    return x * g
# ---------- Bacon: harpsichord-ish minuet (Jacobean) -> icy drone + wind -> slow minor for the sickroom ----------
def harp(f, d=0.3, g=0.5):
    t = t_(d); x = sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (6 + 3 * k)) / k for k in (1, 2, 3, 4)); return x * g
def minuet(t0, t1, root=62, bpm=132, g=0.12, minor=False):
    beat = 60 / bpm; t = t0; k = 0; ch = [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] if not minor else [[0, 3, 7], [5, 8, 12], [7, 10, 14], [0, 3, 7]]
    while t < t1:
        c = ch[(k // 3) % 4]
        place(music, harp(N2F(root - 12 + c[0]), 0.5, g * 1.2), t) if k % 3 == 0 else [place(music, harp(N2F(root + n), 0.25, g * 0.45), t) for n in c]
        place(music, harp(N2F(root + 12 + c[k % 3]), 0.2, g * 0.35), t + beat / 2); t += beat; k += 1
def chime(f, g=0.3):
    t = t_(1.2); return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t)) * np.exp(-t * 3) * g
drums(0.0, en(0), 112, 0.8); place(music, drone(N2F(38), en(0) + 0.3, 0.14), 0)
minuet(st(1), en(3), 62, 132, 0.11); minuet(st(4), en(10), 62, 120, 0.09)
place(music, drone(N2F(36), en(12) - st(11) + 0.4, 0.16), st(11))
for i in range(4): place(music, chime(N2F(74 + [0, 3, 7, 10][i]), 0.12), st(11) + i * 0.6)
minuet(st(13), en(16), 57, 84, 0.08, True); place(music, drone(N2F(33), en(17) - st(14) + 0.4, 0.12), st(14))
place(music, drone(N2F(31), en(18) - st(17) + 0.4, 0.12), st(17)); minuet(st(19), en(19) + 1.3, 62, 120, 0.09)
sfx = np.zeros(N)
def crunch(g=0.35): x = noise(0.12); x = x - lp(x, 3); return x * env(len(x), 0.002, 0.08) * g
def shiverS(d, g=0.2): x = noise(d) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 11 * t_(d)))); return lp(x, 10) * env(len(x), 0.1, 0.2) * g
def cough(g=0.4): x = lp(noise(0.25), 6) * np.exp(-t_(0.25) * 12); return x * g
place(sfx, sting(0.5), 0.02); place(sfx, crash(0.5, 0.5), 0.06); place(sfx, windn(dur(0), 0.35), 0)
for k in range(int(dur(0) * 3)): place(sfx, crunch(0.3), 0.15 + k * 0.33)
place(sfx, whoosh(0.5, 0.4), st(1)); gallop(st(1), st(1) + dur(1) * 0.5, 0.25); place(sfx, windn(dur(1) * 0.5, 0.12), st(1))
place(sfx, murmur(dur(2), 0.2), st(2)); for_ = [place(sfx, coin(0.35), st(2) + dur(2) * 0.5 + k * 0.15) for k in range(5)]; place(sfx, sting(0.45), st(2) + dur(2) * 0.55)
place(sfx, bubbles(dur(3), 0.2), st(3)); place(sfx, crash(0.3, 0.3), st(3) + 0.6)
gallop(st(4), en(4), 0.3); place(sfx, windn(dur(4), 0.15), st(4))
gallop(st(5), en(6), 0.15, 1.6); place(sfx, windn(en(6) - st(5), 0.1), st(5)); place(sfx, sting(0.3), st(6) + dur(6) * 0.3)
place(sfx, neigh(0.5), st(7) + 0.4); place(sfx, creak(0.7, 0.4), st(7) + 0.3); place(sfx, crunch(0.5), st(7) + 1.5)
place(sfx, coin(0.45), st(8) + 0.2); place(sfx, windn(dur(8), 0.1), st(8))
for k in range(int((en(10) - st(9)) * 2.5)): place(sfx, crunch(0.3), st(9) + 0.2 + k * 0.4)
place(sfx, windn(en(10) - st(9), 0.2), st(9)); place(sfx, shiverS(dur(10), 0.12), st(10))
place(sfx, sting(0.55), st(11)); place(sfx, windn(dur(11) + 0.5, 0.35), st(11)); place(sfx, heart(0.5), st(11) + 0.4)
place(sfx, shiverS(dur(12), 0.2), st(12)); place(sfx, gasp(0.3), st(12) + 0.3)
gallop(st(13), st(13) + dur(13) * 0.7, 0.25, 1.6); place(sfx, knock(0.6), en(13) - 0.6); place(sfx, knock(0.6), en(13) - 0.35)
for k in range(int(dur(14) * 1.4)): place(sfx, tick(0.25), st(14) + 0.3 + k * 0.7)
place(sfx, creak(0.8, 0.3), st(14)); place(sfx, heart(0.5), st(15) + 0.2); place(sfx, heart(0.5), st(15) + 0.9); place(sfx, cough(0.4), st(15) + dur(15) * 0.6)
place(sfx, flutter(dur(16), 0.12), st(16) + dur(16) * 0.5); place(sfx, cough(0.3), st(16) + 0.3)
place(sfx, whoosh(0.3, 0.3), st(17) + dur(17) * 0.4); place(sfx, sting(0.35), st(17) + dur(17) * 0.55)
for i in range(3): place(sfx, chime(N2F(86 + i * 4), 0.15), st(18) + 0.2 + i * 0.25)
place(sfx, windn(dur(18) * 0.6, 0.25), st(18) + dur(18) * 0.5); place(sfx, heart(0.4), st(18) + dur(18) * 0.55)
place(sfx, whoosh(0.4, 0.4), st(19)); place(sfx, windn(dur(19), 0.12), st(19))
# ---------- level lock: music and SFX at 50 % of voice gated RMS ----------
def grms(x):
    b = int(0.4 * SR); r = np.array([np.sqrt(np.mean(x[i:i + b] ** 2)) for i in range(0, len(x) - b, b)]); r = r[r > r.max() * 0.1] if r.max() > 0 else r
    return np.sqrt(np.mean(r ** 2)) if len(r) else 1e-9
import scipy.signal as _ss
_b, _a = _ss.butter(2, 120, 'high', fs=SR); music = _ss.lfilter(_b, _a, music)
vr = grms(voice); music *= 0.25 * vr / grms(music); sfx *= 0.26 * vr / grms(sfx)
# ducking: bed drops under the voice (20 ms attack, 250 ms release)
_e = np.abs(voice); _env = np.zeros_like(_e); _ka, _kr = np.exp(-1 / (0.02 * SR)), np.exp(-1 / (0.25 * SR)); _v = 0.0
for _i in range(0, len(_e), 48):
    _x = _e[_i:_i + 48].max(); _k = _ka ** 48 if _x > _v else _kr ** 48; _v = _x + (_v - _x) * _k; _env[_i:_i + 48] = _v
_env = np.clip(_env / (np.percentile(_env[_env > 1e-4], 70) + 1e-9), 0, 1)
music *= (1 - 0.55 * _env); sfx *= (1 - 0.35 * _env)
cap = 0.7 * np.abs(voice).max(); pk = np.abs(sfx).max()
if pk > cap: sfx *= cap / pk
print('voice gRMS %.4f  music %+.1f dB  sfx %+.1f dB (vs voice)' % (vr, 20 * np.log10(grms(music) / vr), 20 * np.log10(grms(sfx) / vr)))
mix = voice + music + sfx
mix /= max(1.0, np.abs(mix).max() / 0.95)
sf.write(f'{out}/music.wav', music.astype(np.float32), SR); sf.write(f'{out}/sfx.wav', sfx.astype(np.float32), SR); sf.write(f'{out}/mix.wav', mix.astype(np.float32), SR)
