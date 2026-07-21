export const testConfig = {
  baseUrl: "http://localhost:5003",
  apiTimeout: 30000,
  defaultTimeout: 5000,
};

export const testUsers = {
  valid: {
    email: "ashish10052002@gmail.com",
    password: "password",
  },
  invalid: {
    email: "wrong@email.com",
    password: "wrongpassword",
  },
  shortPassword: {
    email: "test@test.com",
    password: "123",
  },
  invalidEmail: {
    email: "invalid-email",
    password: "123456",
  },
};

export const pageUrls = {
  login: "/login",
  dashboard: "/dashboard",
  signup: "/signup",
  forgotPassword: "/forgot-password",
};
