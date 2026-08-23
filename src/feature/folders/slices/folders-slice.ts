import { CreateAppSlice } from "@/store/create-app-slice";

export interface FoldersStateInterface {
  selectedFolderId: number | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  editingFolderId: number | null;
}

const initialState: FoldersStateInterface = {
  selectedFolderId: null,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  editingFolderId: null,
};

const foldersSlice = CreateAppSlice({
  name: "folders",
  initialState,
  reducers: (create) => ({
    setSelectedFolderId: create.reducer<number | null>((state, action) => {
      state.selectedFolderId = action.payload;
    }),

    openCreateModal: create.reducer((state) => {
      state.isCreateModalOpen = true;
    }),

    closeCreateModal: create.reducer((state) => {
      state.isCreateModalOpen = false;
    }),

    openEditModal: create.reducer<number>((state, action) => {
      state.isEditModalOpen = true;
      state.editingFolderId = action.payload;
    }),

    closeEditModal: create.reducer((state) => {
      state.isEditModalOpen = false;
      state.editingFolderId = null;
    }),
  }),

  selectors: {
    selectSelectedFolderId: (folders) => folders.selectedFolderId,
    selectIsCreateModalOpen: (folders) => folders.isCreateModalOpen,
    selectIsEditModalOpen: (folders) => folders.isEditModalOpen,
    selectEditingFolderId: (folders) => folders.editingFolderId,
  },
});

export const {
  setSelectedFolderId,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
} = foldersSlice.actions;

export const {
  selectSelectedFolderId,
  selectIsCreateModalOpen,
  selectIsEditModalOpen,
  selectEditingFolderId,
} = foldersSlice.selectors;

export default foldersSlice.reducer;
