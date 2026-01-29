import { tokenize } from './tokenize'
import { parseAndWithOrPriority } from './parse'
import { normalize } from './normalize'
import { astToPokemon } from './serialize'

export function transform(input) {
  const tokens = tokenize(input)
  const ast = parseAndWithOrPriority(tokens)
  const normalized = normalize(ast)
  console.log(JSON.stringify(ast, null, 2))
  return astToPokemon(normalized)
}
