import { test, expect } from '@playwright/test';
import { ContactSalesPage } from '../page-objects/contact-sales.page.js';
import { generateRandomEmail } from '../utils/test-data.js';

/**
 * E2E Flow Test for Contact Sales Form
 * Tests the complete contact form submission using Page Object Model
 */

test.describe('Contact Sales - E2E Flow', () => {
  
  test('should complete contact form submission successfully', async ({ page }) => {
    // Navigate to contact sales page
    await page.goto('https://www.perfectcorp.com/business');
    await page.getByRole('link', { name: 'Contact Sales' }).click();
    await page.waitForLoadState('networkidle');
    
    // Initialize page object
    const contactPage = new ContactSalesPage(page);
    
    // Prepare test data
    const contactData = {
      firstName: 'Raymans',
      lastName: 'Peng',
      companyName: 'Perfect Corp',
      industry: 'Skincare',
      position: 'Engineer',
      website: 'https://www.perfectcorp.com',
      email: generateRandomEmail(), // Dynamic email
      message: 'E2E test for contact sales form submission'
    };
    
    // Complete contact form
    await contactPage.completeContactForm(contactData);
    
    // Wait for submission
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/contact-sales-success.png' });
  });
});
