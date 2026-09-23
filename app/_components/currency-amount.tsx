import {
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react"
import type { Currency, Settings } from "@/types/currency"
import { cn } from "@/lib/utils"
import {
  amountSeparators,
  formatAmount,
  formatEditableAmount,
  normalizeAmount,
  parseEditableAmount,
} from "@/utils/currency"

const subscribeToLocale = () => () => undefined
const getLocale = () => navigator.language || "en-US"
const getServerLocale = () => "en-US"

type CurrencyAmountProps = {
  currency: Currency
  role: "source" | "target"
  amount?: string
  converted?: number
  settings: Settings
  keepAmountFocus?: boolean
  onChange?: (value: string) => void
}

export function CurrencyAmount({
  currency,
  role,
  amount,
  converted,
  settings,
  keepAmountFocus = false,
  onChange,
}: CurrencyAmountProps) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocale,
    getServerLocale
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const keepFocusRef = useRef(keepAmountFocus)
  const caretRef = useRef<number | null>(null)
  const displayAmount = formatEditableAmount(amount ?? "", locale)

  useLayoutEffect(() => {
    keepFocusRef.current = keepAmountFocus
  }, [keepAmountFocus])

  useEffect(() => {
    if (role === "source" && keepAmountFocus)
      inputRef.current?.focus({ preventScroll: true })
  }, [role, keepAmountFocus])

  useLayoutEffect(() => {
    const input = inputRef.current
    const position = caretRef.current
    if (!input || position === null || document.activeElement !== input) return

    let cursor = 0
    while (
      cursor < input.value.length &&
      parseEditableAmount(input.value.slice(0, cursor), locale).length <
        position
    ) {
      cursor++
    }
    input.setSelectionRange(cursor, cursor)
    caretRef.current = null
  }, [displayAmount, locale])

  function changeAmount(value: string, cursor: number) {
    caretRef.current = parseEditableAmount(
      value.slice(0, cursor),
      locale
    ).length
    onChange?.(parseEditableAmount(value, locale))
  }

  function onAmountKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const { group, decimal } = amountSeparators(locale)
    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? start

    if (event.key === "." && decimal !== ".") {
      event.preventDefault()
      changeAmount(
        `${input.value.slice(0, start)}${decimal}${input.value.slice(end)}`,
        start + decimal.length
      )
      return
    }

    const groupBefore =
      event.key === "Backspace" &&
      start === end &&
      input.value.slice(0, start).endsWith(group)
    const groupAfter =
      event.key === "Delete" &&
      start === end &&
      input.value.slice(start).startsWith(group)
    if (!groupBefore && !groupAfter) return

    event.preventDefault()
    const raw = normalizeAmount(amount ?? "")
    const index = parseEditableAmount(
      input.value.slice(0, start),
      locale
    ).length
    const removeAt = groupBefore ? index - 1 : index
    if (removeAt < 0 || removeAt >= raw.length) return
    caretRef.current = removeAt
    onChange?.(raw.slice(0, removeAt) + raw.slice(removeAt + 1))
  }

  return (
    <div className="flex w-full min-w-0 items-center justify-end gap-2 overflow-visible">
      <span
        className={cn(
          "shrink-0 text-[15px] leading-none font-[var(--font-amount),monospace] sm:text-[clamp(15px,4.5vw,31px)] md:text-[clamp(26px,4.2vw,66px)]",
          role === "target" && "text-slate-500 dark:text-slate-400"
        )}
      >
        {currency.symbol}
      </span>

      {role === "source" ? (
        <span className="flex min-w-0 items-center">
          <input
            className="peer bg-blue-400 pr-1 text-right text-[29px] leading-none tracking-tighter text-accent-foreground caret-transparent outline-none placeholder:text-accent-foreground/70 focus-visible:outline-none sm:text-[clamp(29px,9vw,62px)] md:text-[clamp(52px,8.4vw,132px)]"
            ref={inputRef}
            style={{
              width: `${Math.max(displayAmount.length, 1)}ch`,
            }}
            inputMode="decimal"
            value={displayAmount}
            onChange={(event) =>
              changeAmount(
                event.target.value,
                event.target.selectionStart ?? event.target.value.length
              )
            }
            onKeyDown={onAmountKeyDown}
            onBlur={() => {
              window.setTimeout(() => {
                if (keepFocusRef.current && document.hasFocus())
                  inputRef.current?.focus({ preventScroll: true })
              }, 0)
            }}
            placeholder="0"
            aria-label={`Amount in ${currency.code}`}
          />
          <span
            className="amount-caret h-[clamp(23px,7vw,48px)] w-1.5 shrink-0 rounded-full bg-rose-500 opacity-0 peer-focus:opacity-100 md:h-[clamp(32px,6.4vw,96px)]"
            aria-hidden="true"
          />
        </span>
      ) : (
        <output
          className="mr-3 text-center text-[29px] leading-none tracking-tighter sm:text-[clamp(29px,9vw,62px)] md:text-[clamp(52px,8.4vw,132px)]"
          aria-label={`Converted amount in ${currency.code}`}
        >
          {amount && converted !== undefined && Number.isFinite(converted)
            ? formatAmount(
                converted,
                currency.code,
                settings,
                undefined,
                locale
              )
            : "0"}
        </output>
      )}
    </div>
  )
}
