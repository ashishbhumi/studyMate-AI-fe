import { CreateAppSlice } from "@/store/create-app-slice";

export interface TagsStateInterface {
  selectedTagId: number | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  editingTagId: number | null;
}

const initialState: TagsStateInterface = {
  selectedTagId: null,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  editingTagId: null,
};

const tagsSlice = CreateAppSlice({
  name: "tags",
  initialState,
  reducers: (create) => ({
    setSelectedTagId: create.reducer<number | null>((state, action) => {
      state.selectedTagId = action.payload;
    }),

    openCreateModal: create.reducer((state) => {
      state.isCreateModalOpen = true;
    }),

    closeCreateModal: create.reducer((state) => {
      state.isCreateModalOpen = false;
    }),

    openEditModal: create.reducer<number>((state, action) => {
      state.isEditModalOpen = true;
      state.editingTagId = action.payload;
    }),

    closeEditModal: create.reducer((state) => {
      state.isEditModalOpen = false;
      state.editingTagId = null;
    }),
  }),

  selectors: {
    selectSelectedTagId: (tags) => tags.selectedTagId,
    selectIsCreateModalOpen: (tags) => tags.isCreateModalOpen,
    selectIsEditModalOpen: (tags) => tags.isEditModalOpen,
    selectEditingTagId: (tags) => tags.editingTagId,
  },
});

export const {
  setSelectedTagId,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
} = tagsSlice.actions;

export const {
  selectSelectedTagId,
  selectIsCreateModalOpen,
  selectIsEditModalOpen,
  selectEditingTagId,
} = tagsSlice.selectors;

export default tagsSlice.reducer;
