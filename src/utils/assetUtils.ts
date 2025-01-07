/**
 * Utility functions for asset management
 */

/**
 * Get the full path for an asset
 * @param path - Relative path to the asset
 * @returns Full path to the asset
 */
export const getAssetPath = (path: string): string => {
  return new URL(`../assets/${path}`, import.meta.url).href;
};

/**
 * Check if an SVG asset exists
 * @param path - Path to the SVG asset
 * @returns Promise that resolves to boolean indicating if asset exists
 */
export const validateSvgAsset = async (path: string): Promise<boolean> => {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.includes('svg');
  } catch {
    return false;
  }
};

/**
 * Get SVG dimensions
 * @param svgContent - SVG content as string
 * @returns Object containing width and height
 */
export const getSvgDimensions = (svgContent: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  
  return {
    width: svg?.getAttribute('width'),
    height: svg?.getAttribute('height'),
    viewBox: svg?.getAttribute('viewBox')
  };
};