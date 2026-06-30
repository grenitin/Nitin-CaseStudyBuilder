import os
import random
import requests
import json
from dotenv import load_dotenv

# Try importing AI SDKs if installed
try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

try:
    import openai
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

# Load environment variables
load_dotenv()

LINKEDIN_ACCESS_TOKEN = os.getenv("LINKEDIN_ACCESS_TOKEN")
LINKEDIN_PERSONA_URN = os.getenv("LINKEDIN_PERSONA_URN")  # Should be urn:li:person:YOUR_ID
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

TOPICS = [
    "User Behavior",
    "User Intention vs. Retention",
    "Business Impact of UX",
    "User Pain Points",
    "UX Laws",
    "How AI is solving UX problems"
]

def calculate_reading_time(text):
    """Calculate reading and scanning time based on word count."""
    words = len(text.split())
    # Average reading speed is ~200-250 words per minute
    # Average scanning speed is much faster
    reading_time_sec = int((words / 200) * 60)
    scanning_time_sec = int(reading_time_sec * 0.3)  # Roughly 30% of reading time
    
    # Format to seconds or minutes if > 60
    read_str = f"{reading_time_sec} sec" if reading_time_sec < 60 else f"{reading_time_sec // 60} min {reading_time_sec % 60} sec"
    scan_str = f"{max(1, scanning_time_sec)} sec"
    
    return scan_str, read_str

def generate_post_content(topic):
    """Generates the post text using an AI API based on the selected topic."""
    
    system_prompt = f"""
    You are an expert UI/UX designer and content creator on LinkedIn. 
    Write a crisp, impactful, and non-lengthy LinkedIn post about: "{topic}".
    
    Rules:
    - Keep it short, authentic, and easy to read (max 1500 characters).
    - Share actionable insights or strong opinions.
    - NO copyright issues or plagiarized text. Must be 100% original.
    - DO NOT include placeholders for a table, just output the main text. We will append the metrics table programmatically.
    - Use relevant emojis but don't overdo it.
    """
    
    content = ""
    
    # Use Gemini if available
    if HAS_GEMINI and GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-pro-latest')
        response = model.generate_content(system_prompt)
        content = response.text
        
    # Fallback to OpenAI if available
    elif HAS_OPENAI and OPENAI_API_KEY:
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": system_prompt}]
        )
        content = response.choices[0].message.content
        
    else:
        # Fallback if no AI keys are provided yet
        content = f"Draft post about {topic}.\n\n(Note: Add your GEMINI_API_KEY or OPENAI_API_KEY to .env to auto-generate this text!)"

    # Calculate metrics
    scan_time, read_time = calculate_reading_time(content)
    
    # Append the metrics table (using monospace font or just text format since LinkedIn doesn't support markdown tables)
    metrics_table = f"""
---
⏱️ Time Check:
📊 Scanning Time: {scan_time}
📖 Reading Time: {read_time}
"""
    return content.strip() + "\n" + metrics_table

def get_linkedin_urn(access_token):
    """Fetches the user's LinkedIn URN using the access token."""
    print("Fetching your LinkedIn Profile ID automatically...")
    headers = {"Authorization": f"Bearer {access_token}"}
    # We use the userinfo endpoint to get the 'sub' which is the profile ID
    res = requests.get("https://api.linkedin.com/v2/userinfo", headers=headers)
    if res.status_code == 200:
        profile_id = res.json().get("sub")
        return f"urn:li:person:{profile_id}"
    else:
        print("Could not fetch profile ID. Is your token correct and does it have the right permissions?")
        print(res.text)
        return None

