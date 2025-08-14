from playwright.sync_api import sync_playwright, expect

def run_tests(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Test Main Page
    page.goto("http://localhost:3000/index.html", timeout=60000)
    expect(page.get_by_text("Summer Ludo Championship")).to_be_visible(timeout=10000)
    page.screenshot(path="jules-scratch/verification/01_main_page.png")

    # Test Admin Page
    page.goto("http://localhost:3000/admin.html", timeout=60000)
    expect(page.get_by_role("heading", name="Admin Dashboard")).to_be_visible()
    expect(page.get_by_text("Summer Ludo Championship")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/02_admin_page_initial.png")

    # Add a tournament
    page.get_by_placeholder("Tournament Name").fill("Playwright Test Tournament")
    page.locator("#tournament-date").fill("2024-12-31")
    page.get_by_role("button", name="Add Tournament").click()
    expect(page.get_by_text("Playwright Test Tournament")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/03_admin_page_after_add.png")

    # Delete the tournament
    page.on("dialog", lambda dialog: dialog.accept())
    card_locator = page.locator(".tournament-card", has_text="Playwright Test Tournament")
    card_locator.get_by_role("button", name="Delete").click()

    expect(page.get_by_text("Playwright Test Tournament")).not_to_be_visible()
    page.screenshot(path="jules-scratch/verification/04_admin_page_after_delete.png")

    browser.close()

with sync_playwright() as playwright:
    run_tests(playwright)
