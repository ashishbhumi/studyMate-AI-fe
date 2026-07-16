export interface NoteInterface {
  id: number;
  title: string;
  content?: string;
  coverImage?: string;
  isPinned: boolean;
  isArchived: boolean;
  folderId?: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  tags?: TagInterface[];
}

export interface CreateNoteInterface {
  title: string;
  content?: string;
  coverImage?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  folderId?: number;
}

export interface UpdateNoteInterface {
  title?: string;
  content?: string;
  coverImage?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  folderId?: number;
}

export interface AttachTagsInterface {
  tagIds: number[];
}

export interface NotesQueryInterface {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  folderId?: number;
  isPinned?: boolean;
  isArchived?: boolean;
}

export interface TagInterface {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}
