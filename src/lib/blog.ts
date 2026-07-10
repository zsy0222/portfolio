import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "src/content");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  tags?: string[];
  draft?: boolean;
}

export const categories = [
  { slug: "research", label: "Research" },
  { slug: "course-notes", label: "Course Notes" },
  { slug: "cross-disciplinary", label: "Cross-disciplinary" },
  { slug: "projects", label: "Projects" },
  { slug: "career-future", label: "Career & Future" },
  { slug: "casual", label: "Casual" },
];

function getAllMdxFiles(): string[] {
  const results: string[] = [];
  const scan = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.name.endsWith(".mdx")) {
        results.push(fullPath);
      }
    }
  };
  scan(contentDir);
  return results;
}

export function getAllPosts(): BlogPost[] {
  const files = getAllMdxFiles();
  const posts: BlogPost[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf-8");
    const { data } = matter(raw);
    if (data.draft) continue;

    const relativePath = path.relative(contentDir, file);
    const category = path.dirname(relativePath).split(path.sep)[0];
    const slug = path.basename(file, ".mdx");

    posts.push({
      slug,
      title: data.title || slug,
      date: data.date ? new Date(data.date).toISOString() : "",
      category: data.category || category,
      summary: data.summary || "",
      tags: data.tags || [],
      draft: data.draft || false,
    });
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find((p) => p.slug === slug) || null;
}

export function getPostFilePath(slug: string): string | null {
  const files = getAllMdxFiles();
  for (const file of files) {
    if (path.basename(file, ".mdx") === slug) {
      return file;
    }
  }
  return null;
}
