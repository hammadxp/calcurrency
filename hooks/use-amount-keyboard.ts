"use client"

import { useEffect } from "react"

type UseAmountKeyboardOptions = {
  enabled: boolean
  onKey: (key: string) => void
}

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  )
}

export function useAmountKeyboard({
  enabled,
  onKey,
}: UseAmountKeyboardOptions) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        isTypingTarget(event.target)
      ) {
        return
      }

      const key =
        event.key === "Backspace"
          ? "delete"
          : event.key === "Escape"
            ? "clear"
            : event.key === "Enter"
              ? "="
              : event.key === "*" || event.key.toLowerCase() === "x"
                ? "×"
                : event.key === "/"
                  ? "÷"
                  : event.key
      if (
        !/^\d$/.test(key) &&
        ![".", "+", "-", "×", "÷", "=", "%", "delete", "clear"].includes(key)
      )
        return

      onKey(key)
      event.preventDefault()
    }

    window.addEventListener("keydown", onKeyDown)

    return () => window.removeEventListener("keydown", onKeyDown)
  }, [enabled, onKey])
}
