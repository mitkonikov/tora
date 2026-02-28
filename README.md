# Tora

Torch Automatic Rewriter and Adapter (TORA) is a cute little 💖 automatic transpiler for PyTorch function definition to proprietary C++ code with bindings to the libtorch C++ API functions.

1. Reads PyTorch `native_functions.yaml`
2. Parses function schemas into typed IR
3. Filters by a file-based allowlist
4. Emits C++ node definition files with deterministic IDs

## Project structure

- `src/cli.ts` - CLI entrypoint
- `src/generator.ts` - end-to-end generation pipeline
- `src/schemaParser.ts` - `func:` schema parser
- `src/subset.ts` - subset filtering logic
- `src/templates.ts` - per-argument/return template mapping
- `src/renderer.ts` - C++ node rendering
- `src/naming.ts` - naming + deterministic UUID generation

## Install & run

```bash
npm install
npm run gen
```

Default output: `extensions/GF.Extensions.PyTorch/generated/nodes/*.hpp` + `extensions/GF.Extensions.PyTorch/generated/manifest.txt`

## CLI options

```bash
npm run gen -- --source <url_or_file> --out <dir> --allowlist <file> --max <n> --include <regex>
```

Flags:

- `--include-internal`
- `--include-inplace`
- `--include-out`
- `--include-methods`

Example (small focused subset):

```bash
npm run gen -- --max 30 --include "^(add|sub|mul|div|matmul)$"
```

## Current v1 function selection

- function selection is controlled by `config/op_allowlist_v1.txt`
- one op per line (`op` or `op.overload`)
- comments allowed via `#`
- generated order follows source YAML order
- `--max` still caps generated count

Default allowlist path is set in `src/config.ts`.

## Deterministic IDs

Implementation IDs are generated from the canonical parsed signature (`schemaSignature`) using SHA-1-derived UUID bytes, then emitted in your `Core::Uuid(...)` constructor format.
