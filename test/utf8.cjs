'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');

function reference(bytes, seed, polynomial) {
  let result = (seed || 0) ^ -1;
  for (const byte of bytes) {
    result ^= byte;
    for (let bit = 0; bit < 8; ++bit) result = (result >>> 1) ^ ((result & 1) ? polynomial : 0);
  }
  return ~result;
}

for (const [file, global, polynomial] of [['crc32', 'CRC32', 0xedb88320], ['crc32c', 'CRC32C', 0x82f63b78]]) {
  const checksum = require('../' + file);
  describe(file + ' UTF-8 and compatibility regressions', function () {
    const cases = ['', '123456789', 'café 日本語', '😀𝄞', '\ud800', '\udc00', '\ud800A', '\udc00B', '\ud800\ud800', '\udc00\ud800', '\ud800\udc00', ('😀\ud800A').repeat(4000)];
    for (const input of cases) it('matches encoded bytes for ' + JSON.stringify(input.slice(0, 24)), function () {
      for (const seed of [undefined, 0, 1, -1, 0x12345678]) {
        const bytes = Buffer.from(input, 'utf8');
        const expected = reference(bytes, seed, polynomial);
        assert.equal(checksum.str(input, seed), expected);
        assert.equal(checksum.buf(bytes, seed), expected);
        assert.equal(checksum.bstr(bytes.toString('latin1'), seed), expected);
      }
    });
    it('matches every individual UTF-16 code unit', function () {
      for (let code = 0; code <= 0xffff; ++code) {
        const input = String.fromCharCode(code);
        assert.equal(checksum.str(input), reference(Buffer.from(input), 0, polynomial), 'U+' + code.toString(16));
      }
    });
    it('preserves seeded byte streaming at every split', function () {
      const bytes = Buffer.from('café 😀 \ud800 end');
      for (let i = 0; i <= bytes.length; ++i)
        assert.equal(checksum.buf(bytes.subarray(i), checksum.buf(bytes.subarray(0, i))), reference(bytes, 0, polynomial));
    });
    it('works in the browser global without Buffer or Node APIs', function () {
      const context = {};
      vm.runInNewContext(fs.readFileSync(require.resolve('../' + file), 'utf8'), context);
      assert.equal(context[global].str('\ud800A😀'), reference(Buffer.from('\ud800A😀'), 0, polynomial));
    });
  });
}

describe('CLI compatibility', function () {
  for (const [args, expected] of [[['-x'], 'cbf43926'], [['-X'], 'CBF43926'], [['-u'], '3421780262'], [['-d'], '-873187034'], [['-c', '-x'], 'e3069283']]) {
    it('preserves ' + args.join(' '), function () {
      const result = spawnSync(process.execPath, ['bin/crc32.njs', ...args], { input: '123456789', encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stdout.trim(), expected);
    });
  }
});
