import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { LOGOUT } from "@/feature/auth/slices/auth-slice";
import { useGetFoldersQuery } from "@/feature/folders/apis/folders-api";
import { useGetNotesQuery } from "@/feature/notes/apis/notes-api";
import { ROUTES } from "@/routes/routes";
import Topbar from "./Topbar";
import Sidebar from ".";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // This only controls the mobile overlay drawer now — from md up the
  // sidebar is always visible via CSS regardless of this state.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { data: folders } = useGetFoldersQuery();
  const { data: notesData } = useGetNotesQuery({ page: 1, limit: 100 });

  const notes = notesData?.data || [];

  // Auto-close the mobile drawer whenever the route changes, so navigating
  // to a note/folder doesn't leave the overlay open on top of it. No-op from
  // md up since the sidebar is permanently visible there anyway.
  useEffect(() => {
    if (window.innerWidth < 768) {
      requestAnimationFrame(() => setSidebarOpen(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(LOGOUT());
    navigate("/login");
  };

  const toggleFolder = (folderId: number) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleFolderClick = (folderId: number) => {
    navigate(`${ROUTES.NOTES.LIST}?folderId=${folderId}`);
  };

  const handleNoteClick = (noteId: number) => {
    navigate(ROUTES.NOTES.DETAIL.replace(":id", noteId.toString()));
  };

  const activeNoteId = (() => {
    const match = notes.find(
      (note) =>
        location.pathname ===
        ROUTES.NOTES.DETAIL.replace(":id", note.id.toString()),
    );
    return match ? match.id : null;
  })();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        folders={folders || []}
        notes={notes}
        expandedFolders={expandedFolders}
        activeNoteId={activeNoteId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleFolder={toggleFolder}
        onFolderClick={handleFolderClick}
        onNoteClick={handleNoteClick}
        onNewFolder={() => navigate(ROUTES.FOLDERS.LIST)}
        onNewNote={() => navigate(ROUTES.NOTES.LIST)}
        onManageTags={() => navigate(ROUTES.TAGS.LIST)}
      />

      {/* Below md: sidebar is a fixed overlay, so content never shifts.
          From md up: sidebar is permanently in-flow, so content always
          has room for it — no toggle, no conditional margin. */}
      <div className="flex-1 min-w-0 h-screen overflow-y-auto">
        <Topbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onLogout={handleLogout}
        />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
