import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    <Button
      variant="ghost"
      className={cn(
        "h-16 w-full justify-start gap-3 rounded-md border-b border-border px-2.5 text-left",
        selected && "bg-accent"
      )}
      onClick={() => onSelect(currency.code)}
      aria-pressed={selected}
    >
      <FlagIcon currency={currency} size="small" />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <strong className="text-[13px]">{currency.code}</strong>
        <small className="text-[11px] text-slate-500 dark:text-neutral-300">
          {currency.name}
        </small>
      </span>
      {selected ? <Check size={17} /> : null}
    </Button>
  )
}
