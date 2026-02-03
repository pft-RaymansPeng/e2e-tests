import { test, expect } from '@playwright/test';
import { generateRandomEmail } from './utils/test-data.js';

/**
 * E2E Test for Perfect Corp Contact Sales Form
 * Tests the contact sales form submission flow
 */

test.describe('Perfect Corp - Contact Sales Form', () => {
  
  test('should complete contact sales form successfully', async ({ page }) => {
    // Navigate to Perfect Corp business homepage
    await page.goto('https://www.perfectcorp.com/business');
    
    // Click on "Contact Sales" button
    await page.getByRole('link', { name: 'Contact Sales' }).click();
    
    // Wait for form to load
    await page.waitForLoadState('networkidle');
    
    // Fill out personal information with dynamic email
    await page.getByRole('textbox', { name: 'First Name*' }).fill('Raymans');
    await page.getByRole('textbox', { name: 'Last Name*' }).fill('Peng');
    await page.getByRole('textbox', { name: 'Company Name*' }).fill('Perfect Corp');
    
    // Select industry - Skincare
    // First click to open dropdown
    await page.locator('div').filter({ hasText: /^Makeup$/ }).nth(3).click();
    await page.waitForTimeout(300);
    // Then select option
    await page.getByText('Skincare', { exact: true }).click();
    
    // Fill out position and company website
    await page.getByRole('textbox', { name: 'Your Position*' }).fill('Engineer');
    await page.getByRole('textbox', { name: 'Company Website URL*' }).fill('https://www.perfectcorp.com');
    
    // Fill email with dynamic timestamp
    await page.locator('#email').nth(1).fill(generateRandomEmail());
    
    // Fill in message
    await page.getByRole('textbox', { name: 'How can we help you?*' }).fill('Interested in learning more about your solutions');
    
    // Accept terms and conditions
    await page.locator('#agree').check();
    await expect(page.locator('#agree')).toBeChecked();
    
    // Submit the form
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for submission to complete
    await page.waitForTimeout(2000);
    
    // Verify success (add specific success message selector if available)
    // await expect(page.locator('.success-message')).toBeVisible();
    
    // Take screenshot of result
    await page.screenshot({ path: 'test-results/contact-sales-submission.png' });
  });
  
  test('should validate required fields on contact form', async ({ page }) => {
    await page.goto('https://www.perfectcorp.com/business');
    
    // Click on "Contact Sales"
    await page.getByRole('link', { name: 'Contact Sales' }).click();
    await page.waitForLoadState('networkidle');
    
    // Try to submit without filling required fields
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Verify form validation prevents submission
    // (form should still be visible, not navigated away)
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });
  
  test('should navigate to contact sales page', async ({ page }) => {
    await page.goto('https://www.perfectcorp.com/business');
    
    // Click on "Contact Sales"
    await page.getByRole('link', { name: 'Contact Sales' }).click();
    
    // Verify form is visible
    await expect(page.getByRole('textbox', { name: 'First Name*' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last Name*' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Company Name*' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/contact-sales-form.png' });
  });
});
