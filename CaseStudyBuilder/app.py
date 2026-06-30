import os
import sys
import uuid
import threading
import json
import time
from flask import Flask, render_template, request, jsonify, Response, send_file

# Add scripts/ to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'scripts'))
import analyzer

app = Flask(__name__)

# --- Contrast Utility Functions ---
def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    if len(hex_color) == 3:
        hex_color = ''.join([c*2 for c in hex_color])
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(*[int(c) for c in rgb])

def get_luminance(rgb):
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
    try:
        rgb = list(hex_to_rgb(hex_color))
        bg_rgb = hex_to_rgb(bg_hex)
    except:
        return hex_color
        
    if get_contrast_ratio(rgb, bg_rgb) >= target_ratio:
        return hex_color
        
    bg_lum = get_luminance(bg_rgb)
    is_dark_bg = bg_lum < 0.5
    
    step = 5
    for _ in range(50):
        if is_dark_bg:
            rgb = [min(255, c + step) for c in rgb]
        else:
            rgb = [max(0, c - step) for c in rgb]
            
        if get_contrast_ratio(rgb, bg_rgb) >= target_ratio:
            break
            
    return rgb_to_hex(rgb)
# ---------------------------------

# Directory for task statuses
TASKS_DIR = os.path.join(os.path.dirname(__file__), 'data', 'tasks')
os.makedirs(TASKS_DIR, exist_ok=True)

# Directory for generated images
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'static', 'output')
os.makedirs(OUTPUT_DIR, exist_ok=True)

def update_status(task_id, message, complete=False, error=None, current_task=None, progress=0):
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

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/standalone_affinity_preview.html')
def affinity_preview():
    return send_file('standalone_affinity_preview.html')

@app.route('/image/<path:filename>')
def serve_fipa_images(filename):
    fipa_image_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'Portfolio Website', 'FIPA', 'image'))
    full_path = os.path.join(fipa_image_dir, filename)
    if os.path.exists(full_path):
        return send_file(full_path)
    
    # Fallback to the first available PNG in the same directory (Web/ or Mobile/)
    dir_path = os.path.dirname(full_path)
    if os.path.exists(dir_path):
        png_files = sorted([f for f in os.listdir(dir_path) if f.lower().endswith('.png') and not f.startswith('.')])
        if png_files:
            try:
                import hashlib
                idx = int(hashlib.md5(filename.encode()).hexdigest(), 16) % len(png_files)
                return send_file(os.path.join(dir_path, png_files[idx]))
            except:
                return send_file(os.path.join(dir_path, png_files[0]))
                
    fallback_path = os.path.join(os.path.dirname(__file__), 'static', 'case_study_template', 'assets', 'images', 'fipa_laptop_clean.png')
    return send_file(fallback_path)

@app.route('/assets/<path:filename>')
def serve_relative_assets(filename):
    for folder in ['static/reference_assets', 'static/case_study_template/assets', 'static']:
        full_path = os.path.abspath(os.path.join(os.path.dirname(__file__), folder, filename))
        if os.path.exists(full_path):
            return send_file(full_path)
    return "Asset not found", 404

@app.route('/reference/swiggy')
def swiggy_reference():
    return send_file('static/reference_swiggy/swiggy_daily.html')

