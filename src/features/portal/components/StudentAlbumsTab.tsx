import { useAlbums } from "@/features/album/hooks/useAlbums";
import { AlbumStatus } from "@/features/album/types/album.types";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { EmptyState } from "@/shared/components/EmptyState";
import { Link } from "react-router-dom";

export function StudentAlbumsTab({ classId, studentId }: { classId: string; studentId: string }) {
  const { data, isLoading } = useAlbums(classId, { status: AlbumStatus.PUBLISHED });
  const albums = data?.data || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <EmptyState
        title="No Albums Available"
        description="No published albums available for this class."
        icon={<ImageIcon className="h-6 w-6 text-primary/40" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {albums.map((album) => (
        <Link key={album.id} to={`/portal/students/${studentId}/albums/${album.id}`} className="block group transition-transform hover:-translate-y-1">
          <Card className="h-full hover:shadow-md transition-shadow overflow-hidden border-primary/10">
            <div className="aspect-video bg-primary/5 flex items-center justify-center relative overflow-hidden">
              <ImageIcon className="h-8 w-8 text-primary/30" />
              {/* If we had a cover image, we'd render it here */}
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
            </div>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base truncate" title={album.name}>
                {album.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xs text-muted-foreground line-clamp-2 min-h-8 mb-2">
                {album.description || "No description"}
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{album.imageCount} images</span>
                <span>{format(new Date(album.createdAt), "MMM d, yyyy")}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
