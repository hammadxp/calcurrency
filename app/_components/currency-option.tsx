import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { FlagIcon } from "./flag-icon"
import type { Currency } from "@/types/currency"

type CurrencyOptionProps = {
  currency: Currency
  selected: boolean
  onSelect: (code: string) => void
}

export function CurrencyOption({
  currency,
  selected,
  onSelect,
}: CurrencyOptionProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-[13px] rounded-md border-0 border-b border-stone-200 bg-transparent px-2.5 py-3 text-left text-slate-900 transition-colors hover:bg-emerald-100 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 dark:border-slate-700 dark:text-stone-50 dark:hover:bg-emerald-950",
        selected && "bg-emerald-100 dark:bg-emerald-950"
      )}
      onClick={() => onSelect(currency.code)}
      aria-pressed={selected}
    >
      <FlagIcon currency={currency} size="small" />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <strong className="text-[13px]">{currency.code}</strong>
        <small className="text-[11px] text-slate-500 dark:text-slate-300">
          {currency.name}
        </small>
      </span>
      {selected ? <Check size={17} /> : null}
    </button>
  )
}
