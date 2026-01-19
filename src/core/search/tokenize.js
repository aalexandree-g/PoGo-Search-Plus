// tokenize.js

const OPERATORS = {
  '&': 'AND',
  ',': 'OR',
  ':': 'OR',
  ';': 'OR',
  '!': 'NOT',
  '(': 'LPAREN',
  ')': 'RPAREN',
}

export function tokenize(input = '') {
  const tokens = []
  let current = ''
  let inQuotes = false

  const flush = () => {
    if (!current) return
    tokens.push({ type: 'TERM', value: current })
    current = ''
  }

  for (const char of input) {
    // 1) Guillemets : on les tokenise, et on bascule l'état "inQuotes"
    if (char === '"') {
      flush()
      tokens.push({ type: 'QUOTE' })
      inQuotes = !inQuotes
      continue
    }

    // 2) Opérateurs : reconnus partout (même dans les guillemets)
    if (OPERATORS[char]) {
      flush()
      tokens.push({ type: OPERATORS[char] })
      continue
    }

    // 3) Tout le reste (y compris espaces) devient du texte
    current += char
  }

  flush()
  return tokens // inQuotes permet de détecter un guillemet non refermé
}

export { OPERATORS }
