/**
 * Joins first and last name.
 * @param {string} first
 * @param {string} [last]
 * @returns {string}
 */
export function formatName(first, last) {
  return [first, last].filter(Boolean).join(' ');
}
