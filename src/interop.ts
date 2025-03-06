import { Result } from "neverthrow";
import type { Match } from "../node_modules/ts-pattern/dist/types/Match.js";
import type { unset } from "../node_modules/ts-pattern/dist/internals/symbols.js";
import { DistributeResultVariants } from "./types.js";

declare module "ts-pattern" {
    /**
     * This is a custom overload for the `match` function that allows you to match on `neverthrow` results.
     * It prepares Result types for better pattern matching by distributing union types to their respective Ok and Err variants.
     *
     * `match` creates a **pattern matching expression**.
     *  * Use `.with(pattern, handler)` to pattern match on the input.
     *  * Use `.exhaustive()` or `.otherwise(() => defaultValue)` to end the expression and get the result.
     *
     * This type fixer from neverthrow-pattern enables precise pattern matching on Result types from neverthrow.
     *
     * @see https://github.com/gvergnaud/ts-pattern#match
     *
     * @example
     *  const result: Result<string, Error> = ok("success");
     *
     *  return match(result)
     *    .with(NP.ok(), (ok) => `Success: ${ok.value}`)
     *    .with(NP.err(), (err) => `Error: ${err.error.message}`)
     *    .exhaustive();
     */
    export function match<const input extends Result<any, any>>(
        value: input
    ): Match<DistributeResultVariants<input>, unset>;
}
