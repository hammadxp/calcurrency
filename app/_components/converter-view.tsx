"use client"

import { useRef, useState, type PointerEvent } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CurrencyListItem } from "./currency-list-item"
import { CalculatorToolbar } from "./calculator-toolbar"
import { MobileKeypad } from "./mobile-keypad"
import type {
  Currency,
  CurrencyColor,
  SelectedCurrency,
  Settings,
} from "@/types/currency"

type ConverterViewProps = {
  selected: SelectedCurrency[]
  currencies: Currency[]
  rates: Record<string, number>
  loading: boolean
  amount: string
  settings: Settings
  keepAmountFocus: boolean
  awaitingNext: boolean
  expression: string | null
  error: string | null
  onAmountChange: (value: string) => void
  onOpenCurrency: (index: number) => void
  onAdd: () => void
  onColor: (index: number, color: CurrencyColor) => void
  onMakeBase: (index: number) => void
  onRemove: (index: number) => void
  onReorder: (from: number, to: number) => void
  onKey: (key: string) => void
}

export function ConverterView({
  selected,
  currencies,
  rates,
  loading,
  amount,
  settings,
  keepAmountFocus,
  awaitingNext,
  expression,
  error,
  onAmountChange,
  onOpenCurrency,
  onAdd,
  onColor,
  onMakeBase,
  onRemove,
  onReorder,
  onKey,
}: ConverterViewProps) {
  const dragFrom = useRef<number | null>(null)
  const dragTo = useRef<number | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const [dropTarget, setDropTarget] = useState<number | null>(null)
  const source =
    currencies.find((currency) => currency.code === selected[0]?.code) ?? null
  const sourceRate = source ? rates[source.code] : undefined

  function startDrag(event: PointerEvent<HTMLButtonElement>, index: number) {
    if (event.pointerType === "mouse" && event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragFrom.current = index
    dragTo.current = index
    setDragging(index)
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    if (dragFrom.current === null) return
    const row = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>("[data-currency-index]")
    if (!row) return
    const index = Number(row.dataset.currencyIndex)
    if (Number.isNaN(index)) return
    dragTo.current = index
    setDropTarget(index)
  }

  function endDrag() {
    if (
      dragFrom.current !== null &&
      dragTo.current !== null &&
      dragFrom.current !== dragTo.current
    ) {
      onReorder(dragFrom.current, dragTo.current)
    }
    cancelDrag()
  }

  function cancelDrag() {
    dragFrom.current = null
    dragTo.current = null
    setDragging(null)
    setDropTarget(null)
  }

  return (
    <section
      className="flex min-h-0 flex-1 flex-col"
      aria-label="Currency converter"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5 sm:px-6 md:py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h1 className="font-sans text-2xl font-bold tracking-tight sm:text-3xl">
                Your currencies
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter an amount in the first row. Drag to change the order.
              </p>
            </div>
            <div
              className="min-h-5 text-sm font-medium"
              role="status"
              aria-live="polite"
            >
              {error ? (
                <span className="text-destructive">{error}</span>
              ) : (
                expression
              )}
            </div>
          </div>
          <ol className="flex flex-col gap-2.5">
            {selected.map((item, index) => {
              const currency =
                currencies.find((candidate) => candidate.code === item.code) ??
                null
              const rate =
                sourceRate && rates[item.code]
                  ? rates[item.code] / sourceRate
                  : 0
              const converted = amount && rate ? Number(amount) * rate : 0
              return (
                <li key={item.code} data-currency-index={index}>
                  <CurrencyListItem
                    currency={currency}
                    code={item.code}
                    color={item.color}
                    source={source}
                    isSource={index === 0}
                    amount={amount}
                    converted={converted}
                    rate={rate}
                    loading={loading}
                    settings={settings}
                    keepAmountFocus={keepAmountFocus}
                    awaitingNext={awaitingNext}
                    dragging={dragging === index}
                    dropTarget={dropTarget === index && dragging !== index}
                    canRemove={selected.length > 1}
                    canMoveUp={index > 0}
                    canMoveDown={index < selected.length - 1}
                    onChange={onAmountChange}
                    onCalculatorKey={onKey}
                    onOpen={() => onOpenCurrency(index)}
                    onColor={(color) => onColor(index, color)}
                    onMakeBase={() => onMakeBase(index)}
                    onRemove={() => onRemove(index)}
                    onMoveUp={() => onReorder(index, index - 1)}
                    onMoveDown={() => onReorder(index, index + 1)}
                    onDragStart={(event) => startDrag(event, index)}
                    onDragMove={moveDrag}
                    onDragEnd={endDrag}
                    onDragCancel={cancelDrag}
                    onHandleKeyDown={(event) => {
                      if (event.key !== "ArrowUp" && event.key !== "ArrowDown")
                        return
                      event.preventDefault()
                      onReorder(
                        index,
                        Math.max(
                          0,
                          Math.min(
                            selected.length - 1,
                            index + (event.key === "ArrowUp" ? -1 : 1)
                          )
                        )
                      )
                    }}
                  />
                </li>
              )
            })}
          </ol>
          <Button
            variant="outline"
            size="lg"
            className="self-start"
            onClick={onAdd}
          >
            <Plus data-icon="inline-start" /> Add currency
          </Button>
        </div>
      </div>

      <CalculatorToolbar onKey={onKey} />
      <MobileKeypad onKey={onKey} />
    </section>
  )
}
