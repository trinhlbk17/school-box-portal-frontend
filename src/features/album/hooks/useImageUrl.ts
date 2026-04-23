import { useState, useEffect } from "react";
import { albumApi } from "../api/albumApi";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

type ImageType = "thumbnail" | "preview";

export function useImageUrl(imageId?: string, type: ImageType = "thumbnail") {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const sessionToken = useAuthStore((state) => state.sessionToken);

  useEffect(() => {
    let objectUrl: string | null = null;
    let isMounted = true;

    async function fetchImage() {
      if (!imageId || !sessionToken) {
        setUrl(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const blob =
          type === "thumbnail"
            ? await albumApi.getThumbnail(imageId)
            : await albumApi.getPreview(imageId);

        if (isMounted) {
          objectUrl = URL.createObjectURL(blob);
          setUrl(objectUrl);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setUrl(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchImage();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageId, type, sessionToken]);

  return { url, isLoading, error };
}
