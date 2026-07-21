import {
  type Action,
  configureStore,
  type ThunkAction,
} from "@reduxjs/toolkit";

import rootReducer from "./rootReducer";
import { ApiMiddleware } from "./middleware";
import { persistStore } from "redux-persist";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(ApiMiddleware.map((api) => api.middleware)),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
