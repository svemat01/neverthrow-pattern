export * from "./interop";
import * as NeverthrowPattern from "./patterns";

// Export as NP (Neverthrow Patterns) to avoid conflict with ts-pattern's P
// This provides a clear namespace for neverthrow-specific pattern matching utilities
export { NeverthrowPattern, NeverthrowPattern as NP };
