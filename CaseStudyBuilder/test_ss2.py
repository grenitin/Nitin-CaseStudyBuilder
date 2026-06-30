from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={'width': 390, 'height': 844},
        is_mobile=True,
        has_touch=True,
        device_scale_factor=3
    )
    page = context.new_page()
    page.goto('https://example.com')
    page.screenshot(path='test_ss2.png')
    browser.close()
