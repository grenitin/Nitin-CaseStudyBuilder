from PIL import Image, ImageDraw, ImageFilter

def draw_macbook_vector(screen_img):
    """Draws a hyper-accurate flat 2D vector MacBook Pro front-facing mockup"""
    # Dimensions based on the reference image
    SCREEN_W, SCREEN_H = 1440, 930
    BEZEL_TOP = 25
    BEZEL_SIDE = 25
    BEZEL_BOTTOM = 25
    CORNER_RADIUS = 25
    
    DEVICE_W = SCREEN_W + (BEZEL_SIDE * 2)
    SCREEN_FULL_H = SCREEN_H + BEZEL_TOP + BEZEL_BOTTOM
    
    # Base dimensions
    BASE_H = 40
    BASE_OVERHANG = 60 # Base is wider than screen
    TOTAL_W = DEVICE_W + (BASE_OVERHANG * 2)
    TOTAL_H = SCREEN_FULL_H + BASE_H + 15 # +15 for feet
    
    device = Image.new("RGBA", (TOTAL_W, TOTAL_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(device)
    
    # 1. Screen Bezel (Black rounded rect)
    screen_x = BASE_OVERHANG
    screen_y = 0
    draw.rounded_rectangle(
        [screen_x, screen_y, screen_x + DEVICE_W, screen_y + SCREEN_FULL_H],
        radius=CORNER_RADIUS,
        fill="#111111",
        outline="#2a2a2a",
        width=1
    )
    
    # Paste screenshot
    screen_resized = screen_img.resize((SCREEN_W, SCREEN_H), Image.Resampling.LANCZOS)
    device.paste(screen_resized, (screen_x + BEZEL_SIDE, screen_y + BEZEL_TOP))
    
    # Notch
    NOTCH_W = 180
    NOTCH_H = 28
    notch_x = screen_x + (DEVICE_W - NOTCH_W) // 2
    notch_y = screen_y
    draw.rounded_rectangle(
        [notch_x, notch_y, notch_x + NOTCH_W, notch_y + NOTCH_H],
        radius=8,
        fill="#111111"
    )
    
    # 2. Base (Silver)
    base_x1 = 0
    base_y1 = screen_y + SCREEN_FULL_H
    base_x2 = TOTAL_W
    base_y2 = base_y1 + BASE_H
    
    # Main silver base
    draw.rounded_rectangle(
        [base_x1, base_y1, base_x2, base_y2],
        radius=12,
        fill="#e3e4e5",
        outline="#c0c1c3",
        width=1
    )
    
    # Thumb groove (centered on base)
    GROOVE_W = 220
    GROOVE_H = 8
    groove_x = (TOTAL_W - GROOVE_W) // 2
    groove_y = base_y1
    draw.rounded_rectangle([groove_x, groove_y, groove_x + GROOVE_W, groove_y + GROOVE_H], radius=4, fill="#b5b6b8")
    
    # Bottom chin shadow line (separation between lid and base)
    draw.line([base_x1 + 10, base_y1, base_x2 - 10, base_y1], fill="#999999", width=2)
    
    # 3. Rubber Feet
    FOOT_W = 60
    FOOT_H = 6
    FOOT_OFFSET = 120
    foot_y = base_y2 - 2
    
    # Left foot
    draw.rounded_rectangle([base_x1 + FOOT_OFFSET, foot_y, base_x1 + FOOT_OFFSET + FOOT_W, foot_y + FOOT_H], radius=3, fill="#333333")
    # Right foot
    draw.rounded_rectangle([base_x2 - FOOT_OFFSET - FOOT_W, foot_y, base_x2 - FOOT_OFFSET, foot_y + FOOT_H], radius=3, fill="#333333")
    
    return device

def draw_iphone_vector(screen_img):
    """Draws a flat 2D vector iPhone mockup matching the reference"""
    SCREEN_W, SCREEN_H = 390, 844
    BEZEL = 14
    FRAME_BORDER = 4
    CORNER_RADIUS = 45
    
    DEVICE_W = SCREEN_W + (BEZEL * 2)
    DEVICE_H = SCREEN_H + (BEZEL * 2)
    
    # Outer frame for buttons
    TOTAL_W = DEVICE_W + 8
    TOTAL_H = DEVICE_H
    
    device = Image.new("RGBA", (TOTAL_W, TOTAL_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(device)
    
    x_offset = 4 # Shift right to make room for left buttons
    
    # Outer metal frame (Silver/Grey)
    draw.rounded_rectangle(
        [x_offset, 0, x_offset + DEVICE_W, DEVICE_H],
        radius=CORNER_RADIUS + FRAME_BORDER,
        fill="#8a8b8e"
    )
    
    # Inner black bezel
    draw.rounded_rectangle(
        [x_offset + FRAME_BORDER, FRAME_BORDER, x_offset + DEVICE_W - FRAME_BORDER, DEVICE_H - FRAME_BORDER],
        radius=CORNER_RADIUS,
        fill="#111111"
    )
    
    # Screen
    screen_resized = screen_img.resize((SCREEN_W, SCREEN_H), Image.Resampling.LANCZOS)
    
    # Screen Mask for rounded corners
    screen_mask = Image.new("L", (SCREEN_W, SCREEN_H), 0)
    mask_draw = ImageDraw.Draw(screen_mask)
    mask_draw.rounded_rectangle([0, 0, SCREEN_W, SCREEN_H], radius=CORNER_RADIUS - 6, fill=255)
    
    device.paste(screen_resized, (x_offset + BEZEL, BEZEL), mask=screen_mask)
    
    # Notch (iPhone 13/14 style)
    NOTCH_W = 110
    NOTCH_H = 28
    notch_x = x_offset + (DEVICE_W - NOTCH_W) // 2
    notch_y = FRAME_BORDER
    draw.rounded_rectangle(
        [notch_x, notch_y, notch_x + NOTCH_W, notch_y + NOTCH_H],
        radius=10,
        fill="#111111"
    )
    
    # Buttons
    # Mute switch
    draw.rectangle([0, 150, x_offset + 1, 180], fill="#6a6b6e")
    # Vol Up
    draw.rectangle([0, 210, x_offset + 1, 270], fill="#6a6b6e")
    # Vol Down
    draw.rectangle([0, 290, x_offset + 1, 350], fill="#6a6b6e")
    # Power Button
    draw.rectangle([x_offset + DEVICE_W - 1, 230, x_offset + DEVICE_W + 3, 310], fill="#6a6b6e")
    
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

def build_sample():
    # Load dummy screenshots
    try:
        desk_ui = Image.open("/Users/ni3_kr/Documents/UX/CaseStudyBuilder/static/image/Wireframes/Mobile/low_fi_ai_0.png").convert("RGBA")
        mob_ui = Image.open("/Users/ni3_kr/Documents/UX/CaseStudyBuilder/static/image/Wireframes/Mobile/low_fi_ai_1.png").convert("RGBA")
    except:
        desk_ui = Image.new("RGBA", (1440, 900), (100, 150, 200, 255))
        mob_ui = Image.new("RGBA", (390, 844), (200, 100, 150, 255))
        
    macbook = draw_macbook_vector(desk_ui)
    iphone = draw_iphone_vector(mob_ui)
    
    macbook = apply_drop_shadow(macbook, offset=(0, 30), blur_radius=40, shadow_color=(0, 0, 0, 140))
    iphone = apply_drop_shadow(iphone, offset=(-10, 20), blur_radius=30, shadow_color=(0, 0, 0, 160))
    
    CANVAS_W = 1920
    CANVAS_H = 1080
    
    # We want a very slight grey background just so the white artifact background doesn't hide the silver base
    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (245, 245, 247, 255)) 
    
    mb_scale = 0.65
    mb_w, mb_h = int(macbook.width * mb_scale), int(macbook.height * mb_scale)
    macbook = macbook.resize((mb_w, mb_h), Image.Resampling.LANCZOS)
    
    ip_scale = 0.70
    ip_w, ip_h = int(iphone.width * ip_scale), int(iphone.height * ip_scale)
    iphone = iphone.resize((ip_w, ip_h), Image.Resampling.LANCZOS)
    
    mb_x = (CANVAS_W - mb_w) // 2 - 80
    mb_y = (CANVAS_H - mb_h) // 2
    
    # Position iPhone overlapping right
    ip_x = mb_x + mb_w - int(ip_w * 0.65)
    ip_y = mb_y + mb_h - ip_h + 10
    
    canvas.alpha_composite(macbook, (mb_x, mb_y))
    canvas.alpha_composite(iphone, (ip_x, ip_y))
    
    out_path = "/Users/ni3_kr/.gemini/antigravity-ide/brain/a5521240-0802-4417-9287-69159ac33274/artifacts/sample_mockup_v2.png"
    canvas.save(out_path)
    print("Saved to", out_path)

if __name__ == "__main__":
    build_sample()
