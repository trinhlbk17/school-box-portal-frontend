import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Loader2, Search, UserCheck } from "lucide-react";
import { useTeacherUsers } from "@/features/class/hooks/useTeacherUsers";
import { useAssignTeacher } from "@/features/class/hooks/useClasses";
import type { ClassTeacher } from "@/features/class/types/class.types";
import { cn } from "@/shared/lib/cn";

interface AssignTeacherDialogProps {
  isOpen: boolean;
  classId: string;
  existingTeachers: ClassTeacher[];
  onClose: () => void;
}

export function AssignTeacherDialog({
  isOpen,
  classId,
  existingTeachers,
  onClose,
}: AssignTeacherDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isHomeroom, setIsHomeroom] = useState(false);

  const { data: teachers = [], isLoading } = useTeacherUsers();
  const assignTeacher = useAssignTeacher();

  const assignedIds = new Set(existingTeachers.map((ct) => ct.userId));

  const filtered = teachers.filter(
    (t) =>
      !assignedIds.has(t.id) &&
      (t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleClose = () => {
    setSearch("");
    setSelectedUserId(null);
    setIsHomeroom(false);
    onClose();
  };

  const handleAssign = async () => {
    if (!selectedUserId) return;
    await assignTeacher.mutateAsync({
      classId,
      data: { userId: selectedUserId, isHomeroom },
    });
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !assignTeacher.isPending && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Teacher</DialogTitle>
          <DialogDescription>
            Select a teacher to assign to this class.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Teacher list */}
          <div className="max-h-60 overflow-y-auto rounded-md border border-neutral-200 divide-y divide-neutral-100">
            {isLoading ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-center text-sm text-neutral-500">
                {search ? "No teachers match your search." : "All available teachers are already assigned."}
              </div>
            ) : (
              filtered.map((teacher) => (
                <button
                  key={teacher.id}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors",
                    selectedUserId === teacher.id
                      ? "bg-primary-50 text-primary-700"
                      : "hover:bg-neutral-50 text-neutral-700"
                  )}
                  onClick={() => setSelectedUserId(teacher.id)}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-600 uppercase">
                    {teacher.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{teacher.name}</p>
                    <p className="text-xs text-neutral-400 truncate">{teacher.email}</p>
                  </div>
                  {selectedUserId === teacher.id && (
                    <UserCheck className="h-4 w-4 text-primary-600 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Homeroom toggle */}
          <div className="flex items-center gap-2">
            <input
              id="assign-homeroom"
              type="checkbox"
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              checked={isHomeroom}
              onChange={(e) => setIsHomeroom(e.target.checked)}
            />
            <Label htmlFor="assign-homeroom" className="text-sm cursor-pointer">
              Set as Homeroom Teacher
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={assignTeacher.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedUserId || assignTeacher.isPending}
          >
            {assignTeacher.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign Teacher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
