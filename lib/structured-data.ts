import { getPostBySlug } from "@/lib/posts";
import { Metadata } from "next";

export function generateStructuredData(post: {
  title: string;
  description: string;
  date: string;
  slug: string;
  category: string;
  readingTime?: number;
  ogImage?: string;
}): object {
  const baseUrl = "https://blog.addiscrown.et";
  const postUrl = `${baseUrl}/posts/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.ogImage ? [post.ogImage] : [`${baseUrl}/og-default.png`],
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Addis Crown",
      url: baseUrl
    },
    publisher: {
      "@type": "Organization",
      name: "Addis Crown",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl
    },
    ...(post.readingTime && {
      timeRequired: `PT${post.readingTime}M`
    })
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function generateWebSiteStructuredData(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Addis Crown",
    url: "https://blog.addiscrown.et",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://blog.addiscrown.et/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
}