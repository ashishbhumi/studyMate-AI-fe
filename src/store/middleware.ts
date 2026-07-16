import { authApi } from "../feature/auth/apis/auth-api";
import { foldersApi } from "../feature/folders/apis/folders-api";
import { notesApi } from "../feature/notes/apis/notes-api";
import { tagsApi } from "../feature/tags/apis/tags-api";

export const ApiMiddleware = [authApi, foldersApi, notesApi, tagsApi];
