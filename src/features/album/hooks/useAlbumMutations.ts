import { useMutation, useQueryClient } from "@tanstack/react-query";
import { albumApi } from "../api/albumApi";
import { CreateAlbumInput, UpdateAlbumInput } from "../types/album.types";
import { albumQueryKeys } from "./useAlbums";

export function useCreateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAlbumInput) => albumApi.createAlbum(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: albumQueryKeys.list(variables.classId),
      });
    },
  });
}

export function useUpdateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAlbumInput }) =>
      albumApi.updateAlbum(id, data),
    onSuccess: (updatedAlbum) => {
      queryClient.invalidateQueries({
        queryKey: albumQueryKeys.detail(updatedAlbum.id),
      });
      queryClient.invalidateQueries({
        queryKey: albumQueryKeys.list(updatedAlbum.classId),
      });
    },
  });
}

export function useDeleteAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; classId: string }) =>
      albumApi.deleteAlbum(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: albumQueryKeys.list(variables.classId),
      });
      // Optionally remove the detail cache
      queryClient.removeQueries({
        queryKey: albumQueryKeys.detail(variables.id),
      });
    },
  });
}
