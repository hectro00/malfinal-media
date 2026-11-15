#!/bin/bash
# fetch_assets.sh -> pipeline/assets/{quaternius,hdri}  (all CC0: Quaternius packs via github mirror, Poly Haven HDRIs)
set -e; A=$(cd "$(dirname "$0")/.." && pwd)/assets; mkdir -p $A/hdri
if [ ! -d $A/quaternius/medieval_village_pack ]; then
  T=$(mktemp -d); git clone -q --filter=blob:none --no-checkout --depth 1 https://github.com/trebeljahr/quaternius-showcase $T/qs
  (cd $T/qs && git sparse-checkout set --no-cone 'public/glb/*' && git checkout -q) && rm -rf $A/quaternius && cp -r $T/qs/public/glb $A/quaternius && rm -rf $T
fi
for n in venice_sunset kloppenheim_06_puresky qwantani_dusk_2 satara_night_no_lamps blouberg_sunrise_2 lebombo; do [ -s $A/hdri/$n.hdr ] || curl -s -m 60 -o $A/hdri/$n.hdr https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/${n}_1k.hdr; done
mkdir -p $A/tex; for n in wood_floor weathered_brown_planks red_brick castle_brick_02_red medieval_blocks_03 white_plaster_02 beige_wall_001 cobblestone_floor_04 grassy_cobblestone marble_01 rocky_terrain_02 forrest_ground_01 coast_sand_rocks_02 clay_roof_tiles_02 roof_slates_03 dark_wood wood_table_001 stone_tiles_02 rustic_stone_wall_02 sandstone_blocks_05 aerial_grass_rock dirty_carpet painted_plaster_wall brown_planks_03 checkered_pavement_tiles; do for t in diff nor_gl; do [ -s $A/tex/${n}_$t.jpg ] || curl -s -m 60 -f -o $A/tex/${n}_$t.jpg https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/$n/${n}_${t}_1k.jpg || true; done; done
for n in kloofendal_48d_partly_cloudy_puresky belfast_sunset_puresky qwantani_dusk_2_puresky kloppenheim_02_puresky; do [ -s $A/hdri/${n}_2k.hdr ] || curl -s -m 120 -f -o $A/hdri/${n}_2k.hdr https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/${n}_2k.hdr || true; done
cd $(dirname "$0")/web && [ -e node_modules ] || ln -sfn ../../engine/node_modules node_modules
echo ASSETS_OK
