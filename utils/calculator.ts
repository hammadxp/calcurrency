export type Operator = "+" | "-" | "×" | "÷"

export type CalculatorMemory = {
  left: number | null
  operator: Operator | null
  awaitingNext: boolean
  afterResult: boolean
  error: string | null
}

export const EMPTY_MEMORY: CalculatorMemory = {
  left: null,
  operator: null,
  awaitingNext: false,
  afterResult: false,
  error: null,
}

function toAmount(value: number) {
  return Number(value.toPrecision(12)).toLocaleString("en-US", {
    useGrouping: false,
    maximumFractionDigits: 12,
  })
}

function calculate(left: number, right: number, operator: Operator) {
  switch (operator) {
    case "+":
      return left + right
    case "-":
      return left - right
    case "×":
      return left * right
    case "÷":
      return right === 0 ? NaN : left / right
  }
}

export function applyCalculatorKey(
  amount: string,
  memory: CalculatorMemory,
  key: string
) {
  if (key === "clear") return { amount: "", memory: EMPTY_MEMORY }

  if (/^\d$/.test(key) || key === ".") {
    const startFresh =
      memory.awaitingNext || memory.afterResult || !!memory.error
    const next = startFresh
      ? key === "."
        ? "0."
        : key
      : key === "." && amount.includes(".")
        ? amount
        : amount + key
    return {
      amount: next,
      memory: {
        ...memory,
        awaitingNext: false,
        afterResult: false,
        error: null,
      },
    }
  }

  if (key === "delete") {
    return {
      amount: memory.awaitingNext ? "" : amount.slice(0, -1),
      memory: {
        ...memory,
        awaitingNext: false,
        afterResult: false,
        error: null,
      },
    }
  }

  if (key === "%") {
    const percent = Number(amount || 0) / 100
    const value =
      memory.left !== null && ["+", "-"].includes(memory.operator ?? "")
        ? memory.left * percent
        : percent
    return {
      amount: toAmount(value),
      memory: {
        ...memory,
        awaitingNext: false,
        afterResult: false,
        error: null,
      },
    }
  }

  if (!["+", "-", "×", "÷", "="].includes(key)) return { amount, memory }

  const operator = key as Operator | "="
  const right = Number(amount || 0)
  if (memory.operator && memory.left !== null && !memory.awaitingNext) {
    const result = calculate(memory.left, right, memory.operator)
    if (!Number.isFinite(result)) {
      return {
        amount,
        memory: { ...EMPTY_MEMORY, error: "Cannot divide by zero" },
      }
    }

    const nextAmount = toAmount(result)
    return operator === "="
      ? { amount: nextAmount, memory: { ...EMPTY_MEMORY, afterResult: true } }
      : {
          amount: nextAmount,
          memory: {
            ...EMPTY_MEMORY,
            left: result,
            operator,
            awaitingNext: true,
          },
        }
  }

  if (operator === "=") return { amount, memory }

  return {
    amount,
    memory: {
      ...EMPTY_MEMORY,
      left: memory.awaitingNext && memory.left !== null ? memory.left : right,
      operator,
      awaitingNext: true,
    },
  }
}
