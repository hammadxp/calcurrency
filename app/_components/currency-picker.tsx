"use client"

import { useId, useRef, useState } from "react"
import { Search, X } from "lucide-react"
import { CurrencyOption } from "./currency-option"
import { useModalFocus } from "@/hooks/use-modal-focus"
import type { Currency, Slot } from "@/types/currency"

type CurrencyPickerProps = {
  slot: Slot | "rates"
  selectedCode: string | null
  currencies: Currency[]
  onSelect: (code: string) => void
  onClear?: () => void
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
      className="fixed inset-0 z-20 grid place-items-center bg-slate-900/60 p-5 backdrop-blur-[8px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="max-h-[min(720px,90vh)] w-[min(560px,100%)] overflow-hidden rounded-2xl border border-slate-900/10 bg-stone-50 text-slate-900 shadow-[0_25px_70px_rgb(15_23_42_/_28%)] dark:bg-slate-800 dark:text-stone-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex justify-between bg-emerald-100 px-[26px] pt-[26px] pb-[21px] dark:bg-emerald-950">
          <div>
            <span className="mb-[7px] block text-[11px] font-bold tracking-[0.08em] text-slate-500 uppercase dark:text-slate-300">
              select{" "}
              {slot === "from"
                ? "source"
                : slot === "to"
                  ? "target"
                  : "rate base"}
            </span>
            <h2 className="text-[25px] tracking-[-0.08em]" id={titleId}>
              Pick a currency
            </h2>
          </div>
          <button
            type="button"
            className="grid size-9 place-items-center self-start rounded-md border border-slate-900/20 bg-white/50 text-slate-900 transition-colors hover:bg-slate-900 hover:text-stone-50 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 dark:border-white/20 dark:bg-white/10 dark:text-stone-50"
            onClick={onClose}
            aria-label="Close currency picker"
          >
            <X size={18} />
          </button>
        </div>
        <label className="search-field mx-5 my-3 flex items-center gap-2.5 rounded-[7px] border border-stone-200 bg-stone-100 px-3.5 py-3 max-md:mx-3.5 dark:border-slate-600 dark:bg-slate-900">
          <Search size={17} />
          <input
            className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-500 dark:text-stone-50"
            ref={searchRef}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or code"
            aria-label="Search currencies"
          />
          <kbd className="rounded bg-stone-200 px-1.5 py-1 text-[10px] text-slate-500 dark:bg-slate-700 dark:text-slate-300">
            esc
          </kbd>
        </label>
        <div className="max-h-[min(50vh,500px)] min-h-80 overflow-auto px-5 pb-2 max-md:min-h-64 max-md:px-3.5">
          {filtered.map((currency) => (
            <CurrencyOption
              key={currency.code}
              currency={currency}
              selected={currency.code === selectedCode}
              onSelect={onSelect}
            />
          ))}
          {filtered.length === 0 ? (
            <p className="px-6 py-4 text-[13px] text-slate-500 dark:text-slate-300">
              No currencies found.
            </p>
          ) : null}
        </div>
        {onClear ? (
          <div className="border-t border-stone-200 px-6 py-[13px] dark:border-slate-700">
            <button
              type="button"
              className="p-1.5 text-[13px] text-rose-600 underline focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 dark:text-rose-400"
              onClick={onClear}
            >
              Clear this currency
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
