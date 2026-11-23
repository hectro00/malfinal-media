"""Split one long narration (full.wav) into frases/NN.wav per script line using Whisper word timestamps.
Usage: split_phrases.py script.txt full.wav frases/"""
import sys, os, re, difflib, unicodedata, numpy as np, soundfile as sf, subprocess
from faster_whisper import WhisperModel
script, full, out = sys.argv[1:4]; os.makedirs(out, exist_ok=True)
lines = [l.strip() for l in open(script, encoding='utf-8') if l.strip()]
def norm(s):
    s = unicodedata.normalize('NFD', s.lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn'); return re.sub(r'[^a-z0-9 ]', ' ', s).split()
x, sr = sf.read(full); x = x if x.ndim == 1 else x.mean(1)
a16 = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'quiet', '-i', full, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
W = [w for s in WhisperModel('small', device='cpu', compute_type='int8').transcribe(a16, language='es', word_timestamps=True)[0] for w in s.words]
flat = [(k, n) for k, w in enumerate(W) for n in norm(w.word)]
ref = [(li, n) for li, l in enumerate(lines) for n in norm(l.replace('1912', 'mil novecientos doce'))]
sm = difflib.SequenceMatcher(None, [n for _, n in ref], [n for _, n in flat], autojunk=False)
mp = {}
for b in sm.get_matching_blocks():
    for q in range(b.size): mp[b.a + q] = flat[b.b + q][0]
print('match', round(sm.ratio(), 3))
# first/last matched whisper word per line
bounds = []
for li in range(len(lines)):
    idx = [mp[i] for i, (l, _) in enumerate(ref) if l == li and i in mp]
    bounds.append((W[min(idx)].start, W[max(idx)].end) if idx else None)
for li, b in enumerate(bounds):
    if b is None: print('MISSING line', li, lines[li]); continue
    prev_end = bounds[li - 1][1] if li and bounds[li - 1] else 0
    nxt = bounds[li + 1][0] if li + 1 < len(bounds) and bounds[li + 1] else len(x) / sr
    s = max(prev_end, b[0] - 0.12); e = min(nxt, b[1] + 0.25)
    sf.write(f'{out}/{li:02d}.wav', x[int(s * sr):int(e * sr)], sr)
print('ok', len(lines))
