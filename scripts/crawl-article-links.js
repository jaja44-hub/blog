#!/usr/bin/env node

const https = require('https');

const pagesToCrawl = [
  'https://blog.addiscrown.et/',
  'https://blog.addiscrown.et/latest',
  'https://blog.addiscrown.et/popular',
  'https://blog.addiscrown.et/new-this-week',
  'https://blog.addiscrown.et/feed.xml',
  'https://blog.addiscrown.et/sitemap.xml'
];

const categoryPages = [
  'public-policy-institutions',
  'media-and-information',
  'media-information',
  'markets-and-investment',
  'markets-investment',
  'technology-ai',
  'ethiopia-east-africa',
  'comparative-law',
  'contracts-and-consumer-safety',
  'contracts-consumer-safety',
  'economics-and-finance',
  'economics-finance',
  'business-enterprise-fundamentals',
  'business-enterprise',
  'real-estate-fundamentals',
  'real-estate-housing',
  'migration-borders',
  'legal-rights'
];

// Add category pages
categoryPages.forEach(category => {
  pagesToCrawl.push(`https://blog.addiscrown.et/category/${category}`);
});

function extractLinks(html, baseUrl) {
  const hrefRegex = /href="\/posts\/([^"]+)"/g;
  const links = new Set();
  let match;
  
  while ((match = hrefRegex.exec(html)) !== null) {
    links.add(match[1]);
  }
  
  return Array.from(links);
}

function crawlPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ url, html: data, status: res.statusCode });
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Starting article link crawler...\n');
  
  const allLinks = new Map();
  const errors = [];
  
  for (const url of pagesToCrawl) {
    try {
      console.log(`Crawling: ${url}`);
      const { url: crawledUrl, html, status } = await crawlPage(url);
      
      if (status !== 200) {
        errors.push({ url: crawledUrl, status });
        console.log(`  ❌ Status: ${status}`);
        continue;
      }
      
      const links = extractLinks(html, url);
      allLinks.set(url, links);
      console.log(`  ✓ Found ${links.length} article links`);
    } catch (error) {
      errors.push({ url, error: error.message });
      console.log(`  ❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n=== Summary ===');
  console.log(`Pages crawled: ${pagesToCrawl.length}`);
  console.log(`Total unique article links found: ${[...allLinks.values()].flat().length}`);
  console.log(`Errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\n=== Errors ===');
    errors.forEach(({ url, status, error }) => {
      console.log(`  ${url}: ${status || error}`);
    });
  }
  
  console.log('\n=== Article Links by Page ===');
  for (const [url, links] of allLinks) {
    console.log(`\n${url}:`);
    links.forEach(link => console.log(`  /posts/${link}`));
  }
  
  // Check each article link
  console.log('\n=== Verifying Article Links ===');
  const articleErrors = [];
  
  for (const [pageUrl, links] of allLinks) {
    for (const slug of links) {
      const articleUrl = `https://blog.addiscrown.et/posts/${slug}`;
      try {
        const { status } = await crawlPage(articleUrl);
        if (status !== 200) {
          articleErrors.push({ articleUrl, status, foundOn: pageUrl });
          console.log(`  ❌ /posts/${slug} (${status}) - found on ${pageUrl}`);
        } else {
          console.log(`  ✓ /posts/${slug} (${status})`);
        }
      } catch (error) {
        articleErrors.push({ articleUrl, error: error.message, foundOn: pageUrl });
        console.log(`  ❌ /posts/${slug} (${error.message}) - found on ${pageUrl}`);
      }
    }
  }
  
  console.log(`\n=== Final Results ===`);
  console.log(`Total article links checked: ${[...allLinks.values()].flat().length}`);
  console.log(`Article link errors: ${articleErrors.length}`);
  
  if (articleErrors.length > 0) {
    console.log('\n=== Article Link Errors ===');
    articleErrors.forEach(({ articleUrl, status, error, foundOn }) => {
      console.log(`  ${articleUrl}: ${status || error} (found on ${foundOn})`);
    });
    process.exit(1);
  } else {
    console.log('\n✅ All article links are accessible (200 OK)');
    process.exit(0);
  }
}

main();