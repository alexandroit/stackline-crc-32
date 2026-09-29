# @stackline/crc-32

> Pure-JS CRC-32.

[![npm version](https://img.shields.io/npm/v/@stackline/crc-32.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/crc-32)
[![license](https://img.shields.io/npm/l/@stackline/crc-32.svg?style=flat-square)](https://github.com/alexandroit/stackline-crc-32)
[![GitHub repository](https://img.shields.io/badge/GitHub-repository-181717?style=flat-square&logo=github)](https://github.com/alexandroit/stackline-crc-32)
[![Docs](https://img.shields.io/badge/docs-alexandro.net-0f766e?style=flat-square)](https://alexandro.net/docs/vanilla/crc-32/)
[![Reddit community](https://img.shields.io/badge/community-r%2FStackline-ff4500?style=flat-square&logo=reddit&logoColor=white)](https://www.reddit.com/r/Stackline/)

**[Documentation](https://alexandro.net/docs/vanilla/crc-32/)** | **[npm](https://www.npmjs.com/package/@stackline/crc-32)** | **[Issues](https://github.com/alexandroit/stackline-crc-32/issues)** | **[Repository](https://github.com/alexandroit/stackline-crc-32)**

**Current package version:** `1.0.2`

---

## Why this package?

Maintained fork of [crc-32](https://github.com/SheetJS/js-crc32) 1.2.2. Apache-2.0; original copyright notices are retained.

The `str` function encodes unpaired UTF-16 surrogates as U+FFFD, matching standard UTF-8 encoders. Valid strings, byte inputs, signed results, and seed behavior are preserved.

Requires Node.js 20.19 or newer. No runtime dependencies.

Standard CRC-32 algorithm implementation in JS (for the browser and nodejs).
Emphasis on correctness, performance, and IE6+ support.

## Compatibility

| Item | Value |
| --- | --- |
| Package | `@stackline/crc-32@1.0.2` |
| Supported Node.js | `>=20.19.0` |
| Module entry | `crc32.js` (CommonJS) |
| Runtime dependencies | 0 direct dependencies |
| Types | `types/index.d.ts` |
| CLI | `crc32` |

## Installation

```bash
npm install @stackline/crc-32
```

With [npm](https://www.npmjs.com/package/@stackline/crc-32):

```bash
$ npm install @stackline/crc-32
```

When installed globally, npm installs a script `crc32` that computes the
checksum for a specified file or standard input.

<details>
  <summary><b>CDN Availability</b> (click to show)</summary>

|    CDN     | URL                                        |
|-----------:|:-------------------------------------------|
|    `unpkg` | <https://unpkg.com/crc-32/>                |
| `jsDelivr` | <https://jsdelivr.com/package/npm/crc-32>  |
|    `CDNjs` | <https://cdnjs.com/libraries/crc-32>       |

</details>

### Integration

Using NodeJS or a bundler:

```js
var CRC32 = require("@stackline/crc-32");
```

In the browser, the `crc32.js` script can be loaded directly:

```html
<script src="crc32.js"></script>
```

The browser script exposes a variable `CRC32`.

The script will manipulate `module.exports` if available .  This is not always
desirable.  To prevent the behavior, define `DO_NOT_EXPORT_CRC`.

### CRC32C (Castagnoli)

The module and CDNs also include a parallel script for CRC32C calculations.

Using NodeJS or a bundler:

```js
var CRC32C = require("@stackline/crc-32/crc32c");
```

In the browser, the `crc32c.js` script can be loaded directly:

```html
<script src="crc32c.js"></script>
```

The browser exposes a variable `CRC32C`.

The script will manipulate `module.exports` if available .  This is not always
desirable.  To prevent the behavior, define `DO_NOT_EXPORT_CRC`.

## Usage

```js
const CRC32 = require('@stackline/crc-32');
console.log(CRC32.str('SheetJS')); // signed 32-bit checksum
```

In all cases, the relevant function takes an argument representing data and an
optional second argument representing the starting "seed" (for rolling CRC).

The return value is a signed 32-bit integer.

- `CRC32.buf(byte array or buffer[, seed])` assumes the argument is a sequence
  of 8-bit unsigned integers (nodejs `Buffer`, `Uint8Array` or array of bytes).

- `CRC32.bstr(binary string[, seed])` assumes the argument is a binary string
  where byte `i` is the low byte of the UCS-2 char: `str.charCodeAt(i) & 0xFF`

- `CRC32.str(string[, seed])` assumes the argument is a standard JS string and
  calculates the hash of the UTF-8 encoding.

For example:

```js
// var CRC32 = require('@stackline/crc-32');               // uncomment this line if in node
CRC32.str("SheetJS")                            // -1647298270
CRC32.bstr("SheetJS")                           // -1647298270
CRC32.buf([ 83, 104, 101, 101, 116, 74, 83 ])   // -1647298270

crc32 = CRC32.buf([83, 104])                    // -1826163454  "Sh"
crc32 = CRC32.str("eet", crc32)                 //  1191034598  "Sheet"
CRC32.bstr("JS", crc32)                         // -1647298270  "SheetJS"

[CRC32.str("\u2603"),  CRC32.str("\u0003")]     // [ -1743909036,  1259060791 ]
[CRC32.bstr("\u2603"), CRC32.bstr("\u0003")]    // [  1259060791,  1259060791 ]
[CRC32.buf([0x2603]),  CRC32.buf([0x0003])]     // [  1259060791,  1259060791 ]

// var CRC32C = require('@stackline/crc-32/crc32c');       // uncomment this line if in node
CRC32C.str("SheetJS")                           // -284764294
CRC32C.bstr("SheetJS")                          // -284764294
CRC32C.buf([ 83, 104, 101, 101, 116, 74, 83 ])  // -284764294

crc32c = CRC32C.buf([83, 104])                  // -297065629   "Sh"
crc32c = CRC32C.str("eet", crc32c)              //  1241364256  "Sheet"
CRC32C.bstr("JS", crc32c)                       // -284764294   "SheetJS"

[CRC32C.str("\u2603"),  CRC32C.str("\u0003")]   // [  1253703093,  1093509285 ]
[CRC32C.bstr("\u2603"), CRC32C.bstr("\u0003")]  // [  1093509285,  1093509285 ]
[CRC32C.buf([0x2603]),  CRC32C.buf([0x0003])]   // [  1093509285,  1093509285 ]
```

### Best Practices

Even though the initial seed is optional, for performance reasons it is highly
recommended to explicitly pass the default seed 0.

In NodeJS with the native Buffer implementation, it is oftentimes faster to
convert binary strings with `Buffer.from(bstr, "binary")` first:

```js
/* Frequently slower in NodeJS */
crc32 = CRC32.bstr(bstr, 0);
/* Frequently faster in NodeJS */
crc32 = CRC32.buf(Buffer.from(bstr, "binary"), 0);
```

This does not apply to browser `Buffer` shims, and thus is not implemented in
the library directly.

## Features

### Performance

`make perf` will run algorithmic performance tests (which should justify certain
decisions in the code).

The [`adler-32` project](http://git.io/adler32) has more performance notes

## Security

CRC checksums detect accidental corruption; they are not cryptographic hashes or authentication mechanisms.

## API Surface

The usage reference above documents the existing public API and its input/output behavior.

## Local Development

Clone the [repository](https://github.com/alexandroit/stackline-crc-32) and run the following commands from its root:

```bash
npm ci
npm run build
npm test
npm run lint
npm run test:types
```

The retained upstream development notes below include historical tooling; the commands above are the maintained package checks.

### Stackline development

Run `npm ci`, `npm run build`, `npm test` and `npm run lint` and `npm run test:types`. The checked-in upstream fixtures and focused regression suite run without downloading external test data.

### Upstream testing

`make test` will run the nodejs-based test.

To run the in-browser tests, run a local server and go to the `ctest` directory.
`make ctestserv` will start a python `SimpleHTTPServer` server on port 8000.

To update the browser artifacts, run `make ctest`.

To generate the bits file, use the `crc32` function from python `zlib`:

```python
>>> from zlib import crc32
>>> x="foo bar baz٪☃🍣"
>>> crc32(x)
1531648243
>>> crc32(x+x)
-218791105
>>> crc32(x+x+x)
1834240887
```

The included `crc32.njs` script can process files or standard input:

```bash
$ echo "this is a test" > t.txt
$ bin/crc32.njs t.txt
1912935186
```

For comparison, the included `crc32.py` script uses python `zlib`:

```bash
$ bin/crc32.py t.txt
1912935186
```

On OSX the command `cksum` generates unsigned CRC-32 with Algorithm 3:

```bash
$ cksum -o 3 < IE8.Win7.For.Windows.VMware.zip
1891069052 4161613172
$ crc32 --unsigned ~/Downloads/IE8.Win7.For.Windows.VMware.zip
1891069052
```

## Release Checklist

1. Update the package version, lockfile, generated version fields, and changelog together.
2. Run the development checks above and audit both `npm audit` and `npm audit --omit=dev`.
3. Use the [GitHub publish workflow](https://github.com/alexandroit/stackline-crc-32/actions/workflows/publish.yml) with its `Prod` environment to publish the exact CI tarball.
4. Verify public npm bytes, package identity, provenance, and the immutable GitHub release evidence.

## License

[Apache-2.0](https://github.com/alexandroit/stackline-crc-32/blob/main/LICENSE). Original copyright notices and upstream attribution are retained.

Please consult the attached LICENSE file for details.  All rights not explicitly
granted by the Apache 2.0 license are reserved by the Original Author.

See [NOTICE](https://github.com/alexandroit/stackline-crc-32/blob/main/NOTICE) for retained attribution.

## Credits and original authors

- sheetjs.
- Copyright (C) 2014-present   SheetJS LLC.
- Original work Copyright SheetJS; distributed under the Apache License 2.0.
- Stackline modifications Copyright 2026 Stackline contributors.
- Stackline maintenance: [Alexandro Paixao Marques](https://www.linkedin.com/in/aleinfo/) and [Stackline contributors](https://github.com/alexandroit).

Original copyright, license notices and contributor acknowledgements remain part of this distribution. Stackline maintenance does not replace authorship of the original work.

## Community and Links

- [Stackline website](https://alexandro.net/)
- [GitHub projects](https://github.com/alexandroit)
- [npm packages](https://www.npmjs.com/~alex360qc)
- [Reddit community — r/Stackline](https://www.reddit.com/r/Stackline/)
- [Maintainer LinkedIn](https://www.linkedin.com/in/aleinfo/)

Use this repository's issue tracker for reproducible bugs and feature requests. Join r/Stackline for examples, usage questions and release discussions.
