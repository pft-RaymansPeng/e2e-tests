import { test, expect } from '@playwright/test';
import { generateRandomEmail } from './utils/test-data.js';

/**
 * E2E Test for Perfect Corp Skin Analyzer Free Trial Signup Flow
 * Tests the complete user journey from landing page to trial registration
 */

test.describe('Perfect Corp - Skin Analyzer Free Trial', () => {
  
  test('should complete free trial signup flow successfully', async ({ page }) => {
    // Navigate to Perfect Corp business homepage
    await page.goto('https://www.perfectcorp.com/business');
    
    // Verify homepage loaded
    await expect(page).toHaveURL('https://www.perfectcorp.com/business');
    
    // Navigate to Skin Analyzer through Online Service menu
    await page.locator('span').filter({ hasText: 'Online Service' }).click();
    await page.getByRole('link', { name: 'Skin Analyzer Software-base' }).click();
    
    // Click "START 14-DAY FREE TRIAL" button - this opens a popup
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'START 14-DAY FREE TRIAL' }).click();
    const trialPage = await popupPromise;
    
    // Wait for trial signup form to load
    await trialPage.waitForLoadState('networkidle');
    
    // Fill out personal information with dynamic email
    await trialPage.getByRole('textbox', { name: 'First Name*' }).fill('Raymans');
    await trialPage.getByRole('textbox', { name: 'Last Name*' }).fill('Peng');
    await trialPage.getByRole('textbox', { name: 'Business Email*' }).fill(generateRandomEmail());
    
    // Fill out company information
    await trialPage.getByRole('textbox', { name: 'Company Website URL*' }).fill('https://www.perfectcorp.com');
    await trialPage.getByRole('textbox', { name: 'Company Name*' }).fill('Perfect');
    await trialPage.getByRole('textbox', { name: 'Company Address*' }).fill('Perfect');
    
    // Select company type as "Brand" from dropdown
    // First click the dropdown to open it
    await trialPage.getByText('Please select...').click();
    await trialPage.waitForTimeout(500); // Wait for dropdown to open
    // Then select the option
    await trialPage.getByText('Brand', { exact: true }).click();
    
    // Fill in additional information
    await trialPage.getByRole('textbox', { name: 'Tell Us More*' }).fill('test');
    
    // Accept terms and conditions
    await trialPage.locator('#agree').check();
    await expect(trialPage.locator('#agree')).toBeChecked();
    
    // Submit the form
    await trialPage.getByRole('button', { name: 'START 14-DAY FREE TRIAL' }).click();
    
    // Verify redirect to SMB portal after successful submission
    await trialPage.waitForURL('https://smb.perfectcorp.com/?lang=enu&solutionType=SKIN_ANALYSIS', { timeout: 10000 });
    await expect(trialPage).toHaveURL('https://smb.perfectcorp.com/?lang=enu&solutionType=SKIN_ANALYSIS');
    
    // Close any welcome modal if present
    await trialPage.getByRole('button', { name: 'Close' }).click();
    
    // Take screenshot of success state
    await trialPage.screenshot({ path: 'test-results/trial-signup-success.png' });
  });
  
  test('should validate required fields on trial form', async ({ page }) => {
    await page.goto('https://www.perfectcorp.com/business');
    
    // Navigate to trial form
    await page.locator('span').filter({ hasText: 'Online Service' }).click();
    await page.getByRole('link', { name: 'Skin Analyzer Software-base' }).click();
    
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'START 14-DAY FREE TRIAL' }).click();
    const trialPage = await popupPromise;
    
    await trialPage.waitForLoadState('networkidle');
    
    // Try to submit without filling required fields
    await trialPage.getByRole('button', { name: 'START 14-DAY FREE TRIAL' }).click();
    
    // Verify form validation (form should not submit)
    // Add specific validation checks based on your form's error messages
    // Example:
    // await expect(trialPage.locator('.error-message')).toBeVisible();
  });
  
  test('should navigate to Skin Analyzer product page', async ({ page }) => {
    await page.goto('https://www.perfectcorp.com/business');
    
    // Navigate through Online Service menu
    await page.locator('span').filter({ hasText: 'Online Service' }).click();
    await page.getByRole('link', { name: 'Skin Analyzer Software-base' }).click();
    
    // Verify we're on the Skin Analyzer product page
    await expect(page.getByRole('link', { name: 'START 14-DAY FREE TRIAL' })).toBeVisible();
    
    // Take screenshot of product page
    await page.screenshot({ path: 'test-results/skin-analyzer-product-page.png' });
  });
});
