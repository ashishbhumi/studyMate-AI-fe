import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpenDot, Plus, Pencil, Trash2, AlertCircle } from "lucide-react";
import {
  useGetFoldersQuery,
  useCreateFolderMutation,
  useUpdateFolderMutation,
  useDeleteFolderMutation,
} from "../apis/folders-api";
import {
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
} from "../slices/folders-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type {
  CreateFolderInterface,
  UpdateFolderInterface,
} from "../interfaces/folder.interface";
import { ROUTES } from "@/routes/routes";

const FoldersList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: folders, isLoading, error } = useGetFoldersQuery();
  const [createFolder, { isLoading: isCreating }] = useCreateFolderMutation();
  const [updateFolder, { isLoading: isUpdating }] = useUpdateFolderMutation();
  const [deleteFolder, { isLoading: isDeleting }] = useDeleteFolderMutation();

  const isCreateModalOpen = useAppSelector(
    (state) => state.folders.isCreateModalOpen,
  );
  const isEditModalOpen = useAppSelector(
    (state) => state.folders.isEditModalOpen,
  );
  const editingFolderId = useAppSelector(
    (state) => state.folders.editingFolderId,
  );

  const [folderName, setFolderName] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    try {
      await createFolder({
        name: folderName,
      } as CreateFolderInterface).unwrap();
      setFolderName("");
      dispatch(closeCreateModal());
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  const handleUpdateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim() || !editingFolderId) return;

    try {
      await updateFolder({
        id: editingFolderId,
        body: { name: folderName } as UpdateFolderInterface,
      }).unwrap();
      setFolderName("");
      dispatch(closeEditModal());
    } catch (error) {
      console.error("Failed to update folder:", error);
    }
  };

  const handleDeleteFolder = async (id: number) => {
    try {
      await deleteFolder(id).unwrap();
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Failed to delete folder:", error);
    }
  };

  const openEditModalHandler = (folder: { id: number; name: string }) => {
    setFolderName(folder.name);
    dispatch(openEditModal(folder.id));
  };

  const closeModals = () => {
    setFolderName("");
    dispatch(closeCreateModal());
    dispatch(closeEditModal());
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Folders</h1>
          <p className="mt-1 text-gray-600">
            Organize your study materials by subject
          </p>
        </div>
        <button
          onClick={() => dispatch(openCreateModal())}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Folder
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>Failed to load folders. Please try again.</span>
        </div>
      )}

      {!folders || folders.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpenDot className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No folders yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Create your first folder to start organizing your notes
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() =>
                navigate(`${ROUTES.NOTES.LIST}?folderId=${folder.id}`)
              }
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FolderOpenDot className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModalHandler(folder);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(folder.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {folder.name}
              </h3>
              <p className="text-sm text-gray-500">
                Created {new Date(folder.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Create Folder Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Create New Folder
            </h2>
            <form onSubmit={handleCreateFolder}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g., Organic Chemistry"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !folderName.trim()}
                  className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreating ? "Creating..." : "Create Folder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Folder Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Edit Folder
            </h2>
            <form onSubmit={handleUpdateFolder}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g., Organic Chemistry"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || !folderName.trim()}
                  className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdating ? "Updating..." : "Update Folder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Delete Folder
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this folder? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteFolder(deleteConfirmId)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete Folder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoldersList;
