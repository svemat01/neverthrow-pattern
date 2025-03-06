import { Err, Ok } from "neverthrow";

export type UnwrapOk<T> = T extends Ok<infer U, any> ? U : never;
export type UnwrapErr<T> = T extends Err<any, infer U> ? U : never;

export type WithDefault<a, b> = [a] extends [never] ? b : a;

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
