"""v4 captions (user ref Mildly Elsewhere, 20 Nov): 2-4 words per caption, plain white Poppins Medium, soft drop shadow,
no box/outline colours, centred a bit below the middle. Breaks at punctuation; one line, max ~22 chars (2 lines if longer).
usage: captions_me.py PROJDIR   (reads PROJDIR/words.json -> PROJDIR/subs.ass)"""
import json, re, sys, unicodedata
P = sys.argv[1]; W = json.load(open(f'{P}/words.json'))
for w in W: w['w'] = unicodedata.normalize('NFC', w['w']).replace('…', '').strip()
W = [w for w in W if w['w']]
def ts(s): s = max(0, s); return f"{int(s // 3600)}:{int(s % 3600 // 60):02d}:{s % 60:05.2f}"
chunks, cur = [], []
for i, w in enumerate(W):
    cur.append(w); txt = ' '.join(x['w'] for x in cur)
    nxt = W[i + 1] if i + 1 < len(W) else None
    end_punct = re.search(r'[.,;:!?]$', w['w'])
    if nxt is None or nxt['p'] != w['p'] or end_punct and len(cur) >= 2 or len(cur) >= 4 or len(txt) >= 18 or (end_punct and len(txt) > 8):
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
ev = []
for k, c in enumerate(chunks):
    a = c[0]['s'] - 0.05; b = (chunks[k + 1][0]['s'] - 0.05) if k + 1 < len(chunks) else c[-1]['e'] + 0.6
    if b - a < 0.35: b = a + 0.35
    t = ' '.join(x['w'] for x in c)
    if len(t) > 20 and len(c) > 2: h = len(c) // 2 + len(c) % 2; t = ' '.join(x['w'] for x in c[:h]) + r'\N' + ' '.join(x['w'] for x in c[h:])
    ev.append(f"Dialogue: 0,{ts(a)},{ts(b)},Me,,0,0,0,,{t}")
hdr = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Me,Poppins Medium,84,&H00FFFFFF,&H00FFFFFF,&H50000000,&H96000000,0,0,0,0,100,100,0,0,1,1.5,4,2,70,70,600,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
open(f'{P}/subs.ass', 'w').write(hdr + '\n'.join(ev) + '\n'); print(len(ev), 'captions')
