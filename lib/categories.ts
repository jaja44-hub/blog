export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    "legal-rights": "Legal Rights",
    "contracts-consumer-safety": "Contracts & Consumer Safety",
    "business-enterprise": "Business & Enterprise",
    "markets-investment": "Markets & Investment",
    "real-estate-housing": "Real Estate & Housing",
    "economics-finance": "Economics & Finance",
    "migration-borders": "Migration & Borders",
    "technology-ai": "Technology & AI",
    "media-information": "Media & Information",
    "public-policy-institutions": "Public Policy & Institutions",
    "ethiopia-east-africa": "Ethiopia & East Africa",
    "comparative-law": "Comparative Law"
  };
  return map[category] ?? category;
}

export const CATEGORIES = [
  "legal-rights",
  "contracts-consumer-safety",
  "business-enterprise",
  "markets-investment",
  "real-estate-housing",
  "economics-finance",
  "migration-borders",
  "technology-ai",
  "media-information",
  "public-policy-institutions",
  "ethiopia-east-africa",
  "comparative-law"
] as const;