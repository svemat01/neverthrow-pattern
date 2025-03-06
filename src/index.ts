export * from "./interop";
import * as NP from "./patterns";
export * from "./types";

// Export as NP (Neverthrow Patterns) to avoid conflict with ts-pattern's P
// This provides a clear namespace for neverthrow-specific pattern matching utilities
export { NP, NP as NeverthrowPattern };
