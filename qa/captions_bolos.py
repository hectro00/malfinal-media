"""Bolos-style captions: 1-2 words, UPPERCASE, Poppins 112 white, dark outline 11, pop-in. usage: captions_bolos.py PROJDIR [OUT]"""
import json, re, sys, unicodedata
P = sys.argv[1]; OUT = sys.argv[2] if len(sys.argv) > 2 else f'{P}/subs.ass'
W = json.load(open(f'{P}/words.json'))
for w in W: w['w'] = unicodedata.normalize('NFC', w['w']).replace('…', '').strip()
W = [w for w in W if w['w']]
ts = lambda s: f"{int(max(0,s) // 3600)}:{int(max(0,s) % 3600 // 60):02d}:{max(0,s) % 60:05.2f}"
chunks, cur = [], []
for i, w in enumerate(W):
    cur.append(w); nxt = W[i + 1] if i + 1 < len(W) else None; txt = ' '.join(x['w'] for x in cur)
    if nxt is None or nxt['p'] != w['p'] or re.search(r'[.,;:!?]$', w['w']) or len(cur) >= 2 or len(txt) >= 11 or (nxt and len(txt + nxt['w']) > 13):
        chunks.append(cur); cur = []
hdr = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: B,Poppins,112,&H00FFFFFF,&H00FFFFFF,&H00141414,&H64000000,-1,0,0,0,100,100,1,0,1,11,4,2,60,60,520,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
L = []
for k, c in enumerate(chunks):
    s = c[0]['s']; e = chunks[k + 1][0]['s'] if k + 1 < len(chunks) and chunks[k + 1][0]['p'] == c[-1]['p'] else c[-1].get('e', c[-1]['s'] + 0.5) + 0.15
    txt = re.sub(r'[.,;:]+$', '', ' '.join(x['w'] for x in c)).upper()
    L.append(f"Dialogue: 0,{ts(s)},{ts(e)},B,,0,0,0,,{{\\fscx80\\fscy80\\t(0,90,\\fscx100\\fscy100)}}{txt}")
open(OUT, 'w').write(hdr + '\n'.join(L) + '\n'); print(len(L), 'captions ->', OUT)
