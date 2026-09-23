import { Switch } from "@/components/ui/switch"
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
    <div className="relative flex items-center justify-between gap-5 border-t border-stone-200 px-4 py-5 md:p-6 dark:border-slate-800">
      <span className="flex flex-col gap-[5px]">
        <strong className="text-sm md:text-base">{setting.title}</strong>
        <small className="text-xs text-slate-500 md:text-[13px] dark:text-slate-300">
          {setting.detail}
        </small>
      </span>
      <Switch
        aria-label={setting.title}
        checked={checked}
        onCheckedChange={() => onToggle(setting.key)}
      />
    </div>
  )
}
