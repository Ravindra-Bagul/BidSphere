
/**
 * Combines multiple class names into a single string
 * @param  {...string} classes - CSS class names to combine
 * @returns {string} - Combined class names with duplicates removed
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
