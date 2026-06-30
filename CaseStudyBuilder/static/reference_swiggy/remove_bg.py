from PIL import Image
import sys

def remove_background(input_path, output_path):
    # Load the image
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    
    new_data = []
    # Threshold for black pixels
    threshold = 15
    
    for item in datas:
        # If pixel is near black, make it transparent
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Successfully created transparent image at {output_path}")

if __name__ == "__main__":
    input_file = "/Users/ni3_kr/.gemini/antigravity/brain/7e577948-6e79-4df3-a7e2-415340defe3e/swiggy_daily_hero_black_bg_1778313305705.png"
    output_file = "/Users/ni3_kr/Documents/UX/Portfolio Website/assets/images/swiggy_daily_hero_final_transparent.png"
    remove_background(input_file, output_file)
