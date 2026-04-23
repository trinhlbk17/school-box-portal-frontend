export enum AlbumStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface Album {
  id: string;
  classId: string;
  name: string;
  description: string;
  status: AlbumStatus;
  creatorId: string;
  boxFolderId: string;
  coverImageId?: string;
  imageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AlbumImage {
  id: string;
  albumId: string;
  boxFileId: string;
  originalName: string;
  mimeType: string;
  size: number;
  orderIndex: number;
  uploaderId: string;
  createdAt: string;
}

export interface CreateAlbumInput {
  name: string;
  description?: string;
  classId: string;
}

export interface UpdateAlbumInput {
  name?: string;
  description?: string;
  coverImageId?: string;
}

export interface AlbumListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AlbumStatus;
}
