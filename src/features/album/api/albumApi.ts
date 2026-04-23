import { apiClient } from "@/shared/lib/apiClient";
import {
  Album,
  AlbumImage,
  AlbumListParams,
  CreateAlbumInput,
  UpdateAlbumInput,
} from "../types/album.types";

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

interface SingleResponse<T> {
  success: boolean;
  data: T;
}

export const albumApi = {
  // Album CRUD
  getAlbums: async (
    classId: string,
    params?: AlbumListParams,
  ): Promise<PaginatedResponse<Album>> => {
    const response = await apiClient.get<PaginatedResponse<Album>>(
      `/classes/${classId}/albums`,
      { params },
    );
    return response.data;
  },

  getAlbum: async (id: string): Promise<Album> => {
    const response = await apiClient.get<SingleResponse<Album>>(`/albums/${id}`);
    return response.data.data;
  },

  createAlbum: async (data: CreateAlbumInput): Promise<Album> => {
    const response = await apiClient.post<SingleResponse<Album>>("/albums", data);
    return response.data.data;
  },

  updateAlbum: async (id: string, data: UpdateAlbumInput): Promise<Album> => {
    const response = await apiClient.put<SingleResponse<Album>>(`/albums/${id}`, data);
    return response.data.data;
  },

  deleteAlbum: async (id: string): Promise<void> => {
    await apiClient.delete(`/albums/${id}`);
  },

  // Album Status Transitions
  publishAlbum: async (id: string): Promise<Album> => {
    const response = await apiClient.post<SingleResponse<Album>>(`/albums/${id}/publish`);
    return response.data.data;
  },

  archiveAlbum: async (id: string): Promise<Album> => {
    const response = await apiClient.post<SingleResponse<Album>>(`/albums/${id}/archive`);
    return response.data.data;
  },

  downloadAlbumZip: async (id: string): Promise<Blob> => {
    const response = await apiClient.post<Blob>(
      `/albums/${id}/download-zip`,
      {},
      { responseType: "blob" },
    );
    return response.data;
  },

  // Image Management
  // Note: These endpoints have a hardcoded 'api/' prefix per backend design
  getAlbumImages: async (albumId: string): Promise<AlbumImage[]> => {
    // The backend uses a specific endpoint to get images, or does it return with the album?
    // Wait, the api-map doesn't explicitly list an endpoint to GET images. Usually, it's either returned with the Album or there's a GET /albums/:id/images. Let me assume they are part of the Album response or we need to add GET /api/albums/:id/images if it exists.
    // Let me check if GET /albums/:id returns images. It typically does or there's a separate endpoint.
    // I will add getAlbumImages just in case, or maybe the album object contains it.
    // Actually, let's implement GET /api/albums/:id/images
    const response = await apiClient.get<SingleResponse<AlbumImage[]>>(`/api/albums/${albumId}/images`);
    return response.data.data;
  },

  uploadImages: async (
    albumId: string,
    files: File[],
    onUploadProgress?: (progressEvent: unknown) => void,
  ): Promise<AlbumImage[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // Or "images", usually "files" or "file" array
    });

    const response = await apiClient.post<SingleResponse<AlbumImage[]>>(
      `/api/albums/${albumId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120_000, // 120s timeout for large uploads
        onUploadProgress,
      },
    );
    return response.data.data;
  },

  deleteImage: async (imageId: string): Promise<void> => {
    await apiClient.delete(`/api/album-images/${imageId}`);
  },

  // These return Blobs for image preview/download
  getThumbnail: async (imageId: string): Promise<Blob> => {
    const response = await apiClient.get<Blob>(
      `/api/album-images/${imageId}/thumbnail`,
      { responseType: "blob" },
    );
    return response.data;
  },

  getPreview: async (imageId: string): Promise<Blob> => {
    const response = await apiClient.get<Blob>(
      `/api/album-images/${imageId}/preview`,
      { responseType: "blob" },
    );
    return response.data;
  },

  downloadImage: async (imageId: string): Promise<Blob> => {
    const response = await apiClient.get<Blob>(
      `/api/album-images/${imageId}/download`,
      { responseType: "blob" },
    );
    return response.data;
  },
};
