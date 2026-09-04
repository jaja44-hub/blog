"use client";
import Giscus from "@giscus/react";

// Uses GitHub Discussions as the comment backend — no database needed.
// Fill in repo/repoId/category/categoryId from https://giscus.app once
// Discussions is enabled on the blog's GitHub repo.
export default function Comments() {
  return (
    <div className="mt-12">
      <Giscus
        id="comments"
        repo="jaja44-hub/blog-addiscrown"
        repoId="REPLACE_WITH_REPO_ID"
        category="Comments"
        categoryId="REPLACE_WITH_CATEGORY_ID"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="light"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
