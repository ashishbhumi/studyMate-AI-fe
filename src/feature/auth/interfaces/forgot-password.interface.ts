export interface ForgotPasswordInterface {
  email: string;
}

export interface ResetPasswordInterface {
  email: string;
  otp: string;
  newPassword: string;
}
