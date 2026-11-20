# Lessons from the reviewer (use BEFORE rendering)

Rule (user): each video gets 1 attempt + at most 1 maximized redo, then it gets published whether it passes or not. Avoid re-rendering: get it right on the first try.

## Audio
- Music at ≈ −16 dB, SFX at −14 dB relative to the voice, ducking on the voice, high-pass at 120 Hz on the music.
- Thunder, crashes and big effects go in the PAUSES, never on top of key words.
- TP ≤ −1 dBTP (alimiter 0.8), −14 LUFS.
- Silences inside a phrase compressed to ≤ 0.32 s; gaps between phrases 0.24–0.45 s; tail 0.8 s.
- Whisper check per line: key words (twist, names, "mar", "peor") must come out right; if the TTS gets one wrong, change the wording ("Ni él" instead of the name).

## Subtitles
- 2–4 words, cut on punctuation, minimum 0.5 s, numbers as digits (years and counts), NFC accents.
- Poppins 96, MarginV 560 (rick style: 132 / MarginV 470 keeps them off faces); in shots with a face in the center, move them to the top (\an8).
- Hook title (2.8 s) must NOT repeat the first subtitle, and must not cover signs or text in the scene.

## Image / narrative (the most common failures)
1. **Every key action must be SHOWN on screen**, not implied: the burst, the impact, the fall, the capture, the collapse. A shot ≥ 1.5 s, with no fade on top.
2. **The hook in frame 0 already has action** and is readable in 0.5 s; never start on an empty shot or a white or black flash.
3. **The camera never goes inside geometry** (check houses on both sides, rocks, foam/spray particles near the camera).
4. **Check horizontal framing**: at 9:16 the half-width ≈ distance × tan(fov/2) × 0.5625. Characters outside that range DON'T show up.
5. When the voice mentions someone (the boss, the king, the victims), that character is on screen. When it gives a number ("8 people"), show it (8 figures or 8 candles).
6. Expressions match the moment: no smiles in tragedies (use neutral, nervous, pained or stern).
7. Fluids (water, beer, syrup): animated (bobbing, foam moving, particles), never a static slab.
8. No objects close to the camera covering it (scrolls, logs, foam).
9. Ending with a loop: the last shot cuts to the hook shot.
10. On-screen numbers must match the voice (voice "siete hombres" → sign "HUNLEY + 7", not "8 HOMBRES").
11. A beard on the round-head character reads as a wide grin: skip it when the plan wants a serious/proud face.
12. Recognizable objects: the crown on the head, iron that looks like iron, candles with a flame.
13. Big-head chars: an arm raised straight UP hides behind the head — raise it sideways (z≈2.3) or add an extension. Dead/unconscious = expr 'out' (flat closed eyes), never blink (reads as happy ^^).
14. Props descending onto a head must land exactly at the head anchor (no jump), and seated-on-ground chars need pos.y≈−0.48 + straight shins.

## Length and A/B
- 62–75 s (monetization). Never under 61 s.
- 2 hooks per video (A: YouTube/Facebook, B: TikTok/Instagram).

## Process
- Memory: TTS (chatterbox) uses ~5.7 GB of the 7 GB box → NEVER run Chrome (stills/render) while TTS runs (OOM-killed the TTS on 14 Nov). Do both TTS first, then stills/renders; launch long jobs with setsid nohup.
- Props in hands: `C.hold()` orientation is unreliable; position props each frame at `armR.end.getWorldPosition()` (holdW in examples/anderson.js) with a custom armsOverride.
- Captions: MarginV 600 sits on faces; use MarginV ≈ 360 (size 118). Encode with crf 22 + maxrate 4.5M so 75 s stays < 50 MB.
- Fresh raw.githubusercontent URLs on main can 404 for ~1 min after push (CDN); wait and re-check before scheduling.
- Render watchdog: swiftshader Chrome can hang mid-render (protocol timeout); run renders through a retry loop (timeout per pass + RESUME=1) and re-render only the changed phrase ranges on a redo.
- Stills at 25 % and 80 % of each phrase BEFORE rendering + a stills review loop (up to 3 rounds, target ≥ 9).
- Run measure.py (cheap) on every final video. Only run the reviewer agent on the first attempt of new videos.

