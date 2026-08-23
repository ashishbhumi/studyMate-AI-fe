import { Menu, X, FolderOpenDot, Settings, User, LogOut } from "lucide-react";

interface TopbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

const Topbar = ({ sidebarOpen, onToggleSidebar, onLogout }: TopbarProps) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Only mobile has a sidebar to toggle — from md up it's always visible */}
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg shrink-0 md:hidden"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          {/* Logo is hidden from md up since the always-visible Sidebar already shows it */}
          <div className="flex items-center gap-3 min-w-0 md:hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-yellow-500">
              <FolderOpenDot className="h-5 w-5 text-gray-900" />
            </div>
            <span className="text-lg font-semibold text-gray-900 hidden sm:block truncate">
              Study<span className="text-yellow-600">Mate</span> AI
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            aria-label="Settings"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            aria-label="Profile"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <User className="h-5 w-5" />
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-2.5 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
