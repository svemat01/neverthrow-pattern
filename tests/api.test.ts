import { describe, test, expect } from "vitest";
import { NP, NeverthrowPattern } from "../src";

describe("API Exports", () => {
    test("library exports the expected functions", () => {
        // Test that the functions are exported properly
        expect(typeof NP.ok).toBe("function");
        expect(typeof NP.err).toBe("function");
        expect(typeof NeverthrowPattern.ok).toBe("function");
        expect(typeof NeverthrowPattern.err).toBe("function");

        // Check they're the same functions
        expect(NP.ok).toBe(NeverthrowPattern.ok);
        expect(NP.err).toBe(NeverthrowPattern.err);
    });
});
