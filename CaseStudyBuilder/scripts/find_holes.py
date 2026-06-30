import sys
from PIL import Image
import numpy as np

def find_holes(image_path):
    img = Image.open(image_path).convert("RGBA")
    data = np.array(img)
    a = data[:, :, 3]
    
    # We are looking for large transparent areas that are surrounded by opaque pixels
    # A simple way: find all transparent pixels
    transparent_mask = (a == 0)
    
    # But the outside of the device is ALSO transparent!
    # So we need to find the bounding box of the device first.
    opaque_mask = (a > 50)
    rows = np.any(opaque_mask, axis=1)
    cols = np.any(opaque_mask, axis=0)
    
    if not np.any(rows) or not np.any(cols):
        print(f"{image_path}: No opaque pixels found!")
        return
        
    ymin, ymax = np.where(rows)[0][[0, -1]]
    xmin, xmax = np.where(cols)[0][[0, -1]]
    
    print(f"\n{image_path}")
    print(f"Device bounds: x={xmin} to {xmax}, y={ymin} to {ymax}")
    
    # Now look for transparent pixels INSIDE the device bounds
    # We can scan the center of the device bounds to find the screen.
    # The screen is usually a large contiguous transparent block.
    
    # Let's just find the bounding box of the transparent pixels within a smaller padded box
    pad = 20
    inner_mask = transparent_mask.copy()
    inner_mask[:ymin+pad, :] = False
    inner_mask[ymax-pad:, :] = False
    inner_mask[:, :xmin+pad] = False
    inner_mask[:, xmax-pad:] = False
    
    if np.any(inner_mask):
        screen_rows = np.any(inner_mask, axis=1)
        screen_cols = np.any(inner_mask, axis=0)
        s_ymin, s_ymax = np.where(screen_rows)[0][[0, -1]]
        s_xmin, s_xmax = np.where(screen_cols)[0][[0, -1]]
        
        print(f"Hole bounds: x={s_xmin}, y={s_ymin}, w={s_xmax-s_xmin}, h={s_ymax-s_ymin}")
    else:
        print("No inner hole found!")

find_holes("static/img/custom_macbook.png")
find_holes("static/img/custom_mobile.png")
find_holes("static/img/custom_macbook_mobile.png")
