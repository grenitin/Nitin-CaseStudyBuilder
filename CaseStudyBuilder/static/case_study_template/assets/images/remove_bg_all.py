from PIL import Image, ImageDraw
import os

def remove_background(input_path, output_path):
    print(f"Opening {input_path}...")
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return
        
    img = Image.open(input_path).convert("RGBA")
    
    # Flood fill approach to remove background (assuming background is in corner)
    img_copy = img.copy().convert("RGB")
    ImageDraw.floodfill(img_copy, (0, 0), (255, 0, 255), thresh=30)
    w, h = img_copy.size
    ImageDraw.floodfill(img_copy, (w-1, 0), (255, 0, 255), thresh=30)
    ImageDraw.floodfill(img_copy, (0, h-1), (255, 0, 255), thresh=30)
    ImageDraw.floodfill(img_copy, (w-1, h-1), (255, 0, 255), thresh=30)
    
    datas = img.getdata()
    flood_datas = img_copy.getdata()
    
    newData = []
    for i, item in enumerate(datas):
        if flood_datas[i] == (255, 0, 255):
            newData.append((0, 0, 0, 0)) # transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    # Crop transparent bounding box
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved transparent PNG to {output_path}")

assets_dir = "/Users/ni3_kr/Documents/UX/Portfolio Website/assets/images"
files_to_process = [
    ('fipa_laptop_final.png', 'fipa_laptop_final_trans.png'),
    ('fipa_laptop_dark.png', 'fipa_laptop_dark_trans.png'),
    ('luxetravel_mobile_straight.png', 'luxetravel_mobile_straight_trans.png'),
    ('luxetravel_mobile_straight_dark.png', 'luxetravel_mobile_straight_dark_trans.png')
]

for inp, outp in files_to_process:
    remove_background(os.path.join(assets_dir, inp), os.path.join(assets_dir, outp))
