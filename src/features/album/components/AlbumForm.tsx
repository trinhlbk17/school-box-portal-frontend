import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { createAlbumSchema } from "../schemas/albumSchema";
import type { CreateAlbumFormData } from "../schemas/albumSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { useCreateAlbum, useUpdateAlbum } from "../hooks/useAlbumMutations";
import type { Album } from "../types/album.types";
import { useEffect } from "react";
import { toast } from "sonner";

interface AlbumFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  initialData?: Album; // If provided, it's an edit form
}

export function AlbumForm({
  open,
  onOpenChange,
  classId,
  initialData,
}: AlbumFormProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateAlbum();
  const updateMutation = useUpdateAlbum();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAlbumFormData>({
    resolver: zodResolver(createAlbumSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Reset form when initialData changes or modal opens
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name,
          description: initialData.description || "",
        });
      } else {
        reset({
          name: "",
          description: "",
        });
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: CreateAlbumFormData) => {
    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data: {
            name: data.name,
            description: data.description,
          },
        });
        toast.success("Album updated", {
          description: "The album has been updated successfully.",
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          classId,
        });
        toast.success("Album created", {
          description: "The album has been created successfully.",
        });
      }
      onOpenChange(false);
    } catch (error: unknown) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "An error occurred while saving the album.",
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Album" : "Create Album"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this album."
              : "Create a new album to upload photos."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="album-name">
              Album Name <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="album-name"
              placeholder="e.g. Field Trip 2024" 
              {...register("name")} 
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="album-description">Description (Optional)</Label>
            <Textarea
              id="album-description"
              placeholder="Add some details about this album..."
              className="resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Album"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
