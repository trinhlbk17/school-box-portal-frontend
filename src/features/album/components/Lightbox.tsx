import * as React from "react";
import YARLLightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
// Optional plugins
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { useImageUrl } from "../hooks/useImageUrl";
import { Loader2 } from "lucide-react";

interface CustomSlideProps {
  imageId: string;
}

// Sub-component to fetch and render the authenticated blob URL
function AuthenticatedSlide({ imageId }: CustomSlideProps) {
  const { url, isLoading, error } = useImageUrl(imageId, "preview");

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (error || !url) {
    return (
      <div className="flex h-full w-full items-center justify-center text-white">
        Failed to load image
      </div>
    );
  }

  return (
    <img
      src={url}
      alt="Preview"
      className="max-h-full max-w-full object-contain"
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
    />
  );
}

interface LightboxProps {
  open: boolean;
  close: () => void;
  index: number;
  setIndex?: (index: number) => void;
  imageIds: string[];
}

export function Lightbox({ open, close, index, setIndex, imageIds }: LightboxProps) {
  // Convert our image IDs into YARL slides
  const slides = imageIds.map((id) => ({
    type: "custom-auth-image",
    id,
  }));

  return (
    <YARLLightbox
      open={open}
      close={close}
      index={index}
      on={{ view: ({ index }) => setIndex?.(index) }}
      slides={slides}
      plugins={[Zoom]}
      render={{
        slide: ({ slide }) => {
          // Narrow type properly if needed, but any custom slide is passed here
          if (slide.type === "custom-auth-image" && "id" in slide) {
            return <AuthenticatedSlide imageId={slide.id as string} />;
          }
          return null;
        },
      }}
    />
  );
}
