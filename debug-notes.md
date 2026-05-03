# Debug Notes - GLB Model Integration

## Current Status
- GLB model loads successfully (252 bones listed in sidebar)
- Model appears very small in the center of the scene
- Only a small cluster of bones visible (looks like pelvis/sacrum area)
- Issues:
  1. Model scale/position calculation may be off
  2. The mirroring logic might not be working correctly
  3. Need to check how meshes are positioned in the GLB - they might use parent transforms

## Key observations from screenshot:
- The sidebar correctly lists all bones with Chinese/English names
- Region selector on right side works
- 252 bones total (correct - right + mirrored left)
- The visible bones look like real anatomy (not spheres!) - so the GLB is loading

## Fix needed:
- The GLB model's meshes might not have world-space positions baked in
- Need to check if meshes use local coordinates relative to parent groups
- The scale calculation might be dividing by wrong axis
- Mirror logic: need to mirror around the model's center X, not world X=0
