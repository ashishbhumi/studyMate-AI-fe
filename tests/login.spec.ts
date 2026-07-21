import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

test.describe("Authentication", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("should display login page correctly", async () => {
    await loginPage.expectPageTitle(/Study Mate AI/);
    await loginPage.expectBrandNameVisible();
    await loginPage.expectLoginHeadingVisible();
  });

  test("should show email and password input fields", async () => {
    await loginPage.expectEmailInputVisible();
    await loginPage.expectPasswordInputVisible();
  });

  test("should show password visibility toggle", async () => {
    await loginPage.expectPasswordToggleVisible();
    await loginPage.expectPasswordType("password");

    await loginPage.togglePasswordVisibility();
    await loginPage.expectPasswordType("text");

    await loginPage.togglePasswordVisibility();
    await loginPage.expectPasswordType("password");
  });

  test("should show remember me checkbox", async () => {
    await loginPage.expectRememberMeVisible();
    await expect(loginPage.rememberMeCheckbox).not.toBeChecked();

    await loginPage.setRememberMe(true);
    await expect(loginPage.rememberMeCheckbox).toBeChecked();
  });

  test("should show forgot password link", async () => {
    await loginPage.expectForgotPasswordLinkVisible();
    await loginPage.resetPassword();
  });

  test("should navigate to signup page", async () => {
    await loginPage.expectSignupButtonVisible();
    await loginPage.navigateToSignup();
  });

  test("should show validation error for invalid email", async () => {
    await loginPage.emailInput.fill("invalid-email");
    await loginPage.passwordInput.fill("123456");
    await loginPage.loginButton.click();

    await loginPage.expectValidationError();
  });

  test("should show validation error for short password", async () => {
    await loginPage.emailInput.fill("test@test.com");
    await loginPage.passwordInput.fill("123");
    await loginPage.loginButton.click();

    await loginPage.expectValidationError();
  });

  test("should show validation error for empty fields", async () => {
    await loginPage.loginButton.click();

    await loginPage.expectValidationError();
  });

  test("should successfully login with valid credentials", async () => {
    await loginPage.login("ashish10052002@gmail.com", "password");
    await loginPage.expectUrl(/dashboard/);
  });

  test("should show error message for invalid credentials", async () => {
    await loginPage.login("wrong@email.com", "wrongpassword");
    await loginPage.expectLoginError();
  });

  test("should clear error message when user starts typing", async () => {
    await loginPage.login("wrong@email.com", "wrongpassword");
    await loginPage.expectLoginError();

    // Start typing in email field
    await loginPage.emailInput.fill("correct@email.com");

    // Error should be cleared
    await expect(
      loginPage.page.getByText(/Login failed. Please check your credentials/i),
    ).not.toBeVisible();
  });

  test("should retain form values after failed login", async () => {
    const testEmail = "wrong@email.com";
    const testPassword = "wrongpassword";

    await loginPage.login(testEmail, testPassword);
    await loginPage.expectLoginError();

    // Check if values are retained
    const emailValue = await loginPage.getEmailValue();
    const passwordValue = await loginPage.getPasswordValue();

    expect(emailValue).toBe(testEmail);
    expect(passwordValue).toBe(testPassword);
  });

  test("should disable login button during loading", async ({ page }) => {
    await page.route("**/login", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            accessToken: "token",
            userId: "1",
            name: "Test User",
            email: "test@example.com",
          },
        }),
      });
    });

    await loginPage.login("ashishkumar@gmail.com", "123456");

    // While request is pending
    await loginPage.expectButtonDisabled();

    // After request finishes
    await loginPage.expectUrl(/dashboard/);
  });

  test("should show brand panel on large screens", async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.reload();

    await loginPage.expectBrandPanelVisible();
  });

  test("should hide brand panel on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    await loginPage.expectBrandPanelHidden();
  });
});
