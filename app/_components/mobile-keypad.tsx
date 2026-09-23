import { Delete } from "lucide-react"
import { KEYPAD_KEYS } from "@/config/constants"

type MobileKeypadProps = { onKey: (key: string) => void }

export function MobileKeypad({ onKey }: MobileKeypadProps) {
  return (
    <div
      className="grid h-[clamp(184px,33svh,256px)] grid-cols-3 grid-rows-4 gap-1.5 border-t border-stone-200 bg-stone-100 px-[13px] pt-2.5 pb-[max(9px,env(safe-area-inset-bottom))] md:hidden dark:border-neutral-700 dark:bg-neutral-900"
      aria-label="Amount keypad"
    >
      {KEYPAD_KEYS.map((key) => (
        <button
          key={key}
          type="button"
          className="grid min-h-0 place-items-center rounded-lg border border-stone-200 bg-stone-50 text-[clamp(19px,5vw,25px)] leading-none font-[var(--font-amount),monospace] font-semibold text-slate-900 shadow-sm focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 active:bg-emerald-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-50"
          onClick={() => onKey(key)}
          aria-label={key === "delete" ? "Backspace" : key}
        >
          {key === "delete" ? <Delete size={21} /> : key}
        </button>
      ))}
    </div>
  )
}
