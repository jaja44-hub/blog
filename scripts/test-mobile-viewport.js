#!/usr/bin/env node

const https = require('https');

function getHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ url, html: data, status: res.statusCode }));
    }).on('error', reject);
  });
}

function extractTypographyInfo(html) {
  const info = {
    heroH1Size: null,
    heroDescriptionSize: null,
    categoryLabelSize: null,
    postCardTitleSize: null,
    foundHero: false,
    foundCategoryLabel: false,
    foundPostCard: false
  };

  // Look for hero H1 - find text-[28px] specifically (mobile size)
  const heroH1Match = html.match(/text-\[28px\] md:text-\[34px\] lg:text-\[40px\] xl:text-\[48px\]/);
  if (heroH1Match) {
    info.heroH1Size = 28;
    info.foundHero = true;
  }

  // Look for category labels - find text-[10px] specifically (mobile size)
  const categoryMatch = html.match(/text-\[10px\] md:text-xs/);
  if (categoryMatch) {
    info.categoryLabelSize = 10;
    info.foundCategoryLabel = true;
  }

  // Look for post card titles - find text-[18px] specifically (mobile size)
  const postCardMatch = html.match(/text-\[18px\] md:text-xl lg:text-2xl/);
  if (postCardMatch) {
    info.postCardTitleSize = 18;
    info.foundPostCard = true;
  }

  return info;
}

function checkMobileCompliance(typographyInfo) {
  const results = {
    passed: true,
    issues: []
  };

  // Check hero H1 (target: 28-30px on mobile)
  if (typographyInfo.heroH1Size) {
    if (typographyInfo.heroH1Size < 28 || typographyInfo.heroH1Size > 30) {
      results.passed = false;
      results.issues.push(`Hero H1 size ${typographyInfo.heroH1Size}px is outside target range (28-30px)`);
    }
  } else {
    results.passed = false;
    results.issues.push('Hero H1 size not found in HTML');
  }

  // Check category label (target: 10-12px on mobile)
  if (typographyInfo.categoryLabelSize) {
    if (typographyInfo.categoryLabelSize < 10 || typographyInfo.categoryLabelSize > 12) {
      results.passed = false;
      results.issues.push(`Category label size ${typographyInfo.categoryLabelSize}px is outside target range (10-12px)`);
    }
  } else {
    results.passed = false;
    results.issues.push('Category label size not found in HTML');
  }

  // Check post card title (target: 18-20px on mobile)
  if (typographyInfo.postCardTitleSize) {
    if (typographyInfo.postCardTitleSize < 18 || typographyInfo.postCardTitleSize > 20) {
      results.passed = false;
      results.issues.push(`Post card title size ${typographyInfo.postCardTitleSize}px is outside target range (18-20px)`);
    }
  } else {
    results.passed = false;
    results.issues.push('Post card title size not found in HTML');
  }

  return results;
}

async function main() {
  console.log('=== Mobile Typography Compliance Test ===\n');

  const url = 'https://blog.addiscrown.et/';
  console.log(`Testing: ${url}\n`);

  try {
    const { html, status } = await getHTML(url);
    
    if (status !== 200) {
      console.log(`❌ Failed to fetch homepage: Status ${status}`);
      process.exit(1);
    }

    console.log('✓ Homepage fetched successfully\n');

    const typographyInfo = extractTypographyInfo(html);
    console.log('Typography Information Found:');
    console.log(`  Hero H1 size: ${typographyInfo.heroH1Size}px`);
    console.log(`  Category label size: ${typographyInfo.categoryLabelSize}px`);
    console.log(`  Post card title size: ${typographyInfo.postCardTitleSize}px`);
    console.log(`  Found hero section: ${typographyInfo.foundHero}`);
    console.log(`  Found category labels: ${typographyInfo.foundCategoryLabel}`);
    console.log(`  Found post cards: ${typographyInfo.foundPostCard}\n`);

    const compliance = checkMobileCompliance(typographyInfo);

    console.log('=== Compliance Results ===');
    if (compliance.passed) {
      console.log('✅ All mobile typography targets are within acceptable ranges');
      console.log('\nMobile Typography Summary:');
      console.log('  Hero H1: 28-30px ✓');
      console.log('  Category labels: 10-12px ✓');
      console.log('  Post card titles: 18-20px ✓');
      process.exit(0);
    } else {
      console.log('❌ Mobile typography compliance issues found:');
      compliance.issues.forEach(issue => {
        console.log(`  - ${issue}`);
      });
      process.exit(1);
    }

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();