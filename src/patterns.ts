import { Ok, Err } from "neverthrow";
import { isMatching, P } from "ts-pattern";
import { WithDefault, UnwrapErr, UnwrapOk } from "./types";

/**
 * `ok(pattern?)` is a pattern matching function for `Ok` values from neverthrow.
 * It can be used to match against the success value inside an `Ok` instance.
 *
 * When used without arguments, it matches any `Ok` value.
 * When used with a pattern, it matches `Ok` values where the inner value matches the provided pattern.
 *
 * @example
 * ```ts
 * match(result)
 *   .with(NP.ok(P.number), (value) => 'matches Ok with a number value')
 *   .with(NP.ok({ status: 'success' }), (value) => 'matches Ok with an object value')
 *   .with(NP.ok(), (value) => 'matches any Ok value')
 * ```
 *
 * @param pattern - Optional pattern to match against the inner value of the Ok
 * @returns A pattern that matches Ok values from neverthrow
 */
export function ok<input>(): P.unstable_Matchable<
    { value: UnwrapOk<input> },
    input
>;
export function ok<
    input,
    const pattern extends P.Pattern<WithDefault<UnwrapOk<input>, unknown>>
>(
    pattern: pattern
): P.unstable_Matchable<
    // @ts-ignore Waiting on https://github.com/gvergnaud/ts-pattern/pull/311 to be released
    { value: P.narrow<UnwrapOk<input>, pattern> },
    input,
    pattern
>;
export function ok(
    ...args: [pattern?: any]
): P.unstable_Matchable<{ value: any }> {
    return {
        [P.matcher]() {
            return {
                match(value: any) {
                    if (!(value instanceof Ok)) {
                        return {
                            matched: false,
                        };
                    }

                    if (args.length === 0) {
                        return {
                            matched: true,
                        };
                    }

                    return {
                        // @ts-ignore
                        matched: isMatching(args[0], value.value),
                    };
                },
            };
        },
    };
}

/**
 * `err(pattern?)` is a pattern matching function for `Err` values from neverthrow.
 * It can be used to match against the error value inside an `Err` instance.
 *
 * When used without arguments, it matches any `Err` value.
 * When used with a pattern, it matches `Err` values where the inner error value matches the provided pattern.
 *
 * @example
 * ```ts
 * match(result)
 *   .with(NP.err(P.string), (error) => 'matches Err with a string error')
 *   .with(NP.err({ code: 'NOT_FOUND' }), (error) => 'matches Err with a specific error object')
 *   .with(NP.err(), (error) => 'matches any Err value')
 * ```
 *
 * @param pattern - Optional pattern to match against the inner error value of the Err
 * @returns A pattern that matches Err values from neverthrow
 */
export function err<input>(): P.unstable_Matchable<
    { error: UnwrapErr<input> },
    input
>;
export function err<
    input,
    const pattern extends P.Pattern<WithDefault<UnwrapErr<input>, unknown>>
>(
    pattern: pattern
): P.unstable_Matchable<
    // @ts-ignore Waiting on https://github.com/gvergnaud/ts-pattern/pull/311 to be released
    { error: P.narrow<UnwrapErr<input>, pattern> },
    input,
    pattern
>;
export function err(
    ...args: [pattern?: any]
): P.unstable_Matchable<{ error: any }> {
    return {
        [P.matcher]() {
            return {
                match(value: any) {
                    if (!(value instanceof Err)) {
                        return {
                            matched: false,
                        };
                    }

                    if (args.length === 0) {
                        return {
                            matched: true,
                        };
                    }

                    return {
                        // @ts-ignore
                        matched: isMatching(args[0], value.error),
                    };
                },
            };
        },
    };
}
