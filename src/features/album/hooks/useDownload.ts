import { useMutation } from "@tanstack/react-query";
import { albumApi } from "../api/albumApi";
import { toast } from "sonner";

export function useDownloadImage() {
  return useMutation({
    mutationFn: async ({
      imageId,
      filename,
    }: {
      imageId: string;
      filename: string;
    }) => {
      const blob = await albumApi.downloadImage(imageId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    onError: (error: unknown) => {
      toast.error("Download Failed", {
        description: error instanceof Error ? error.message : "Failed to download the image.",
      });
    },
  });
}

export function useDownloadAlbumZip() {
  return useMutation({
    mutationFn: async ({
      albumId,
      filename,
    }: {
      albumId: string;
      filename: string;
    }) => {
      const blob = await albumApi.downloadAlbumZip(albumId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    onError: (error: unknown) => {
      toast.error("Download Failed", {
        description: error instanceof Error ? error.message : "Failed to download the album ZIP.",
      });
    },
  });
}
