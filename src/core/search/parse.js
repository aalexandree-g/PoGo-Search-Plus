import { termNode, combineLeft } from './astUtils'

/**
 * Walk tokens while tracking parenthesis depth.
 * Calls `onTopLevelToken` only at top level (depth === 0).
 * Also validates parentheses.
 */
function walkTopLevel(tokens, onTopLevelToken) {
  let depth = 0

  tokens.forEach((token, i) => {
    if (token.type === 'LPAREN') depth++
    else if (token.type === 'RPAREN') depth--

    if (depth < 0) throw new Error('Parenthèses non ouvertes')

    if (depth === 0) onTopLevelToken(token, i)
  })

  if (depth !== 0) throw new Error('Parenthèses non fermées')
}

/**
 * True if any op in `opTypes` exists at top level (outside parentheses).
 */
function hasTopLevelOp(tokens, opTypes) {
  let found = false

  walkTopLevel(tokens, (t) => {
    if (opTypes.includes(t.type)) found = true
  })

  return found
}

/**
 * Splits tokens into segments separated by `separatorType`,
 * at top level (depth === 0), ignoring separators inside parentheses.
 */
function splitBy(tokens, separatorType) {
  const segments = []
  let start = 0

  walkTopLevel(tokens, (t, i) => {
    if (t.type === separatorType) {
      segments.push(tokens.slice(start, i))
      start = i + 1
    }
  })

  segments.push(tokens.slice(start))

  // reject empty segments: "a&", "&a", "a&&b"
  if (segments.some((seg) => seg.length === 0)) {
    throw new Error(`Expression incomplète autour d'un ${separatorType}`)
  }

  return segments
}

/**
 * If the whole segment is wrapped by parentheses,
 * remove them: ( ... ) -> ...
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

  // reject empty expressions: "()", "( )"
  if (!unwrapped.length) throw new Error('Empty expression')

  // If there are top-level operators, this is not a single PRIMARY.
  // Delegate to the expression parser so NOT is handled per-segment.
  if (hasTopLevelOp(unwrapped, ['AND', 'OR'])) {
    return parseAndWithOrPriority(unwrapped)
  }

  // Now NOT is safe: it applies to ONE primary (TERM or parenthesized expr)
  if (unwrapped[0].type === 'NOT') {
    if (unwrapped.length === 1) throw new Error("Expression vide après '!'")
    return { type: 'NOT', child: parsePrimary(unwrapped.slice(1)) }
  }

  // for a single TERM
  if (unwrapped.length === 1) {
    const token = unwrapped[0]
    if (token.type !== 'TERM') throw new Error('Expected TERM')
    return termNode(token)
  }

  // for an expression (often coming from parentheses)
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
  if (!tokens.length) throw new Error('Empty expression')

  const andSegments = splitBy(tokens, 'AND')
  const orNodes = andSegments.map((seg) => parseChain(seg, 'OR'))

  return orNodes.length === 1 ? orNodes[0] : combineLeft(orNodes, 'AND')
}
