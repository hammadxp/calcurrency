import Link from "next/link"
import { CircleHelp } from "lucide-react"
import { SettingRow } from "./setting-row"
import { SETTING_ITEMS } from "@/data/currency"
import { PROJECT_DETAILS } from "@/data/PROJECT_DETAILS"
import type { Settings } from "@/types/currency"

type SettingsViewProps = {
  settings: Settings
  onToggle: (key: keyof Settings) => void
}

export function SettingsView({ settings, onToggle }: SettingsViewProps) {
  return (
    <section className="flex min-h-[calc(100svh-70px)] flex-col bg-background px-[17px] pt-[26px] pb-11 text-foreground md:px-[max(5vw,28px)] md:pt-[38px] md:pb-[60px]">
      <div className="mx-auto w-full max-w-[1180px]">
        <h1 className="max-w-[720px] font-sans text-3xl leading-tight font-bold tracking-[-0.05em] md:text-5xl">
          Settings
        </h1>
        <p className="mt-[9px] max-w-[650px] text-sm leading-[1.5] text-slate-500 md:text-base dark:text-neutral-300">
          Choose what appears in the converter and navigation. Your preferences
          stay in this browser.
        </p>
      </div>
      <div className="mx-auto mt-8 w-full max-w-[1180px] overflow-hidden rounded-[10px] border border-stone-200 bg-stone-50 dark:border-neutral-700 dark:bg-neutral-900">
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
      <p className="mt-auto pt-10 text-center text-xs text-muted-foreground">
        Built with ❤️ by{" "}
        <Link
          href={PROJECT_DETAILS.authorUrl}
          className="underline decoration-muted-foreground/50 underline-offset-4 hover:decoration-current focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {PROJECT_DETAILS.author}
        </Link>
      </p>
    </section>
  )
}
