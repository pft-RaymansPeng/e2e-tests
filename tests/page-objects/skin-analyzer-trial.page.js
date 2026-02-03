import { expect } from '@playwright/test';

/**
 * Page Object Model for Skin Analyzer Trial Signup Flow
 * Encapsulates the trial signup form interactions
 */
export class SkinAnalyzerTrialPage {
  constructor(page) {
    this.page = page;
    
    // Form field locators
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name*' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name*' });
    this.emailInput = page.getByRole('textbox', { name: 'Business Email*' });
    this.websiteInput = page.getByRole('textbox', { name: 'Company Website URL*' });
    this.companyNameInput = page.getByRole('textbox', { name: 'Company Name*' });
    this.companyAddressInput = page.getByRole('textbox', { name: 'Company Address*' });
    this.tellUsMoreInput = page.getByRole('textbox', { name: 'Tell Us More*' });
    this.agreeCheckbox = page.locator('#agree');
    this.submitButton = page.getByRole('button', { name: 'START 14-DAY FREE TRIAL' });
  }

  /**
   * Fill out the entire trial signup form
   */
  async fillTrialForm(userData) {
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.emailInput.fill(userData.email);
    await this.websiteInput.fill(userData.website);
    await this.companyNameInput.fill(userData.companyName);
    await this.companyAddressInput.fill(userData.companyAddress);
    
    // Select company type from dropdown if provided
    if (userData.companyType) {
      // First, click on the dropdown to open it (look for "Please select..." or the dropdown trigger)
      await this.page.getByText('Please select...').click();
      
      // Wait a moment for dropdown to open
      await this.page.waitForTimeout(500);
      
      // Then click on the desired option
      await this.page.getByText(userData.companyType, { exact: true }).click();
    }
    
    await this.tellUsMoreInput.fill(userData.message);
  }

  /**
   * Accept terms and conditions
   */
  async acceptTerms() {
    await this.agreeCheckbox.check();
    await expect(this.agreeCheckbox).toBeChecked();
  }

  /**
   * Submit the trial form
   */
  async submitForm() {
    await this.submitButton.click();
  }

  /**
   * Complete the entire signup flow
   */
  async completeSignup(userData) {
    await this.page.waitForLoadState('networkidle');
    await this.fillTrialForm(userData);
    await this.acceptTerms();
    await this.submitForm();
  }

  /**
   * Verify successful redirect to SMB portal
   */
  async verifySuccessfulSignup() {
    await this.page.waitForURL('https://smb.perfectcorp.com/?lang=enu&solutionType=SKIN_ANALYSIS', { timeout: 10000 });
    await expect(this.page).toHaveURL('https://smb.perfectcorp.com/?lang=enu&solutionType=SKIN_ANALYSIS');
  }
}

/**
 * Page Object for Perfect Corp Business Homepage
 */
export class PerfectCorpBusinessPage {
  constructor(page) {
    this.page = page;
    this.onlineServiceMenu = page.locator('span').filter({ hasText: 'Online Service' });
    this.skinAnalyzerLink = page.getByRole('link', { name: 'Skin Analyzer Software-base' });
    this.startTrialButton = page.getByRole('link', { name: 'START 14-DAY FREE TRIAL' });
  }

  /**
   * Navigate to homepage
   */
  async navigate() {
    await this.page.goto('https://www.perfectcorp.com/business');
    await expect(this.page).toHaveURL('https://www.perfectcorp.com/business');
  }

  /**
   * Navigate to Skin Analyzer product page
   */
  async navigateToSkinAnalyzer() {
    await this.onlineServiceMenu.click();
    await this.skinAnalyzerLink.click();
  }

  /**
   * Open trial signup form in new popup
   */
  async openTrialSignup() {
    const popupPromise = this.page.waitForEvent('popup');
    await this.startTrialButton.click();
    return await popupPromise;
  }
}
