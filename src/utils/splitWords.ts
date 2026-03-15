/**
 * Splits text into individual words for GSAP animation.
 */
export function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}
