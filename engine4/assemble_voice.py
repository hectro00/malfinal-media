"""frases/NN.wav (raw TTS takes, one per script line) -> voice/voice.wav + web/timing.json.
v3 (17 Nov): no tempo lift, warm EQ, keeps word tails + soft fade, natural pauses (compress > 0.45 s), subtle room, tight gaps between phrases.
Optional PAUSE overrides: python3 assemble_voice.py '{"7":0.45}'"""
import json, os, subprocess, sys, numpy as np, soundfile as sf
SR = 48000
lines = [l.strip() for l in open('script.txt', encoding='utf-8') if l.strip()]
PAUSE = {int(k): v for k, v in (json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}).items()}
os.makedirs('voice', exist_ok=True); os.makedirs('web', exist_ok=True)
parts, ph, t = [np.zeros(int(0.15 * SR))], [], 0.15
for i, txt in enumerate(lines):
    src, dst = f'frases/{i:02d}.wav', f'voice/p{i:02d}.wav'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-af', 'highpass=f=70,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3500:t=q:w=1:g=1.5,acompressor=threshold=-20dB:ratio=2:attack=10:release=150,aresample=48000', '-ac', '1', dst], check=True)
    x, sr = sf.read(dst); x = x.mean(1) if x.ndim > 1 else x
    e = np.convolve(np.abs(x), np.ones(480) / 480, 'same'); idx = np.nonzero(e > 0.004 * e.max())[0]
    x = x[max(0, idx[0] - int(0.04 * SR)):idx[-1] + int(0.22 * SR)].copy()
    fo = min(len(x), int(0.08 * SR)); x[-fo:] *= np.linspace(1, 0, fo)  # soft tail, no dry cut-off
    e2 = np.convolve(np.abs(x), np.ones(960) / 960, 'same'); q = e2 < 0.012 * e2.max(); keep = np.ones(len(x), bool); run = 0
    for j in range(len(x)):
        run = run + 1 if q[j] else 0
        if run > int(0.45 * SR): keep[j] = False
    x = x[keep]
    if i > 0: gap = PAUSE.get(i, 0.26); parts.append(np.zeros(int(gap * SR))); t += gap
    ph.append({'start': round(t, 3), 'end': round(t + len(x) / SR, 3), 'text': txt}); parts.append(x); t += len(x) / SR
parts.append(np.zeros(int(0.8 * SR))); t += 0.8
v = np.concatenate(parts); v = v / max(1e-9, np.abs(v).max()) * 0.89
sf.write('voice/voice_dry.wav', v.astype(np.float32), SR)
# subtle room so it doesn't sound like a dry robot booth (v3)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'voice/voice_dry.wav', '-af', 'aecho=0.8:0.88:35|70:0.10|0.06,alimiter=limit=0.95', 'voice/voice.wav'], check=True)
json.dump({'duration': round(len(v) / SR, 3), 'phrases': ph}, open('web/timing.json', 'w'), ensure_ascii=False, indent=1)
print('voice', round(len(v) / SR, 2))
for i, p in enumerate(ph): print(i, f"{p['start']:6.2f}-{p['end']:6.2f}", p['text'][:60])
