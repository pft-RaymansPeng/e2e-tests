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
    
    // Open trial signup form (in popup) with increased timeout
    const trialPopup = await homePage.openTrialSignup();
    const trialPage = new SkinAnalyzerTrialPage(trialPopup);
    
    // Wait for popup to fully load
    await trialPopup.waitForLoadState('networkidle', { timeout: 15000 });
    
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
    
    // Verify successful signup with increased timeout
    await trialPage.verifySuccessfulSignup();
    
    // Close welcome modal if present (with error handling)
    try {
      await trialPopup.getByRole('button', { name: 'Close' }).click({ timeout: 5000 });
    } catch (error) {
      // Close button might not exist, that's okay
      console.log('No Close button found, continuing...');
    }
    
    // Take success screenshot
    await trialPopup.screenshot({ path: 'test-results/skin-analyzer-trial-success.png' });
  });
});
