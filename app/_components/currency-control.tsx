import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { FlagIcon } from "./flag-icon"
import type { Currency } from "@/types/currency"
import { formatRate } from "@/utils/currency"

type CurrencyControlProps = {
  currency: Currency | null
  role: "source" | "target"
  from?: Currency | null
  pairRate?: number
  onOpen: () => void
}

export function CurrencyControl({
  currency,
  role,
  from,
  pairRate,
  onOpen,
}: CurrencyControlProps) {
  return (
    <div
      className={cn("currency-control", !currency && "currency-control-empty")}
    >
      <button
        type="button"
        className="currency-trigger"
        onClick={onOpen}
        aria-label={`Choose ${role} currency`}
      >
        <span className="currency-code">
          {currency?.code ?? "Select currency"}
        </span>
        <ChevronDown size={17} />
      </button>

      {currency ? (
        <div className="currency-identity">
          <FlagIcon currency={currency} />
          <span>{currency.name}</span>
        </div>
      ) : null}

      {role === "target" && currency && from ? (
        <div className="rate-summary-inline">
          <span>
            1 {from.code} equals{" "}
            <strong>
              {formatRate(pairRate ?? 0)} {currency.code}
            </strong>
          </span>
        </div>
      ) : null}
    </div>
  )
}
