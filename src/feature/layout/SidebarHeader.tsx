import { ROUTES } from "@/routes/routes";
import { X, FolderOpenDot } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarHeaderProps {
  onClose: () => void;
}

const SidebarHeader = ({ onClose }: SidebarHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-yellow-500">
          <FolderOpenDot className="h-5 w-5 text-gray-900" />
        </div>
        <span
          className="text-lg font-semibold text-gray-900 truncate cursor-pointer"
          onClick={() => navigate(ROUTES.DASHBOARD)}
        >
          Study<span className="text-yellow-600">Mate</span> AI
        </span>
      </div>
      {/* Close button only makes sense on mobile, where the sidebar overlays content.
          From md up the sidebar is always visible and can't be closed. */}
      <button
        onClick={onClose}
        aria-label="Close sidebar"
        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg md:hidden"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SidebarHeader;
