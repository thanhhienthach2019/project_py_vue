// helpers/imageUrl.ts
export function getImageUrl(filename: string): string {
  return `${import.meta.env.VITE_STATIC_URL}/public/images/${filename}`;
}