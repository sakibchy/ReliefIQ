/**
 * Format an ISO timestamp to a human-readable "time ago" string.
 * e.g. "3 minutes ago", "2 hours ago"
 */
export function timeAgo(isoString) {
  const date = new Date(isoString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60)   return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Format an ISO timestamp to a readable date-time string.
 * e.g. "Jul 16, 2026 · 10:30 AM"
 */
export function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).replace(',', ' ·');
}

/**
 * Capitalize first letter of a string.
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert snake_case to Title Case.
 * e.g. "aid_dispatched" → "Aid Dispatched"
 */
export function snakeToTitle(str) {
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Truncate a string to maxLen characters.
 */
export function truncate(str, maxLen = 100) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + '…';
}

/**
 * Format a confidence float (0.0–1.0) as a percentage string.
 */
export function formatConfidence(confidence) {
  if (confidence == null) return 'N/A';
  return `${Math.round(confidence * 100)}%`;
}

/**
 * Format coordinates as a short lat/lng string.
 */
export function formatCoords(lat, lng) {
  return `${lat?.toFixed(4)}, ${lng?.toFixed(4)}`;
}
