/**
 * Creates a TERM node from a token.
 */
export function termNode(token) {
  return { type: 'TERM', value: token.value }
}

/**
 * Combines nodes into a left-associative binary tree.
 * Example: [a,b,c] with 'OR' -> OR(OR(a,b),c)
 */
export function combineLeft(nodes, opType) {
  if (!nodes.length) throw new Error('No node to combine')

  return nodes
    .slice(1)
    .reduce((acc, node) => ({ type: opType, left: acc, right: node }), nodes[0])
}

/**
 * Flattens a tree of the same operator into a list of nodes.
 * Example: OR(OR(a,b),c) -> [a,b,c]
 */
export function flattenByType(node, type, acc = []) {
  if (!node) return acc

  if (node.type === type) {
    flattenByType(node.left, type, acc)
    flattenByType(node.right, type, acc)
  } else {
    acc.push(node)
  }

  return acc
}

/**
 * Builds a left-associative tree from a list of nodes.
 * Returns null for an empty list, or the node itself for a single element.
 */
export function buildChain(nodes, opType) {
  if (!nodes.length) return null
  return nodes.length === 1 ? nodes[0] : combineLeft(nodes, opType)
}

/**
 * Removes duplicate TERM nodes (by value), keeping the first occurrence.
 * Non-TERM nodes are always kept.
 */
export function dedupeTermNodes(nodes) {
  const seen = new Set()

  return nodes.filter((node) => {
    if (node.type !== 'TERM') return true

    if (seen.has(node.value)) return false
    seen.add(node.value)
    return true
  })
}
