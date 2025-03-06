import { Ok, Err, Result } from "neverthrow";
import type { Match } from "../node_modules/ts-pattern/dist/types/Match.js";
import type { unset } from "../node_modules/ts-pattern/dist/internals/symbols.js";

/**
 * Extracts the Ok variant from a Result type, preserving the specific success type.
 * Converts `Result<T1 | T2, E>` into `Ok<T1, any> | Ok<T2, any>`.
 * This helps with precise type matching in pattern matching.
 */
export type DistributeOkVariant<T> = T extends Ok<infer U, any>
    ? U extends any
        ? Ok<U, any>
        : never
    : never;

/**
 * Extracts the Err variant from a Result type, preserving the specific error type.
 * Converts `Result<T, E1 | E2>` into `Err<any, E1> | Err<any, E2>`.
 * This helps with precise type matching in pattern matching.
 */
export type DistributeErrVariant<T> = T extends Err<any, infer U>
    ? U extends any
        ? Err<any, U>
        : never
    : never;

/**
 * Distributes union types within a Result to their respective Ok and Err variants.
 * Converts `Result<T1 | T2, E1 | E2>` into `Ok<T1, any> | Ok<T2, any> | Err<any, E1> | Err<any, E2>`.
 * This enables precise pattern matching on specific variants of union types.
 */
export type DistributeResultVariants<T> =
    | DistributeOkVariant<T>
    | DistributeErrVariant<T>;

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
