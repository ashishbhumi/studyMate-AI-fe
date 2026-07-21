import FolderItem from "./FolderItem";
import NoteItem from "./NoteItem";
import type { SidebarFolder, SidebarNote } from "./types";

interface FolderTreeProps {
  folders: SidebarFolder[];
  notes: SidebarNote[];
  expandedFolders: Set<number>;
  activeNoteId: number | null;
  onToggleFolder: (folderId: number) => void;
  onFolderClick: (folderId: number) => void;
  onNoteClick: (noteId: number) => void;
}

const FolderTree = ({
  folders,
  notes,
  expandedFolders,
  activeNoteId,
  onToggleFolder,
  onFolderClick,
  onNoteClick,
}: FolderTreeProps) => {
  const getNotesByFolder = (folderId: number) =>
    notes.filter((note) => note.folderId === folderId);

  const unfolderedNotes = notes.filter((note) => !note.folderId);

  return (
    <div className="flex-1 overflow-y-auto px-4 min-h-0">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
        Folders
      </div>

      {folders.length === 0 && (
        <p className="text-sm text-gray-400 px-2 py-1.5">No folders yet</p>
      )}

      {folders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          notes={getNotesByFolder(folder.id)}
          isExpanded={expandedFolders.has(folder.id)}
          activeNoteId={activeNoteId}
          onToggle={onToggleFolder}
          onFolderClick={onFolderClick}
          onNoteClick={onNoteClick}
        />
      ))}

      {unfolderedNotes.length > 0 && (
        <>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 mt-4">
            No Folder
          </div>
          {unfolderedNotes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              isActive={activeNoteId === note.id}
              onClick={onNoteClick}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default FolderTree;
