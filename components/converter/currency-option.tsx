import { Check } from "lucide-react"
import { FlagIcon } from "@/components/converter/flag-icon"
import type { Currency } from "@/lib/currency"

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
      className={`currency-option ${selected ? "selected" : ""}`}
      onClick={() => onSelect(currency.code)}
      aria-pressed={selected}
    >
      <FlagIcon currency={currency} size="small" />
      <span className="option-name">
        <strong>{currency.code}</strong>
        <small>{currency.name}</small>
      </span>
      {selected ? <Check size={17} /> : null}
    </button>
  )
}
