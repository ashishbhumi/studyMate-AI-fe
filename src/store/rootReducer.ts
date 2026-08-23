import { combineReducers } from "@reduxjs/toolkit/react";
import authReducer from "../feature/auth/slices/auth-slice";
import { authApi } from "../feature/auth/apis/auth-api";
import foldersReducer from "../feature/folders/slices/folders-slice";
import { foldersApi } from "../feature/folders/apis/folders-api";
import notesReducer from "../feature/notes/slices/notes-slice";
import { notesApi } from "../feature/notes/apis/notes-api";
import tagsReducer from "../feature/tags/slices/tags-slice";
import { tagsApi } from "../feature/tags/apis/tags-api";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [foldersApi.reducerPath]: foldersApi.reducer,
  [notesApi.reducerPath]: notesApi.reducer,
  [tagsApi.reducerPath]: tagsApi.reducer,
  auth: authReducer,
  folders: foldersReducer,
  notes: notesReducer,
  tags: tagsReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
