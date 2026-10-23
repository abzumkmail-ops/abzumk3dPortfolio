"""Builds the Cameraman test model on a Roblox R15 rig.

Run with the `bpy` Python module (Blender 5.1):
    python build_cameraman.py            # build + export + previews
    python build_cameraman.py --no-render

Coordinates are in studs, Blender space: +X = character's right,
+Y = character's front (Roblox -Z), +Z = up. Joint positions follow the
blocky R15 rig in source/RobloxR15Rigged.obj (which is at 100 units/stud).
"""
import math
import os
import sys

import bpy  # must come first: it makes bmesh/mathutils importable
import bmesh
import numpy as np
from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
SRC_RIG = os.path.join(HERE, "source", "RobloxR15Rigged.obj")
OUT = os.path.join(HERE, "export")
PREVIEW = os.path.join(HERE, "preview")

# ---------------------------------------------------------------- palette --
# One 4x4 swatch texture; every face's UVs sit in the middle of its swatch,
# so the whole character needs a single texture in Roblox.
PALETTE = [
    ("SUIT", "1d2438"), ("LAPEL", "242e4a"), ("VEST", "2d3a60"), ("SHIRT", "d8e0ee"),
    ("BLACK", "0e1015"), ("SOLE", "26272c"), ("BUCKLE", "a2a8b2"), ("PANTS", "171b2a"),
    ("CREASE", "222840"), ("CAM", "e8eaf0"), ("BEZEL", "7c7f88"), ("SCREEN", "0d0f13"),
    ("LENS", "1b1c20"), ("RIM", "8e9198"), ("BUTTON", "0b0d14"), ("SPARE", "ff00ff"),
]
C = {name: i for i, (name, _) in enumerate(PALETTE)}
SWATCH_PX = 64
GRID = 4


def swatch_uv(index):
    col, row = index % GRID, index // GRID
    return ((col + 0.5) / GRID, 1.0 - (row + 0.5) / GRID)


def make_palette_image():
    size = SWATCH_PX * GRID
    px = np.zeros((size, size, 4), dtype=np.float32)
    for i, (_, hexcol) in enumerate(PALETTE):
        rgb = [int(hexcol[k:k + 2], 16) / 255.0 for k in (0, 2, 4)]
        col, row = i % GRID, i // GRID
        y0 = size - (row + 1) * SWATCH_PX  # image rows start at the bottom
        px[y0:y0 + SWATCH_PX, col * SWATCH_PX:(col + 1) * SWATCH_PX] = rgb + [1.0]
    img = bpy.data.images.new("cameraman_palette", size, size, alpha=False)
    img.pixels.foreach_set(px.ravel())
    img.filepath_raw = os.path.join(OUT, "cameraman_palette.png")
    img.file_format = "PNG"
    img.save()
    return img


# ---------------------------------------------------------------- builder --
class Part:
    """Accumulates colored primitives into one bmesh."""

    def __init__(self, name):
        self.name = name
        self.bm = bmesh.new()
        self.done = self.bm.faces.layers.int.new("done")

    def _tag(self, color):
        for f in self.bm.faces:
            if not f[self.done]:
                f.material_index = color
                f[self.done] = 1

    def box(self, mn, mx, color, bevel=0.0, segs=2):
        center = [(a + b) / 2 for a, b in zip(mn, mx)]
        size = [b - a for a, b in zip(mn, mx)]
        mat = Matrix.Translation(center) @ Matrix.Diagonal((*size, 1.0))
        verts = bmesh.ops.create_cube(self.bm, size=1.0, matrix=mat)["verts"]
        if bevel > 0:
            edges = list({e for v in verts for e in v.link_edges})
            bmesh.ops.bevel(self.bm, geom=edges, offset=bevel, offset_type="OFFSET",
                            segments=segs, profile=0.5, affect="EDGES", clamp_overlap=True)
        self._tag(color)

    def cyl(self, center, axis, r1, r2, depth, color, segs=16, spin=0.0):
        rot = Vector((0, 0, 1)).rotation_difference(Vector(axis).normalized())
        mat = (Matrix.Translation(center) @ rot.to_matrix().to_4x4()
               @ Matrix.Rotation(spin, 4, "Z"))
        bmesh.ops.create_cone(self.bm, cap_ends=True, cap_tris=False, segments=segs,
                              radius1=r1, radius2=r2, depth=depth, matrix=mat)
        self._tag(color)

    def prism(self, poly_xz, y0, y1, color):
        """Extrude a 2D outline drawn on the front (XZ) plane between y0 and y1."""
        front = [self.bm.verts.new((x, y1, z)) for x, z in poly_xz]
        back = [self.bm.verts.new((x, y0, z)) for x, z in poly_xz]
        self.bm.faces.new(front)
        self.bm.faces.new(list(reversed(back)))
        n = len(poly_xz)
        for i in range(n):
            j = (i + 1) % n
            self.bm.faces.new((front[i], back[i], back[j], front[j]))
        self._tag(color)

    def finish(self):
        bm = self.bm
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        ngons = [f for f in bm.faces if len(f.verts) > 4]
        if ngons:
            bmesh.ops.triangulate(bm, faces=ngons)
        uv = bm.loops.layers.uv.new("UVMap")
        for f in bm.faces:
            u = swatch_uv(f.material_index)
            for loop in f.loops:
                loop[uv].uv = u
            f.material_index = 0
        bm.faces.layers.int.remove(self.done)
        me = bpy.data.meshes.new(self.name)
        bm.to_mesh(me)
        bm.free()
        me.shade_smooth()
        me.set_sharp_from_angle(angle=math.radians(35))
        return me


