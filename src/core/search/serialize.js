/**
 * Converts an AST back into a Pokémon GO search string.
 *
 * Rules:
 * - TERM nodes return their raw value
 * - AND nodes use '&'
 * - OR nodes use ','
 */
export function astToPokemon(node) {
  if (node.type === 'TERM') return node.value

  if (node.type === 'NOT') {
    return `!${astToPokemon(node.child)}`
  }

  const op = node.type === 'AND' ? '&' : ','
  return `${astToPokemon(node.left)}${op}${astToPokemon(node.right)}`
}
