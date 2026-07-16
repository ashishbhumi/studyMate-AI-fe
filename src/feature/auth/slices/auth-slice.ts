import { CreateAppSlice } from "@/store/create-app-slice";
import { StorageKeysEnum } from "../enums/storage-keys.enum";

export interface AuthStateInterface {
  isAuthenticated: boolean;
  token: string | null;
}

const getInitialState = (): AuthStateInterface => {
  try {
    const storedToken =
      localStorage.getItem(StorageKeysEnum.TOKEN) ||
      sessionStorage.getItem(StorageKeysEnum.TOKEN);
    return {
      isAuthenticated: !!storedToken,
      token: storedToken,
    };
  } catch {
    return { isAuthenticated: false, token: null };
  }
};

const initialState: AuthStateInterface = getInitialState();

const authSlice = CreateAppSlice({
  name: "auth",
  initialState,
  reducers: (create) => ({
    LOGIN: create.reducer(
      (
        state,
        action: { payload: { accessToken: string; rememberMe?: boolean } },
      ) => {
        const { accessToken, rememberMe } = action.payload;

        state.isAuthenticated = true;
        state.token = accessToken;

        try {
          if (rememberMe) {
            localStorage.setItem(StorageKeysEnum.TOKEN, accessToken);
          } else {
            sessionStorage.setItem(StorageKeysEnum.TOKEN, accessToken);
          }
        } catch (error) {
          console.error("Error setting token storage:", error);
        }
      },
    ),

    LOGOUT: create.reducer((state) => {
      state.isAuthenticated = false;
      state.token = null;
      try {
        localStorage.removeItem(StorageKeysEnum.AUTHENTICATION);
        localStorage.removeItem(StorageKeysEnum.TOKEN);
        sessionStorage.removeItem(StorageKeysEnum.TOKEN);
      } catch (error) {
        console.error("Error removing storage:", error);
      }
    }),
  }),

  selectors: {
    selectIsAuthenticated: (auth) => auth.isAuthenticated,
    selectToken: (auth) => auth.token,
  },
});

export const { LOGIN, LOGOUT } = authSlice.actions;
export const { selectIsAuthenticated, selectToken } = authSlice.selectors;

export default authSlice.reducer;
