import { useQuery } from "@tanstack/react-query";
import { albumApi } from "../api/albumApi";
import type { AlbumListParams } from "../types/album.types";

export const albumQueryKeys = {
  all: ["albums"] as const,
  lists: () => [...albumQueryKeys.all, "list"] as const,
  list: (classId: string, params?: AlbumListParams) =>
    [...albumQueryKeys.lists(), classId, params] as const,
  details: () => [...albumQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...albumQueryKeys.details(), id] as const,
  images: (albumId: string) => [...albumQueryKeys.all, "images", albumId] as const,
};

export function useAlbums(classId: string, params?: AlbumListParams) {
  return useQuery({
    queryKey: albumQueryKeys.list(classId, params),
    queryFn: () => albumApi.getAlbums(classId, params),
    enabled: !!classId,
  });
}

export function useAlbum(id: string) {
  return useQuery({
    queryKey: albumQueryKeys.detail(id),
    queryFn: () => albumApi.getAlbum(id),
    enabled: !!id,
  });
}

export function useAlbumImages(albumId: string) {
  return useQuery({
    queryKey: albumQueryKeys.images(albumId),
    queryFn: () => albumApi.getAlbumImages(albumId),
    enabled: !!albumId,
  });
}
