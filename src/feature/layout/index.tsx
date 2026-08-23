import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearch";
import SidebarQuickActions from "./SidebarQuickActions";
import FolderTree from "./FolderTree";
import SidebarFooter from "./SidebarFooter";
import type { SidebarFolder, SidebarNote } from "./types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  folders: SidebarFolder[];
  notes: SidebarNote[];
  expandedFolders: Set<number>;
  activeNoteId: number | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onToggleFolder: (folderId: number) => void;
  onFolderClick: (folderId: number) => void;
  onNoteClick: (noteId: number) => void;
  onNewFolder: () => void;
  onNewNote: () => void;
  onManageTags: () => void;
}

const Sidebar = ({
  isOpen,
  onClose,
  folders,
  notes,
  expandedFolders,
  activeNoteId,
  searchQuery,
  onSearchChange,
  onToggleFolder,
  onFolderClick,
  onNoteClick,
  onNewFolder,
  onNewNote,
  onManageTags,
}: SidebarProps) => {
  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {/* Backdrop: only ever rendered below the md breakpoint. From md up the
          sidebar is permanently visible and in-flow, so there's nothing to
          dim behind it. */}
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:z-30 h-screen
        `}
      >
        <div className="flex flex-col h-full w-72">
          <SidebarHeader onClose={onClose} />
          <SidebarSearch value={searchQuery} onChange={onSearchChange} />
          <SidebarQuickActions
            onNewFolder={onNewFolder}
            onNewNote={onNewNote}
          />
          <FolderTree
            folders={filteredFolders}
            notes={notes}
            expandedFolders={expandedFolders}
            activeNoteId={activeNoteId}
            onToggleFolder={onToggleFolder}
            onFolderClick={onFolderClick}
            onNoteClick={onNoteClick}
          />
          <SidebarFooter onManageTags={onManageTags} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
