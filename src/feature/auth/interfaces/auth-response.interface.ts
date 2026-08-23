export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface AuthDataInterface {
  accessToken: string;
  refreshToken: string;
  userId: number;
  name: string;
  email: string;
}

export type AuthResponseInterface = ApiResponse<AuthDataInterface>;
