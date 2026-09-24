import assert from "node:assert/strict"
import test from "node:test"
import { applyCalculatorKey, EMPTY_MEMORY } from "../utils/calculator.ts"
import { formatEditableAmount, normalizeAmount } from "../utils/currency.ts"

function press(keys) {
  return [...keys].reduce(
    (state, key) => applyCalculatorKey(state.amount, state.memory, key),
    { amount: "", memory: EMPTY_MEMORY }
  )
}

test("calculator chains operations and starts a fresh value after equals", () => {
  assert.equal(press(["1", "2", "+", "3", "×", "2", "="]).amount, "30")
  assert.equal(press(["1", "+", "2", "=", "4"]).amount, "4")
  assert.equal(press(["0", ".", "1", "+", "0", ".", "2", "="]).amount, "0.3")
})

test("subtraction displays negative amounts and division by zero is actionable", () => {
  const negative = press(["2", "-", "5", "="])
  assert.equal(negative.amount, "-3")
  assert.equal(normalizeAmount("-3"), "-3")
  assert.equal(formatEditableAmount("-1234.5", "en-US"), "-1,234.5")
  assert.equal(
    press(["8", "÷", "0", "="]).memory.error,
    "Cannot divide by zero"
  )
})

test("percentage uses the first operand for additions", () => {
  assert.equal(press(["1", "0", "0", "+", "1", "0", "%", "="]).amount, "110")
  assert.equal(press(["5", "0", "%"]).amount, "0.5")
})
