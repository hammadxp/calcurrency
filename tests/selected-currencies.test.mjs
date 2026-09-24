import assert from "node:assert/strict"
import test from "node:test"
import {
  DEFAULT_SELECTED,
  moveSelectedCurrency,
  readSelected,
} from "../utils/selected-currencies.ts"

test("saved currency pairs migrate to an ordered list", () => {
  assert.deepEqual(readSelected(JSON.stringify({ from: "GBP", to: "JPY" })), [
    { code: "GBP", color: "mint" },
    { code: "JPY", color: "paper" },
  ])
  assert.deepEqual(readSelected("broken"), DEFAULT_SELECTED)
})

test("saved list keeps valid unique currencies and colors", () => {
  const saved = [
    { code: "USD", color: "sky" },
    { code: "USD", color: "peach" },
    { code: "EUR", color: "lemon" },
    { code: "BAD!", color: "mint" },
  ]
  assert.deepEqual(readSelected(JSON.stringify(saved)), [saved[0], saved[2]])
})

test("reordering keeps every currency and its chosen color", () => {
  const selected = [...DEFAULT_SELECTED, { code: "JPY", color: "lilac" }]
  assert.deepEqual(moveSelectedCurrency(selected, 2, 0), [
    selected[2],
    selected[0],
    selected[1],
  ])
  assert.deepEqual(selected, [
    ...DEFAULT_SELECTED,
    { code: "JPY", color: "lilac" },
  ])
})
