import { test, expect } from '@playwright/test';

/**
 * Page Object Model for Login Page
 * This demonstrates the recommended pattern for organizing test code
 */
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
    this.successMessage = page.locator('.success-message');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}

test.describe('Authentication Flow Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    // Note: Update this URL to match your application
    await page.goto('https://example.com');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Example test - customize with your actual login flow
    // await loginPage.login('user@example.com', 'ValidPassword123');
    
    // Verify successful login
    // await expect(page).toHaveURL(/.*dashboard/);
    // await expect(loginPage.successMessage).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Example test - customize with your actual login flow
    // await loginPage.login('invalid@example.com', 'WrongPassword');
    
    // Verify error message appears
    // await expect(loginPage.errorMessage).toBeVisible();
    // const errorText = await loginPage.getErrorMessage();
    // expect(errorText).toContain('Invalid credentials');
  });

  test('should validate empty form submission', async ({ page }) => {
    // Example test - customize with your actual login flow
    // await loginPage.login('', '');
    
    // Verify validation errors
    // await expect(page.locator('.username-error')).toBeVisible();
    // await expect(page.locator('.password-error')).toBeVisible();
  });

  test('should handle password reset flow', async ({ page }) => {
    // Example test - customize with your actual flow
    // await page.click('text=Forgot Password');
    // await expect(page).toHaveURL(/.*reset-password/);
    
    // Fill in email for password reset
    // await page.fill('#email', 'user@example.com');
    // await page.click('button:has-text("Send Reset Link")');
    
    // Verify confirmation message
    // await expect(page.locator('.confirmation')).toContainText('Check your email');
  });

  test('should persist session after page reload', async ({ page, context }) => {
    // Example test - customize with your actual login flow
    // await loginPage.login('user@example.com', 'ValidPassword123');
    // await expect(page).toHaveURL(/.*dashboard/);
    
    // Reload the page
    // await page.reload();
    
    // Verify user is still logged in
    // await expect(page).toHaveURL(/.*dashboard/);
    // await expect(page.locator('.user-profile')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Example test - customize with your actual flow
    // await loginPage.login('user@example.com', 'ValidPassword123');
    // await page.click('.logout-button');
    
    // Verify redirect to login page
    // await expect(page).toHaveURL(/.*login/);
    // await expect(loginPage.loginButton).toBeVisible();
  });
});
