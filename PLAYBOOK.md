# Mal Final: autopilot (scheduled task)

Goal: the next 3 slots (~24 h) must ALWAYS have a short scheduled (Buffer for YT/TikTok/IG + Make for the Facebook page; see PUBLISHING ROUTES).
**Rhythm: 3 videos per day** (user decision, 11 Nov evening): **Mon–Fri 12:00, 18:00, 20:30 · Sat 11:00, 17:00, 20:00 · Sun 09:00, 13:00, 19:00**. Target: get each video as close to 10 as possible.
Each video passes through a **pre-production filter** (self-review against the real metrics).

## CREDIT SAVING (user decision 14 Nov: save credits WITHOUT lowering quality)
- **1 run per day** (14:47 Monterrey) producing up to 3 videos, instead of 3 runs of 1.
- **No reviewer subagents** (each starts cold and re-reads everything). You do every review yourself, in-session, with the same checklists (`qa/review_prompt.md`, `qa/RICK_STYLE.md`, `qa/LESSONS.md`) and the same score thresholds.
- **Early exit**: if no post can be published (Buffer connector missing/full and no other route) and there are already ≥ 3 videos `pendiente de publicar`, do NOT produce, NO analytics, NO idea research: just commit nothing and write the 3-line summary. Never make videos that nobody can publish.
- Renders: wait with ONE until-loop/Monitor that checks every ~10 min; don't poll in short intervals or print logs. While video N renders, write the script/TTS/plan of video N+1 (no stills while rendering).
- Read only what you need: PLAYBOOK + LESSONS + RICK_STYLE + insights; open example scenes only for the part you are copying.

## Hard rules (from the user)
- Spanish channel "morbo educativo": real, absurd deaths, **no gore**. The moment of death is implied (cut away, hat, dust, flash).
- Mark every video as AI on all 4 networks:
  - `isAiGeneratedContent` (YouTube)
  - `isAigc` (TikTok)
  - `isAiGenerated` (Instagram)
  - the text "Animación hecha con apoyo de IA." in the copy
- Budget:
  - Don't buy or sign up for anything.
  - Don't clone real voices: use only the reference voices in `tts/`.
  - No bots, no bought engagement.
- Don't copy third-party characters or styles. Only use free CC0 assets.
- Never enter passwords. The user's email is private.
- Each video gets at most 1 attempt + 1 maximized redo. After that it gets published whether it passes or not.

## 0. Setup
```
git clone --depth 1 --single-branch -b pipeline https://github.com/nuncaverso-sketch/malfinal-media pipeline
cd pipeline && bash setup.sh && cd engine && npm i --silent three@0.187.0 puppeteer-core@25.16.0
```

## PUBLISHING ROUTES (user decision 15 Nov)
- **Shorts → Buffer** (connector `Buffer`, org `6af9e73c9f120babfafe21fe`, tz America/Monterrey = same clock as Mexico City). Channels: YouTube `6af9e798ece6dfde5fd51537`, TikTok `6af9e836ece6dfde5fd51f21`, Instagram `6af9e755ece6dfde5fd510c7`. One `create_post` PER channel, `mode: customScheduled`, `dueAt` = slot with offset `-06:00`, `schedulingType: automatic`, video asset = raw GitHub URL.
  - YouTube: `metadata.youtube {title: hookA, categoryId: "27", madeForKids: false, isAiGenerated: true, privacy: "public"}` (Buffer detects Short by itself; tested 15 Nov).
  - TikTok: `metadata.tiktok {title: hookB, isAiGenerated: true}`.
  - Instagram: `metadata.instagram {type: "reel", shouldShareToFeed: true, isAiGenerated: true}`.
  - Text = same copy as before (hook line, hashtags, "Fuente:", "Animación hecha con apoyo de IA.").
  - **Buffer free plan: max 10 scheduled posts in the org (= 3 videos × 3 channels).** So the window is **the next ~24 h (3 slots)**, not 2 days. Check with `list_posts status:[scheduled]` before creating. Never exceed 10; never pay.
  - Record `buffer_ids {yt, tt, ig}` in `state/posts.json`.
- **Facebook (page "Mal Final") → Make** (connector `Make`, free plan 1,000 ops/month; set up 15 Nov). For every short add ONE record to data store **202340** ("MalFinal FB queue", team 3447373) with `data-store-records_create`: `{due: "<slot ISO with -06:00>", url: "<raw GitHub mp4 URL>", description: "<same copy as the other networks>", title: "<hookA>", vid: "VID-..."}`. Scenario **7049351** ("Mal Final → Facebook Reels") runs every hour 08:50–21:45 CDMX, takes the oldest record with `due <= now`, publishes it as a Reel on the page and deletes the record (~3 ops per video). No Metricool needed for Facebook. If a run fails, check `executions_list` for scenario 7049351 and note it in the summary.
- **Weekly compilation → Metricool (YouTube only)**, because it supports the custom thumbnail. If Metricool is at 0, publish it via Buffer YouTube (no custom thumbnail) instead.
- Posts already scheduled in Metricool on all 4 networks (up to Tue 17 Nov) stay as they are; don't duplicate those slots in Buffer.

