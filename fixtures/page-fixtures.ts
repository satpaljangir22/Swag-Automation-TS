import { LoginPage } from "./login";
import { HomePage } from "./home";
import { test as base, expect } from "@playwright/test";

type Fixture = {
  loginPage: LoginPage;
  homePage: HomePage;
};

const test = base.extend<Fixture>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
});

export { test, expect };
