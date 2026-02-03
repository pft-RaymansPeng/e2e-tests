/**
 * Test Data Helpers
 * Centralized location for test data management
 */

// User credentials for testing
export const testUsers = {
  validUser: {
    email: 'test.user@example.com',
    password: 'TestPassword123!',
    username: 'testuser'
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'AdminPass456!',
    username: 'admin'
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'WrongPassword'
  }
};

// Generate random email with timestamp format: raymans_peng-26XXX@perfectcorp.com
// XXX is a timestamp in format MMDDHHMMSS (month, day, hour, minute, second)
export function generateRandomEmail() {
  const now = new Date();
  
  // Format: 26 + MMDDHHMMSS (e.g., 260203112530 for Feb 3, 11:25:30)
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  
  const timestamp = `${month}${day}${hour}${minute}${second}`;
  
  return `raymans_peng-26${timestamp}@perfectcorp.com`;
}

// Generate random user data
export function generateRandomUser() {
  return {
    email: generateRandomEmail(),
    password: 'TestPassword123!',
    username: `user_${Date.now()}`,
    firstName: 'Test',
    lastName: 'User'
  };
}

// Test product data
export const testProducts = {
  product1: {
    id: 'prod-001',
    name: 'Test Product 1',
    price: 29.99,
    quantity: 1
  },
  product2: {
    id: 'prod-002',
    name: 'Test Product 2',
    price: 49.99,
    quantity: 2
  }
};

// API endpoints (customize based on your application)
export const apiEndpoints = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  products: '/api/products',
  cart: '/api/cart',
  checkout: '/api/checkout'
};

// Common test selectors
export const selectors = {
  buttons: {
    submit: 'button[type="submit"]',
    cancel: 'button[type="button"]:has-text("Cancel")',
    close: 'button.close, button[aria-label="Close"]'
  },
  forms: {
    email: 'input[type="email"], input[name="email"]',
    password: 'input[type="password"], input[name="password"]',
    username: 'input[name="username"]'
  },
  messages: {
    error: '.error-message, .alert-error, [role="alert"]',
    success: '.success-message, .alert-success',
    warning: '.warning-message, .alert-warning'
  }
};
