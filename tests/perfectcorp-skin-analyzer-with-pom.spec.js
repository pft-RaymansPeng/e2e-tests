import { test, expect } from '@playwright/test';
import { PerfectCorpBusinessPage, SkinAnalyzerTrialPage } from './page-objects/skin-analyzer-trial.page.js';
import { generateRandomEmail } from './utils/test-data.js';

/**
 * E2E Test using Page Object Model Pattern
 * Demonstrates clean, maintainable test code
 */

test.describe('Perfect Corp - Skin Analyzer Trial (with POM)', () => {
  
  test('should complete trial signup using Page Object Model', async ({ page }) => {
    // Initialize page objects
    const homePage = new PerfectCorpBusinessPage(page);
    
    // Navigate to homepage
    await homePage.navigate();
    
    // Navigate to Skin Analyzer product page
    await homePage.navigateToSkinAnalyzer();
    
    // Open trial signup form (in popup)
    const trialPopup = await homePage.openTrialSignup();
    const trialPage = new SkinAnalyzerTrialPage(trialPopup);
    
    // Prepare test data
    const testData = {
      firstName: 'Raymans',
      lastName: 'Peng',
      email: generateRandomEmail(), // Use dynamic email to avoid duplicates
      website: 'https://www.perfectcorp.com',
      companyName: 'Perfect Corp',
      companyAddress: 'Taiwan',
      companyType: 'Brand',
      message: 'Testing the Skin Analyzer trial signup flow'
    };
    
    // Complete signup using page object methods
    await trialPage.completeSignup(testData);
    
    // Verify successful signup
    await trialPage.verifySuccessfulSignup();
    
    // Close welcome modal if present
    await trialPopup.getByRole('button', { name: 'Close' }).click();
    
    // Take success screenshot
    await trialPopup.screenshot({ path: 'test-results/trial-signup-pom-success.png' });
  });
  
  test('should validate form fields individually', async ({ page }) => {
    const homePage = new PerfectCorpBusinessPage(page);
    
    await homePage.navigate();
    await homePage.navigateToSkinAnalyzer();
    
    const trialPopup = await homePage.openTrialSignup();
    const trialPage = new SkinAnalyzerTrialPage(trialPopup);
    
    await trialPopup.waitForLoadState('networkidle');
    
    // Verify all required fields are visible
    await expect(trialPage.firstNameInput).toBeVisible();
    await expect(trialPage.lastNameInput).toBeVisible();
    await expect(trialPage.emailInput).toBeVisible();
    await expect(trialPage.websiteInput).toBeVisible();
    await expect(trialPage.companyNameInput).toBeVisible();
    await expect(trialPage.agreeCheckbox).toBeVisible();
    await expect(trialPage.submitButton).toBeVisible();
  });
});
