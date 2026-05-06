from PIL import Image
import os

def remove_background(input_path, output_path):
    print(f"Opening {input_path}...")
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    # Threshold for "white" background
    threshold = 240
    
    for item in datas:
        # If the pixel is very close to white, make it transparent
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved transparent PNG to {output_path}")

# Run for our assets
assets_dir = "/Users/ni3_kr/Documents/UX/Portfolio Website/assets/images"
files = [
    ('fipa_laptop_dark.png', 'fipa_laptop_dark_trans.png')
]

for inp, outp in files:
    full_inp = os.path.join(assets_dir, inp)
    full_outp = os.path.join(assets_dir, outp)
    if os.path.exists(full_inp):
        remove_background(full_inp, full_outp)
    else:
        print(f"File not found: {full_inp}")
