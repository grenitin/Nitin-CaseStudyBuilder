import os
import sys
import json
import time
import uuid
import traceback
import random
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
import google.generativeai as genai

# Import stitcher
import stitcher
import re

def get_text_safely(response):
    try:
        if hasattr(response, 'text'):
            return response.text
    except:
        pass
        
    try:
        if hasattr(response, 'candidates') and len(response.candidates) > 0:
            candidate = response.candidates[0]
            if hasattr(candidate, 'content') and hasattr(candidate.content, 'parts'):
                parts = candidate.content.parts
                if len(parts) > 0 and hasattr(parts[0], 'text'):
                    return parts[0].text
    except:
        pass
    return ""

def repair_truncated_json(json_str):
    """
    Repairs a truncated JSON string by closing any open strings, arrays, and objects.
    It strips trailing incomplete elements first.
    """
    json_str = json_str.strip()
    if not json_str:
        return "{}"
        
    in_string = False
    escape = False
    stack = []
    
    i = 0
    while i < len(json_str):
        char = json_str[i]
        
        if escape:
            escape = False
            i += 1
            continue
            
        if char == '\\':
            escape = True
            i += 1
            continue
            
        if char == '"':
            in_string = not in_string
            i += 1
            continue
            
        if not in_string:
            if char == '{':
                stack.append('{')
            elif char == '[':
                stack.append('[')
            elif char == '}':
                if stack and stack[-1] == '{':
                    stack.pop()
            elif char == ']':
                if stack and stack[-1] == '[':
                    stack.pop()
        i += 1
        
    # If we are inside an unclosed string, close it
    if in_string:
        json_str += '"'
        
    # Repeatedly strip trailing colons, commas, or whitespace
    while True:
        json_str = json_str.strip()
        if not json_str:
            break
        if json_str.endswith(','):
            json_str = json_str[:-1]
        elif json_str.endswith(':'):
            json_str = json_str[:-1]
        else:
            break
            
    # Now close any unclosed brackets in the stack in reverse order
    for brace in reversed(stack):
        if brace == '{':
            json_str += '}'
        elif brace == '[':
            json_str += ']'
            
    return json_str

def safe_json_parse(raw_text):
    """
    Cleans AI output and attempts to parse it as JSON.
    Handles trailing garbage, residual markdown, common syntax errors, and TRUNCATION.
    """
    # 1. Strip markdown backticks using regex
    text = re.sub(r'^```json\s*', '', raw_text.strip(), flags=re.IGNORECASE)
    text = re.sub(r'\s*```$', '', text)
    text = text.strip()
    
    # 2. Find the start of the JSON object
    start_idx = text.find('{')
    if start_idx == -1:
        raise ValueError("Could not find JSON object boundaries in AI response.")
        
    text = text[start_idx:]
    
    # 3. Clean trailing commas in arrays/objects: [1, 2, ] -> [1, 2]
    cleaned_text = re.sub(r',\s*([\]}])', r'\1', text)
    
    try:
        # Standard parse of the cleaned text
        end_idx = cleaned_text.rfind('}')
        if end_idx != -1:
            try:
                return json.loads(cleaned_text[:end_idx+1])
            except:
                pass
        return json.loads(cleaned_text)
    except Exception as e:
        print(f"Standard JSON parse failed: {e}. Trying repair...")
        
        # Repair the truncated/malformed JSON string
        repaired_text = repair_truncated_json(text)
        
        # Apply standard cleaning to the repaired text
        repaired_text = re.sub(r',\s*([\]}])', r'\1', repaired_text)
        
        # Remove dangling trailing string keys/values before a closing bracket (caused by truncation)
        repaired_text = re.sub(r',\s*"[^"]*"\s*(?=[\]}])', '', repaired_text)
        repaired_text = re.sub(r'{\s*"[^"]*"\s*(?=[\]}])', '{', repaired_text)
        
        # Run it twice in case removing one exposed another comma
        repaired_text = re.sub(r',\s*([\]}])', r'\1', repaired_text)
        
        repaired_text = re.sub(r'}\s*{', '},{', repaired_text)
        repaired_text = re.sub(r'\]\s*\[', '],[', repaired_text)
        repaired_text = re.sub(r'"\s*"', '","', repaired_text)
        
        try:
            return json.loads(repaired_text)
        except Exception as repair_err:
            print(f"Repair parsing failed: {repair_err}")
            # Try parsing using decoder.raw_decode
            try:
                decoder = json.JSONDecoder()
                data, _ = decoder.raw_decode(repaired_text)
                return data
            except:
                raise e

