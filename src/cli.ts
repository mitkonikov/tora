import { defaultConfig } from "./config.js";
import { runGenerator } from "./generator.js";
import type { GeneratorConfig } from "./types.js";

function readArg(name: string): string | undefined {
  const idx = process.argv.indexOf(name);
  if (idx < 0) return undefined;
  return process.argv[idx + 1];
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

function parseNumber(name: string, fallback: number): number {
  const v = readArg(name);
  if (!v) return fallback;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error(`Invalid value for ${name}: ${v}`);
  }
  return n;
}

function parseRegex(name: string): RegExp | undefined {
  const v = readArg(name);
  if (!v) return undefined;
  return new RegExp(v);
}

async function main(): Promise<void> {
  const source = readArg("--source") ?? defaultConfig.source;
  const outDir = readArg("--out") ?? defaultConfig.outDir;
  const allowlistPath = readArg("--allowlist") ?? defaultConfig.allowlistPath;

  const config: GeneratorConfig = {
    ...defaultConfig,
    source,
    outDir,
    allowlistPath,
    includeNameRegex: parseRegex("--include")
  };

  config.subset = {
    ...defaultConfig.subset,
    maxOps: parseNumber("--max", defaultConfig.subset.maxOps),
    includeInternal: hasFlag("--include-internal"),
    includeInplace: hasFlag("--include-inplace"),
    includeOut: hasFlag("--include-out"),
    includeMethods: hasFlag("--include-methods")
  };

  await runGenerator(config);
  console.log(`Generated node definitions in: ${outDir}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});