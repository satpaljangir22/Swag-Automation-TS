import { Page, Locator } from "@playwright/test";

export class HomePage {
  private openMenu: Locator;
  private closeMenu: Locator;
  private allItems: Locator;
  private about: Locator;
  private logout: Locator;
  private resetAppState: Locator;
  private shoppingCart: Locator;
  private productName: Locator;
  private inventoryItem: Locator;

  constructor(private page: Page) {
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

  async getOptionsMenus(): Promise<string[]> {
    await this.openMenu.click();
    const menuItems = [
      await this.allItems.textContent(),
      await this.about.textContent(),
      await this.logout.textContent(),
      await this.resetAppState.textContent(),
    ];
    await this.closeMenu.click();
    return menuItems.filter((item) => item !== null);
  }

  async getProductPrice(productName: string): Promise<number> {
    const product = this.inventoryItem.filter({ hasText: productName });
    const productPrice = await product
      .getByTestId("inventory-item-price")
      .textContent();
    return productPrice != null ? parseFloat(productPrice.replace("$", "")) : 0;
  }

  async addProductToCart(productName: string): Promise<void> {
    try {
      const product = this.inventoryItem.filter({ hasText: productName });
      await product.getByRole("button", { name: "Add to cart" }).click();
      console.log(`Product added to cart: ${productName}`);
    } catch (error) {
      console.error(`Error adding product to cart: ${productName}`, error);
    }
  }

  async getCartCount(): Promise<number> {
    const cartCount = await this.shoppingCart.textContent();
    return cartCount != null ? parseInt(cartCount) : 0;
  }

  async getAllProducts(): Promise<string[]> {
    const allProducts = await this.productName.all();
    const productNames = await Promise.all(
      allProducts.map(async (product) => {
        const productName = await product.textContent();
        if (!productName) {
          console.warn("Product name is missing.");
          return "";
        }
        return productName;
      })
    );
    return productNames.filter((name) => name !== "");
  }
}
