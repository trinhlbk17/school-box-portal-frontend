import YARLLightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
// Optional plugins
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { useImageUrl } from "../hooks/useImageUrl";
import { Loader2, AlertTriangle } from "lucide-react";

interface CustomSlideProps {
  imageId: string;
  readonly?: boolean;
}

// Sub-component to fetch and render the authenticated blob URL
function AuthenticatedSlide({ imageId, readonly }: CustomSlideProps) {
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
    <div className="relative flex h-full w-full items-center justify-center">
      <img
        src={url}
        alt="Preview"
        className="max-h-full max-w-full object-contain"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
      />
      {readonly && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-md bg-black/60 px-4 py-2 text-sm text-white backdrop-blur-sm pointer-events-none z-50 shadow-lg">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <span>Downloaded images will contain a watermark</span>
        </div>
      )}
    </div>
  );
}

interface LightboxProps {
  open: boolean;
  close: () => void;
  index: number;
  setIndex?: (index: number) => void;
  imageIds: string[];
  readonly?: boolean;
}

export function Lightbox({ open, close, index, setIndex, imageIds, readonly }: LightboxProps) {
  // Convert our image IDs into YARL slides
  const slides = imageIds.map((id) => ({
    type: "image" as const,
    src: id,
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
          if ("id" in slide && slide.id) {
            return <AuthenticatedSlide imageId={slide.id as string} readonly={readonly} />;
          }
          return null;
        },
      }}
    />
  );
}
