export interface TagInterface {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagInterface {
  name: string;
}

export interface UpdateTagInterface {
  name?: string;
}
