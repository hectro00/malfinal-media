#!/bin/bash
# finish2.sh PROJ AUDIO.wav  : PROJ/frames/*.jpg (any width) + mastered audio -> PROJ/out/final.mp4 (1080x1920, subs burned)
set -e; P=$1; A=$2; mkdir -p $P/out
# v3 series identity: SERIES=N burns "MUERTES ABSURDAS #N" (top-left 0–1.8 s and on the last 2.5 s)
TAG=""; if [ -n "$SERIES" ]; then D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $A); FN=/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf
  TAG=",drawtext=fontfile=$FN:text='MUERTES ABSURDAS #$SERIES':fontsize=46:fontcolor=white:borderw=6:bordercolor=black@0.9:box=1:boxcolor=0xD7262A@0.92:boxborderw=18:x=50:y=150:enable='lt(t,1.8)+gt(t,$(python3 -c "print($D-2.5)"))'"; fi
# v3 hook text readable on mute: HOOK="LINE1|LINE2" burns big centered text for the first 2.6 s
if [ -n "$HOOK" ]; then echo "$HOOK" | tr '|' '\n' > $P/out/hook.txt; FB=/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf
  TAG="$TAG,drawtext=fontfile=$FB:textfile=$P/out/hook.txt:fontsize=92:line_spacing=10:fontcolor=white:borderw=10:bordercolor=black:box=1:boxcolor=0xD7262A@0.95:boxborderw=26:x=(w-text_w)/2:y=270:enable='lt(t,2.6)'"; fi
# v3 pacing: PUNCH=1 adds a 1.12x punch-in on the second half of every phrase longer than 3.2 s (a visual change, no re-render)
PZ=""; if [ -n "$PUNCH" ]; then EN=$(python3 -c "
import json;t=json.load(open('$P/web/timing.json'))
r=[(p['start']+(p['end']-p['start'])*0.5,p['end']) for p in t['phrases'] if p['end']-p['start']>3.2]
print('+'.join(f'between(t,{a:.2f},{b:.2f})' for a,b in r) or '0')"); PZ="split[pa][pb];[pb]scale=iw*1.12:ih*1.12,crop=1080:1920[pz];[pa][pz]overlay=0:0:enable='$EN',"; fi
ffmpeg -y -loglevel error -framerate 30 -i $P/frames/f%04d.jpg -i $A \
  -vf "scale=1080:1920:flags=lanczos,${PZ}unsharp=5:5:0.55:5:5:0.0,ass=$P/subs.ass$TAG" -c:v libx264 -preset veryfast -crf 22 -maxrate 4.5M -bufsize 9M -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest -movflags +faststart $P/out/final.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 $P/out/final.mp4
ffmpeg -y -loglevel error -i $P/out/final.mp4 -vf "fps=1/3,scale=216:384,tile=7x3" -frames:v 1 $P/out/qa_sheet.jpg
