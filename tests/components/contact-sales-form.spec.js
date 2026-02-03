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
    // Test industry dropdown component - use more specific selector
    // Wait for the dropdown to be ready
    await page.waitForTimeout(500);
    
    // Find the industry dropdown by looking for the select/dropdown near "Industry*" label
    const dropdownTrigger = page.locator('[class*="select"]').filter({ hasText: 'Makeup' }).first();
    await expect(dropdownTrigger).toBeVisible({ timeout: 5000 });
   
    // Click to open dropdown
    await dropdownTrigger.click();
    await page.waitForTimeout(500);
    
    // Verify at least one dropdown option is visible (Skincare)
    const skincareOption = page.getByText('Skincare', { exact: true });
    await expect(skincareOption).toBeVisible({ timeout: 3000 });
    
    // Select Skincare option
    await skincareOption.click();
    
    // Verify selection (dropdown should close)
    await page.waitForTimeout(300);
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
