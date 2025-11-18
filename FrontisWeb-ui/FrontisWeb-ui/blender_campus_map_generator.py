# Blender campus-from-orthophoto.py
# 用途：基于正射图快速生成校园地形与建筑体块（支持掩模自动化与手工描摹）
# 运行环境：Blender 3.5+
# 使用说明：在 Blender Scripting 面板粘贴此脚本，修改 BASE_DIR 路径，运行

import bpy, bmesh, os, math
from mathutils import Vector

# ============ USER SETTINGS ============
BASE_DIR = r"C:\projects\cdut_map"   # <-- 修改为你本地路径（不要以 / 结尾）
ORTHO_IMG = "ortho.jpg"              # 航拍图
BUILDING_MASK = "building_mask.png"  # 若无则留空 ""
ROAD_MASK = ""                       # 若无则留空 ""
DISPLACE_STRENGTH = 0.6              # 地面位移强度（可调）
VOXEL_SIZE = 6                        # 自动建筑体积粒度 (像素 -> 立方体聚合粗度), 越小越细但越慢
BUILDING_HEIGHT_DEFAULT = 8.0        # 默认楼高（米）
# =======================================

def fullpath(fname): return os.path.join(BASE_DIR, fname)

# ---------- Helper: clear scene ----------
def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    # remove orphans
    for block in bpy.data.meshes:
        if block.users == 0:
            bpy.data.meshes.remove(block)
    for img in bpy.data.images:
        if img.users == 0:
            bpy.data.images.remove(img)

# ---------- Create ground plane with ortho texture ----------
def create_ground(ortho_path):
    # load image
    img = bpy.data.images.load(ortho_path)
    # create plane
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0,0,0))
    ground = bpy.context.active_object
    ground.name = "CampusGround"
    # scale plane to match image aspect ratio
    aspect = img.size[0] / img.size[1]
    ground.scale.x = aspect * 50.0   # scale factor for scene size (adjustable)
    ground.scale.y = 50.0
    bpy.ops.object.transform_apply(scale=True)
    # UV unwrap
    bpy.context.view_layer.objects.active = ground
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.uv.smart_project()
    bpy.ops.object.mode_set(mode='OBJECT')
    # material + image texture
    mat = bpy.data.materials.new("GroundMat")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    tex = mat.node_tree.nodes.new("ShaderNodeTexImage")
    tex.image = img
    mat.node_tree.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
    ground.data.materials.append(mat)
    # add subdivision and displacement
    sub = ground.modifiers.new("Subsurf", "SUBSURF")
    sub.levels = 3
    sub.render_levels = 3
    # create displacement texture from same ortho image's grayscale
    img_tex = bpy.data.textures.new("orthoHeightTex", type='IMAGE')
    img_tex.image = img
    disp = ground.modifiers.new("Displace", "DISPLACE")
    disp.texture = img_tex
    disp.strength = DISPLACE_STRENGTH
    disp.mid_level = 0.0
    disp.texture_coords = 'UV'
    return ground, img

# ---------- Simple voxelization from mask to building blocks ----------
def build_from_mask(mask_path, ortho_img, voxel_px=VOXEL_SIZE):
    img = bpy.data.images.load(mask_path)
    w,h = img.size
    # read pixels into list of brightness per pixel
    px = list(img.pixels)  # rgba rgba ...
    # convert to grayscale brightness (0..1) for each pixel
    bright = [ (px[i*4]+px[i*4+1]+px[i*4+2])/3.0 for i in range(w*h) ]
    # prepare parent collection
    coll = bpy.data.collections.new("AutoBuildings")
    bpy.context.scene.collection.children.link(coll)
    # compute mapping from image pixels to world coordinates
    # ground scale used above: ground dims = aspect*50 by 50 => world_x_per_pixel = (aspect*100)/(w)
    aspect = ortho_img.size[0] / ortho_img.size[1]
    world_w = aspect * 100.0
    world_h = 100.0
    px_w = world_w / w
    px_h = world_h / h
    threshold = 0.5
    created = 0
    # iterate grid with step = voxel_px
    for y in range(0, h, voxel_px):
        for x in range(0, w, voxel_px):
            # sample block average brightness
            s=0; cnt=0
            for yy in range(y, min(y+voxel_px,h)):
                for xx in range(x, min(x+voxel_px,w)):
                    s += bright[yy*w + xx]; cnt += 1
            avg = s/cnt if cnt>0 else 0
            if avg > threshold:
                # create a cube at corresponding position
                wx = (x/w - 0.5) * world_w
                wy = ( (h - y)/h - 0.5) * world_h  # flip y to match image origin
                # create cube
                bpy.ops.mesh.primitive_cube_add(size=1, location=(wx, wy, BUILDING_HEIGHT_DEFAULT/2.0))
                cube = bpy.context.active_object
                cube.scale = (px_w*voxel_px/2.0, px_h*voxel_px/2.0, BUILDING_HEIGHT_DEFAULT/2.0)
                cube.name = f"AB_{x}_{y}"
                # simple material
                mat = bpy.data.materials.get("BuildingMat")
                if not mat:
                    mat = bpy.data.materials.new("BuildingMat")
                    mat.diffuse_color = (0.82,0.82,0.82,1)
                cube.data.materials.append(mat)
                coll.objects.link(cube)
                bpy.context.scene.collection.objects.unlink(cube)
                created += 1
    print(f"Auto-created {created} building blocks from mask.")
    return coll

