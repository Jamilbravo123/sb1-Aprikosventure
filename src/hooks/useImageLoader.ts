import { useState, useEffect } from 'react';

interface ImageLoaderResult {
  isLoaded: boolean;
  error: Error | null;
}

export function useImageLoader(src: string): ImageLoaderResult {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      setError(null);
    };

    img.onerror = () => {
      setError(new Error(`Failed to load image: ${src}`));
      setIsLoaded(false);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { isLoaded, error };
}