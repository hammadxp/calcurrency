import Link from "next/link"
import { ArrowLeft, CircleHelp } from "lucide-react"
import { SettingRow } from "./setting-row"
import { SETTING_ITEMS } from "@/data/currency"
import type { Settings } from "@/types/currency"

type SettingsViewProps = {
  settings: Settings
  onToggle: (key: keyof Settings) => void
}

export function SettingsView({ settings, onToggle }: SettingsViewProps) {
  return (
    <section className="min-h-[calc(100svh-70px)] bg-background px-[17px] pt-[26px] pb-11 text-foreground md:px-[max(5vw,28px)] md:pt-[38px] md:pb-[60px]">
      <div className="mx-auto mb-6 flex max-w-[1180px] items-center justify-between text-[9px] text-slate-500 md:mb-7 md:text-[13px] dark:text-neutral-300">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md border border-stone-200 bg-stone-50 px-[13px] py-2.5 text-[13px] text-slate-900 transition-colors hover:bg-slate-900 hover:text-stone-50 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-50"
        >
          <ArrowLeft size={16} /> Converter
        </Link>
        <span>Preferences · local only</span>
      </div>
      <div className="mx-auto max-w-[1180px]">
        <h1 className="max-w-[720px] font-sans text-[clamp(31px,3.4vw,48px)] leading-[1.1] font-bold tracking-[-0.05em]">
          Settings
        </h1>
        <p className="mt-[9px] max-w-[650px] text-sm leading-[1.5] text-slate-500 md:text-base dark:text-neutral-300">
          Choose what appears in the converter and navigation. Your preferences
          stay in this browser.
        </p>
      </div>
      <div className="mx-auto mt-8 max-w-[700px] overflow-hidden rounded-[10px] border border-stone-200 bg-stone-50 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="bg-emerald-100 px-5 py-[18px] dark:bg-emerald-950">
          <h2 className="text-[21px] tracking-[-0.08em]">Preferences</h2>
        </div>
        {SETTING_ITEMS.map((item) => (
          <SettingRow
            key={item.key}
            setting={item}
            checked={settings[item.key]}
            onToggle={onToggle}
          />
        ))}
        <div className="m-[6px_20px_20px] flex gap-2 rounded-md bg-stone-100 p-[13px] text-[13px] leading-[1.4] text-slate-500 dark:bg-neutral-800 dark:text-neutral-300">
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
