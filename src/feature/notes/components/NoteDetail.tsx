import { useParams, useNavigate } from "react-router-dom";
import {
  useGetNoteByIdQuery,
  useDeleteNoteMutation,
  usePinNoteMutation,
  useUnpinNoteMutation,
  useArchiveNoteMutation,
  useUnarchiveNoteMutation,
  useSummarizeNoteMutation,
} from "../apis/notes-api";
import { useAppDispatch } from "@/store/hooks";
import { openEditModal } from "../slices/notes-slice";
import {
  ArrowLeft,
  Pin,
  Archive,
  Trash2,
  MoreVertical,
  FileText,
  Calendar,
  Tag,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const NoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const noteId = parseInt(id || "0");
  const {
    data: note,
    isLoading,
    error,
  } = useGetNoteByIdQuery(noteId, { skip: !noteId });
  const [deleteNote] = useDeleteNoteMutation();
  const [pinNote] = usePinNoteMutation();
  const [unpinNote] = useUnpinNoteMutation();
  const [archiveNote] = useArchiveNoteMutation();
  const [unarchiveNote] = useUnarchiveNoteMutation();
  const [summarizeNote, { isLoading: isSummarizing }] =
    useSummarizeNoteMutation();

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    dispatch(openEditModal(noteId));
    setShowMenu(false);
  };

  const handlePin = async () => {
    if (note?.isPinned) {
      await unpinNote(noteId);
    } else {
      await pinNote(noteId);
    }
    setShowMenu(false);
  };

  const handleArchive = async () => {
    if (note?.isArchived) {
      await unarchiveNote(noteId);
    } else {
      await archiveNote(noteId);
    }
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteNote(noteId);
      navigate("/dashboard/notes");
    }
    setShowMenu(false);
  };

  const handleSummarize = async () => {
    try {
      await summarizeNote(noteId);
    } catch (error) {
      console.error("Failed to generate summary:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Note not found</p>
          <button
            onClick={handleBack}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
              <button
                onClick={handleEdit}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={handlePin}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Pin className="h-4 w-4" />
                {note.isPinned ? "Unpin" : "Pin"}
              </button>
              <button
                onClick={handleArchive}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Archive className="h-4 w-4" />
                {note.isArchived ? "Unarchive" : "Archive"}
              </button>
              <hr className="my-1" />
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Note Content */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{note.title}</h1>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
          {note.isPinned && (
            <div className="flex items-center gap-1 text-yellow-600">
              <Pin className="h-4 w-4" />
              <span>Pinned</span>
            </div>
          )}
          {note.isArchived && (
            <div className="flex items-center gap-1 text-gray-600">
              <Archive className="h-4 w-4" />
              <span>Archived</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <Tag className="h-4 w-4 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cover Image */}
        {note.coverImage && (
          <div className="mb-6">
            <img
              src={note.coverImage}
              alt={note.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Summary */}
        {note.summary ? (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">
              AI Summary
            </h3>
            <p className="text-sm text-yellow-700">{note.summary}</p>
          </div>
        ) : (
          <div className="mb-6">
            <button
              onClick={handleSummarize}
              disabled={isSummarizing || !note.content}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              {isSummarizing ? "Generating..." : "Generate AI Summary"}
            </button>
          </div>
        )}

        {/* Content */}
        {note.content ? (
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
          </div>
        ) : (
          <p className="text-gray-400 italic">No content</p>
        )}
      </div>
    </div>
  );
};

export default NoteDetail;
