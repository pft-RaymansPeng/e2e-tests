import { test, expect } from '@playwright/test';

/**
 * Component Tests for Contact Sales Form
 * Tests individual UI components and their behavior
 */

test.describe('Contact Sales Form - Component Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.perfectcorp.com/business');
    await page.getByRole('link', { name: 'Contact Sales' }).click();
    await page.waitForLoadState('networkidle');
  });

  test('should display all form fields', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: 'First Name*' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last Name*' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Company Name*' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Your Position*' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Company Website URL*' })).toBeVisible();
    await expect(page.locator('#email').nth(1)).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'How can we help you?*' })).toBeVisible();
    await expect(page.locator('#agree')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  test('should display industry dropdown with options', async ({ page }) => {
    // Test industry dropdown component
    const dropdown = page.locator('div').filter({ hasText: /^Makeup$/ }).nth(3);
    await expect(dropdown).toBeVisible();
    
    // Click to open
    await dropdown.click();
    await page.waitForTimeout(300);
    
    // Verify options
    await expect(page.getByText('Skincare', { exact: true })).toBeVisible();
    await expect(page.getByText('Makeup', { exact: true })).toBeVisible();
    
    // Select option
    await page.getByText('Skincare', { exact: true }).click();
  });

  test('should validate terms checkbox', async ({ page }) => {
    const checkbox = page.locator('#agree');
    
    // Initially unchecked
    await expect(checkbox).not.toBeChecked();
    
    // Check it
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });

  test('should prevent submission without required fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Form should still be visible (not submitted)
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });
});
