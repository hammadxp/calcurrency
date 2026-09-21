import assert from "node:assert/strict"
import test from "node:test"
import {
  formatAmount,
  formatRateDate,
  formatRate,
  formatRelativeTimestamp,
  isRateData,
  normalizeAmount,
} from "../utils/currency.ts"

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

test("provider date is displayed without a local timezone shift", () => {
  assert.equal(formatRateDate("2026-09-17"), "Sep 17, 2026")
})

test("rate timestamps use readable relative dates and 24-hour time", () => {
  const now = new Date(2026, 8, 21, 12, 0)
  assert.equal(
    formatRelativeTimestamp(new Date(2026, 8, 21, 0, 5).toISOString(), now),
    "Today, 00:05"
  )
  assert.equal(
    formatRelativeTimestamp(new Date(2026, 8, 20, 16, 30).toISOString(), now),
    "Yesterday, 16:30"
  )
})

test("cached rates require matching currencies and positive rates", () => {
  const valid = {
    rates: { USD: 1, EUR: 0.9 },
    currencies: [{ code: "EUR", name: "Euro", symbol: "€" }],
    refreshedAt: "2026-09-17T00:00:00.000Z",
  }
  assert.equal(isRateData(valid), true)
  assert.equal(isRateData({ ...valid, rates: { USD: 1, EUR: -2 } }), false)
  assert.equal(isRateData({ ...valid, rates: { USD: 2, EUR: 0.9 } }), false)
  assert.equal(
    isRateData({
      ...valid,
      currencies: [{ code: "GBP", name: "Pound", symbol: "£" }],
    }),
    false
  )
  assert.equal(isRateData({ ...valid, refreshedAt: "bad date" }), false)
  assert.equal(isRateData({ ...valid, rateDate: "bad date" }), false)
  assert.equal(
    isRateData({
      ...valid,
      currencies: [{ code: "EUR", name: "Euro", symbol: "€", flag: "../../" }],
    }),
    false
  )
})
