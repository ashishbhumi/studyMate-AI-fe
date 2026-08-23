export const StorageKeysEnum = {
  TOKEN: "auth_token",
  AUTHENTICATION: "is_authenticated",
  USER_ID: "user_id",
  USER_NAME: "user_name",
  USER_EMAIL: "user_email",
} as const;

export type StorageKeysEnum = typeof StorageKeysEnum;
