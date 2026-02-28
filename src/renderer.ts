import { makeDisplayName, makeNodeClassName, signatureUuid, uuidToCppCtor } from "./naming.js";
import { renderInputAliasType, renderReturnAliasType } from "./templates.js";
import type { TorchFunction } from "./types.js";

function safeAliasName(input: string): string {
  return input.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^([0-9])/, "_$1");
}

export function renderNodeDefinition(fn: TorchFunction): string {
  const className = makeNodeClassName(fn);
  const displayName = makeDisplayName(fn);
  const opName = fn.overloadName ? `${fn.baseName}.${fn.overloadName}` : fn.baseName;
  const uuid = signatureUuid(fn.schemaSignature);

  const inputAliases = fn.args
    .map((arg) => `    using In_${safeAliasName(arg.name)} = ${renderInputAliasType(arg)};`)
    .join("\n");

  const outputAliases = fn.returns
    .map((ret, i) => `    using Out_${safeAliasName(ret.name ?? `output_${i}`)} = ${renderReturnAliasType(ret, i)};`)
    .join("\n");

  const registerInputs = fn.args
    .map((arg) =>
      arg.optional
        ? `        RegisterOptionalInput<In_${safeAliasName(arg.name)}>();`
        : `        RegisterInput<In_${safeAliasName(arg.name)}>();`
    )
    .join("\n");

  const registerOutputs = fn.returns
    .map((ret, i) => `        RegisterOutput<Out_${safeAliasName(ret.name ?? `output_${i}`)}>();`)
    .join("\n");

  const fetchInputs = fn.args
    .map((arg) => `        auto ${safeAliasName(arg.name)} = inputs.Get<In_${safeAliasName(arg.name)}>();`)
    .join("\n");

  const setOutputs = fn.returns
    .map((ret, i) => {
      const n = safeAliasName(ret.name ?? `output_${i}`);
      return `        // TODO: replace placeholder_${n} with actual computed value\n        outputs.Set<Out_${n}>(nullptr);`;
    })
    .join("\n\n");

  return `struct ${className} : GF::Extensions::impl::DataProcessorBridgeImpl<${className}> {
    static constexpr auto name() { return std::string_view("${displayName}"); }
    static constexpr auto description() { return std::string_view("Auto-generated from PyTorch signature: ${fn.rawFunc}"); }
    static constexpr auto interface_id() { return Core::interfaces::interface_id_storage<GF::Interfaces::Ext::IDataProcessor>::value; }
    // {${uuid.toUpperCase()}}
    static constexpr auto implementation_id() { return ${uuidToCppCtor(uuid)}; }
    static auto create_instance() { return Core::make_base_obj<${className}>().as<Core::Object>(); }

${inputAliases}
${outputAliases}

    ${className}()
    {
${registerInputs}
${registerOutputs}
    }

    void Process(const Data::Properties& inputs, Data::Properties outputs)
    {
${fetchInputs}

        // TODO: implement operator execution bridge.
${setOutputs}
    }
};
`;
}