import { readFile, writeFile } from "node:fs/promises";
import process from "node:process";
import CleanCSS from "clean-css";

const assets = Object.freeze([
  ["framebase.css", "framebase.min.css"],
  ["framebase-light.css", "framebase-light.min.css"],
  ["framebase-highlight.css", "framebase-highlight.min.css"],
]);

const checkOnly = process.argv.includes("--check");

/** Resolves a repository-root asset from this script's fixed asset list. */
function assetUrl(filename) {
  return new URL(`../${filename}`, import.meta.url);
}

/** Minifies one stylesheet while preserving all license comments. */
function minifyStylesheet(source, sourceName) {
  const result = new CleanCSS({
    inline: ["none"],
    level: {
      1: { specialComments: "all" },
      2: false,
    },
    rebase: false,
  }).minify(source);

  if (result.errors.length > 0) {
    throw new Error(`${sourceName}: ${result.errors.join("; ")}`);
  }

  if (result.warnings.length > 0) {
    throw new Error(`${sourceName}: ${result.warnings.join("; ")}`);
  }

  let styles = result.styles;

  if (!styles.startsWith("/*!")) {
    throw new Error(`${sourceName}: the MIT license banner was not preserved`);
  }

  if (sourceName === "framebase-light.css") {
    const sourceImport = /@import\s+url\(["']?(?:\.\/)?framebase\.css["']?\)/;
    if (!sourceImport.test(styles)) {
      throw new Error(`${sourceName}: the base stylesheet import was not preserved`);
    }
    styles = styles.replace(sourceImport, "@import url(framebase.min.css)");
  }

  return `${styles}\n`;
}

/** Builds and validates every minified asset before any output is written. */
async function prepareAssets() {
  return Promise.all(
    assets.map(async ([sourceName, outputName]) => {
      const source = await readFile(assetUrl(sourceName), "utf8");
      const minified = minifyStylesheet(source, sourceName);

      const baseImport = /@import\s+url\(["']?framebase\.min\.css["']?\)/;
      if (sourceName === "framebase-light.css" &&
          !baseImport.test(minified)) {
        throw new Error(`${sourceName}: the minified base import was not generated`);
      }

      return { minified, outputName };
    }),
  );
}

/** Writes generated assets or verifies that committed copies are current. */
async function processAssets(preparedAssets) {
  for (const { minified, outputName } of preparedAssets) {
    const outputUrl = assetUrl(outputName);

    if (checkOnly) {
      let committed;
      try {
        committed = await readFile(outputUrl, "utf8");
      } catch (error) {
        if (error.code === "ENOENT") {
          throw new Error(`${outputName}: generated file is missing`);
        }
        throw error;
      }

      if (committed !== minified) {
        throw new Error(`${outputName}: generated file is out of date`);
      }
    } else {
      await writeFile(outputUrl, minified, "utf8");
    }

    console.log(`${checkOnly ? "verified" : "generated"} ${outputName}`);
  }
}

/** Runs the deterministic build or non-mutating verification workflow. */
async function main() {
  const preparedAssets = await prepareAssets();
  await processAssets(preparedAssets);
}

await main();
