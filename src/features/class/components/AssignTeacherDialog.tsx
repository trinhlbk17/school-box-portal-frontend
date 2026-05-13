import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Loader2, Search, UserCheck } from "lucide-react";
import { useTeacherUsers } from "@/features/class/hooks/useTeacherUsers";
import { useAssignTeacher } from "@/features/class/hooks/useClasses";
import type { ClassTeacher } from "@/features/class/types/class.types";
import { cn } from "@/shared/lib/cn";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/features/user/api/userApi";
import { ROLES } from "@/shared/constants/roles";

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
  const [activeTab, setActiveTab] = useState("select");
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isHomeroom, setIsHomeroom] = useState(false);

  // For Create New
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");

  const { data: teachers = [], isLoading } = useTeacherUsers();
  const assignTeacher = useAssignTeacher();
  const queryClient = useQueryClient();

  const createTeacher = useMutation({
    mutationFn: async () => {
      return userApi.createUser({
        email: newEmail,
        password: newPassword,
        name: newName,
        role: ROLES.TEACHER,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users", "teachers"] });
      setSelectedUserId(data.id);
      setNewEmail("");
      setNewPassword("");
      setNewName("");
      setActiveTab("select");
    },
  });

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
    setActiveTab("select");
    setNewEmail("");
    setNewPassword("");
    setNewName("");
    onClose();
  };

  const handleAssign = async () => {
    if (!selectedUserId) return;
    try {
      await assignTeacher.mutateAsync({
        classId,
        data: { userId: selectedUserId, isHomeroom },
      });
      handleClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCreate = async () => {
    if (!newEmail || !newPassword || !newName) return;
    try {
      await createTeacher.mutateAsync();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !assignTeacher.isPending && !createTeacher.isPending && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Teacher</DialogTitle>
          <DialogDescription>
            Select an existing teacher or create a new one.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Select Existing</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="space-y-4 py-2">
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
            <div className="flex items-center gap-2 pt-2">
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
            <DialogFooter className="pt-2">
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
          </TabsContent>

          <TabsContent value="create" className="space-y-4 py-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Name</Label>
                <Input
                  id="new-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="John Doe"
                  disabled={createTeacher.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="john@example.com"
                  disabled={createTeacher.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  disabled={createTeacher.isPending}
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={handleClose} disabled={createTeacher.isPending}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!newEmail || !newName || !newPassword || createTeacher.isPending}
              >
                {createTeacher.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create & Select
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
