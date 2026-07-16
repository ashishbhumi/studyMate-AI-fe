/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  prepareHeaders: (headers: Headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.token;
    const userId = state.auth?.userId;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (userId) {
      headers.set("user-id", userId.toString());
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Handle logout logic here
    console.log("Unauthorized, logging out...");
  }
  return result;
};

export default baseQueryWithReauth;
