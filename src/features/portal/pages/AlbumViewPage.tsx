import { useParams, useNavigate } from "react-router-dom";
import { useAlbum, useAlbumImages } from "@/features/album/hooks/useAlbums";
import { useDownloadAlbumZip } from "@/features/album/hooks/useDownload";
import { ImageGrid } from "@/features/album/components/ImageGrid";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { AlertCircle, ChevronLeft, Download, Loader2 } from "lucide-react";
import { FeatureErrorBoundary } from "@/shared/components/FeatureErrorBoundary";

export function AlbumViewPage() {
  const { studentId, albumId } = useParams<{ studentId: string; albumId: string }>();
  const navigate = useNavigate();
  
  const { data: album, isLoading: isAlbumLoading, error: albumError } = useAlbum(albumId!);
  const { data: images = [], isLoading: isImagesLoading } = useAlbumImages(albumId!);
  const downloadZip = useDownloadAlbumZip();

  if (albumError) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-8 text-center text-destructive flex flex-col items-center">
          <AlertCircle className="h-8 w-8 mb-4" />
          <h2>Failed to load album.</h2>
          <Button variant="outline" className="mt-4" onClick={() => navigate(`/portal/students/${studentId}`)}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  if (isAlbumLoading || !album) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  const handleDownloadZip = async () => {
    try {
      await downloadZip.mutateAsync({
        albumId: album.id,
        filename: `${album.name.replace(/\\s+/g, "_")}.zip`,
      });
    } catch {
      // Error handled in hook
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl space-y-6">
      <FeatureErrorBoundary featureName="Album View">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-primary/10 pb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button variant="ghost" size="sm" onClick={() => navigate(`/portal/students/${studentId}`)} className="p-0 h-auto hover:bg-primary/5 text-muted-foreground hover:text-primary">
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-3xl font-bold tracking-tight text-primary">{album.name}</h1>
            </div>
            <p className="text-muted-foreground">{album.description || "No description provided."}</p>
          </div>

          <Button
            onClick={handleDownloadZip}
            disabled={images.length === 0 || downloadZip.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {downloadZip.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {downloadZip.isPending ? "Preparing Download..." : "Download All"}
          </Button>
        </div>

        {isImagesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <ImageGrid
              images={images}
              isAdmin={false}
              readonly={true}
            />
          </div>
        )}
      </FeatureErrorBoundary>
    </div>
  );
}
