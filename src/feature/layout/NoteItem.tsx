import { FileText } from "lucide-react";
import type { SidebarNote } from "./types";

interface NoteItemProps {
  note: SidebarNote;
  isActive: boolean;
  onClick: (noteId: number) => void;
  indent?: boolean;
}

const NoteItem = ({ note, isActive, onClick, indent }: NoteItemProps) => {
  return (
    <button
      onClick={() => onClick(note.id)}
      className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg transition-colors text-left mb-1 ${
        indent ? "ml-0" : ""
      } ${
        isActive
          ? "bg-yellow-50 text-yellow-700"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <FileText className="h-4 w-4 shrink-0" />
      <span className="truncate">{note.title}</span>
    </button>
  );
};

export default NoteItem;
