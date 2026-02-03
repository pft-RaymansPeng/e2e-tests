# CI/CD Setup: GitHub Actions + Slack Integration

This guide shows you how to set up automated E2E testing with GitHub Actions and trigger tests from Slack.

## 🎯 What You Get

- ✅ Automated tests on every push/PR
- ✅ Manual test runs from GitHub UI
- ✅ Trigger tests from Slack commands
- ✅ Test results posted back to Slack
- ✅ Upload test reports and screenshots

## 📋 Prerequisites

1. GitHub repository for your e2e-tests
2. Slack workspace with admin access
3. GitHub Personal Access Token (for Slack integration)

---

## Part 1: Set Up GitHub Actions

### Step 1: Push Your Code to GitHub

```bash
cd d:\dev\e2e-tests

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Playwright E2E tests"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/e2e-tests.git

# Push to GitHub
git push -u origin main
```

### Step 2: Verify GitHub Actions

1. Go to your GitHub repository
2. Click on **Actions** tab
3. You should see the "Playwright E2E Tests" workflow

The workflow will **automatically run** on:

- Every push to `main` or `master` branch
- Every pull request
- Manual trigger from GitHub UI
- Slack commands (after setup)

---

## Part 2: Set Up Slack Integration

### Option A: Using Slack Slash Commands (Recommended)

#### 1. Create a Slack App

1. Go to https://api.slack.com/apps
2. Click **"Create New App"** → **"From scratch"**
3. Name: `E2E Test Runner`
4. Choose your workspace
5. Click **"Create App"**

#### 2. Create a Slash Command

1. In your Slack app settings, go to **"Slash Commands"**
2. Click **"Create New Command"**
3. Configure:
   - **Command**: `/run-e2e`
   - **Request URL**: Your webhook endpoint (see below)
   - **Short Description**: `Run Playwright E2E tests`
   - **Usage Hint**: `[--browser=chromium|firefox|webkit] [--test=filename]`
4. Click **"Save"**

#### 3. Set Up Webhook Endpoint

You need a server to receive Slack commands and trigger GitHub Actions. Here are two options:

**Option 1: Use a serverless function (Vercel, Netlify, AWS Lambda)**

Create a simple endpoint that:

1. Receives Slack slash command
2. Triggers GitHub repository_dispatch event

See `slack-webhook-server.js` in this directory for a sample implementation.

**Option 2: Use GitHub Actions with repository_dispatch directly**

Use a service like Zapier or Make.com to:

1. Listen for Slack slash command
2. Send HTTP POST to GitHub API

#### 4. Create GitHub Personal Access Token

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Name: `E2E Tests Slack Integration`
4. Scopes: Check `repo` (full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)

#### 5. Configure Slack Webhook

Add these environment variables to your webhook server:

```bash
GITHUB_TOKEN=ghp_your_token_here
GITHUB_OWNER=your-username
GITHUB_REPO=e2e-tests
SLACK_SIGNING_SECRET=your_slack_signing_secret
```

Get Slack Signing Secret from:

- Slack App → **Basic Information** → **App Credentials** → **Signing Secret**

### Option B: Using Slack Incoming Webhooks (Simpler, Response Only)

This option only sends results TO Slack, not triggering FROM Slack.

#### 1. Enable Incoming Webhooks

1. In your Slack app, go to **"Incoming Webhooks"**
2. Toggle **"Activate Incoming Webhooks"** to ON
3. Click **"Add New Webhook to Workspace"**
4. Choose a channel (e.g., `#e2e-tests`)
5. Click **"Allow"**
6. Copy the **Webhook URL**

#### 2. Add Webhook URL to GitHub Secrets

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Name: `SLACK_WEBHOOK_URL`
4. Value: Paste your webhook URL
5. Click **"Add secret"**

---

## Part 3: How to Use

### Trigger Tests from GitHub UI

1. Go to **Actions** tab
2. Click **"Playwright E2E Tests"**
3. Click **"Run workflow"**
4. Select:
   - Branch
   - Browser (chromium/firefox/webkit/all)
   - Test file (optional, e.g., `perfectcorp-contact-sales.spec.js`)
5. Click **"Run workflow"**

### Trigger Tests from Slack

Use the slash command:

