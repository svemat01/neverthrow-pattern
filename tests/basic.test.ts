import { describe, test, expect } from "vitest";
import { match, P } from "ts-pattern";
import { NP } from "../src";
import { Result, ok, err } from "neverthrow";
import { Ok } from "neverthrow";

describe("Basic Pattern Matching", () => {
    test("ok() matches any Ok value", () => {
        const result = ok(42);
        const matched = match(result)
            .with(NP.ok(), () => true)
            .otherwise(() => false);

        expect(matched).toBe(true);
    });

    test("err() matches any Err value", () => {
        const result = err("some error");
        const matched = match(result)
            .with(NP.err(), () => true)
            .otherwise(() => false);

        expect(matched).toBe(true);
    });

    test("ok() with pattern matches specific Ok values", () => {
        const result = ok(42);
        const matched = match(result)
            .with(NP.ok(42), () => "exact match")
            .with(NP.ok(P.number), () => "number match")
            .with(NP.ok(), () => "any ok match")
            .otherwise(() => "no match");

        expect(matched).toBe("exact match");
    });

    test("ok() with pattern matches specific Ok values exhaustively", () => {
        const result: Ok<
            | {
                  code: 1 | 2;
                  message: "hello";
              }
            | {
                  code: 3;
                  message: "world";
              },
            string
        > = ok({
            code: 3,
            message: "world",
        });

        const matched = match(result)
            .with(
                NP.ok({
                    code: 3,
                }),
                (value) => "code 3 match"
            )
            .with(
                NP.ok({
                    code: P.union(1, 2),
                }),
                (value) => "code 1 or 2 match"
            )
            .exhaustive();

        expect(matched).toBe("code 3 match");
    });

    test("err() with pattern matches specific Err values", () => {
        const result = err("some error");
        const matched = match(result)
            .with(NP.err("some error"), () => "exact match")
            .with(NP.err(P.string), () => "string match")
            .with(NP.err(), () => "any err match")
            .otherwise(() => "no match");

        expect(matched).toBe("exact match");
    });

    test("ok() does not match Err values", () => {
        const result = err("some error");
        const matched = match(result)
            .with(NP.ok(), () => "ok")
            .otherwise(() => "not ok");

        expect(matched).toBe("not ok");
    });

    test("err() does not match Ok values", () => {
        const result = ok(42);
        const matched = match(result)
            .with(NP.err(), () => "err")
            .otherwise(() => "not err");

        expect(matched).toBe("not err");
    });

    test("matches complex Ok objects", () => {
        const user = {
            name: "John",
            age: 30,
            roles: ["admin", "user"],
        };
        const result = ok(user);

        const matched = match(result)
            .with(NP.ok({ name: "John" }), () => "John match")
            .with(NP.ok({ name: P.string }), () => "any name match")
            .otherwise(() => "no match");

        expect(matched).toBe("John match");
    });

    test("matches complex Err objects", () => {
        const error = {
            code: 404,
            message: "Not Found",
            details: { path: "/users/1" },
        };
        const result = err(error);

        const matched = match(result)
            .with(NP.err({ code: 404 }), () => "404 match")
            .with(NP.err({ code: P.number }), () => "any code match")
            .otherwise(() => "no match");

        expect(matched).toBe("404 match");
    });

    test("handles the example from the README", () => {
        const handleResult = (result: Result<number, string>) =>
            match(result)
                .with(NP.ok(42), () => "The answer is 42!")
                .with(NP.ok(), ({ value }) => `Success: ${value}`)
                .with(NP.err(P.string), ({ error }) => `Error: ${error}`)
                .exhaustive();

        expect(handleResult(ok(42))).toBe("The answer is 42!");
        expect(handleResult(ok(7))).toBe("Success: 7");
        expect(handleResult(err("Something went wrong"))).toBe(
            "Error: Something went wrong"
        );
    });
});
