# Debug Notes 2

The model still shows only a small cluster (looks like pelvis/sacrum area). The issue is likely:

1. The GLB model has 144 mesh nodes total
2. Our boneMapping has entries for many of them, but maybe the node names don't match exactly
3. The scene.traverse might not be finding meshes because they're children of group nodes

Key insight from the Python analysis:
- Scene root nodes are: 36 (Bones), 135 (Bones_right), 146 (Cartilages_right)
- These are GROUP nodes (mesh=None) with children that have meshes
- Three.js useGLTF should traverse all children correctly

The real issue: The screenshot shows the model IS rendering (it's a real bone shape, not a sphere), 
but it's only showing a few bones. This means most bones in the mapping are NOT being found.

Let me check: the mapping has 144 entries but only some are rendering. 
The bones that ARE rendering look like they're from the "Bones" group (midline/axial).
The "Bones_right" group bones might not be matching.

Wait - looking more carefully at the screenshot, it looks like the sacrum/pelvis area which 
is actually correctly positioned. The camera is looking at y=3.8 but the model center is at 
y=0.857*4.7 = 4.03. So the camera should see the model.

The REAL problem: the camera is at [4,5,6] looking at [0,3.8,0]. The model is only 1.7m * 4.7 = 8 units tall.
But the model is rendering at the correct position - we can see bones.
The issue is that only SOME bones are visible - likely only the ones from "Bones" group (36 midline bones).

The "Bones_right" (98 bones) and "Cartilages_right" (10 bones) might have name mismatches.
Need to add a debug log to see which bones are actually matched.
