import { useSearchParams } from "react-router-dom";

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  offset: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

export function usePagination(defaultPageSize: number = 10): UsePaginationReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageStr = searchParams.get("page");
  const pageSizeStr = searchParams.get("pageSize");

  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const pageSize = pageSizeStr ? parseInt(pageSizeStr, 10) : defaultPageSize;
  const offset = (page - 1) * pageSize;

  const setPage = (newPage: number) => {
    setSearchParams(
      (prev) => {
        prev.set("page", newPage.toString());
        return prev;
      },
      { replace: true }
    );
  };

  const setPageSize = (newPageSize: number) => {
    setSearchParams(
      (prev) => {
        prev.set("pageSize", newPageSize.toString());
        prev.set("page", "1"); // Reset to page 1 on page size change
        return prev;
      },
      { replace: true }
    );
  };

  return {
    page,
    pageSize,
    offset,
    setPage,
    setPageSize,
  };
}
