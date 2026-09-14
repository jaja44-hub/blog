import { blogger_v3 } from "googleapis";
import { getBloggerClient, getValidTokens, BloggerConfig, TokenSet } from "./client";

export interface BloggerPost {
  id?: string;
  title: string;
  content: string;
  labels?: string[];
  published?: boolean;
  publishedDate?: string;
  updated?: string;
  url?: string;
  selfLink?: string;
  author?: {
    id: string;
    displayName: string;
    url: string;
    image?: { url: string };
  };
  replies?: {
    totalItems: string;
    selfLink: string;
  };
}

export interface BloggerPage {
  id?: string;
  title: string;
  content: string;
  published?: boolean;
  publishedDate?: string;
  updated?: string;
  url?: string;
  selfLink?: string;
  status?: string;
}

export interface BloggerTheme {
  css?: string;
  html?: string;
}

export interface BloggerLayout {
  gadgets?: Array<{
    id: string;
    type: string;
    title: string;
    sectionId: string;
    settings?: Record<string, unknown>;
  }>;
}

export interface ListPostsOptions {
  maxResults?: number;
  pageToken?: string;
  status?: string[];
  labels?: string;
  fetchBodies?: boolean;
  view?: "ADMIN" | "AUTHOR" | "READER";
}

export interface ListPagesOptions {
  maxResults?: number;
  pageToken?: string;
  status?: string[];
}

class BloggerService {
  private config: BloggerConfig;
  private tokens: TokenSet;
  private blogId: string;

  constructor(config: BloggerConfig, tokens: TokenSet, blogId: string) {
    this.config = config;
    this.tokens = tokens;
    this.blogId = blogId;
  }

  private async getClient() {
    const validTokens = await getValidTokens(this.config, this.tokens);
    this.tokens = validTokens;
    return getBloggerClient(this.config, validTokens);
  }

  // ========== POSTS ==========

  async listPosts(options: ListPostsOptions = {}) {
    const client = await this.getClient();
    const response = await client.posts.list({
      blogId: this.blogId,
      maxResults: options.maxResults || 20,
      pageToken: options.pageToken,
      status: options.status,
      labels: options.labels,
      fetchBodies: options.fetchBodies ?? true,
      view: options.view || "ADMIN",
    } as blogger_v3.Params$Resource$Posts$List);
    return response.data;
  }

  async getPost(postId: string, view: "ADMIN" | "AUTHOR" | "READER" = "ADMIN") {
    const client = await this.getClient();
    const response = await client.posts.get({
      blogId: this.blogId,
      postId,
      view,
    } as blogger_v3.Params$Resource$Posts$Get);
    return response.data;
  }

  async getPostByPath(path: string, view: "ADMIN" | "AUTHOR" | "READER" = "ADMIN") {
    const client = await this.getClient();
    const response = await client.posts.getByPath({
      blogId: this.blogId,
      path,
      view,
    } as blogger_v3.Params$Resource$Posts$Getbypath);
    return response.data;
  }

  async createPost(post: BloggerPost, isDraft = false) {
    const client = await this.getClient();
    const response = await client.posts.insert({
      blogId: this.blogId,
      requestBody: {
        title: post.title,
        content: post.content,
        labels: post.labels,
        published: !isDraft,
      },
      isDraft,
    } as unknown as blogger_v3.Params$Resource$Posts$Insert);
    return response.data;
  }

  async updatePost(postId: string, post: Partial<BloggerPost>) {
    const client = await this.getClient();
    const response = await client.posts.patch({
      blogId: this.blogId,
      postId,
      requestBody: {
        title: post.title,
        content: post.content,
        labels: post.labels,
        published: post.published,
      },
    } as blogger_v3.Params$Resource$Posts$Patch);
    return response.data;
  }

  async deletePost(postId: string) {
    const client = await this.getClient();
    await client.posts.delete({
      blogId: this.blogId,
      postId,
    } as blogger_v3.Params$Resource$Posts$Delete);
    return { success: true };
  }

  async publishPost(postId: string) {
    const client = await this.getClient();
    const response = await client.posts.publish({
      blogId: this.blogId,
      postId,
    } as blogger_v3.Params$Resource$Posts$Publish);
    return response.data;
  }

  async revertPost(postId: string) {
    const client = await this.getClient();
    const response = await client.posts.revert({
      blogId: this.blogId,
      postId,
    } as blogger_v3.Params$Resource$Posts$Revert);
    return response.data;
  }

  // ========== PAGES ==========

  async listPages(options: ListPagesOptions = {}) {
    const client = await this.getClient();
    const response = await client.pages.list({
      blogId: this.blogId,
      maxResults: options.maxResults || 20,
      pageToken: options.pageToken,
      status: options.status,
    } as blogger_v3.Params$Resource$Pages$List);
    return response.data;
  }

  async getPage(pageId: string) {
    const client = await this.getClient();
    const response = await client.pages.get({
      blogId: this.blogId,
      pageId,
    } as blogger_v3.Params$Resource$Pages$Get);
    return response.data;
  }

