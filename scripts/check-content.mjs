import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "src/content");
const validCategories = [
  "research",
  "course-notes",
  "cross-disciplinary",
  "projects",
  "career-future",
  "casual",
];
const requiredFields = ["title", "date", "category", "summary"];

let errors = [];

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scan(fullPath);
    } else if (entry.name.endsWith(".mdx")) {
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data } = matter(raw);
      const relPath = path.relative(process.cwd(), fullPath);

      for (const field of requiredFields) {
        if (!data[field]) {
          errors.push(`${relPath}: missing required field "${field}"`);
        }
      }

      if (data.category && !validCategories.includes(data.category)) {
        errors.push(
          `${relPath}: invalid category "${data.category}". Valid: ${validCategories.join(", ")}`
        );
      }

      if (data.date) {
        const d = new Date(data.date);
        if (isNaN(d.getTime())) {
          errors.push(`${relPath}: invalid date "${data.date}"`);
        }
      }
    }
  }
}

try {
  scan(contentDir);
} catch (e) {
  errors.push(`Failed to scan content: ${e.message}`);
}

if (errors.length > 0) {
  console.error("Content check failed:");
  for (const err of errors) {
    console.error(`  ${err}`);
  }
  process.exit(1);
} else {
  console.log("Content check passed.");
}
