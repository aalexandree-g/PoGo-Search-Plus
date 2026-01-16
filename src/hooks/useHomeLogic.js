import { useState } from 'react'

export function useHomeLogic({ onResize } = {}) {
  const [value, setValue] = useState('')
  const [result, setResult] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isRulesOpen, setIsRulesOpen] = useState(false)

  const toggleRules = () => {
    setIsRulesOpen((prev) => !prev)
  }

  const handleReset = () => {
    setValue('')
    setResult('')
    setHasSubmitted(false)
    requestAnimationFrame(() => {
      onResize?.()
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('SUBMIT value:', value)

    setResult(value)
    setHasSubmitted(true)
  }

  const showReset = hasSubmitted || value.length > 0

  return {
    value,
    setValue,
    result,
    hasSubmitted,
    isRulesOpen,
    toggleRules,
    handleReset,
    handleSubmit,
    showReset,
  }
}
