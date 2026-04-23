import { useQuery } from "@tanstack/react-query";
import { auditApi } from "@/features/audit/api/auditApi";
import type { AlbumDownloadLogsParams } from "@/features/audit/types/audit.types";

export const albumDownloadLogKeys = {
  all: ["albumDownloadLogs"] as const,
  album: (albumId: string, params?: AlbumDownloadLogsParams) =>
    [...albumDownloadLogKeys.all, albumId, params] as const,
};

export function useAlbumDownloadLogs(
  albumId: string,
  params?: AlbumDownloadLogsParams
) {
  return useQuery({
    queryKey: albumDownloadLogKeys.album(albumId, params),
    queryFn: () => auditApi.getAlbumDownloadLogs(albumId, params),
    enabled: !!albumId,
  });
}
