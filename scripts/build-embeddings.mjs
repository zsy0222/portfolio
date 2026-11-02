import matter from "gray-matter";
import { readdir, readFile, writeFile } from "fs/promises";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, "..", "src", "content");
const publicDir = join(__dirname, "..", "public");

const wikiItems = [
  { id: "frontend/next-notes", title: "Next.js Notes", text: "Next.js App Router, Turbopack, server components, client components, routing conventions" },
  { id: "frontend/vercel-deploy", title: "Vercel Deploy", text: "Vercel deployment, environment variables, edge functions, serverless functions" },
  { id: "frontend/css-template", title: "CSS Template", text: "Tailwind CSS v4, theme configuration, dark mode, responsive design" },
  { id: "ai-agent/agents-md-spec", title: "AGENTS.md Spec", text: "AGENTS.md specification, AI agent instructions, project rules, workflow guidance" },
  { id: "ai-agent/rag-practice", title: "RAG Practice", text: "Retrieval augmented generation, embedding models, vector search, all-MiniLM-L6-v2" },
  { id: "ai-agent/multi-agent-design", title: "Multi-Agent Design", text: "Multi-agent systems, agent coordination, task delegation, agent communication" },
  { id: "paper/ai-product-papers", title: "AI Product Papers", text: "AI product management papers, LLM applications, AI product strategy" },
  { id: "paper/quantitative-analysis-notes", title: "Quantitative Analysis Notes", text: "Quantitative analysis, statistical methods, data analysis, financial modeling" },
  { id: "project-record/portfolio-build-log", title: "Portfolio Build Log", text: "Portfolio website build log, Next.js, Tailwind CSS, Vercel deployment" },
  { id: "project-record/git-operation-standard", title: "Git Operation Standard", text: "Git workflow, branching strategy, commit conventions, pull request process" },
  { id: "career/resume-template", title: "Resume Template", text: "Resume template, CV format, job application, professional experience" },
  { id: "career/job-match-logic", title: "Job Match Logic", text: "Job matching algorithm, career planning, skill matching, job search strategy" },
  { id: "misc/npm-npx-diff", title: "npm vs npx", text: "Difference between npm and npx, package execution, Node.js tooling" },
  { id: "misc/cloudbase-free-rule", title: "CloudBase Free Rule", text: "Tencent CloudBase free tier rules, cloud hosting, static site hosting" },
];

/** Read only published MDX; importing this function never loads an embedding model. */
export async function readMdxFiles(directory = contentDir) {
  const files = [];
  async function scan(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const filePath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await scan(filePath);
      } else if (entry.name.endsWith(".mdx")) {
        const raw = await readFile(filePath, "utf-8");
        const { data, content } = matter(raw);
        if (data.draft) continue;
        const slug = entry.name.slice(0, -4);
        const text = content.replace(/^#\s+.+$/m, "").trim();
        files.push({
          id: `blog/${slug}`,
          title: data.title || slug,
          text: text.slice(0, 2000),
        });
      }
    }
  }
  await scan(directory);
  return files;
}

async function main() {
  const { pipeline } = await import("@huggingface/transformers");
  console.log("Loading embedding model: all-MiniLM-L6-v2 (ONNX)...");
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );

  const blogDocs = await readMdxFiles();
  const allDocs = [...blogDocs, ...wikiItems];

  console.log(`Generating embeddings for ${allDocs.length} documents...`);

  const results = [];
  for (const doc of allDocs) {
    const output = await extractor(doc.text, { pooling: "mean", normalize: true });
    const snippet = doc.text.slice(0, 200).replace(/\n+/g, " ").trim();
    const type = doc.id.startsWith("blog/") ? "blog" : "wiki";
    results.push({
      id: doc.id,
      title: doc.title,
      type,
      snippet,
      embedding: Array.from(output.data),
    });
  }

  const outPath = join(publicDir, "embeddings.json");
  await writeFile(outPath, JSON.stringify(results));
  console.log(`Saved ${results.length} embeddings to ${outPath}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
