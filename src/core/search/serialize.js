export function astToPokemon(node) {
  if (node.type === 'TERM') return node.value

  const op = node.type === 'AND' ? '&' : ','
  return `${astToPokemon(node.left)}${op}${astToPokemon(node.right)}`
}
