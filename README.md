# LiteRT/Test

[![Strict TypeScript Checked](https://badgen.net/badge/TS/Strict "Strict TypeScript Checked")](https://www.typescriptlang.org)
[![npm version](https://img.shields.io/npm/v/@litert/test.svg?colorB=brightgreen)](https://www.npmjs.com/package/@litert/test "Stable Version")
[![License](https://img.shields.io/npm/l/@litert/test.svg?maxAge=2592000?style=plastic)](https://github.com/litert/test/blob/master/LICENSE)
[![node](https://img.shields.io/node/v/@litert/test.svg?colorB=brightgreen)](https://nodejs.org/dist/latest-v8.x/)
[![GitHub issues](https://img.shields.io/github/issues/litert/test.js.svg)](https://github.com/litert/test.js/issues)
[![GitHub Releases](https://img.shields.io/github/release/litert/test.js.svg)](https://github.com/litert/test.js/releases "Stable Release")

A simple test kits for LiteRT packages, based on Node.js.

## Requirement

- TypeScript v5.5.0 (or newer)
- Node.js v20.13.1 (or newer)

## Installation

```sh
npm i @litert/test-cli --save
```

## Usage

See the [example](./packages/example/) directory.

And use command `li-test` to run the test cases.

```sh
npx li-test path/to/dir1 path/to/dir2 ... # test all cases in file .test.ts
npx li-test --filter 'tag==hello' path/to/dir1 path/to/dir2 ... # test cases with tag 'hello'
```

## Documents

Preparing...

## License

This library is published under [Apache-2.0](./LICENSE) license.
