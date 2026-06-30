import sys
from playwright.sync_api import sync_playwright

def crawl(url, platform, hero_path, ui_path):
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            
            base_viewport = {'width': 1440, 'height': 900} if platform in ['web', 'responsive'] else {'width': 390, 'height': 844}
            context_kwargs = {'viewport': base_viewport, 'ignore_https_errors': True}
            
            if platform == 'mobile':
                context_kwargs.update({
                    'is_mobile': True,
                    'has_touch': True,
                    'device_scale_factor': 3
                })
                
            context = browser.new_context(**context_kwargs)
            page = context.new_page()
            
            if 'figma.com' in url.lower():
                if '?' in url:
                    if 'hide-ui=1' not in url:
                        url += '&hide-ui=1'
                else:
                    url += '?hide-ui=1'
            elif 'marvelapp.com' in url.lower():
                if '?' in url:
                    if 'emb=1' not in url:
                        url += '&emb=1&iosapp=false&frameless=1'
                else:
                    url += '?emb=1&iosapp=false&frameless=1'
                    
            print(f"Crawling {url} for screenshots...")
            page.goto(url, wait_until="networkidle", timeout=60000)
            
            if 'figma.com' in url.lower():
                print("Figma URL detected, waiting extra time for WebGL canvas...")
                page.wait_for_timeout(10000)
            else:
                page.wait_for_timeout(3000)
                
            # Try to natively dismiss cookie banners by clicking the dismiss buttons
            try:
                print("Attempting to dismiss cookie banners natively...")
                # Figma often uses these button texts
                page.locator('button:has-text("Do not allow cookies"), button:has-text("Allow all cookies"), button:has-text("Accept all cookies")').first.click(timeout=3000)
                page.wait_for_timeout(1000)
            except Exception as e:
                pass # No cookie banner found or couldn't click it
                
            # Waiting to ensure canvas renders
            page.wait_for_timeout(2000)
            
            def take_smart_screenshot(page, path, url):
                if 'marvelapp.com' in url.lower():
                    # Marvel wraps prototypes in device frames. Find the actual prototype image via JS.
                    js = '''
                    () => {
                        let els = document.querySelectorAll('img, canvas');
                        let maxArea = 0;
                        let maxEl = null;
                        for (let e of els) {
                            let rect = e.getBoundingClientRect();
                            let area = rect.width * rect.height;
                            if (area > maxArea) {
                                maxArea = area; maxEl = e;
                            }
                        }
                        if (maxEl) {
                            maxEl.id = 'target-prototype-screen';
                            // Pop it to the absolute top of the DOM to avoid Marvel's overlay and device frame
                            maxEl.style.position = 'relative';
                            maxEl.style.zIndex = '9999999';
                            
                            // Also forcefully hide the 'Click anywhere' overlay if it exists
                            let overlays = document.querySelectorAll('*');
                            for (let o of overlays) {
                                if (o.innerText && o.innerText.includes('Click anywhere')) {
                                    o.style.display = 'none';
                                }
                            }
                            return true;
                        }
                        return false;
                    }
                    '''
                    found = page.evaluate(js)
                    if found:
                        page.locator('#target-prototype-screen').screenshot(path=path)
                        return
                page.screenshot(path=path)
            
            take_smart_screenshot(page, hero_path, url)
            
            # For mobile and web, take multiple scrolling screenshots for the wireframes/sliders
            import shutil
            for i in range(4):
                frame_path = ui_path.replace('.png', f'_{i}.png')
                take_smart_screenshot(page, frame_path, url)
                
                # Also save the first one as the main ui_path
                if i == 0:
                    shutil.copy(ui_path.replace('.png', '_0.png'), ui_path)
                    
                # Scroll down for the next frame
                if platform == 'mobile':
                    page.mouse.wheel(0, 750)
                else:
                    page.mouse.wheel(0, 800)
                    
                page.keyboard.press('PageDown')
                page.wait_for_timeout(1500)
                
            # Capture mobile version for responsive mockup
            if platform == 'responsive':
                try:
                    mobile_path = ui_path.replace('.png', '_mobile.png')
                    page.set_viewport_size({'width': 390, 'height': 844})
                    page.wait_for_timeout(1500)
                    take_smart_screenshot(page, mobile_path, url)
                except Exception as e:
                    print(f"Failed to capture mobile version for responsive mockup: {e}")
            
            browser.close()
            print("Crawling success!")
    except Exception as e:
        print(f"Crawler failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python crawler.py <url> <platform> <hero_path> <ui_path>")
        sys.exit(1)
        
    url = sys.argv[1]
    platform = sys.argv[2]
    hero_path = sys.argv[3]
    ui_path = sys.argv[4]
    
    crawl(url, platform, hero_path, ui_path)
