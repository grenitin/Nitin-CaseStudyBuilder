import sys
import os
from PIL import Image, ImageDraw, ImageFilter

def create_device_frame(screenshot_path):
    """
    Wraps a screenshot in the user's custom iPhone frame.
    """
    try:
        raw_img = Image.open(screenshot_path).convert("RGBA")
    except Exception as e:
        print(f"Error loading screenshot: {e}")
        raw_img = Image.new("RGBA", (390, 844), (20, 20, 20, 255))
        
    frame_path = os.path.join(os.path.dirname(__file__), '..', 'static', 'img', 'custom_mobile.png')
    if not os.path.exists(frame_path):
        print(f"Frame not found at {frame_path}")
        return raw_img
        
    frame = Image.open(frame_path).convert("RGBA")
    
    # Exact Mobile bounds inside the inner black bezel
    # Do not inset, must exactly fill the transparent hole
    SX, SY, SW, SH = 32, 64, 389, 809
    
    # Resize screenshot to fit exactly in bounds
    screen_img = raw_img.resize((SW, SH), Image.Resampling.LANCZOS)
    
    # Punch out white pixels from frame
    import numpy as np
    data = np.array(frame)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    white_mask = (r > 245) & (g > 245) & (b > 245) & (a > 200)
    data[white_mask, 3] = 0
    frame_punched = Image.fromarray(data)
    
    # Create empty canvas size of the frame
    device = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    
    # Paste the screenshot BEHIND
    device.paste(screen_img, (SX, SY))
    
    # Paste the punched frame OVER the screenshot
    device.alpha_composite(frame_punched, (0, 0))
    
    return device

def create_macbook_frame(screenshot_path):
    """
    Wraps a screenshot in the user's custom MacBook Pro frame.
    """
    try:
        raw_img = Image.open(screenshot_path).convert("RGBA")
    except Exception as e:
        print(f"Error loading screenshot: {e}")
        raw_img = Image.new("RGBA", (1440, 900), (20, 20, 20, 255))

    frame_path = os.path.join(os.path.dirname(__file__), '..', 'static', 'img', 'custom_macbook.png')
    if not os.path.exists(frame_path):
        print(f"Frame not found at {frame_path}")
        return raw_img
        
    frame = Image.open(frame_path).convert("RGBA")
    
    # Exact MacBook bounds inside the inner black bezel (ignoring camera notch)
    # Inset by 1 pixel to ensure perfectly hidden corners
    SX, SY, SW, SH = 136, 77, 752, 495
    
    # The screenshot should be center-cropped to the screen aspect ratio
    target_aspect = SW / SH
    img_aspect = raw_img.width / raw_img.height
    
    if img_aspect > target_aspect:
        new_w = int(raw_img.height * target_aspect)
        offset = (raw_img.width - new_w) // 2
        raw_img = raw_img.crop((offset, 0, offset + new_w, raw_img.height))
    else:
        new_h = int(raw_img.width / target_aspect)
        raw_img = raw_img.crop((0, 0, raw_img.width, new_h))
        
    screen_img = raw_img.resize((SW, SH), Image.Resampling.LANCZOS)
    
    # Punch out white pixels from frame
    import numpy as np
    data = np.array(frame)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    white_mask = (r > 245) & (g > 245) & (b > 245) & (a > 200)
    data[white_mask, 3] = 0
    frame_punched = Image.fromarray(data)
    
    device = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    # Paste screenshot BEHIND
    device.paste(screen_img, (SX, SY))
    # Paste punched frame OVER
    device.alpha_composite(frame_punched, (0, 0))
    
    return device

def apply_drop_shadow(image, offset=(0, 20), blur_radius=30, shadow_color=(0, 0, 0, 150)):
    shadow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    alpha = image.split()[3]
    black = Image.new("RGBA", image.size, shadow_color)
    black.putalpha(alpha)
    shadow = black.filter(ImageFilter.GaussianBlur(blur_radius))
    
    pad = blur_radius * 2
    canvas = Image.new("RGBA", (image.width + pad * 2, image.height + pad * 2), (0, 0, 0, 0))
    canvas.paste(shadow, (pad + offset[0], pad + offset[1]), shadow)
    canvas.paste(image, (pad, pad), image)
    return canvas

def build_fanned_mockup(screenshot_path, output_path):
    base_device = create_device_frame(screenshot_path)
    base_device = apply_drop_shadow(base_device, offset=(0, 30), blur_radius=40, shadow_color=(0, 0, 0, 180))
    
    CANVAS_W = 1440
    CANVAS_H = 900
    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    
    DW, DH = base_device.width, base_device.height
    
    positions = [
        {"scale": 0.70, "x": CANVAS_W * 0.15, "y": CANVAS_H * 0.55},
        {"scale": 0.70, "x": CANVAS_W * 0.85, "y": CANVAS_H * 0.55},
        {"scale": 0.82, "x": CANVAS_W * 0.32, "y": CANVAS_H * 0.52},
        {"scale": 0.82, "x": CANVAS_W * 0.68, "y": CANVAS_H * 0.52},
        {"scale": 0.95, "x": CANVAS_W * 0.50, "y": CANVAS_H * 0.48},
    ]
    
    render_order = [0, 1, 2, 3, 4]
    
    for idx in render_order:
        pos = positions[idx]
        scale = pos["scale"]
        new_w, new_h = int(DW * scale), int(DH * scale)
        resized_device = base_device.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        paste_x = int(pos["x"] - (new_w / 2))
        paste_y = int(pos["y"] - (new_h / 2))
        canvas.alpha_composite(resized_device, (paste_x, paste_y))
        
    canvas.save(output_path, "PNG")
    print(f"Mobile mockup generated successfully at {output_path}")

