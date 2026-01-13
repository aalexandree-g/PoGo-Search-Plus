import { useCallback, useEffect, useRef } from 'react'

/**
 * useAutoResizeTextarea
 *
 * Custom React hook that enables an auto-growing <textarea>.
 * It adjusts the textarea height to match its content, while keeping a minimum
 * baseline height to avoid the "jump" that often happens on the first keystroke.
 *
 * How it works:
 * - A ref (`ref`) is attached to the <textarea> to access the DOM element.
 * - On mount, the hook captures the initial rendered height (`offsetHeight`)
 *   as the baseline minimum height (includes rows, padding, border, etc.).
 * - On each input, it:
 *   1) sets height to "auto" to let the browser recalculate content height
 *   2) reads `scrollHeight` (real content height)
 *   3) applies `max(scrollHeight, baseline)` in pixels
 *
 * @returns {{
 *   ref: import('react').RefObject<HTMLTextAreaElement>,
 *   onInput: (event?: any) => void
 * }}
 */
export function useAutoResizeTextarea() {
  const ref = useRef(null)
  const baseHeightRef = useRef(0)

  const resize = useCallback(() => {
    const el = ref.current
    if (!el) return

    el.style.height = 'auto'
    const next = Math.max(el.scrollHeight, baseHeightRef.current)
    el.style.height = `${next}px`
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    baseHeightRef.current = el.offsetHeight
    resize()
  }, [resize])

  return {
    ref,
    onInput: resize,
  }
}
