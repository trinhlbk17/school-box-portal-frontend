import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Loader2 } from "lucide-react";
import { classSchema, type ClassFormValues } from "@/features/class/schemas/classSchema";
import type { Class } from "@/features/class/types/class.types";
import { useCreateClass, useUpdateClass } from "@/features/class/hooks/useClasses";

interface ClassFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId: string;
  class?: Class | null;
}

export function ClassFormSheet({
  isOpen,
  onClose,
  schoolId,
  class: cls,
}: ClassFormSheetProps) {
  const isEdit = !!cls;
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const isPending = createClass.isPending || updateClass.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: { name: "", grade: "", academicYear: "" },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: cls?.name ?? "",
        grade: cls?.grade ?? "",
        academicYear: cls?.academicYear ?? "",
      });
    }
  }, [isOpen, cls, reset]);

  const onSubmit = async (values: ClassFormValues) => {
    const payload = {
      name: values.name,
      ...(values.grade ? { grade: values.grade } : {}),
      ...(values.academicYear ? { academicYear: values.academicYear } : {}),
    };

    if (isEdit && cls) {
      await updateClass.mutateAsync({ id: cls.id, data: payload });
    } else {
      await createClass.mutateAsync({ schoolId, data: payload });
    }
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Class" : "Add Class"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the class information below."
              : "Fill in the details to create a new class."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-6">
          <div className="space-y-2">
            <Label htmlFor="class-name">
              Class Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="class-name"
              placeholder="e.g. 10A1"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="class-grade">Grade</Label>
            <Input
              id="class-grade"
              placeholder="e.g. 10"
              {...register("grade")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="class-year">Academic Year</Label>
            <Input
              id="class-year"
              placeholder="e.g. 2024-2025"
              {...register("academicYear")}
            />
          </div>

          <SheetFooter className="mt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Class"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
