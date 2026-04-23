import { useMutation, useQueryClient } from "@tanstack/react-query";
import { albumApi } from "../api/albumApi";
import { albumQueryKeys } from "./useAlbums";

export function usePublishAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; classId: string }) =>
      albumApi.publishAlbum(id),
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

export function useArchiveAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; classId: string }) =>
      albumApi.archiveAlbum(id),
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
