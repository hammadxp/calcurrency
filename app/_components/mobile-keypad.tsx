import { Delete } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KEYPAD_KEYS } from "@/config/constants"
import { cn } from "@/lib/utils"

type MobileKeypadProps = { onKey: (key: string) => void }

export function MobileKeypad({ onKey }: MobileKeypadProps) {
  return (
    <div
      className="grid h-64 shrink-0 grid-cols-4 grid-rows-5 gap-1.5 border-t border-border bg-surface px-3 pt-2.5 pb-[max(9px,env(safe-area-inset-bottom))] md:hidden"
      aria-label="Amount keypad"
    >
      {KEYPAD_KEYS.map((key) => (
        <Button
          key={key}
          variant={
            key === "="
              ? "default"
              : ["+", "-", "×", "÷", "%", "clear"].includes(key)
                ? "secondary"
                : "outline"
          }
          className={cn(
            "h-full rounded-lg text-lg font-semibold",
            key === "=" && "col-span-2"
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
    </div>
  )
}
