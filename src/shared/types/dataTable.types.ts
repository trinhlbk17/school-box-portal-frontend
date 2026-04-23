import { ReactNode } from "react";

export interface ColumnDef<T> {
  id: string;
  header: string | ReactNode;
  cell: (item: T) => ReactNode;
  sortable?: boolean;
}
