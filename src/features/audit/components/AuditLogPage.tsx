import { useState } from "react";
import { Filter } from "lucide-react";
import { PageHeader } from "@/shared/components/PageHeader";
import { DataTable } from "@/shared/components/DataTable";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useAuditLogs } from "@/features/audit/hooks/useAuditLogs";
import { LOG_TYPES, type AuditLog, type LogType } from "@/features/audit/types/audit.types";
import type { ColumnDef } from "@/shared/types/dataTable.types";

const LOG_TYPE_LABELS: Record<LogType, string> = {
  LOGIN: "Login",
  FILE_VIEW: "File View",
  FILE_UPLOAD: "File Upload",
  FILE_DOWNLOAD: "File Download",
  ALBUM_DOWNLOAD: "Album Download",
  CLASS_TRANSFER: "Class Transfer",
  CLASS_PROMOTION: "Class Promotion",
};

const LOG_TYPE_COLORS: Record<LogType, string> = {
  LOGIN: "bg-blue-100 text-blue-700",
  FILE_VIEW: "bg-neutral-100 text-neutral-700",
  FILE_UPLOAD: "bg-green-100 text-green-700",
  FILE_DOWNLOAD: "bg-purple-100 text-purple-700",
  ALBUM_DOWNLOAD: "bg-violet-100 text-violet-700",
  CLASS_TRANSFER: "bg-orange-100 text-orange-700",
  CLASS_PROMOTION: "bg-teal-100 text-teal-700",
};

const PAGE_SIZE = 10;

export function AuditLogPage() {
  const [page, setPage] = useState(1);
  const [logType, setLogType] = useState<LogType | "">("");
  const [userId, setUserId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data, isLoading, error } = useAuditLogs({
    logType: logType || undefined,
    userId: userId || undefined,
    from: from || undefined,
    to: to || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const logs = data?.data ?? [];
  const total = data?.meta.total ?? 0;

  const handleFilterChange = () => {
    setPage(1);
  };

  const columns: ColumnDef<AuditLog>[] = [
    {
      id: "createdAt",
      header: "Timestamp",
      cell: (row) => (
        <span className="text-sm text-neutral-600 whitespace-nowrap">
          {new Date(row.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      id: "user",
      header: "User",
      cell: (row) => (
        <div>
          <p className="text-sm font-medium text-neutral-900">{row.userName}</p>
          <p className="text-xs text-neutral-500">{row.userEmail}</p>
        </div>
      ),
    },
    {
      id: "logType",
      header: "Action",
      cell: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${LOG_TYPE_COLORS[row.logType]}`}
        >
          {LOG_TYPE_LABELS[row.logType]}
        </span>
      ),
    },
    {
      id: "target",
      header: "Target",
      cell: (row) => (
        <span className="text-sm text-neutral-600">{row.target ?? "—"}</span>
      ),
    },
    {
      id: "details",
      header: "Details",
      cell: (row) => (
        <span className="text-sm text-neutral-600 max-w-xs truncate block">
          {row.details ?? "—"}
        </span>
      ),
    },
  ];

  if (error) {
    return (
      <ErrorAlert
        title="Failed to load audit logs"
        message={(error as { message: string }).message}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Monitor all system activity and user actions."
      />

      {/* Filter Toolbar */}
      <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <Filter className="h-4 w-4" />
          Filters
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Log Type */}
          <div className="space-y-1.5">
            <Label htmlFor="audit-logtype">Action Type</Label>
            <Select
              value={logType}
              onValueChange={(val) => {
                setLogType(val as LogType | "");
                handleFilterChange();
              }}
            >
              <SelectTrigger id="audit-logtype">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All types</SelectItem>
                {Object.entries(LOG_TYPES).map(([key, val]) => (
                  <SelectItem key={key} value={val}>
                    {LOG_TYPE_LABELS[val]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* User ID */}
          <div className="space-y-1.5">
            <Label htmlFor="audit-userid">User ID</Label>
            <Input
              id="audit-userid"
              placeholder="Filter by user ID..."
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                handleFilterChange();
              }}
            />
          </div>

          {/* From Date */}
          <div className="space-y-1.5">
            <Label htmlFor="audit-from">From</Label>
            <Input
              id="audit-from"
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                handleFilterChange();
              }}
            />
          </div>

          {/* To Date */}
          <div className="space-y-1.5">
            <Label htmlFor="audit-to">To</Label>
            <Input
              id="audit-to"
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                handleFilterChange();
              }}
            />
          </div>
        </div>

        {/* Active filter badges */}
        {(logType || userId || from || to) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {logType && (
              <Badge variant="secondary" className="gap-1">
                Type: {LOG_TYPE_LABELS[logType]}
                <button
                  className="ml-1 text-neutral-500 hover:text-neutral-700"
                  onClick={() => { setLogType(""); handleFilterChange(); }}
                  aria-label="Clear type filter"
                >
                  ×
                </button>
              </Badge>
            )}
            {userId && (
              <Badge variant="secondary" className="gap-1">
                User: {userId}
                <button
                  className="ml-1 text-neutral-500 hover:text-neutral-700"
                  onClick={() => { setUserId(""); handleFilterChange(); }}
                  aria-label="Clear user filter"
                >
                  ×
                </button>
              </Badge>
            )}
            {from && (
              <Badge variant="secondary" className="gap-1">
                From: {from}
                <button
                  className="ml-1 text-neutral-500 hover:text-neutral-700"
                  onClick={() => { setFrom(""); handleFilterChange(); }}
                  aria-label="Clear from date filter"
                >
                  ×
                </button>
              </Badge>
            )}
            {to && (
              <Badge variant="secondary" className="gap-1">
                To: {to}
                <button
                  className="ml-1 text-neutral-500 hover:text-neutral-700"
                  onClick={() => { setTo(""); handleFilterChange(); }}
                  aria-label="Clear to date filter"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={logs}
        isLoading={isLoading}
        totalCount={total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}
