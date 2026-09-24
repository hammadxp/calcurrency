import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlagIcon } from "./flag-icon"
import type { Currency } from "@/types/currency"
import { formatRate } from "@/utils/currency"

type CurrencyControlProps = {
  currency: Currency
  source: Currency | null
  isSource: boolean
  rate: number
  onOpen: () => void
}

export function CurrencyControl({
  currency,
  source,
  isSource,
  rate,
  onOpen,
}: CurrencyControlProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Button
        variant="secondary"
        size="sm"
        onClick={onOpen}
        aria-label={`Change ${currency.code} currency`}
      >
        {currency.code} <ChevronDown data-icon="inline-end" />
      </Button>
      <div className="flex min-w-0 flex-col items-start gap-1">
        <FlagIcon currency={currency} size="small" />
        <span className="max-w-32 truncate text-xs font-medium opacity-75 sm:max-w-48">
          {currency.name}
        </span>
        {isSource ? (
          <span className="text-xs font-semibold opacity-75">Base amount</span>
        ) : source ? (
          <span className="text-xs opacity-75">
            1 {source.code} = {formatRate(rate)} {currency.code}
          </span>
        ) : null}
      </div>
    </div>
  )
}
