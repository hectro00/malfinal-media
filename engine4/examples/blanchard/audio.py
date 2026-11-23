"""Synthesized music bed + SFX stems for the beer-flood short, plus the level-locked mix.
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
# ---------- music: Paris musette waltz (accordion) ----------
music = np.zeros(N)
def acc(f, d, g=0.2):
    t = t_(d); vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * t)
    x = 0
    for det in (1.0, 1.006):
        ph = np.cumsum(f * det * vib) / SR; x = x + (2 * (ph % 1) - 1) * 0.6 + np.sign(np.sin(2 * np.pi * ph)) * 0.25
    x = lp(x, 10); return x * env(len(t), 0.03, min(0.15, d * 0.4)) * g * (0.85 + 0.15 * np.sin(2 * np.pi * 6 * t))
def bassn(f, d, g=0.35):
    t = t_(d); return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 4) * g
N2F = lambda n: 440 * 2 ** ((n - 69) / 12)
def waltz(t0, t1, key=55, minor=False, bpm=138, mel=True, g=1.0):
    beat = 60 / bpm; prog = [0, 7, 0, 5] if not minor else [0, 5, 7, 0]
    third = 3 if minor else 4
    motif = [7, 9, 11, 12, 11, 9, 7, 4, 7, 9, 7, 4] if not minor else [7, 8, 7, 3, 5, 7, 8, 7, 3, 2, 3, 0]
    t = t0; k = 0
    while t < t1 - beat:
        bar = k // 3; root = key + prog[bar % 4]; b = k % 3
        if b == 0: place(music, bassn(N2F(root - 12), beat * 1.2, 0.4 * g), t)
        else:
            for iv in (0, third, 7): place(music, acc(N2F(root + iv), beat * 0.45, 0.05 * g), t)
        if mel and (k % 3 != 2 or bar % 2 == 0):
            n = key + 12 + motif[(k // (1 if b == 0 else 1)) % len(motif)] + (prog[bar % 4] if bar % 4 == 3 else 0)
            place(music, acc(N2F(n), beat * (0.9 if b == 0 else 0.6), 0.11 * g), t)
        t += beat; k += 1
def drone2(f, d, g=0.2):
    t = t_(d); x = acc(f, d, 1) + acc(f * 1.5, d, 0.6); return x * env(len(t), 1.0, 1.0) * g
waltz(0.0, en(9) + 0.2, 55)
place(music, drone2(N2F(43), en(12) - st(10), 0.10), st(10))
waltz(st(10), en(12), 52, minor=True, bpm=112, mel=False, g=0.7)
place(music, drone2(N2F(40), en(16) - st(13) + 0.3, 0.14), st(13))
waltz(st(17), en(19) + 1.2, 52, minor=True, bpm=96, g=0.9)
# ---------- sfx ----------
sfx = np.zeros(N)
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
def hooves(d, g=0.35):
    x = np.zeros(int(d * SR))
    for k in range(int(d * 6)): c = knock(0.5)[:int(0.08 * SR)]; i = int((k / 6 + (0.04 if k % 2 else 0)) * SR); x[i:i + len(c)] += c[:len(x) - i]
    return x * g
def burst(g=0.4):
    a = lp(noise(0.6), 30) * env(int(0.6 * SR), 0.005, 0.5) * g; c = crash(0.25, g); a[:len(c)] += c[:len(a)]; return a
def fire(d, g=0.3):
    x = lp(noise(d), 12) * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 3 * t_(d)))); return x * env(len(x), 0.3, 0.3) * g
# P0 carriage + fireworks
place(sfx, hooves(1.6, 0.5), st(0)); place(sfx, whoosh(0.6, 0.4), st(0) + 0.4)
s0b = st(0) + dur(0) * 0.45
for k in range(4): place(sfx, burst(0.25), s0b + 0.3 + k * 0.35)
place(sfx, fire(1.0, 0.3), s0b + dur(0) * 0.4)
place(sfx, murmur(dur(1), 0.25), st(1)); place(sfx, crowd_clap(dur(1)), st(1)) if 'crowd_clap' in dir() else None
place(sfx, windn(dur(2) + 0.3, 0.25), st(2)); place(sfx, whoosh(0.8, 0.4), st(2) + dur(2) * 0.6)
place(sfx, windn(dur(3), 0.3), st(3))
place(sfx, stampS(0.6), st(4) + dur(4) * 0.5)
place(sfx, hooves(dur(5), 0.5), st(5) + dur(5) * 0.2); place(sfx, gasp(0.4), st(5) + dur(5) * 0.45)
for k in range(3): place(sfx, coin(0.12), st(6) + dur(6) * 0.5 + k * 0.5)
place(sfx, tick(0.4), st(7) + 0.3)
for k in range(5): place(sfx, burst(0.2), st(8) + dur(8) * 0.25 + k * 0.4)
place(sfx, murmur(dur(9), 0.25), st(9))
place(sfx, murmur(dur(10) + dur(11), 0.3), st(10))
place(sfx, windn(dur(12) + 0.5, 0.35), st(12))
for k in range(6): place(sfx, burst(0.25), st(12) + dur(12) * 0.5 + k * 0.3)
place(sfx, fire(dur(13) + dur(14) + dur(15) + 1.0, 0.45), st(13) + dur(13) * 0.2)
place(sfx, murmur(dur(14), 0.4), st(14))
for k in range(3): place(sfx, knock(0.4), st(15) + 0.4 + k * 0.35)
s16 = en(15) + 0.03; place(sfx, crash(0.8, 0.8), s16 + 0.8); place(sfx, boom(0.5), s16 + 0.8); place(sfx, gasp(0.5), s16 + 1.0)
place(sfx, sting(0.6), st(17)); place(sfx, hooves(dur(17), 0.3), st(17))
place(sfx, windn(dur(19) + 1.0, 0.35), st(19))
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
