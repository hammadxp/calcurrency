"use client"

import { useCallback, useState } from "react"
import { AppHeader } from "./app-header"
import { CurrencyPicker } from "./currency-picker"
import { ConverterView } from "./converter-view"
import { DonateDialog } from "./donate-dialog"
import { RatesView } from "./rates-view"
import { SettingsView } from "./settings-view"
import { useAmountKeyboard } from "@/hooks/use-amount-keyboard"
import { useConverterPreferences } from "@/hooks/use-converter-preferences"
import { useRates } from "@/hooks/use-rates"
import type { Settings, Slot, View } from "@/types/currency"
import { normalizeAmount } from "@/utils/currency"

export function ConverterApp() {
  const [view, setView] = useState<View>("convert")
  const [picker, setPicker] = useState<Slot | null>(null)
  const [donateOpen, setDonateOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { pair, setPair, amount, setAmount, settings, setSettings } =
    useConverterPreferences()
  const { rates, currencies, status } = useRates()

  const from =
    currencies.find((currency) => currency.code === pair.from) ?? null
  const to = currencies.find((currency) => currency.code === pair.to) ?? null
  const fromRate = from ? rates[from.code] : undefined
  const toRate = to ? rates[to.code] : undefined
  const pairRate = fromRate && toRate ? toRate / fromRate : 0
  const converted =
    amount && pairRate ? Number.parseFloat(amount) * pairRate : 0

  const closePicker = useCallback(() => setPicker(null), [])
  const closeDonate = useCallback(() => setDonateOpen(false), [])

  useAmountKeyboard({
    enabled: view === "convert" && !picker && !donateOpen,
    setAmount,
  })

  function enterKey(key: string) {
    setAmount((current) =>
      key === "delete" ? current.slice(0, -1) : normalizeAmount(current + key)
    )
  }

  function changeView(next: View) {
    setView(next)
    setMobileNavOpen(false)
  }

  function selectCurrency(code: string) {
    if (picker) setPair((current) => ({ ...current, [picker]: code }))
    closePicker()
  }

  function clearCurrency() {
    if (picker) setPair((current) => ({ ...current, [picker]: null }))
    setAmount("")
    closePicker()
  }

  function toggleSetting(key: keyof Settings) {
    setSettings((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <main className="min-h-svh bg-stone-50 dark:bg-slate-950">
      <AppHeader
        view={view}
        status={status}
        mobileNavOpen={mobileNavOpen}
        onToggleNav={() => setMobileNavOpen((open) => !open)}
        onView={changeView}
        onDonate={() => {
          setDonateOpen(true)
          setMobileNavOpen(false)
        }}
      />
      {view === "convert" ? (
        <ConverterView
          from={from}
          to={to}
          amount={amount}
          converted={converted}
          pairRate={pairRate}
          settings={settings}
          onAmountChange={setAmount}
          onOpenFrom={() => setPicker("from")}
          onOpenTo={() => setPicker("to")}
          onKey={enterKey}
        />
      ) : null}
      {view === "rates" ? (
        <RatesView
          from={from}
          to={to}
          pairRate={pairRate}
          rates={rates}
          currencies={currencies}
          onBack={() => changeView("convert")}
        />
      ) : null}
      {view === "settings" ? (
        <SettingsView
          settings={settings}
          onToggle={toggleSetting}
          onBack={() => changeView("convert")}
        />
      ) : null}
      {picker ? (
        <CurrencyPicker
          slot={picker}
          selectedCode={pair[picker]}
          currencies={currencies}
          onSelect={selectCurrency}
          onClear={clearCurrency}
          onClose={closePicker}
        />
      ) : null}
      {donateOpen ? <DonateDialog onClose={closeDonate} /> : null}
    </main>
  )
}
