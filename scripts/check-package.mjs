import { spawn } from "node:child_process";
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const npmCliPath = process.env.npm_execpath;
const publicPackageFiles = Object.freeze([
  "LICENSE",
  "README.md",
  "framebase-highlight.css",
  "framebase-highlight.min.css",
  "framebase-light.css",
  "framebase-light.min.css",
  "framebase-theme-template.css",
  "framebase-themes.css",
  "framebase-themes.min.css",
  "framebase.css",
  "framebase.min.css",
]);

/** Runs a local command and returns captured output or a reproducible failure. */
function runCommand(command, args, cwd) {
  // Coordinates completion and captured diagnostics for one fixed child process.
  return new Promise((resolveCommand, rejectCommand) => {
    const child = spawn(command, args, {
      cwd,
      shell: false,
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";

    // Captures standard output for JSON parsing and successful diagnostics.
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    // Captures standard error so failures retain the originating command detail.
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", rejectCommand);
    // Resolves only successful commands and translates other exits into errors.
    child.on("close", (code) => {
      if (code === 0) {
        resolveCommand({ stdout, stderr });
        return;
      }

      rejectCommand(new Error(
        `${command} ${args.join(" ")} failed with exit code ${code}\n${stderr || stdout}`,
      ));
    });
  });
}

/** Lists regular files below a directory using stable package-style paths. */
async function listFiles(root, current = root) {
  const entries = await readdir(current, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = join(current, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(root, absolutePath));
    } else if (entry.isFile()) {
      files.push(relative(root, absolutePath).replaceAll("\\", "/"));
    }
  }

  return files.sort();
}

/** Fails with a concise diff when two stable file lists do not match. */
function assertSameFiles(label, actual, expected) {
  // Identifies both absent contract files and additions outside the contract.
  const missing = expected.filter((filename) => !actual.includes(filename));
  const unexpected = actual.filter((filename) => !expected.includes(filename));

  if (missing.length > 0 || unexpected.length > 0) {
    throw new Error(
      `${label} differs; missing: ${missing.join(", ") || "none"}; `
      + `unexpected: ${unexpected.join(", ") || "none"}`,
    );
  }
}

/** Verifies that every local import in an installed CSS asset resolves. */
async function verifyCssImports(packageDirectory, cssFiles) {
  for (const filename of cssFiles) {
    const absolutePath = join(packageDirectory, filename);
    const source = await readFile(absolutePath, "utf8");
    // Extracts local quoted imports while leaving remote consumer choices untouched.
    const imports = [...source.matchAll(/@import\s+(?:url\(\s*)?["']([^"']+)["']/g)]
      .map((match) => match[1])
      .filter((reference) => !/^(?:data:|https?:)/.test(reference));

    for (const reference of imports) {
      const localReference = reference.split(/[?#]/, 1)[0];
      await access(resolve(dirname(absolutePath), localReference));
    }
  }
}

/** Packs and installs the public package exactly as a consumer receives it. */
async function main() {
  if (!npmCliPath) {
    throw new Error("run this check through npm run check:package");
  }

  const packageJson = JSON.parse(
    await readFile(join(repositoryRoot, "package.json"), "utf8"),
  );
  assertSameFiles(
    "package.json files allowlist",
    [...packageJson.files].sort(),
    [...publicPackageFiles].sort(),
  );
  const temporaryRoot = await mkdtemp(join(tmpdir(), "framebasecss-package-"));

  try {
    const packDirectory = join(temporaryRoot, "pack");
    const consumerDirectory = join(temporaryRoot, "consumer");
    await Promise.all([
      mkdir(packDirectory, { recursive: true }),
      mkdir(consumerDirectory, { recursive: true }),
    ]);

    const packed = await runCommand(
      process.execPath,
      [
        npmCliPath,
        "pack",
        "--ignore-scripts",
        "--json",
        "--pack-destination",
        packDirectory,
      ],
      repositoryRoot,
    );
    const [packResult] = JSON.parse(packed.stdout);
    const expectedFiles = [...publicPackageFiles, "package.json"].sort();
    // Normalizes npm's detailed manifest to the public filename contract.
    const packedFiles = packResult.files.map(({ path }) => path).sort();
    assertSameFiles("packed file set", packedFiles, expectedFiles);

    await writeFile(
      join(consumerDirectory, "package.json"),
      `${JSON.stringify({ private: true, type: "module" }, null, 2)}\n`,
      "utf8",
    );
    const tarballPath = join(packDirectory, packResult.filename);
    await runCommand(
      process.execPath,
      [
        npmCliPath,
        "install",
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
        "--package-lock=false",
        tarballPath,
      ],
      consumerDirectory,
    );

    const installedDirectory = join(consumerDirectory, "node_modules", packageJson.name);
    assertSameFiles(
      "installed file set",
      await listFiles(installedDirectory),
      expectedFiles,
    );

    // Converts package export keys into consumer import specifiers and file targets.
    const exportContracts = Object.entries(packageJson.exports).map(([subpath, target]) => ({
      specifier: subpath === "." ? packageJson.name : `${packageJson.name}${subpath.slice(1)}`,
      target: target.replace(/^\.\//, ""),
    }));
    // Generates an isolated consumer assertion for every declared public export.
    const resolverSource = `${exportContracts.map(({ specifier, target }) => `
{
  const resolved = import.meta.resolve(${JSON.stringify(specifier)});
  if (!resolved.endsWith(${JSON.stringify(`/${target}`)})) {
    throw new Error(${JSON.stringify(specifier)} + " resolved to " + resolved);
  }
}`).join("\n")}\n`;
    const resolverPath = join(consumerDirectory, "verify-exports.mjs");
    await writeFile(resolverPath, resolverSource, "utf8");
    await runCommand(process.execPath, [resolverPath], consumerDirectory);

    await verifyCssImports(
      installedDirectory,
      expectedFiles.filter((filename) => filename.endsWith(".css")),
    );
    console.log(
      `verified ${packageJson.name}@${packageJson.version} as an isolated packed consumer `
      + `(${expectedFiles.length} files, ${exportContracts.length} exports)`,
    );
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

// Converts a rejected package contract into a concise non-zero CLI result.
await main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
