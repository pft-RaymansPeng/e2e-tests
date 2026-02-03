# Test Organization

This test suite is organized into two main categories:

## 📁 Directory Structure

```
tests/
├── components/          # UI Component Tests (Non-POM)
│   ├── skin-analyzer-form.spec.js
│   └── contact-sales-form.spec.js
│
├── flows/              # End-to-End Flow Tests (POM)
│   ├── skin-analyzer-trial-flow.spec.js
│   └── contact-sales-flow.spec.js
│
├── page-objects/       # Page Object Models
│   ├── skin-analyzer-trial.page.js
│   ├── contact-sales.page.js
│   └── pages.js
│
└── utils/             # Test Utilities
    ├── test-data.js
    └── helpers.js
```

## 🧩 Component Tests (tests/components/)

**Purpose**: Test individual UI components and their behavior  
**Pattern**: Direct Playwright API calls (Non-POM)  
**Characteristics**:

- ✅ Fast execution
- ✅ Test specific UI elements
- ✅ Validate component states
- ✅ Check visual behavior
- ❌ Do NOT submit forms (avoid duplicate data)

**Examples**:

- Dropdown opens and shows options
- Form fields are visible
- Validation messages appear
- Checkbox can be toggled
- Buttons are clickable

**Run Component Tests Only**:

```bash
npx playwright test tests/components/
```

## 🌊 Flow Tests (tests/flows/)

**Purpose**: Test complete end-to-end user journeys  
**Pattern**: Page Object Model (POM)  
**Characteristics**:

- ✅ Test real user scenarios
- ✅ Complete multi-step processes
- ✅ Verify entire workflows
- ✅ Maintainable and reusable
- ⚠️ May create real data (trials, contacts)

**Examples**:

- Complete trial signup process
- Full contact form submission
- User login → dashboard → action
- Multi-page workflows

**Run Flow Tests Only**:

```bash
npx playwright test tests/flows/
```

## 🎯 When to Use Each

| Goal                   | Use            |
| ---------------------- | -------------- |
| Test if dropdown works | Component Test |
| Test if form validates | Component Test |
| Test complete signup   | Flow Test      |
| Test user journey      | Flow Test      |

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run only component tests
npx playwright test tests/components/

# Run only flow tests
npx playwright test tests/flows/

# Run specific test file
npx playwright test tests/flows/skin-analyzer-trial-flow.spec.js

# Run with specific browser
npx playwright test --project=chromium
```

## 📊 Benefits of This Structure

1. **No Duplicate Signups**: Flow tests create data once
2. **Fast Component Tests**: No full form submissions
3. **Clear Separation**: Easy to understand test purpose
4. **Better Maintenance**: Change UI tests vs flow tests independently
5. **Targeted Testing**: Run only what you need

## 🔄 Migration from Old Structure

Old files (deprecated):

- ❌ `perfectcorp-skin-analyzer-trial.spec.js` → Split into component + flow
- ❌ `perfectcorp-skin-analyzer-with-pom.spec.js` → Moved to flows/
- ❌ `perfectcorp-contact-sales.spec.js` → Split into component + flow

New organization eliminates duplicate test runs and clarifies test purpose.