def upload_image_to_linkedin(image_path):
    """
    Uploads a local image to LinkedIn and returns the asset URN.
    Requires w_member_social permission.
    """
    global LINKEDIN_PERSONA_URN
    
    if not LINKEDIN_ACCESS_TOKEN:
        print("Missing LinkedIn credentials in .env")
        return None
        
    if not LINKEDIN_PERSONA_URN:
        LINKEDIN_PERSONA_URN = get_linkedin_urn(LINKEDIN_ACCESS_TOKEN)
        if not LINKEDIN_PERSONA_URN:
            return None

    # 1. Register Upload
    register_url = "https://api.linkedin.com/v2/assets?action=registerUpload"
    headers = {
        "Authorization": f"Bearer {LINKEDIN_ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0"
    }
    
    register_data = {
        "registerUploadRequest": {
            "recipes": ["urn:li:digitalmediaRecipe:feedshare-image"],
            "owner": LINKEDIN_PERSONA_URN,
            "serviceRelationships": [
                {
                    "relationshipType": "OWNER",
                    "identifier": "urn:li:userGeneratedContent"
                }
            ]
        }
    }

    print("Registering image upload with LinkedIn...")
    res = requests.post(register_url, headers=headers, json=register_data)
    if res.status_code != 200:
        print("Failed to register upload:", res.text)
        return None

    res_json = res.json()
    upload_url = res_json['value']['uploadMechanism']['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']['uploadUrl']
    asset_urn = res_json['value']['asset']

    # 2. Upload the actual image binary
    print(f"Uploading image file: {image_path}")
    with open(image_path, 'rb') as file:
        upload_res = requests.put(upload_url, headers={"Authorization": f"Bearer {LINKEDIN_ACCESS_TOKEN}"}, data=file)
    
    if upload_res.status_code not in (200, 201):
        print("Failed to upload image file:", upload_res.text)
        return None

    print(f"Image uploaded successfully! Asset URN: {asset_urn}")
    return asset_urn


def create_linkedin_post(text, image_urn=None):
    """Creates a UGC post on LinkedIn."""
    global LINKEDIN_PERSONA_URN
    
    if not LINKEDIN_ACCESS_TOKEN:
        return False
        
    if not LINKEDIN_PERSONA_URN:
        LINKEDIN_PERSONA_URN = get_linkedin_urn(LINKEDIN_ACCESS_TOKEN)
        if not LINKEDIN_PERSONA_URN:
            return False

    url = "https://api.linkedin.com/v2/ugcPosts"
    headers = {
        "Authorization": f"Bearer {LINKEDIN_ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0"
    }

    # Base post body
    post_data = {
        "author": LINKEDIN_PERSONA_URN,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {
                    "text": text
                },
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    }

    # Attach image if provided
    if image_urn:
        post_data["specificContent"]["com.linkedin.ugc.ShareContent"]["shareMediaCategory"] = "IMAGE"
        post_data["specificContent"]["com.linkedin.ugc.ShareContent"]["media"] = [
            {
                "status": "READY",
                "description": {"text": "Retro hand-sketched UX concept"},
                "media": image_urn,
                "title": {"text": "UX Insight"}
            }
        ]

    print("Publishing post to LinkedIn...")
    res = requests.post(url, headers=headers, json=post_data)
    
    if res.status_code == 201:
        print("Post published successfully!")
        return True
    else:
        print("Failed to publish post:", res.text)
        return False

def main():
    print("--- Starting LinkedIn Auto-Poster ---")
    
    # 1. Select a Topic
    topic = random.choice(TOPICS)
    print(f"Selected Topic: {topic}")
    
    # 2. Generate Content
    print("Generating content...")
    post_text = generate_post_content(topic)
    
    print("\n--- Generated Post ---")
    print(post_text)
    print("----------------------\n")
    
    # 3. Find an Image to Upload
    # By default, we will look in the assets folder for an image.
    # The user should place their retro sketch image in the assets folder named 'banner.jpg' or similar.
    assets_dir = os.path.join(os.path.dirname(__file__), "assets")
    image_to_upload = None
    
    if os.path.exists(assets_dir):
        images = [f for f in os.listdir(assets_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
        if images:
            # Pick a random image from the assets folder
            image_to_upload = os.path.join(assets_dir, random.choice(images))
            print(f"Found image to upload: {image_to_upload}")
        else:
            print("No images found in assets/ folder. Skipping image upload.")
    
    # 4. Upload to LinkedIn
    if LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSONA_URN:
        image_urn = None
        if image_to_upload:
            image_urn = upload_image_to_linkedin(image_to_upload)
            
        # 5. Create Post
        create_linkedin_post(post_text, image_urn=image_urn)
    else:
        print("\n[SKIPPED PUBLISHING] Please fill out LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSONA_URN in .env to actually post this to your feed.")

if __name__ == "__main__":
    main()
