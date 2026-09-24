"use client"

import { useState, type Dispatch, type SetStateAction } from "react"
import { applyCalculatorKey, EMPTY_MEMORY } from "@/utils/calculator"
import { normalizeAmount } from "@/utils/currency"

export function useCalculator(
  amount: string,
  setAmount: Dispatch<SetStateAction<string>>
) {
  const [memory, setMemory] = useState(EMPTY_MEMORY)

  function pressKey(key: string) {
    const result = applyCalculatorKey(amount, memory, key)
    setAmount(result.amount)
    setMemory(result.memory)
  }

  function changeAmount(value: string) {
    setAmount(normalizeAmount(value))
    setMemory((current) => ({
      ...current,
      awaitingNext: false,
      afterResult: false,
      error: null,
    }))
  }

  return { memory, pressKey, changeAmount }
}
