import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FlagIcon } from "./flag-icon"
import type { Currency } from "@/types/currency"
import { formatRate } from "@/utils/currency"

type CurrencyControlProps = {
  currency: Currency
  source: Currency | null
  isSource: boolean
  rate: number
  buttonTextClassName: string
  onOpen: () => void
}

export function CurrencyControl({
  currency,
  source,
  isSource,
  rate,
  buttonTextClassName,
  onOpen,
}: CurrencyControlProps) {
  return (
    <div className="order-2 -ml-1 flex min-w-0 flex-1 items-center gap-2 sm:flex-none sm:gap-3">
      <Button
        variant="default"
        size="sm"
        className={cn(
          "bg-foreground/80 hover:bg-foreground/70",
          buttonTextClassName
        )}
        onClick={onOpen}
        aria-label={`Change ${currency.code} currency`}
      >
        {currency.code} <ChevronDown data-icon="inline-end" />
      </Button>
      <div className="flex min-w-0 items-center gap-2 sm:flex-col sm:items-start sm:gap-1">
        <FlagIcon currency={currency} size="small" />
        <div className="flex min-w-0 flex-col gap-0.5 sm:gap-1">
          <span className="truncate text-xs font-medium opacity-75 sm:max-w-48">
            <span className="sm:hidden">{currency.code}</span>
            <span className="hidden sm:inline">{currency.name}</span>
          </span>
          {isSource ? (
            <span className="truncate text-xs font-semibold opacity-75">
              Base amount
            </span>
          ) : source ? (
            <span className="truncate text-xs opacity-75">
              1 {source.code} = {formatRate(rate)} {currency.code}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
