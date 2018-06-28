import * as fs from 'fs'
import * as assert from 'assert'
import { describe, it, before } from 'mocha'
import * as lib from '../lib'

describe('Test mapCss function with icons-only css file', () => {

  let fileContent = ''
  let map

  const expected = {
    'fa-glass': '\uf000',
    'fa-music': '\uf001',
    'fa-search': '\uf002',
    'fa-envelope-o': '\uf003',
    'fa-heart': '\uf004',
    'fa-remove': '\uf00d',
    'fa-close': '\uf00d',
    'fa-times': '\uf00d',
    'fa-gear': '\uf013',
    'fa-cog': '\uf013',
    'fa-rotate-right': '\uf01e',
    'fa-repeat': '\uf01e',
    'fa-dedent': '\uf03b',
    'fa-outdent': '\uf03b',
    'fa-photo': '\uf03e',
    'fa-image': '\uf03e',
    'fa-picture-o': '\uf03e',
  }

  before('load css file to test', () => {
    try {
      fileContent = fs.readFileSync(
        require.resolve('./font-awesome.css'),
        'utf8'
      )
    } catch (err) {
      throw err
    }
  })

  it('parses without errors', () => {
    map = lib.mapCss(fileContent)
  })

  it('has expected number of keys', () => {
    assert.strictEqual(Object.keys(map).length, Object.keys(expected).length)
  })

  it('has expected keys and values', () => {
    const assertPropExistsWithValue = (map, key, value) => {
      assert.ok(map.hasOwnProperty(key), `Key "${key}" is missing`)
      assert.ok(typeof map[key] === 'string', `Key "${key}" has unexpected type "${typeof map[key]}"`)
      assert.strictEqual(
        map[key],
        value,
        `Values for key "${key}" do not match.` +
        ` Expected: "${value}" (charcode ${value.charCodeAt(0)}),` +
        ` actual: "${map[key]}" (charcode ${map[key].charCodeAt(0)})`
      )
    }

    Object.keys(expected).forEach((key) => {
      assertPropExistsWithValue(map, key, expected[key])
    })
  })

})
