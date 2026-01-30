import { tokenize } from '../tokenize'

describe('tokenize', () => {
  test('empty input returns empty array', () => {
    expect(tokenize('')).toEqual([])
    expect(tokenize('   ')).toEqual([])
  })

  test('tokenizes operators with raw', () => {
    expect(tokenize('(a&b),c')).toEqual([
      { type: 'LPAREN', raw: '(' },
      { type: 'TERM', value: 'a' },
      { type: 'AND', raw: '&' },
      { type: 'TERM', value: 'b' },
      { type: 'RPAREN', raw: ')' },
      { type: 'OR', raw: ',' },
      { type: 'TERM', value: 'c' },
    ])
  })

  test('normalizes term (trim + lowercase)', () => {
    expect(tokenize('  M. Mime  ')).toEqual([
      { type: 'TERM', value: 'm. mime' },
    ])
  })

  test('keeps unicode and lowercases', () => {
    expect(tokenize('ÉvoLI')).toEqual([{ type: 'TERM', value: 'évoli' }])
  })

  test('does not create empty TERM tokens', () => {
    expect(tokenize('a,,b')).toEqual([
      { type: 'TERM', value: 'a' },
      { type: 'OR', raw: ',' },
      { type: 'OR', raw: ',' },
      { type: 'TERM', value: 'b' },
    ])
  })

  test('tokenizes ":" and ";" as OR', () => {
    expect(tokenize('a:b;c')).toEqual([
      { type: 'TERM', value: 'a' },
      { type: 'OR', raw: ':' },
      { type: 'TERM', value: 'b' },
      { type: 'OR', raw: ';' },
      { type: 'TERM', value: 'c' },
    ])
  })
})
