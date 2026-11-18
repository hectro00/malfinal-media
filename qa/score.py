#!/usr/bin/env python3
"""Objective QA of a FINISHED short (v3, 17 Nov).  usage: score.py final.mp4 PROJECT_DIR [out.json]
PROJECT_DIR must hold script.txt and web/timing.json.  Prints measurements + automatic points; the reviewer
(you, in-session) adds the judgement points with qa/QA_RUBRIC.md and writes the total.
Hard gates (any FAIL = do not publish, fix first): duration, loudness, true peak, resolution, size,
black frames, long silences, caption file present, hook line length."""
import json, os, re, subprocess, sys
import numpy as np
F, P = sys.argv[1], sys.argv[2]; OUT = sys.argv[3] if len(sys.argv) > 3 else os.path.join(P, 'qa_auto.json')
run = lambda c: subprocess.run(c, shell=True, capture_output=True, text=True)
def probe(q): return run(f'ffprobe -v error {q} -of csv=p=0 "{F}"').stdout.strip()
dur = float(probe('-show_entries format=duration'))
w, h = map(int, probe('-select_streams v:0 -show_entries stream=width,height').split(','))
size_mb = os.path.getsize(F) / 1e6
# loudness
ln = run(f'ffmpeg -nostats -i "{F}" -af ebur128=peak=true -f null - 2>&1').stdout + run(f'ffmpeg -nostats -i "{F}" -af ebur128=peak=true -f null -').stderr
I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', ln)[-1]); TP = float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', ln)[-1])
# black frames
bl = run(f'ffmpeg -nostats -i "{F}" -vf blackdetect=d=0.3:pix_th=0.08 -an -f null -').stderr
blacks = re.findall(r'black_start:([\d.]+) black_end:([\d.]+)', bl)
# long silences (> 1.2 s) inside the voiced part
sl = run(f'ffmpeg -nostats -i "{F}" -af silencedetect=n=-40dB:d=1.2 -f null -').stderr
sil = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', sl)]
T = json.load(open(os.path.join(P, 'web/timing.json'))); last_voice = T['phrases'][-1]['end']
sil_inside = [s for s in sil if 0.5 < s < last_voice - 0.5]
# cuts / visual changes per minute + first-2-seconds motion
sc = run(f'ffmpeg -nostats -i "{F}" -vf "scale=270:-1,select=\'gt(scene,0.28)\',showinfo" -an -f null -').stderr
cuts = [float(x) for x in re.findall(r'pts_time:([\d.]+)', sc)]
cpm = len(cuts) / dur * 60
gaps = np.diff([0] + cuts + [dur]); longest_static = float(gaps.max()) if len(gaps) else dur
# motion energy in the first 2 s (mean abs frame diff, 0..255)
try:
    b = subprocess.run(f'ffmpeg -v error -t 2.0 -i "{F}" -vf scale=96:170,format=gray -f rawvideo -', shell=True, capture_output=True).stdout
    fr = np.frombuffer(b, np.uint8).reshape(-1, 170, 96).astype(np.float32); motion0 = float(np.abs(np.diff(fr, axis=0)).mean()) if len(fr) > 1 else 0.0
except Exception: motion0 = 0.0
lines = [l.strip() for l in open(os.path.join(P, 'script.txt'), encoding='utf-8') if l.strip()]
hook_words = len(lines[0].split())
caps = os.path.exists(os.path.join(P, 'subs.ass')) or any(f.endswith('.ass') for f in os.listdir(P))
gates = {
  'duration_62_75s': 62 <= dur <= 75.5, 'res_1080x1920': (w, h) == (1080, 1920), 'size_lt_95MB': size_mb < 95,
  'loudness_-14±1.5': abs(I + 14) <= 1.5, 'true_peak_le_-1': TP <= -0.8, 'no_black_gt_0.3s': not blacks,
  'no_silence_gt_1.2s_in_voice': not sil_inside, 'captions_present': caps, 'hook_line_le_10_words': hook_words <= 10}
# automatic points (part of "Edición y ritmo" 10 and "Calidad visual" 15; the rest is judged with the rubric)
edit_pts = (4 if cpm >= 24 else 3 if cpm >= 18 else 2 if cpm >= 12 else 0) + (3 if longest_static <= 3.5 else 2 if longest_static <= 5 else 0) + (3 if motion0 >= 6 else 2 if motion0 >= 3 else 0)
res = {'file': F, 'duration': round(dur, 2), 'size_mb': round(size_mb, 1), 'lufs': I, 'true_peak': TP, 'blacks': blacks,
       'silences_in_voice': sil_inside, 'cuts': len(cuts), 'cuts_per_min': round(cpm, 1), 'longest_static_s': round(longest_static, 2),
       'motion_first_2s': round(motion0, 2), 'hook_words': hook_words, 'gates': gates, 'all_gates_pass': all(gates.values()),
       'auto_points': {'edicion_ritmo_of_10': edit_pts}}
json.dump(res, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(json.dumps(res, indent=1, ensure_ascii=False))
