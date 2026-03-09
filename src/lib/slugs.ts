/**
 * Extracts the numeric TMDB ID from a URL slug like "avatar-the-way-of-water-76600"
 * Falls back to treating the entire param as a number for backward compatibility.
 */
export function extractIdFromSlug(slug: string | undefined): number {
  if (!slug) return NaN;
  // Try extracting trailing number after last hyphen
  const match = slug.match(/-(\d+)$/);
  if (match) return Number(match[1]);
  // Fallback: treat entire string as number (backward compat)
  return Number(slug);
}

/**
 * Generates a URL-friendly slug from a title and numeric ID.
 * Example: slugify("Avatar: The Way of Water", 76600) => "avatar-the-way-of-water-76600"
 */
export function slugify(title: string, id: number): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}-${id}`;
}