## 1. Inventory (Buffer + Metricool)
- blogId `8014220`, timezone `America/Mexico_City`.
- Slots (America/Mexico_City): **Mon–Fri 12:00, 18:00, 20:30 · Sat 11:00, 17:00, 20:00 · Sun 09:00, 13:00, 19:00**. The Sunday 13:00 slot ALSO carries the weekly compilation (YouTube only), so it still gets a short.
- Window = the next 3 slots from now. A slot is covered if Buffer (`list_posts` scheduled) OR Metricool (`getScheduledPosts`, all-network posts) already has a short for it.
- `needed = uncovered slots in that window`. If `needed ≤ 0`, do only step 2 and finish.
- **Produce up to `min(needed, 3)` videos per run** (see CREDIT SAVING). Assign them to the earliest free slots.

## 1b. Metricool free-plan limit (user decision, 11 Nov: do NOT pay). Since 15 Nov Metricool is only the weekly compilation
- The free plan allows **20 posts per calendar month**. In November 2026, 13 had already been used as of 11 Nov (faro + 001–012).
- Keep the count in `state/posts.json` → `metricool_month_count` (`{"2026-11": 13}`). Add 1 for each `createScheduledPost`.
- With **2 or fewer** left: tell the user in the final summary ("quedan N publicaciones gratis en Metricool este mes").
- With **0 left**, or if Metricool rejects a post for the limit:
  - do NOT create more posts and do NOT get around the limit;
  - save the finished video to the repo and record it as `pendiente de publicar`;
  - shorts keep going through Buffer; only Facebook pauses until the 1st of next month. Mention it in the summary.
- A new month resets the counter.

## 2. Analytics → `state/insights.md` (filter input)
Pull data with `getAnalyticsDataByMetrics` for the last 14 days:
- **TikTok** `posts`: views, likes, shares, comments, fullVideoWatchedRate, average time watched, forYou.
- **Instagram** `reels`.
- **YouTube** `videos`: if those metrics are deprecated, use the alternatives the tool suggests.

Map each post to its VID by its title or copy, using `state/posts.json`.

Then rewrite `state/insights.md`:
1. A table per video.
2. Top 3 vs bottom 3.
3. **Patterns**: hook type, topic (flood, invention, animal…), era, length, title format, retention.
4. **Concrete rules for the next script**, for example: "hooks that show the absurd object in frame 0 retain +X %".

Don't invent numbers. With fewer than 3 videos that have data, say "insufficient data" and keep the previous rules.

## 3. Idea
- **Backlog**: dashboard artifact `https://claude.ai/artifact/BPtNgZJa9uM6pVFTxi3cvz`, DB collection `ideas` with status `pendiente` (use ArtifactData).
- **If it's empty**: research new stories with WebSearch, using 2 reliable sources. They must be real, absurd and free of gore. Add 3 to the backlog.
- **Prioritize** according to the rules in `insights.md`.

## 4. PRE-PRODUCTION FILTER (reviewer, BEFORE rendering)
Write `script.txt` with these rules:
- **Length 62–75 s** (TikTok Creator Rewards needs more than 1 minute; the user does NOT want shorter videos). 15–20 lines.
- Line 1 = hook with the twist.
- Numbers spelled out so the TTS reads them well.

Also write `plan.md`, with one line per phrase: what is SEEN on screen, the camera, and the key action. It also contains the title, the copy and the hook text (≤ 4 words).

Then review it YOURSELF (no subagent) against `state/insights.md` + `qa/LESSONS.md`: rate 1–10 the hook, clarity of every beat, visual feasibility, and predicted potential based on the metrics; list changes; be strict.

If the score is < 8, apply the changes and re-rate once.

## 4b. A/B hooks (applies to every video)
- Write **2 hooks**: A and B (title + on-screen text of up to 4 words).
- A goes to **YouTube + Facebook** (`youtubeData.title`, `facebookData.title`).
- B goes to **TikTok + Instagram** (`tiktokData.title` and the first line of the copy).
- The on-screen text alternates by video number: even = A, odd = B. Use the same video for all 4 networks.
- Record in `state/posts.json`: `hookA`, `hookB`, `burned: A|B`.
- In step 2, compare retention and views of A vs B against the network average, and keep the winning type in `insights.md`.

