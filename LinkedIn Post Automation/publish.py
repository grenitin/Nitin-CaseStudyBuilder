import sys
import os
from dotenv import load_dotenv
import requests

# Re-use the existing functions from our previous script
from generate_and_post import upload_image_to_linkedin, create_linkedin_post

def main():
    if len(sys.argv) < 3:
        print("Usage: python publish.py <image_path> <text_file_path>")
        sys.exit(1)

    load_dotenv()
    image_path = sys.argv[1]
    text_file_path = sys.argv[2]
    
    with open(text_file_path, 'r') as f:
        post_text = f.read()

    print(f"Preparing to publish image: {image_path}")
    image_urn = upload_image_to_linkedin(image_path)
    
    if image_urn:
        success = create_linkedin_post(post_text, image_urn)
        if success:
            print("Successfully published to LinkedIn!")
        else:
            print("Failed to publish post.")
    else:
        print("Failed to upload image.")

if __name__ == "__main__":
    main()
