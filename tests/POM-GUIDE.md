# Page Object Model (POM) Guide for Large Test Suites

## Structure Overview

```
tests/
├── pages/
│   ├── BasePage.ts          # Common methods for all pages
│   ├── LoginPage.ts         # Login page specific methods
│   ├── DashboardPage.ts     # Dashboard page specific methods
│   └── ...                  # Other page objects
├── fixtures/
│   └── auth.fixture.ts      # Reusable test fixtures
├── config/
│   └── test-data.ts         # Test data and configuration
└── specs/
    ├── login.spec.ts        # Login tests
    ├── dashboard.spec.ts    # Dashboard tests
    └── ...                  # Other test files
```

## Usage Patterns

### 1. Basic Page Usage

```typescript
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test("basic login test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("user@example.com", "password");
  await loginPage.expectUrl(/dashboard/);
});
```

### 2. Using Fixtures (Recommended for Large Suites)

```typescript
import { test, expect } from "../fixtures/auth.fixture";

test("login with fixture", async ({ loginPage }) => {
  // loginPage is already initialized and navigated
  await loginPage.login("user@example.com", "password");
  await loginPage.expectUrl(/dashboard/);
});

test("authenticated action", async ({ authenticatedPage }) => {
  // authenticatedPage is already logged in
  await authenticatedPage.expectUrl(/dashboard/);
  // Perform authenticated actions
});
```

### 3. Cross-Page Navigation

```typescript
import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";

test("login and navigate to dashboard", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.goto();
  await loginPage.login("user@example.com", "password");
  
  // Navigate to dashboard page object
  await dashboardPage.expectUrl(/dashboard/);
  await dashboardPage.expectWelcomeMessage();
});
```

### 4. Reusable Test Data

```typescript
import { test } from "../fixtures/auth.fixture";
import { testUsers, pageUrls } from "../config/test-data";

test("login with test data", async ({ loginPage }) => {
  await loginPage.login(testUsers.valid.email, testUsers.valid.password);
  await loginPage.expectUrl(pageUrls.dashboard);
});
```

### 5. Page Object Composition

```typescript
// DashboardPage.ts
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  readonly welcomeMessage: Locator;
  readonly logoutButton: Locator;
  readonly notesSection: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.getByText(/welcome/i);
    this.logoutButton = page.getByRole("button", { name: /logout/i });
    this.notesSection = page.getByTestId("notes-section");
  }

  async logout() {
    await this.logoutButton.click();
    await this.expectUrl(/login/);
  }

  async expectWelcomeMessage() {
    await expect(this.welcomeMessage).toBeVisible();
  }
}
```

## Best Practices for 500+ Pages

### 1. **Organize Pages by Feature**
```
pages/
├── auth/
│   ├── LoginPage.ts
│   ├── SignupPage.ts
│   └── ForgotPasswordPage.ts
├── notes/
│   ├── NotesListPage.ts
│   ├── NoteDetailPage.ts
│   └── CreateNotePage.ts
└── dashboard/
    ├── DashboardPage.ts
    └── SettingsPage.ts
```

### 2. **Use Fixtures for Common Setup**
```typescript
// fixtures/common.fixture.ts
import { test as base } from "@playwright/test";

type CommonFixtures = {
  authenticatedPage: Page;
  testUser: { email: string; password: string };
};

export const test = base.extend<CommonFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Login once for all tests in this suite
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.valid.email, testUsers.valid.password);
    await use(page);
  },
  testUser: async ({}, use) => {
    await use(testUsers.valid);
  },
});
```

### 3. **Create Page Factory for Dynamic Page Creation**
```typescript
// pages/PageFactory.ts
import { Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { DashboardPage } from "./DashboardPage";

export class PageFactory {
  static createLoginPage(page: Page): LoginPage {
    return new LoginPage(page);
  }

  static createDashboardPage(page: Page): DashboardPage {
    return new DashboardPage(page);
  }

  // Or generic factory
  static createPage<T extends BasePage>(
    page: Page,
    PageClass: new (page: Page) => T
  ): T {
    return new PageClass(page);
  }
}
```

### 4. **Use Test Data Files for Environment-Specific Data**
```typescript
// config/environments.ts
export const environments = {
  dev: {
    baseUrl: "http://localhost:5003",
    apiTimeout: 30000,
  },
  staging: {
    baseUrl: "https://staging.studymate.com",
    apiTimeout: 30000,
  },
  production: {
    baseUrl: "https://studymate.com",
    apiTimeout: 30000,
  },
};

export const currentEnv = environments[process.env.ENV || "dev"];
```

### 5. **Create Helper Functions for Common Actions**
```typescript
// helpers/auth-helpers.ts
import { LoginPage } from "../pages/LoginPage";

export async function loginAs(page: Page, userType: "admin" | "user" | "guest") {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  
  const users = {
    admin: { email: "admin@test.com", password: "admin123" },
    user: { email: "user@test.com", password: "user123" },
    guest: { email: "guest@test.com", password: "guest123" },
  };
  
  await loginPage.login(users[userType].email, users[userType].password);
  return loginPage;
}
```

## Example: Multi-Page Test Flow

```typescript
import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { NotesListPage } from "../pages/notes/NotesListPage";
import { NoteDetailPage } from "../pages/notes/NoteDetailPage";

test.describe("Complete User Flow", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let notesListPage: NotesListPage;
  let noteDetailPage: NoteDetailPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    notesListPage = new NotesListPage(page);
    noteDetailPage = new NoteDetailPage(page);
  });

  test("user can login, navigate to notes, and view a note", async ({ page }) => {
    // Step 1: Login
    await loginPage.goto();
    await loginPage.login("user@example.com", "password");
    await dashboardPage.expectUrl(/dashboard/);

    // Step 2: Navigate to notes
    await dashboardPage.navigateToNotes();
    await notesListPage.expectUrl(/notes/);

    // Step 3: Click on first note
    await notesListPage.clickFirstNote();
    await noteDetailPage.expectUrl(/notes\/\d+/);

    // Step 4: Verify note content
    await noteDetailPage.expectTitleVisible();
    await noteDetailPage.expectContentVisible();
  });
});
```

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific suite
npx playwright test login.spec.ts

# Run with specific environment
ENV=staging npx playwright test

# Run in headed mode
npx playwright test --headed

# Run with UI
npx playwright test --ui
```

## Benefits of This Approach

1. **Maintainability**: Changes to UI only require updating page objects
2. **Reusability**: Common actions are centralized in fixtures and helpers
3. **Scalability**: Easy to add new pages following the same pattern
4. **Readability**: Tests read like business requirements
5. **Reliability**: Stable selectors managed in one place
