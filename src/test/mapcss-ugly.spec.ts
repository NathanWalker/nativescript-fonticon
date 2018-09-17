import * as fs from 'fs'
import * as assert from 'assert'
import { describe, it, before } from 'mocha'
import * as lib from '../lib'

describe('Test mapCss function with uglified css file from Font Awesome module', () => {

  let fileContent = ''
  let map

  const expected = {
    'fa-500px': '\uf26e',
    'fa-accessible-icon': '\uf368',
    'fa-american-sign-language-interpreting': '\uf2a3',
    'fa-youtube': '\uf167',
    'fa-youtube-square': '\uf431'
  }

  before('load css file to test', () => {
    try {
      fileContent = fs.readFileSync(
        require.resolve('@fortawesome/fontawesome-free/css/fontawesome.css'),
        'utf8'
      )
    } catch (err) {
      throw err
    }
  })

  it('parses without errors', () => {
    map = lib.mapCss(fileContent)
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

  it('each key starts with prefix fa-', () => {
    Object.keys(map).forEach((key) => {
      assert.ok(key.length >= 3, `Key "${key}" is too short to start with prefix "fa-"`)
      assert.strictEqual(key.substring(0, 3), 'fa-', `Key "${key}" has unexpected prefix "${key.substring(0, 3)}"`)
    })
  })

  it('each value is a unicode code point', () => {
    Object.keys(map).forEach((key) => {
      const value = map[key]
      const codePoint = value.charCodeAt(0).toString(16)
      assert.ok(typeof value === 'string', `Value "${value}" has unexpected type "${typeof value}"`)
      assert.ok(/f[a-f0-9]{3}/i.test(codePoint), `"${codePoint}" doesn't seem to be a unicode code point ${codePoint}`)
    })
  })

})
