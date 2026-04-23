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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Loader2 } from "lucide-react";
import { studentSchema, type StudentFormValues } from "@/features/student/schemas/studentSchema";
import type { Student } from "@/features/student/types/student.types";
import { useCreateStudent, useUpdateStudent } from "@/features/student/hooks/useStudents";

interface StudentFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  student?: Student | null;
}

export function StudentFormSheet({
  isOpen,
  onClose,
  classId,
  student,
}: StudentFormSheetProps) {
  const isEdit = !!student;
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const isPending = createStudent.isPending || updateStudent.isPending;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: { name: "", dateOfBirth: "", gender: undefined },
  });

  const genderValue = watch("gender");

  useEffect(() => {
    if (isOpen) {
      reset({
        name: student?.name ?? "",
        dateOfBirth: student?.dateOfBirth
          ? student.dateOfBirth.substring(0, 10)
          : "",
        gender: student?.gender ?? undefined,
      });
    }
  }, [isOpen, student, reset]);

  const onSubmit = async (values: StudentFormValues) => {
    const payload = {
      name: values.name,
      ...(values.dateOfBirth ? { dateOfBirth: values.dateOfBirth } : {}),
      ...(values.gender ? { gender: values.gender } : {}),
    };

    if (isEdit && student) {
      await updateStudent.mutateAsync({ id: student.id, data: payload });
    } else {
      await createStudent.mutateAsync({ classId, ...payload });
    }
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Student" : "Add Student"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the student information below."
              : "Fill in the details to add a new student to this class."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-6">
          <div className="space-y-2">
            <Label htmlFor="student-name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="student-name"
              placeholder="e.g. Nguyen Van A"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-dob">Date of Birth</Label>
            <Input
              id="student-dob"
              type="date"
              {...register("dateOfBirth")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-gender">Gender</Label>
            <Select
              value={genderValue ?? ""}
              onValueChange={(val) =>
                setValue(
                  "gender",
                  val === "" ? undefined : (val as StudentFormValues["gender"])
                )
              }
            >
              <SelectTrigger id="student-gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SheetFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Student"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
