import { apiClient } from "@/shared/lib/apiClient";
import type {
  AuditLog,
  AuditQueryParams,
  AlbumDownloadLog,
  AlbumDownloadLogsParams,
} from "@/features/audit/types/audit.types";
import type { PaginatedResponse } from "@/shared/types/api.types";

export const auditApi = {
  getLogs: async (
    params?: AuditQueryParams
  ): Promise<PaginatedResponse<AuditLog>> => {
    const response = await apiClient.get<PaginatedResponse<AuditLog>>(
      "/audit/logs",
      { params }
    );
    return response.data;
  },

  getAlbumDownloadLogs: async (
    albumId: string,
    params?: AlbumDownloadLogsParams
  ): Promise<PaginatedResponse<AlbumDownloadLog>> => {
    const response = await apiClient.get<PaginatedResponse<AlbumDownloadLog>>(
      `/audit/download-logs/album/${albumId}`,
      { params }
    );
    return response.data;
  },
};
