import { Menu } from "@base-ui/react/menu"
import { Check, GripVertical, MoreHorizontal } from "lucide-react"
import type { KeyboardEvent, PointerEvent } from "react"
import { Button } from "@/components/ui/button"
import { CURRENCY_COLORS } from "@/config/constants"
import { cn } from "@/lib/utils"
import type { Currency, CurrencyColor, Settings } from "@/types/currency"
import { CurrencyAmount } from "./currency-amount"
import { CurrencyControl } from "./currency-control"

type CurrencyListItemProps = {
  currency: Currency | null
  code: string
  color: CurrencyColor
  source: Currency | null
  isSource: boolean
  amount: string
  converted: number
  rate: number
  loading: boolean
  settings: Settings
  keepAmountFocus: boolean
  awaitingNext: boolean
  dragging: boolean
  dropTarget: boolean
  canRemove: boolean
  canMoveUp: boolean
  canMoveDown: boolean
  onChange: (value: string) => void
  onCalculatorKey: (key: string) => void
  onOpen: () => void
  onColor: (color: CurrencyColor) => void
  onMakeBase: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDragStart: (event: PointerEvent<HTMLButtonElement>) => void
  onDragMove: (event: PointerEvent<HTMLButtonElement>) => void
  onDragEnd: (event: PointerEvent<HTMLButtonElement>) => void
  onDragCancel: () => void
  onHandleKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void
}

const COLOR_CLASSES = Object.fromEntries(
  CURRENCY_COLORS.map((color) => [color.value, color.className])
) as Record<CurrencyColor, string>

export function CurrencyListItem(props: CurrencyListItemProps) {
  const {
    currency,
    code,
    color,
    source,
    isSource,
    amount,
    converted,
    rate,
    loading,
    settings,
    keepAmountFocus,
    awaitingNext,
    dragging,
    dropTarget,
    canRemove,
    canMoveUp,
    canMoveDown,
    onChange,
    onCalculatorKey,
    onOpen,
    onColor,
    onMakeBase,
    onRemove,
    onMoveUp,
    onMoveDown,
    onDragStart,
    onDragMove,
    onDragEnd,
    onDragCancel,
    onHandleKeyDown,
  } = props

  return (
    <article
      className={cn(
        "flex min-h-36 min-w-0 flex-wrap items-center gap-2 rounded-xl border border-border/60 px-2 py-4 text-foreground shadow-sm sm:min-h-26 sm:flex-nowrap sm:gap-3 sm:px-4",
        COLOR_CLASSES[color],
        dragging && "opacity-55",
        dropTarget && "ring-2 ring-primary"
      )}
      aria-label={`${code} currency`}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        className="order-1 cursor-grab touch-none active:cursor-grabbing"
        aria-label={`Drag to reorder ${code}. Use arrow keys to move it up or down.`}
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragCancel}
        onKeyDown={onHandleKeyDown}
      >
        <GripVertical />
      </Button>

      {currency ? (
        <>
          <CurrencyControl
            currency={currency}
            source={source}
            isSource={isSource}
            rate={rate}
            onOpen={onOpen}
          />
          <div className="order-4 w-full min-w-0 sm:order-3 sm:w-auto sm:flex-1 sm:basis-1/2">
            <CurrencyAmount
              currency={currency}
              role={isSource ? "source" : "target"}
              amount={amount}
              converted={converted}
              settings={settings}
              keepAmountFocus={keepAmountFocus && isSource}
              onChange={onChange}
              onCalculatorKey={onCalculatorKey}
              awaitingNext={awaitingNext}
            />
          </div>
        </>
      ) : (
        <div
          className="order-2 flex min-w-0 flex-1 items-center justify-between gap-4"
          role="status"
          aria-label={
            loading ? `Loading ${code}` : `Rates unavailable for ${code}`
          }
        >
          {loading ? (
            <span
              className="h-7 w-12 animate-pulse rounded-md bg-foreground/10"
              aria-hidden="true"
            />
          ) : (
            <span className="font-bold">{code}</span>
          )}
          {loading ? (
            <span className="h-9 w-28 animate-pulse rounded-md bg-foreground/10" />
          ) : (
            <span className="text-xs">
              Rates unavailable. Refresh from the menu.
            </span>
          )}
        </div>
      )}

      <Menu.Root modal={false}>
        <Menu.Trigger
          render={
            <Button
              variant="secondary"
              size="icon-sm"
              className="order-3 sm:order-4"
              aria-label={`Options for ${code}`}
            />
          }
        >
          <MoreHorizontal />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner
            sideOffset={6}
            align="end"
            className="z-30 outline-none"
          >
            <Menu.Popup className="max-h-[var(--available-height)] w-52 overflow-y-auto overscroll-contain rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-lg outline-none">
              <Menu.Group>
                <Menu.GroupLabel className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  Reorder
                </Menu.GroupLabel>
                <Menu.Item
                  disabled={!canMoveUp}
                  className="cursor-pointer rounded-md px-3 py-2 text-sm outline-none data-highlighted:bg-muted data-disabled:opacity-40"
                  onClick={onMoveUp}
                >
                  Move up
                </Menu.Item>
                <Menu.Item
                  disabled={!canMoveDown}
                  className="cursor-pointer rounded-md px-3 py-2 text-sm outline-none data-highlighted:bg-muted data-disabled:opacity-40"
                  onClick={onMoveDown}
                >
                  Move down
                </Menu.Item>
                {!isSource ? (
                  <Menu.Item
                    className="cursor-pointer rounded-md px-3 py-2 text-sm outline-none data-highlighted:bg-muted"
                    onClick={onMakeBase}
                  >
                    Use as base
                  </Menu.Item>
                ) : null}
              </Menu.Group>
              <Menu.Separator className="my-1 h-px bg-border" />
              <Menu.Group>
                <Menu.GroupLabel className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  Row color
                </Menu.GroupLabel>
                {CURRENCY_COLORS.map((option) => (
                  <Menu.Item
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none data-highlighted:bg-muted"
                    onClick={() => onColor(option.value)}
                  >
                    <span
                      className={cn(
                        "size-4 rounded-full border border-foreground/15",
                        option.className
                      )}
                      aria-hidden="true"
                    />
                    {option.label}
                    {color === option.value ? (
                      <Check className="ml-auto size-4" />
                    ) : null}
                  </Menu.Item>
                ))}
              </Menu.Group>
              <Menu.Separator className="my-1 h-px bg-border" />
              <Menu.Group>
                <Menu.Item
                  disabled={!canRemove}
                  className="cursor-pointer rounded-md px-3 py-2 text-sm text-destructive outline-none data-highlighted:bg-muted data-disabled:opacity-40"
                  onClick={onRemove}
                >
                  Remove currency
                </Menu.Item>
              </Menu.Group>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </article>
  )
}
