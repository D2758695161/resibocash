/**
 * Format an ISO date string into a human-readable short form.
 * Example: "Mar 26, 02:30 PM"
 *
 * @param {string} iso - ISO 8601 date string
 * @returns {string}
 */
export function formatDate(iso) {
  const d = new Date(iso);
  const month = d.toLocaleString('default', { month: 'short' });
  const day = d.getDate();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${month} ${day}, ${time}`;
}

/**
 * Format a numeric amount as Philippine Peso currency.
 * Example: 1500 -> "P1,500.00"
 *
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return `P${amount.toLocaleString()}.00`;
}

/**
 * Format a points value with locale-aware thousand separators.
 * Example: 12500 -> "12,500"
 *
 * @param {number} points
 * @returns {string}
 */
export function formatPoints(points) {
  return points.toLocaleString();
}
