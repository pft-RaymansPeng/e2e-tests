# Playwright E2E Testing Setup

This project is set up with Playwright for end-to-end testing. Playwright is a powerful framework that allows you to automate and test web applications across multiple browsers.

## 📋 Prerequisites

**Important:** Playwright requires Node.js 18 or higher.

To check your Node version:

```bash
node --version
```

If you're running Node.js 16 or lower, please upgrade to Node 18+:

- Download from: https://nodejs.org/
- Or use a version manager like `nvm` (Node Version Manager)

## 🚀 Installation

The Playwright package has already been installed. To install the browsers, run:

```bash
npx playwright install
```

This will download Chromium, Firefox, and WebKit browsers.

## 📁 Project Structure

```
fusion-equinox/
├── tests/                          # Test files directory
│   ├── example.spec.js            # Basic navigation tests
│   ├── form-interaction.spec.js   # Form testing examples
│   ├── auth.spec.js               # Authentication flow tests
│   ├── page-objects/              # Page Object Model files
│   │   └── pages.js               # Reusable page objects
│   └── utils/                     # Test utilities
│       ├── test-data.js          # Test data and generators
│       └── helpers.js            # Custom test helpers
├── playwright.config.js           # Playwright configuration
├── package.json                   # Node.js dependencies
└── test-results/                 # Generated test results (auto-created)
```

## 🧪 Running Tests

### All Tests

```bash
npm test
```

### Headed Mode (See the browser)

```bash
npm run test:headed
```

### Debug Mode (Step through tests)

```bash
npm run test:debug
```

### UI Mode (Interactive test runner)

```bash
npm run test:ui
```

### Specific Browser

```bash
npm run test:chromium  # Chrome/Chromium
npm run test:firefox   # Firefox
npm run test:webkit    # Safari (WebKit)
```

### View Test Report

```bash
npm run test:report
```

## 📝 Writing Tests

### Basic Test Example

```javascript
import { test, expect } from "@playwright/test";

test("should verify page title", async ({ page }) => {
  await page.goto("https://example.com");
  await expect(page).toHaveTitle(/Example Domain/);
});
```

### Using Page Object Model

```javascript
import { test } from "@playwright/test";
import { HomePage } from "./page-objects/pages.js";

test("should search for product", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  await homePage.search("laptop");
});
```

### Using Test Helpers

```javascript
import { test } from "@playwright/test";
import { fillForm, takeScreenshot } from "./utils/helpers.js";
import { testUsers } from "./utils/test-data.js";

test("should login user", async ({ page }) => {
  await page.goto("/login");
  await fillForm(page, {
    "#email": testUsers.validUser.email,
    "#password": testUsers.validUser.password,
  });
  await page.click('button[type="submit"]');
  await takeScreenshot(page, "login", "success");
});
```

## 🎯 Example Tests Included

1. **example.spec.js** - Basic navigation and element interaction
2. **form-interaction.spec.js** - Form filling, validation, file uploads
3. **auth.spec.js** - Login, logout, password reset flows

> **Note:** The example tests use placeholder URLs. Update them with your actual application URLs.

## ⚙️ Configuration

Edit `playwright.config.js` to customize:

- **Base URL**: Set your application URL
- **Browsers**: Enable/disable specific browsers
- **Timeouts**: Adjust test timeouts
- **Screenshots/Videos**: Configure when to capture
- **Web Server**: Auto-start your dev server before tests

Example configuration:

```javascript
use: {
  baseURL: 'http://localhost:3000',  // Update this
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
}
```

## 🔧 Common Commands

```bash
# Run specific test file
npx playwright test tests/example.spec.js

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests with grep pattern
npx playwright test -g "login"

# Run tests in parallel
npx playwright test --workers=4

# Show test report
npx playwright show-report

# Generate test code (Codegen)
npx playwright codegen https://example.com
```

## 📚 Best Practices

1. **Use data-testid attributes** for more stable selectors
2. **Organize tests** using `test.describe()` blocks
3. **Use Page Object Model** for maintainable tests
4. **Keep tests independent** - each test should work in isolation
5. **Use beforeEach hooks** for common setup
6. **Avoid hardcoded waits** - Playwright auto-waits for elements
7. **Use meaningful test names** - describe what you're testing
8. **Take screenshots on failures** - enabled by default

## 🐛 Debugging Tips

### Debug Mode

```bash
npm run test:debug
```

Opens Playwright Inspector to step through tests.

### Headed Mode

```bash
npm run test:headed
```

Watch tests run in actual browser windows.

### Console Logs

```javascript
test("debug test", async ({ page }) => {
  page.on("console", (msg) => console.log(msg.text()));
  // Your test code
});
```

### Screenshots

```javascript
await page.screenshot({ path: "debug.png", fullPage: true });
```

## 📖 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Test Assertions](https://playwright.dev/docs/test-assertions)

## 🚨 Troubleshooting

### Node Version Error

```
Playwright requires Node.js 18 or higher
```

**Solution:** Upgrade Node.js to version 18 or higher.

### Browser Not Found

```
Executable doesn't exist
```

**Solution:** Run `npx playwright install`

### Tests Timeout

- Increase timeout in `playwright.config.js`
- Check if application is running
- Verify selectors are correct

## 🎨 Customizing Tests

The example tests are templates. To customize for your application:

1. Update URLs in test files
2. Update selectors to match your HTML
3. Add your own page objects in `tests/page-objects/`
4. Add test data in `tests/utils/test-data.js`
5. Configure `baseURL` in `playwright.config.js`

---

Happy Testing! 🚀
