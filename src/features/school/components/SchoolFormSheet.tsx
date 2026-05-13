import { useEffect, useState } from "react";
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
import { BoxFolderBrowser } from "@/features/box/components/BoxFolderBrowser";

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

  const [isFolderBrowserOpen, setIsFolderBrowserOpen] = useState(false);
  const [selectedFolderName, setSelectedFolderName] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedFolderName("");
    }
  }, [isOpen, school, reset]);

  const onSubmit = async (values: SchoolFormValues) => {
    const payload = {
      name: values.name,
      ...(values.address ? { address: values.address } : {}),
      ...(values.phone ? { phone: values.phone } : {}),
      ...(values.parentBoxFolderId ? { parentBoxFolderId: values.parentBoxFolderId } : {}),
    };

    try {
      if (isEdit && school) {
        await updateSchool.mutateAsync({ id: school.id, data: payload });
      } else {
        await createSchool.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save school", error);
    }
  };

  return (
    <>
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div className="flex flex-col gap-4 p-4 flex-1 overflow-y-auto">
            <div className="space-y-1.5">
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

            <div className="space-y-1.5">
              <Label htmlFor="school-address">Address</Label>
              <Input
                id="school-address"
                placeholder="e.g. 123 Le Loi, District 1, HCMC"
                {...register("address")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="school-phone">Phone</Label>
              <Input
                id="school-phone"
                placeholder="e.g. 028-1234-5678"
                {...register("phone")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="school-box-folder">
                {isEdit ? "Change Parent Box Folder" : "Parent Box Folder"} {!isEdit && <span className="text-red-500">*</span>}
              </Label>
              <Button
                id="school-box-folder"
                type="button"
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!selectedFolderName ? "text-neutral-500" : ""}`}
                onClick={() => setIsFolderBrowserOpen(true)}
              >
                {selectedFolderName || "Select Box Folder"}
              </Button>
              {errors.parentBoxFolderId && (
                <p className="text-xs text-red-500">{errors.parentBoxFolderId.message}</p>
              )}
              {isEdit ? (
                <p className="text-xs text-neutral-500 mt-1">
                  Status: {school?.boxFolderId 
                    ? <span className="text-green-600 font-medium">Linked (ID: {school.boxFolderId})</span> 
                    : <span className="text-amber-600 font-medium">Not Linked</span>}
                </p>
              ) : (
                <p className="text-xs text-neutral-500 mt-1">
                  A school folder will be created inside this Box folder.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-100 bg-white">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="w-32">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="w-32">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </SheetContent>
      </Sheet>

      <BoxFolderBrowser
        isOpen={isFolderBrowserOpen}
        onClose={() => setIsFolderBrowserOpen(false)}
        foldersOnly={true}
        onSelect={(result) => {
          setValue("parentBoxFolderId", result.id);
          setSelectedFolderName(result.name);
        }}
      />
    </>
  );
}
