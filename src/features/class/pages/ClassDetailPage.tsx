import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Pencil, Trash2, GraduationCap, Users, ImageIcon, UserCog, UserPlus, Star, LayoutDashboard } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { PageHeader } from "@/shared/components/PageHeader";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { FeatureErrorBoundary } from "@/shared/components/FeatureErrorBoundary";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { ClassFormSheet } from "@/features/class/components/ClassFormSheet";
import { StudentListTab } from "@/features/student/components/StudentListTab";
import { AlbumListTab } from "@/features/album/components/AlbumListTab";
import { useClass, useDeleteClass, useRemoveTeacher } from "@/features/class/hooks/useClasses";
import { useAuthStore } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";
import { ROLES } from "@/shared/constants/roles";
import { useDelayedLoading } from "@/shared/hooks/useDelayedLoading";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/cn";
import { AssignTeacherDialog } from "@/features/class/components/AssignTeacherDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import type { ClassTeacher } from "@/features/class/types/class.types";

export function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "detail";

  const { user } = useAuthStore();
  const isAdmin = user?.role === ROLES.ADMIN;

  const { data: cls, isLoading, error } = useClass(id!);
  const showLoading = useDelayedLoading(isLoading, 300);
  const deleteClass = useDeleteClass();
  const removeTeacher = useRemoveTeacher();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<ClassTeacher | null>(null);

  const handleConfirmDelete = async () => {
    await deleteClass.mutateAsync(id!);
    navigate(ROUTES.ADMIN.SCHOOLS);
  };

  const handleConfirmRemoveTeacher = async () => {
    if (!removeTarget) return;
    await removeTeacher.mutateAsync({ classId: id!, userId: removeTarget.userId });
    setRemoveTarget(null);
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
      />

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-1 md:border-r md:pr-4 md:min-h-[500px]">
          <button
            onClick={() => setSearchParams({ tab: "detail" })}
            className={cn(
              "flex items-center gap-2 text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              currentTab === "detail"
                ? "bg-primary-50 text-primary-700"
                : "text-neutral-600 hover:bg-neutral-50"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Class Detail
          </button>
          <button
            onClick={() => setSearchParams({ tab: "students" })}
            className={cn(
              "flex items-center gap-2 text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              currentTab === "students"
                ? "bg-primary-50 text-primary-700"
                : "text-neutral-600 hover:bg-neutral-50"
            )}
          >
            <Users className="h-4 w-4" />
            Students
          </button>
          <button
            onClick={() => setSearchParams({ tab: "albums" })}
            className={cn(
              "flex items-center gap-2 text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              currentTab === "albums"
                ? "bg-primary-50 text-primary-700"
                : "text-neutral-600 hover:bg-neutral-50"
            )}
          >
            <ImageIcon className="h-4 w-4" />
            Albums
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {currentTab === "detail" && (
            <div className="space-y-8">
              {/* Class Meta Info */}
              <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                  <h2 className="text-lg font-semibold text-neutral-900">Class Information</h2>
                  {isAdmin && (
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
                  )}
                </div>
                <div className="p-6">
                  {showLoading ? (
                    <div className="flex flex-wrap gap-3">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  ) : cls && (
                    <div className="flex flex-wrap gap-3">
                      {cls.grade && (
                        <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm font-medium">
                          <GraduationCap className="h-3.5 w-3.5" />
                          Grade {cls.grade}
                        </Badge>
                      )}
                      {cls.academicYear && (
                        <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
                          {cls.academicYear}
                        </Badge>
                      )}
                      <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-sm font-medium">
                        <Users className="h-3.5 w-3.5" />
                        {teachers.length} teacher{teachers.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Teachers List */}
              {isAdmin && (
                <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                    <div className="flex items-center gap-2">
                      <UserCog className="h-5 w-5 text-neutral-500" />
                      <h2 className="text-lg font-semibold text-neutral-900">Teachers</h2>
                    </div>
                    <Button size="sm" onClick={() => setIsAssignOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign Teacher
                    </Button>
                  </div>
                  <div className="p-6">
                    {teachers.length === 0 ? (
                      <EmptyState
                        title="No teachers assigned"
                        description="Assign a teacher to this class to manage students and albums."
                        action={{ label: "Assign Teacher", onClick: () => setIsAssignOpen(true) }}
                      />
                    ) : (
                      <div className="rounded-md border border-neutral-200 divide-y divide-neutral-100 bg-white">
                        {teachers.map((ct) => {
                          const name = ct.user?.name ?? ct.userId;
                          const email = ct.user?.email ?? "";
                          return (
                            <div key={ct.id} className="flex items-center gap-3 px-4 py-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700 uppercase">
                                {name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm text-neutral-900 truncate">{name}</p>
                                  {ct.isHomeroom && (
                                    <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
                                      <Star className="h-3 w-3" />
                                      Homeroom
                                    </Badge>
                                  )}
                                </div>
                                {email && (
                                  <p className="text-xs text-neutral-400 truncate">{email}</p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                                onClick={() => setRemoveTarget(ct)}
                                aria-label={`Remove ${name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentTab === "students" && (
            <FeatureErrorBoundary>
              <StudentListTab classId={id!} />
            </FeatureErrorBoundary>
          )}

          {currentTab === "albums" && (
            <FeatureErrorBoundary>
              <AlbumListTab classId={id!} />
            </FeatureErrorBoundary>
          )}
        </div>
      </div>

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

      <AssignTeacherDialog
        isOpen={isAssignOpen}
        classId={id!}
        existingTeachers={teachers}
        onClose={() => setIsAssignOpen(false)}
      />

      <ConfirmDialog
        isOpen={!!removeTarget}
        title="Remove Teacher"
        description={`Remove "${removeTarget?.user?.name ?? removeTarget?.userId}" from this class? They will lose access to class data.`}
        confirmLabel="Remove"
        variant="destructive"
        isLoading={removeTeacher.isPending}
        onConfirm={handleConfirmRemoveTeacher}
        onClose={() => setRemoveTarget(null)}
      />
    </div>
  );
}
