export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    "legal-rights": "Legal Rights",
    "contracts-consumer-safety": "Contracts & Consumer Safety",
    "contracts-and-consumer-safety": "Contracts & Consumer Safety",
    "business-enterprise": "Business & Enterprise",
    "business-enterprise-fundamentals": "Business & Enterprise",
    "markets-investment": "Markets & Investment",
    "markets-and-investment": "Markets & Investment",
    "real-estate-housing": "Real Estate & Housing",
    "real-estate-fundamentals": "Real Estate & Housing",
    "economics-finance": "Economics & Finance",
    "economics-and-finance": "Economics & Finance",
    "migration-borders": "Migration & Borders",
    "technology-ai": "Technology & AI",
    "media-information": "Media & Information",
    "media-and-information": "Media & Information",
    "public-policy-institutions": "Public Policy & Institutions",
    "ethiopia-east-africa": "Ethiopia & East Africa",
    "comparative-law": "Comparative Law"
  };
  return map[category] ?? category;
}

export const CATEGORIES = [
  "legal-rights",
  "contracts-consumer-safety",
  "contracts-and-consumer-safety",
  "business-enterprise",
  "business-enterprise-fundamentals",
  "markets-investment",
  "markets-and-investment",
  "real-estate-housing",
  "real-estate-fundamentals",
  "economics-finance",
  "economics-and-finance",
  "migration-borders",
  "technology-ai",
  "media-information",
  "media-and-information",
  "public-policy-institutions",
  "ethiopia-east-africa",
  "comparative-law"
] as const;