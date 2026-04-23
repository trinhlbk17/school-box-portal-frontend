import { useQuery } from "@tanstack/react-query";
import { auditApi } from "@/features/audit/api/auditApi";
import type { AuditQueryParams } from "@/features/audit/types/audit.types";

export const auditKeys = {
  all: ["audit"] as const,
  logs: () => [...auditKeys.all, "logs"] as const,
  logList: (params?: AuditQueryParams) =>
    [...auditKeys.logs(), params] as const,
};

export function useAuditLogs(params?: AuditQueryParams) {
  return useQuery({
    queryKey: auditKeys.logList(params),
    queryFn: () => auditApi.getLogs(params),
  });
}