def mirror(poly, sx):
    return [(x * sx, z) for x, z in poly]


# ------------------------------------------------------------------ parts --
FRONT = 0.54  # front face of the jacket


def build_upper_torso():
    p = Part("UpperTorso")
    p.box((-1.03, -0.54, -0.62), (1.03, FRONT, 1.0), C["SUIT"], bevel=0.06)
    # Vest, shirt and tie layered inside the jacket's V opening.
    p.prism([(-0.44, 0.99), (0.44, 0.99), (0.0, -0.25)], FRONT - 0.01, FRONT + 0.012, C["VEST"])
    p.prism([(-0.26, 0.99), (0.26, 0.99), (0.0, 0.40)], FRONT, FRONT + 0.022, C["SHIRT"])
    p.prism([(-0.075, 0.98), (0.075, 0.98), (0.05, 0.86), (-0.05, 0.86)],
            FRONT, FRONT + 0.05, C["BLACK"])
    p.prism([(-0.05, 0.86), (0.05, 0.86), (0.085, 0.50), (0.0, 0.42), (-0.085, 0.50)],
            FRONT, FRONT + 0.042, C["BLACK"])
    for sx in (1, -1):
        p.prism(mirror([(0.075, 0.99), (0.27, 0.99), (0.12, 0.84)], sx),
                FRONT, FRONT + 0.034, C["SHIRT"])  # collar points
        p.prism(mirror([(0.44, 0.99), (0.66, 0.99), (0.69, 0.80), (0.58, 0.74), (0.67, 0.68),
                        (0.22, -0.05), (0.0, -0.25)], sx),
                FRONT - 0.01, FRONT + 0.045, C["LAPEL"])
    for z in (0.20, -0.04):  # vest buttons
        p.cyl((0, FRONT + 0.02, z), (0, 1, 0), 0.03, 0.03, 0.02, C["BUTTON"], segs=10)
    p.cyl((0, FRONT + 0.012, -0.38), (0, 1, 0), 0.045, 0.045, 0.03, C["BUTTON"], segs=12)
    p.box((-0.012, FRONT - 0.01, -0.62), (0.012, FRONT + 0.006, -0.43), C["BUTTON"])  # seam
    # Breast pocket with a pocket square (character's left).
    p.box((-0.86, FRONT - 0.01, 0.40), (-0.58, FRONT + 0.018, 0.46), C["LAPEL"])
    p.prism([(-0.83, 0.46), (-0.63, 0.46), (-0.71, 0.55)], FRONT - 0.01, FRONT + 0.012, C["SHIRT"])
    # Collar: shirt collar ring around the neck, raised jacket collar at the back.
    p.box((-0.30, -0.24, 0.96), (0.30, 0.26, 1.10), C["SHIRT"], bevel=0.03)
    p.box((-0.48, -0.46, 0.96), (0.48, -0.24, 1.15), C["LAPEL"], bevel=0.03)
    p.box((-0.012, -0.55, -0.62), (0.012, -0.53, -0.1), C["BUTTON"])  # back seam
    return p.finish()


