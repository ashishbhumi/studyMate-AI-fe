// Minimal shapes the sidebar needs. Swap these for imports from your
// actual `folders-api` / `notes-api` types if the field names line up.
export interface SidebarFolder {
  id: number;
  name: string;
}

export interface SidebarNote {
  id: number;
  title: string;
  folderId?: number | null;
}
