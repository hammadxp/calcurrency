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

const AMOUNT_TEXT_SIZE = "text-3xl sm:text-4xl lg:text-5xl"

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
  onCalculatorKey?: (key: string) => void
  awaitingNext?: boolean
}

export function CurrencyAmount({
  currency,
  role,
  amount,
  converted,
  settings,
  keepAmountFocus = false,
  onChange,
  onCalculatorKey,
  awaitingNext = false,
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
    if (
      role === "source" &&
      keepAmountFocus &&
      window.matchMedia("(pointer: fine)").matches
    )
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
    const calculatorKey =
      event.key === "Enter"
        ? "="
        : event.key === "Escape"
          ? "clear"
          : event.key === "*" || event.key.toLowerCase() === "x"
            ? "×"
            : event.key === "/"
              ? "÷"
              : event.key
    if (
      ["+", "-", "×", "÷", "=", "%", "clear"].includes(calculatorKey) ||
      (awaitingNext && /^\d$/.test(calculatorKey)) ||
      (awaitingNext && [".", "Backspace", "Delete"].includes(calculatorKey))
    ) {
      event.preventDefault()
      onCalculatorKey?.(
        ["Backspace", "Delete"].includes(calculatorKey)
          ? "delete"
          : calculatorKey
      )
      return
    }

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
      className="relative w-full min-w-0 text-foreground/80"
      style={{ fontFamily: "var(--font-sans), sans-serif" }}
    >
      <div className="flex w-full min-w-0 justify-end">
        <div
          className={cn(
            "inline-flex w-max max-w-full min-w-0 items-baseline gap-1 leading-none whitespace-nowrap",
            AMOUNT_TEXT_SIZE
          )}
          style={{ fontSize }}
        >
          <span className="shrink-0 text-foreground/50" aria-hidden="true">
            {currency.symbol}
          </span>

          {role === "source" ? (
            <span className="relative inline-block shrink-0 tracking-tighter">
              <span className="invisible" aria-hidden="true">
                {visibleAmount}
              </span>
              <input
                className="absolute inset-0 block size-full min-w-0 border-0 bg-transparent p-0 text-right leading-none tracking-tighter text-inherit caret-rose-500 outline-none placeholder:text-current focus-visible:outline-none"
                ref={inputRef}
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
                      window.matchMedia("(pointer: fine)").matches &&
                      document.activeElement === document.body
                    )
                      inputRef.current?.focus({ preventScroll: true })
                  })
                }}
                placeholder="0"
                aria-label={`Amount in ${currency.code}`}
              />
            </span>
          ) : (
            <output
              className="min-w-0 overflow-hidden text-right tracking-tighter"
              aria-label={`Converted amount in ${currency.code}`}
            >
              {outputAmount}
            </output>
          )}
        </div>
      </div>

      <span
        ref={measureRef}
        className={cn(
          "pointer-events-none invisible absolute top-0 left-0 inline-flex w-max items-baseline gap-1 leading-none whitespace-nowrap",
          AMOUNT_TEXT_SIZE
        )}
        aria-hidden="true"
      >
        <span>{currency.symbol}</span>
        <span className="tracking-tighter">{visibleAmount}</span>
      </span>
    </div>
  )
}
