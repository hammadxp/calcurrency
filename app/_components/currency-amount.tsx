import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react"
import type { Currency, Settings } from "@/types/currency"
import { cn } from "@/lib/utils"
import {
  amountSeparators,
  deleteEditableAmount,
  formatAmount,
  formatEditableAmount,
  parseEditableAmount,
} from "@/utils/currency"

const AMOUNT_TEXT_SIZE =
  "text-[29px] sm:text-[clamp(29px,9vw,62px)] md:text-[clamp(52px,8.4vw,132px)]"

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
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const caretRef = useRef<number | null>(null)
  const [fontSize, setFontSize] = useState<number>()
  const displayAmount = formatEditableAmount(amount ?? "", locale)
  const outputAmount =
    amount && converted !== undefined && Number.isFinite(converted)
      ? formatAmount(converted, currency.code, settings, undefined, locale)
      : "0"
  const visibleAmount = role === "source" ? displayAmount || "0" : outputAmount

  useLayoutEffect(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure) return

    function fitAmount() {
      if (!container || !measure) return
      const maximum = Number.parseFloat(
        window.getComputedStyle(measure).fontSize
      )
      const available = Math.max(container.clientWidth - 2, 1)
      const width = measure.getBoundingClientRect().width
      setFontSize(Math.min(maximum, (maximum * available) / Math.max(width, 1)))
    }

    const observer = new ResizeObserver(fitAmount)
    observer.observe(container)
    fitAmount()
    void document.fonts.ready.then(fitAmount)
    return () => observer.disconnect()
  }, [visibleAmount, currency.symbol, role])

  useEffect(() => {
    if (role === "source" && keepAmountFocus)
      inputRef.current?.focus({ preventScroll: true })
  }, [role, keepAmountFocus, amount])

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
    const { decimal } = amountSeparators(locale)
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

    if (event.key !== "Backspace" && event.key !== "Delete") return

    event.preventDefault()
    const next = deleteEditableAmount(
      input.value,
      start,
      end,
      locale,
      event.key
    )
    if (next.value === amount) return

    caretRef.current = next.cursor
    onChange?.(next.value)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full min-w-0 overflow-hidden"
      style={{ fontFamily: "var(--font-amount), monospace" }}
    >
      <div
        className={cn(
          "flex w-full min-w-0 items-baseline justify-end leading-none",
          AMOUNT_TEXT_SIZE
        )}
        style={{ fontSize, columnGap: "0.05em" }}
      >
        <span
          className={cn(
            "shrink-0 leading-none",
            role === "target" && "text-muted-foreground"
          )}
          style={{ fontSize: "0.5em" }}
        >
          {currency.symbol}
        </span>

        {role === "source" ? (
          <span className="flex max-w-full min-w-0 items-baseline">
            <input
              className="peer block max-w-full min-w-0 border-0 p-0 text-right leading-none tracking-tighter text-accent-foreground caret-transparent outline-none placeholder:text-accent-foreground/70 focus-visible:outline-none"
              ref={inputRef}
              style={{ width: `${Math.max(displayAmount.length, 1)}ch` }}
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
                requestAnimationFrame(() => {
                  if (
                    keepAmountFocus &&
                    document.activeElement === document.body
                  )
                    inputRef.current?.focus({ preventScroll: true })
                })
              }}
              placeholder="0"
              aria-label={`Amount in ${currency.code}`}
            />
            <span
              className="amount-caret shrink-0 self-center rounded-full bg-rose-500 opacity-0 peer-focus:opacity-100"
              style={{ marginLeft: "0.07em", width: "0.05em" }}
              aria-hidden="true"
            />
          </span>
        ) : (
          <output
            className="min-w-0 overflow-hidden text-right tracking-tighter whitespace-nowrap"
            style={{ paddingRight: "0.12em" }}
            aria-label={`Converted amount in ${currency.code}`}
          >
            {outputAmount}
          </output>
        )}
      </div>

      <span
        ref={measureRef}
        className={cn(
          "pointer-events-none invisible absolute top-0 left-0 inline-flex w-max items-baseline leading-none whitespace-nowrap",
          AMOUNT_TEXT_SIZE
        )}
        style={{ columnGap: "0.05em" }}
        aria-hidden="true"
      >
        <span style={{ fontSize: "0.5em" }}>{currency.symbol}</span>
        <span
          className="tracking-tighter"
          style={
            role === "source"
              ? { width: `${Math.max(displayAmount.length, 1)}ch` }
              : { paddingRight: "0.12em" }
          }
        >
          {visibleAmount}
        </span>
        {role === "source" ? (
          <span style={{ marginLeft: "0.07em", width: "0.05em" }} />
        ) : null}
      </span>
    </div>
  )
}
