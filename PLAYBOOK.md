# Mal Final: autopilot (scheduled task)

Goal: the next 3 slots (~24 h) must ALWAYS have a short scheduled (Buffer for YT/TikTok/IG + Zapier for the Facebook page; see PUBLISHING ROUTES). USER RULE 18 Nov: 3 VIDEOS PER DAY NO MATTER WHAT — two runs/day (05:47, 14:47); never leave a slot empty if any finished video with QA ≥ 70 exists.
**Rhythm: 3 videos per day** (user decision, 11 Nov evening): **Mon–Fri 12:00, 18:00, 20:30 · Sat 11:00, 17:00, 20:00 · Sun 09:00, 13:00, 19:00**. Target: get each video as close to 10 as possible.
Each video passes through a **pre-production filter** (self-review against the real metrics).

## v3 SYSTEM (user audit, 17 Nov) — overrides anything below that contradicts it
Real data (Buffer, 17 Nov, 16 videos): views are flat (YT ~1.1–1.8k, TikTok 0.6–2.3k, IG 1.3–3k), nothing breaks out. **TikTok average watch 8.5–19.5 s of 62–75 s; IG 19–32 s**; shares ≈ 0, comments 0–2. → The problems are (1) the first 2 s (most people leave at once), (2) the middle (story *told* by a narrator over people standing, not *shown*), (3) no reason to comment/share/follow, (4) same copy on every platform, (5) robotic voice (user).
1. **Voice v3** (implemented in `tts/gen_blend.py` + `engine/assemble_voice.py`): expressive (exaggeration 0.8/0.9, cfg 0.5, temp 0.75), no tempo lift, word tails kept with a soft fade, subtle room. Don't change these back.
2. **Hook v3** — frame 0 is the payoff IN MOTION (the object hitting/falling/flooding, a shocked face mid-reaction) + a 2–4 word on-screen text readable on mute + a hit SFX in the first 0.3 s. Line 1 ≤ 9 words with the contrast. Line 2 = the open loop ("y lo que pasó después es peor"). `qa/score.py` gates the hook length.
3. **Show, don't tell** — `plan.md` must give every line a VISIBLE ACTION (someone doing something, an object moving). ≥ 50 % of shots with action; never 2 consecutive shots from the same set + angle; ≥ 3 sets per video; one visual gag per video. Characters standing and talking is the exception, not the rule.
4. **Structure** (62–75 s, user rule): 0–2 s payoff tease → 2–8 s who/where in one line → build-up with 2 re-hooks ("Pero eso no fue lo peor", "Y aquí todo salió mal") each on a new set → payoff in the last 8–10 s → final line loops to frame 0 + a question that invites a comment (said as the last line OR shown as end text: "¿Tú habrías…?").
5. **Finish** with `SERIES=N HOOK="LÍNEA1|LÍNEA2" PUNCH=1 bash engine2/finish2.sh ...` (series tag, big mute-readable hook text for 2.6 s, punch-ins on long phrases).
5b. **Series identity**: every video shows the tag "MUERTES ABSURDAS #N" (N = video number) for 1 s at the start corner and on the end frame; titles keep the CAPS keyword + one emoji. This gives a reason to follow ("es una serie").
6. **QA 1–100**: `qa/QA_RUBRIC.md` + `python3 qa/score.py out/final.mp4 PROJ`. 90+ publish, 80–89 small fixes, 70–79 one fix round and re-score, < 70 or a failed gate → do NOT publish (pendiente). Save `qa_report.json` and the total in `state/posts.json → qa100`.
7. **Per-platform copy** (step 7): see "Copy v3" in step 7.
8. Facebook goes through Zapier (every short that went out on the other networks, max 2 per run, oldest first; see PUBLISHING ROUTES). YouTube shorts 014–016 show ~0 views in Buffer (unexplained; the user must check them in YouTube Studio): if the next 2 YouTube posts also stay < 20 views after 24 h, write it in the summary.

## PREPARED VIDEOS
If `state/prepared.json` has items, produce those first (script, scene and audio script are ready in engine2/examples). Copy the scene to the project's web/scene.js, run TTS on the script, re-time, stills check (LESSONS 15 Nov), render, publish. Delete the item from prepared.json once scheduled.

