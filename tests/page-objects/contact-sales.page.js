import { expect } from '@playwright/test';

/**
 * Page Object Model for Contact Sales Form
 */
export class ContactSalesPage {
  constructor(page) {
    this.page = page;
    
    // Form field locators
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name*' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name*' });
    this.companyNameInput = page.getByRole('textbox', { name: 'Company Name*' });
    this.positionInput = page.getByRole('textbox', { name: 'Your Position*' });
    this.websiteInput = page.getByRole('textbox', { name: 'Company Website URL*' });
    this.emailInput = page.locator('#email').nth(1);
    this.messageInput = page.getByRole('textbox', { name: 'How can we help you?*' });
    this.agreeCheckbox = page.locator('#agree');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    
    // Industry dropdown (default shows "Makeup")
    this.industryDropdown = page.locator('div').filter({ hasText: /^Makeup$/ }).nth(3);
  }

  /**
   * Fill out the contact sales form
   */
  async fillContactForm(contactData) {
    await this.firstNameInput.fill(contactData.firstName);
    await this.lastNameInput.fill(contactData.lastName);
    await this.companyNameInput.fill(contactData.companyName);
    
    // Select industry from dropdown if provided
    if (contactData.industry) {
      await this.industryDropdown.click();
      await this.page.waitForTimeout(300);
      await this.page.getByText(contactData.industry, { exact: true }).click();
    }
    
    await this.positionInput.fill(contactData.position);
    await this.websiteInput.fill(contactData.website);
    await this.emailInput.fill(contactData.email);
    await this.messageInput.fill(contactData.message);
  }

  /**
   * Accept terms and conditions
   */
  async acceptTerms() {
    await this.agreeCheckbox.check();
    await expect(this.agreeCheckbox).toBeChecked();
  }

  /**
   * Submit the contact form
   */
  async submitForm() {
    await this.submitButton.click();
  }

  /**
   * Complete the entire contact form flow
   */
  async completeContactForm(contactData) {
    await this.fillContactForm(contactData);
    await this.acceptTerms();
    await this.submitForm();
  }

  /**
   * Verify form is visible
   */
  async verifyFormVisible() {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.companyNameInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }
}
