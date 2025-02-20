import { test, expect } from "../fixtures/page-fixtures";
import { users } from "../test-data/users";
import { LoginPage } from "../fixtures/login";

test.describe("Login Scenarios", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("Login with valid user", async ({ page, loginPage }) => {
    await loginPage.login(
      users.standardUser.username,
      users.standardUser.password
    );
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test("Verify Error for locked out user", async ({ loginPage }) => {
    await loginPage.login(users.lockedUser.username, users.lockedUser.password);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Sorry, this user has been locked out");
  });

  test("Verify error for invalid credentials", async ({ loginPage }) => {
    await loginPage.login(users.standardUser.username, "invalidpassword");
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Username and password do not match");
  });

  test("Verify error for empty username", async ({ loginPage }) => {
    await loginPage.login("", "");
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Username is required");
  });

  test("Verify error for empty password", async ({ loginPage }) => {
    await loginPage.login(users.standardUser.username, "");
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Password is required");
  });
});
