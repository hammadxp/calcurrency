"use client"

import { useDeferredValue, useId, useMemo, useRef, useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CurrencyOption } from "./currency-option"
import { useModalFocus } from "@/hooks/use-modal-focus"
import type { Currency } from "@/types/currency"

type CurrencyPickerProps = {
  slot: "add" | "replace" | "rates"
  selectedCode: string | null
  currencies: Currency[]
  onSelect: (code: string) => void
  onClose: () => void
}

const ROW_HEIGHT = 64
const VISIBLE_ROWS = 12
const OVERSCAN = 3

export function CurrencyPicker({
  slot,
  selectedCode,
  currencies,
  onSelect,
  onClose,
}: CurrencyPickerProps) {
  const [search, setSearch] = useState("")
  const [scrollTop, setScrollTop] = useState(0)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const query = useDeferredValue(search.trim().toLowerCase())
  const filtered = useMemo(
    () =>
      query
        ? currencies.filter(
            (currency) =>
              currency.code.toLowerCase().includes(query) ||
              currency.name.toLowerCase().includes(query)
          )
        : currencies,
    [currencies, query]
  )
  const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN)
  const end = Math.min(filtered.length, start + VISIBLE_ROWS + OVERSCAN * 2)

  useModalFocus(dialogRef, searchRef, onClose)

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center bg-slate-900/60 p-5 dark:bg-neutral-950/70"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="max-h-[min(720px,90vh)] w-[min(560px,100%)] overflow-hidden rounded-2xl border border-slate-900/10 bg-stone-50 text-slate-900 shadow-[0_25px_70px_rgb(15_23_42_/_28%)] dark:bg-neutral-800 dark:text-stone-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex justify-between bg-emerald-100 px-[26px] pt-[26px] pb-[21px] dark:bg-emerald-950">
          <div>
            <span className="mb-[7px] block text-[11px] font-bold tracking-[0.08em] text-slate-500 uppercase dark:text-neutral-300">
              select{" "}
              {slot === "add"
                ? "new currency"
                : slot === "replace"
                  ? "replacement"
                  : "rate base"}
            </span>
            <h2 className="text-[25px] tracking-[-0.08em]" id={titleId}>
              Pick a currency
            </h2>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="self-start"
            onClick={onClose}
            aria-label="Close currency picker"
          >
            <X size={18} />
          </Button>
        </div>
        <label className="search-field mx-3.5 my-3 flex items-center gap-2.5 rounded-[7px] border border-stone-200 bg-stone-100 px-3.5 py-3 md:mx-5 dark:border-neutral-600 dark:bg-neutral-900">
          <Search size={17} />
          <input
            className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-500 dark:text-stone-50"
            ref={searchRef}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              listRef.current?.scrollTo(0, 0)
              setScrollTop(0)
            }}
            placeholder="Search by name or code"
            aria-label="Search currencies"
          />
          <kbd className="rounded bg-stone-200 px-1.5 py-1 text-[10px] text-slate-500 dark:bg-neutral-700 dark:text-neutral-300">
            esc
          </kbd>
        </label>
        <div
          ref={listRef}
          className="max-h-[min(50vh,500px)] min-h-64 overflow-auto px-3.5 pb-2 md:min-h-80 md:px-5"
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        >
          <div style={{ height: start * ROW_HEIGHT }} aria-hidden="true" />
          {filtered.slice(start, end).map((currency) => (
            <CurrencyOption
              key={currency.code}
              currency={currency}
              selected={currency.code === selectedCode}
              onSelect={onSelect}
            />
          ))}
          <div
            style={{ height: (filtered.length - end) * ROW_HEIGHT }}
            aria-hidden="true"
          />
          {filtered.length === 0 ? (
            <p className="px-6 py-4 text-[13px] text-slate-500 dark:text-neutral-300">
              {search
                ? "No currencies found."
                : "All available currencies are already in your list."}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
