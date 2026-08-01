import { access, readFile } from "node:fs/promises";
import process from "node:process";

const requiredFiles = Object.freeze([
  "framebase.css",
  "framebase.min.css",
  "framebase-light.css",
  "framebase-light.min.css",
  "framebase-theme-template.css",
  "framebase-highlight.css",
  "framebase-highlight.min.css",
  "framebase-themes.css",
  "framebase-themes.min.css",
  "README.md",
  "LICENSE",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "VERSIONING.md",
  "CODE_INDEX.md",
  "index.html",
  "framebase-light-demo.html",
  "docs/index.html",
  "docs/components.html",
  "docs/themes.html",
  "docs/accessibility.html",
  "docs/browser-support.html",
  "docs/rtl.html",
]);

const publicHtmlFiles = Object.freeze([
  "index.html",
  "framebase-light-demo.html",
  "docs/index.html",
  "docs/components.html",
  "docs/themes.html",
  "docs/accessibility.html",
  "docs/browser-support.html",
  "docs/rtl.html",
]);

/** Resolves a repository-root file from this script. */
function repositoryFile(filename) {
  return new URL(`../${filename}`, import.meta.url);
}

/** Extracts token declarations from the first rule matching a selector fragment. */
function extractTokenBlock(source, selectorFragment) {
  const selectorIndex = source.indexOf(selectorFragment);
  const openingBrace = source.indexOf("{", selectorIndex);
  const closingBrace = source.indexOf("}", openingBrace);

  if (selectorIndex < 0 || openingBrace < 0 || closingBrace < 0) {
    throw new Error(`Unable to read token block for ${selectorFragment}`);
  }

  const declarations = source.slice(openingBrace + 1, closingBrace);
  // Normalizes declaration whitespace so readable formatting cannot create drift.
  return new Map(
    [...declarations.matchAll(/(--fb-[\w-]+)\s*:\s*([^;]+);/g)]
      .map((match) => [match[1], match[2].replace(/\s+/g, " ").trim()]),
  );
}

/** Verifies that every public release asset and governance document exists. */
async function verifyRequiredFiles() {
  // Resolves each fixed public file before performing deeper checks.
  await Promise.all(requiredFiles.map((filename) => access(repositoryFile(filename))));
}

/** Verifies the public package metadata and its declared distribution files. */
async function verifyPackageMetadata() {
  const packageJson = JSON.parse(await readFile(repositoryFile("package.json"), "utf8"));

  if (packageJson.private === true) {
    throw new Error("package.json must remain eligible for an intentional public release");
  }

  for (const filename of requiredFiles.slice(0, 11)) {
    if (!packageJson.files.includes(filename)) {
      throw new Error(`${filename}: missing from package.json files`);
    }
  }
}

/** Verifies complete custom-theme coverage and fixed/controlled light-token parity. */
async function verifyThemeContracts() {
  const [base, template, light, themes] = await Promise.all([
    readFile(repositoryFile("framebase.css"), "utf8"),
    readFile(repositoryFile("framebase-theme-template.css"), "utf8"),
    readFile(repositoryFile("framebase-light.css"), "utf8"),
    readFile(repositoryFile("framebase-themes.css"), "utf8"),
  ]);
  const baseTokens = extractTokenBlock(base, ":root");
  const templateTokens = extractTokenBlock(template, ":root");
  const lightTokens = extractTokenBlock(light, ":root");
  const controlledLightTokens = extractTokenBlock(themes, ':root[data-theme="light"]');

  const missingTemplateTokens = [...baseTokens.keys()]
    // Keeps the editable template complete as new public root tokens are added.
    .filter((token) => !templateTokens.has(token));
  if (missingTemplateTokens.length > 0) {
    throw new Error(`theme template is missing: ${missingTemplateTokens.join(", ")}`);
  }

  for (const [token, value] of lightTokens) {
    if (controlledLightTokens.get(token) !== value) {
      throw new Error(`${token}: fixed and controlled light themes differ`);
    }
  }
}

/** Verifies local HTML links, assets, and fragment targets across public pages. */
async function verifyPublicLinks() {
  for (const filename of publicHtmlFiles) {
    const sourceUrl = repositoryFile(filename);
    const source = await readFile(sourceUrl, "utf8");
    const documentMarkup = source.replace(/<pre[\s\S]*?<\/pre>/g, "");
    // Excludes escaped examples and retains links from actual document markup.
    const references = [...documentMarkup.matchAll(/(?:href|src)="([^"]+)"/g)]
      .map((match) => match[1]);

    for (const reference of references) {
      if (/^(?:https?:|data:|mailto:)/.test(reference)) {
        continue;
      }

      const targetUrl = new URL(reference, sourceUrl);
      targetUrl.hash = "";
      try {
        await access(targetUrl);
      } catch {
        throw new Error(`${filename}: missing local reference ${reference}`);
      }

      const fragment = new URL(reference, sourceUrl).hash.slice(1);
      if (fragment) {
        const target = await readFile(targetUrl, "utf8");
        const encodedId = `id="${decodeURIComponent(fragment)}"`;
        if (!target.includes(encodedId)) {
          throw new Error(`${filename}: unresolved fragment ${reference}`);
        }
      }
    }
  }
}

/** Runs the non-mutating release-readiness checks. */
async function main() {
  await verifyRequiredFiles();
  await verifyPackageMetadata();
  await verifyThemeContracts();
  await verifyPublicLinks();
  console.log("verified public release assets and package metadata");
}

// Converts a rejected readiness check into a concise non-zero CLI result.
await main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
