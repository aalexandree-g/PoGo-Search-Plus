import { useState } from 'react'
import { tokenize } from '../core/search/tokenize'
import { parseAndWithOrPriority } from '../core/search/parse'

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

  const handleSubmit = (e) => {
    e.preventDefault()

    let resultValue = ''
    let errorValue = null

    try {
      const tokens = tokenize(value)
      const ast = parseAndWithOrPriority(tokens)
      resultValue = JSON.stringify(ast, null, 2)
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
