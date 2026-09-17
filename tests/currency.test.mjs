import assert from "node:assert/strict"
import test from "node:test"
import {
  formatAmount,
  formatRate,
  isRateData,
  normalizeAmount,
} from "../lib/currency.ts"

const settings = { decimals: true, compact: false, remember: true }

test("amount input keeps one decimal separator", () => {
  assert.equal(normalizeAmount("12.3.4x"), "12.34")
  assert.equal(normalizeAmount("0.05"), "0.05")
})

test("display settings affect converted amounts", () => {
  assert.equal(formatAmount(1234.56, "USD", settings), "1,234.56")
  assert.equal(
    formatAmount(1234.56, "USD", { ...settings, decimals: false }),
    "1,235"
  )
  assert.equal(
    formatAmount(1234.56, "USD", { ...settings, compact: true }),
    "1.23K"
  )
  assert.equal(formatAmount(1234.56, "JPY", settings), "1,235")
})

test("reference rates retain useful precision regardless of amount settings", () => {
  assert.equal(formatRate(0.8665), "0.8665")
  assert.equal(formatRate(0.00003122), "0.00003122")
  assert.equal(formatRate(0), "—")
})

test("cached rates require matching currencies and positive rates", () => {
  const valid = {
    rates: { USD: 1, EUR: 0.9 },
    currencies: [{ code: "EUR", name: "Euro", symbol: "€" }],
    refreshedAt: "2026-09-17T00:00:00.000Z",
  }
  assert.equal(isRateData(valid), true)
  assert.equal(isRateData({ ...valid, rates: { USD: 1, EUR: -2 } }), false)
  assert.equal(
    isRateData({
      ...valid,
      currencies: [{ code: "GBP", name: "Pound", symbol: "£" }],
    }),
    false
  )
  assert.equal(isRateData({ ...valid, refreshedAt: "bad date" }), false)
})
