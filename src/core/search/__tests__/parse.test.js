import { tokenize } from '../tokenize'
import { parseAndWithOrPriority } from '../parse'

describe('parseAndWithOrPriority', () => {
  test('parses (pikachu&chromatique),4* correctly', () => {
    const ast = parseAndWithOrPriority(tokenize('(pikachu&chromatique),4*'))
    expect(ast).toEqual({
      type: 'OR',
      left: {
        type: 'AND',
        left: { type: 'TERM', value: 'pikachu' },
        right: { type: 'TERM', value: 'chromatique' },
      },
      right: { type: 'TERM', value: '4*' },
    })
  })

  test('parses 4*,(pikachu&chromatique) correctly', () => {
    const ast = parseAndWithOrPriority(tokenize('4*,(pikachu&chromatique)'))
    expect(ast).toEqual({
      type: 'OR',
      left: { type: 'TERM', value: '4*' },
      right: {
        type: 'AND',
        left: { type: 'TERM', value: 'pikachu' },
        right: { type: 'TERM', value: 'chromatique' },
      },
    })
  })

  test('throws on empty expression', () => {
    expect(() => parseAndWithOrPriority([])).toThrow('Expression vide')
  })

  test('throws on unmatched parentheses', () => {
    expect(() => parseAndWithOrPriority(tokenize('(a,b'))).toThrow(
      'Parenthèses non fermées'
    )
    expect(() => parseAndWithOrPriority(tokenize('a,b)'))).toThrow(
      'Parenthèses non ouvertes'
    )
  })

  test('throws on duplicated AND (a&&b)', () => {
    expect(() => parseAndWithOrPriority(tokenize('a&&b'))).toThrow(
      "Expression incomplète autour d'un AND"
    )
  })

  test('throws on duplicated OR (a,,b)', () => {
    expect(() => parseAndWithOrPriority(tokenize('a,,b'))).toThrow(
      "Expression incomplète autour d'un OR"
    )
  })

  test('throws when AND is at the beginning (&a)', () => {
    expect(() => parseAndWithOrPriority(tokenize('&a'))).toThrow(
      "Expression incomplète autour d'un AND"
    )
  })

  test('throws when AND is at the end (a&)', () => {
    expect(() => parseAndWithOrPriority(tokenize('a&'))).toThrow(
      "Expression incomplète autour d'un AND"
    )
  })

  test('throws when OR is at the beginning (,a)', () => {
    expect(() => parseAndWithOrPriority(tokenize(',a'))).toThrow(
      "Expression incomplète autour d'un OR"
    )
  })

  test('throws when OR is at the end (a,)', () => {
    expect(() => parseAndWithOrPriority(tokenize('a,'))).toThrow(
      "Expression incomplète autour d'un OR"
    )
  })
})
