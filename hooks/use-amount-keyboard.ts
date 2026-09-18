"use client"

import { useEffect, type Dispatch, type SetStateAction } from "react"
import { normalizeAmount } from "@/utils/currency"

type UseAmountKeyboardOptions = {
  enabled: boolean
  setAmount: Dispatch<SetStateAction<string>>
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
  setAmount,
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

      if (/^\d$/.test(event.key) || event.key === ".") {
        setAmount((current) => normalizeAmount(current + event.key))
      } else if (event.key === "Backspace") {
        setAmount((current) => current.slice(0, -1))
      } else if (event.key === "Escape") {
        setAmount("")
      } else {
        return
      }

      event.preventDefault()
    }

    window.addEventListener("keydown", onKeyDown)

    return () => window.removeEventListener("keydown", onKeyDown)
  }, [enabled, setAmount])
}
