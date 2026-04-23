import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, School as SchoolIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { PageHeader } from "@/shared/components/PageHeader";
import { DataTable } from "@/shared/components/DataTable";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { SchoolFormSheet } from "@/features/school/components/SchoolFormSheet";
import { useSchools, useDeleteSchool } from "@/features/school/hooks/useSchools";
import type { School } from "@/features/school/types/school.types";
import { ROUTES } from "@/shared/constants/routes";
import type { ColumnDef } from "@/shared/types/dataTable.types";

export function SchoolListPage() {
  const navigate = useNavigate();
  const { data: schools = [], isLoading, error } = useSchools();
  const deleteSchool = useDeleteSchool();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<School | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<School | null>(null);

  const canCreate = schools.length === 0;

  const handleEdit = (school: School) => {
    setEditTarget(school);
    setIsSheetOpen(true);
  };

  const handleDelete = (school: School) => {
    setDeleteTarget(school);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteSchool.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setEditTarget(null);
  };

  const columns: ColumnDef<School>[] = [
    {
      id: "name",
      header: "Name",
      sortable: true,
      cell: (row) => (
        <button
          className="font-medium text-primary-700 hover:underline text-left"
          onClick={() => navigate(ROUTES.ADMIN.SCHOOL_DETAIL(row.id))}
        >
          {row.name}
        </button>
      ),
    },
    {
      id: "address",
      header: "Address",
      cell: (row) => (
        <span className="text-neutral-600">{row.address ?? "—"}</span>
      ),
    },
    {
      id: "phone",
      header: "Phone",
      cell: (row) => (
        <span className="text-neutral-600">{row.phone ?? "—"}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row)}
            aria-label={`Edit ${row.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleDelete(row)}
            aria-label={`Delete ${row.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return <ErrorAlert title="Failed to load schools" message={(error as { message: string }).message} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schools"
        description="Manage school information and classes."
        actions={
          <Button
            onClick={() => setIsSheetOpen(true)}
            disabled={!canCreate}
            title={!canCreate ? "Only one school is allowed in this MVP" : undefined}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </Button>
        }
      />

      {!isLoading && schools.length === 0 ? (
        <EmptyState
          title="No school yet"
          description="Create your school to get started managing classes and students."
          icon={<SchoolIcon className="h-6 w-6 text-neutral-500" />}
          action={{ label: "Add School", onClick: () => setIsSheetOpen(true) }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={schools}
          isLoading={isLoading}
          totalCount={schools.length}
          searchPlaceholder="Search schools..."
        />
      )}

      <SchoolFormSheet
        isOpen={isSheetOpen}
        onClose={handleSheetClose}
        school={editTarget}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete School"
        description={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone. All associated classes and data will be permanently removed.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={deleteSchool.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
