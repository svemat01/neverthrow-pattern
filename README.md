<h1 align="center">Neverthrow-Pattern</h1>

<p align="center">
Pattern matching for <a href="https://github.com/supermacro/neverthrow">neverthrow</a> using <a href="https://github.com/gvergnaud/ts-pattern">ts-pattern</a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/neverthrow-pattern">
    <img src="https://img.shields.io/npm/dm/neverthrow-pattern.svg" alt="downloads" height="18">
  </a>
  <a href="https://www.npmjs.com/package/neverthrow-pattern">
    <img src="https://img.shields.io/npm/v/neverthrow-pattern.svg" alt="npm version" height="18">
  </a>
  <a href="https://github.com/svemat01/neverthrow-pattern">
    <img src="https://img.shields.io/npm/l/neverthrow-pattern.svg" alt="MIT license" height="18">
  </a>
</p>

## Description

`neverthrow-pattern` bridges the gap between two powerful TypeScript libraries: `neverthrow` and `ts-pattern`. It provides a seamless integration layer that allows you to use pattern matching with the Result type from neverthrow, making your error handling code more expressive, concise, and type-safe.

```typescript
import { match } from "ts-pattern";
import { NP } from "neverthrow-pattern";
import { Result, ok, err } from "neverthrow";

const handleResult = (result: Result<number, string>) =>
    match(result)
        .with(NP.ok(), (value) => `Success: ${value.value}`)
        .with(NP.ok(42), () => "The answer is 42!")
        .with(NP.err(P.string), (error) => `Error: ${error.value}`)
        .exhaustive();

// Usage
handleResult(ok(42)); // "The answer is 42!"
handleResult(ok(7)); // "Success: 7"
handleResult(err("Something went wrong")); // "Error: Something went wrong"
```

## Features

-   🎯 **Pattern match on neverthrow's Result type**: Use expressive pattern matching for both `Ok` and `Err` values
-   🛡️ **Type-safe**: Full type inference and exhaustiveness checking
-   🧩 **Composable patterns**: Combine with other ts-pattern patterns for complex matching scenarios
-   🔍 **Pattern validation**: Match on the inner value of `Ok` and `Err` instances
-   📝 **Comprehensive type definitions**: Works seamlessly with TypeScript
-   🔄 **Match type interoperability**: Enhances the standard match function to work with neverthrow Results

## Installation

```bash
# Using pnpm
pnpm add neverthrow-pattern

# Using yarn
yarn add neverthrow-pattern

# Using npm
npm install neverthrow-pattern
```

Make sure you have both `neverthrow` and `ts-pattern` installed:

```bash
pnpm add neverthrow ts-pattern
```

## Usage

### Importing

```typescript
// Import everything under a namespace (recommended)
import { NP } from "neverthrow-pattern";

// Import match and other utilities from ts-pattern
import { match, P } from "ts-pattern";

// Import from neverthrow as usual
import { Result, ok, err } from "neverthrow";
```

### Basic Pattern Matching on Result

Match on any `Ok` or `Err` value:

```typescript
const processResult = (result: Result<number, string>) =>
    match(result)
        .with(NP.ok(), ({ value }) => `Got success with value: ${value}`)
        .with(NP.err(), ({ error }) => `Got error: ${error}`)
        .exhaustive();
```

### Pattern Matching with Value Validation

Match on specific values inside `Ok` or `Err`:

```typescript
const processApiResult = (
    result: Result<
        { status: "success" | "pending"; data: unknown },
        { code: number; message: string }
    >
) =>
    match(result)
        .with(
            NP.ok({ status: "success" }),
            ({ value }) => `Success: ${JSON.stringify(value.data)}`
        )
        .with(NP.ok({ status: "pending" }), () => "Operation in progress...")
        .with(NP.err({ code: 404 }), () => "Not found")
        .with(
            NP.err({ code: P.number.gt(500) }),
            ({ error }) => `Server error: ${error.message}`
        )
        .with(NP.err({ code: P.number }), ({ error }) => `Error: ${error}`)
        .exhaustive();
```

### Using with ts-pattern's Other Patterns

Combine with other patterns from ts-pattern:

```typescript
match(result)
    .with(NP.ok(P.when((n) => n > 10)), () => "Got a number greater than 10")
    .with(NP.ok(), ({ value }) => `Got: ${value}`)
    .with(NP.err(P.string), ({ error }) => `Error message: ${error}`)
    .with(NP.err(P.any), () => "Some other error")
    .exhaustive();
```

### Pattern Selection

> **Note**: Currently, using `P.select()` inside `NP.ok()` and `NP.err()` patterns is not supported. For example, `NP.ok(P.select())` or `NP.err(P.select())` won't work as expected. This feature may be implemented in a future version.

### Enhanced Match Type Interoperability

The library enhances the standard match function to work better with neverthrow Results.
When using neverthrow-pattern, the `match` function from ts-pattern is automatically enhanced to work better with Result types. This means:

1. You don't need any special imports or setup - just import the library and start using it
2. The type system correctly distributes union types within Results for precise pattern matching
3. Type inference works properly when destructuring Ok and Err values

## API Documentation

### Main Functions

-   `NP.ok<input, pattern>(pattern?)`: Creates a pattern that matches Ok values
-   `NP.err<input, pattern>(pattern?)`: Creates a pattern that matches Err values

Both functions can be used:

-   Without arguments to match any Ok/Err value
-   With a pattern to match against the inner value

### Type Definitions

-   `UnwrapOk<T>`: Extracts the success type from a Result
-   `UnwrapErr<T>`: Extracts the error type from a Result

For complete API documentation, please refer to the generated TypeDoc documentation.

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b my-new-feature`
3. Make your changes
4. Create a changeset to document your changes: `pnpm changeset`
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin my-new-feature`
7. Submit a pull request

Please make sure your code follows the existing style and includes appropriate tests.

For more detailed information, see the [CONTRIBUTING.md](CONTRIBUTING.md) guide.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

-   [neverthrow](https://github.com/supermacro/neverthrow) - A type-safe alternative to throwing exceptions
-   [ts-pattern](https://github.com/gvergnaud/ts-pattern) - The exhaustive Pattern Matching library for TypeScript
-   All contributors who have helped improve this library

---

Built with ❤️ for type-safe error handling in TypeScript.