# ---------- Grease pencil assist: create GP layer for tracing ----------
def create_trace_tools():
    gp = bpy.data.grease_pencil.new("TraceGP")
    layer = gp.layers.new("buildings", set_active=True)
    obj = bpy.data.objects.new("TraceGPObj", gp)
    bpy.context.scene.collection.objects.link(obj)
    # set 2D stroke placement front view for easy tracing
    # Add note to user
    print("Grease Pencil created: 'TraceGPObj'. Switch to 'Top Ortho' view, draw building footprints, then run convert_traces_to_buildings().")

def convert_traces_to_buildings(height=BUILDING_HEIGHT_DEFAULT):
    # Convert active grease pencil strokes (TraceGPObj) to meshes and extrude
    gpobj = bpy.data.objects.get("TraceGPObj")
    if not gpobj:
        print("No TraceGPObj found.")
        return
    # convert each stroke to curve then to mesh: use built-in operator
    bpy.context.view_layer.objects.active = gpobj
    gpobj.select_set(True)
    bpy.ops.object.convert(target='CURVE')
    # now we have curves — convert each to mesh and extrude
    curves = [o for o in bpy.context.selected_objects if o.type=='CURVE']
    created = 0
    for c in curves:
        # set bevel/geometry -> convert to mesh
        bpy.context.view_layer.objects.active = c
        c.select_set(True)
        # convert to mesh
        bpy.ops.object.convert(target='MESH')
        mesh_obj = bpy.context.active_object
        mesh_obj.name = "Footprint"
        # extrude in z by making solidify or extrude via geometry nodes? Use solidify modifier
        mod = mesh_obj.modifiers.new("Solidify", 'SOLIDIFY')
        mod.thickness = height
        # apply transform
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        created += 1
    print(f"Converted {created} traces to solid building volumes.")

# ---------- Export to GLB with materials ----------
def export_to_glb(output_path):
    # Select all mesh objects
    bpy.ops.object.select_all(action='DESELECT')
    for obj in bpy.context.scene.objects:
        if obj.type == 'MESH':
            obj.select_set(True)
    
    # Export
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        export_textures=True,
        export_materials=True,
        export_apply=True
    )
    print(f"Exported to: {output_path}")

# ---------- Main execution ----------
def main():
    clear_scene()
    ortho_path = fullpath(ORTHO_IMG)
    if not os.path.exists(ortho_path):
        raise FileNotFoundError(f"Ortho image not found: {ortho_path}")
    ground, ortho_img = create_ground(ortho_path)
    # optionally build from mask
    bm_path = fullpath(BUILDING_MASK) if BUILDING_MASK else ""
    if bm_path and os.path.exists(bm_path):
        build_from_mask(bm_path, ortho_img, voxel_px=VOXEL_SIZE)
    else:
        create_trace_tools()
    # create simple road material if mask provided
    if ROAD_MASK:
        rm = fullpath(ROAD_MASK)
        if os.path.exists(rm):
            # you can extend to create road extrusions — left as exercise
            print("Road mask found. You can later use it to generate road meshes similarly to buildings.")
    # add sun & camera
    bpy.ops.object.light_add(type='SUN', location=(10, -10, 20))
    sun = bpy.context.active_object
    sun.data.energy = 4.0
    bpy.ops.object.camera_add(location=(60, -80, 60), rotation=(1.0, 0.0, 0.9))
    cam = bpy.context.active_object
    cam.name = "MapCamera"
    bpy.context.scene.camera = cam
    print("Setup complete. If you want to auto-generate buildings, provide building_mask.png and rerun. Otherwise trace with Grease Pencil (Top view) and run convert_traces_to_buildings().")
    print("To export: run export_to_glb(r'C:\\path\\to\\output.glb')")

# call main
main()

