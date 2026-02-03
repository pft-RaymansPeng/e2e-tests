import { test, expect } from '@playwright/test';
import { PerfectCorpBusinessPage, SkinAnalyzerTrialPage } from '../page-objects/skin-analyzer-trial.page.js';
import { generateRandomEmail } from '../utils/test-data.js';

/**
 * E2E Flow Test for Skin Analyzer Trial Signup
 * Tests the complete user journey using Page Object Model
 */

test.describe('Skin Analyzer Trial - E2E Flow', () => {
  
  test('should complete trial signup successfully', async ({ page }) => {
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
      email: generateRandomEmail(), // Dynamic email to avoid duplicates
      website: 'https://www.perfectcorp.com',
      companyName: 'Perfect Corp',
      companyAddress: 'Taiwan',
      companyType: 'Brand',
      message: 'E2E test for Skin Analyzer trial signup'
    };
    
    // Complete signup using page object methods
    await trialPage.completeSignup(testData);
    
    // Verify successful signup
    await trialPage.verifySuccessfulSignup();
    
    // Close welcome modal if present
    await trialPopup.getByRole('button', { name: 'Close' }).click();
    
    // Take success screenshot
    await trialPopup.screenshot({ path: 'test-results/skin-analyzer-trial-success.png' });
  });
});
