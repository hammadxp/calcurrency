"use client"

import { useCallback, useEffect, useState } from "react"
import { AppHeader } from "@/components/converter/app-header"
import { CurrencyPanel } from "@/components/converter/currency-panel"
import { CurrencyPicker } from "@/components/converter/currency-picker"
import { DonateDialog } from "@/components/converter/donate-dialog"
import { MobileKeypad } from "@/components/converter/mobile-keypad"
import { RatesView } from "@/components/converter/rates-view"
import { SettingsView } from "@/components/converter/settings-view"
import { useConverterPreferences } from "@/hooks/use-converter-preferences"
import { useRates } from "@/hooks/use-rates"
import {
  normalizeAmount,
  type Settings,
  type Slot,
  type View,
} from "@/lib/currency"

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

  useEffect(() => {
    if (view !== "convert" || picker || donateOpen) return
    function typeIntoAmount(event: KeyboardEvent) {
      const target = event.target
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        (target instanceof HTMLElement &&
          (target.isContentEditable ||
            ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)))
      )
        return
      if (/^\d$/.test(event.key) || event.key === ".") {
        setAmount((current) => normalizeAmount(current + event.key))
      } else if (event.key === "Backspace") {
        setAmount((current) => current.slice(0, -1))
      } else if (event.key === "Escape") {
        setAmount("")
      } else return
      event.preventDefault()
    }
    window.addEventListener("keydown", typeIntoAmount)
    return () => window.removeEventListener("keydown", typeIntoAmount)
  }, [view, picker, donateOpen, setAmount])

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
    <main className="app-shell">
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
        <section className="converter-view" aria-label="Currency converter">
          <div className="currency-stack">
            <CurrencyPanel
              currency={from}
              role="source"
              amount={amount}
              settings={settings}
              onOpen={() => setPicker("from")}
              onChange={setAmount}
            />
            <CurrencyPanel
              currency={to}
              role="target"
              converted={converted}
              from={from}
              pairRate={pairRate}
              settings={settings}
              onOpen={() => setPicker("to")}
            />
          </div>
          <MobileKeypad onKey={enterKey} />
        </section>
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