def build_lower_torso():
    p = Part("LowerTorso")
    p.box((-1.03, -0.54, -1.0), (1.03, FRONT, -0.58), C["SUIT"], bevel=0.04)
    p.box((-1.05, -0.56, -0.82), (1.05, 0.56, -0.66), C["BLACK"], bevel=0.02)  # belt
    p.box((-0.13, 0.55, -0.85), (0.13, 0.59, -0.63), C["BUCKLE"], bevel=0.015)
    p.box((-0.075, 0.585, -0.80), (0.075, 0.597, -0.68), C["BLACK"])
    for x in (-0.6, 0.6):
        for y0, y1 in ((0.555, 0.575), (-0.575, -0.555)):
            p.box((x - 0.04, y0, -0.86), (x + 0.04, y1, -0.62), C["SUIT"])  # belt loops
    p.box((-0.012, FRONT - 0.01, -1.0), (0.012, FRONT + 0.006, -0.82), C["BUTTON"])
    return p.finish()


def build_arm(side):
    sx = 1 if side == "Right" else -1
    xi, xo = 1.0, 2.05  # inner / outer face of the sleeve (right side)

    def X(a, b):
        return (min(a * sx, b * sx), max(a * sx, b * sx))

    upper = Part(f"{side}UpperArm")
    x0, x1 = X(xi, xo)
    upper.box((x0, -0.55, -0.25), (x1, 0.55, 0.99), C["SUIT"], bevel=0.1, segs=3)

    lower = Part(f"{side}LowerArm")
    x0, x1 = X(xi + 0.01, xo - 0.01)
    lower.box((x0, -0.54, -0.62), (x1, 0.54, 0.30), C["SUIT"], bevel=0.05)
    x0, x1 = X(xi, xo)
    lower.box((x0, -0.555, -0.64), (x1, 0.555, -0.56), C["LAPEL"], bevel=0.02)  # sleeve hem
    for z in (-0.50, -0.42, -0.34):
        lower.cyl(((xo + 0.005) * sx, -0.3, z), (sx, 0, 0), 0.025, 0.025, 0.02,
                  C["BUTTON"], segs=8)
    x0, x1 = X(xi + 0.05, xo - 0.10)
    lower.box((x0, -0.49, -0.74), (x1, 0.49, -0.60), C["SHIRT"], bevel=0.02)  # shirt cuff

    hand = Part(f"{side}Hand")
    x0, x1 = X(1.07, 1.93)
    hand.box((x0, -0.44, -1.0), (x1, 0.44, -0.70), C["BLACK"], bevel=0.05)  # glove
    return upper.finish(), lower.finish(), hand.finish()


def build_leg(side):
    sx = 1 if side == "Right" else -1

    def X(a, b):
        return (min(a * sx, b * sx), max(a * sx, b * sx))

    upper = Part(f"{side}UpperLeg")
    x0, x1 = X(0.015, 1.02)
    upper.box((x0, -0.52, -1.98), (x1, 0.52, -0.82), C["PANTS"], bevel=0.03)
    x0, x1 = X(0.01, 1.045)
    upper.box((x0, -0.555, -1.46), (x1, 0.555, -0.80), C["SUIT"], bevel=0.03)  # coat skirt
    x0, x1 = X(0.35, 0.88)
    upper.box((x0, 0.545, -1.07), (x1, 0.575, -0.98), C["LAPEL"], bevel=0.01)  # pocket flap
    x0, x1 = X(0.488, 0.512)
    upper.box((x0, 0.51, -1.95), (x1, 0.528, -1.46), C["CREASE"])

    lower = Part(f"{side}LowerLeg")
    x0, x1 = X(0.02, 1.0)
    lower.box((x0, -0.51, -2.70), (x1, 0.51, -1.62), C["PANTS"], bevel=0.03)
    x0, x1 = X(0.015, 1.005)
    lower.box((x0, -0.52, -2.77), (x1, 0.52, -2.66), C["PANTS"], bevel=0.02)  # hem
    x0, x1 = X(0.488, 0.512)
    lower.box((x0, 0.50, -2.66), (x1, 0.518, -1.65), C["CREASE"])

    foot = Part(f"{side}Foot")
    x0, x1 = X(0.05, 0.97)
    foot.box((x0, -0.50, -2.93), (x1, 0.60, -2.69), C["BLACK"], bevel=0.08, segs=3)
    x0, x1 = X(0.03, 0.99)
    foot.box((x0, -0.53, -3.0), (x1, 0.64, -2.92), C["SOLE"], bevel=0.02)
    x0, x1 = X(0.32, 0.70)
    foot.box((x0, 0.05, -2.70), (x1, 0.40, -2.675), C["SOLE"], bevel=0.01)  # laces
    return upper.finish(), lower.finish(), foot.finish()


