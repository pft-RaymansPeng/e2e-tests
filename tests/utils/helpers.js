import { test, expect } from '@playwright/test';

/**
 * Custom Assertions and Helpers
 * Reusable test utilities to make your tests more readable and maintainable
 */

/**
 * Wait for an element to be visible with custom timeout
 */
export async function waitForElement(page, selector, timeout = 5000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Wait for navigation and verify URL
 */
export async function waitForNavigation(page, urlPattern) {
  await page.waitForURL(urlPattern);
}

/**
 * Fill form fields from an object
 */
export async function fillForm(page, formData) {
  for (const [selector, value] of Object.entries(formData)) {
    await page.fill(selector, value);
  }
}

/**
 * Take a screenshot with a descriptive name
 */
export async function takeScreenshot(page, testName, description) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `test-results/${testName}-${description}-${timestamp}.png`,
    fullPage: true 
  });
}

/**
 * Wait for API response
 */
export async function waitForApiResponse(page, urlPattern, method = 'GET') {
  return await page.waitForResponse(
    response => response.url().includes(urlPattern) && response.request().method() === method
  );
}

/**
 * Check if element has specific class
 */
export async function hasClass(locator, className) {
  const classes = await locator.getAttribute('class');
  return classes?.includes(className) ?? false;
}

/**
 * Get text content of multiple elements
 */
export async function getTextContents(locator) {
  return await locator.allTextContents();
}

/**
 * Scroll to element
 */
export async function scrollToElement(locator) {
  await locator.scrollIntoViewIfNeeded();
}

/**
 * Wait for element to disappear
 */
export async function waitForElementToDisappear(page, selector, timeout = 5000) {
  await page.waitForSelector(selector, { state: 'hidden', timeout });
}

/**
 * Retry an action until it succeeds or times out
 */
export async function retryAction(action, maxAttempts = 3, delayMs = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await action();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

/**
 * Check if element is in viewport
 */
export async function isInViewport(locator) {
  return await locator.isVisible();
}

/**
 * Get computed styles of an element
 */
export async function getComputedStyle(locator, property) {
  return await locator.evaluate((el, prop) => {
    return window.getComputedStyle(el).getPropertyValue(prop);
  }, property);
}
