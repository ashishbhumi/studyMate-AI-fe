import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "@/store/base-query";
import type {
  TagInterface,
  CreateTagInterface,
  UpdateTagInterface,
} from "../interfaces/tag.interface";
import type { ApiResponse } from "@/feature/auth/interfaces/auth-response.interface";

export const tagsApi = createApi({
  reducerPath: "tagsApi",
  baseQuery,
  tagTypes: ["Tag"],
  endpoints: (builder) => ({
    getTags: builder.query<TagInterface[], void>({
      query: () => ({
        url: "/tags",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<TagInterface[]>) =>
        response.data,
      providesTags: ["Tag"],
    }),

    getTagById: builder.query<TagInterface, number>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<TagInterface>) => response.data,
      providesTags: (_, __, id) => [{ type: "Tag", id }],
    }),

    createTag: builder.mutation<TagInterface, CreateTagInterface>({
      query: (body) => ({
        url: "/tags",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<TagInterface>) => response.data,
      invalidatesTags: ["Tag"],
    }),

    updateTag: builder.mutation<
      TagInterface,
      { id: number; body: UpdateTagInterface }
    >({
      query: ({ id, body }) => ({
        url: `/tags/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponse<TagInterface>) => response.data,
      invalidatesTags: (_, error, { id }) => [{ type: "Tag", id }, "Tag"],
    }),

    deleteTag: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error, id) => [{ type: "Tag", id }, "Tag"],
    }),
  }),
});

export const {
  useGetTagsQuery,
  useGetTagByIdQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = tagsApi;
