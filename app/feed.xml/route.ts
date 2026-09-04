import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

export default function GET() {
  const base = "https://blog.addiscrown.et";
  const posts = getAllPosts();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Addis Crown — Law, Rights & Policy, Explained</title>
    <description>Plain-language explainers on Ethiopian law, rights, and the policy questions shaping how AI and institutions affect ordinary people.</description>
    <link>${base}</link>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${base}/posts/${post.slug}</link>
      <guid isPermaLink="true">${base}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${post.category}</category>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}