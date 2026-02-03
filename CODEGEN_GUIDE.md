# Playwright Codegen (Test Recorder) Guide

## 🎯 What is Codegen?

Playwright's **Codegen** is a test recorder that generates test code automatically by recording your browser interactions. It's the easiest way to create tests without writing code manually.

## 📋 Prerequisites

- Node.js 18 or higher installed
- Playwright browsers installed (`npx playwright install`)

## 🚀 Basic Usage

### Start Recording

```bash
npx playwright codegen https://www.perfectcorp.com/business
```

This opens:

1. **Browser window** - Where you interact with the site
2. **Playwright Inspector** - Shows generated code in real-time

### What Gets Recorded

✅ **Clicks** - Buttons, links, any clickable elements
✅ **Text input** - Form fields, search boxes
✅ **Selections** - Dropdowns, radio buttons, checkboxes
✅ **Navigation** - Page transitions, URL changes
✅ **Hover actions** - Mouse hover interactions
✅ **Keyboard shortcuts** - Key presses

### Recording Your Test Flow

**Step-by-step for Perfect Corp Business:**

1. **Run codegen:**

   ```bash
   npx playwright codegen https://www.perfectcorp.com/business
   ```

2. **Interact with the site:**
   - Click on navigation menu items
   - Fill out contact forms
   - Browse product pages
   - View demos or videos
   - Submit forms
   - Whatever flow you want to test!

3. **Watch code generate:**
   - The Inspector shows code as you interact
   - Code appears in real-time
   - Includes proper selectors and actions

4. **Copy the code:**
   - Click "Copy" in the Inspector
   - Paste into your test file
   - Add assertions and organize as needed

## 🎨 Advanced Codegen Options

### Record with Specific Browser

```bash
# Firefox
npx playwright codegen --browser=firefox https://www.perfectcorp.com/business

# WebKit (Safari)
npx playwright codegen --browser=webkit https://www.perfectcorp.com/business

# Chromium (default)
npx playwright codegen --browser=chromium https://www.perfectcorp.com/business
```

### Record with Device Emulation

```bash
# iPhone 12
npx playwright codegen --device="iPhone 12" https://www.perfectcorp.com/business

# Pixel 5
npx playwright codegen --device="Pixel 5" https://www.perfectcorp.com/business

# iPad Pro
npx playwright codegen --device="iPad Pro" https://www.perfectcorp.com/business
```

### Save to File Directly

```bash
npx playwright codegen \
  --output tests/perfectcorp-business.spec.js \
  https://www.perfectcorp.com/business
```

### Custom Viewport Size

```bash
npx playwright codegen --viewport-size=1920,1080 https://www.perfectcorp.com/business
```

### Record with Authentication

If you need to login first:

```bash
# Save authentication state
npx playwright codegen --save-storage=auth.json https://www.perfectcorp.com/business

# Load authentication state
npx playwright codegen --load-storage=auth.json https://www.perfectcorp.com/business
```

## 📝 Example Workflow for Perfect Corp

### Scenario: Test Contact Form Flow

1. **Start recording:**

   ```bash
   npx playwright codegen https://www.perfectcorp.com/business
   ```

2. **Perform these actions in the browser:**
   - Navigate to Contact page
   - Fill in name field
   - Fill in email field
   - Fill in company name
   - Fill in message
   - Click submit button
   - Verify success message

3. **Generated code (example):**

   ```javascript
   import { test, expect } from "@playwright/test";

   test("test", async ({ page }) => {
     await page.goto("https://www.perfectcorp.com/business");
     await page.click("text=Contact");
     await page.fill("#name", "John Doe");
     await page.fill("#email", "john@example.com");
     await page.fill("#company", "Test Corp");
     await page.fill("#message", "Interested in your solutions");
     await page.click('button:has-text("Submit")');
   });
   ```