## LOCK
If `state/LOCK.json` exists and its `until` is in the future, its `slots` are being produced by another session: treat them as covered (don't produce for them). Delete the lock when it has expired.

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
- **Facebook (page "Mal Final") → Zapier** (connector `Zapier`, free plan 100 tasks/month; works since 18 Nov — Make failed). Zapier posts IMMEDIATELY (no scheduling), so each run posts to Facebook every short that already went out on the other networks and is not yet on Facebook (max 2 per run, oldest first; 3/day ≈ 90 tasks/month, inside the free 100). Call: `execute_zapier_write_action(selected_api="FacebookV2CLIAPI", action="page_video", tool_name="facebook_pages_create_page_video", params={page:"1422365030966009", source:"<raw GitHub mp4 URL>", title:"<hookA>", description:"<IG-style caption with the question + AI label + source>"})` (inspect first if the schema changed). Record `fb_id` in posts.json. Make (scenario 7049351) stays OFF.
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
- Write **2 hooks**: A and B (title + on-screen text of up to 4 words). Each must pass the Hook v3 rules (contrast in ≤ 9 words, readable on mute).
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

## 6. Post-production QA 1–100 (v3, replaces the old review)
Run `python3 qa/score.py out/final.mp4 PROJ`, then score with `qa/QA_RUBRIC.md` on a contact sheet of the FINAL video (`fps=1/2`) + the first 3 s at `fps=10`.
- 90+ → step 7. 80–89 → small fixes without re-render, then step 7. 70–79 → ONE fix round (re-render only the affected phrases), re-score. < 70 or a gate still failing → do NOT publish; status `pendiente`, say why in the summary.
- Save the scores in `state/posts.json`.

## 7. Publish
1. Upload the MP4 to `main` of `nuncaverso-sketch/malfinal-media` WITHOUT downloading the history:
```
git clone --filter=blob:none --no-checkout --depth 1 https://github.com/nuncaverso-sketch/malfinal-media media && cd media && git sparse-checkout set --no-cone /README.md && git checkout main
cp out/final.mp4 VID-YYYYMMDD-NNN.mp4 && git add VID-*.mp4 && git commit -m "VID-..." && git push
```
2. Check that `https://raw.githubusercontent.com/nuncaverso-sketch/malfinal-media/main/VID-....mp4` returns 200.
3. **Buffer** `create_post` ×3 (YT, TikTok, IG) as in PUBLISHING ROUTES (Facebook paused). **Copy v3 — different per platform, never the same text pasted 3 times:**
   - **YouTube**: title = hook A (≤ 55 chars, CAPS keyword, 1 emoji). Description: 2 lines of story + `Muertes absurdas #N` + "Fuente: …" + "Animación hecha con apoyo de IA." + 3 hashtags max: `#muertesabsurdas #historiareal #shorts`.
   - **TikTok**: caption = hook B + a direct question that invites comments ("¿Tú te habrías subido?") + 4–5 niche hashtags: `#muertesabsurdas #historiasreales #datososcuros #curiosidades #malfinal`; `isAiGenerated: true`.
   - **Instagram**: caption = hook B + 1 line of story + "Guárdalo para contárselo a alguien 👀" + `Muertes absurdas #N` + 5 hashtags (`#muertesabsurdas #historiareal #curiosidadeshistoricas #datoscuriosos #malfinal`); the question goes INSIDE the caption (Buffer free plan has no first comment); `isAiGenerated: true`.
   - Generic tags like `#historia` alone are not enough; always include the niche tag `#muertesabsurdas`.
   - YouTube `categoryId: "27"`, `madeForKids: false`, `isAiGenerated: true`.
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

## BUFFER YOUTUBE LIMIT (19 Nov)
- Buffer rejects a 3rd YouTube post on the same calendar day ("maximum number of posts YouTube allows in a day (2)"). So YouTube carries max 2 shorts/day via Buffer; the 3rd daily short goes TikTok+IG(+FB) only, its YT copy is kept as `yt_pending` (use it on a day with a free YT slot or in the compilation). Don't spend Metricool's last free post on it (reserved for the compilation).

## BUFFER ERRORS (18 Nov)
- YouTube sometimes fails with "An unknown error has occurred" (Buffer side, no reason given). At the START of every run: `list_posts` status error → retry each one with `edit_post(mode:"shareNow")`, wait ~3 min, check `sent`. VID-023 failed once and went out fine on retry.
- Always set YouTube `notifySubscribers:false` (the post that failed had true; the ones that worked had false).
- YouTube channel can't be phone-verified (the user's number is already used on 2 accounts) → **YouTube max 2 shorts per UTC day** (00:00–23:59 UTC = 18:00–17:59 CDMX). Per CDMX day: 12:00 slot and 18:00 slot go to YouTube as usual; the 20:30 short goes to TikTok + Instagram + Facebook only and gets a YouTube post the next day only if a YT slot is free (never a 3rd in the same UTC day). Count sent + scheduled YT posts per UTC day before creating one.
