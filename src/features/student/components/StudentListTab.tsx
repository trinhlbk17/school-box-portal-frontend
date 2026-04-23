import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { DataTable } from "@/shared/components/DataTable";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { StudentFormSheet } from "@/features/student/components/StudentFormSheet";
import { useStudents } from "@/features/student/hooks/useStudents";
import type { Student } from "@/features/student/types/student.types";
import type { ColumnDef } from "@/shared/types/dataTable.types";
import { ROUTES } from "@/shared/constants/routes";
import { useAuthStore } from "@/features/auth";
import { ROLES } from "@/shared/constants/roles";

interface StudentListTabProps {
  classId: string;
}

const PAGE_SIZE = 20;

const GENDER_LABELS: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

export function StudentListTab({ classId }: StudentListTabProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const canManage =
    user?.role === ROLES.ADMIN || user?.role === ROLES.TEACHER;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading, error } = useStudents(classId, {
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
  });

  const students = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, []);

  const columns: ColumnDef<Student>[] = [
    {
      id: "name",
      header: "Name",
      cell: (student) => (
        <span className="font-medium text-neutral-900">{student.name}</span>
      ),
    },
    {
      id: "gender",
      header: "Gender",
      cell: (student) =>
        student.gender ? (
          <span className="text-neutral-600">
            {GENDER_LABELS[student.gender] ?? student.gender}
          </span>
        ) : (
          <span className="text-neutral-400">—</span>
        ),
    },
    {
      id: "dateOfBirth",
      header: "Date of Birth",
      cell: (student) =>
        student.dateOfBirth ? (
          <span className="text-neutral-600">
            {new Date(student.dateOfBirth).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-neutral-400">—</span>
        ),
    },
    {
      id: "status",
      header: "Status",
      cell: (student) =>
        student.isActive ? (
          <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
            Active
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-neutral-500">
            Inactive
          </Badge>
        ),
    },
    {
      id: "actions",
      header: "",
      cell: (student) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(ROUTES.ADMIN.STUDENT_DETAIL(student.id));
          }}
          className="text-primary-600 hover:text-primary-700"
        >
          View
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <ErrorAlert
        title="Failed to load students"
        message={(error as { message: string }).message}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {total} student{total !== 1 ? "s" : ""}
        </p>
        {canManage && (
          <Button size="sm" onClick={() => setIsFormOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        )}
      </div>

      {!isLoading && students.length === 0 && !search ? (
        <EmptyState
          title="No students yet"
          description="Add students to this class to get started."
          icon={<Users className="h-6 w-6 text-neutral-500" />}
          action={
            canManage
              ? { label: "Add Student", onClick: () => setIsFormOpen(true) }
              : undefined
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={students}
          isLoading={isLoading}
          totalCount={total}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          onSearch={handleSearch}
          searchPlaceholder="Search students..."
        />
      )}

      {canManage && (
        <StudentFormSheet
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          classId={classId}
        />
      )}
    </div>
  );
}