# Configuration
API_KEY = os.getenv('GOOGLE_API_KEY', 'AIzaSyBvKSMJKdkk58K1cIws82XJRZQLjhyILuc')
genai.configure(api_key=API_KEY)

def update_status(task_id, message, complete=False, error=None, current_task=None, progress=0):
    TASKS_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'tasks')
    os.makedirs(TASKS_DIR, exist_ok=True)
    state = {
        "status": message,
        "complete": complete,
        "error": error,
        "current_task": current_task,
        "progress": progress,
        "timestamp": time.time()
    }
    filepath = os.path.join(TASKS_DIR, f"{task_id}.json")
    with open(filepath, 'w') as f:
        json.dump(state, f)

def get_random_palette():
    palettes = [
        {"primary": "#5c62ec", "accent": "#00d2ff"}, # Midnight Cobalt
        {"primary": "#00f291", "accent": "#00d2ff"}, # Deep Emerald
        {"primary": "#ff4d4d", "accent": "#ff9f43"}, # Sunset Red
        {"primary": "#9c27b0", "accent": "#00bcd4"}, # Royal Purple
        {"primary": "#ffeb3b", "accent": "#ff5722"}  # Solar Gold
    ]
    return random.choice(palettes)

def extract_brand_colors(url):
    """
    Extracts primary and secondary brand colors from a URL using Gemini Vision.
    Falls back to a default palette if browser automation fails.
    """
    if not url or url == 'test':
        return {"primary": "#5c62ec", "secondary": "#00d2ff"}

    try:
        model = genai.GenerativeModel('models/gemini-2.5-flash')
        prompt = f"What are the primary and secondary brand hex colors for the company/website {url}? Return ONLY a JSON object with 'primary' and 'secondary' brand hex codes. Example: {{\"primary\": \"#FF0000\", \"secondary\": \"#FFFFFF\"}}"
        
        response = model.generate_content(prompt)
        res_text = get_text_safely(response)
        
        if not res_text:
            raise ValueError("AI returned an empty response for colors")
            
        return safe_json_parse(res_text)
    except Exception as e:
        print(f"Color extraction failed or skipped: {e}")
        return {"primary": "#5c62ec", "secondary": "#00d2ff"} # Fallback

def detect_localization(url):
    parsed = urlparse(url)
    domain = parsed.netloc.lower()
    if domain.endswith('.in') or 'india' in domain:
        return 'India'
    return 'International'

