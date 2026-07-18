import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// ─── Wiki Sections (categories) ───────────────────────────────────────────
export const wikiSections = sqliteTable("wiki_sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(""),
});

// ─── Wiki Pages (main content — largest table) ────────────────────────────
export const wikiPages = sqliteTable("wiki_pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  sectionId: integer("section_id")
    .notNull()
    .references(() => wikiSections.id, { onDelete: "cascade" }),
  tags: text("tags", { mode: "json" }).$type<string[]>().default([]),
  isDraft: integer("is_draft", { mode: "boolean" }).notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: text("created_at").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(""),
});

// ─── Blog Posts (metadata synced from MDX) ────────────────────────────────
export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  category: text("category").notNull().default(""),
  tags: text("tags", { mode: "json" }).$type<string[]>().default([]),
  isDraft: integer("is_draft", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(""),
});

// ─── Projects ─────────────────────────────────────────────────────────────
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  tags: text("tags", { mode: "json" }).$type<string[]>().default([]),
  liveUrl: text("live_url"),
  repoUrl: text("repo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(""),
});

// ─── Site Settings (key-value) ────────────────────────────────────────────
export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(""),
});
