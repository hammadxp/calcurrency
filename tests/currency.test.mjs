import assert from "node:assert/strict"
import test from "node:test"
import {
  deleteEditableAmount,
  formatAmount,
  formatEditableAmount,
  formatRateDate,
  formatRate,
  formatRelativeTimestamp,
  isRateData,
  normalizeAmount,
  parseEditableAmount,
} from "../utils/currency.ts"

const settings = { decimals: true, compact: false, remember: true }

test("amount input keeps one decimal separator", () => {
  assert.equal(normalizeAmount("12.3.4x"), "12.34")
  assert.equal(normalizeAmount("0.05"), "0.05")
})

test("editable amounts use locale separators without changing stored digits", () => {
  assert.equal(formatEditableAmount("1234567.80", "en-US"), "1,234,567.80")
  assert.equal(parseEditableAmount("1,234,567.80", "en-US"), "1234567.80")
  assert.equal(formatEditableAmount("1234567.80", "de-DE"), "1.234.567,80")
  assert.equal(parseEditableAmount("1.234.567,80", "de-DE"), "1234567.80")
  assert.equal(formatEditableAmount("12.", "de-DE"), "12,")
  assert.equal(formatEditableAmount("1234567.80", "en-IN"), "12,34,567.80")
  assert.equal(formatEditableAmount("", "de-DE"), "")
  assert.equal(
    formatAmount(1234.56, "EUR", settings, undefined, "de-DE"),
    "1.234,56"
  )
})

test("backspace and delete remove digits around grouping separators", () => {
  assert.deepEqual(deleteEditableAmount("1,234", 5, 5, "en-US", "Backspace"), {
    value: "123",
    cursor: 3,
  })
  assert.deepEqual(deleteEditableAmount("1,234", 2, 2, "en-US", "Backspace"), {
    value: "234",
    cursor: 0,
  })
  assert.deepEqual(deleteEditableAmount("1.234", 1, 1, "de-DE", "Delete"), {
    value: "134",
    cursor: 1,
  })
  assert.deepEqual(deleteEditableAmount("1,234", 1, 2, "en-US", "Delete"), {
    value: "134",
    cursor: 1,
  })
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

test("rate timestamps describe elapsed time", () => {
  const now = new Date("2026-09-21T12:00:00.000Z")
  assert.equal(
    formatRelativeTimestamp("2026-09-21T11:59:40.000Z", now),
    "Just now"
  )
  assert.equal(
    formatRelativeTimestamp("2026-09-21T11:57:00.000Z", now),
    "3 minutes ago"
  )
  assert.equal(
    formatRelativeTimestamp("2026-09-14T12:00:00.000Z", now),
    "a week ago"
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
