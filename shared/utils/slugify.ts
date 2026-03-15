export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function articleSlug(title: string, id: string): string {
  return `${slugify(title)}-${id}`;
}

export function articleIdFromSlug(slug: string): string {
  return slug.split("-").pop() ?? slug;
}
