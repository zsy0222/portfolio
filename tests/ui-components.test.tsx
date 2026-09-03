import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import Icon, { type IconName } from "../src/components/Icon";
import ArticleReader from "../src/components/ArticleReader";
import BackToTop from "../src/components/BackToTop";
import FormField from "../src/components/FormField";
import ZoomableImage from "../src/components/ZoomableImage";
import { getAllPosts } from "../src/lib/blog";

test("icons share dimensions and stroke without adding accessible noise", () => {
  const names: IconName[] = ["sun", "moon", "arrow-right", "arrow-left", "arrow-up", "arrow-down", "arrow-up-right", "copy", "close", "check", "zoom"];
  for (const name of names) {
    const html = renderToStaticMarkup(<Icon name={name} />);
    assert.match(html, /viewBox="0 0 24 24"/);
    assert.match(html, /stroke-width="1.65"/);
    assert.match(html, /aria-hidden="true"/);
  }
});

test("article images render accessible triggers without opening a dialog during SSR", () => {
  const html = renderToStaticMarkup(<p><ZoomableImage src="/images/test.png" alt="Diagram" width={800} height={400} /></p>);
  assert.match(html, /aria-label="Enlarge image: Diagram"/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /loading="lazy"/);
  assert.doesNotMatch(html, /<dialog/);
  assert.doesNotMatch(html, /<div/);
});

test("missing image sources do not produce broken preview controls", () => {
  assert.equal(renderToStaticMarkup(<ZoomableImage alt="Missing" />), "");
});

test("article body remains readable before hydration", () => {
  const html = renderToStaticMarkup(<ArticleReader><h2>Original heading</h2><p>Original content.</p></ArticleReader>);
  assert.match(html, /Original heading/);
  assert.match(html, /Original content\./);
  assert.match(html, /data-article-content/);
});

test("form labels and inline errors use matching field identifiers", () => {
  const html = renderToStaticMarkup(<FormField id="email" label="Email" error="Enter a valid email.">
    <input id="email" aria-describedby="email-error" aria-invalid="true" />
  </FormField>);
  assert.match(html, /for="email"/);
  assert.match(html, /id="email-error"/);
  assert.match(html, /role="alert"/);
});

test("back-to-top control is initially hidden and outside the keyboard sequence", () => {
  const html = renderToStaticMarkup(<BackToTop />);
  assert.match(html, /tabindex="-1"/);
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /data-visible="false"/);
});

test("unfinished posts stay excluded from the public blog", () => {
  const slugs = getAllPosts().map((post) => post.slug);
  assert(!slugs.includes("my-summer"));
  assert(!slugs.includes("hybrid-slicing-evolution"));
  assert(slugs.includes("summer-projects-2026"));
});
