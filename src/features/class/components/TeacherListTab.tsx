import { useState } from "react";
import { UserPlus, Trash2, Star } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { EmptyState } from "@/shared/components/EmptyState";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { AssignTeacherDialog } from "@/features/class/components/AssignTeacherDialog";
import { useRemoveTeacher } from "@/features/class/hooks/useClasses";
import type { ClassTeacher } from "@/features/class/types/class.types";

interface TeacherListTabProps {
  classId: string;
  teachers: ClassTeacher[];
}

export function TeacherListTab({ classId, teachers }: TeacherListTabProps) {
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<ClassTeacher | null>(null);
  const removeTeacher = useRemoveTeacher();

  const handleConfirmRemove = async () => {
    if (!removeTarget) return;
    await removeTeacher.mutateAsync({ classId, userId: removeTarget.userId });
    setRemoveTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {teachers.length} teacher{teachers.length !== 1 ? "s" : ""} assigned
        </p>
        <Button size="sm" onClick={() => setIsAssignOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {teachers.length === 0 ? (
        <EmptyState
          title="No teachers assigned"
          description="Assign a teacher to this class to manage students and albums."
          action={{ label: "Add Teacher", onClick: () => setIsAssignOpen(true) }}
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

      <AssignTeacherDialog
        isOpen={isAssignOpen}
        classId={classId}
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
        onConfirm={handleConfirmRemove}
        onClose={() => setRemoveTarget(null)}
      />
    </div>
  );
}
