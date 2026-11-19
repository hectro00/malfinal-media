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
P = tim['phrases']; MAP = [0, 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]; INV = {o: n for n, o in enumerate(MAP)}
st = lambda i: P[INV[i]]['start']; en = lambda i: P[INV[i]]['end']
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
# ---------- music ----------
music = np.zeros(N)
bpm = 112; beat = 60 / bpm
def section(t0, t1, root_set, tense=True):
    t = t0; k = 0
    while t < t1 - 0.05:
        bar = (k // 4) % 4; f = root_set[bar]
        if k % 2 == 0: place(music, kick(0.5), t)
        place(music, pluck(f / 2 if k % 4 == 0 else f, 0.3, 0.42), t)
        place(music, tick(), t + beat / 2)
        if k % 4 == 0: place(music, pad(f, min(beat * 4, t1 - t), 0.1), t)
        if tense and k % 8 == 6: place(music, pluck(f * 2, 0.2, 0.25), t + beat / 2)
        t += beat; k += 1


MED = [196.0, 220.0, 174.6, 196.0]; MINOR = [220.0, 174.6, 196.0, 164.8]
bpm = 104; beat = 60 / bpm
section(0.0, st(10) - 0.05, MED, tense=False)
place(music, drone(55.0, st(13) - st(10), 0.3), st(10))
section(st(13), st(16) - 0.05, MINOR)
place(music, drone(49.0, st(18) - st(16), 0.28), st(16))
section(st(18), en(19) + 0.6, MED)

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
fps = 30
def ping(g=0.45):
    t = t_(0.6); x = (np.sin(2 * np.pi * 1760 * t) + 0.5 * np.sin(2 * np.pi * 2640 * t)) * np.exp(-t * 6); return x * g
def glug(g=0.5):
    t = t_(0.25); f = 220 + 160 * np.sin(2 * np.pi * 9 * t); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8); return x * g
def crowd(d=1.5, g=0.4):
    x = lp(noise(d), 18); x = x - lp(x, 200); x /= np.abs(x).max() + 1e-9; return x * env(len(x), 0.25, 0.5) * g
def whack(g=0.6):
    t = t_(0.2); x = lp(noise(0.2), 3) * np.exp(-t * 35) + np.sin(2 * np.pi * 240 * t) * np.exp(-t * 25) * 0.6; return x * g

def cough(g=0.5):
    d = 0.22; x = lp(noise(d), 5) * np.exp(-t_(d) * 14); t = t_(d); x += np.sin(2 * np.pi * 140 * t) * np.exp(-t * 20) * 0.6; return x * g
def coughs(t0, n=3, g=0.45):
    for k in range(n): place(sfx, cough(g), t0 + k * 0.28)
def screech(g=0.45):
    t = t_(0.7); f = 2200 - 900 * t + 120 * np.sin(2 * np.pi * 30 * t); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.03, 0.4); return lp(x, 3) * g
def wind(d=3.0, g=0.25):
    x = lp(noise(d), 60); x /= np.abs(x).max() + 1e-9; return x * env(len(x), 0.6, 0.8) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.3 * t_(d))) * g
def stomp(g=0.5):
    return kick(0.6) * 0.6 + np.pad(step(g), (0, int(0.25 * SR) - int(0.06 * SR)))[:int(0.25 * SR)]
def fall(d=1.2, g=0.4):
    t = t_(d); f = 1400 * np.exp(-t * 1.4) + 200; x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.05, 0.1); return x * g
def W(i, frac): return st(i) + frac * (en(i) - st(i))
for i in range(1, len(P)): place(sfx, whoosh(0.35, 0.22), P[i]['start'] - 0.18)

def whistle(d=0.9, g=0.4):
    t = t_(d); x = (np.sin(2 * np.pi * 880 * t) + 0.6 * np.sin(2 * np.pi * 1108 * t)) * env(len(t), 0.03, 0.2); return x * g
def chug(n=8, t0=0.0, g=0.35, gap=0.22):
    for q in range(n): place(sfx, lp(noise(0.12), 8) * np.exp(-t_(0.12) * 25) * g, t0 + q * gap)
