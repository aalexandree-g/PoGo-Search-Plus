import { tokenize } from '../tokenize'
import { parseAndWithOrPriority } from '../parse'
import { toCNF } from '../normalize'
import { astToPokemon } from '../serialize'

function compileToPokemon(input) {
  const tokens = tokenize(input)
  const ast = parseAndWithOrPriority(tokens)
  const normalized = toCNF(ast)
  return astToPokemon(normalized)
}

describe('pipeline (tokenize → parse → normalize → serialize)', () => {
  test('converts (pikachu&chromatique),4* into pikachu,4*&chromatique,4*', () => {
    expect(compileToPokemon('(pikachu&chromatique),4*')).toBe(
      'pikachu,4*&chromatique,4*'
    )
  })

  test('converts 4*,(pikachu&chromatique) into 4*,pikachu&4*,chromatique', () => {
    expect(compileToPokemon('4*,(pikachu&chromatique)')).toBe(
      '4*,pikachu&4*,chromatique'
    )
  })

  test('throws on invalid input like a&&b', () => {
    expect(() => compileToPokemon('a&&b')).toThrow()
  })
})
