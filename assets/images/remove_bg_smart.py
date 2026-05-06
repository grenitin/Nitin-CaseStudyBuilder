from PIL import Image, ImageDraw

def remove_background(input_path, output_path):
    print(f"Opening {input_path}...")
    img = Image.open(input_path).convert("RGBA")
    
    # We will use flood fill to replace the background with transparent.
    # To do this safely, we find the background color from the top-left corner.
    # But wait, floodfill in PIL doesn't directly support RGBA transparency well.
    # It's better to flood fill a mask.
    
    # Create a mask of the same size, initialized to 0 (black)
    mask = Image.new('L', img.size, 0)
    
    # We can flood fill the original image using a magic wand approach, but let's do something simpler:
    # We create a temporary image with a border, flood fill from 0,0 with a specific color (e.g. MAGENTA),
    # then iterate and replace MAGENTA with transparent.
    
    img_copy = img.copy().convert("RGB")
    ImageDraw.floodfill(img_copy, (0, 0), (255, 0, 255), thresh=20)
    # Also floodfill other corners just in case
    w, h = img_copy.size
    ImageDraw.floodfill(img_copy, (w-1, 0), (255, 0, 255), thresh=20)
    ImageDraw.floodfill(img_copy, (0, h-1), (255, 0, 255), thresh=20)
    ImageDraw.floodfill(img_copy, (w-1, h-1), (255, 0, 255), thresh=20)
    
    # Now build the new RGBA image
    datas = img.getdata()
    flood_datas = img_copy.getdata()
    
    newData = []
    for i, item in enumerate(datas):
        if flood_datas[i] == (255, 0, 255):
            newData.append((0, 0, 0, 0)) # transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    # Let's crop the transparent bounding box
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved transparent PNG to {output_path}")

import os
assets_dir = "/Users/ni3_kr/Documents/UX/Portfolio Website/assets/images"
input_file = os.path.join(assets_dir, 'fipa_laptop_dark.png')
output_file = os.path.join(assets_dir, 'fipa_laptop_dark_trans.png')

remove_background(input_file, output_file)
