import { Tag as TagIcon } from "lucide-react";

interface SidebarFooterProps {
  onManageTags: () => void;
}

const SidebarFooter = ({ onManageTags }: SidebarFooterProps) => {
  return (
    <div className="p-4 border-t border-gray-200 shrink-0">
      <button
        onClick={onManageTags}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <TagIcon className="h-4 w-4" />
        Manage Tags
      </button>
    </div>
  );
};

export default SidebarFooter;
