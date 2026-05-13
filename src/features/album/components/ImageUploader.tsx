import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { AxiosProgressEvent } from "axios";
import { UploadCloud, X, FileImage } from "lucide-react";
import { useUploadImages } from "../hooks/useImageMutations";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { toast } from "sonner";

interface ImageUploaderProps {
  albumId: string;
  onUploadSuccess?: () => void;
}

export function ImageUploader({ albumId, onUploadSuccess }: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);


  const uploadMutation = useUploadImages();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (selectedFiles.length + acceptedFiles.length > 20) {
        toast.error("Too many files", {
          description: "You can only upload up to 20 images at once.",
        });
        const allowedSpace = 20 - selectedFiles.length;
        if (allowedSpace > 0) {
          setSelectedFiles((prev) => [...prev, ...acceptedFiles.slice(0, allowedSpace)]);
        }
        return;
      }
      setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
    },
    [selectedFiles.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB per file
    disabled: isUploading || selectedFiles.length >= 20,
  });

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      await uploadMutation.mutateAsync({
        albumId,
        files: selectedFiles,
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });

      setSelectedFiles([]);
      setUploadProgress(0);
      onUploadSuccess?.();
      toast.success("Upload Successful", {
        description: `Successfully uploaded ${selectedFiles.length} images.`,
      });
    } catch {
      // Error handled by mutation hook
    } finally {
      setIsUploading(false);
    }
  };

  if (isUploading) {
    return (
      <div className="border rounded-lg p-8 bg-card flex flex-col items-center justify-center text-center space-y-4">
        <UploadCloud className="h-10 w-10 text-primary animate-pulse" />
        <div className="w-full max-w-md space-y-2">
          <p className="text-sm font-medium">Uploading {selectedFiles.length} images...</p>
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 transition-colors text-center cursor-pointer flex flex-col items-center justify-center min-h-[200px]
          ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          }
          ${selectedFiles.length >= 20 ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-base font-medium">
          {isDragActive ? "Drop the images here..." : "Drag & drop images here"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          or click to browse (Max 20 files, 10MB each. JPG, PNG, WEBP)
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-4 bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Selected files ({selectedFiles.length}/20)
            </h4>
            <Button size="sm" onClick={handleUpload}>
              Upload All
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-2">
            {selectedFiles.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="relative group bg-background border rounded-md p-2 flex flex-col items-center justify-center"
              >
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => removeFile(idx)}
                    className="bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm hover:bg-destructive/90"
                    title="Remove"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <FileImage className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-xs truncate w-full text-center" title={file.name}>
                  {file.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
