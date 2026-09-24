import { Delete } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KEYPAD_KEYS } from "@/config/constants"
import { cn } from "@/lib/utils"

type MobileKeypadProps = {
  open: boolean
  onKey: (key: string) => void
  onHide: () => void
}

export function MobileKeypad({ open, onKey, onHide }: MobileKeypadProps) {
  function pressKey(key: string) {
    navigator.vibrate?.(8)
    onKey(key)
  }

  function hideKeypad() {
    navigator.vibrate?.(8)
    onHide()
  }

  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden transition-[max-height,opacity] duration-200 ease-out motion-reduce:transition-none md:hidden",
        open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
      )}
      aria-hidden={!open}
      inert={!open}
    >
      <div
        className={cn(
          "grid h-80 grid-cols-4 grid-rows-5 gap-1.5 border-t border-border bg-surface px-3 pt-2.5 pb-[max(9px,env(safe-area-inset-bottom))] transition-transform duration-200 ease-out motion-reduce:transition-none",
          open ? "translate-y-0" : "translate-y-3"
        )}
        role="group"
        aria-label="Amount keypad"
        onPointerDown={(event) => event.preventDefault()}
      >
        {KEYPAD_KEYS.map((key) => (
          <Button
            key={key}
            variant="outline"
            className={cn(
              "h-full rounded-lg text-lg font-semibold",
              (/^\d$/.test(key) || key === ".") &&
                "bg-currency-paper hover:bg-currency-paper/80 dark:bg-currency-paper dark:hover:bg-currency-paper/80"
            )}
            onClick={() => (key === "hide" ? hideKeypad() : pressKey(key))}
            aria-label={
              key === "delete"
                ? "Backspace"
                : key === "clear"
                  ? "Clear"
                  : key === "hide"
                    ? "Hide keypad"
                    : key
            }
          >
            {key === "delete" ? (
              <Delete size={21} />
            ) : key === "clear" ? (
              "AC"
            ) : key === "hide" ? (
              "Hide"
            ) : (
              key
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
