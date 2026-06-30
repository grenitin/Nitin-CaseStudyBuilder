import os
import time
import json
from jinja2 import Environment, FileSystemLoader
from playwright.sync_api import sync_playwright

def fix_local_paths(obj, static_dir):
    if isinstance(obj, dict):
        return {k: fix_local_paths(v, static_dir) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [fix_local_paths(v, static_dir) for v in obj]
    elif isinstance(obj, str):
        if obj.startswith('/static/'):
            relative_path = obj[len('/static/'):]
            if relative_path.startswith('output/'):
                return f"./{relative_path[7:]}"
            return f"../{relative_path}"
        elif obj.startswith('file://') and '/static/' in obj:
            # Handle absolute file:// paths injected by analyzer
            parts = obj.split('/static/')
            relative_path = parts[1]
            if relative_path.startswith('output/'):
                return f"./{relative_path[7:]}"
            return f"../{relative_path}"
    return obj

def render_case_study(task_id, data):
    """
    Renders the case study data into a high-res image using a headless browser.
    """
    template_dir = os.path.join(os.path.dirname(__file__), '..', 'templates')
    static_dir = os.path.join(os.path.dirname(__file__), '..', 'static')
    output_dir = os.path.join(static_dir, 'output')
    os.makedirs(output_dir, exist_ok=True)
    
    # Fix web-absolute image paths to local file paths
    data = fix_local_paths(data, static_dir)
    
    # 1. Setup Jinja2 with url_for mock for static rendering
    env = Environment(loader=FileSystemLoader(template_dir))
    
    def url_for(endpoint, **kwargs):
        if endpoint == 'static':
            # For static file rendering in stitcher, we use relative paths from static/output/
            return f"../{kwargs.get('filename')}"
        return ""
    
    env.globals['url_for'] = url_for
    template = env.get_template('case_study_render.html')
    
    # 2. Render HTML to string
    html_content = template.render(**data)
    
    # Save temporary HTML for playwright to render
    temp_html_path = os.path.join(output_dir, f"temp_{task_id}.html")
    with open(temp_html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    # 3. Capture with Playwright
    output_img_path = os.path.join(output_dir, f"case_study_{task_id}.png")
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(args=["--allow-file-access-from-files"])
            # Use high device scale factor for "Behance-ready" quality (2.0 = Retina)
            context = browser.new_context(
                viewport={'width': 1400, 'height': 800},
                device_scale_factor=2.0
            )
            page = context.new_page()
            
            # Load local file and wait for network to be completely idle
            page.goto(f"file://{os.path.abspath(temp_html_path)}", wait_until="networkidle", timeout=30000)
            
            # Force disable all animations/transitions and make .reveal elements fully visible instantly
            page.add_style_tag(content="""
                *, *::before, *::after {
                    transition: none !important;
                    animation: none !important;
                }
                .reveal {
                    opacity: 1 !important;
                    transform: none !important;
                }
            """)
            
            # Force expand all accordions so their data is fully visible in the downloaded image
            page.evaluate("document.querySelectorAll('.cs-section, .cs-accordion-section').forEach(el => el.classList.add('cs-expanded'));")
            
            # Wait extra time for any dynamic render and fonts (optional safety)
            time.sleep(2)
            
            # Capture full page vertical screenshot
            page.screenshot(path=output_img_path, full_page=True)
            
            browser.close()
    except Exception as e:
        print(f"Stitcher Playwright capture failed: {e}")
        # We don't raise here so the result.json is still saved and the user can preview HTML
        
    # Cleanup temp file
    if os.path.exists(temp_html_path):
        os.remove(temp_html_path)
        
    return output_img_path

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        task_id = sys.argv[1]
        result_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'tasks', f"{task_id}_result.json")
        if os.path.exists(result_path):
            with open(result_path, 'r') as f:
                render_data = json.load(f)
            render_case_study(task_id, render_data)
    else:
        # Test logic
        test_data = {
            "title": "Test Case Study",
            "subtitle": "Built with Antigravity v7",
            "theme_color": "#5c62ec",
            "hero_image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070",
            "artifacts": [
                {
                    "type": "affinity_map",
                    "label": "Empathize",
                    "title": "Affinity Mapping session",
                    "notes": [
                        {"text": "Needs clearer navigation", "color": "#fef08a", "x": 100, "y": 150, "rotate": -2},
                        {"text": "Payment fails too often", "color": "#fecaca", "x": 300, "y": 120, "rotate": 3},
                        {"text": "Loves the dark mode", "color": "#bbf7d0", "x": 200, "y": 300, "rotate": 1}
                    ]
                }
            ],
            "metrics": [
                {"value": "12.5%", "label": "Retention Increase"}
            ]
        }
        render_case_study("test_id", test_data)