def build_head():
    p = Part("Head")
    p.cyl((0, -0.05, 1.08), (0, 0, 1), 0.17, 0.17, 0.24, C["LENS"], segs=16)  # neck
    p.box((-0.20, -0.30, 1.10), (0.20, 0.12, 1.21), C["BEZEL"], bevel=0.02)  # mount
    # Camera housing with a sun-hood.
    p.box((-0.72, -0.95, 1.18), (0.72, 0.70, 2.32), C["CAM"], bevel=0.08, segs=3)
    p.box((-0.81, -0.99, 2.24), (0.81, 0.93, 2.41), C["CAM"], bevel=0.04)
    # Screen: gray bezel, black display.
    p.box((-0.60, 0.66, 1.32), (0.60, 0.745, 2.14), C["BEZEL"], bevel=0.02)
    p.box((-0.52, 0.70, 1.40), (0.52, 0.755, 2.06), C["SCREEN"])
    p.box((-0.42, -1.0, 1.40), (0.42, -0.93, 2.10), C["BEZEL"], bevel=0.02)  # back plate
    # Lens hanging under the camera, in front of the character's left chest.
    lx, lz = -0.43, 0.84
    p.box((lx - 0.07, 0.62, 1.0), (lx + 0.07, 0.78, 1.21), C["LENS"], bevel=0.015)
    p.cyl((lx, 0.78, lz), (0, 1, 0), 0.17, 0.17, 0.36, C["LENS"], segs=16)
    p.cyl((lx, 0.95, lz), (0, 1, 0), 0.17, 0.25, 0.14, C["RIM"], segs=10, spin=math.pi / 10)
    p.cyl((lx, 1.022, lz), (0, 1, 0), 0.18, 0.18, 0.006, C["SCREEN"], segs=16)
    return p.finish()


def build_root():
    p = Part("HumanoidRootPart")
    p.box((-1, -0.5, -1), (1, 0.5, 1), C["SPARE"])
    return p.finish()


# --------------------------------------------------------------- skeleton --
# name: (parent, head, tail) — heads are the R15 joint pivots.
BONES = {
    "HumanoidRootPart": (None, (0, 0, 0), (0, 0, 0.5)),
    "LowerTorso": ("HumanoidRootPart", (0, 0, -0.8), (0, 0, -0.6)),
    "UpperTorso": ("LowerTorso", (0, 0, -0.6), (0, 0, 1.0)),
    "Head": ("UpperTorso", (0, 0, 1.0), (0, 0, 2.0)),
}
for _side, _sx in (("Right", 1), ("Left", -1)):
    BONES.update({
        f"{_side}UpperArm": ("UpperTorso", (1.5 * _sx, 0, 0.763), (1.5 * _sx, 0, 0.035)),
        f"{_side}LowerArm": (f"{_side}UpperArm", (1.5 * _sx, 0, 0.035), (1.5 * _sx, 0, -0.725)),
        f"{_side}Hand": (f"{_side}LowerArm", (1.5 * _sx, 0, -0.725), (1.5 * _sx, 0, -1.0)),
        f"{_side}UpperLeg": ("LowerTorso", (0.5 * _sx, 0, -1.0), (0.5 * _sx, 0, -1.834)),
        f"{_side}LowerLeg": (f"{_side}UpperLeg", (0.5 * _sx, 0, -1.834), (0.5 * _sx, 0, -2.75)),
        f"{_side}Foot": (f"{_side}LowerLeg", (0.5 * _sx, 0, -2.75), (0.5 * _sx, 0, -3.0)),
    })


def build_armature(coll):
    arm_data = bpy.data.armatures.new("CameramanRig")
    arm = bpy.data.objects.new("Cameraman", arm_data)
    coll.objects.link(arm)
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode="EDIT")
    for name, (parent, head, tail) in BONES.items():
        b = arm_data.edit_bones.new(name)
        b.head, b.tail = head, tail
        if parent:
            b.parent = arm_data.edit_bones[parent]
    bpy.ops.object.mode_set(mode="OBJECT")
    arm_data.display_type = "STICK"
    arm.show_in_front = True
    return arm


