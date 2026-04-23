import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Loader2 } from "lucide-react";
import { useAssignProtector } from "@/features/protector/hooks/useProtectors";
import type { Relationship } from "@/features/protector/types/protector.types";

const assignProtectorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  relationship: z.enum(["PARENT", "GUARDIAN", "SIBLING", "OTHER"]),
});

type AssignProtectorFormValues = z.infer<typeof assignProtectorSchema>;

interface AssignProtectorDialogProps {
  isOpen: boolean;
  studentId: string;
  onClose: () => void;
}

const RELATIONSHIP_OPTIONS: { value: Relationship; label: string }[] = [
  { value: "PARENT", label: "Parent" },
  { value: "GUARDIAN", label: "Guardian" },
  { value: "SIBLING", label: "Sibling" },
  { value: "OTHER", label: "Other" },
];

export function AssignProtectorDialog({
  isOpen,
  studentId,
  onClose,
}: AssignProtectorDialogProps) {
  const assignProtector = useAssignProtector(studentId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AssignProtectorFormValues>({
    resolver: zodResolver(assignProtectorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      relationship: "PARENT",
    },
  });

  const relationshipValue = watch("relationship");

  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        email: "",
        phone: "",
        relationship: "PARENT",
      });
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (values: AssignProtectorFormValues) => {
    await assignProtector.mutateAsync({
      name: values.name,
      email: values.email,
      phone: values.phone || undefined,
      relationship: values.relationship,
    });
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !assignProtector.isPending && handleClose()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Protector</DialogTitle>
          <DialogDescription>
            Create a new protector account and assign them to this student.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="protector-name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="protector-name"
              placeholder="e.g. Nguyen Thi B"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="protector-email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="protector-email"
              type="email"
              placeholder="e.g. parent@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="protector-phone">Phone</Label>
            <Input
              id="protector-phone"
              type="tel"
              placeholder="e.g. 0901234567"
              {...register("phone")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="protector-relationship">
              Relationship <span className="text-red-500">*</span>
            </Label>
            <Select
              value={relationshipValue}
              onValueChange={(val) =>
                setValue("relationship", val as Relationship)
              }
            >
              <SelectTrigger id="protector-relationship">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIP_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.relationship && (
              <p className="text-xs text-red-500">
                {errors.relationship.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={assignProtector.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={assignProtector.isPending}>
              {assignProtector.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Assign Protector
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
