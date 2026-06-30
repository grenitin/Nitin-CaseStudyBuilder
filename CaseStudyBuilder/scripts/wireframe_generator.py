import sys
import os
import glob
from PIL import Image, ImageDraw

def generate_wireframe(input_path, output_path, is_mobile=False):
    if not os.path.exists(input_path):
        return False
        
    try:
        img = Image.open(input_path).convert('RGB')
        
        # Scale for processing
        if is_mobile:
            scale = 400 / img.width
            target_w = 400
        else:
            scale = 800 / img.width
            target_w = 800
            
        target_h = int(img.height * scale)
        img_small = img.resize((target_w, target_h))
        gray = img_small.convert('L')
        pixels = gray.load()

        # Simple block detection
        w, h = gray.size
        cell_size = 10
        grid_w, grid_h = w // cell_size, h // cell_size
        active = [[False for _ in range(grid_w)] for _ in range(grid_h)]

        for cy in range(grid_h):
            for cx in range(grid_w):
                vals = []
                for y in range(cell_size):
                    for x in range(cell_size):
                        vals.append(pixels[cx*cell_size + x, cy*cell_size + y])
                mean = sum(vals)/len(vals)
                var = sum((v - mean)**2 for v in vals)/len(vals)
                if var > 80: # Threshold for content
                    active[cy][cx] = True

        boxes = []
        visited = [[False for _ in range(grid_w)] for _ in range(grid_h)]

        for cy in range(grid_h):
            for cx in range(grid_w):
                if active[cy][cx] and not visited[cy][cx]:
                    min_x, max_x = cx, cx
                    min_y, max_y = cy, cy
                    q = [(cx, cy)]
                    visited[cy][cx] = True
                    
                    while q:
                        nx, ny = q.pop(0)
                        min_x = min(min_x, nx)
                        max_x = max(max_x, nx)
                        min_y = min(min_y, ny)
                        max_y = max(max_y, ny)
                        
                        for dx, dy in [(1,0), (-1,0), (0,1), (0,-1), (1,1), (-1,-1), (1,-1), (-1,1)]:
                            if 0 <= nx+dx < grid_w and 0 <= ny+dy < grid_h:
                                if active[ny+dy][nx+dx] and not visited[ny+dy][nx+dx]:
                                    visited[ny+dy][nx+dx] = True
                                    q.append((nx+dx, ny+dy))
                    
                    # Filter out tiny noise blocks
                    if (max_x - min_x) > 1 or (max_y - min_y) > 1:
                        boxes.append((min_x*cell_size, min_y*cell_size, (max_x+1)*cell_size, (max_y+1)*cell_size))

        # Draw wireframe
        wireframe = Image.new('RGB', (target_w, target_h), 'white')
        draw = ImageDraw.Draw(wireframe)
        
        # Draw Browser Chrome if Web
        if not is_mobile:
            draw.rectangle([0, 0, target_w-1, target_h-1], outline='black', width=3)
            draw.rectangle([0, 0, target_w, 30], fill='#e0e0e0', outline='black', width=2)
            draw.text((target_w/2 - 30, 8), 'Browser', fill='black')
            draw.line([target_w-25, 5, target_w-10, 25], fill='black', width=2)
            draw.line([target_w-25, 25, target_w-10, 5], fill='black', width=2)
            
            # Adjust boxes so they don't overlap the chrome
            adjusted_boxes = []
            for box in boxes:
                adjusted_boxes.append((box[0], max(35, box[1]), box[2], max(35, box[3])))
            boxes = adjusted_boxes

        for box in boxes:
            bw = box[2] - box[0]
            bh = box[3] - box[1]
            
            # If the block is tall enough, treat as an image placeholder with X
            if bh > 60:
                draw.rectangle(box, outline='black', width=2, fill='#f9f9f9')
                draw.line([box[0], box[1], box[2], box[3]], fill='#a0a0a0', width=1)
                draw.line([box[0], box[3], box[2], box[1]], fill='#a0a0a0', width=1)
            else:
                # Treat as text placeholder (horizontal bars)
                for ty in range(int(box[1]), int(box[3]), 15):
                    if ty + 10 <= box[3]:
                        draw.rectangle([box[0], ty, box[2], ty+10], fill='#d0d0d0')
                        
        wireframe.save(output_path)
        return True
    except Exception as e:
        print(f"Failed to generate wireframe for {input_path}: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python wireframe_generator.py <platform> <ui_path> <output_dir>")
        sys.exit(1)
        
    platform = sys.argv[1]
    ui_path = sys.argv[2]
    out_dir = sys.argv[3]
    
    os.makedirs(out_dir, exist_ok=True)
    is_mobile = (platform == 'mobile')
    
    # Generate 4 wireframes based on the 4 scrolling screenshots
    for i in range(4):
        in_path = ui_path.replace('.png', f'_{i}.png')
        out_path = os.path.join(out_dir, f'low_fi_ai_{i}.png')
        generate_wireframe(in_path, out_path, is_mobile)
        
    print("Wireframes generated successfully!")
