# QA 1–100 (v3, 17 Nov) — every finished video, BEFORE publishing

Run `python3 qa/score.py final.mp4 <project>` → hard gates + measurements + automatic editing points.
Then judge the finished video yourself (contact sheet `fps=1/2` of the FINAL mp4 + first 3 s at `fps=10` + listen to 3 random lines).
Be strict: score what is on screen, not what was intended. Write `qa_report.json` in the project with every number and one line of evidence per category.

| Category | Pts | 100 % looks like | Automatic zero if |
|---|---|---|---|
| Hook (0–3 s) | 20 | Frame 0 already shows the absurd payoff in motion (object/disaster), on-screen text ≤ 4 words readable on mute, line 1 ≤ 9 words with the contrast, SFX hit ≤ 0.5 s | First frame is a static establishing shot, a sign alone, or a character just standing |
| Retention potential | 20 | Open loop promised in line 1–2 and paid in the last 8 s; re-hooks at ~20 s and ~40 s with a new location/zoom; no line that only gives background; every shot ≤ 3 s | Cause of death revealed before the last 10 s |
| Visual quality | 15 | Real textures + photo sky/depth (LESSONS 15 Nov), no clipping, no black/blown frames, faces readable, ≥ 3 different sets, ≥ 50 % of shots show an ACTION (object moving, character doing something) | Any prop passing through a body, a floating box, a black frame |
| Narration & script | 15 | v3 voice (expressive, no dry word endings), natural sentences, facts correct + source, satisfying final line that loops to frame 0 | A mispronounced or missing word, a factual error |
| Editing & rhythm | 10 | `auto_points.edicion_ritmo_of_10` from score.py (cuts/min, longest static shot, motion in first 2 s) | — |
| Originality | 10 | Story/mechanism not used in the last 10 videos, set/palette not used in the last 3, at least one shot nobody else would have (a visual gag) | Same set or mechanism as one of the last 3 videos |
| Title & presentation | 10 | Per-platform copy (PLAYBOOK §7 v3): YT title ≤ 55 chars with CAPS keyword + emoji; TikTok caption = hook + question; IG caption = hook + save/share line; niche hashtags; AI label | Same text pasted on all platforms; generic hashtags only |

Decision (user rule, 17 Nov):
- **90–100** publish. **80–89** publish after small fixes that don't need a re-render (caption timing, copy, mix).
- **70–79** fix the weak categories (re-render only the affected phrases) and score again — at most ONE fix round (credit rule).
- **< 70**, or any hard gate failing after the fix round: do NOT publish. Keep it as `pendiente`, write why in `qa_report.json` and in the run summary.
- Never publish: audio problems, wrong images, captions out of sync, editing glitches.
