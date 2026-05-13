import { useMutation, useQueryClient } from "@tanstack/react-query";
import { albumApi } from "../api/albumApi";
import { albumQueryKeys } from "./useAlbums";
import { toast } from "sonner";

export function useUploadImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      albumId,
      files,
      onUploadProgress,
    }: {
      albumId: string;
      files: File[];
      onUploadProgress?: (progressEvent: unknown) => void;
    }) => albumApi.uploadImages(albumId, files, onUploadProgress),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: albumQueryKeys.images(variables.albumId),
      });
      queryClient.invalidateQueries({
        queryKey: albumQueryKeys.detail(variables.albumId),
      });
    },
    onError: (error: unknown) => {
      toast.error("Upload Failed", {
        description: error instanceof Error ? error.message : "Failed to upload images.",
      });
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId }: { imageId: string; albumId: string }) =>
      albumApi.deleteImage(imageId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: albumQueryKeys.images(variables.albumId),
      });
      // Optionally update the album detail if image count changes, though backend might handle it
      queryClient.invalidateQueries({
        queryKey: albumQueryKeys.detail(variables.albumId),
      });
    },
  });
}
