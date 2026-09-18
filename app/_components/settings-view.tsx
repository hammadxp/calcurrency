import { ArrowLeft, CircleHelp, Settings as SettingsIcon } from "lucide-react"
import { SettingRow } from "./setting-row"
import { SETTING_ITEMS } from "@/data/currency"
import type { Settings } from "@/types/currency"

type SettingsViewProps = {
  settings: Settings
  onToggle: (key: keyof Settings) => void
  onBack: () => void
}

export function SettingsView({
  settings,
  onToggle,
  onBack,
}: SettingsViewProps) {
  return (
    <section className="detail-view settings-view">
      <div className="detail-topline">
        <button type="button" className="back-button" onClick={onBack}>
          <ArrowLeft size={16} /> Converter
        </button>
        <span>Preferences · local only</span>
      </div>
      <div className="detail-heading">
        <h1>Settings</h1>
        <p className="detail-intro">
          Choose how amounts appear. Your preferences stay in this browser.
        </p>
      </div>
      <div className="settings-card">
        <div className="settings-card-head">
          <div>
            <span className="settings-icon">
              <SettingsIcon size={18} />
            </span>
            <h2>Display & memory</h2>
          </div>
          <span className="settings-count">03 options</span>
        </div>
        {SETTING_ITEMS.map((item) => (
          <SettingRow
            key={item.key}
            setting={item}
            checked={settings[item.key]}
            onToggle={onToggle}
          />
        ))}
        <div className="settings-note">
          <CircleHelp size={15} />
          <span>
            Rates come from Frankfurter’s reference sources. Amounts are never
            sent with the request.
          </span>
        </div>
      </div>
    </section>
  )
}
