export const LOG_TYPES = {
  LOGIN: "LOGIN",
  FILE_VIEW: "FILE_VIEW",
  FILE_UPLOAD: "FILE_UPLOAD",
  FILE_DOWNLOAD: "FILE_DOWNLOAD",
  ALBUM_DOWNLOAD: "ALBUM_DOWNLOAD",
  CLASS_TRANSFER: "CLASS_TRANSFER",
  CLASS_PROMOTION: "CLASS_PROMOTION",
} as const;

export type LogType = (typeof LOG_TYPES)[keyof typeof LOG_TYPES];

export interface AuditLog {
  id: string;
  logType: LogType;
  userId: string;
  userName: string;
  userEmail: string;
  target?: string;
  details?: string;
  createdAt: string;
}

export interface AuditQueryParams {
  logType?: LogType;
  userId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface AlbumDownloadLog {
  id: string;
  albumId: string;
  userId: string;
  userName: string;
  userEmail: string;
  downloadedAt: string;
}

export interface AlbumDownloadLogsParams {
  page?: number;
  limit?: number;
}
