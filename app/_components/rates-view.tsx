"use client"

import { useDeferredValue, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronDown, Search } from "lucide-react"
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
  const deferredSearch = useDeferredValue(search.trim().toLowerCase())
  const filteredCurrencies = deferredSearch
    ? currencies.filter(
        (currency) =>
          currency.code.toLowerCase().includes(deferredSearch) ||
          currency.name.toLowerCase().includes(deferredSearch)
      )
    : currencies
  const baseRate = base ? rates[base.code] : undefined

  return (
    <section className="min-h-[calc(100svh-70px)] bg-stone-50 px-[max(5vw,28px)] pt-9.5 pb-15 text-slate-900 max-md:px-4.25 max-md:pt-6.5 max-md:pb-11 dark:bg-slate-950 dark:text-stone-50">
      <div className="mx-auto mb-7 flex max-w-295 items-center justify-between text-[13px] text-slate-500 max-md:mb-6 max-md:text-[9px] dark:text-slate-300">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md border border-stone-200 bg-stone-50 px-3.25 py-2.5 text-[13px] text-slate-900 transition-colors hover:bg-slate-900 hover:text-stone-50 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-50"
        >
          <ArrowLeft size={16} /> Converter
        </Link>
        <span>Indicative reference rates</span>
      </div>
      <div className="mx-auto max-w-295">
        <h1 className="max-w-180 font-sans text-[clamp(31px,3.4vw,48px)] leading-[1.1] font-bold tracking-tighter">
          Exchange rates
        </h1>
        <p className="mt-2.25 max-w-162.5 text-base leading-normal text-slate-500 max-md:text-sm dark:text-slate-300">
          Compare indicative rates before sending money.
        </p>
      </div>
      <div className="mx-auto mt-8.5 flex max-w-295 items-center gap-5 rounded-[9px] bg-emerald-600 px-6 py-5 text-base text-emerald-50 max-md:mt-6.25 max-md:flex-col max-md:items-start max-md:gap-3 max-md:p-4.25 max-md:text-sm dark:bg-emerald-800">
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
        <span className="ml-auto text-sm text-emerald-50 max-md:m-0">
          Compare every currency against {base?.name ?? "your chosen base"}.
        </span>
      </div>
      <div className="mx-auto mt-8.5 flex max-w-295 items-end justify-between gap-6 border-b border-stone-200 pb-3 max-md:flex-col max-md:items-stretch max-md:gap-3 dark:border-slate-700">
        <div className="flex items-end gap-4 max-md:justify-between">
          <h2 className="text-[25px] tracking-[-0.08em] max-md:text-[21px]">
            Currencies
          </h2>
          <span className="pb-1.5 text-[13px] text-slate-500 dark:text-slate-300">
            1 {base?.code ?? "currency"} equals
          </span>
        </div>
        <label className="search-field flex w-full max-w-80 items-center gap-2.5 rounded-md border border-stone-200 bg-white px-3 py-2.5 text-slate-500 max-md:max-w-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <Search size={16} />
          <input
            className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-500 dark:text-stone-50 dark:placeholder:text-slate-400"
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
          <p className="px-3.5 py-8 text-sm text-slate-500 dark:text-slate-300">
            No currencies match your search.
          </p>
        ) : null}
      </div>
    </section>
  )
}
