import { combineReducers } from "@reduxjs/toolkit/react";
import authReducer from "../feature/auth/slices/auth-slice";
import { authApi } from "../feature/auth/apis/auth-api";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  auth: authReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