## 4c. Recycle what works WITHOUT being repetitive (user: "don't repeat too much")
- Recycle the **hook formula and the narrative structure** of the top performers, NOT the same topic over and over.
- At most 1 of every 4 videos may share a mechanism with the top performer, and never two in a row.
- Rotate country, era, setting and color palette. Don't reuse a set (street, room) that appeared in the last 3 videos.
- The pre-production filter checks this against the last 10 titles in `state/posts.json`.
- Old reference for mechanisms: Examples: absurd floods (beer, syrup), "survived the hard thing and died from the silly thing", "own invention", "his trick/wish came true". Also reuse its winning hook formula.
- The other video explores a new type, so we keep learning.

## 5. Production — ENGINE v2 ("pro" look, user decision 12 Nov: like RicksClips but in Spanish)
**Read `qa/RICK_STYLE.md` first (mandatory style guide).** Reference example (rick style, full pipeline): `engine2/examples/tycho.js` + `tycho_audio.py` (SFX: whoosh at every cut, themed cues) + `tycho_script.txt`. Reference look: RicksClips3000: rich detailed 3D sets, warm/cool cinematic light, shallow depth of field, simple round-head characters with ink outlines, 1–2 word captions, a new shot every ~2–3 s.
Setup once per session: `bash engine2/fetch_assets.sh` (CC0 Quaternius kits + Poly Haven HDRIs) and make sure `engine2/web/node_modules` → `engine/node_modules`.
1. Voice (unchanged, old engine tools): `bash engine/new_project.sh /home/claude/work/VID-XXX 8810` → `script.txt` → `tts/gen_blend.py` → `assemble_voice.py` (gives `voice/voice.wav` + `web/timing.json`) → `audio.py` (SFX cues + music, ducked) → `audio/mix.wav` → master to −14 LUFS as `finish.sh` does (`audio/final.wav`). `words_gen.py` for `words.json`.
2. Visuals: `bash engine2/new_project2.sh /home/claude/v2/NAME`; copy `web/timing.json` and `words.json` into it.
3. Write `web/scene.js` (copy the structure of `engine2/examples/*.js (lully, poleas, pinto, barba, pollo, vapor, abogado)`):
   - `build(K)`: `await K.preloadEnvs(); await K.timing();` then build each SET 200 m apart on x (sets farther than 140 m from the camera are culled automatically).
   - Assets: `await K.placeH('<pack>/<Model>', pos, rotY, heightMeters, {byW, tint})` — list models with `ls assets/quaternius/<pack>` (medieval_village_pack, house_interior_pack, buildings_pack_3, nature_pack, street_pack, rpg_items_pack, survival_pack, animals_pack, crops_pack, modular_medieval_buildings_pack…). Primitives: `K.box / K.cyl / K.sph / K.plane / K.tex(canvas)`; lights `K.pointLight` (few!).
   - Characters: `K.makeChar(K.scene, {shirt, pants, belt, buttons, tie, cape, hat:'top|bowler|cap|helmet|hard|tricorn|crown|chef|wig', hatColor, hair, mustache, beard, glasses, seed})`; per frame `K.poseChar(C, {pos, yaw, walk, run, sit, arms:'point|up|wave|akimbo|shrug|hold|hold2|cross|reach|think|fists|flail|drink|hammer', lean, look, expr:'neutral|happy|laugh|proud|smug|shock|scared|worried|sad|angry|tired', talk, tremble, fall, bounce, sweat, blush}, f)`; props via `C.hold(obj, offset, rot)`.
   - Per frame: pick the phrase `K.at(f)` / progress `K.u(f, i)`; light `K.preset('day|golden|dusk|night|interior|candle|storm', overrides)`; camera `K.move(A, B, u, shake, f)` where A/B come from **`K.frame([feet positions], {yaw, pitch, h, lookY, push, pad})` (auto-fits 9:16 — use it for every character shot)**; `K.focusOn(point)` for depth of field; `K.grade.flash/black/sat/vig`.
   - `hideAll()` at the top of `frame()` must RESET every object you move/scale in any shot (positions, visibility, parents) — a missed reset broke the wings in VID-009.
4. Stills: `node render.mjs st "<frames at 30% and 85% of each phrase>" 360 PORT` + `python3 engine2/sheet.py st sheet.jpg 11` → Read the sheet. Fix: camera inside geometry, characters cut by the 9:16 frame, the key action not visible, giant/tiny props, dark shots.
   - **Polish toward 10 (stills are cheap, renders are not):** review the sheet YOURSELF against `plan.md` + `qa/RICK_STYLE.md` + `qa/LESSONS.md`; 1–10 per shot + overall; apply every change; up to 2 rounds or until overall ≥ 9 and every shot ≥ 8. Re-render stills only for the shots you changed.
