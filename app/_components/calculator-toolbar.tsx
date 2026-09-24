import { Delete } from "lucide-react"
import { Button } from "@/components/ui/button"

type CalculatorToolbarProps = { onKey: (key: string) => void }

const TOOLS = ["clear", "delete", "%", "÷", "×", "-", "+", "="] as const

export function CalculatorToolbar({ onKey }: CalculatorToolbarProps) {
  return (
    <div
      className="hidden shrink-0 items-center justify-center gap-2 border-t border-border bg-surface p-3 md:flex"
      aria-label="Calculator controls"
    >
      {TOOLS.map((key) => (
        <Button
          key={key}
          variant={key === "=" ? "default" : "secondary"}
          size="lg"
          className="min-w-14 text-base"
          onClick={() => onKey(key)}
          aria-label={
            key === "clear" ? "Clear" : key === "delete" ? "Backspace" : key
          }
        >
          {key === "clear" ? "C" : key === "delete" ? <Delete /> : key}
        </Button>
      ))}
    </div>
  )
}
