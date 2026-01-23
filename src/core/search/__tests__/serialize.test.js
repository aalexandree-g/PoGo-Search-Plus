import { astToPokemon } from '../serialize'

describe('serializeToPokemon', () => {
  test('serializes CNF AST 4*,(pikachu&chromatique)', () => {
    const ast = {
      type: 'AND',
      left: {
        type: 'OR',
        left: { type: 'TERM', value: '4*' },
        right: { type: 'TERM', value: 'pikachu' },
      },
      right: {
        type: 'OR',
        left: { type: 'TERM', value: '4*' },
        right: { type: 'TERM', value: 'chromatique' },
      },
    }
    expect(astToPokemon(ast)).toBe('4*,pikachu&4*,chromatique')
  })

  test('serializes simple AND chain', () => {
    const ast = {
      type: 'AND',
      left: {
        type: 'AND',
        left: { type: 'TERM', value: 'pikachu' },
        right: { type: 'TERM', value: 'chromatique' },
      },
      right: { type: 'TERM', value: '4*' },
    }

    expect(astToPokemon(ast)).toBe('pikachu&chromatique&4*')
  })

  test('serializes OR group ANDed with a TERM (pikachu,chromatique,bulbizarre)&4*', () => {
    const ast = {
      type: 'AND',
      left: {
        type: 'OR',
        left: {
          type: 'OR',
          left: { type: 'TERM', value: 'pikachu' },
          right: { type: 'TERM', value: 'chromatique' },
        },
        right: { type: 'TERM', value: 'bulbizarre' },
      },
      right: { type: 'TERM', value: '4*' },
    }

    expect(astToPokemon(ast)).toBe('pikachu,chromatique,bulbizarre&4*')
  })
})
