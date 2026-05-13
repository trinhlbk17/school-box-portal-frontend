import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import type { ColumnDef } from "@/shared/types/dataTable.types";
import { cn } from "@/shared/lib/utils";

interface DataTableProps<T extends { id: string }> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc" | null;
  onSort?: (columnId: string, direction: "asc" | "desc") => void;
  selectedRowIds?: string[];
  onRowSelect?: (selectedIds: string[]) => void;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  totalCount = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onSearch,
  searchPlaceholder = "Search...",
  sortBy,
  sortDirection,
  onSort,
  selectedRowIds = [],
  onRowSelect,
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  const safeData = Array.isArray(data) ? data : [];
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const isAllSelected = safeData.length > 0 && selectedRowIds.length === safeData.length;
  const isSomeSelected = selectedRowIds.length > 0 && selectedRowIds.length < safeData.length;

  const handleSelectAll = (checked: boolean) => {
    if (!onRowSelect) return;
    if (checked) {
      onRowSelect(safeData.map((item) => item.id));
    } else {
      onRowSelect([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (!onRowSelect) return;
    if (checked) {
      onRowSelect([...selectedRowIds, id]);
    } else {
      onRowSelect(selectedRowIds.filter((rowId) => rowId !== id));
    }
  };

  const handleSort = (columnId: string) => {
    if (!onSort) return;
    if (sortBy === columnId) {
      onSort(columnId, sortDirection === "asc" ? "desc" : "asc");
    } else {
      onSort(columnId, "asc");
    }
  };

  return (
    <div className="space-y-4">
      {onSearch && (
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-9"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      )}

      <div className="rounded-md border border-neutral-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50 hover:bg-neutral-50">
              {onRowSelect && (
                <TableHead className="w-12 text-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = isSomeSelected;
                      }
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead
                  key={col.id}
                  className={cn(
                    "text-xs font-semibold text-neutral-600 uppercase tracking-wider",
                    col.sortable && "cursor-pointer select-none"
                  )}
                  onClick={() => (col.sortable ? handleSort(col.id) : undefined)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortBy === col.id && (
                      sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  {onRowSelect && (
                    <TableCell className="w-12 text-center">
                      <Skeleton className="h-4 w-4 rounded" />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.id}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : safeData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onRowSelect ? 1 : 0)} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-neutral-500">
                    <p>No results found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              safeData.map((item) => {
                const isSelected = selectedRowIds.includes(item.id);
                return (
                  <TableRow
                    key={item.id}
                    className={cn(
                      "hover:bg-neutral-50 transition-colors",
                      isSelected && "bg-primary-50 hover:bg-primary-50"
                    )}
                  >
                    {onRowSelect && (
                      <TableCell className="w-12 text-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell key={col.id}>{col.cell(item)}</TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {onPageChange && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                // Simple pagination: show all if few, otherwise we'd need ellipsis logic
                // For MVP, just show all or limit to a window
                if (
                  totalPages <= 5 ||
                  p === 1 ||
                  p === totalPages ||
                  (p >= page - 1 && p <= page + 1)
                ) {
                  return (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => onPageChange(p)}
                      disabled={isLoading}
                    >
                      {p}
                    </Button>
                  );
                }
                if (p === 2 && page > 3) return <span key={p} className="text-neutral-400">...</span>;
                if (p === totalPages - 1 && page < totalPages - 2) return <span key={p} className="text-neutral-400">...</span>;
                return null;
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
