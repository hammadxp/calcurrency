import { ArrowLeft, CircleHelp } from "lucide-react"
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
    <section className="min-h-[calc(100svh-70px)] bg-stone-50 px-[max(5vw,28px)] pt-[38px] pb-[60px] text-slate-900 max-[760px]:px-[17px] max-[760px]:pt-[26px] max-[760px]:pb-11 dark:bg-slate-950 dark:text-stone-50">
      <div className="mx-auto mb-7 flex max-w-[1180px] items-center justify-between text-[13px] text-slate-500 max-[760px]:mb-6 max-[760px]:text-[9px] dark:text-slate-300">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-stone-200 bg-stone-50 px-[13px] py-2.5 text-[13px] text-slate-900 transition-colors hover:bg-slate-900 hover:text-stone-50 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-50"
          onClick={onBack}
        >
          <ArrowLeft size={16} /> Converter
        </button>
        <span>Preferences · local only</span>
      </div>
      <div className="mx-auto max-w-[1180px]">
        <h1 className="max-w-[720px] font-sans text-[clamp(31px,3.4vw,48px)] leading-[1.1] font-bold tracking-[-0.05em]">
          Settings
        </h1>
        <p className="mt-[9px] max-w-[650px] text-base leading-[1.5] text-slate-500 max-[760px]:text-sm dark:text-slate-300">
          Choose how amounts appear. Your preferences stay in this browser.
        </p>
      </div>
      <div className="mx-auto mt-8 max-w-[700px] overflow-hidden rounded-[10px] border border-stone-200 bg-stone-50 dark:border-slate-700 dark:bg-slate-900">
        <div className="bg-emerald-100 px-5 py-[18px] dark:bg-emerald-950">
          <h2 className="text-[21px] tracking-[-0.08em]">Display & memory</h2>
        </div>
        {SETTING_ITEMS.map((item) => (
          <SettingRow
            key={item.key}
            setting={item}
            checked={settings[item.key]}
            onToggle={onToggle}
          />
        ))}
        <div className="m-[6px_20px_20px] flex gap-2 rounded-md bg-stone-100 p-[13px] text-[13px] leading-[1.4] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
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
