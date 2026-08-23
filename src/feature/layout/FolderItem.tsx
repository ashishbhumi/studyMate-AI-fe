import { ChevronDown, ChevronRight, FolderOpenDot } from "lucide-react";
import NoteItem from "./NoteItem";
import type { SidebarFolder, SidebarNote } from "./types";

interface FolderItemProps {
  folder: SidebarFolder;
  notes: SidebarNote[];
  isExpanded: boolean;
  activeNoteId: number | null;
  onToggle: (folderId: number) => void;
  onFolderClick: (folderId: number) => void;
  onNoteClick: (noteId: number) => void;
}

const FolderItem = ({
  folder,
  notes,
  isExpanded,
  activeNoteId,
  onToggle,
  onFolderClick,
  onNoteClick,
}: FolderItemProps) => {
  return (
    <div className="mb-1">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onToggle(folder.id)}
          aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
          className="p-1 text-gray-400 hover:text-gray-600 rounded shrink-0"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={() => onFolderClick(folder.id)}
          className="flex-1 flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left min-w-0"
        >
          <FolderOpenDot className="h-4 w-4 text-yellow-600 shrink-0" />
          <span className="truncate">{folder.name}</span>
          <span className="text-xs text-gray-400 ml-auto shrink-0">
            {notes.length}
          </span>
        </button>
      </div>

      {isExpanded && notes.length > 0 && (
        <div className="ml-6 mt-1 space-y-1">
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              isActive={activeNoteId === note.id}
              onClick={onNoteClick}
              indent
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderItem;
