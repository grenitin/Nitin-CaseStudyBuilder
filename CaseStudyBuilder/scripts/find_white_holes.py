import sys
from PIL import Image
import numpy as np

def find_white_holes(image_path):
    img = Image.open(image_path).convert("RGBA")
    data = np.array(img)
    
    # Screen is solid white
    r = data[:, :, 0]
    g = data[:, :, 1]
    b = data[:, :, 2]
    
    white_mask = (r == 255) & (g == 255) & (b == 255)
    
    # Simple bounding box for white pixels
    rows = np.any(white_mask, axis=1)
    cols = np.any(white_mask, axis=0)
    
    if np.any(rows) and np.any(cols):
        ymin, ymax = np.where(rows)[0][[0, -1]]
        xmin, xmax = np.where(cols)[0][[0, -1]]
        print(f"{image_path}: White bounds x={xmin}, y={ymin}, w={xmax-xmin}, h={ymax-ymin}")
    else:
        print(f"{image_path}: No white pixels found!")

find_white_holes("static/img/custom_macbook.png")
find_white_holes("static/img/custom_mobile.png")
find_white_holes("static/img/custom_macbook_mobile.png")
