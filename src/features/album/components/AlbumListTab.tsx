import { useState } from "react";
import { Plus, ImageIcon, Image as LucideImage, Calendar } from "lucide-react";
import { useAlbums } from "../hooks/useAlbums";
import { AlbumStatus } from "../types/album.types";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { format } from "date-fns";
import { AlbumForm } from "./AlbumForm";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface AlbumListTabProps {
  classId: string;
}

export function AlbumListTab({ classId }: AlbumListTabProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const navigate = useNavigate();
  const isAdmin = useAuthStore((state) => state.isAdmin());

  const { data: albumsData, isLoading, error } = useAlbums(classId, {
    status: statusFilter !== "ALL" ? (statusFilter as AlbumStatus) : undefined,
  });

  const albums = albumsData?.data || [];

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load albums. Please try again later.
      </div>
    );
  }

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
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value={AlbumStatus.PUBLISHED}>Published</SelectItem>
              <SelectItem value={AlbumStatus.DRAFT}>Draft</SelectItem>
              <SelectItem value={AlbumStatus.ARCHIVED}>Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isAdmin && (
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Album
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <CardHeader className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : albums.length === 0 ? (
        /* Empty State */
        <div className="pt-8">
          <EmptyState
            title="No albums found"
            description={
              statusFilter !== "ALL"
                ? `No albums found with status ${statusFilter.toLowerCase()}.`
                : "Get started by creating your first photo album for this class."
            }
            icon={<ImageIcon className="h-6 w-6 text-neutral-500" />}
            action={
              isAdmin ? (
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Album
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        /* Album Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {albums.map((album) => (
            <Card
              key={album.id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => navigate(`/admin/classes/${classId}/albums/${album.id}`)}
            >
              {/* Cover Placeholder - we'd load the coverImage blob here if we want, but for now we'll use a placeholder if no cover */}
              <div className="h-40 bg-muted flex items-center justify-center relative">
                {/* Note: In a real implementation we might fetch the cover image thumbnail blob here using useImageUrl if album.coverImageId exists. For simplicity, we use an icon. */}
                <LucideImage className="h-10 w-10 text-muted-foreground opacity-50" />
                <div className="absolute top-2 right-2">
                  <Badge variant={getStatusBadgeVariant(album.status)}>
                    {album.status}
                  </Badge>
                </div>
              </div>

              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                  {album.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                  {album.description || "No description provided."}
                </p>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground border-t mt-4 pt-3">
                <div className="flex items-center gap-1">
                  <LucideImage className="h-3 w-3" />
                  <span>{album.imageCount} items</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(album.createdAt), "MMM d, yyyy")}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <AlbumForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        classId={classId}
      />
    </div>
  );
}
