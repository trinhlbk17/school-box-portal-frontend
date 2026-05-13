import { useState } from "react";
import type { AlbumImage } from "../types/album.types";
import { useImageUrl } from "../hooks/useImageUrl";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Trash2, Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { formatBytes } from "@/shared/lib/utils";
import { Lightbox } from "./Lightbox";

interface ImageGridProps {
  images: AlbumImage[];
  isAdmin: boolean;
  readonly?: boolean;
  onDeleteSelected?: (imageIds: string[]) => void;
  onDownloadSelected?: (imageIds: string[]) => void;
}

// Sub-component for individual thumbnail
function ThumbnailCard({
  image,
  isSelected,
  readonly,
  onToggleSelect,
  onClick,
}: {
  image: AlbumImage;
  isSelected: boolean;
  readonly?: boolean;
  onToggleSelect: (id: string) => void;
  onClick: () => void;
}) {
  const { url, isLoading } = useImageUrl(image.id, "thumbnail");

  return (
    <div className="relative group aspect-square rounded-md overflow-hidden border bg-muted">
      {isLoading ? (
        <Skeleton className="w-full h-full" />
      ) : url ? (
        <img
          src={url}
          alt={image.originalName}
          className="object-cover w-full h-full cursor-pointer transition-transform group-hover:scale-105"
          onClick={onClick}
          loading="lazy"
        />
      ) : (
        <div className="flex items-center justify-center h-full w-full bg-muted text-muted-foreground">
          <ImageIcon className="h-8 w-8 opacity-50" />
        </div>
      )}

      {/* Selection Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        onClick={(e) => {
          if (readonly) return;
          // Prevent triggering the Lightbox if clicking the overlay but not the checkbox
          if ((e.target as HTMLElement).closest("button[role='checkbox']")) return;
          // Optionally toggle selection on overlay click
          onToggleSelect(image.id);
        }}
      >
        {!readonly && (
          <div className="absolute top-2 left-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelect(image.id)}
              className="border-white data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
          </div>
        )}
        <div className="absolute bottom-2 left-2 right-2 text-xs text-white truncate pointer-events-none drop-shadow-md">
          {image.originalName}
        </div>
        <div className="absolute top-2 right-2 text-xs text-white pointer-events-none drop-shadow-md">
          {formatBytes(image.size)}
        </div>
      </div>
    </div>
  );
}

export function ImageGrid({
  images,
  isAdmin,
  readonly = false,
  onDeleteSelected,
  onDownloadSelected,
}: ImageGridProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === images.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(images.map((img) => img.id)));
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // If no images
  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <ImageIcon className="mx-auto h-12 w-12 opacity-20 mb-4" />
        <p>No images in this album yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-md p-3 flex items-center justify-between sticky top-4 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-primary">
              {selectedIds.size} selected
            </span>
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              Clear
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedIds.size === images.length ? "Deselect All" : "Select All"}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownloadSelected?.(Array.from(selectedIds))}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            {isAdmin && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDeleteSelected?.(Array.from(selectedIds));
                  clearSelection();
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img, index) => (
          <ThumbnailCard
            key={img.id}
            image={img}
            isSelected={selectedIds.has(img.id)}
            readonly={readonly}
            onToggleSelect={handleToggleSelect}
            onClick={() => setLightboxIndex(index)}
          />
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        setIndex={setLightboxIndex}
        imageIds={images.map((i) => i.id)}
        readonly={readonly}
      />
    </div>
  );
}
