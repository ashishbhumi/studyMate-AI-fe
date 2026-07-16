import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "@/store/base-query";
import type {
  FolderInterface,
  CreateFolderInterface,
  UpdateFolderInterface,
} from "../interfaces/folder.interface";
import type { ApiResponse } from "@/feature/auth/interfaces/auth-response.interface";

export const foldersApi = createApi({
  reducerPath: "foldersApi",
  baseQuery,
  tagTypes: ["Folder"],
  endpoints: (builder) => ({
    getFolders: builder.query<FolderInterface[], void>({
      query: () => ({
        url: "/folders",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<FolderInterface[]>) =>
        response.data,
      providesTags: ["Folder"],
    }),

    getFolderById: builder.query<FolderInterface, number>({
      query: (id) => ({
        url: `/folders/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<FolderInterface>) =>
        response.data,
      providesTags: (_, __, id) => [{ type: "Folder", id }],
    }),

    createFolder: builder.mutation<FolderInterface, CreateFolderInterface>({
      query: (body) => ({
        url: "/folders",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<FolderInterface>) =>
        response.data,
      invalidatesTags: ["Folder"],
    }),

    updateFolder: builder.mutation<
      FolderInterface,
      { id: number; body: UpdateFolderInterface }
    >({
      query: ({ id, body }) => ({
        url: `/folders/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponse<FolderInterface>) =>
        response.data,
      invalidatesTags: (_, __, { id }) => [{ type: "Folder", id }, "Folder"],
    }),

    deleteFolder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/folders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Folder", id }, "Folder"],
    }),
  }),
});

export const {
  useGetFoldersQuery,
  useGetFolderByIdQuery,
  useCreateFolderMutation,
  useUpdateFolderMutation,
  useDeleteFolderMutation,
} = foldersApi;
