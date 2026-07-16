import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, X, FolderOpenDot, FileText, Tag as TagIcon, 
  Plus, Search, LogOut, Settings, User, ChevronDown, ChevronRight 
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { LOGOUT } from "@/feature/auth/slices/auth-slice";
import { useGetFoldersQuery } from "@/feature/folders/apis/folders-api";
import { useGetNotesQuery } from "@/feature/notes/apis/notes-api";
import { ROUTES } from "@/routes/routes";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: folders } = useGetFoldersQuery();
  const { data: notesData } = useGetNotesQuery({ page: 1, limit: 100 });
  
  const notes = notesData?.data || [];
  
  const handleLogout = () => {
    dispatch(LOGOUT());
    navigate("/login");
  };

  const toggleFolder = (folderId: string) => {
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

  const handleFolderClick = (folderId: string) => {
    navigate(`${ROUTES.NOTES.LIST}?folderId=${folderId}`);
  };

  const handleNoteClick = (noteId: string) => {
    navigate(`${ROUTES.NOTES.DETAIL.replace(":id", noteId)}`);
  };

  const getNotesByFolder = (folderId: string) => {
    return notes.filter((note) => note.folderId === folderId);
  };

  const getUnfolderedNotes = () => {
    return notes.filter((note) => !note.folderId);
  };

  const filteredFolders = folders?.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-30 ${
          sidebarOpen ? "w-72" : "w-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-yellow-500">
                <FolderOpenDot className="h-5 w-5 text-gray-900" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Study<span className="text-yellow-600">Mate</span> AI
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search folders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200 text-sm"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-4">
            <button
              onClick={() => navigate(ROUTES.FOLDERS.LIST)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Folder
            </button>
            <button
              onClick={() => navigate(ROUTES.NOTES.LIST)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4" />
              New Note
            </button>
          </div>

          {/* Folders Tree */}
          <div className="flex-1 overflow-y-auto px-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Folders
            </div>
            {filteredFolders.map((folder) => {
              const folderNotes = getNotesByFolder(folder.id);
              const isExpanded = expandedFolders.has(folder.id);
              
              return (
                <div key={folder.id} className="mb-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFolder(folder.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleFolderClick(folder.id)}
                      className="flex-1 flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
                    >
                      <FolderOpenDot className="h-4 w-4 text-yellow-600" />
                      <span className="truncate">{folder.name}</span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {folderNotes.length}
                      </span>
                    </button>
                  </div>
                  
                  {isExpanded && folderNotes.length > 0 && (
                    <div className="ml-6 mt-1 space-y-1">
                      {folderNotes.map((note) => (
                        <button
                          key={note.id}
                          onClick={() => handleNoteClick(note.id)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg transition-colors text-left ${
                            location.pathname === ROUTES.NOTES.DETAIL.replace(":id", note.id)
                              ? "bg-yellow-50 text-yellow-700"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="truncate">{note.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Unfoldered Notes */}
            {getUnfolderedNotes().length > 0 && (
              <>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 mt-4">
                  No Folder
                </div>
                {getUnfolderedNotes().map((note) => (
                  <button
                    key={note.id}
                    onClick={() => handleNoteClick(note.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg transition-colors text-left mb-1 ${
                      location.pathname === ROUTES.NOTES.DETAIL.replace(":id", note.id)
                        ? "bg-yellow-50 text-yellow-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="truncate">{note.title}</span>
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => navigate(ROUTES.TAGS.LIST)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <TagIcon className="h-4 w-4" />
              Manage Tags
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-0"}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-yellow-500">
                  <FolderOpenDot className="h-5 w-5 text-gray-900" />
                </div>
                <span className="text-lg font-semibold text-gray-900 hidden sm:block">
                  Study<span className="text-yellow-600">Mate</span> AI
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
