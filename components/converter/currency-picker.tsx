"use client"

import { useId, useRef, useState } from "react"
import { Search, X } from "lucide-react"
import { CurrencyOption } from "@/components/converter/currency-option"
import { useModalFocus } from "@/hooks/use-modal-focus"
import type { Currency, Slot } from "@/lib/currency"

type CurrencyPickerProps = {
  slot: Slot
  selectedCode: string | null
  currencies: Currency[]
  onSelect: (code: string) => void
  onClear: () => void
  onClose: () => void
}

export function CurrencyPicker({
  slot,
  selectedCode,
  currencies,
  onSelect,
  onClear,
  onClose,
}: CurrencyPickerProps) {
  const [search, setSearch] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const query = search.trim().toLowerCase()
  const filtered = query
    ? currencies.filter(
        (currency) =>
          currency.code.toLowerCase().includes(query) ||
          currency.name.toLowerCase().includes(query)
      )
    : currencies

  useModalFocus(dialogRef, searchRef, onClose)

  return (
    <div
      className="picker-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="picker"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="picker-header">
          <div>
            <span className="picker-kicker">
              select {slot === "from" ? "source" : "target"}
            </span>
            <h2 id={titleId}>Pick a currency</h2>
          </div>
          <button
            type="button"
            className="close-button"
            onClick={onClose}
            aria-label="Close currency picker"
          >
            <X size={18} />
          </button>
        </div>
        <label className="search-field">
          <Search size={17} />
          <input
            ref={searchRef}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or code"
            aria-label="Search currencies"
          />
          <kbd>esc</kbd>
        </label>
        <div className="currency-list">
          {filtered.map((currency) => (
            <CurrencyOption
              key={currency.code}
              currency={currency}
              selected={currency.code === selectedCode}
              onSelect={onSelect}
            />
          ))}
          {filtered.length === 0 ? (
            <p className="px-6 py-4 text-sm text-[var(--muted)]">
              No currencies found.
            </p>
          ) : null}
        </div>
        <div className="picker-footer">
          <button type="button" className="clear-pick" onClick={onClear}>
            Clear this currency
          </button>
        </div>
      </div>
    </div>
  )
}
