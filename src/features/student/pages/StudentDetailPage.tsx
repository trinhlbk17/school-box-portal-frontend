import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Pencil,
  Trash2,
  User,
  CalendarDays,
  Users,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { PageHeader } from "@/shared/components/PageHeader";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { StudentFormSheet } from "@/features/student/components/StudentFormSheet";
import { useStudent, useDeleteStudent } from "@/features/student/hooks/useStudents";
import { ProtectorList } from "@/features/protector/components/ProtectorList";
import { ROUTES } from "@/shared/constants/routes";
import { useAuthStore } from "@/features/auth";
import { ROLES } from "@/shared/constants/roles";

const GENDER_LABELS: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === ROLES.ADMIN;

  const { data: student, isLoading, error } = useStudent(id!);
  const deleteStudent = useDeleteStudent();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleConfirmDelete = async () => {
    if (!student) return;
    await deleteStudent.mutateAsync(student.id);
    // Navigate back to the class page after deletion
    if (student.classId) {
      navigate(ROUTES.ADMIN.CLASS_DETAIL(student.classId));
    } else {
      navigate(-1);
    }
  };

  if (error) {
    return (
      <ErrorAlert
        title="Failed to load student"
        message={(error as { message: string }).message}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isLoading ? "Loading..." : (student?.name ?? "Student")}
        description={
          student?.class
            ? `Class: ${student.class.name}${student.class.grade ? ` · Grade ${student.class.grade}` : ""}`
            : undefined
        }
        breadcrumbs={[
          {
            label: student?.class?.name ?? "Class",
            href: student?.classId
              ? ROUTES.ADMIN.CLASS_DETAIL(student.classId)
              : ROUTES.ADMIN.ROOT,
          },
          { label: student?.name ?? "Student" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFormOpen(true)}
              disabled={isLoading}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {isAdmin && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteOpen(true)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        }
      />

      {/* Info card */}
      {student && (
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-50">
              <User className="h-7 w-7 text-primary-600" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {student.name}
                </h2>
                {student.isActive ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-neutral-500">
                    Inactive
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-neutral-500">
                {student.gender && (
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {GENDER_LABELS[student.gender] ?? student.gender}
                  </span>
                )}
                {student.dateOfBirth && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(student.dateOfBirth).toLocaleDateString()}
                  </span>
                )}
                {student.class && (
                  <button
                    className="flex items-center gap-1.5 text-primary-600 hover:underline"
                    onClick={() =>
                      navigate(ROUTES.ADMIN.CLASS_DETAIL(student.classId))
                    }
                  >
                    <Users className="h-3.5 w-3.5" />
                    {student.class.name}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="protectors">
        <TabsList>
          <TabsTrigger value="protectors">Protectors</TabsTrigger>
        </TabsList>

        <TabsContent value="protectors" className="mt-6">
          <ProtectorList studentId={id!} />
        </TabsContent>
      </Tabs>

      {/* Edit sheet */}
      {student && (
        <StudentFormSheet
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          classId={student.classId}
          student={student}
        />
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Student"
        description={`Are you sure you want to permanently delete "${student?.name}"? This will remove all associated records and cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={deleteStudent.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
