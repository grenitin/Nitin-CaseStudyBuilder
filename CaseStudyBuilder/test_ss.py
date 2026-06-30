from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    device = p.devices['iPhone 12']
    context = browser.new_context(**device)
    page = context.new_page()
    page.goto('https://example.com')
    page.screenshot(path='test_ss.png')
    browser.close()
