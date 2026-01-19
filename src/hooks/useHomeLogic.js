import { useRef, useState } from 'react'
import { normalize } from '../core/search/normalize'

export function useHomeLogic({ onResize } = {}) {
  const [value, setValue] = useState('')
  const [result, setResult] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isRulesOpen, setIsRulesOpen] = useState(false)

  const resultRef = useRef(null)

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
    const normalized = normalize(value)
    setResult(normalized)
    setHasSubmitted(true)
    requestAnimationFrame(() => {
      resultRef.current?.focus()
      resultRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
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
