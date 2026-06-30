def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(*[int(c) for c in rgb])

def get_luminance(rgb):
    # sRGB luminance
    a = []
    for v in rgb:
        v /= 255.0
        if v <= 0.03928:
            a.append(v / 12.92)
        else:
            a.append(((v + 0.055) / 1.055) ** 2.4)
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722

def get_contrast_ratio(color1, color2):
    lum1 = get_luminance(color1)
    lum2 = get_luminance(color2)
    brightest = max(lum1, lum2)
    darkest = min(lum1, lum2)
    return (brightest + 0.05) / (darkest + 0.05)

def ensure_contrast(hex_color, bg_hex, target_ratio=4.5):
    rgb = list(hex_to_rgb(hex_color))
    bg_rgb = hex_to_rgb(bg_hex)
    
    # If contrast is already good, return original
    if get_contrast_ratio(rgb, bg_rgb) >= target_ratio:
        return hex_color
        
    bg_lum = get_luminance(bg_rgb)
    is_dark_bg = bg_lum < 0.5
    
    # Adjust lightness iteratively
    step = 5
    max_iters = 50
    for _ in range(max_iters):
        if is_dark_bg:
            # Lighten the color
            rgb = [min(255, c + step) for c in rgb]
        else:
            # Darken the color
            rgb = [max(0, c - step) for c in rgb]
            
        if get_contrast_ratio(rgb, bg_rgb) >= target_ratio:
            break
            
    return rgb_to_hex(rgb)

print(ensure_contrast('#1E3A8A', '#111111'))
print(ensure_contrast('#F97316', '#FFFFFF'))
