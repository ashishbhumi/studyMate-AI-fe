import { CreateAppSlice } from "@/store/create-app-slice";
import type { NotesQueryInterface } from "../interfaces/note.interface";

export interface NotesStateInterface {
  selectedNoteId: number | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  editingNoteId: number | null;
  filters: NotesQueryInterface;
  searchQuery: string;
}

const initialState: NotesStateInterface = {
  selectedNoteId: null,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  editingNoteId: null,
  filters: {
    page: 1,
    limit: 10,
    sort: "createdAt",
    order: "DESC",
  },
  searchQuery: "",
};

const notesSlice = CreateAppSlice({
  name: "notes",
  initialState,
  reducers: (create) => ({
    setSelectedNoteId: create.reducer<number | null>((state, action) => {
      state.selectedNoteId = action.payload;
    }),

    openCreateModal: create.reducer((state) => {
      state.isCreateModalOpen = true;
    }),

    closeCreateModal: create.reducer((state) => {
      state.isCreateModalOpen = false;
    }),

    openEditModal: create.reducer<number>((state, action) => {
      state.isEditModalOpen = true;
      state.editingNoteId = action.payload;
    }),

    closeEditModal: create.reducer((state) => {
      state.isEditModalOpen = false;
      state.editingNoteId = null;
    }),

    setFilters: create.reducer<Partial<NotesQueryInterface>>(
      (state, action) => {
        state.filters = { ...state.filters, ...action.payload };
      },
    ),

    setSearchQuery: create.reducer<string>((state, action) => {
      state.searchQuery = action.payload;
    }),

    resetFilters: create.reducer((state) => {
      state.filters = {
        page: 1,
        limit: 10,
        sort: "createdAt",
        order: "DESC",
      };
      state.searchQuery = "";
    }),
  }),

  selectors: {
    selectSelectedNoteId: (notes) => notes.selectedNoteId,
    selectIsCreateModalOpen: (notes) => notes.isCreateModalOpen,
    selectIsEditModalOpen: (notes) => notes.isEditModalOpen,
    selectEditingNoteId: (notes) => notes.editingNoteId,
    selectFilters: (notes) => notes.filters,
    selectSearchQuery: (notes) => notes.searchQuery,
  },
});

export const {
  setSelectedNoteId,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  setFilters,
  setSearchQuery,
  resetFilters,
} = notesSlice.actions;

export const {
  selectSelectedNoteId,
  selectIsCreateModalOpen,
  selectIsEditModalOpen,
  selectEditingNoteId,
  selectFilters,
  selectSearchQuery,
} = notesSlice.selectors;

export default notesSlice.reducer;
