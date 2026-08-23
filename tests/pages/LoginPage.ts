import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordToggle: Locator;
  readonly loginButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signupButton: Locator;
  readonly brandName: Locator;
  readonly loginHeading: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel(/email address/i);
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.passwordToggle = page.getByTestId("password-toggle");
    this.loginButton = page.getByRole("button", { name: /log in/i });
    this.rememberMeCheckbox = page.getByLabel(/remember me/i);
    this.forgotPasswordLink = page.getByText(/forgot password/i);
    this.signupButton = page.getByRole("button", {
      name: /create an account/i,
    });
    this.brandName = page.getByTestId("brand-name");
    this.loginHeading = page.getByTestId("login-heading");
    this.errorMessage = page.getByText(
      /Enter a valid email and password to continue/i,
    );
  }

  async goto() {
    await this.page.goto("http://localhost:5003");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await this.page.getByRole("button", { name: /logout/i }).click();
  }

  async resetPassword() {
    await this.forgotPasswordLink.click();
    await expect(this.page).toHaveURL(/forgot-password/);
  }

  async navigateToSignup() {
    await this.signupButton.click();
    await expect(this.page).toHaveURL(/signup/);
  }

  async togglePasswordVisibility() {
    await this.passwordToggle.click();
  }

  async setRememberMe(checked: boolean) {
    if (checked) {
      await this.rememberMeCheckbox.check();
    } else {
      await this.rememberMeCheckbox.uncheck();
    }
  }

  async expectPageTitle(title: RegExp) {
    await expect(this.page).toHaveTitle(title);
  }

  async expectBrandNameVisible() {
    await expect(this.brandName).toBeVisible();
  }

  async expectLoginHeadingVisible() {
    await expect(this.loginHeading).toBeVisible();
  }

  async expectEmailInputVisible() {
    await expect(this.emailInput).toBeVisible();
  }

  async expectPasswordInputVisible() {
    await expect(this.passwordInput).toBeVisible();
  }

  async expectPasswordToggleVisible() {
    await expect(this.passwordToggle).toBeVisible();
  }

  async expectPasswordType(type: string) {
    await expect(this.passwordInput).toHaveAttribute("type", type);
  }

  async expectRememberMeVisible() {
    await expect(this.rememberMeCheckbox).toBeVisible();
  }

  async expectForgotPasswordLinkVisible() {
    await expect(this.forgotPasswordLink).toBeVisible();
  }

  async expectSignupButtonVisible() {
    await expect(this.signupButton).toBeVisible();
  }

  async expectValidationError() {
    await expect(this.errorMessage).toBeVisible();
  }

  async expectLoginError() {
    await expect(
      this.page.getByText(/Login failed. Please check your credentials/i),
    ).toBeVisible();
  }

  async expectUrl(urlPattern: RegExp) {
    await expect(this.page).toHaveURL(urlPattern);
  }

  async expectButtonDisabled() {
    await expect(this.loginButton).toBeDisabled();
  }

  async expectButtonEnabled() {
    await expect(this.loginButton).toBeEnabled();
  }

  async clearEmail() {
    await this.emailInput.fill("");
  }

  async clearPassword() {
    await this.passwordInput.fill("");
  }

  async getEmailValue(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  async expectBrandPanelVisible() {
    await expect(this.page.getByText(/Every note, sorted/i)).toBeVisible();
    await expect(
      this.page.getByText(/Every chapter, summarized/i),
    ).toBeVisible();
  }

  async expectBrandPanelHidden() {
    await expect(this.page.getByText(/Every note, sorted/i)).not.toBeVisible();
  }
}
