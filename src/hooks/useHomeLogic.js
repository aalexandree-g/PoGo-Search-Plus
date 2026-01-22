import { useState } from 'react'
import { tokenize } from '../core/search/tokenize'
import { parseAndWithOrPriority } from '../core/search/parse'

export function useHomeLogic({ onResize } = {}) {
  const [value, setValue] = useState('')
  const [result, setResult] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isRulesOpen, setIsRulesOpen] = useState(false)

  const toggleRules = () => setIsRulesOpen((prev) => !prev)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const handleReset = () => {
    setValue('')
    setResult('')
    setHasSubmitted(false)
    setIsFocused(false)
    requestAnimationFrame(() => onResize?.())
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const tokens = tokenize(value)
    const ast = parseAndWithOrPriority(tokens)
    setResult(JSON.stringify(ast, null, 2))
    setHasSubmitted(true)
  }

  const showReset = hasSubmitted || value.length > 0

  return {
    value,
    setValue,
    result,
    hasSubmitted,
    isFocused,
    isRulesOpen,
    toggleRules,
    handleFocus,
    handleBlur,
    handleReset,
    handleSubmit,
    showReset,
  }
}