def buzz(d=1.2, g=0.35):
    t = t_(d); f = 520 + 40 * np.sin(2 * np.pi * 7 * t); x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.5; return lp(x, 4) * env(len(t), 0.05, 0.2) * g
def howl(d=1.6, g=0.4):
    t = t_(d); f = 420 + 260 * np.sin(np.pi * t / d) ; x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.2, 0.6); return x * g
def laugh(d=1.6, g=0.4):
    x = crowd(d, 1.0) * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 4.5 * t_(d)))); return x * g
def clap(d=1.5, g=0.35):
    out = np.zeros(int(d * SR))
    for q in range(int(d * 18)): i = int(rng.uniform(0, d - 0.05) * SR); c = noise(0.03) * np.exp(-t_(0.03) * 120); out[i:i + len(c)] += c[:len(out) - i]
    return out * g
def horn(d=0.5, g=0.4):
    t = t_(d); x = np.sign(np.sin(2 * np.pi * 330 * t)) * 0.4 + np.sign(np.sin(2 * np.pi * 415 * t)) * 0.4; return lp(x, 6) * env(len(t), 0.02, 0.08) * g
def snore(d=1.4, g=0.3):
    t = t_(d); x = lp(noise(d), 40) * (np.sin(np.pi * t / d) ** 2); return x / (np.abs(x).max() + 1e-9) * g
def laughk(d=2.0, g=0.4):
    t = t_(d); out = np.zeros(len(t))
    for q in range(int(d * 5)): place(out, np.sin(2 * np.pi * (240 - q * 3) * t_(0.12)) * np.exp(-t_(0.12) * 20), q * 0.2)
    return out * g

def gears(d=2.0, g=0.3, rate=9):
    out = np.zeros(int(d * SR))
    for q in range(int(d * rate)): c = clank(1.0)[:int(0.12 * SR)] * np.exp(-t_(0.12) * 30); place(out, c, q / rate)
    return out * g
def flap(d=1.2, g=0.35, rate=14):
    out = np.zeros(int(d * SR))
    for q in range(int(d * rate)): place(out, whack(1.0), q / rate)
    return out * g
place(sfx, boom(0.55), 0.0); place(sfx, gears(2.4, 0.35, 12), 0.0); place(sfx, screech(0.3), 0.1)
place(sfx, flap(1.4, 0.2), st(1)); place(sfx, whack(0.5), en(1) - 0.3)
place(sfx, crowd(2.4, 0.4), W(2, 0.4)); place(sfx, clap(2.0, 0.35), W(2, 0.5))
place(sfx, gears(en(3) - st(3), 0.22, 8), st(3))
place(sfx, gears(en(4) - st(4), 0.25, 14), st(4)); place(sfx, clap(1.6, 0.3), W(4, 0.4))
place(sfx, horn(0.4, 0.15), W(6, 0.4)); chug(6, W(6, 0.2), 0.2, 0.35)
for q in range(5): place(sfx, clank(0.35), st(7) + 0.3 + q * 0.5)
place(sfx, flap(en(8) - W(8, 0.3), 0.25), W(8, 0.3))
place(sfx, sting(0.6), st(10)); place(sfx, flap(1.5, 0.25, 18), st(10) + 0.2)
place(sfx, whack(0.5), W(11, 0.75))
place(sfx, boom(0.55), st(12) + 0.05); place(sfx, gears(1.6, 0.4, 16), st(12)); place(sfx, screech(0.35), W(12, 0.3))
place(sfx, sting(0.55), W(13, 0.55))
place(sfx, wind(2.5, 0.15), st(14)); place(sfx, ping(0.2), W(14, 0.6))
for q in range(3): place(sfx, step(0.35), st(15) + 0.2 + q * 0.35)
place(sfx, sting(0.5), W(16, 0.5))
place(sfx, gears(en(17) - st(17), 0.2, 5), st(17))
place(sfx, crowd(1.8, 0.3), st(18)); place(sfx, coin(0.25), W(18, 0.7))
place(sfx, boom(0.45), st(19)); place(sfx, gears(1.6, 0.3, 12), st(19))

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
