import { test, expect } from '@playwright/test';

test.describe('Basic Navigation Tests', () => {
  test('should navigate to example.com and verify title', async ({ page }) => {
    // Navigate to the page
    await page.goto('https://example.com');
    
    // Verify the title
    await expect(page).toHaveTitle(/Example Domain/);
    
    // Verify heading is visible
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Example Domain');
  });

  test('should click link and navigate to new page', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Click on the "More information" link
    await page.click('text=More information');
    
    // Verify we navigated to the IANA page
    await expect(page).toHaveURL(/.*iana/);
  });
});

test.describe('Element Interaction Tests', () => {
  test('should find and interact with elements', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Get all links on the page
    const links = page.locator('a');
    const linkCount = await links.count();
    
    // Verify at least one link exists
    expect(linkCount).toBeGreaterThan(0);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/example-page.png' });
  });
});
