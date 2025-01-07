import { useState, useEffect } from 'react';

export function useAssetLoader(assetPath: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      setError(null);
    };

    img.onerror = () => {
      setError(new Error(`Failed to load asset: ${assetPath}`));
      setIsLoaded(false);
    };

    img.src = assetPath;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [assetPath]);

  return { isLoaded, error };
}