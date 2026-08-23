import { Page, expect } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async waitForUrl(urlPattern: RegExp | string) {
    await this.page.waitForURL(urlPattern);
  }

  async expectUrl(urlPattern: RegExp) {
    await expect(this.page).toHaveURL(urlPattern);
  }

  async reload() {
    await this.page.reload();
  }

  async waitForSelector(selector: string) {
    await this.page.waitForSelector(selector);
  }

  async waitForTimeout(ms: number) {
    await this.page.waitForTimeout(ms);
  }
}
