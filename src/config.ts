import type { GeneratorConfig } from "./types.js";

export const DEFAULT_SOURCE =
  "https://raw.githubusercontent.com/pytorch/pytorch/refs/heads/main/aten/src/ATen/native/native_functions.yaml";

export const defaultConfig: GeneratorConfig = {
  source: DEFAULT_SOURCE,
  outDir: "extensions/GF.Extensions.PyTorch/generated",
  allowlistPath: "config/op_allowlist_v1.txt",
  subset: {
    includeInternal: false,
    includeInplace: false,
    includeOut: false,
    includeMethods: false,
    requireTensorInput: true,
    requireTensorOutput: true,
    maxOps: 250
  }
};