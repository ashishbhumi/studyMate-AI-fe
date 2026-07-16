import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "@/store/base-query";
import type { LoginInterface } from "../interfaces/login.interface";
import type { SignupInterface } from "../interfaces/signup.interface";
import type { AuthResponseInterface } from "../interfaces/auth-response.interface";
import type {
  ForgotPasswordInterface,
  ResetPasswordInterface,
} from "../interfaces/forgot-password.interface";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponseInterface, LoginInterface>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    signup: builder.mutation<AuthResponseInterface, SignupInterface>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    forgotPassword: builder.mutation<
      { message: string },
      ForgotPasswordInterface
    >({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      { message: string },
      ResetPasswordInterface
    >({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