def run_analysis_worker(task_id, url, case_type, platform, localization, primary_color, secondary_color, artifacts_requested, theme='dark'):
    try:
        # Cast inputs to be safe
        artifacts_requested = list(artifacts_requested) if artifacts_requested is not None else []
        localization = str(localization)
        case_type = str(case_type)
        platform = str(platform)
        
        if not url.startswith('http'):
            url = 'https://' + url
            
        palette = {"primary": str(primary_color), "accent": str(secondary_color)}
        
        update_status(task_id, f"Target detected: {localization} market. Initializing vision sensors...", progress=15, current_task="input_analysis")
        
        # Determine viewport & device type based on platform
        device_type = 'macbook' if platform in ['web', 'responsive'] else 'iphone'
        base_viewport = {'width': 1440, 'height': 900} if platform in ['web', 'responsive'] else {'width': 390, 'height': 844}
        
        # 1. CRAWLER PHASE (With MOCK FALLBACK)
        hero_path = os.path.join(os.path.dirname(__file__), '..', 'static', 'output', f"hero_{task_id}.png")
        ui_path = os.path.join(os.path.dirname(__file__), '..', 'static', 'output', f"ui_{task_id}.png")
        
        crawler_success = False
        try:
            import subprocess
            crawler_script = os.path.join(os.path.dirname(__file__), 'crawler.py')
            update_status(task_id, f"Crawling {url} for real-world screenshots...", progress=30, current_task="crawling")
            result = subprocess.run([sys.executable, crawler_script, url, platform, hero_path, ui_path], capture_output=True, text=True, timeout=120)
            if result.returncode == 0:
                crawler_success = True
            else:
                print(f"Crawler subprocess failed: {result.stderr}")
                update_status(task_id, "Visual sensors offline. Using design placeholders...", progress=35)
        except Exception as e:
            print(f"Crawler subprocess exception: {e}")
            update_status(task_id, "Visual sensors offline. Using design placeholders...", progress=35)

        if crawler_success:
            try:
                mockup_script = os.path.join(os.path.dirname(__file__), 'mockup_generator.py')
                update_status(task_id, "Building premium multi-device hero mockup...", progress=35, current_task="mockup")
                
                if platform.lower() == 'mobile':
                    subprocess.run([sys.executable, mockup_script, "mobile_fanned", hero_path, ui_path], timeout=60)
                elif platform.lower() == 'web':
                    subprocess.run([sys.executable, mockup_script, "web_single", hero_path, ui_path], timeout=60)
                elif platform.lower() == 'responsive':
                    mobile_path = ui_path.replace('.png', '_mobile.png')
                    if os.path.exists(mobile_path):
                        subprocess.run([sys.executable, mockup_script, "web_responsive", hero_path, ui_path, mobile_path], timeout=60)
                    else:
                        subprocess.run([sys.executable, mockup_script, "web_single", hero_path, ui_path], timeout=60)
            except Exception as e:
                print(f"Mockup generator failed: {e}")
                
            try:
                # Dynamically generate wireframes
                wireframe_script = os.path.join(os.path.dirname(__file__), 'wireframe_generator.py')
                wireframe_out = os.path.join(os.path.dirname(__file__), '..', 'static', 'image', 'Wireframes', 'Mobile' if platform.lower() == 'mobile' else 'Web')
                update_status(task_id, "Synthesizing dynamic skeletal wireframes...", progress=38, current_task="wireframes")
                subprocess.run([sys.executable, wireframe_script, platform.lower(), ui_path, wireframe_out], timeout=60)
            except Exception as e:
                print(f"Wireframe generator failed: {e}")

        if not crawler_success:
            # Generate placeholders if crawler failed or was skipped
            pass

        # 2. INTELLIGENCE PHASE
        update_status(task_id, f"Analyzing as {case_type.upper()} project. Synthesizing strategic artifacts...", progress=60, current_task="research")
        
        # Revert to the identifier that was working before
        target_model = 'models/gemini-2.5-flash'
        model = genai.GenerativeModel(target_model)

        category_context = ""
        if case_type == 'redesign':
            category_context = """
            FOCUS: RE-DESIGN. Emphasize legacy failures and cognitive load. 
            Required Artifact: Heuristic Evaluation, Strategic Pivot.
            """
        else: # scratch
            category_context = """
            FOCUS: START FROM SCRATCH. Emphasize market gaps and zero-to-one innovation.
            Required Artifact: Market Gap Analysis, Brand Foundations.
            """

        generate_following_prompt = f"""
        You are a Principal UX Designer. Analyze this project URL: {url}
        Market: {localization} | Platform: {platform} | Mode: {case_type.upper()}
        {category_context}

        CRITICAL DIRECTIVE: You MUST base your ENTIRE analysis on the visual evidence from the provided screenshots of the URL.
        REVERSE ENGINEERING MANDATE: We are creating a case study FOR THE SAME BRAND shown in the URL. You MUST use the actual brand name from the website. DO NOT invent a new company or product name. This is a reverse-engineered analysis of the existing live product. Ensure the output strictly aligns with the actual brand identity, target audience, and live features visible in the screenshots.
        DO NOT generate generic e-commerce/SaaS statements. Explicitly mention specific UI elements, layouts, text, and friction points you can actually see in the images. Every insight, problem statement, and takeaway MUST be rooted in the visual reality of the provided screenshots.

        STRICT JSON RULES:
        1. RETURN ONLY A SINGLE VALID JSON OBJECT.
        2. No preamble, no postamble.
        3. Ensure every property is separated by a comma.
        4. Escape all special characters.
        5. CRITICAL: STRICT WORD LIMITS. You MUST keep text extremely concise to prevent UI breakage. Titles (max 3 words), descriptions (max 15 words), bullet points (max 8 words).

        REQUIRED SCHEMA:
        {{
            "title": "A high-authority title (STRICTLY MAX 3 WORDS)",
            "subtitle": "A strategic subheader (STRICTLY MAX 12 WORDS)",
            "problem_statement": "The primary business challenge (STRICTLY MAX 25 WORDS)",
            "hmw_questions": ["Primary HMW (max 10 words)", "User HMW (max 10 words)", "Ideation HMW (max 10 words)"],
            "empathy_pillars": [
                {{"title": "Pillar Name (max 3 words)", "insight": "Psychological insight (max 12 words)", "icon": "psychology"}},
                {{"title": "Pillar Name", "insight": "Psychological insight", "icon": "visibility"}},
                {{"title": "Pillar Name", "insight": "Psychological insight", "icon": "speed"}}
            ],
            "personas": [
                {{
                    "name": "Name", "gender": "Male", "age": 30, "location": "City",
                    "occupation": "Job", "family": "Status", "quote": "Quote (max 10 words)",
                    "bio": "Strategic narrative (max 18 words)", "tech": {{"internet": 5, "gadgets": 4}},
                    "brands": ["Brand (1 word)"], "needs": ["Need 1 (max 5 words)", "Need 2 (max 5 words)"], "frustrations": ["Issue 1 (max 5 words)", "Issue 2 (max 5 words)"]
                }},
                {{
                    "name": "Name", "gender": "Female", "age": 25, "location": "City",
                    "occupation": "Job", "family": "Status", "quote": "Quote",
                    "bio": "Strategic narrative", "tech": {{"internet": 4, "gadgets": 5}},
                    "brands": ["Brand"], "needs": ["Need 1", "Need 2"], "frustrations": ["Issue 1", "Issue 2"]
                }}
            ],
            "competitive_analysis": [
                {{"name": "Competitor 1", "pros": ["Pro 1 (max 6 words)"], "cons": ["Con 1 (max 6 words)"]}},
                {{"name": "Competitor 2", "pros": ["Pro 1 (max 6 words)"], "cons": ["Con 1 (max 6 words)"]}},
                {{"name": "Competitor 3", "pros": ["Pro 1 (max 6 words)"], "cons": ["Con 1 (max 6 words)"]}}
            ],
            "competitor_map": {{
                "title": "Market Positioning (max 3 words)",
                "x_axis": {{"title": "Axis X (max 2 words)", "high": "High", "med": "Med", "low": "Low"}},
                "y_axis": {{"title": "Axis Y (max 2 words)", "high": "High", "med": "Med", "low": "Low"}},
                "points": [
                    {{"name": "Comp 1", "desc": "Desc (max 8 words)", "x": 20, "y": 80}},
                    {{"name": "Comp 2", "desc": "Desc", "x": 60, "y": 40}},
                    {{"name": "Comp 3", "desc": "Desc", "x": 80, "y": 20}},
                    {{"name": "Comp 4", "desc": "Desc", "x": 40, "y": 60}}
                ],
                "solution": {{"name": "Proposed Solution", "desc": "Target Gap", "x": 85, "y": 85}}
            }},
            "empathy_map": {{"title": "Empathy Mapping", "quadrants": [
                {{"type": "SAYS", "insights": ["Insight 1 (max 8 words)", "Insight 2 (max 8 words)"]}},
                {{"type": "THINKS", "insights": ["Insight 1 (max 8 words)", "Insight 2 (max 8 words)"]}},
                {{"type": "DOES", "insights": ["Insight 1 (max 8 words)", "Insight 2 (max 8 words)"]}},
                {{"type": "FEELS", "insights": ["Insight 1 (max 8 words)", "Insight 2 (max 8 words)"]}}
            ]}},
            "journey_map": [
                {{"stage": "STAGE 1 (max 3 words)", "touchpoints": "Tools (max 5 words)", "actions": "Behavior (max 8 words)", "emotions": "😊", "friction": "Pain (max 8 words)"}},
                {{"stage": "STAGE 2", "touchpoints": "Tools", "actions": "Behavior", "emotions": "😐", "friction": "Pain"}},
                {{"stage": "STAGE 3", "touchpoints": "Tools", "actions": "Behavior", "emotions": "😊", "friction": "Pain"}},
                {{"stage": "STAGE 4", "touchpoints": "Tools", "actions": "Behavior", "emotions": "😊", "friction": "Pain"}},
                {{"stage": "STAGE 5", "touchpoints": "Tools", "actions": "Behavior", "emotions": "🎉", "friction": "Pain"}}
            ],
            "key_insights": [
                {{"title": "Insight 1 (max 5 words)", "desc": "Detailed research finding (max 15 words)"}},
                {{"title": "Insight 2", "desc": "Detailed research finding"}},
                {{"title": "Insight 3", "desc": "Detailed research finding"}}
            ],
            "research_approach": {{
                "goal": "Understand primary user needs (max 15 words)",
                "method_desc": "Best for new market entry (max 15 words)",
                "qual_method": "In-depth Interviews",
                "qual_result": "15-20 user sessions",
                "quant_method": "Online Survey",
                "quant_result": "150-200 participants"
            }},
            "core_challenge": "How might we transform... (A large defining question statement, max 20 words)",
            "strategic_brainstorm": [
                {{"category": "Theme 1 (e.g. Attendance & Teams)", "action": "Idea 1 (max 12 words)"}},
                {{"category": "Theme 1", "action": "Idea 2 (max 12 words)"}},
                {{"category": "Theme 1", "action": "Idea 3"}},
                {{"category": "Theme 2", "action": "Idea 1"}},
                {{"category": "Theme 2", "action": "Idea 2"}},
                {{"category": "Theme 2", "action": "Idea 3"}},
                {{"category": "Theme 3", "action": "Idea 1"}},
                {{"category": "Theme 3", "action": "Idea 2"}},
                {{"category": "Theme 3", "action": "Idea 3"}}
            ],
            "design_logic_pivot": {{"before": "Legacy friction (max 15 words)", "pivot_logic": "Strategic insight (max 20 words)", "after": "New vision (max 15 words)"}},
            "wireframes": [{{"title": "Low-Fi", "platform": "{platform}", "layout": ["Block 1", "Block 2"] }}],
            "design_annotations": [
                {{"title": "Feature 1 (max 3 words)", "rationale": "Logic (max 12 words)", "x": 10, "y": 20}},
                {{"title": "Feature 2", "rationale": "Logic", "x": 50, "y": 60}},
                {{"title": "Feature 3", "rationale": "Logic", "x": 30, "y": 40}}
            ],
            "heuristic_evaluation": [
                {{"heuristic": "Visibility", "severity": 4, "finding": "Obs (max 10 words)", "status": "Issue"}},
                {{"heuristic": "Consistency", "severity": 3, "finding": "Obs", "status": "Warning"}},
                {{"heuristic": "Error Prev", "severity": 2, "finding": "Obs", "status": "Warning"}},
                {{"heuristic": "Flexibility", "severity": 1, "finding": "Obs", "status": "Pass"}}
            ],
            "impact_metrics": [
                {{"label": "Accessibility / WCAG (MANDATORY)", "value": "99%"}},
                {{"label": "Conversion", "value": "+45%"}},
                {{"label": "Engagement", "value": "3x"}}
            ],
            "strategic_takeaways": [
                {{"title": "Lesson 1 (max 6 words)", "pros": "Pro statement (max 12 words).", "cons": "Con statement (max 12 words)."}},
                {{"title": "Lesson 2", "pros": "P", "cons": "C"}},
                {{"title": "Lesson 3", "pros": "P", "cons": "C"}}
            ]
        }}
        """
        
        # Prepare content payload with images if available
        content_payload = [generate_following_prompt]
        if crawler_success:
            try:
                if os.path.exists(hero_path):
                    with open(hero_path, 'rb') as f:
                        hero_data = f.read()
                    content_payload.append({'mime_type': 'image/png', 'data': hero_data})
                if os.path.exists(ui_path):
                    with open(ui_path, 'rb') as f:
                        ui_data = f.read()
                    content_payload.append({'mime_type': 'image/png', 'data': ui_data})
            except Exception as e:
                print(f"Failed to attach images to prompt: {e}")

        response = model.generate_content(
            content_payload,
            generation_config={
                "response_mime_type": "application/json",
                "max_output_tokens": 8192,
                "temperature": 0.1
            }
        )
        res_text = get_text_safely(response)
        
        if not res_text:
            raise ValueError("AI engine returned an empty response during intelligence phase.")

        try:
            # Try parsing with advanced repair
            analysis_data = safe_json_parse(res_text)
        except Exception as e:
            print(f"JSON Error: {e}")
            # Log the actual raw text for debugging
            with open("debug_raw_response.txt", "w") as f:
                f.write(res_text)
            raise e

        # 3. STITCHER PREPARATION
        update_status(task_id, "Applying visual variety & Boardroom textures...", progress=85, current_task="stitching")
        
        final_artifacts = []
        
        # Research Approach
        if 'research_approach' in analysis_data:
            final_artifacts.append({
                "type": "research_approach",
                "label": "Research Strategy",
                "title": "Methodology",
                "content": "Mixed Methods",
                "approach": analysis_data['research_approach']
            })
            
        # 1. EMPATHY: Pillars
        if 'empathy_pillars' in analysis_data:
            final_artifacts.append({
                "type": "behavioral_findings",
                "label": "Deep Research",
                "title": "Empathy Pillars",
                "pillars": analysis_data['empathy_pillars']
            })

        # 2. DEFINE: HMW Questions
        if 'hmw_questions' in analysis_data:
            final_artifacts.append({
                "type": "hmw_questions",
                "label": "Strategy",
                "title": "Defining the Challenges",
                "questions": analysis_data['hmw_questions']
            })

        # 3. RESEARCH: Competitive
        if 'competitive_analysis' in artifacts_requested:
            final_artifacts.append({
                "type": "competitive",
                "label": "Market Context",
                "title": "Competitive Benchmarking",
                "data": analysis_data.get('competitive_analysis', [
                    {'competitor': 'Market Leader', 'pros': ['Established'], 'cons': ['Outdated UI']}
                ])
            })

        if 'competitor_map' in analysis_data:
            final_artifacts.append({
                "type": "competitor_map",
                "label": "Market Positioning",
                "title": analysis_data['competitor_map'].get('title', 'Market Positioning Map'),
                "x_axis": analysis_data['competitor_map']['x_axis'],
                "y_axis": analysis_data['competitor_map']['y_axis'],
                "points": analysis_data['competitor_map']['points'],
                "solution": analysis_data['competitor_map']['solution']
            })

        # 4. DEFINE: Personas
        if 'persona_mapping' in artifacts_requested:
            face_registry = {
                "India": {
                    "male": ["indian_male_1.png", "indian_male_2.png"],
                    "female": ["indian_female_1.png", "indian_female_2.png"]
                },
                "International": {
                    "male": ["global_male_1.png", "global_male_2.png"],
                    "female": ["global_female_1.png", "global_female_2.png"]
                }
            }
            persona_list = []
            loc_key = "India" if "india" in localization.lower() else "International"
            
            personas_raw = analysis_data.get('personas', [])
            if not isinstance(personas_raw, list):
                personas_raw = []
                
            for i, p_data in enumerate(personas_raw):
                gender = p_data.get('gender', 'Male').lower()
                if gender not in ["male", "female"]: gender = "male"
                faces = face_registry[loc_key][gender]
                face_filename = faces[i % len(faces)]
                img_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'img', 'personas', loc_key, face_filename))
                persona_list.append({
                    "name": p_data.get('name'), "gender": p_data.get('gender', 'Male'), "age": p_data.get('age', 30),
                    "location": p_data.get('location', localization), "occupation": p_data.get('occupation', 'Professional'),
                    "family": p_data.get('family', 'Single'), "quote": p_data.get('quote', 'I want something easy.'),
                    "bio": p_data.get('bio'), "tech": p_data.get('tech', {'internet': 3, 'gadgets': 3}),
                    "brands": p_data.get('brands', ['Apple']), "needs": p_data.get('needs', []),
                    "frustrations": p_data.get('frustrations', []), "photo_url": f"file://{img_path}"
                })
            final_artifacts.append({"type": "personas", "label": "Define", "title": "User Personas", "personas": persona_list})

        if 'empathy_map' in analysis_data:
            final_artifacts.append({
                "type": "empathy_map",
                "label": "Deep Empathy",
                "title": analysis_data['empathy_map'].get('title', 'Empathy Mapping'),
                "quadrants": analysis_data['empathy_map']['quadrants']
            })

        # 5. IDEATE: Strategic Ideation Board
        if 'strategic_brainstorm' in analysis_data:
            final_artifacts.append({
                "type": "scamper_board",
                "label": "Brainstorming",
                "title": "Discover Ideas",
                "points": analysis_data['strategic_brainstorm']
            })

        # 6. IDEATE: Design Logic Pivot
        if 'design_logic_pivot' in analysis_data:
            final_artifacts.append({
                "type": "solution_pivot",
                "label": "Strategy Pivot",
                "title": "The Design Logic Pivot",
                "pivot": analysis_data['design_logic_pivot']
            })

        # 7. IDEATE: Journey Map
        if 'journey_map' in artifacts_requested:
            final_artifacts.append({
                "type": "journey_map",
                "label": "Synthesize",
                "title": "User Journey & Friction",
                "stages": analysis_data.get('journey_map', [])
            })

        # 8. IDEATE: Wireframes
        if 'wireframes' in artifacts_requested:
            final_artifacts.append({"type": "wireframes", "label": "Ideation", "title": "Structural Wireframes", "screens": analysis_data.get('wireframes', [])})
            
        # 9. PROTOTYPE: High-Fi UI + Annotations
        final_artifacts.append({
            "type": "ui_preview",
            "label": "Final Implementation",
            "title": "High-Fidelity Interface",
            "device_type": device_type,
            "screenshot_url": f"/static/output/ui_{task_id}.png",
            "annotations": analysis_data.get('design_annotations', [])
        })

        # 11. VALIDATE: Audit & Testing
        if 'heuristic_evaluation' in artifacts_requested:
            final_artifacts.append({"type": "heuristic_evaluation", "label": "Expert Audit", "title": "Heuristic Evaluation", "data": analysis_data.get('heuristic_evaluation', [])})

        # 12. STRATEGY: Visualizations
        if 'impact_pyramid' in analysis_data:
            layers = analysis_data['impact_pyramid']
            # Safety padding: Ensure exactly 4 layers for the matrix
            while len(layers) < 4:
                layers.append({"level": "Uncategorized", "points": ["-"]})
            final_artifacts.append({
                "type": "priority_pyramid",
                "label": "Strategic Focus",
                "title": "Impact Pyramid",
                "layers": layers[:4]
            })
            
        if 'research_flow' in analysis_data:
            final_artifacts.append({
                "type": "research_flow",
                "label": "Data Logic",
                "title": "Strategic Research Flow",
                "nodes": analysis_data['research_flow']
            })

        if 'prioritization_matrix' in analysis_data:
            final_artifacts.append({
                "type": "prioritization_matrix",
                "label": "Execution Priority",
                "title": "Impact vs Effort Prioritization",
                "points": analysis_data['prioritization_matrix']
            })

        if 'final_ideas' in analysis_data:
            final_artifacts.append({
                "type": "final_ideas",
                "label": "Reflect",
                "title": analysis_data['final_ideas'].get('title', 'Strategic Roadmaps'),
                "ideas": analysis_data['final_ideas']['ideas']
            })

        if 'usability_testing' in artifacts_requested:
            final_artifacts.append({"type": "usability_testing", "label": "Validation", "title": "Usability Testing Results", "data": analysis_data.get('usability_testing', {})})

        render_data = {
            "title": analysis_data.get('title'),
            "subtitle": analysis_data.get('subtitle'),
            "problem_statement": analysis_data.get('problem_statement'),
            "theme_color": palette['primary'], 
            "accent_color": palette['accent'],
            "secondary_color": secondary_color,
            "theme": theme, 
            "hero_image_url": f"/static/output/hero_{task_id}.png",
            "hero_secondary_url": f"/static/output/ui_{task_id}.png",
            "hero_details": analysis_data.get('hero_details', {}),
            "floating_snippets": analysis_data.get('floating_snippets', []),
            "artifacts": final_artifacts,
            "metrics": analysis_data.get('metrics', [])
        }
        
        # 4. FINAL STITCH
        update_status(task_id, "Capturing high-resolution Behance image (4K Render)...", progress=95, current_task="stitching")
        
        result_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'tasks', f"{task_id}_result.json")
        with open(result_path, 'w') as f:
            json.dump(render_data, f)
            
        try:
            import subprocess
            stitcher_script = os.path.join(os.path.dirname(__file__), 'stitcher.py')
            subprocess.run([sys.executable, stitcher_script, str(task_id)], timeout=45)
        except Exception as e:
            print(f"Stitcher subprocess failed: {e}")
            
        update_status(task_id, "Case Study generated successfully!", complete=True, progress=100)
        
    except Exception as e:
        traceback.print_exc()
        update_status(task_id, "Critical Error during generation", complete=True, error=str(e))
