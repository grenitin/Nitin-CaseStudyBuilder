import time
import os
import csv
import json
import uuid
import traceback
from urllib.parse import urlparse, urljoin
import subprocess
from bs4 import BeautifulSoup
import requests
import google.generativeai as genai
from playwright.sync_api import sync_playwright

AUDIT_FOLDER = 'UX Audit'
TASKS = {} # In-memory store: {task_id: {"status": "message", "complete": bool, "error": str}}

def update_status(task_id, message, complete=False, error=None):
    TASKS[task_id] = {
        "status": message,
        "complete": complete,
        "error": error
    }

def get_page_links(base_url, max_links=2):
    try:
        response = requests.get(base_url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        domain = urlparse(base_url).netloc
        links = []
        for a in soup.find_all('a', href=True):
            href = a['href']
            full_url = urljoin(base_url, href)
            if urlparse(full_url).netloc == domain and full_url not in links and full_url != base_url:
                links.append(full_url)
            if len(links) >= max_links:
                break
        return links
    except Exception:
        return []

def run_ux_audit_worker(task_id, url, api_key):
    try:
        update_status(task_id, f"Initializing AI Core for {url}...")
        
        if not url.startswith('http'):
            url = 'https://' + url
            
        parsed = urlparse(url)
        domain = parsed.netloc if parsed.netloc else parsed.path
        brand = domain.replace('www.', '').split('.')[0].capitalize()
        
        # 1. Setup Gemini
        genai.configure(api_key=api_key)
        # We use standard gemini-1.5-flash as it's free-tier friendly, very fast, and supports vision.
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # 2. Find pages
        update_status(task_id, "Crawling website structure...")
        urls_to_crawl = [url] + get_page_links(url, max_links=2)
        
        if not os.path.exists(AUDIT_FOLDER):
            os.makedirs(AUDIT_FOLDER)
            
        filename = f"{brand}_UX_Audit_-_Heuristic_Evaluation.csv"
        filepath = os.path.join(AUDIT_FOLDER, filename)
        
        # Load or start CSV
        existing_rows = []
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                existing_rows = list(reader)
        
        if not existing_rows:
            headers = ["Index","Heuristic","Screenshot","Page URL","Page Name","Issue Description","Behavioral Insight","Attitudinal Insight","Cognitive Load","Severity","Priority","Recommendation"]
            existing_rows.append(headers)
        
        start_index = len(existing_rows)
        
        update_status(task_id, f"Beginning visual screenshot capture of {len(urls_to_crawl)} pages...")
        
        audit_results = []
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={'width': 1920, 'height': 1080})
            
            for page_url in urls_to_crawl:
                update_status(task_id, f"Evaluating page: {page_url}")
                try:
                    page.goto(page_url, timeout=30000, wait_until="networkidle")
                    time.sleep(2)
                    
                    safe_name = page_url.replace("https://", "").replace("/", "_").replace(".", "_") + ".png"
                    img_path = f"/tmp/{safe_name}"
                    page.screenshot(path=img_path, full_page=False) # standard hero screenshot
                    
                    # Upload to catbox (using existing methodology)
                    cat_url = ""
                    try:
                        cmd = ["curl", "-s", "-F", "reqtype=fileupload", "-F", f"fileToUpload=@{img_path}", "https://catbox.moe/user/api.php"]
                        res = subprocess.run(cmd, capture_output=True, text=True)
                        if res.returncode == 0 and res.stdout.startswith("http"):
                            cat_url = res.stdout.strip()
                    except Exception as e:
                        print("Catbox upload failed:", e)
                    
                    # Ask Gemini to evaluate
                    update_status(task_id, f"Running GenAI expert analysis on {page_url}...")
                    
                    import PIL.Image
                    img_obj = PIL.Image.open(img_path)
                    
                    prompt = f"""You are a Silicon Valley Principal UX Auditor specializing in Jakob Nielsen's 10 Heuristics. 
Analyze this webpage screenshot ({page_url}). Find exactly 2 distinct UX/UI usability issues.
Output the data in strict JSON array format. No markdown, no conversational text.
Example format:
[
  {{
    "Heuristic": "Visibility of system status",
    "Page Name": "Home Page Dashboard",
    "Issue Description": "Brief description of the UI issue seen.",
    "Behavioral Insight": "What the user tries to do physically.",
    "Attitudinal Insight": "How this makes the user feel.",
    "Cognitive Load": "High", 
    "Severity": "3",
    "Priority": "P2",
    "Recommendation": "How to fix it."
  }}
]
Cognitive Load must be either High, Medium, or Low. Severity must be 1-5. Priority must be P1-P4."""

                    response = model.generate_content([prompt, img_obj])
                    text_resp = response.text
                    
                    # Clean markdown code blocks if any
                    if "```json" in text_resp:
                        text_resp = text_resp.split("```json")[1].split("```")[0].strip()
                    elif "```" in text_resp:
                        text_resp = text_resp.split("```")[1].split("```")[0].strip()
                        
                    issues = json.loads(text_resp)
                    
                    for issue in issues:
                        audit_results.append({
                            "Heuristic": issue.get("Heuristic", "Aesthetic and minimalist design"),
                            "Screenshot": f'=IMAGE("{cat_url}")' if cat_url else "",
                            "Page URL": page_url,
                            "Page Name": issue.get("Page Name", "Subpage"),
                            "Issue Description": issue.get("Issue Description", "-"),
                            "Behavioral Insight": issue.get("Behavioral Insight", "-"),
                            "Attitudinal Insight": issue.get("Attitudinal Insight", "-"),
                            "Cognitive Load": issue.get("Cognitive Load", "Medium"),
                            "Severity": str(issue.get("Severity", "2")),
                            "Priority": str(issue.get("Priority", "P3")),
                            "Recommendation": issue.get("Recommendation", "-")
                        })
                        
                except Exception as e:
                    print(f"Failed to evaluate {page_url}: {e}")
                    
            browser.close()
            
        update_status(task_id, "Saving robust analysis to CSV database...")
        
        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerows(existing_rows[:1]) # Only headers
            
            # Rewrite old data without headers
            idx = 1
            for row in existing_rows[1:]:
                # Check if it was our "dummy" row from before and erase it!
                if "Mock evaluation generated for" not in str(row):
                    writer.writerow(row)
                    idx += 1
            
            # Write new data
            for a in audit_results:
                writer.writerow([
                    idx, a["Heuristic"], a["Screenshot"], a["Page URL"], a["Page Name"], 
                    a["Issue Description"], a["Behavioral Insight"], a["Attitudinal Insight"], 
                    a["Cognitive Load"], a["Severity"], a["Priority"], a["Recommendation"]
                ])
                idx += 1
                
        update_status(task_id, "Syncing to live Google Sheets Report...")
        
        try:
            import sys
            subprocess.run(['python', 'sync_ux_audits.py', filename], check=True, capture_output=True, text=True)
        except subprocess.CalledProcessError as e:
            update_status(task_id, "Sync failed.", True, f"Google sync failed. Exit code {e.returncode}. Stderr: {e.stderr}")
            return
            
        update_status(task_id, "Audit finalized successfully!", True, None)

    except Exception as e:
        traceback.print_exc()
        update_status(task_id, "Critical Error", True, f"An error occurred: {str(e)}")
