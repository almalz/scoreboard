/**
 * Format ISO date for "last game" / short context (e.g. "15 janv. 14:30").
 */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format ISO date for list/detail (e.g. "15 janv. 2025").
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