# ---------------------------------------------------------------- scene ----
def make_material(img):
    mat = bpy.data.materials.new("Cameraman")
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = img
    tex.interpolation = "Closest"
    nt.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.55
    return mat


def import_reference():
    before = set(bpy.data.objects)
    bpy.ops.wm.obj_import(filepath=SRC_RIG, global_scale=0.01,
                          forward_axis="NEGATIVE_Z", up_axis="Y", use_split_groups=True)
    ref = bpy.data.collections.new("R15_Reference")
    bpy.context.scene.collection.children.link(ref)
    for ob in set(bpy.data.objects) - before:
        for c in ob.users_collection:
            c.objects.unlink(ob)
        ref.objects.link(ob)
        ob.select_set(False)
        # Free the plain R15 names for the real parts.
        ob.name = "REF_" + ob.name
        ob.data.name = ob.name
    return ref


def check_against_reference(ref, parts):
    """Each suit piece should enclose (roughly) its R15 part's box."""
    print("part                suit z-range        rig z-range")
    for ob in ref.objects:
        name = ob.name[4:]
        if name not in parts:
            continue
        rz = [(ob.matrix_world @ v.co).z for v in ob.data.vertices]
        sz = [v.co.z for v in parts[name].data.vertices]
        print(f"{name:18s} {min(sz):6.2f} {max(sz):6.2f}      {min(rz):6.2f} {max(rz):6.2f}")


def build():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(PREVIEW, exist_ok=True)
    scene = bpy.context.scene

    ref = import_reference()
    img = make_palette_image()
    mat = make_material(img)

    coll = bpy.data.collections.new("Cameraman")
    scene.collection.children.link(coll)
    arm = build_armature(coll)

    meshes = [build_root(), build_head(), build_upper_torso(), build_lower_torso()]
    for side in ("Right", "Left"):
        meshes += build_arm(side)
        meshes += build_leg(side)

    parts = {}
    for me in meshes:
        me.materials.append(mat)
        ob = bpy.data.objects.new(me.name, me)
        coll.objects.link(ob)
        ob.parent = arm
        vg = ob.vertex_groups.new(name=me.name)
        vg.add(list(range(len(me.vertices))), 1.0, "REPLACE")
        mod = ob.modifiers.new("Armature", "ARMATURE")
        mod.object = arm
        parts[me.name] = ob
    assert all(ob.name == ob.data.name for ob in parts.values()), "part name collision"
    root = parts["HumanoidRootPart"]
    root.display_type = "WIRE"
    root.hide_render = True

    check_against_reference(ref, parts)
    ref.hide_render = True
    bpy.context.view_layer.layer_collection.children["R15_Reference"].hide_viewport = True

    # Roblox reads Blender scenes at unit scale 0.01 as 1 unit = 1 stud.
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.scale_length = 0.01
    scene.unit_settings.length_unit = "CENTIMETERS"
    return scene, arm, parts


# --------------------------------------------------------------- exports ---
def select_only(objs):
    bpy.ops.object.select_all(action="DESELECT")
    for ob in objs:
        ob.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]


def export(arm, parts):
    select_only([arm, *parts.values()])
    bpy.ops.export_scene.fbx(
        filepath=os.path.join(OUT, "Cameraman_R15.fbx"),
        use_selection=True, object_types={"ARMATURE", "MESH"},
        apply_unit_scale=True, apply_scale_options="FBX_SCALE_UNITS",
        axis_forward="-Z", axis_up="Y", add_leaf_bones=False,
        use_armature_deform_only=True, bake_anim=False,
        mesh_smooth_type="FACE", path_mode="COPY", embed_textures=True)
    # Static OBJ at the same scale/orientation/grouping as the source rig.
    select_only([p for n, p in parts.items() if n != "HumanoidRootPart"])
    bpy.ops.wm.obj_export(
        filepath=os.path.join(OUT, "Cameraman_R15.obj"),
        export_selected_objects=True, global_scale=100.0,
        forward_axis="NEGATIVE_Z", up_axis="Y", export_object_groups=False,
        apply_modifiers=True, export_materials=True, path_mode="COPY")


