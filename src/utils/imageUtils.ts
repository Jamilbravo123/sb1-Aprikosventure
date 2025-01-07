/**
 * Utility functions for image handling
 */

/**
 * Get the full path for an image asset
 */
export const getImagePath = (path: string): string => {
  return new URL(`../assets/images/${path}`, import.meta.url).href;
};

/**
 * Generate srcSet for responsive images
 */
export const generateSrcSet = (basePath: string, sizes: number[]): string => {
  return sizes
    .map(size => `${getImagePath(`${basePath}-${size}.webp`)} ${size}w`)
    .join(', ');
};

/**
 * Check if an image exists at the given path
 */
export const imageExists = async (path: string): Promise<boolean> => {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get image dimensions
 */
export const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = url;
  });
};