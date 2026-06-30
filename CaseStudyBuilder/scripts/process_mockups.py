import sys
from PIL import Image
import numpy as np

def process_mockup(in_path, out_path, is_macbook=False):
    img = Image.open(in_path).convert("RGBA")
    data = np.array(img)
    
    # Extract R, G, B, A
    r = data[:, :, 0]
    g = data[:, :, 1]
    b = data[:, :, 2]
    a = data[:, :, 3]
    
    # 1. Remove White Background
    # Define "white" as RGB all > 230 and difference between them is small
    white_mask = (r > 220) & (g > 220) & (b > 220)
    
    # To handle anti-aliased edges, we can do a softer alpha transition, 
    # but a simple cutoff with a tiny morphological erode is easiest.
    # We will just make pixels transparent if they are very bright and desaturated.
    # Let's use a simpler approach: distance from white
    dist_from_white = np.sqrt((255-r)**2 + (255-g)**2 + (255-b)**2)
    # The higher the distance, the more opaque.
    # Pure white (dist=0) -> alpha=0.
    # Dist=50 -> alpha=255.
    new_alpha = np.clip(dist_from_white * 4, 0, 255).astype(np.uint8)
    
    # Let's just do a hard mask for the background for a cleaner edge, since it's a solid white BG.
    hard_white_mask = (r > 235) & (g > 235) & (b > 235)
    a[hard_white_mask] = 0
    
    # Fix the shadow underneath - we can just drop it entirely and add our own later.
    
    # 2. Find the Green Screen bounds
    # Green screen is high green, low red, low blue.
    green_mask = (g > 150) & (r < 100) & (b < 100)
    
    # Find bounding box of green screen
    rows = np.any(green_mask, axis=1)
    cols = np.any(green_mask, axis=0)
    ymin, ymax = np.where(rows)[0][[0, -1]]
    xmin, xmax = np.where(cols)[0][[0, -1]]
    
    # Turn the green screen transparent so we can paste UI behind it!
    # This keeps the nice anti-aliased black bezels around the green screen.
    a[green_mask] = 0
    
    # Combine back
    data[:, :, 3] = a
    
    # Save the processed image
    out_img = Image.fromarray(data)
    
    # Save metadata about the screen bounds
    print(f"{in_path} screen bounds: x={xmin}, y={ymin}, w={xmax-xmin}, h={ymax-ymin}")
    
    out_img.save(out_path)

if __name__ == "__main__":
    mac_in = "/Users/ni3_kr/.gemini/antigravity-ide/brain/a5521240-0802-4417-9287-69159ac33274/realistic_macbook_1779378661445.png"
    mac_out = "/Users/ni3_kr/Documents/UX/CaseStudyBuilder/static/img/macbook_ai_frame.png"
    process_mockup(mac_in, mac_out, True)
    
    ip_in = "/Users/ni3_kr/.gemini/antigravity-ide/brain/a5521240-0802-4417-9287-69159ac33274/realistic_iphone_1779378684132.png"
    ip_out = "/Users/ni3_kr/Documents/UX/CaseStudyBuilder/static/img/iphone_ai_frame.png"
    process_mockup(ip_in, ip_out, False)
