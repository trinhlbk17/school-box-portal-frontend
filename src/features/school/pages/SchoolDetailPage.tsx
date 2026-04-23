import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  School as SchoolIcon,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { PageHeader } from "@/shared/components/PageHeader";
import { DataTable } from "@/shared/components/DataTable";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { SchoolFormSheet } from "@/features/school/components/SchoolFormSheet";
import { useSchool } from "@/features/school/hooks/useSchools";
import { ClassFormSheet } from "@/features/class/components/ClassFormSheet";
import {
  useClassesBySchool,
  useDeleteClass,
} from "@/features/class/hooks/useClasses";
import type { Class } from "@/features/class/types/class.types";
import { ROUTES } from "@/shared/constants/routes";
import type { ColumnDef } from "@/shared/types/dataTable.types";

export function SchoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: school, isLoading: schoolLoading, error: schoolError } = useSchool(id!);
  const { data: classes = [], isLoading: classesLoading } = useClassesBySchool(id!);
  const deleteClass = useDeleteClass();

  const [isSchoolSheetOpen, setIsSchoolSheetOpen] = useState(false);
  const [isClassSheetOpen, setIsClassSheetOpen] = useState(false);
  const [editClassTarget, setEditClassTarget] = useState<Class | null>(null);
  const [deleteClassTarget, setDeleteClassTarget] = useState<Class | null>(null);

  const handleEditClass = (cls: Class) => {
    setEditClassTarget(cls);
    setIsClassSheetOpen(true);
  };

  const handleClassSheetClose = () => {
    setIsClassSheetOpen(false);
    setEditClassTarget(null);
  };

  const handleConfirmDeleteClass = async () => {
    if (!deleteClassTarget) return;
    await deleteClass.mutateAsync(deleteClassTarget.id);
    setDeleteClassTarget(null);
  };

  const classColumns: ColumnDef<Class>[] = [
    {
      id: "name",
      header: "Class Name",
      sortable: true,
      cell: (row) => (
        <button
          className="font-medium text-primary-700 hover:underline text-left"
          onClick={() => navigate(ROUTES.ADMIN.CLASS_DETAIL(row.id))}
        >
          {row.name}
        </button>
      ),
    },
    {
      id: "grade",
      header: "Grade",
      cell: (row) =>
        row.grade ? <Badge variant="secondary">{row.grade}</Badge> : <span className="text-neutral-400">—</span>,
    },
    {
      id: "academicYear",
      header: "Academic Year",
      cell: (row) => (
        <span className="text-neutral-600">{row.academicYear ?? "—"}</span>
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
            onClick={() => handleEditClass(row)}
            aria-label={`Edit ${row.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setDeleteClassTarget(row)}
            aria-label={`Delete ${row.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (schoolError) {
    return <ErrorAlert title="Failed to load school" message={(schoolError as { message: string }).message} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={schoolLoading ? "Loading..." : (school?.name ?? "School")}
        description="Manage classes and school settings."
        breadcrumbs={[
          { label: "Schools", href: ROUTES.ADMIN.SCHOOLS },
          { label: school?.name ?? "School" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsSchoolSheetOpen(true)}
              disabled={schoolLoading}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit School
            </Button>
          </div>
        }
      />

      {/* School info card */}
      {school && (
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
              <SchoolIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-semibold text-neutral-900">{school.name}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                {school.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {school.address}
                  </span>
                )}
                {school.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {school.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Classes section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-800">Classes</h2>
          <Button onClick={() => setIsClassSheetOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>

        {!classesLoading && classes.length === 0 ? (
          <EmptyState
            title="No classes yet"
            description="Add the first class to this school."
            icon={<BookOpen className="h-6 w-6 text-neutral-500" />}
            action={{ label: "Add Class", onClick: () => setIsClassSheetOpen(true) }}
          />
        ) : (
          <DataTable
            columns={classColumns}
            data={classes}
            isLoading={classesLoading}
            totalCount={classes.length}
            searchPlaceholder="Search classes..."
          />
        )}
      </div>

      {/* School edit sheet */}
      <SchoolFormSheet
        isOpen={isSchoolSheetOpen}
        onClose={() => setIsSchoolSheetOpen(false)}
        school={school}
      />

      {/* Class form sheet */}
      <ClassFormSheet
        isOpen={isClassSheetOpen}
        onClose={handleClassSheetClose}
        schoolId={id!}
        class={editClassTarget}
      />

      {/* Delete class confirm */}
      <ConfirmDialog
        isOpen={!!deleteClassTarget}
        title="Delete Class"
        description={`Are you sure you want to permanently delete "${deleteClassTarget?.name}"? This cannot be undone. All associated student records and albums will be permanently removed.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={deleteClass.isPending}
        onConfirm={handleConfirmDeleteClass}
        onClose={() => setDeleteClassTarget(null)}
      />
    </div>
  );
}
