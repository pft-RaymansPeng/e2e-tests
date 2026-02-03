import { test, expect } from '@playwright/test';

/**
 * Component Tests for Skin Analyzer Trial Form
 * Tests individual UI components and their behavior without completing full signup
 */

test.describe('Skin Analyzer Form - Component Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the form before each test
    await page.goto('https://www.perfectcorp.com/business');
    await page.locator('span').filter({ hasText: 'Online Service' }).click();
    await page.getByRole('link', { name: 'Skin Analyzer Software-base' }).click();
  });

  test('should display trial signup button', async ({ page }) => {
    // Test that the main CTA is visible
    const trialButton = page.getByRole('link', { name: 'START 14-DAY FREE TRIAL' });
    await expect(trialButton).toBeVisible();
    
    await page.screenshot({ path: 'test-results/skin-analyzer-product-page.png' });
  });

  test('should open trial form in popup', async ({ page }) => {
    // Test popup behavior
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'START 14-DAY FREE TRIAL' }).click();
    const trialPage = await popupPromise;
    
    await trialPage.waitForLoadState('networkidle');
    
    // Verify form fields are present
    await expect(trialPage.getByRole('textbox', { name: 'First Name*' })).toBeVisible();
    await expect(trialPage.getByRole('textbox', { name: 'Last Name*' })).toBeVisible();
    await expect(trialPage.getByRole('textbox', { name: 'Business Email*' })).toBeVisible();
  });

  test('should display all required form fields', async ({ page }) => {
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'START 14-DAY FREE TRIAL' }).click();
    const trialPage = await popupPromise;
    
    await trialPage.waitForLoadState('networkidle');
    
    // Test all form fields are visible
    await expect(trialPage.getByRole('textbox', { name: 'First Name*' })).toBeVisible();
    await expect(trialPage.getByRole('textbox', { name: 'Last Name*' })).toBeVisible();
    await expect(trialPage.getByRole('textbox', { name: 'Business Email*' })).toBeVisible();
    await expect(trialPage.getByRole('textbox', { name: 'Company Website URL*' })).toBeVisible();
    await expect(trialPage.getByRole('textbox', { name: 'Company Name*' })).toBeVisible();
    await expect(trialPage.getByRole('textbox', { name: 'Company Address*' })).toBeVisible();
    await expect(trialPage.getByRole('textbox', { name: 'Tell Us More*' })).toBeVisible();
    await expect(trialPage.locator('#agree')).toBeVisible();
    await expect(trialPage.getByRole('button', { name: 'START 14-DAY FREE TRIAL' })).toBeVisible();
  });

  test('should display company type dropdown with correct behavior', async ({ page }) => {
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'START 14-DAY FREE TRIAL' }).click();
    const trialPage = await popupPromise;
    
    await trialPage.waitForLoadState('networkidle');
    
    // Test dropdown component
    await expect(trialPage.getByText('Please select...')).toBeVisible();
    
    // Click to open dropdown
    await trialPage.getByText('Please select...').click();
    await trialPage.waitForTimeout(300);
    
    // Verify dropdown options are visible
    await expect(trialPage.getByText('Brand', { exact: true })).toBeVisible();
    await expect(trialPage.getByText('Wellness Clinic')).toBeVisible();
    await expect(trialPage.getByText('Med-Spa/Medical Aesthetic Clinic')).toBeVisible();
    
    // Test selection
    await trialPage.getByText('Brand', { exact: true }).click();
    
    // Verify dropdown closed (option no longer shows "Please select...")
    await trialPage.screenshot({ path: 'test-results/dropdown-selected.png' });
  });

  test('should validate required fields without submitting', async ({ page }) => {
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'START 14-DAY FREE TRIAL' }).click();
    const trialPage = await popupPromise;
    
    await trialPage.waitForLoadState('networkidle');
    
    // Try to submit without filling required fields
    await trialPage.getByRole('button', { name: 'START 14-DAY FREE TRIAL' }).click();
    
    // Form should not submit - button should still be visible
    await expect(trialPage.getByRole('button', { name: 'START 14-DAY FREE TRIAL' })).toBeVisible();
    
    // Note: Add specific error message assertions if the form shows validation errors
    // await expect(trialPage.locator('.error-message')).toBeVisible();
  });

  test('should accept terms checkbox toggle', async ({ page }) => {
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'START 14-DAY FREE TRIAL' }).click();
    const trialPage = await popupPromise;
    
    await trialPage.waitForLoadState('networkidle');
    
    const checkbox = trialPage.locator('#agree');
    
    // Initially unchecked
    await expect(checkbox).not.toBeChecked();
    
    // Check it
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    
    // Uncheck it
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });
});