## Strict standard (11 Nov, the user didn't like how the videos looked)
- Silent test: every shot must be understandable in 1 s with no sound.
- Something new at least every 2.5 s; never two shots in a row with the same framing; the camera always moving with a purpose.
- No frames of empty floor or wall (one flat color > 45 % of the image). The floor ≤ 35 % of the frame; the subject ≥ 20 % of the height.
- Avoid flat ground: add texture or props, use a low or diagonal camera, put the horizon high or low.
- Variety: don't repeat the mechanism, set or palette of the previous video.
- Publishing threshold: CALIDAD ≥ 8, PEGADA ≥ 8, none < 7. Still the 1 attempt + 1 redo rule, then publish.

## User feedback 15 Nov (realism + polish) — engine v2.2
- Backgrounds must NOT look like flat painted walls: floors/walls/roofs use `K.pbr('<polyhaven texture>', [rx, ry])` (assets/tex, CC0) and exteriors use a real photo sky `K.preset(name, { photo: '<sky>_2k' })` (+ `K.preloadSkies([...])` in build). Add depth: side walls, beams, windows with `K.ray` light shafts, props in mid/background.
- `K.plane` default is a FLOOR (rotated −90°). Vertical walls/boards need `[0, 0, 0]` (or a yaw) as 5th arg — a missing rotation made black frames.
- No clipping: props, benches, aprons, bags must never pass through bodies/heads/camera. No floating boxes as beards/aprons — use the character options (`hair`, `belt`, `buttons`) or skip it.
- Camera: smooth constant drift (engine eases it now), no shake; never inside furniture (check reverse shots from the stage).
- Lights: point lights ≤ 6 near faces; avoid blown-out white faces.
- 16 Nov: chatterbox OOM can kill TTS silently mid-run (no DONE) → always check `ls frases | wc -l` vs lines and rerun (resumable). Whisper "rey"→"ley": rephrase. Banquet scenes: hang chandeliers high (y≈4.9, behind subjects) or they cover faces; candelabras/trays must not sit between camera and faces. Steam spheres read as bubbles with ink lines: ≤6, small, opacity ≤0.2.
- 17 Nov: flying-eagle shots: K.cloud spheres behind the bird fill the frame white and the wing slabs read as boxes — frame birds against open sky (camera below, looking up) and keep wings out of the lens. Night presets need exposure ≥2.2 or shots go black. Container pauses kill background renders: keep waits ≤5 min and restart render_loop (RESUME=1) if pgrep shows none.
- 18 Nov: chatterbox 3-line groups often leave 1–3 s of junk at the START of a split line (line looks 2× too long) → after assemble, Whisper any phrase > 4.5 s and trim the lead with ffmpeg -ss, then re-assemble. Sets 200 m apart are culled by the engine and restored next frame: hide toggled props with scale/position, never `visible=false`. Engine whip blur hits frame 0 if phrase 0 starts < 0.2 s: set `K.grade.whip.value = 0` for f < 10. Big 9:16 rule: K.frame on 3 seated chars puts the camera in the bleachers — use explicit cameras on studio/stage sets.
- 19 Nov: chatterbox OOM-killed even alone (cgroup ~6 GB) → run TTS through a retry loop (resumable) until frases count = lines. Theatre/exterior "golden" preset with belfast sky washes everything white → use day preset + kloofendal sky. Bed shots: character rotation.x=-π/2 puts the head toward −z; film from the side.
- 19 Nov PM: shots whose camera looks TOWARD the sun (day preset sunDir +z) come out milky/washed white — film from the sun side or set `sunDir` overhead ([0.25,1,-0.15]). Thin ribbons/scarves (box 0.015 thick) vanish edge-on: use ≥0.05 thickness + rotateZ after lookAt. Chars seated in a car facing +x need yaw ≈ π/2. Never run Chrome stills/whisper while chatterbox runs (OOM-killed TTS again); TTS while rendering is 5× slower — do TTS first. Media repo sparse clone: `git add --sparse`. Hook word "bufanda" at line start came out "gufanda" → rephrase so the key noun isn't the 2nd word.
- 20 Nov: Buffer's YouTube 2/day limit counts the CDMX calendar day (12:00 + 18:00 CDMX filled it; 20:30 rejected even though it's the next UTC day). Low-door/side shots: walls perpendicular to the camera between camera and subject block the face — keep only the far jamb + lintel; turn walking chars ~0.55 rad toward camera so the face reads in profile. Sky 'kloppenheim_02_puresky' renders as NIGHT with stars (don't use for day). Laurel/crown torus on a big head reads as a burger bun unless thin (tube ≤0.025) and wrapped at h+0.23·scale.
