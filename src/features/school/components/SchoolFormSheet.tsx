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
import { schoolSchema, type SchoolFormValues } from "@/features/school/schemas/schoolSchema";
import type { School } from "@/features/school/types/school.types";
import {
  useCreateSchool,
  useUpdateSchool,
} from "@/features/school/hooks/useSchools";

interface SchoolFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  school?: School | null;
}

export function SchoolFormSheet({ isOpen, onClose, school }: SchoolFormSheetProps) {
  const isEdit = !!school;
  const createSchool = useCreateSchool();
  const updateSchool = useUpdateSchool();
  const isPending = createSchool.isPending || updateSchool.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      parentBoxFolderId: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: school?.name ?? "",
        address: school?.address ?? "",
        phone: school?.phone ?? "",
        parentBoxFolderId: "",
      });
    }
  }, [isOpen, school, reset]);

  const onSubmit = async (values: SchoolFormValues) => {
    const payload = {
      name: values.name,
      ...(values.address ? { address: values.address } : {}),
      ...(values.phone ? { phone: values.phone } : {}),
      ...(values.parentBoxFolderId ? { parentBoxFolderId: values.parentBoxFolderId } : {}),
    };

    if (isEdit && school) {
      await updateSchool.mutateAsync({ id: school.id, data: payload });
    } else {
      await createSchool.mutateAsync(payload);
    }
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit School" : "Add School"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the school information below."
              : "Fill in the details to create a new school."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-6">
          <div className="space-y-2">
            <Label htmlFor="school-name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="school-name"
              placeholder="e.g. Nguyen Du High School"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="school-address">Address</Label>
            <Input
              id="school-address"
              placeholder="e.g. 123 Le Loi, District 1, HCMC"
              {...register("address")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="school-phone">Phone</Label>
            <Input
              id="school-phone"
              placeholder="e.g. 028-1234-5678"
              {...register("phone")}
            />
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="school-box-folder">Parent Box Folder ID</Label>
              <Input
                id="school-box-folder"
                placeholder="Box folder ID (optional)"
                {...register("parentBoxFolderId")}
              />
              <p className="text-xs text-neutral-500">
                If provided, a school folder will be created inside this Box folder.
              </p>
            </div>
          )}

          <SheetFooter className="mt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create School"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
