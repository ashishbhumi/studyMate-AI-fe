/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

type AuthFixtures = {
  loginPage: LoginPage;
  authenticatedPage: LoginPage;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("ashish10052002@gmail.com", "password");
    await loginPage.expectUrl(/dashboard/);
    await use(loginPage);
  },
});

export { expect } from "@playwright/test";
