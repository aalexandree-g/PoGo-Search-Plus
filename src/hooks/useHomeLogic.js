import { useState } from 'react'
import { tokenize } from '../core/search/tokenize'
import { parseAndWithOrPriority } from '../core/search/parse'
import { toCNF } from '../core/search/normalize'
import { astToPokemon } from '../core/search/serialize'

export function useHomeLogic({ onResize } = {}) {
  const [value, setValue] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isRulesOpen, setIsRulesOpen] = useState(false)

  const toggleRules = () => setIsRulesOpen((prev) => !prev)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const handleChange = (nextValue) => {
    setValue(nextValue)
    setResult('')
    setError(null)
  }

  const handleReset = () => {
    setValue('')
    setResult('')
    setError(null)
    setHasSubmitted(false)
    setIsFocused(false)
    requestAnimationFrame(() => onResize?.())
  }

  const MAX_LENGTH = 100000

  const handleSubmit = (e) => {
    e.preventDefault()

    let resultValue = ''
    let errorValue = null

    try {
      const tokens = tokenize(value)
      const ast = parseAndWithOrPriority(tokens)
      const normalized = toCNF(ast)
      resultValue = astToPokemon(normalized)
      //resultValue = JSON.stringify(ast, null, 2)

      if (resultValue.length > MAX_LENGTH) {
        throw new Error(
          `Résultat trop long (${resultValue.length} caractères). Limite : ${MAX_LENGTH}.`
        )
      }
    } catch (err) {
      errorValue = err.message
    }

    setResult(resultValue)
    setError(errorValue)
    setHasSubmitted(true)
  }

  const showReset = hasSubmitted || value.length > 0

  return {
    value,
    result,
    error,
    hasSubmitted,
    isFocused,
    isRulesOpen,
    toggleRules,
    handleFocus,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    showReset,
  }
}
