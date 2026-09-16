#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function getLocalCSS() {
  const cssPath = path.join(__dirname, '../app/globals.css');
  return fs.readFileSync(cssPath, 'utf8');
}

function extractArticleTypographyInfo(css) {
  const info = {
    articleBodySize: null,
    articleBodyLineHeight: null,
    articleH2Size: null,
    articleH2LineHeight: null,
    foundArticleBody: false,
    foundArticleH2: false
  };

  // Look for mobile-specific styles
  const mobileBodyMatch = css.match(/\.prose-article p\s*\{[^}]*font-size:\s*(\d+)px[^}]*line-height:\s*([\d.]+)/);
  if (mobileBodyMatch) {
    info.articleBodySize = parseInt(mobileBodyMatch[1]);
    info.articleBodyLineHeight = parseFloat(mobileBodyMatch[2]);
    info.foundArticleBody = true;
  }

  const mobileH2Match = css.match(/\.prose-article h2\s*\{[^}]*font-size:\s*(\d+)px[^}]*line-height:\s*([\d.]+)/);
  if (mobileH2Match) {
    info.articleH2Size = parseInt(mobileH2Match[1]);
    info.articleH2LineHeight = parseFloat(mobileH2Match[2]);
    info.foundArticleH2 = true;
  }

  return info;
}

function checkArticleCompliance(typographyInfo) {
  const results = {
    passed: true,
    issues: []
  };

  // Check article body (target: 16px, line-height 1.55)
  if (typographyInfo.articleBodySize) {
    if (typographyInfo.articleBodySize !== 16) {
      results.passed = false;
      results.issues.push(`Article body size ${typographyInfo.articleBodySize}px does not match target (16px)`);
    }
  } else {
    results.passed = false;
    results.issues.push('Article body size not found in CSS');
  }

  if (typographyInfo.articleBodyLineHeight) {
    if (Math.abs(typographyInfo.articleBodyLineHeight - 1.55) > 0.05) {
      results.passed = false;
      results.issues.push(`Article body line-height ${typographyInfo.articleBodyLineHeight} does not match target (1.55)`);
    }
  } else {
    results.passed = false;
    results.issues.push('Article body line-height not found in CSS');
  }

  // Check article H2 (target: 22px, line-height 1.15)
  if (typographyInfo.articleH2Size) {
    if (typographyInfo.articleH2Size !== 22) {
      results.passed = false;
      results.issues.push(`Article H2 size ${typographyInfo.articleH2Size}px does not match target (22px)`);
    }
  } else {
    results.passed = false;
    results.issues.push('Article H2 size not found in CSS');
  }

  if (typographyInfo.articleH2LineHeight) {
    if (Math.abs(typographyInfo.articleH2LineHeight - 1.15) > 0.05) {
      results.passed = false;
      results.issues.push(`Article H2 line-height ${typographyInfo.articleH2LineHeight} does not match target (1.15)`);
    }
  } else {
    results.passed = false;
    results.issues.push('Article H2 line-height not found in CSS');
  }

  return results;
}

function checkArticleCompliance(typographyInfo) {
  const results = {
    passed: true,
    issues: []
  };

  // Check article body (target: 16px, line-height 1.55)
  if (typographyInfo.articleBodySize) {
    if (typographyInfo.articleBodySize !== 16) {
      results.passed = false;
      results.issues.push(`Article body size ${typographyInfo.articleBodySize}px does not match target (16px)`);
    }
  } else {
    results.passed = false;
    results.issues.push('Article body size not found in CSS');
  }

  if (typographyInfo.articleBodyLineHeight) {
    if (Math.abs(typographyInfo.articleBodyLineHeight - 1.55) > 0.05) {
      results.passed = false;
      results.issues.push(`Article body line-height ${typographyInfo.articleBodyLineHeight} does not match target (1.55)`);
    }
  } else {
    results.passed = false;
    results.issues.push('Article body line-height not found in CSS');
  }

  // Check article H2 (target: 22px, line-height 1.15)
  if (typographyInfo.articleH2Size) {
    if (typographyInfo.articleH2Size !== 22) {
      results.passed = false;
      results.issues.push(`Article H2 size ${typographyInfo.articleH2Size}px does not match target (22px)`);
    }
  } else {
    results.passed = false;
    results.issues.push('Article H2 size not found in CSS');
  }

  if (typographyInfo.articleH2LineHeight) {
    if (Math.abs(typographyInfo.articleH2LineHeight - 1.15) > 0.05) {
      results.passed = false;
      results.issues.push(`Article H2 line-height ${typographyInfo.articleH2LineHeight} does not match target (1.15)`);
    }
  } else {
    results.passed = false;
    results.issues.push('Article H2 line-height not found in CSS');
  }

  return results;
}

async function main() {
  console.log('=== Article Typography Compliance Test ===\n');

  try {
    const css = getLocalCSS();
    console.log('✓ Local CSS file loaded successfully\n');

    const typographyInfo = extractArticleTypographyInfo(css);
    console.log('Article Typography Information Found:');
    console.log(`  Article body size: ${typographyInfo.articleBodySize}px`);
    console.log(`  Article body line-height: ${typographyInfo.articleBodyLineHeight}`);
    console.log(`  Article H2 size: ${typographyInfo.articleH2Size}px`);
    console.log(`  Article H2 line-height: ${typographyInfo.articleH2LineHeight}`);
    console.log(`  Found article body: ${typographyInfo.foundArticleBody}`);
    console.log(`  Found article H2: ${typographyInfo.foundArticleH2}\n`);

    const compliance = checkArticleCompliance(typographyInfo);

    console.log('=== Compliance Results ===');
    if (compliance.passed) {
      console.log('✅ All article typography targets are within acceptable ranges');
      console.log('\nArticle Typography Summary:');
      console.log('  Article body: 16px, line-height 1.55 ✓');
      console.log('  Article H2: 22px, line-height 1.15 ✓');
      process.exit(0);
    } else {
      console.log('❌ Article typography compliance issues found:');
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