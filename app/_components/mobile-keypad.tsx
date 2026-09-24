import { Delete } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KEYPAD_KEYS } from "@/config/constants"
import { cn } from "@/lib/utils"

type MobileKeypadProps = {
  onKey: (key: string) => void
  onHide: () => void
}

export function MobileKeypad({ onKey, onHide }: MobileKeypadProps) {
  return (
    <div
      className="grid h-64 shrink-0 grid-cols-4 grid-rows-5 gap-1.5 border-t border-border bg-surface px-3 pt-2.5 pb-[max(9px,env(safe-area-inset-bottom))] md:hidden"
      aria-label="Amount keypad"
      onPointerDown={(event) => event.preventDefault()}
    >
      {KEYPAD_KEYS.map((key) => (
        <Button
          key={key}
          variant="outline"
          className={cn(
            "h-full rounded-lg text-lg font-semibold",
            ["+", "-", "×", "÷", "%", "clear", "delete", "="].includes(key) &&
              "bg-primary/10 hover:bg-primary/15 dark:bg-primary/10"
          )}
          onClick={() => onKey(key)}
          aria-label={
            key === "delete" ? "Backspace" : key === "clear" ? "Clear" : key
          }
        >
          {key === "delete" ? (
            <Delete size={21} />
          ) : key === "clear" ? (
            "C"
          ) : (
            key
          )}
        </Button>
      ))}
      <Button
        variant="outline"
        className="h-full rounded-lg text-sm font-semibold"
        onClick={onHide}
        aria-label="Hide keypad"
      >
        Hide
      </Button>
    </div>
  )
}
