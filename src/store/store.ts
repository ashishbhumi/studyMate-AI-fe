import {
  type Action,
  configureStore,
  type ThunkAction,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";
import { ApiMiddleware } from "./middleware";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "outlet",
    "client",
    "role",
    "whitelabel",
    "auth",
    "client",
    "outlet",
    "outletDropdown",
    "sidebar",
    "permissions",
    "settings",
    "qrCodeData",
    "createOrder",
    "draftOrder",
    "deliveryBroadcast",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
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
