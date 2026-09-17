import { Delete } from "lucide-react"
import { KEYPAD_KEYS } from "@/lib/currency-data"

type MobileKeypadProps = { onKey: (key: string) => void }

export function MobileKeypad({ onKey }: MobileKeypadProps) {
  return (
    <div className="mobile-keypad" aria-label="Amount keypad">
      {KEYPAD_KEYS.map((key) => (
        <button
          key={key}
          type="button"
          className="keypad-key"
          onClick={() => onKey(key)}
          aria-label={key === "delete" ? "Backspace" : key}
        >
          {key === "delete" ? <Delete size={21} /> : key}
        </button>
      ))}
    </div>
  )
}
