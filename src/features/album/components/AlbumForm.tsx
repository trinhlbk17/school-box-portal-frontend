import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAlbumFormData, createAlbumSchema } from "../schemas/albumSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { useCreateAlbum, useUpdateAlbum } from "../hooks/useAlbumMutations";
import { Album } from "../types/album.types";
import { useEffect } from "react";
import { useToast } from "@/shared/hooks/use-toast";

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
  const { toast } = useToast();

  const createMutation = useCreateAlbum();
  const updateMutation = useUpdateAlbum();

  const form = useForm<CreateAlbumFormData>({
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
        form.reset({
          name: initialData.name,
          description: initialData.description || "",
        });
      } else {
        form.reset({
          name: "",
          description: "",
        });
      }
    }
  }, [open, initialData, form]);

  const onSubmit = async (data: CreateAlbumFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data: {
            name: data.name,
            description: data.description,
          },
        });
        toast({
          title: "Album updated",
          description: "The album has been updated successfully.",
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          classId,
        });
        toast({
          title: "Album created",
          description: "The album has been created successfully.",
        });
      }
      onOpenChange(false);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while saving the album.",
        variant: "destructive",
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Album Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Field Trip 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add some details about this album..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Album"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