```
/run-e2e
/run-e2e --browser=firefox
/run-e2e --browser=chromium --test=perfectcorp-skin-analyzer-trial.spec.js
/run-e2e --browser=all
```

### Automatic Triggers

Tests run automatically on:

- Push to main/master branch
- Pull requests

---

## Part 4: Slack Webhook Server (Sample)

Create this file if you want a custom webhook endpoint:

**File: `slack-webhook-server.js`**

```javascript
const express = require("express");
const crypto = require("crypto");
const { Octokit } = require("@octokit/rest");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;

const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Verify Slack signature
function verifySlackSignature(req) {
  const signature = req.headers["x-slack-signature"];
  const timestamp = req.headers["x-slack-request-timestamp"];
  const body = req.rawBody;

  const time = Math.floor(new Date().getTime() / 1000);
  if (Math.abs(time - timestamp) > 300) {
    return false;
  }

  const sigBasestring = `v0:${timestamp}:${body}`;
  const mySignature =
    "v0=" +
    crypto
      .createHmac("sha256", SLACK_SIGNING_SECRET)
      .update(sigBasestring)
      .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(mySignature),
    Buffer.from(signature),
  );
}

// Handle Slack slash command
app.post("/slack/run-e2e", async (req, res) => {
  // Verify request is from Slack
  if (!verifySlackSignature(req)) {
    return res.status(401).send("Invalid signature");
  }

  const { text, user_name } = req.body;

  // Parse command arguments
  const args = text.split(" ");
  const browser =
    args.find((arg) => arg.startsWith("--browser="))?.split("=")[1] ||
    "chromium";
  const testFile =
    args.find((arg) => arg.startsWith("--test="))?.split("=")[1] || "";

  // Respond immediately to Slack
  res.json({
    response_type: "in_channel",
    text: `🚀 Starting E2E tests...\n*Browser:* ${browser}\n*Test:* ${testFile || "All tests"}`,
  });

  // Trigger GitHub Actions
  try {
    await octokit.repos.createDispatchEvent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      event_type: "run-e2e-tests",
      client_payload: {
        browser,
        test_file: testFile,
        user: user_name,
      },
    });
  } catch (error) {
    console.error("Failed to trigger GitHub Action:", error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Slack webhook server running on port ${PORT}`);
});
```

Deploy this to:

- Vercel
- Netlify Functions
- AWS Lambda
- Your own server

---

## 📊 Test Reports

### View in GitHub

1. Go to **Actions** tab
2. Click on a workflow run
3. Scroll down to **Artifacts**
4. Download:
   - `playwright-report` - HTML test report
   - `test-results` - Screenshots from failures

### View in Slack

After tests complete, you'll receive a message in Slack with:

- ✅ Pass/Fail status
- Browser used
- Link to view detailed results on GitHub

---

## 🎯 Example Workflows

### Daily Scheduled Tests

Add to `.github/workflows/playwright.yml`:

```yaml
on:
  schedule:
    # Run every day at 9 AM UTC
    - cron: "0 9 * * *"
```

### Test Specific Environments

Add environment parameter:

```yaml
workflow_dispatch:
  inputs:
    environment:
      description: "Environment to test"
      required: true
      type: choice
      options:
        - production
        - staging
        - development
```

Then update test to use `process.env.ENVIRONMENT`.

---

## 🔧 Troubleshooting

### Tests fail in CI but pass locally

- Check Node.js version (use same version locally and in CI)
- Ensure all dependencies are installed: `npm ci`
- Check for timing issues - add `waitForLoadState('networkidle')`

### Slack webhook not working

- Verify Signing Secret is correct
- Check webhook server logs
- Test with `curl` to see exact error

### GitHub Action not triggered

- Check repository_dispatch event type matches
- Verify GitHub token has `repo` scope
- Check Action logs for errors

---

## 🎓 Best Practices

1. **Run tests on every PR** - Catch issues before merge
2. **Use test results artifacts** - Debug failures with screenshots
3. **Set up notifications** - Stay informed of test status
4. **Schedule nightly runs** - Catch flaky tests
5. **Parallelize tests** - Faster feedback with `workers`

---

## 📚 Additional Resources

- [Playwright CI Documentation](https://playwright.dev/docs/ci)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Slack API Documentation](https://api.slack.com)

---

**Your E2E testing pipeline is ready to deploy! 🚀**
