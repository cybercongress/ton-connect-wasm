# TON crypto primitives

Cross-platform crypto primitives for building apps for TON blockchain. For internal implementation of `@ton/crypto`.

[![Version npm](https://img.shields.io/npm/v/@ton/crypto-primitives.svg?logo=npm)](https://www.npmjs.com/package/@ton/crypto-primitives)

## Features

- 🦺 Crypto primitives: SHA-256, SHA-512, PBKDF2-SHA-256, HMAC-SHA-512
- 🚀 Promise-based API
- 🏎 Built on top of Buffer (polyfill required in browsers)
- 🍰 No reimplemented crypto

## Installation

```bash
yarn add @ton/crypto-primitives buffer
```

#### Browser polyfill

```js
// Add before using library
require("buffer");
```

## React Native
To make it work on react native `expo-random` module is required:
`
yarn install expo-random
`

# License

MIT