# --------------------------------------------------------------- renders ---
def setup_render(scene):
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = 48
    scene.cycles.use_denoising = True
    scene.render.resolution_x = scene.render.resolution_y = 1000
    scene.view_settings.view_transform = "Standard"

    world = bpy.data.worlds.new("Studio")
    scene.world = world
    nt = world.node_tree
    bg = nt.nodes["Background"]
    bg.inputs["Strength"].default_value = 0.25
    bg.inputs["Color"].default_value = (0.55, 0.6, 0.8, 1)
    white = nt.nodes.new("ShaderNodeBackground")
    white.inputs["Color"].default_value = (1, 1, 1, 1)
    lp = nt.nodes.new("ShaderNodeLightPath")
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(lp.outputs["Is Camera Ray"], mix.inputs[0])
    nt.links.new(bg.outputs[0], mix.inputs[1])
    nt.links.new(white.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], nt.nodes["World Output"].inputs["Surface"])

    target = bpy.data.objects.new("CamTarget", None)
    scene.collection.objects.link(target)

    def light(name, loc, color, power, size):
        ld = bpy.data.lights.new(name, "AREA")
        ld.color, ld.energy, ld.size = color, power, size
        lo = bpy.data.objects.new(name, ld)
        lo.location = loc
        c = lo.constraints.new("TRACK_TO")
        c.target = target
        scene.collection.objects.link(lo)

    light("Key", (3, 8, 6), (1, 1, 1), 900, 5)
    light("RimPurple", (8, -5, 3), (0.62, 0.38, 1.0), 1400, 4)
    light("RimCyan", (-8, -4, 4), (0.35, 0.75, 1.0), 1400, 4)

    cam_data = bpy.data.cameras.new("Cam")
    cam = bpy.data.objects.new("Cam", cam_data)
    scene.collection.objects.link(cam)
    c = cam.constraints.new("TRACK_TO")
    c.target = target
    scene.camera = cam
    return cam, target


def render(scene, path):
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)


def pose(arm, rots):
    for pb in arm.pose.bones:
        pb.rotation_mode = "XYZ"
        pb.rotation_euler = [math.radians(a) for a in rots.get(pb.name, (0, 0, 0))]


def renders(scene, arm):
    cam, target = setup_render(scene)
    target.location = (0, 0, -0.25)

    # Turnaround in rest pose (orthographic front / side / back).
    cam.data.type = "ORTHO"
    cam.data.ortho_scale = 6.4
    scene.render.resolution_x, scene.render.resolution_y = 700, 1000
    shots = []
    for i, loc in enumerate([(0, 20, -0.25), (20, 0, -0.25), (0, -20, -0.25)]):
        cam.location = loc
        path = os.path.join(PREVIEW, f"_turn{i}.png")
        render(scene, path)
        shots.append(path)
    imgs = [bpy.data.images.load(p) for p in shots]
    w, h = imgs[0].size
    strip = np.concatenate(
        [np.array(im.pixels[:], dtype=np.float32).reshape(h, w, 4) for im in imgs], axis=1)
    out = bpy.data.images.new("turnaround", w * len(imgs), h, alpha=True)
    out.pixels.foreach_set(strip.ravel())
    out.filepath_raw = os.path.join(PREVIEW, "turnaround.png")
    out.file_format = "PNG"
    out.save()
    for p in shots:
        os.remove(p)

    # Hero shot posed like the reference art: proves the rig deforms.
    cam.data.type = "PERSP"
    cam.data.lens = 50
    cam.location = (4.6, 10.0, -1.2)
    scene.render.resolution_x = scene.render.resolution_y = 1000
    pose(arm, {
        "LowerTorso": (0, 0, 12),
        "UpperTorso": (4, 0, -6),
        "Head": (-6, -8, 10),
        "RightUpperArm": (14, -10, -28),
        "RightLowerArm": (22, 0, 0),
        "LeftUpperArm": (-8, 6, 18),
        "LeftLowerArm": (16, 0, 0),
        "RightUpperLeg": (10, 0, -12),
        "RightLowerLeg": (-6, 0, 0),
        "LeftUpperLeg": (-8, 0, 8),
        "LeftLowerLeg": (-4, 0, 0),
        "LeftFoot": (6, 0, 0),
    })
    render(scene, os.path.join(PREVIEW, "hero_pose.png"))
    pose(arm, {})


def main():
    scene, arm, parts = build()
    export(arm, parts)
    if "--no-render" not in sys.argv:
        renders(scene, arm)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "Cameraman_R15.blend"),
                                compress=True)


if __name__ == "__main__":
    main()
