import { ArrowLeft } from "lucide-react"
import { RateRow } from "./rate-row"
import type { Currency } from "@/types/currency"
import { formatRate } from "@/utils/currency"

type RatesViewProps = {
  from: Currency | null
  to: Currency | null
  pairRate: number
  rates: Record<string, number>
  currencies: Currency[]
  onBack: () => void
}

export function RatesView({
  from,
  to,
  pairRate,
  rates,
  currencies,
  onBack,
}: RatesViewProps) {
  return (
    <section className="min-h-[calc(100svh-70px)] bg-stone-50 px-[max(5vw,28px)] pt-[38px] pb-[60px] text-slate-900 max-[760px]:px-[17px] max-[760px]:pt-[26px] max-[760px]:pb-11 dark:bg-slate-950 dark:text-stone-50">
      <div className="mx-auto mb-7 flex max-w-[1180px] items-center justify-between text-[13px] text-slate-500 max-[760px]:mb-6 max-[760px]:text-[9px] dark:text-slate-300">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-stone-200 bg-stone-50 px-[13px] py-2.5 text-[13px] text-slate-900 transition-colors hover:bg-slate-900 hover:text-stone-50 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-50"
          onClick={onBack}
        >
          <ArrowLeft size={16} /> Converter
        </button>
        <span>Reference rates · USD base</span>
      </div>
      <div className="mx-auto max-w-[1180px]">
        <h1 className="max-w-[720px] font-sans text-[clamp(31px,3.4vw,48px)] leading-[1.1] font-bold tracking-[-0.05em]">
          Exchange rates
        </h1>
        <p className="mt-[9px] max-w-[650px] text-base leading-[1.5] text-slate-500 max-[760px]:text-sm dark:text-slate-300">
          Compare indicative rates before sending money.
        </p>
      </div>
      <div className="mx-auto mt-[34px] flex max-w-[1180px] items-center gap-5 rounded-[9px] bg-emerald-600 px-6 py-5 text-base text-emerald-50 max-[760px]:mt-[25px] max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-1.5 max-[760px]:p-[17px] max-[760px]:text-sm dark:bg-emerald-800">
        <span className="text-emerald-100">Your selected pair</span>
        <strong className="text-[21px] max-[760px]:text-base">
          {from?.code ?? "—"} / {to?.code ?? "—"}
        </strong>
        <span className="ml-auto max-[760px]:m-0">
          1 {from?.code ?? "—"} equals {formatRate(pairRate)} {to?.code ?? "—"}
        </span>
      </div>
      <div className="mx-auto mt-[34px] mb-3 flex max-w-[1180px] items-end justify-between border-b border-stone-200 pb-3 dark:border-slate-700">
        <div>
          <h2 className="text-[25px] tracking-[-0.08em] max-[760px]:text-[21px]">
            Currencies
          </h2>
        </div>
        <span className="text-[13px] text-slate-500 dark:text-slate-300">
          1 USD buys
        </span>
      </div>
      <div className="mx-auto max-w-[1180px]">
        {currencies.map((currency) => (
          <RateRow
            key={currency.code}
            currency={currency}
            rate={rates[currency.code]}
          />
        ))}
      </div>
    </section>
  )
}
