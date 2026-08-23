import { useNavigate } from "react-router-dom";
import {
  FolderOpenDot,
  LogOut,
  Settings,
  User,
  FileText,
  Tag as TagIcon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { LOGOUT } from "@/feature/auth/slices/auth-slice";
import { useGetFoldersQuery } from "@/feature/folders/apis/folders-api";
import { useGetNotesQuery } from "@/feature/notes/apis/notes-api";
import { useGetTagsQuery } from "@/feature/tags/apis/tags-api";
import { ROUTES } from "@/routes/routes";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: folders } = useGetFoldersQuery();
  const { data: notesData } = useGetNotesQuery({ page: 1, limit: 1 });
  const { data: tags } = useGetTagsQuery();

  const totalFolders = folders?.length || 0;
  const totalNotes = notesData?.total || 0;
  const totalTags = tags?.length || 0;

  const handleLogout = () => {
    dispatch(LOGOUT());
    navigate("/login");
  };

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-yellow-500">
                <FolderOpenDot className="h-5 w-5 text-gray-900" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Study<span className="text-yellow-600">Mate</span> AI
              </span>
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
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's an overview of your study materials.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(ROUTES.FOLDERS.LIST)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FolderOpenDot className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {totalFolders}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Folders</h3>
          </div>

          <div
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(ROUTES.NOTES.LIST)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {totalNotes}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Notes</h3>
          </div>

          <div
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(ROUTES.TAGS.LIST)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TagIcon className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {totalTags}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Tags</h3>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <FolderOpenDot className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start by creating a folder and adding your notes
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