5. Render: `RESUME=1 node render.mjs frames 0-99999 720 PORT` in ONE background call (≈1.7 s/frame → 50–65 min for 60–70 s). Never two renders at once; don't run stills while a render is going (it halves the speed).
6. Captions: `python3 qa/captions_gen.py PROJ` (default STYLE=rick: 1–2 words, no hook title). `bash engine2/finish2.sh PROJ audio/final.wav` → `out/final.mp4` (1080×1920, ≤ ~55 MB so GitHub accepts it).

## 6. Post-production review (once)
Apply `qa/review_prompt.md` YOURSELF (no subagent) on a contact sheet of the final video (`ffmpeg -vf fps=1/3,scale=270:-1` → `sheet.py`) + listen-check via loudness/duration stats.
- **PUBLICAR**: go to step 7.
- **REHACER**: one redo applying the whole list, then publish as is.
- Save the scores in `state/posts.json`.

## 7. Publish
1. Upload the MP4 to `main` of `nuncaverso-sketch/malfinal-media` WITHOUT downloading the history:
```
git clone --filter=blob:none --no-checkout --depth 1 https://github.com/nuncaverso-sketch/malfinal-media media && cd media && git sparse-checkout set --no-cone /README.md && git checkout main
cp out/final.mp4 VID-YYYYMMDD-NNN.mp4 && git add VID-*.mp4 && git commit -m "VID-..." && git push
```
2. Check that `https://raw.githubusercontent.com/nuncaverso-sketch/malfinal-media/main/VID-....mp4` returns 200.
3. **Buffer** `create_post` ×3 (YT, TikTok, IG) + **Make** queue record for Facebook, as in PUBLISHING ROUTES. Copy reference: `state/posts.json → example_info`:
   - all 4 networks;
   - the AI flags;
   - hashtags `#historia #datoscuriosos #curiosidades #malfinal #historiasreales`;
   - a "Fuente:" line;
   - YouTube `type: short`, category `EDUCATION`, `madeForKids: false`.
4. Dashboard: in the `videos` collection add `{num, order, title, story, slotAt, status: programado, durationS, platforms}`, and in `ideas` set status `producido`.

## 7b. WEEKLY LONG COMPILATION (YouTube only, for watch hours)
Do this in the **Saturday run (14:47 Monterrey)**, unless `state/posts.json → compilations` already has one for that week. It replaces producing a short in that run.
1. **Items**: the shorts published Sun–Sat of that week, plus older ones if fewer than 8, never repeating the previous compilation's #1.
   - Order them by performance from `insights.md`: worst first, **best LAST**, as #1.
   - Write an `items.json` with `{file, title (no emojis), thumb_frame}`. `file` is the raw MP4 downloaded from `main` (curl).
2. `python3 compile/weekly.py OUT items.json` → `compilation.mp4`, `thumb.jpg`, `chapters.txt`. It takes about 15 min on 2 CPUs; run it in the background.
3. Look at `thumb.jpg` (Read). It needs big readable text and 3 clear frames.
4. Push `VID-COMP-YYYYMMDD.mp4` + `VID-COMP-YYYYMMDD.jpg` to `main` (blobless clone, as in step 7).
5. `createScheduledPost` for **Sunday 13:00**, **YouTube only**:
   - `youtubeData {type: "video", title, category: "EDUCATION", madeForKids: false, isAiGeneratedContent: true}`, plus `videoThumbnailUrl` = the jpg.
   - If it fails because of the thumbnail, retry without it.
   - Copy: hook line, `chapters.txt`, "Fuentes en cada short del canal.", "Animación hecha con apoyo de IA.", hashtags.
   - Title: e.g. "Las N muertes más absurdas de la historia (historias reales)".
   - It counts toward the Metricool limit (1b). Shorts no longer use Metricool, so the 20/month are for compilations.
6. Record it in `state/posts.json → compilations`.

## 8. Save what was learned
Commit and push the `pipeline` branch with:
- `state/insights.md`
- `state/posts.json` (VID → Metricool id/uuid, project, scores)
- `qa/LESSONS.md`, if the reviewer found a new failure

`LESSONS.md` must stay a short checklist.

## 2b. Real retention data
The user may paste YouTube Studio screenshots ("se quedaron para mirar", avg view duration). Those numbers beat any API estimate: put them at the top of `insights.md` and judge scripts against the KPI targets there (stayed ≥ 60 %, avg ≥ 35 s).
