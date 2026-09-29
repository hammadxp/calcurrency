"use client"

import { useCallback, useState } from "react"
import posthog from "posthog-js"
import { AppHeader } from "./app-header"
import { CURRENCY_COLORS } from "@/config/constants"
import { cn } from "@/lib/utils"
import { CurrencyPicker } from "./currency-picker"
import { ConverterView } from "./converter-view"
import { DonateDialog } from "./donate-dialog"
import { RatesView } from "./rates-view"
import { SettingsView } from "./settings-view"
import { useAmountKeyboard } from "@/hooks/use-amount-keyboard"
import { useCalculator } from "@/hooks/use-calculator"
import { useConverterPreferences } from "@/hooks/use-converter-preferences"
import { useRates } from "@/hooks/use-rates"
import type { CurrencyColor, Settings, View } from "@/types/currency"
import { moveSelectedCurrency } from "@/utils/selected-currencies"

type ConverterAppProps = {
  view: View
}

export function ConverterApp({ view }: ConverterAppProps) {
  const [picker, setPicker] = useState<
    | { kind: "add" }
    | { kind: "rates" }
    | { kind: "replace"; index: number }
    | null
  >(null)
  const [ratesBaseCode, setRatesBaseCode] = useState("USD")
  const [donateOpen, setDonateOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { selected, setSelected, amount, setAmount, settings, setSettings } =
    useConverterPreferences()
  const { rates, currencies, loading, refreshing, refreshRates, status } =
    useRates()
  const { memory, pressKey, changeAmount } = useCalculator(amount, setAmount)

  const closePicker = useCallback(() => setPicker(null), [])
  const closeDonate = useCallback(() => setDonateOpen(false), [])

  useAmountKeyboard({
    enabled: view === "convert" && !picker && !donateOpen,
    onKey: pressKey,
  })

  function selectCurrency(code: string) {
    if (picker?.kind === "rates") {
      setRatesBaseCode(code)
      posthog.capture("currency_selection_changed", {
        selection_context: "rates_base",
        currency_code: code,
      })
    } else if (picker?.kind === "add") {
      setSelected((current) =>
        current.some((item) => item.code === code)
          ? current
          : [
              ...current,
              {
                code,
                color:
                  CURRENCY_COLORS[current.length % CURRENCY_COLORS.length]
                    .value,
              },
            ]
      )
      posthog.capture("currency_selection_changed", {
        selection_context: "add",
        currency_code: code,
      })
    } else if (picker?.kind === "replace") {
      const index = picker.index
      setSelected((current) =>
        current.some(
          (item, position) => item.code === code && position !== index
        )
          ? current
          : current.map((item, position) =>
              position === index ? { ...item, code } : item
            )
      )
      posthog.capture("currency_selection_changed", {
        selection_context: "replace",
        currency_code: code,
      })
    }

    closePicker()
  }

  function moveCurrency(from: number, to: number) {
    if (from === to) return

    setSelected((current) => moveSelectedCurrency(current, from, to))
    posthog.capture("currency_reordered", {
      from_position: from,
      to_position: to,
    })
  }

  function changeColor(index: number, color: CurrencyColor) {
    setSelected((current) =>
      current.map((item, position) =>
        position === index ? { ...item, color } : item
      )
    )
    posthog.capture("currency_color_changed", {
      currency_code: selected[index]?.code,
      color,
    })
  }

  function removeCurrency(index: number) {
    const currency = selected[index]
    if (!currency || selected.length <= 1) return

    setSelected((current) =>
      current.filter((_, position) => position !== index)
    )
    posthog.capture("currency_removed", { currency_code: currency.code })
  }

  function toggleSetting(key: keyof Settings) {
    const enabled = !settings[key]
    setSettings((current) => ({ ...current, [key]: !current[key] }))
    posthog.capture("setting_toggled", { setting_key: key, enabled })
  }

  function requestRatesRefresh() {
    refreshRates()
    posthog.capture("exchange_rates_refresh_requested")
  }

  return (
    <main
      className={cn(
        "bg-background",
        view === "convert" ? "flex h-svh flex-col" : "min-h-svh"
      )}
    >
      <AppHeader
        view={view}
        showDonate={settings.showDonate}
        status={status}
        refreshing={refreshing}
        onRefresh={requestRatesRefresh}
        mobileNavOpen={mobileNavOpen}
        onToggleNav={() => setMobileNavOpen((open) => !open)}
        onNavigate={() => setMobileNavOpen(false)}
        onDonate={() => {
          setDonateOpen(true)
          setMobileNavOpen(false)
          posthog.capture("donate_dialog_opened")
        }}
      />
      {view === "convert" ? (
        <ConverterView
          selected={selected}
          currencies={currencies}
          rates={rates}
          loading={loading}
          amount={amount}
          settings={settings}
          keepAmountFocus={!picker && !donateOpen}
          awaitingNext={memory.awaitingNext || memory.afterResult}
          expression={
            memory.operator
              ? `${memory.left} ${memory.operator}${memory.awaitingNext ? "" : ` ${amount}`}`
              : null
          }
          error={memory.error}
          onAmountChange={changeAmount}
          onOpenCurrency={(index) => setPicker({ kind: "replace", index })}
          onAdd={() => setPicker({ kind: "add" })}
          onColor={changeColor}
          onMakeBase={(index) => moveCurrency(index, 0)}
          onRemove={removeCurrency}
          onReorder={moveCurrency}
          onKey={pressKey}
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
          onOpenBase={() => setPicker({ kind: "rates" })}
        />
      ) : null}
      {view === "settings" ? (
        <SettingsView settings={settings} onToggle={toggleSetting} />
      ) : null}
      {picker ? (
        <CurrencyPicker
          slot={picker.kind}
          selectedCode={
            picker.kind === "rates"
              ? ratesBaseCode
              : picker.kind === "replace"
                ? (selected[picker.index]?.code ?? null)
                : null
          }
          currencies={
            picker.kind === "rates"
              ? currencies
              : currencies.filter(
                  (currency) =>
                    !selected.some(
                      (item, index) =>
                        item.code === currency.code &&
                        (picker.kind === "add" || index !== picker.index)
                    )
                )
          }
          onSelect={selectCurrency}
          onClose={closePicker}
        />
      ) : null}
      {donateOpen ? <DonateDialog onClose={closeDonate} /> : null}
    </main>
  )
}
