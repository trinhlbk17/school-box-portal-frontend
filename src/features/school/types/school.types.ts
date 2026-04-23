export interface School {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  boxFolderId: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchoolInput {
  name: string;
  address?: string;
  phone?: string;
  parentBoxFolderId?: string;
}

export type UpdateSchoolInput = Partial<CreateSchoolInput>;
