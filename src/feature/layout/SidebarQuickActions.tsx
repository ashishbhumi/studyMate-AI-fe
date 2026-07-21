import { Plus, FileText } from "lucide-react";

interface SidebarQuickActionsProps {
  onNewFolder: () => void;
  onNewNote: () => void;
}

const SidebarQuickActions = ({
  onNewFolder,
  onNewNote,
}: SidebarQuickActionsProps) => {
  return (
    <div className="px-4 pb-4 shrink-0">
      <button
        onClick={onNewFolder}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4" />
        New Folder
      </button>
      <button
        onClick={onNewNote}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <FileText className="h-4 w-4" />
        New Note
      </button>
    </div>
  );
};

export default SidebarQuickActions;
