import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Pin,
  PinOff,
  Archive,
  ArchiveRestore,
  Search,
  Filter,
} from "lucide-react";
import {
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  usePinNoteMutation,
  useUnpinNoteMutation,
  useArchiveNoteMutation,
  useUnarchiveNoteMutation,
  useAttachTagsMutation,
} from "../apis/notes-api";
import { useGetFoldersQuery } from "../../folders/apis/folders-api";
import { useGetTagsQuery } from "../../tags/apis/tags-api";
import {
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  setFilters,
} from "../slices/notes-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type {
  CreateNoteInterface,
  UpdateNoteInterface,
  AttachTagsInterface,
} from "../interfaces/note.interface";
import { ROUTES } from "@/routes/routes";

const NotesList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const folderIdFromUrl = searchParams.get("folderId");

  const filters = useAppSelector((state) => state.notes.filters);
  const isCreateModalOpen = useAppSelector(
    (state) => state.notes.isCreateModalOpen,
  );
  const isEditModalOpen = useAppSelector(
    (state) => state.notes.isEditModalOpen,
  );
  const editingNoteId = useAppSelector((state) => state.notes.editingNoteId);

  const { data: folders } = useGetFoldersQuery();
  const { data: tags } = useGetTagsQuery();
  const {
    data: notesData,
    isLoading,
    error,
    refetch,
  } = useGetNotesQuery({
    ...filters,
    folderId: folderIdFromUrl ? parseInt(folderIdFromUrl) : filters.folderId,
  });
  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();
  const [pinNote] = usePinNoteMutation();
  const [unpinNote] = useUnpinNoteMutation();
  const [archiveNote] = useArchiveNoteMutation();
  const [unarchiveNote] = useUnarchiveNoteMutation();
  const [attachTags] = useAttachTagsMutation();

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<number | "">("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const notes = notesData?.data || [];
  const total = notesData?.total || 0;

  useEffect(() => {
    if (folderIdFromUrl) {
      dispatch(setFilters({ folderId: parseInt(folderIdFromUrl) }));
    }
  }, [folderIdFromUrl, dispatch]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    try {
      const result = await createNote({
        title: noteTitle,
        content: noteContent,
        folderId: selectedFolderId || undefined,
      } as CreateNoteInterface).unwrap();

      if (selectedTagIds.length > 0) {
        await handleAttachTags(result.id);
      }

      setNoteTitle("");
      setNoteContent("");
      setSelectedFolderId("");
      setSelectedTagIds([]);
      dispatch(closeCreateModal());
      refetch();
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !editingNoteId) return;

    try {
      await updateNote({
        id: editingNoteId,
        body: {
          title: noteTitle,
          content: noteContent,
          folderId: selectedFolderId || undefined,
        } as UpdateNoteInterface,
      }).unwrap();

      await handleAttachTags(editingNoteId);

      setNoteTitle("");
      setNoteContent("");
      setSelectedFolderId("");
      setSelectedTagIds([]);
      dispatch(closeEditModal());
      refetch();
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await deleteNote(id).unwrap();
      setDeleteConfirmId(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleTogglePin = async (note: { id: number; isPinned: boolean }) => {
    try {
      if (note.isPinned) {
        await unpinNote(note.id).unwrap();
      } else {
        await pinNote(note.id).unwrap();
      }
      refetch();
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };

  const handleToggleArchive = async (note: {
    id: number;
    isArchived: boolean;
  }) => {
    try {
      if (note.isArchived) {
        await unarchiveNote(note.id).unwrap();
      } else {
        await archiveNote(note.id).unwrap();
      }
      refetch();
    } catch (error) {
      console.error("Failed to toggle archive:", error);
    }
  };

  const handleAttachTags = async (noteId: number) => {
    try {
      await attachTags({
        id: noteId,
        body: { tagIds: selectedTagIds } as AttachTagsInterface,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to attach tags:", error);
    }
  };

  const openEditModalHandler = (note: {
    id: number;
    title: string;
    content?: string;
    folderId?: number;
    tags?: { id: number }[];
  }) => {
    setNoteTitle(note.title);
    setNoteContent(note.content || "");
    setSelectedFolderId(note.folderId || "");
    setSelectedTagIds(note.tags?.map((t) => t.id) || []);
    dispatch(openEditModal(note.id));
  };

  const closeModals = () => {
    setNoteTitle("");
    setNoteContent("");
    setSelectedFolderId("");
    setSelectedTagIds([]);
    dispatch(closeCreateModal());
    dispatch(closeEditModal());
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search implementation would go here
  };

  const handleFilterChange = (
    key: string,
    value: number | string | boolean | undefined,
  ) => {
    dispatch(setFilters({ [key]: value }));
    refetch();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-2xl font-semibold text-gray-900">Notes</h1>
          <p className="mt-1 text-gray-600">
            {folderIdFromUrl
              ? `Notes in ${folders?.find((f) => f.id === parseInt(folderIdFromUrl))?.name || "selected folder"}`
              : "All your notes"}
          </p>
        </div>
        <button
          onClick={() => dispatch(openCreateModal())}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Note
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
            />
          </div>
        </form>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Folder
              </label>
              <select
                value={filters.folderId || ""}
                onChange={(e) =>
                  handleFilterChange("folderId", e.target.value || undefined)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none"
              >
                <option value="">All Folders</option>
                {folders?.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={
                  filters.isPinned !== undefined
                    ? filters.isPinned
                      ? "pinned"
                      : "unpinned"
                    : ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange(
                    "isPinned",
                    value === "pinned"
                      ? true
                      : value === "unpinned"
                        ? false
                        : undefined,
                  );
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none"
              >
                <option value="">All</option>
                <option value="pinned">Pinned</option>
                <option value="unpinned">Unpinned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archive
              </label>
              <select
                value={
                  filters.isArchived !== undefined
                    ? filters.isArchived
                      ? "archived"
                      : "active"
                    : ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange(
                    "isArchived",
                    value === "archived"
                      ? true
                      : value === "active"
                        ? false
                        : undefined,
                  );
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>Failed to load notes. Please try again.</span>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No notes found</p>
          <p className="text-sm text-gray-400 mt-1">
            Create your first note or adjust your filters
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-500">
            Showing {notes.length} of {total} notes
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                  note.isArchived
                    ? "border-gray-300 opacity-70"
                    : "border-gray-200"
                }`}
                onClick={() =>
                  navigate(
                    `${ROUTES.NOTES.DETAIL.replace(":id", note.id.toString())}`,
                  )
                }
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                      {note.title}
                    </h3>
                    {note.content && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {note.content}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePin(note);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        note.isPinned
                          ? "text-yellow-600 bg-yellow-50"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      }`}
                      title={note.isPinned ? "Unpin" : "Pin"}
                    >
                      {note.isPinned ? (
                        <Pin className="h-4 w-4" />
                      ) : (
                        <PinOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleArchive(note);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        note.isArchived
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      }`}
                      title={note.isArchived ? "Unarchive" : "Archive"}
                    >
                      {note.isArchived ? (
                        <ArchiveRestore className="h-4 w-4" />
                      ) : (
                        <Archive className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModalHandler(note);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(note.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  {note.folderId && folders && (
                    <span className="px-2 py-1 bg-gray-100 rounded-full">
                      {folders.find((f) => f.id === note.folderId)?.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create Note Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Create New Note
            </h2>
            <form onSubmit={handleCreateNote}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Note title"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Note content..."
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder (optional)
                </label>
                <select
                  value={selectedFolderId}
                  onChange={(e) =>
                    setSelectedFolderId(
                      e.target.value ? parseInt(e.target.value) : "",
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none"
                >
                  <option value="">No folder</option>
                  {folders?.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags?.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        setSelectedTagIds((prev) =>
                          prev.includes(tag.id)
                            ? prev.filter((id) => id !== tag.id)
                            : [...prev, tag.id],
                        );
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedTagIds.includes(tag.id)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
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
                  disabled={isCreating || !noteTitle.trim()}
                  className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreating ? "Creating..." : "Create Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Edit Note
            </h2>
            <form onSubmit={handleUpdateNote}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Note title"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Note content..."
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder (optional)
                </label>
                <select
                  value={selectedFolderId}
                  onChange={(e) =>
                    setSelectedFolderId(
                      e.target.value ? parseInt(e.target.value) : "",
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none"
                >
                  <option value="">No folder</option>
                  {folders?.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags?.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        setSelectedTagIds((prev) =>
                          prev.includes(tag.id)
                            ? prev.filter((id) => id !== tag.id)
                            : [...prev, tag.id],
                        );
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedTagIds.includes(tag.id)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
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
                  disabled={isUpdating || !noteTitle.trim()}
                  className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdating ? "Updating..." : "Update Note"}
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
              Delete Note
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this note? This action cannot be
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
                onClick={() => handleDeleteNote(deleteConfirmId)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete Note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesList;
