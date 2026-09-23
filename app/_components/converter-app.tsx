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

type ConverterAppProps = {
  view: View
}

export function ConverterApp({ view }: ConverterAppProps) {
  const [picker, setPicker] = useState<Slot | "rates" | null>(null)
  const [ratesBaseCode, setRatesBaseCode] = useState("USD")
  const [donateOpen, setDonateOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { pair, setPair, amount, setAmount, settings, setSettings } =
    useConverterPreferences()
  const { rates, currencies, loading, refreshing, refreshRates, status } =
    useRates()

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

  function selectCurrency(code: string) {
    if (picker === "rates") {
      setRatesBaseCode(code)
    } else if (picker) {
      setPair((current) => ({ ...current, [picker]: code }))
    }

    closePicker()
  }

  function clearCurrency() {
    if (picker && picker !== "rates") {
      setPair((current) => ({ ...current, [picker]: null }))
    }

    setAmount("")
    closePicker()
  }

  function toggleSetting(key: keyof Settings) {
    setSettings((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <main className="min-h-svh bg-background">
      <AppHeader
        view={view}
        showDonate={settings.showDonate}
        status={status}
        refreshing={refreshing}
        onRefresh={refreshRates}
        mobileNavOpen={mobileNavOpen}
        onToggleNav={() => setMobileNavOpen((open) => !open)}
        onNavigate={() => setMobileNavOpen(false)}
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
          loading={loading}
          settings={settings}
          keepAmountFocus={!picker && !donateOpen}
          onAmountChange={setAmount}
          onOpenFrom={() => setPicker("from")}
          onOpenTo={() => setPicker("to")}
          onKey={enterKey}
        />
      ) : null}
      {view === "rates" ? (
        <RatesView
          base={
            currencies.find((currency) => currency.code === ratesBaseCode) ??
            currencies[0] ??
            null
          }
          rates={rates}
          currencies={currencies}
          onOpenBase={() => setPicker("rates")}
        />
      ) : null}
      {view === "settings" ? (
        <SettingsView settings={settings} onToggle={toggleSetting} />
      ) : null}
      {picker ? (
        <CurrencyPicker
          slot={picker}
          selectedCode={picker === "rates" ? ratesBaseCode : pair[picker]}
          currencies={currencies}
          onSelect={selectCurrency}
          onClear={picker === "rates" ? undefined : clearCurrency}
          onClose={closePicker}
        />
      ) : null}
      {donateOpen ? <DonateDialog onClose={closeDonate} /> : null}
    </main>
  )
}
