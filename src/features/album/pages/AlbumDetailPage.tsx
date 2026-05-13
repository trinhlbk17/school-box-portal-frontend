import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useAlbum, useAlbumImages } from "../hooks/useAlbums";
import {
  usePublishAlbum,
  useArchiveAlbum,
} from "../hooks/useAlbumActions";
import { useDeleteAlbum } from "../hooks/useAlbumMutations";
import { useDownloadAlbumZip } from "../hooks/useDownload";
import { useDeleteImage } from "../hooks/useImageMutations";
import { AlbumStatus } from "../types/album.types";


import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { ImageGrid } from "../components/ImageGrid";
import { ImageUploader } from "../components/ImageUploader";
import { AlbumForm } from "../components/AlbumForm";
import {
  Archive,
  Download,
  Edit,
  Globe,
  Trash2,
  UploadCloud,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";

export function AlbumDetailPage() {
  const { classId, albumId } = useParams<{ classId: string; albumId: string }>();
  const navigate = useNavigate();

  const { isAdmin, isTeacher } = useAuthStore((state) => ({
    isAdmin: state.isAdmin(),
    isTeacher: state.isTeacher(),
  }));
  const isStaff = isAdmin || isTeacher;

  // State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPublishConfirmOpen, setIsPublishConfirmOpen] = useState(false);
  const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false);

  // Data Queries
  const { data: album, isLoading: isAlbumLoading, error: albumError } = useAlbum(albumId!);
  const { data: images = [], isLoading: isImagesLoading } = useAlbumImages(albumId!);

  // Mutations
  const deleteAlbum = useDeleteAlbum();
  const publishAlbum = usePublishAlbum();
  const archiveAlbum = useArchiveAlbum();
  const deleteImage = useDeleteImage();
  const downloadZip = useDownloadAlbumZip();

  if (albumError) {
    return (
      <div className="p-8 text-center text-destructive">
        <h2>Failed to load album details.</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  if (isAlbumLoading || !album) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // Handlers
  const handleDeleteAlbum = async () => {
    try {
      await deleteAlbum.mutateAsync({ id: album.id, classId: album.classId });
      toast.success("Album deleted");
      navigate(`/admin/classes/${classId}`);
    } catch (e: unknown) {
      toast.error("Failed to delete", { description: e instanceof Error ? e.message : "Unknown error" });
    }
  };

  const handlePublish = async () => {
    try {
      await publishAlbum.mutateAsync({ id: album.id, classId: album.classId });
      toast.success("Album published");
      setIsPublishConfirmOpen(false);
    } catch (e: unknown) {
      toast.error("Failed to publish", { description: e instanceof Error ? e.message : "Unknown error" });
    }
  };

  const handleArchive = async () => {
    try {
      await archiveAlbum.mutateAsync({ id: album.id, classId: album.classId });
      toast.success("Album archived");
      setIsArchiveConfirmOpen(false);
    } catch (e: unknown) {
      toast.error("Failed to archive", { description: e instanceof Error ? e.message : "Unknown error" });
    }
  };

  const handleDeleteImages = async (imageIds: string[]) => {
    // In a real app we'd bulk delete, but the API might only support single deletes.
    // For now, we'll do it sequentially or Promise.all. Assuming Promise.all for simplicity.
    try {
      await Promise.all(
        imageIds.map((id) => deleteImage.mutateAsync({ imageId: id, albumId: album.id }))
      );
      toast.success("Images deleted", { description: `Deleted ${imageIds.length} images.` });
    } catch (e: unknown) {
      toast.error("Error deleting images", { description: e instanceof Error ? e.message : "Unknown error" });
    }
  };

  const handleDownloadImages = async () => {
    toast.info("Individual download not implemented yet in bulk.");
  };

  const handleDownloadZip = async () => {
    try {
      await downloadZip.mutateAsync({
        albumId: album.id,
        filename: `${album.name.replace(/\s+/g, "_")}.zip`,
      });
    } catch {
      // Error handled in hook
    }
  };

  const getStatusBadgeVariant = (status: AlbumStatus) => {
    switch (status) {
      case AlbumStatus.PUBLISHED:
        return "default";
      case AlbumStatus.DRAFT:
        return "secondary";
      case AlbumStatus.ARCHIVED:
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/classes/${classId}`)} className="p-0 h-auto">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{album.name}</h1>
            <Badge variant={getStatusBadgeVariant(album.status)}>
              {album.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{album.description}</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={album.status === AlbumStatus.ARCHIVED}
            onClick={handleDownloadZip}
          >
            <Download className="h-4 w-4 mr-2" />
            Download ZIP
          </Button>

          {isStaff && (
            <Button
              variant="outline"
              size="sm"
              disabled={album.status === AlbumStatus.ARCHIVED}
              onClick={() => setIsUploadOpen(!isUploadOpen)}
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload
            </Button>
          )}

          {isAdmin && album.status === AlbumStatus.DRAFT && (
            <Button size="sm" onClick={() => setIsPublishConfirmOpen(true)}>
              <Globe className="h-4 w-4 mr-2" />
              Publish
            </Button>
          )}

          {isAdmin && album.status === AlbumStatus.PUBLISHED && (
            <Button variant="secondary" size="sm" onClick={() => setIsArchiveConfirmOpen(true)}>
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          )}

          {isAdmin && (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setIsDeleteOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Upload Zone (Toggleable) */}
      {isUploadOpen && (
        <div className="mb-6">
          <ImageUploader albumId={album.id} onUploadSuccess={() => setIsUploadOpen(false)} />
        </div>
      )}

      {/* Image Grid */}
      {isImagesLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-md" />
          ))}
        </div>
      ) : (
        <ImageGrid
          images={images}
          isAdmin={isAdmin}
          onDeleteSelected={handleDeleteImages}
          onDownloadSelected={handleDownloadImages}
        />
      )}

      {/* Modals & Dialogs */}
      <AlbumForm
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        classId={album.classId}
        initialData={album}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Album"
        description="Are you sure you want to permanently delete this album and all its images? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        isLoading={deleteAlbum.isPending}
        onConfirm={handleDeleteAlbum}
        onClose={() => setIsDeleteOpen(false)}
      />

      <ConfirmDialog
        isOpen={isPublishConfirmOpen}
        title="Publish Album"
        description="Publishing this album will make it visible to all users with access to this class. Do you want to proceed?"
        confirmLabel="Publish"
        isLoading={publishAlbum.isPending}
        onConfirm={handlePublish}
        onClose={() => setIsPublishConfirmOpen(false)}
      />

      <ConfirmDialog
        isOpen={isArchiveConfirmOpen}
        title="Archive Album"
        description="Archiving this album will prevent further uploads and downloads. It will still be visible. Do you want to proceed?"
        confirmLabel="Archive"
        isLoading={archiveAlbum.isPending}
        onConfirm={handleArchive}
        onClose={() => setIsArchiveConfirmOpen(false)}
      />
    </div>
  );
}
