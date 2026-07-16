export const StorageKeysEnum = {
  TOKEN: "auth_token",
  AUTHENTICATION: "is_authenticated",
} as const;

export type StorageKeysEnum = typeof StorageKeysEnum;
