function termNode(token) {
  return { type: 'TERM', value: token.value }
}

/**
 * Splits tokens into segments separated by `separatorType`,
 * at top level (depth === 0), ignoring separators inside parentheses.
 */
function splitBy(tokens, separatorType) {
  const segments = []
  let start = 0
  let depth = 0

  tokens.forEach((token, i) => {
    if (token.type === 'LPAREN') depth++
    else if (token.type === 'RPAREN') depth--

    if (depth < 0) throw new Error('Unmatched closing parenthesis')

    if (depth === 0 && token.type === separatorType) {
      segments.push(tokens.slice(start, i))
      start = i + 1
    }
  })

  if (depth !== 0) throw new Error('Unmatched opening parenthesis')

  segments.push(tokens.slice(start))
  return segments
}

/**
 * Combines nodes into a left-associative binary tree.
 * Example: [a,b,c] with 'OR' -> OR(OR(a,b),c)
 */
function combineLeft(nodes, opType) {
  if (!nodes.length) throw new Error('No node to combine')
  return nodes
    .slice(1)
    .reduce((acc, node) => ({ type: opType, left: acc, right: node }), nodes[0])
}

/**
 * If the whole segment is wrapped by parentheses, remove them: ( ... ) -> ...
 */
function unwrapOuterParens(tokens) {
  const last = tokens.length - 1

  if (last < 1) return tokens
  if (tokens[0].type !== 'LPAREN') return tokens
  if (tokens[last].type !== 'RPAREN') return tokens

  let depth = 0

  for (let i = 0; i <= last; i++) {
    const type = tokens[i].type

    if (type === 'LPAREN') depth++
    else if (type === 'RPAREN') depth--

    if (depth === 0 && i < last) return tokens
  }

  return tokens.slice(1, last)
}

/**
 * Parse a primary expression:
 * - a single TERM
 * - or a parenthesized expression ( ... )
 */
function parsePrimary(segment) {
  const unwrapped = unwrapOuterParens(segment)

  if (!unwrapped.length) throw new Error('Empty expression')

  // for a single TERM
  if (unwrapped.length === 1) {
    const token = unwrapped[0]
    if (token.type !== 'TERM') throw new Error('Expected TERM')
    return termNode(token)
  }

  // for a parenthesized expression
  return parseAndWithOrPriority(unwrapped)
}

/**
 * Parses a chain of PRIMARY separated by `opType` at top level.
 */
function parseChain(tokens, opType) {
  if (!tokens.length) throw new Error(`Morceau ${opType} vide`)

  const segments = splitBy(tokens, opType)
  const nodes = segments.map((seg) => parsePrimary(seg))

  return nodes.length === 1 ? nodes[0] : combineLeft(nodes, opType)
}

// OR is higher priority than AND:
// - split by AND at top-level
// - each segment becomes an OR chain
// - then combine with AND
export function parseAndWithOrPriority(tokens) {
  if (!tokens.length) throw new Error('Expression vide')

  const andSegments = splitBy(tokens, 'AND')
  const orNodes = andSegments.map((seg) => parseChain(seg, 'OR'))

  return orNodes.length === 1 ? orNodes[0] : combineLeft(orNodes, 'AND')
}
