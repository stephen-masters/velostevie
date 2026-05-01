// Validates that every image path referenced in article front matter
// (the `image` and `thumbnail.url` fields) resolves to a real file under assets/.
// No browser or running server needed.
//
// Run with Node 24:
//   NVM_DIR="$HOME/.nvm" source "$NVM_DIR/nvm.sh" && nvm use
//   node --test tests/content-images.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const CONTENT_DIR = join(ROOT, 'content', 'articles');
const ASSETS_DIR = join(ROOT, 'assets');

async function* walkMarkdown(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkMarkdown(full);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      yield full;
    }
  }
}

// Extract the YAML front matter block from a markdown file (between the --- delimiters).
function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : '';
}

// Pull out `image:` and `thumbnail.url:` values.
// Handles quoted and unquoted values.
function extractImagePaths(frontMatter) {
  const paths = [];

  const imageMatch = frontMatter.match(/^image:\s*"?([^"\n]+)"?\s*$/m);
  if (imageMatch) paths.push(imageMatch[1].trim());

  const thumbMatch = frontMatter.match(/^\s+url:\s*"?([^"\n]+)"?\s*$/m);
  if (thumbMatch) paths.push(thumbMatch[1].trim());

  return paths;
}

// Convert a root-relative image path (/images/articles/…) to the source file
// path under assets/ (assets/images/articles/…).
function toAssetPath(imagePath) {
  const withoutLeadingSlash = imagePath.replace(/^\//, '');
  return join(ASSETS_DIR, withoutLeadingSlash);
}

test('all front matter image references resolve to existing files in assets/', async () => {
  const missing = [];
  let checked = 0;

  for await (const mdPath of walkMarkdown(CONTENT_DIR)) {
    const content = await readFile(mdPath, 'utf8');
    const frontMatter = parseFrontMatter(content);
    const imagePaths = extractImagePaths(frontMatter);

    for (const imagePath of imagePaths) {
      const assetPath = toAssetPath(imagePath);
      try {
        await access(assetPath);
        checked++;
      } catch {
        missing.push({ article: mdPath.replace(ROOT, ''), image: imagePath });
      }
    }
  }

  if (missing.length > 0) {
    const list = missing.map(m => `  ${m.article}\n    → ${m.image}`).join('\n');
    assert.fail(`${missing.length} front matter image reference(s) point to missing files:\n${list}`);
  }

  assert.ok(checked > 0, 'No front matter image references found — check the parser');
  console.log(`  ${checked} front matter image reference(s) all resolve to existing files`);
});
