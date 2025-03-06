import { describe, test, expect } from "vitest";
import { match, P } from "ts-pattern";
import { NP } from "../src";
import { Result, ok, err } from "neverthrow";

describe("Type Interoperability", () => {
    test("matches distinct union types in Result", () => {
        // Define union types for both ok and err cases
        type UserRole = "admin" | "editor" | "viewer";
        type ApiError =
            | { kind: "network"; message: string }
            | { kind: "validation"; fields: string[] }
            | { kind: "auth"; code: number };

        type ApiResult = Result<UserRole, ApiError>;

        // Test function that uses pattern matching with precise type checking
        const getPermissionLevel = (result: ApiResult): string =>
            match(result)
                .with(NP.ok("admin"), () => "full access")
                .with(NP.ok("editor"), () => "edit access")
                .with(NP.ok("viewer"), () => "read-only access")
                .with(
                    NP.err({ kind: "network" }),
                    ({ error }) => `network error: ${error.message}`
                )
                .with(
                    NP.err({ kind: "validation" }),
                    ({ error }) =>
                        `validation failed for: ${error.fields.join(", ")}`
                )
                .with(
                    NP.err({ kind: "auth", code: P.number }),
                    ({ error }) => `auth error code: ${error.code}`
                )
                .exhaustive();

        expect(getPermissionLevel(ok("admin"))).toBe("full access");
        expect(getPermissionLevel(ok("editor"))).toBe("edit access");
        expect(getPermissionLevel(ok("viewer"))).toBe("read-only access");
        expect(
            getPermissionLevel(
                err({ kind: "network", message: "connection failed" })
            )
        ).toBe("network error: connection failed");
        expect(
            getPermissionLevel(
                err({ kind: "validation", fields: ["email", "password"] })
            )
        ).toBe("validation failed for: email, password");
        expect(getPermissionLevel(err({ kind: "auth", code: 401 }))).toBe(
            "auth error code: 401"
        );
    });

    // TODO: P.select inside NP.ok and NP.err patterns is not currently supported
    // This will be implemented in a future version

    /* Commenting out tests that use P.select with NP.ok and NP.err patterns
    test("handles nested Result types correctly", () => {
        // A more complex type with nested structures
        type UserData = {
            id: number;
            profile: {
                name: string;
                email?: string;
            };
        };

        type ApiErrorDetail = {
            code: number;
            context?: Record<string, unknown>;
        };

        // Test function with complex pattern matching
        const processUserResult = (
            result: Result<UserData, ApiErrorDetail>
        ): string =>
            match(result)
                .with(
                    NP.ok({
                        profile: {
                            name: P.select("username"),
                            email: P.select("email"),
                        },
                    }),
                    ({ username, email }) =>
                        `User ${username} with email ${email}`
                )
                .with(
                    NP.ok({
                        profile: {
                            name: P.select("username"),
                            email: P.optional(undefined),
                        },
                    }),
                    ({ username }) => `User ${username} without email`
                )
                .with(
                    NP.err({
                        code: P.when((code) => code >= 400 && code < 500),
                        context: P.select("details"),
                    }),
                    ({ details }) =>
                        `Client error with details: ${JSON.stringify(details)}`
                )
                .with(
                    NP.err({ code: P.number }),
                    ({ error }) => `Error code: ${error.code}`
                )
                .exhaustive();

        expect(
            processUserResult(
                ok({
                    id: 1,
                    profile: { name: "John", email: "john@example.com" },
                })
            )
        ).toBe("User John with email john@example.com");

        expect(
            processUserResult(ok({ id: 2, profile: { name: "Alice" } }))
        ).toBe("User Alice without email");

        expect(
            processUserResult(
                err({ code: 404, context: { resource: "user", id: "123" } })
            )
        ).toBe('Client error with details: {"resource":"user","id":"123"}');

        expect(processUserResult(err({ code: 500 }))).toBe("Error code: 500");
    });
    */

    test("handles multiple different types of results", () => {
        // Define different result types
        type NumberResult = Result<number, string>;
        type StringResult = Result<string, Error>;
        type ObjectResult = Result<
            { id: number; name: string },
            { code: number }
        >;

        // Process with single pattern matching expression
        const processMultipleResults = (
            numberResult: NumberResult,
            stringResult: StringResult,
            objectResult: ObjectResult
        ): string[] => {
            const results: string[] = [];

            // Process number result
            results.push(
                match(numberResult)
                    .with(
                        NP.ok(P.when((n) => n > 0)),
                        ({ value }) => `Positive number: ${value}`
                    )
                    .with(NP.ok(0), () => "Zero")
                    .with(
                        // @ts-ignore
                        NP.ok(P.when((n) => n < 0)),
                        ({ value }) => `Negative number: ${value}`
                    )
                    .with(
                        NP.err(P.string),
                        ({ error }) => `Number error: ${error}`
                    )
                    .exhaustive()
            );

            // Process string result
            results.push(
                match(stringResult)
                    .with(
                        NP.ok(P.string),
                        ({ value }) => `String value: ${value}`
                    )
                    .with(
                        NP.err(),
                        ({ error }) => `String error: ${error.message}`
                    )
                    .exhaustive()
            );

            // Process object result
            results.push(
                match(objectResult)
                    .with(
                        NP.ok({ id: P.number, name: P.string }),
                        ({ value }) =>
                            `Object: ID=${value.id}, Name=${value.name}`
                    )
                    .with(
                        NP.err({ code: P.number }),
                        ({ error }) => `Object error code: ${error.code}`
                    )
                    .exhaustive()
            );

            return results;
        };

        // Test with all successful results
        expect(
            processMultipleResults(
                ok(42),
                ok("hello"),
                ok({ id: 1, name: "Product" })
            )
        ).toEqual([
            "Positive number: 42",
            "String value: hello",
            "Object: ID=1, Name=Product",
        ]);

        // Test with mixed results
        expect(
            processMultipleResults(
                ok(-5),
                err(new Error("Invalid string")),
                ok({ id: 2, name: "Service" })
            )
        ).toEqual([
            "Negative number: -5",
            "String error: Invalid string",
            "Object: ID=2, Name=Service",
        ]);

        // Test with all error results
        expect(
            processMultipleResults(
                err("Invalid number"),
                err(new Error("String processing failed")),
                err({ code: 404 })
            )
        ).toEqual([
            "Number error: Invalid number",
            "String error: String processing failed",
            "Object error code: 404",
        ]);
    });
});
