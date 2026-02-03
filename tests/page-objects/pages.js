/**
 * Page Object Model Base Class
 * Use this as a template for creating page objects for your application
 */
export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(path) {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }
}

/**
 * Example: Home Page Object
 */
export class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.heroSection = page.locator('.hero');
    this.navigationMenu = page.locator('nav');
    this.searchInput = page.locator('input[type="search"]');
    this.searchButton = page.locator('button.search');
  }

  async navigate() {
    await super.navigate('/');
  }

  async search(query) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  async clickNavItem(itemName) {
    await this.navigationMenu.locator(`text=${itemName}`).click();
  }
}

/**
 * Example: Product Page Object
 */
export class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.productTitle = page.locator('h1.product-title');
    this.productPrice = page.locator('.product-price');
    this.addToCartButton = page.locator('button.add-to-cart');
    this.quantityInput = page.locator('input.quantity');
  }

  async navigate(productId) {
    await super.navigate(`/product/${productId}`);
  }

  async addToCart(quantity = 1) {
    await this.quantityInput.fill(quantity.toString());
    await this.addToCartButton.click();
  }

  async getProductTitle() {
    return await this.productTitle.textContent();
  }

  async getProductPrice() {
    return await this.productPrice.textContent();
  }
}

/**
 * Example: Cart Page Object
 */
export class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartItems = page.locator('.cart-item');
    this.totalPrice = page.locator('.total-price');
    this.checkoutButton = page.locator('button.checkout');
    this.emptyCartMessage = page.locator('.empty-cart');
  }

  async navigate() {
    await super.navigate('/cart');
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async removeItem(index) {
    await this.cartItems.nth(index).locator('.remove-button').click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async getTotalPrice() {
    return await this.totalPrice.textContent();
  }
}
