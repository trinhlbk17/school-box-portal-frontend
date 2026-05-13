import { useState, useEffect } from "react";

export function useDelayedLoading(isLoading: boolean, delayMs: number = 200): boolean {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowLoading(true);
      }, delayMs);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowLoading(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, delayMs]);

  return showLoading;
}
