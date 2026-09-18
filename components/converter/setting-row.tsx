import type { Settings } from "@/lib/currency"

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
    <label className="setting-row">
      <span>
        <strong>{setting.title}</strong>
        <small>{setting.detail}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(setting.key)}
      />
      <span className="toggle" />
    </label>
  )
}