4. **Enhance with assertions:**

   ```javascript
   import { test, expect } from "@playwright/test";

   test("should submit contact form successfully", async ({ page }) => {
     await page.goto("https://www.perfectcorp.com/business");

     // Navigate to contact
     await page.click("text=Contact");
     await expect(page).toHaveURL(/.*contact/);

     // Fill form
     await page.fill("#name", "John Doe");
     await page.fill("#email", "john@example.com");
     await page.fill("#company", "Test Corp");
     await page.fill("#message", "Interested in your solutions");

     // Submit
     await page.click('button:has-text("Submit")');

     // Verify success
     await expect(page.locator(".success-message")).toBeVisible();
     await expect(page.locator(".success-message")).toContainText("Thank you");
   });
   ```

## 🎭 Inspector Features

While recording, the Inspector provides:

### 1. **Record Button**

- Toggle recording on/off
- Pause to add manual code

### 2. **Pick Locator**

- Click to select an element
- Shows the best selector for that element
- Copy selector to clipboard

### 3. **Assert Visibility**

- Add assertions for element visibility
- Assert text content
- Assert values

### 4. **Copy Code**

- Copy all generated code
- Clear to start fresh

### 5. **Language Selection**

- JavaScript
- TypeScript
- Python
- C#
- Java

## 💡 Tips for Better Recording

### 1. Use Unique Identifiers

Add `data-testid` attributes to your HTML:

```html
<button data-testid="submit-button">Submit</button>
```

Then Playwright will use them:

```javascript
await page.click('[data-testid="submit-button"]');
```

### 2. Add Assertions Manually

Codegen generates actions, but you should add assertions:

```javascript
// Generated
await page.click("text=Login");

// Add assertion
await expect(page).toHaveURL(/.*dashboard/);
await expect(page.locator(".welcome")).toBeVisible();
```

### 3. Organize Code

Break recorded code into logical test cases:

```javascript
test.describe("Contact Flow", () => {
  test("should navigate to contact page", async ({ page }) => {
    // Navigation test
  });

  test("should submit form", async ({ page }) => {
    // Form submission test
  });
});
```

### 4. Extract Page Objects

Convert recorded code to Page Object Model:

```javascript
class ContactPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.locator("#name");
    this.emailInput = page.locator("#email");
    this.submitBtn = page.locator('button:has-text("Submit")');
  }

  async fillForm(name, email) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.submitBtn.click();
  }
}
```

## 🔍 Debugging Recorded Tests

If recorded test doesn't work:

1. **Check selectors:**

   ```bash
   # Use pick locator to find better selector
   npx playwright codegen https://www.perfectcorp.com/business
   ```

2. **Add waits if needed:**

   ```javascript
   await page.waitForSelector(".element");
   await page.waitForLoadState("networkidle");
   ```

3. **Run in headed mode:**

   ```bash
   npm run test:headed
   ```

4. **Use debug mode:**
   ```bash
   npm run test:debug
   ```

## 📚 Next Steps After Recording

1. **Organize tests** into logical groups
2. **Add assertions** to verify behavior
3. **Extract reusable code** into helpers/page objects
4. **Add test data** from `test-data.js`
5. **Handle dynamic content** with proper waits
6. **Add error scenarios** testing

## 🎯 Quick Reference

```bash
# Basic recording
npx playwright codegen <URL>

# Save to file
npx playwright codegen --output <file> <URL>

# Specific browser
npx playwright codegen --browser=<browser> <URL>

# Mobile device
npx playwright codegen --device="<device>" <URL>

# With auth
npx playwright codegen --save-storage=auth.json <URL>

# Custom viewport
npx playwright codegen --viewport-size=1920,1080 <URL>
```

## ✅ Your Action Items

For Perfect Corp Business testing:

1. **Upgrade Node.js** to version 18+
2. **Install browsers**: `npx playwright install`
3. **Start recording**: `npx playwright codegen https://www.perfectcorp.com/business`
4. **Perform your test flow** in the opened browser
5. **Copy generated code** from Inspector
6. **Paste into** `tests/perfectcorp-business.spec.js`
7. **Add assertions** to verify expected behavior
8. **Run tests**: `npm test`

---

Happy recording! 🎬
