import { Page, Locator } from "@playwright/test";

export class HomePage {
  private page: Page;
  private openMenu: Locator;
  private closeMenu: Locator;
  private allItems: Locator;
  private about: Locator;
  private logout: Locator;
  private resetAppState: Locator;
  private shoppingCart: Locator;
  private productName: Locator;
  private inventoryItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.openMenu = this.page.getByRole("button", { name: "Open Menu" });
    this.closeMenu = this.page.getByRole("button", { name: "Close Menu" });
    this.allItems = this.page.getByRole("link", { name: "All items" });
    this.about = this.page.getByRole("link", { name: "About" });
    this.logout = this.page.getByRole("link", { name: "Logout" });
    this.resetAppState = this.page.getByRole("link", {
      name: "Reset App State",
    });
    this.shoppingCart = this.page.getByTestId("shopping-cart-link");
    this.productName = this.page.getByTestId("inventory-item-name");
    this.inventoryItem = this.page.getByTestId("inventory-item");
  }

  async getOptionsMenus(): Promise<(null | string)[]> {
    await this.openMenu.click();
    const allitems = await this.allItems.textContent();
    const about = await this.about.textContent();
    const logout = await this.logout.textContent();
    const resetAppState = await this.resetAppState.textContent();
    await this.closeMenu.click();
    return [allitems, about, logout, resetAppState];
  }

  async getProductPrice(productName: string): Promise<number> {
    const product = this.inventoryItem.filter({ hasText: productName });
    const productPrice = await product
      .getByTestId("inventory-item-price")
      .textContent();
    return productPrice != null ? parseInt(productPrice.replace("$", "")) : 0;
  }

  async addProductToCart(productName: string): Promise<void> {
    const product = this.inventoryItem.filter({ hasText: productName });
    await product.getByRole("button", { name: "Add to cart" }).click();
  }

  async getCartCount(): Promise<number> {
    const cartCount = await this.shoppingCart.textContent();
    return cartCount != null ? parseInt(cartCount) : 0;
  }

  async getAllProducts(): Promise<string[]> {
    let productNames: string[] = [];
    const allProducts = await this.productName.all();
    for (let product of allProducts) {
      let productName: string | null = await product.textContent();
      productName != null
        ? productNames.push(productName)
        : console.warn("product name is missing");
    }
    return productNames;
  }
}
