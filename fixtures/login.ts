import { Page, Locator } from "@playwright/test";

export class LoginPage {
  private page: Page;
  private username: Locator;
  private password: Locator;
  private loginBtn: Locator;
  private errorMsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = this.page.getByPlaceholder("Username");
    this.password = this.page.getByPlaceholder("Password");
    this.loginBtn = this.page.getByRole("button", {
      name: "Login",
      exact: true,
    });
    this.errorMsg = this.page.getByTestId("error");
  }

  async goto() {
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
  }

  async login(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginBtn.click();
  }

  async getErrorMessage(): Promise<null | string> {
    return this.errorMsg.textContent();
  }
}
