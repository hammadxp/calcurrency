import type { Settings } from "@/types/currency"

type SettingRowProps = {
  setting: {
    key: keyof Settings
    title: string
    detail: string
  }
  checked: boolean
  onToggle: (key: keyof Settings) => void
}

export function SettingRow({ setting, checked, onToggle }: SettingRowProps) {
  return (
    <label className="relative flex items-center justify-between gap-5 border-t border-stone-200 p-6 max-[760px]:px-4 max-[760px]:py-5 dark:border-slate-800">
      <span className="flex flex-col gap-[5px]">
        <strong className="text-base max-[760px]:text-sm">
          {setting.title}
        </strong>
        <small className="text-[13px] text-slate-500 max-[760px]:text-xs dark:text-slate-300">
          {setting.detail}
        </small>
      </span>
      <input
        className="peer sr-only"
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(setting.key)}
      />
      <span className="relative size-11 shrink-0 rounded-full border border-stone-200 bg-stone-200 transition-colors peer-checked:border-emerald-600 peer-checked:bg-emerald-600 peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-3 peer-focus-visible:outline-rose-500 after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-stone-50 after:shadow-sm after:transition-transform peer-checked:after:translate-x-[19px] dark:border-slate-600 dark:bg-slate-700 dark:after:bg-slate-50" />
    </label>
  )
}
