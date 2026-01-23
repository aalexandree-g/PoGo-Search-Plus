export function toCNF(node) {
  if (!node || node.type === 'TERM') return node

  const left = toCNF(node.left)
  const right = toCNF(node.right)

  if (node.type === 'AND') {
    return { type: 'AND', left, right }
  }

  // OR
  if (left.type === 'AND') {
    return {
      type: 'AND',
      left: toCNF({ type: 'OR', left: left.left, right }),
      right: toCNF({ type: 'OR', left: left.right, right }),
    }
  }

  if (right.type === 'AND') {
    return {
      type: 'AND',
      left: toCNF({ type: 'OR', left, right: right.left }),
      right: toCNF({ type: 'OR', left, right: right.right }),
    }
  }

  return { type: 'OR', left, right }
}
