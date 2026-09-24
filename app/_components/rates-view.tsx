"use client"

import { useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import { FlagIcon } from "./flag-icon"
import { RateRow } from "./rate-row"
import type { Currency } from "@/types/currency"

type RatesViewProps = {
  base: Currency | null
  rates: Record<string, number>
  currencies: Currency[]
  onOpenBase: () => void
}

export function RatesView({
  base,
  rates,
  currencies,
  onOpenBase,
}: RatesViewProps) {
  const [search, setSearch] = useState("")
  const query = search.trim().toLowerCase()
  const filteredCurrencies = query
    ? currencies.filter(
        (currency) =>
          currency.code.toLowerCase().includes(query) ||
          currency.name.toLowerCase().includes(query)
      )
    : currencies
  const baseRate = base ? rates[base.code] : undefined

  return (
    <section className="min-h-[calc(100svh-70px)] bg-background px-4.25 pt-6.5 pb-11 text-foreground md:px-[max(5vw,28px)] md:pt-9.5 md:pb-15">
      <div className="mx-auto max-w-295">
        <h1 className="max-w-180 font-sans text-2xl leading-tight font-bold tracking-tight md:text-4xl">
          Exchange rates
        </h1>
        <p className="mt-2.25 max-w-162.5 text-sm leading-normal text-slate-500 md:text-base dark:text-neutral-300">
          Compare the latest available reference rates across multiple
          currencies before sending money.
        </p>
      </div>
      <div className="mx-auto mt-6.25 flex max-w-295 flex-col items-start gap-3 rounded-[9px] bg-emerald-600 p-4.25 text-sm text-emerald-50 md:mt-8.5 md:flex-row md:items-center md:gap-5 md:px-6 md:py-5 md:text-base dark:bg-emerald-800">
        <span className="text-emerald-100">Base currency</span>
        <button
          type="button"
          className="inline-flex items-center gap-2.5 rounded-md border border-emerald-50/60 bg-white/10 px-3 py-2 font-bold text-white transition-colors hover:border-white hover:bg-white hover:text-emerald-800 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500"
          onClick={onOpenBase}
        >
          {base ? <FlagIcon currency={base} size="small" /> : null}
          <span>{base?.code ?? "Select"}</span>
          <ChevronDown size={16} />
        </button>
        <span className="text-sm text-emerald-50 md:ml-auto">
          Compare every currency against {base?.name ?? "your chosen base"}.
        </span>
      </div>
      <div className="mx-auto mt-8.5 flex max-w-295 flex-col items-stretch justify-between gap-3 border-b border-stone-200 pb-3 md:flex-row md:items-end md:gap-6 dark:border-neutral-700">
        <div className="flex items-end justify-between gap-4 md:justify-start">
          <h2 className="text-[21px] tracking-[-0.08em] md:text-[25px]">
            Currencies
          </h2>
          <span className="pb-1.5 text-[13px] text-slate-500 dark:text-neutral-300">
            1 {base?.code ?? "currency"} equals
          </span>
        </div>
        <label className="search-field flex w-full max-w-none items-center gap-2.5 rounded-md border border-stone-200 bg-white px-3 py-2.5 text-slate-500 md:max-w-80 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
          <Search size={16} />
          <input
            className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-500 dark:text-stone-50 dark:placeholder:text-neutral-400"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search currencies"
            aria-label="Search currencies"
          />
        </label>
      </div>
      <div className="mx-auto min-h-96 max-w-295">
        {filteredCurrencies.map((currency) => (
          <RateRow
            key={currency.code}
            currency={currency}
            rate={baseRate ? rates[currency.code] / baseRate : 0}
          />
        ))}
        {filteredCurrencies.length === 0 ? (
          <p className="px-3.5 py-8 text-sm text-slate-500 dark:text-neutral-300">
            No currencies match your search.
          </p>
        ) : null}
      </div>
    </section>
  )
}
