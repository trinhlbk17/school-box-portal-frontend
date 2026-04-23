import { useState } from "react";
import { useParams } from "react-router-dom";
import { Pencil, Trash2, GraduationCap, Users, ImageIcon, UserCog } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { PageHeader } from "@/shared/components/PageHeader";

import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { ClassFormSheet } from "@/features/class/components/ClassFormSheet";
import { TeacherListTab } from "@/features/class/components/TeacherListTab";
import { StudentListTab } from "@/features/student/components/StudentListTab";
import { useClass, useDeleteClass } from "@/features/class/hooks/useClasses";
import { useAuthStore } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";
import { ROLES } from "@/shared/constants/roles";
import { useNavigate } from "react-router-dom";
import { AlbumListTab } from "@/features/album/components/AlbumListTab";

export function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === ROLES.ADMIN;

  const { data: cls, isLoading, error } = useClass(id!);
  const deleteClass = useDeleteClass();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleConfirmDelete = async () => {
    await deleteClass.mutateAsync(id!);
    navigate(ROUTES.ADMIN.SCHOOLS);
  };

  if (error) {
    return (
      <ErrorAlert
        title="Failed to load class"
        message={(error as { message: string; statusCode?: number }).statusCode === 403
          ? "You don't have access to this class."
          : (error as { message: string }).message}
      />
    );
  }

  const teachers = cls?.classTeachers ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={isLoading ? "Loading..." : (cls?.name ?? "Class")}
        breadcrumbs={[
          { label: "Schools", href: ROUTES.ADMIN.SCHOOLS },
          { label: cls?.name ?? "Class" },
        ]}
        actions={
          isAdmin ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} disabled={isLoading}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={() => setIsDeleteOpen(true)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          ) : undefined
        }
      />

      {/* Class meta info */}
      {cls && (
        <div className="flex flex-wrap gap-3">
          {cls.grade && (
            <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
              <GraduationCap className="h-3.5 w-3.5" />
              Grade {cls.grade}
            </Badge>
          )}
          {cls.academicYear && (
            <Badge variant="outline" className="px-3 py-1">
              {cls.academicYear}
            </Badge>
          )}
          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
            <Users className="h-3.5 w-3.5" />
            {teachers.length} teacher{teachers.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="albums" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Albums
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="teachers" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Teachers
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="students" className="mt-4">
          <StudentListTab classId={id!} />
        </TabsContent>

        <TabsContent value="albums" className="mt-4">
          <AlbumListTab classId={id!} />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="teachers" className="mt-4">
            <TeacherListTab classId={id!} teachers={teachers} />
          </TabsContent>
        )}
      </Tabs>

      {/* Edit sheet */}
      {cls && (
        <ClassFormSheet
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          schoolId={cls.schoolId}
          class={cls}
        />
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Class"
        description={`Are you sure you want to permanently delete "${cls?.name}"? This cannot be undone. All associated student records and albums will be permanently removed.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={deleteClass.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
