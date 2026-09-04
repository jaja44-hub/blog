export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    "legal-rights": "Legal Rights",
    "ai-policy": "AI & Policy",
    "media-literacy": "Media Literacy"
  };
  return map[category] ?? category;
}

export const CATEGORIES = [
  "legal-rights",
  "ai-policy",
  "media-literacy"
] as const;

export type Category = (typeof CATEGORIES)[number];