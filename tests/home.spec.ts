import { test, expect } from "../fixtures/page-fixtures";
import { users } from "../test-data/users";

test.describe("Home Page Validations", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(
      users.standardUser.username,
      users.standardUser.password
    );
  });

  test("Verify all the Menu Links", async ({ homePage }) => {
    const menuItems = await homePage.getOptionsMenus();
    expect(menuItems).toEqual(
      expect.arrayContaining([
        "All Items",
        "About",
        "Logout",
        "Reset App State",
      ])
    );
  });

  test("Verify all the products", async ({ homePage }) => {
    const products = await homePage.getAllProducts();
    expect(products).toHaveLength(6);
    for (let product of products) {
      let price = await homePage.getProductPrice(product);
      expect(price).toBeGreaterThan(0);
    }
  });

  test("Add most expensive product to cart", async ({ homePage }) => {
    const products = await homePage.getAllProducts();
    let maxPrice = 0;
    let maxProduct!: string;
    for (let product of products) {
      let price = await homePage.getProductPrice(product);
      if (price > maxPrice) {
        maxPrice = price;
        maxProduct = product;
      }
    }
    await homePage.addProductToCart(maxProduct);
    expect(await homePage.getCartCount()).toBe(1);
  });

  test("Add Item to the Cart", async ({ homePage }) => {
    const products = await homePage.getAllProducts();
    await homePage.addProductToCart(products[0]);
    const cartCount = await homePage.getCartCount();
    expect(cartCount).toBe(1);
  });
});
