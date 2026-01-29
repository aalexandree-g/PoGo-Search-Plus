import { flattenByType, dedupeTermNodes, buildChain } from './astUtils'

/**
 * Converts an expression tree to CNF (Conjunctive Normal Form),
 * by distributing OR over AND.
 *
 * Rules:
 * - AND(A, B) stays AND once children are normalized
 * - OR(AND(A, B), C) -> AND(OR(A, C), OR(B, C))
 * - OR(A, AND(B, C)) -> AND(OR(A, B), OR(A, C))
 */
export function toCNF(node) {
  if (!node || node.type === 'TERM' || node.type === 'NOT') return node

  const left = toCNF(node.left)
  const right = toCNF(node.right)

  // AND nodes are already CNF-friendly once children are CNF
  if (node.type === 'AND') {
    return { type: 'AND', left, right }
  }

  // OR: distribute over AND on the left
  // (A & B) | C  ->  (A | C) & (B | C)
  if (left?.type === 'AND') {
    return {
      type: 'AND',
      left: toCNF({ type: 'OR', left: left.left, right }),
      right: toCNF({ type: 'OR', left: left.right, right }),
    }
  }

  // OR: distribute over AND on the right
  // A | (B & C)  ->  (A | B) & (A | C)
  if (right?.type === 'AND') {
    return {
      type: 'AND',
      left: toCNF({ type: 'OR', left, right: right.left }),
      right: toCNF({ type: 'OR', left, right: right.right }),
    }
  }

  // default OR: no distribution needed
  return { type: 'OR', left, right }
}

/**
 * Pushes NOT down to TERM nodes (Negation Normal Form).
 *
 * Rules:
 * - !!A -> A
 * - !(A & B) -> (!A) | (!B)
 * - !(A | B) -> (!A) & (!B)
 */
export function toNNF(node) {
  return pushNot(node, false)
}

function pushNot(node, negated) {
  if (!node) return node

  // TERM
  if (node.type === 'TERM') {
    return negated ? { type: 'NOT', child: node } : node
  }

  // double negation / toggle
  if (node.type === 'NOT') {
    return pushNot(node.child, !negated)
  }

  // AND/OR when negated
  if (node.type === 'AND' || node.type === 'OR') {
    const op = negated ? (node.type === 'AND' ? 'OR' : 'AND') : node.type

    return {
      type: op,
      left: pushNot(node.left, negated),
      right: pushNot(node.right, negated),
    }
  }

  return node
}

/**
 * Removes duplicate TERM nodes inside AND / OR chains.
 *
 * Examples:
 * - pikachu,pikachu -> pikachu
 * - pikachu,3*,pikachu -> pikachu,3*
 * - 3*&pikachu&pikachu -> 3*&pikachu
 */
export function dedupeAst(node) {
  if (!node || node.type === 'TERM' || node.type === 'NOT') return node

  const left = dedupeAst(node.left)
  const right = dedupeAst(node.right)

  if (node.type === 'AND' || node.type === 'OR') {
    // flatten the chain, remove duplicates, then rebuild the tree
    const flat = flattenByType({ type: node.type, left, right }, node.type)
    const deduped = dedupeTermNodes(flat)

    return buildChain(deduped, node.type)
  }

  return { ...node, left, right }
}

// Reject negated IV filters
// Examples rejected: !4pv, !0attack, !2-4defense
// Examples allowed: !pv100
const FORBIDDEN_NEGATED_IV_REGEX =
  /^([0-4]|[0-4]-[0-4])(pv|attack|defense|attaque|défense)$/

function assertNoForbiddenIVTerms(node) {
  if (!node) return

  // Detect NOT(TERM(...))
  if (node.type === 'NOT' && node.child?.type === 'TERM') {
    const term = String(node.child.value).trim().toLowerCase()

    if (FORBIDDEN_NEGATED_IV_REGEX.test(term)) {
      throw new Error(`Forbidden filter : "!${node.child.value}". `)
    }

    return
  }

  assertNoForbiddenIVTerms(node.left)
  assertNoForbiddenIVTerms(node.right)
}

/**
 * Normalizes an AST using a list of passes.
 * Current pipeline: CNF -> dedupe
 */
export function normalize(node) {
  const nnf = toNNF(node)

  // throws if forbidden terms are found
  assertNoForbiddenIVTerms(nnf)

  return dedupeAst(toCNF(nnf))
}
