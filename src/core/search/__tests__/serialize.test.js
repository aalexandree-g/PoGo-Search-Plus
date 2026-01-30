import { astToPokemon } from '../serialize'

describe('serializeToPokemon', () => {
  test('serializes CNF AST a,(b&c)', () => {
    const ast = {
      type: 'AND',
      left: {
        type: 'OR',
        left: { type: 'TERM', value: 'a' },
        right: { type: 'TERM', value: 'b' },
      },
      right: {
        type: 'OR',
        left: { type: 'TERM', value: 'a' },
        right: { type: 'TERM', value: 'c' },
      },
    }
    expect(astToPokemon(ast)).toBe('a,b&a,c')
  })

  test('serializes simple AND chain a&b&c', () => {
    const ast = {
      type: 'AND',
      left: {
        type: 'AND',
        left: { type: 'TERM', value: 'a' },
        right: { type: 'TERM', value: 'b' },
      },
      right: { type: 'TERM', value: 'c' },
    }

    expect(astToPokemon(ast)).toBe('a&b&c')
  })

  test('serializes OR group ANDed with a TERM (a,b,c)&d', () => {
    const ast = {
      type: 'AND',
      left: {
        type: 'OR',
        left: {
          type: 'OR',
          left: { type: 'TERM', value: 'a' },
          right: { type: 'TERM', value: 'b' },
        },
        right: { type: 'TERM', value: 'c' },
      },
      right: { type: 'TERM', value: 'd' },
    }

    expect(astToPokemon(ast)).toBe('a,b,c&d')
  })

  test('serializes NOT(TERM) as !term', () => {
    const ast = {
      type: 'NOT',
      child: { type: 'TERM', value: 'a' },
    }

    expect(astToPokemon(ast)).toBe('!a')
  })

  test('serializes AND with NOT terms: !a&b', () => {
    const ast = {
      type: 'AND',
      left: { type: 'NOT', child: { type: 'TERM', value: 'a' } },
      right: { type: 'TERM', value: 'b' },
    }

    expect(astToPokemon(ast)).toBe('!a&b')
  })

  test('serializes OR with NOT terms: !a,b', () => {
    const ast = {
      type: 'OR',
      left: { type: 'NOT', child: { type: 'TERM', value: 'a' } },
      right: { type: 'TERM', value: 'b' },
    }

    expect(astToPokemon(ast)).toBe('!a,b')
  })
})
