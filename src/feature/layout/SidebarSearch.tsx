import { Search } from "lucide-react";

interface SidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const SidebarSearch = ({ value, onChange }: SidebarSearchProps) => {
  return (
    <div className="p-4 shrink-0">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search folders..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200 text-sm"
        />
      </div>
    </div>
  );
};

export default SidebarSearch;
