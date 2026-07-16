export interface FolderInterface {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFolderInterface {
  name: string;
}

export interface UpdateFolderInterface {
  name?: string;
}
