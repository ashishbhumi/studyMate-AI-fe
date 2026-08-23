import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "@/store/base-query";
import type {
  NoteInterface,
  CreateNoteInterface,
  UpdateNoteInterface,
  AttachTagsInterface,
  NotesQueryInterface,
} from "../interfaces/note.interface";
import type {
  FlashcardsResponse,
  GenerateFlashcardsRequest,
} from "../interfaces/flashcard.interface";
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
      invalidatesTags: (_, __, { id }) => [{ type: "Note", id }, "Note"],
    }),

    deleteNote: builder.mutation<void, number>({
      query: (id) => ({
        url: `/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Note", id }, "Note"],
    }),

    pinNote: builder.mutation<NoteInterface, number>({
      query: (id) => ({
        url: `/notes/${id}/pin`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<NoteInterface>) =>
        response.data,
      invalidatesTags: (_, __, id) => [{ type: "Note", id }],
    }),

    unpinNote: builder.mutation<NoteInterface, number>({
      query: (id) => ({
        url: `/notes/${id}/unpin`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<NoteInterface>) =>
        response.data,
      invalidatesTags: (_, __, id) => [{ type: "Note", id }],
    }),

    archiveNote: builder.mutation<NoteInterface, number>({
      query: (id) => ({
        url: `/notes/${id}/archive`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<NoteInterface>) =>
        response.data,
      invalidatesTags: (_, __, id) => [{ type: "Note", id }],
    }),

    unarchiveNote: builder.mutation<NoteInterface, number>({
      query: (id) => ({
        url: `/notes/${id}/unarchive`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<NoteInterface>) =>
        response.data,
      invalidatesTags: (_, __, id) => [{ type: "Note", id }],
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
      invalidatesTags: (_, __, { id }) => [{ type: "Note", id }],
    }),

    summarizeNote: builder.mutation<{ summary: string }, number>({
      query: (noteId) => ({
        url: "/ai/summarize",
        method: "POST",
        body: { noteId },
      }),
      transformResponse: (response: ApiResponse<{ summary: string }>) =>
        response.data,
      invalidatesTags: (_, __, noteId) => [{ type: "Note", noteId }],
    }),

    generateFlashcards: builder.mutation<
      FlashcardsResponse,
      GenerateFlashcardsRequest
    >({
      query: ({ noteId, count = 10, difficulty = "MEDIUM" }) => ({
        url: "/flashcards/generate",
        method: "POST",
        body: { noteId, count, difficulty },
      }),
      transformResponse: (response: ApiResponse<FlashcardsResponse>) =>
        response.data,
      invalidatesTags: (_, __, { noteId }) => [{ type: "Note", noteId }],
    }),

    getFlashcardsByNote: builder.query<FlashcardsResponse, number>({
      query: (noteId) => ({
        url: `/flashcards/note/${noteId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<FlashcardsResponse>) =>
        response.data,
      providesTags: (_, __, noteId) => [
        { type: "Note", id: noteId },
        { type: "Note", id: "FLASHCARD" },
      ],
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
  useSummarizeNoteMutation,
  useGenerateFlashcardsMutation,
  useGetFlashcardsByNoteQuery,
} = notesApi;
