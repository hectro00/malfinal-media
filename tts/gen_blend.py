"""Usage: gen_blend.py script.txt outdir  — blended voice (grave+calido), per-phrase Whisper check, resumable."""
import sys, os, re, json, difflib, unicodedata, torch, torchaudio as ta
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
from faster_whisper import WhisperModel
script, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
lines = [l.strip() for l in open(script, encoding='utf-8') if l.strip()]
m = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
wm = WhisperModel("small", device="cpu", compute_type="int8")
import os
R = os.path.dirname(os.path.abspath(__file__)) + '/'
with torch.no_grad():
    m.prepare_conditionals(R + 'ref_grave.wav', exaggeration=0.5); sa = m.conds.t3.speaker_emb.detach().clone(); ga = m.conds.gen['embedding'].detach().clone()
    m.prepare_conditionals(R + 'ref_calido.wav', exaggeration=0.5)
    m.conds.t3.speaker_emb = (sa + m.conds.t3.speaker_emb.detach()) / 2; m.conds.gen['embedding'] = (ga + m.conds.gen['embedding'].detach()) / 2
CONDS = m.conds
def norm(s):
    s = unicodedata.normalize('NFD', s.lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn'); return re.sub(r'[^a-z ]', ' ', s).split()
def trim(w, sr, th=0.006):  # v3 voice (17 Nov): keep word tails (user: 'las palabras acaban secas')
    a = w.abs().squeeze(0); idx = (a > th).nonzero()
    if len(idx) == 0: return w
    return w[:, max(0, int(idx[0]) - int(0.03 * sr)):min(a.shape[0], int(idx[-1]) + int(0.22 * sr))]
# v3B (user choice 18 Nov: "B nueva fluida"): narrate 2-3 lines in ONE breath for natural prosody, then split per line
# with Whisper word timestamps. Falls back to per-line (same B settings) when a group can't be aligned.
EX, CFG, TEMP = 0.8, 0.45, 0.8
def gen(text, ex):
    m.conds = CONDS
    return trim(m.generate(text.replace('...', '…'), language_id="es", exaggeration=ex, cfg_weight=CFG, temperature=TEMP), m.sr)
def words_t(w):
    a16 = ta.functional.resample(w, m.sr, 16000).squeeze(0).numpy().astype('float32')
    segs = wm.transcribe(a16, language='es', word_timestamps=True)[0]
    return [(x.word, x.start, x.end) for s_ in segs for x in s_.words]
def single(i, t):
    best = None
    for att in range(3):
        w = gen(t, EX + (0.1 if i == 0 or i >= len(lines) - 2 else 0))
        hyp = ' '.join(x[0] for x in words_t(w)); sc = difflib.SequenceMatcher(None, norm(t), norm(hyp)).ratio(); dur = w.shape[-1] / m.sr
        if best is None or sc > best[0]: best = (sc, w)
        print(i, att, round(sc, 2), round(dur, 2), hyp, flush=True)
        if sc >= 0.9 and dur < 1.0 + len(t.split()) * 0.55: break
    ta.save(f'{out}/{i:02d}.wav', best[1], m.sr)
groups, g = [], []
for i, t in enumerate(lines):
    g.append(i)
    if len(g) == 3 or len(' '.join(lines[j] for j in g).split()) > 26 or i == 0 or i == len(lines) - 1: groups.append(g); g = []
if g: groups.append(g)
for g in groups:
    if all(os.path.exists(f'{out}/{i:02d}.wav') for i in g): continue
    if len(g) == 1: single(g[0], lines[g[0]]); continue
    done = False
    for att in range(2):
        text = ' '.join(lines[i] for i in g); w = gen(text, EX); W = words_t(w)
        hw = [norm(x[0]) for x in W]; flat = [(k, n) for k, ws in enumerate(hw) for n in ws]
        ref = [(li, n) for li, i in enumerate(g) for n in norm(lines[i])]
        sm = difflib.SequenceMatcher(None, [n for _, n in ref], [n for _, n in flat]); sc = sm.ratio()
        print(g, att, round(sc, 2), ' '.join(x[0] for x in W), flush=True)
        if sc < 0.88: continue
        # map ref word index -> whisper word index
        mp = {}
        for blk in sm.get_matching_blocks():
            for q in range(blk.size): mp[blk.a + q] = flat[blk.b + q][0]
        cuts, ok, pos = [], True, 0
        for li in range(len(g) - 1):
            n_li = len(norm(lines[g[li]])); last = pos + n_li - 1; first_next = pos + n_li; pos += n_li
            if last not in mp or first_next not in mp: ok = False; break
            e, s2 = W[mp[last]][2], W[mp[first_next]][1]
            cuts.append(int((e + min(s2, e + 0.5)) / 2 * m.sr) if s2 > e else int(e * m.sr))
        if not ok: continue
        b = [0] + cuts + [w.shape[-1]]
        for li, i in enumerate(g): ta.save(f'{out}/{i:02d}.wav', trim(w[:, b[li]:b[li + 1]], m.sr), m.sr)
        done = True; break
    if not done:
        for i in g:
            if not os.path.exists(f'{out}/{i:02d}.wav'): single(i, lines[i])
print('DONE', flush=True)
