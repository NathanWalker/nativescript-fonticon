import * as assert from 'assert';
import { describe, it } from 'mocha';
import * as lib from '../lib';

describe('Test cleanValue function', () => {

  it('with space and semicolon', () => {
    assert.strictEqual(
      lib.cleanValue('content:   "\\f000";'),
      '\\uf000',
    );
  });

  it('no space but semicolon', () => {
    assert.strictEqual(
      lib.cleanValue('content:"\\f000";'),
      '\\uf000',
    );
  });

  it('without space and semicolon', () => {
    assert.strictEqual(
      lib.cleanValue('content:"\\f000"'),
      '\\uf000',
    );
  });

  it('with surrounding space', () => {
    assert.strictEqual(
      lib.cleanValue('   content:   "\\f000"  ;'),
      '\\uf000',
    );
  });

  it('with line breaks', () => {
    assert.strictEqual(
      lib.cleanValue(' \n  content:   "\\f000"  ; \n '),
      '\\uf000',
    );
  });

  it('with single quotes', () => {
    assert.strictEqual(
      lib.cleanValue("content: '\\f000'; "),
      '\\uf000',
    );
  });

});