@app.route('/review_skeleton')
def review_skeleton():
    mode = request.args.get('mode', 'preview')
    theme = request.args.get('theme', 'professional')
    is_dark = "dark-mode" if theme != "minimalist" else ""
    body_class = f"{'export-mode' if mode == 'export' else ''} theme-{theme} {is_dark}"
    
    # Load default Nike India Reimagined Case Study Data
    default_json = os.path.join(os.path.dirname(__file__), 'data', 'tasks', 'c57ca5fd-aa69-418a-ad4d-586b55ddc221_result.json')
    if os.path.exists(default_json):
        with open(default_json, 'r') as f:
            data = json.load(f)
    else:
        # Fallback dummy data if JSON doesn't exist
        data = {
            "title": "Nike India Reimagined",
            "subtitle": "Unlocking India's athletic potential through hyper-localized, community-driven experiences.",
            "problem_statement": "Nike's current global approach in India overlooks the diverse athletic culture, price sensitivities, and unique digital behaviors...",
            "theme_color": "#1e3a8a",
            "accent_color": "#64748b",
            "secondary_color": "#64748b",
            "theme": "modern",
            "hero_image_url": "/static/output/hero_c57ca5fd-aa69-418a-ad4d-586b55ddc221.png",
            "hero_secondary_url": "/static/output/ui_c57ca5fd-aa69-418a-ad4d-586b55ddc221.png",
            "hero_details": {"designer_name": "Portfolio Admin", "role": "Lead UX Designer", "date": "2026", "project_tag": "Strategic Innovation"},
            "floating_snippets": [{"title": "Local Engagement", "value": "75%", "icon": "trending_up"}, {"title": "Community Growth", "value": "150K+", "icon": "trending_up"}],
            "artifacts": []
        }
 
    # Recursive helper to convert file:// absolute paths back to web-relative paths
    def clean_paths(obj):
        if isinstance(obj, dict):
            return {k: clean_paths(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [clean_paths(v) for v in obj]
        elif isinstance(obj, str) and obj.startswith('file://'):
            filename = os.path.basename(obj)
            if 'hero_' in filename or 'ui_' in filename or 'case_study_' in filename:
                return f"/static/output/{filename}"
            elif 'personas' in obj:
                parts = obj.split('static/img/personas/')
                if len(parts) > 1:
                    return f"/static/img/personas/{parts[1]}"
            elif 'affinity_wall.png' in filename:
                return "/static/img/affinity_wall.png"
        return obj
 
    cleaned_data = clean_paths(data)
    
    # Override theme and colors if explicitly passed via query parameter
    override_theme = request.args.get('theme')
    if override_theme:
        cleaned_data['theme'] = override_theme
        if override_theme == 'playful':
            cleaned_data['theme_color'] = '#F97316'
            cleaned_data['accent_color'] = '#FED7AA'
            cleaned_data['secondary_color'] = '#FED7AA'
        elif override_theme == 'modern':
            cleaned_data['theme_color'] = '#C084FC'
            cleaned_data['accent_color'] = '#E9D5FF'
            cleaned_data['secondary_color'] = '#E9D5FF'
        elif override_theme == 'professional':
            cleaned_data['theme_color'] = '#60A5FA'
            cleaned_data['accent_color'] = '#93C5FD'
            cleaned_data['secondary_color'] = '#93C5FD'
        elif override_theme == 'minimalist':
            cleaned_data['theme_color'] = '#111827'
            cleaned_data['accent_color'] = '#4B5563'
            cleaned_data['secondary_color'] = '#4B5563'

    
    # Map project_title and project_subtitle for backwards compatibility in layout headers
    cleaned_data['project_title'] = cleaned_data.get('title', 'Nike India Reimagined')
    cleaned_data['project_subtitle'] = cleaned_data.get('subtitle', "Unlocking India's athletic potential through hyper-localized, community-driven experiences.")
    cleaned_data['role'] = cleaned_data.get('hero_details', {}).get('role', 'Lead UX Designer')
    cleaned_data['duration'] = cleaned_data.get('hero_details', {}).get('date', '12 Weeks')
    cleaned_data['client'] = "Nike India"
    cleaned_data['overview_summary'] = cleaned_data.get('problem_statement', '')
    cleaned_data['project_overview_p1'] = "Hyper-Localization • Community Hubs • Vernacular Support • SCAMPER Board."
    cleaned_data['project_overview_p2'] = "The process focused on adapting Nike's premium global identity to resonate with India's unique digital behaviors, regional sports, and value-conscious consumer expectations."
    cleaned_data['body_class'] = f"theme-{cleaned_data.get('theme', theme)} {is_dark} {body_class}"
    
    # Use generated metrics/takeaways or fallbacks
    if 'impact_metrics' not in cleaned_data:
        cleaned_data['impact_metrics'] = cleaned_data.get('metrics', [
            {"label": "Accessibility / WCAG (MANDATORY)", "value": "99%"},
            {"label": "Community Engagement", "value": "75%"},
            {"label": "Regional Adoption", "value": "40%"}
        ])
    
    if 'strategic_takeaways' not in cleaned_data:
        ideas = cleaned_data.get('final_ideas', [])
        if ideas:
            cleaned_data['strategic_takeaways'] = [
                {
                    "title": idea.get('title', 'Strategic Feature'),
                    "pros": idea.get('desc', 'High community relevance.'),
                    "cons": "Requires dedicated operations."
                }
                for idea in ideas
            ]
        else:
            cleaned_data['strategic_takeaways'] = [
                {
                    "title": "Inclusive Design & WCAG (MANDATORY)",
                    "pros": "Ensured full screen reader compliance and high contrast.",
                    "cons": "Required color palette adjustments."
                },
                {
                    "title": "Nike India Connect",
                    "pros": "Hyper-localized community platforms connect runners.",
                    "cons": "Requires constant localized management."
                }
            ]
    bg_hex = '#111111' if is_dark else '#ffffff'
    primary = cleaned_data.get('theme_color') or cleaned_data.get('primary_color') or '#60A5FA'
    cleaned_data['text_accent_color'] = ensure_contrast(primary, bg_hex, 4.5)
    
    return render_template('case_study_render.html', **cleaned_data)

@app.route('/analyze_colors', methods=['POST'])
def analyze_colors():
    data = request.get_json()
    url = data.get('url', '').strip()
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    colors = analyzer.extract_brand_colors(url)
    return jsonify(colors)

@app.route('/start_analysis', methods=['POST'])
def start_analysis():
    data = request.get_json()
    url = data.get('url', '').strip()
    case_type = data.get('case_type', 'redesign')
    platform = data.get('platform', 'web')
    localization = data.get('localization', 'International')
    primary_color = data.get('primary_color', '#5c62ec')
    secondary_color = data.get('secondary_color', '#00d2ff')
    theme = data.get('theme', 'dark')
    artifacts = data.get('artifacts', [])
    
    task_id = str(uuid.uuid4())
    update_status(task_id, "Initializing Case Study Builder...", progress=5)
    
    # Run analyzer in a separate thread
    thread = threading.Thread(target=analyzer.run_analysis_worker, args=(task_id, url, case_type, platform, localization, primary_color, secondary_color, artifacts, theme))
    thread.start()
    
    return jsonify({'task_id': task_id})

@app.route('/status/<task_id>')
def status(task_id):
    def generate():
        last_status = None
        filepath = os.path.join(TASKS_DIR, f"{task_id}.json")
        
        while True:
            if not os.path.exists(filepath):
                time.sleep(0.5)
                continue
                
            try:
                with open(filepath, 'r') as f:
                    task = json.load(f)
            except:
                time.sleep(0.5)
                continue

            if task.get('status') != last_status:
                yield f"data: {json.dumps(task)}\n\n"
                last_status = task.get('status')

            if task.get('complete'):
                break
            time.sleep(1)

    return Response(generate(), mimetype='text/event-stream')

@app.route('/download/<task_id>')
def download_result(task_id):
    import re
    image_path = os.path.join(OUTPUT_DIR, f"case_study_{task_id}.png")
    result_json = os.path.join(TASKS_DIR, f"{task_id}_result.json")
    
    if not os.path.exists(image_path):
        return "File not found", 404
        
    title = "CaseStudy"
    if os.path.exists(result_json):
        try:
            with open(result_json, 'r') as f:
                data = json.load(f)
                title = data.get('title', 'CaseStudy')
        except Exception:
            pass
            
    # Clean title for filename
    safe_title = re.sub(r'[^a-zA-Z0-9]', '_', title)
    download_name = f"{safe_title}_Case_Study.png"
    
    return send_file(image_path, as_attachment=True, download_name=download_name)

@app.route('/get_result/<task_id>')
def get_result(task_id):
    # Path to the final generated Behance image
    image_path = os.path.join(OUTPUT_DIR, f"case_study_{task_id}.png")
    result_json = os.path.join(TASKS_DIR, f"{task_id}_result.json")
    
    title = "CaseStudy"
    if os.path.exists(result_json):
        try:
            with open(result_json, 'r') as f:
                data = json.load(f)
                title = data.get('title', 'CaseStudy')
        except Exception:
            pass
            
    if os.path.exists(image_path):
        return jsonify({
            'image_url': f'/static/output/case_study_{task_id}.png',
            'preview_url': f'/preview/{task_id}',
            'title': title
        })
    elif os.path.exists(result_json):
        # Fallback to HTML preview if image failed
        return jsonify({
            'image_url': None, 
            'preview_url': f'/preview/{task_id}',
            'note': 'Image render failed, showing HTML preview instead.',
            'title': title
        })
        
    return jsonify({'error': 'Result not ready'}), 404

@app.route('/preview/<task_id>')
def preview(task_id):
    filepath = os.path.join(TASKS_DIR, f"{task_id}_result.json")
    if not os.path.exists(filepath):
        return "Preview not ready or project not found.", 404
        
    with open(filepath, 'r') as f:
        data = json.load(f)
        
    # Recursive helper to convert file:// absolute paths back to web-relative paths
    def clean_paths(obj):
        if isinstance(obj, dict):
            return {k: clean_paths(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [clean_paths(v) for v in obj]
        elif isinstance(obj, str) and obj.startswith('file://'):
            # Extract filename and determine static path
            filename = os.path.basename(obj)
            if 'hero_' in filename or 'ui_' in filename or 'case_study_' in filename:
                return f"/static/output/{filename}"
            elif 'personas' in obj:
                # Handle deep paths for personas
                parts = obj.split('static/img/personas/')
                if len(parts) > 1:
                    return f"/static/img/personas/{parts[1]}"
            elif 'affinity_wall.png' in filename:
                return "/static/img/affinity_wall.png"
        return obj

    cleaned_data = clean_paths(data)
    theme = cleaned_data.get('theme', 'professional')
    is_dark = "dark-mode" if theme != "minimalist" else ""
    cleaned_data['body_class'] = f"theme-{theme} {is_dark}"
    
    bg_hex = '#111111' if is_dark else '#ffffff'
    primary = cleaned_data.get('theme_color') or cleaned_data.get('primary_color') or '#60A5FA'
    cleaned_data['text_accent_color'] = ensure_contrast(primary, bg_hex, 4.5)
    
    return render_template('case_study_render.html', **cleaned_data)

if __name__ == '__main__':
    print("\n🚀 AI Case Study Builder running at: http://localhost:8080\n")
    app.run(debug=True, use_reloader=True, host='0.0.0.0', port=8080, threaded=True)