  async createPage(page: BloggerPage, isDraft = false) {
    const client = await this.getClient();
    const response = await client.pages.insert({
      blogId: this.blogId,
      requestBody: {
        title: page.title,
        content: page.content,
        published: !isDraft,
        status: isDraft ? "DRAFT" : "LIVE",
      },
      isDraft,
    } as unknown as blogger_v3.Params$Resource$Pages$Insert);
    return response.data;
  }

  async updatePage(pageId: string, page: Partial<BloggerPage>) {
    const client = await this.getClient();
    const response = await client.pages.patch({
      blogId: this.blogId,
      pageId,
      requestBody: {
        title: page.title,
        content: page.content,
        published: page.published,
        status: page.status,
      },
    } as blogger_v3.Params$Resource$Pages$Patch);
    return response.data;
  }

  async deletePage(pageId: string) {
    const client = await this.getClient();
    await client.pages.delete({
      blogId: this.blogId,
      pageId,
    } as blogger_v3.Params$Resource$Pages$Delete);
    return { success: true };
  }

  async publishPage(pageId: string) {
    const client = await this.getClient();
    const response = await client.pages.publish({
      blogId: this.blogId,
      pageId,
    } as blogger_v3.Params$Resource$Pages$Publish);
    return response.data;
  }

  // ========== BLOG INFO ==========

  async getBlog() {
    const client = await this.getClient();
    const response = await client.blogs.get({
      blogId: this.blogId,
    } as blogger_v3.Params$Resource$Blogs$Get);
    return response.data;
  }

  async getBlogByUrl(url: string) {
    const client = await this.getClient();
    const response = await client.blogs.getByUrl({
      url,
    } as blogger_v3.Params$Resource$Blogs$Getbyurl);
    return response.data;
  }

  // ========== COMMENTS ==========

  async listComments(postId: string, maxResults = 20, pageToken?: string) {
    const client = await this.getClient();
    const response = await client.comments.list({
      blogId: this.blogId,
      postId,
      maxResults,
      pageToken,
    } as blogger_v3.Params$Resource$Comments$List);
    return response.data;
  }

  async getComment(postId: string, commentId: string) {
    const client = await this.getClient();
    const response = await client.comments.get({
      blogId: this.blogId,
      postId,
      commentId,
    } as blogger_v3.Params$Resource$Comments$Get);
    return response.data;
  }

  async approveComment(postId: string, commentId: string) {
    const client = await this.getClient();
    const response = await client.comments.approve({
      blogId: this.blogId,
      postId,
      commentId,
    } as blogger_v3.Params$Resource$Comments$Approve);
    return response.data;
  }

  async deleteComment(postId: string, commentId: string) {
    const client = await this.getClient();
    await client.comments.delete({
      blogId: this.blogId,
      postId,
      commentId,
    } as blogger_v3.Params$Resource$Comments$Delete);
    return { success: true };
  }

  async markCommentAsSpam(postId: string, commentId: string) {
    const client = await this.getClient();
    const response = await client.comments.markAsSpam({
      blogId: this.blogId,
      postId,
      commentId,
    } as blogger_v3.Params$Resource$Comments$Markasspam);
    return response.data;
  }

  async removeCommentContent(postId: string, commentId: string) {
    const client = await this.getClient();
    const response = await client.comments.removeContent({
      blogId: this.blogId,
      postId,
      commentId,
    } as blogger_v3.Params$Resource$Comments$Removecontent);
    return response.data;
  }

  // ========== USER INFO ==========

  async getUserInfo() {
    const client = await this.getClient();
    const response = await client.users.get({
      userId: "self",
    } as blogger_v3.Params$Resource$Users$Get);
    return response.data;
  }

  async getUserBlogs() {
    const client = await this.getClient();
    // The googleapis types may not have users.blogs, so we use any
    const response = await (client as any).users.blogs.list({
      userId: "self",
    });
    return response.data;
  }

  // ========== PAGEVIEWS / STATS ==========

  async getPageViews(blogId?: string) {
    const client = await this.getClient();
    const response = await client.pageViews.get({
      blogId: blogId || this.blogId,
    } as blogger_v3.Params$Resource$Pageviews$Get);
    return response.data;
  }

  // ========== THEME (limited - Blogger API v3 doesn't support full theme management) ==========
  // Note: Full theme HTML/CSS management requires the Blogger API v3 "pageviews" or manual HTML editing
  // The API has limited theme support. For full theme management, you'd need to use the Blogger UI
  // or the older Blogger API v2 with different scopes.

  // ========== HELPER METHODS ==========

  getTokens(): TokenSet {
    return this.tokens;
  }

  getBlogId(): string {
    return this.blogId;
  }
}

export function createBloggerService(config: BloggerConfig, tokens: TokenSet, blogId: string) {
  return new BloggerService(config, tokens, blogId);
}