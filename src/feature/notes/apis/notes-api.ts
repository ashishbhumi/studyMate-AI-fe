import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "@/store/base-query";
import type {
  NoteInterface,
  CreateNoteInterface,
  UpdateNoteInterface,
  AttachTagsInterface,
  NotesQueryInterface,
} from "../interfaces/note.interface";
import type { ApiResponse } from "@/feature/auth/interfaces/auth-response.interface";

export const notesApi = createApi({
  reducerPath: "notesApi",
  baseQuery,
  tagTypes: ["Note"],
  endpoints: (builder) => ({
    getNotes: builder.query<
      { data: NoteInterface[]; total: number },
      NotesQueryInterface
    >({
      query: (params) => ({
        url: "/notes",
        method: "GET",
        params,
      }),
      transformResponse: (
        response: ApiResponse<{ data: NoteInterface[]; total: number }>,
      ) => response.data,
      providesTags: ["Note"],
    }),

    getNoteById: builder.query<NoteInterface, number>({
      query: (id) => ({
        url: `/notes/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<NoteInterface>) =>
        response.data,
      providesTags: (_, __, id) => [{ type: "Note", id }],
    }),

    createNote: builder.mutation<NoteInterface, CreateNoteInterface>({
      query: (body) => ({
        url: "/notes",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<NoteInterface>) =>
        response.data,
      invalidatesTags: ["Note"],
    }),

    updateNote: builder.mutation<
      NoteInterface,
      { id: number; body: UpdateNoteInterface }
    >({
      query: ({ id, body }) => ({
        url: `/notes/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponse<NoteInterface>) =>
        response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Note", id },
        "Note",
      ],
    }),

    deleteNote: builder.mutation<void, number>({
      query: (id) => ({
        url: `/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Note", id }, "Note"],
    }),

    pinNote: builder.mutation<NoteInterface, number>({
      query: (id) => ({
        url: `/notes/${id}/pin`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<NoteInterface>) =>
        response.data,
      invalidatesTags: (result, error, id) => [{ type: "Note", id }],
    }),

    unpinNote: builder.mutation<NoteInterface, number>({
      query: (id) => ({
        url: `/notes/${id}/unpin`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<NoteInterface>) =>
        response.data,
      invalidatesTags: (result, error, id) => [{ type: "Note", id }],
    }),

    archiveNote: builder.mutation<NoteInterface, number>({
      query: (id) => ({
        url: `/notes/${id}/archive`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<NoteInterface>) =>
        response.data,
      invalidatesTags: (result, error, id) => [{ type: "Note", id }],
    }),

    unarchiveNote: builder.mutation<NoteInterface, number>({
      query: (id) => ({
        url: `/notes/${id}/unarchive`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<NoteInterface>) =>
        response.data,
      invalidatesTags: (result, error, id) => [{ type: "Note", id }],
    }),

    attachTags: builder.mutation<
      NoteInterface,
      { id: number; body: AttachTagsInterface }
    >({
      query: ({ id, body }) => ({
        url: `/notes/${id}/tags`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<NoteInterface>) =>
        response.data,
      invalidatesTags: (result, error, { id }) => [{ type: "Note", id }],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetNoteByIdQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  usePinNoteMutation,
  useUnpinNoteMutation,
  useArchiveNoteMutation,
  useUnarchiveNoteMutation,
  useAttachTagsMutation,
} = notesApi;
