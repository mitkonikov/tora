import { readFile } from "node:fs/promises";
import type { SubsetConfig, TorchFunction } from "./types.js";

function opIdentifier(fn: TorchFunction): string {
  return fn.overloadName ? `${fn.baseName}.${fn.overloadName}` : fn.baseName;
}

async function loadAllowlist(allowlistPath: string): Promise<Set<string>> {
  const text = await readFile(allowlistPath, "utf-8");
  const values = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !line.startsWith("#"));
  return new Set(values);
}

export async function filterSubset(
  functions: TorchFunction[],
  subset: SubsetConfig,
  includeNameRegex: RegExp | undefined,
  allowlistPath: string
): Promise<TorchFunction[]> {
  const allowlist = await loadAllowlist(allowlistPath);
  const out: TorchFunction[] = [];

  for (const fn of functions) {
    const opId = opIdentifier(fn);
    if (!allowlist.has(opId)) continue;
    if (includeNameRegex && !includeNameRegex.test(opId)) continue;
    out.push(fn);
    if (out.length >= subset.maxOps) break;
  }

  return out;
}