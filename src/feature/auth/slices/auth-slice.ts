import { CreateAppSlice } from "@/store/create-app-slice";
import { StorageKeysEnum } from "../enums/storage-keys.enum";

export interface AuthStateInterface {
  isAuthenticated: boolean;
  token: string | null;
  userId: number | null;
  name: string | null;
  email: string | null;
}

const getInitialState = (): AuthStateInterface => {
  try {
    const storedToken =
      localStorage.getItem(StorageKeysEnum.TOKEN) ||
      sessionStorage.getItem(StorageKeysEnum.TOKEN);
    const storedUserId =
      localStorage.getItem(StorageKeysEnum.USER_ID) ||
      sessionStorage.getItem(StorageKeysEnum.USER_ID);
    const parsedUserId = storedUserId ? parseInt(storedUserId) : null;
    const storedName =
      localStorage.getItem(StorageKeysEnum.USER_NAME) ||
      sessionStorage.getItem(StorageKeysEnum.USER_NAME);
    const storedEmail =
      localStorage.getItem(StorageKeysEnum.USER_EMAIL) ||
      sessionStorage.getItem(StorageKeysEnum.USER_EMAIL);
    return {
      isAuthenticated: !!storedToken,
      token: storedToken,
      userId: parsedUserId,
      name: storedName,
      email: storedEmail,
    };
  } catch {
    return {
      isAuthenticated: false,
      token: null,
      userId: null,
      name: null,
      email: null,
    };
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
        action: {
          payload: {
            accessToken: string;
            userId: number;
            name: string;
            email: string;
            rememberMe?: boolean;
          };
        },
      ) => {
        const { accessToken, userId, name, email, rememberMe } = action.payload;

        state.isAuthenticated = true;
        state.token = accessToken;
        state.userId = userId;
        state.name = name;
        state.email = email;

        try {
          if (rememberMe) {
            localStorage.setItem(StorageKeysEnum.TOKEN, accessToken);
            localStorage.setItem(StorageKeysEnum.USER_ID, userId.toString());
            localStorage.setItem(StorageKeysEnum.USER_NAME, name);
            localStorage.setItem(StorageKeysEnum.USER_EMAIL, email);
          } else {
            sessionStorage.setItem(StorageKeysEnum.TOKEN, accessToken);
            sessionStorage.setItem(StorageKeysEnum.USER_ID, userId.toString());
            sessionStorage.setItem(StorageKeysEnum.USER_NAME, name);
            sessionStorage.setItem(StorageKeysEnum.USER_EMAIL, email);
          }
        } catch (error) {
          console.error("Error setting token storage:", error);
        }
      },
    ),

    LOGOUT: create.reducer((state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userId = null;
      state.name = null;
      state.email = null;
      try {
        localStorage.removeItem(StorageKeysEnum.AUTHENTICATION);
        localStorage.removeItem(StorageKeysEnum.TOKEN);
        localStorage.removeItem(StorageKeysEnum.USER_ID);
        localStorage.removeItem(StorageKeysEnum.USER_NAME);
        localStorage.removeItem(StorageKeysEnum.USER_EMAIL);
        sessionStorage.removeItem(StorageKeysEnum.TOKEN);
        sessionStorage.removeItem(StorageKeysEnum.USER_ID);
        sessionStorage.removeItem(StorageKeysEnum.USER_NAME);
        sessionStorage.removeItem(StorageKeysEnum.USER_EMAIL);
      } catch (error) {
        console.error("Error removing storage:", error);
      }
    }),
  }),

  selectors: {
    selectIsAuthenticated: (auth) => auth.isAuthenticated,
    selectToken: (auth) => auth.token,
    selectUserId: (auth) => auth.userId,
    selectName: (auth) => auth.name,
    selectEmail: (auth) => auth.email,
  },
});

export const { LOGIN, LOGOUT } = authSlice.actions;
export const {
  selectIsAuthenticated,
  selectToken,
  selectUserId,
  selectName,
  selectEmail,
} = authSlice.selectors;

export default authSlice.reducer;
