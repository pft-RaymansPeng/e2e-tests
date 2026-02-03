/**
 * Slack Webhook Server for Triggering GitHub Actions
 * 
 * This server receives Slack slash commands and triggers GitHub Actions
 * via the repository_dispatch API.
 * 
 * Deploy this to: Vercel, Netlify Functions, AWS Lambda, or your own server
 */

const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const app = express();

// Middleware to capture raw body for signature verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(express.urlencoded({ extended: true }));

// Environment variables (set these in your deployment)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER; // e.g., 'your-username'
const GITHUB_REPO = process.env.GITHUB_REPO;   // e.g., 'e2e-tests'
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;

/**
 * Verify that the request came from Slack
 */
function verifySlackSignature(req) {
  const signature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];
  const body = req.rawBody;

  // Prevent replay attacks (request must be within 5 minutes)
  const time = Math.floor(new Date().getTime() / 1000);
  if (Math.abs(time - timestamp) > 300) {
    console.error('Request timestamp too old');
    return false;
  }

  // Verify signature
  const sigBasestring = `v0:${timestamp}:${body}`;
  const mySignature = 'v0=' + crypto
    .createHmac('sha256', SLACK_SIGNING_SECRET)
    .update(sigBasestring)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(mySignature),
      Buffer.from(signature)
    );
  } catch (err) {
    console.error('Signature verification failed:', err);
    return false;
  }
}

/**
 * Parse Slack command arguments
 * Example: "/run-e2e --browser=firefox --test=contact-sales.spec.js"
 */
function parseSlackCommand(text) {
  const args = text.trim().split(/\s+/);
  
  let browser = 'chromium'; // default
  let testFile = '';
  
  args.forEach(arg => {
    if (arg.startsWith('--browser=')) {
      browser = arg.split('=')[1];
    } else if (arg.startsWith('--test=')) {
      testFile = arg.split('=')[1];
    }
  });
  
  return { browser, testFile };
}

/**
 * Trigger GitHub Actions via repository_dispatch
 */
async function triggerGitHubAction(payload) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`;
  
  try {
    await axios.post(url, {
      event_type: 'run-e2e-tests',
      client_payload: payload
    }, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    });
    
    return true;
  } catch (error) {
    console.error('Failed to trigger GitHub Action:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Slack slash command endpoint: /run-e2e
 */
app.post('/slack/run-e2e', async (req, res) => {
  // Verify request is from Slack
  if (!verifySlackSignature(req)) {
    console.error('Invalid Slack signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { text, user_name, user_id, channel_name } = req.body;
  
  // Parse command arguments
  const { browser, testFile } = parseSlackCommand(text || '');

  console.log(`Slack command received from ${user_name}: browser=${browser}, test=${testFile}`);

  // Respond immediately to Slack (within 3 seconds)
  res.json({
    response_type: 'in_channel',
    text: `🚀 Starting E2E tests...`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*🚀 Starting E2E Tests*\n*Triggered by:* ${user_name}\n*Browser:* ${browser}\n*Test:* ${testFile || 'All tests'}`
        }
      }
    ]
  });

  // Trigger GitHub Actions asynchronously
  const success = await triggerGitHubAction({
    browser,
    test_file: testFile,
    user: user_name,
    slack_user_id: user_id,
    slack_channel: channel_name
  });

  if (!success) {
    // If triggering failed, you could send a follow-up message to Slack
    console.error('Failed to trigger GitHub Action');
  }
});

/**
 * Start server
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Slack webhook server running on port ${PORT}`);
  console.log(`📝 Environment check:`);
  console.log(`   - GITHUB_TOKEN: ${GITHUB_TOKEN ? '✓ Set' : '✗ Missing'}`);
  console.log(`   - GITHUB_OWNER: ${GITHUB_OWNER || '✗ Missing'}`);
  console.log(`   - GITHUB_REPO: ${GITHUB_REPO || '✗ Missing'}`);
  console.log(`   - SLACK_SIGNING_SECRET: ${SLACK_SIGNING_SECRET ? '✓ Set' : '✗ Missing'}`);
});

module.exports = app; // For serverless deployment
