import os
import time
import base64
from playwright.sync_api import sync_playwright

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def get_llm_feedback(provider, api_key, issue_area, image_path=None):
    """
    Calls the selected LLM to explain the accessibility issue.
    Returns (problem_explanation, suggested_solution).
    """
    if not api_key:
        return (
            "This element violates accessibility standards, making it difficult for users with disabilities to interact with the page.",
            "Please review WCAG guidelines for this specific area and update the HTML structure."
        )

    # In a full production scenario, we would send the image_path via the respective SDKs:
    # Google GenAI: client.models.generate_content(model='gemini-1.5-pro', contents=[image, prompt])
    # OpenAI: client.chat.completions.create(...) with base64 image
    
    # For now, we simulate the LLM intelligence based on the area to guarantee speed & UI demonstration:
    if issue_area == "Alt Text":
        return (
            "The image lacks an 'alt' attribute. Screen readers cannot describe this image to visually impaired users.",
            "Add a descriptive `alt=\"...\"` attribute to the `<img>` tag. If it's purely decorative, use `alt=\"\"`."
        )
    elif issue_area == "Forms":
        return (
            "The form input does not have an associated label. Users navigating via keyboard or screen reader won't know what data to enter.",
            "Add a `<label for=\"inputId\">` that matches the input's `id`, or add an `aria-label` directly to the input."
        )
    elif issue_area == "Skip Links":
        return (
            "There is no 'Skip to main content' link. Keyboard-only users are forced to tab through the entire navigation menu on every page.",
            "Add a hidden link at the very top of the DOM: `<a href=\"#main\" class=\"skip-link\">Skip to content</a>`."
        )
    elif issue_area == "ARIA Roles":
        return (
            "The page lacks sufficient ARIA landmarks (like role='main', role='navigation').",
            "Enhance the semantic structure of your HTML by adding appropriate `role` attributes to major layout containers."
        )
        
    return ("Unknown accessibility issue.", "Review HTML structure.")


def safe_screenshot(locator_or_page, screenshots_dir, prefix):
    try:
        ts = int(time.time() * 1000)
        img_path = os.path.join(screenshots_dir, f"{prefix}_{ts}.png")
        locator_or_page.screenshot(path=img_path, timeout=3000)
        return img_path.replace('static/', '')
    except Exception:
        return None

def analyze_url(url, api_key=None, provider=None):
    if not url.startswith('http://') and not url.startswith('https://'):
        url = 'https://' + url

    screenshots_dir = os.path.join("static", "screenshots")
    os.makedirs(screenshots_dir, exist_ok=True)
    
    results = []
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.set_viewport_size({"width": 1280, "height": 800})
            
            try:
                # Use networkidle and a longer timeout to support heavy SPAs like Figma and Marvel App
                page.goto(url, wait_until="networkidle", timeout=30000)
                # Extra explicit wait to allow canvas/webgl elements to fully paint
                page.wait_for_timeout(4000)
            except Exception as e:
                # Attempt to capture the error state if possible
                err_shot = safe_screenshot(page, screenshots_dir, "error_state")
                browser.close()
                return {"status": "error", "error": f"Failed to load URL: {str(e)}", "screenshot": err_shot}

            # 1. Alt Text Check
            images_fail = page.locator('img:not([alt])').all()
            if images_fail:
                img_path = safe_screenshot(images_fail[0], screenshots_dir, "alt_fail")
                prob, sol = get_llm_feedback(provider, api_key, "Alt Text", img_path)
                results.append({
                    "area": "Alt Text",
                    "status": "fail",
                    "message": f"Found {len(images_fail)} images missing the 'alt' attribute.",
                    "screenshot": img_path,
                    "problem": prob,
                    "solution": sol
                })
            else:
                images_pass = page.locator('img[alt]').all()
                img_path = safe_screenshot(images_pass[0], screenshots_dir, "alt_pass") if images_pass else safe_screenshot(page, screenshots_dir, "alt_pass_fallback")
                results.append({"area": "Alt Text", "status": "pass", "message": "All images have an 'alt' attribute.", "screenshot": img_path})

            # 2. Forms Label Check
            unlabeled_inputs = page.locator('input:not([type="submit"]):not([type="button"]):not([type="hidden"]):not([aria-label]):not([id])').all()
            if unlabeled_inputs:
                img_path = safe_screenshot(unlabeled_inputs[0], screenshots_dir, "form_fail")
                prob, sol = get_llm_feedback(provider, api_key, "Forms", img_path)
                results.append({
                    "area": "Forms",
                    "status": "fail",
                    "message": f"Found {len(unlabeled_inputs)} input fields without explicit labels.",
                    "screenshot": img_path,
                    "problem": prob,
                    "solution": sol
                })
            else:
                labeled_inputs = page.locator('input[id], input[aria-label]').all()
                img_path = safe_screenshot(labeled_inputs[0], screenshots_dir, "form_pass") if labeled_inputs else safe_screenshot(page, screenshots_dir, "form_pass_fallback")
                results.append({"area": "Forms", "status": "pass", "message": "Form inputs appear to have proper labels.", "screenshot": img_path})

            # 3. Skip Links Check
            skip_links = page.locator('a[href^="#"]:has-text("skip"), a[href^="#"]:has-text("Skip")').all()
            if not skip_links:
                prob, sol = get_llm_feedback(provider, api_key, "Skip Links")
                img_path = safe_screenshot(page, screenshots_dir, "skip_fail_fallback")
                results.append({
                    "area": "Skip Links",
                    "status": "fail",
                    "message": "No 'Skip to main content' link found.",
                    "screenshot": img_path,
                    "problem": prob,
                    "solution": sol
                })
            else:
                img_path = safe_screenshot(skip_links[0], screenshots_dir, "skip_pass")
                results.append({"area": "Skip Links", "status": "pass", "message": "Skip link is present.", "screenshot": img_path})

            # 4. ARIA Roles
            elements_with_aria = page.locator('[role]').all()
            if not elements_with_aria:
                prob, sol = get_llm_feedback(provider, api_key, "ARIA Roles")
                img_path = safe_screenshot(page, screenshots_dir, "aria_fail_fallback")
                results.append({
                    "area": "ARIA Roles",
                    "status": "fail",
                    "message": "No ARIA roles found on the page.",
                    "screenshot": img_path,
                    "problem": prob,
                    "solution": sol
                })
            else:
                img_path = safe_screenshot(elements_with_aria[0], screenshots_dir, "aria_pass")
                results.append({"area": "ARIA Roles", "status": "pass", "message": f"Found {len(elements_with_aria)} elements with ARIA roles.", "screenshot": img_path})

            browser.close()
            
    except Exception as e:
        return {"status": "error", "error": f"Playwright Error: {str(e)}"}

    # Basic score calculation
    passed = sum(1 for r in results if r['status'] == 'pass')
    score = int((passed / len(results)) * 100) if len(results) > 0 else 100
    
    return {
        "status": "success",
        "url": url,
        "score": score,
        "results": results
    }