def build_web_single_mockup(desktop_screenshot_path, output_path):
    macbook = create_macbook_frame(desktop_screenshot_path)
    macbook = apply_drop_shadow(macbook, offset=(0, 40), blur_radius=50, shadow_color=(0, 0, 0, 160))
    
    # Scale down slightly to fit well in 1920x1080 canvas
    scale = 0.85
    new_w = int(macbook.width * scale)
    new_h = int(macbook.height * scale)
    macbook = macbook.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    CANVAS_W = 1920
    CANVAS_H = 1080
    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    
    paste_x = (CANVAS_W - new_w) // 2
    paste_y = (CANVAS_H - new_h) // 2
    canvas.alpha_composite(macbook, (paste_x, paste_y))
    
    # Tightly crop the canvas to the bounding box of non-transparent pixels
    bbox = canvas.getbbox()
    if bbox:
        # Add a small padding of 20px
        pad = 20
        bbox = (max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(canvas.width, bbox[2]+pad), min(canvas.height, bbox[3]+pad))
        canvas = canvas.crop(bbox)
    
    canvas.save(output_path, "PNG")
    print(f"Web single mockup generated successfully at {output_path}")

def build_mobile_single_mockup(mobile_screenshot_path, output_path):
    iphone = create_device_frame(mobile_screenshot_path)
    iphone = apply_drop_shadow(iphone, offset=(0, 30), blur_radius=40, shadow_color=(0, 0, 0, 150))
    
    # Scale down slightly to fit well in canvas
    scale = 0.90
    new_w = int(iphone.width * scale)
    new_h = int(iphone.height * scale)
    iphone = iphone.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    CANVAS_W = 1080
    CANVAS_H = 1080
    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    
    paste_x = (CANVAS_W - new_w) // 2
    paste_y = (CANVAS_H - new_h) // 2
    canvas.alpha_composite(iphone, (paste_x, paste_y))
    
    # Tightly crop the canvas to the bounding box of non-transparent pixels
    bbox = canvas.getbbox()
    if bbox:
        # Add a small padding of 20px
        pad = 20
        bbox = (max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(canvas.width, bbox[2]+pad), min(canvas.height, bbox[3]+pad))
        canvas = canvas.crop(bbox)
    
    canvas.save(output_path, "PNG")
    print(f"Mobile single mockup generated successfully at {output_path}")

def build_web_responsive_mockup(desktop_screenshot_path, mobile_screenshot_path, output_path):
    macbook = create_macbook_frame(desktop_screenshot_path)
    iphone = create_device_frame(mobile_screenshot_path)
    
    # Apply shadows removed per user request
    # macbook = apply_drop_shadow(macbook, offset=(0, 40), blur_radius=50, shadow_color=(0, 0, 0, 150))
    # iphone = apply_drop_shadow(iphone, offset=(-10, 30), blur_radius=40, shadow_color=(0, 0, 0, 180))
    
    CANVAS_W = 1920
    CANVAS_H = 1080
    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    
    # Scale MacBook to be large (dominant)
    mb_scale = 0.95
    mb_w, mb_h = int(macbook.width * mb_scale), int(macbook.height * mb_scale)
    macbook = macbook.resize((mb_w, mb_h), Image.Resampling.LANCZOS)
    
    # Scale iPhone to be appropriately sized (30% smaller)
    ip_scale = 0.45
    ip_w, ip_h = int(iphone.width * ip_scale), int(iphone.height * ip_scale)
    iphone = iphone.resize((ip_w, ip_h), Image.Resampling.LANCZOS)
    
    # Position MacBook slightly to the left to leave room for iPhone
    mb_x = (CANVAS_W - mb_w) // 2 - 30
    mb_y = (CANVAS_H - mb_h) // 2 - 20
    
    # Position iPhone so it heavily overlaps the right side of the MacBook body
    # (No shadow padding, so we just use the raw coordinates)
    ip_x = mb_x + mb_w - int(ip_w * 0.90) - 30
    ip_y = mb_y + mb_h - ip_h + 30
    
    
    # Composite back to front
    canvas.alpha_composite(macbook, (mb_x, mb_y))
    canvas.alpha_composite(iphone, (ip_x, ip_y))
    
    # Tightly crop the canvas to the bounding box of non-transparent pixels
    bbox = canvas.getbbox()
    if bbox:
        # Add a small padding of 20px
        pad = 20
        bbox = (max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(canvas.width, bbox[2]+pad), min(canvas.height, bbox[3]+pad))
        canvas = canvas.crop(bbox)
    
    canvas.save(output_path, "PNG")
    print(f"Responsive mockup generated successfully at {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python mockup_generator.py <mode> <output_mockup.png> <input_1> [input_2]")
        print("Modes: mobile_fanned, web_single, web_responsive, mobile_single")
        sys.exit(1)
        
    mode = sys.argv[1]
    out_file = sys.argv[2]
    
    if mode == "mobile_fanned":
        build_fanned_mockup(sys.argv[3], out_file)
    elif mode == "mobile_single":
        build_mobile_single_mockup(sys.argv[3], out_file)
    elif mode == "web_single":
        build_web_single_mockup(sys.argv[3], out_file)
    elif mode == "web_responsive":
        if len(sys.argv) < 5:
            print("Error: web_responsive requires desktop_screenshot and mobile_screenshot")
            sys.exit(1)
        build_web_responsive_mockup(sys.argv[3], sys.argv[4], out_file)
    else:
        print(f"Unknown mode: {mode}")
        sys.exit(1)
