import { toCNF, toNNF, dedupeAst, normalize } from '../normalize'

const T = (value) => ({ type: 'TERM', value })
const N = (value) => ({ type: 'NOT', child: T(value) })
const AND = (left, right) => ({ type: 'AND', left, right })
const OR = (left, right) => ({ type: 'OR', left, right })

describe('toCNF', () => {
  test('returns TERM unchanged', () => {
    expect(toCNF(T('pikachu'))).toEqual(T('pikachu'))
  })

  test('returns NOT unchanged', () => {
    expect(toCNF(N('pikachu'))).toEqual(N('pikachu'))
  })

  test('keeps AND structure (children are CNF)', () => {
    const ast = AND(T('a'), OR(T('b'), T('c')))
    expect(toCNF(ast)).toEqual({
      type: 'AND',
      left: T('a'),
      right: { type: 'OR', left: T('b'), right: T('c') },
    })
  })

  test('distributes OR over AND on the left: (a&b),c -> (a,c)&(b,c)', () => {
    const ast = OR(AND(T('a'), T('b')), T('c'))

    expect(toCNF(ast)).toEqual({
      type: 'AND',
      left: { type: 'OR', left: T('a'), right: T('c') },
      right: { type: 'OR', left: T('b'), right: T('c') },
    })
  })

  test('distributes OR over AND on the right: a,(b&c) -> (a,b)&(a,c)', () => {
    const ast = OR(T('a'), AND(T('b'), T('c')))

    expect(toCNF(ast)).toEqual({
      type: 'AND',
      left: { type: 'OR', left: T('a'), right: T('b') },
      right: { type: 'OR', left: T('a'), right: T('c') },
    })
  })

  test('nested distribution produces CNF recursively', () => {
    // (a&b),(c&d) => (a,c)&(a,d)&(b,c)&(b,d)
    const ast = OR(AND(T('a'), T('b')), AND(T('c'), T('d')))

    expect(toCNF(ast)).toEqual({
      type: 'AND',
      left: {
        type: 'AND',
        left: { type: 'OR', left: T('a'), right: T('c') },
        right: { type: 'OR', left: T('a'), right: T('d') },
      },
      right: {
        type: 'AND',
        left: { type: 'OR', left: T('b'), right: T('c') },
        right: { type: 'OR', left: T('b'), right: T('d') },
      },
    })
  })
})

describe('toNNF', () => {
  test('keeps TERM as-is', () => {
    expect(toNNF(T('a'))).toEqual(T('a'))
  })

  test('keeps NOT(TERM) as-is', () => {
    expect(toNNF(N('a'))).toEqual(N('a'))
  })

  test('removes double negation: !!a -> a', () => {
    const ast = { type: 'NOT', child: { type: 'NOT', child: T('a') } }
    expect(toNNF(ast)).toEqual(T('a'))
  })

  test('pushes negation through AND: !(a&b) -> (!a),(!b)', () => {
    const ast = { type: 'NOT', child: AND(T('a'), T('b')) }

    expect(toNNF(ast)).toEqual({
      type: 'OR',
      left: N('a'),
      right: N('b'),
    })
  })

  test('pushes negation through OR: !(a,b) -> (!a)&(!b)', () => {
    const ast = { type: 'NOT', child: OR(T('a'), T('b')) }

    expect(toNNF(ast)).toEqual({
      type: 'AND',
      left: N('a'),
      right: N('b'),
    })
  })

  test('pushes NOT down and toggles operators through nested expressions', () => {
    // !(a,(b&c)) -> (!a)&(!(b&c)) -> (!a)&((!b),(!c))
    const ast = { type: 'NOT', child: OR(T('a'), AND(T('b'), T('c'))) }

    expect(toNNF(ast)).toEqual({
      type: 'AND',
      left: N('a'),
      right: {
        type: 'OR',
        left: N('b'),
        right: N('c'),
      },
    })
  })
})

describe('dedupeAst', () => {
  test('dedupes inside OR chain: a,a -> a', () => {
    const ast = OR(T('a'), T('a'))
    expect(dedupeAst(ast)).toEqual(T('a'))
  })

  test('dedupes inside OR chain: a,b,a -> a,b', () => {
    const ast = OR(OR(T('a'), T('b')), T('a'))
    expect(dedupeAst(ast)).toEqual(OR(T('a'), T('b')))
  })

  test('dedupes inside AND chain: a&a -> a', () => {
    const ast = AND(T('a'), T('a'))
    expect(dedupeAst(ast)).toEqual(T('a'))
  })

  test('does NOT dedupe NOT(TERM) with TERM (different nodes)', () => {
    const ast = OR(N('a'), T('a'))
    expect(dedupeAst(ast)).toEqual({
      type: 'OR',
      left: N('a'),
      right: T('a'),
    })
  })

  test('dedupes only within the same operator (no cross-level merges)', () => {
    // (a&b),a  => dedupeAst should not remove 'a' because it’s not an OR-chain duplicate unless flattened; it IS an OR-chain: OR(AND(a,b), a)
    // Here we only test it keeps structure; duplicates are not across different subtree nodes unless same chain has exact same TERM nodes.
    const ast = OR(AND(T('a'), T('b')), T('a'))
    expect(dedupeAst(ast)).toEqual({
      type: 'OR',
      left: AND(T('a'), T('b')),
      right: T('a'),
    })
  })
})

describe('normalize', () => {
  test('runs NNF then CNF then dedupe', () => {
    // !!a,a  => NNF: a,a => CNF unchanged => dedupe => a
    const ast = OR(
      { type: 'NOT', child: { type: 'NOT', child: T('a') } },
      T('a')
    )

    expect(normalize(ast)).toEqual(T('a'))
  })

  test('throws on forbidden negated IV term: !4hp', () => {
    const ast = N('4hp')
    expect(() => normalize(ast)).toThrow(`Forbidden filter: "!4hp".`)
  })

  test('throws on forbidden negated IV term with range: !2-4defense', () => {
    const ast = N('2-4defense')
    expect(() => normalize(ast)).toThrow(`Forbidden filter: "!2-4defense".`)
  })

  test('allows negated non-IV term like !hp100', () => {
    const ast = N('hp100')
    expect(normalize(ast)).toEqual(N('hp100'))
  })

  test('detects forbidden negated IV terms inside a larger tree', () => {
    const ast = AND(T('pikachu'), N('0attack'))
    expect(() => normalize(ast)).toThrow(`Forbidden filter: "!0attack".`)
  })
})
