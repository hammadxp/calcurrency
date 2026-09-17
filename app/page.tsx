"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowDownUp, ArrowLeft, Check, ChevronDown, CircleHelp, Crosshair, Gauge, Heart, Info, Menu,
  MoveUpRight, Search, Settings, ShieldCheck, Sparkles, TrendingDown, TrendingUp, X,
} from "lucide-react"

type Currency = { code: string; name: string; symbol: string; flag: string; unit: string }
const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", unit: "dollar" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", unit: "euro" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", unit: "pound" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", unit: "yen" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", unit: "dollar" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦", unit: "dollar" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭", unit: "franc" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", unit: "yuan" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", unit: "rupee" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬", unit: "dollar" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿", unit: "dollar" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪", unit: "krona" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴", unit: "krone" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷", unit: "real" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦", unit: "rand" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪", unit: "dirham" },
]
const FALLBACK_RATES: Record<string, number> = {
  USD: 1, EUR: 0.8618, GBP: 0.7431, JPY: 146.44, AUD: 1.521, CAD: 1.374, CHF: 0.806,
  CNY: 7.177, INR: 87.54, SGD: 1.281, NZD: 1.753, SEK: 9.497, NOK: 10.103,
  BRL: 5.43, ZAR: 17.56, AED: 3.6725,
}
type View = "convert" | "rates" | "settings"
type Slot = "from" | "to"

function formatAmount(value: number, code: string) {
  if (!Number.isFinite(value)) return "0.00"
  const maximumFractionDigits = ["JPY", "KRW"].includes(code) ? 0 : 2
  return new Intl.NumberFormat("en-US", { maximumFractionDigits, minimumFractionDigits: 2 }).format(value)
}

export default function Page() {
  const [view, setView] = useState<View>("convert")
  const [fromCode, setFromCode] = useState<string | null>("USD")
  const [toCode, setToCode] = useState<string | null>("EUR")
  const [amount, setAmount] = useState("")
  const [rates, setRates] = useState(FALLBACK_RATES)
  const [rateUpdated, setRateUpdated] = useState("Loading live rates")
  const [picker, setPicker] = useState<Slot | null>(null)
  const [search, setSearch] = useState("")
  const [donateOpen, setDonateOpen] = useState(false)
  const [settings, setSettings] = useState({ decimals: true, compact: false, remember: true })
  const searchRef = useRef<HTMLInputElement>(null)

  const from = CURRENCIES.find((currency) => currency.code === fromCode) ?? null
  const to = CURRENCIES.find((currency) => currency.code === toCode) ?? null
  const converted = useMemo(() => {
    if (!amount || !from || !to) return 0
    return Number.parseFloat(amount) * ((rates[to.code] ?? 1) / (rates[from.code] ?? 1))
  }, [amount, from, rates, to])
  const pairRate = from && to ? (rates[to.code] ?? 1) / (rates[from.code] ?? 1) : 0
  const filteredCurrencies = CURRENCIES.filter((currency) => {
    const query = search.toLowerCase()
    return currency.code.toLowerCase().includes(query) || currency.name.toLowerCase().includes(query)
  })

  useEffect(() => {
    const saved = window.localStorage.getItem("calcurrency-amount")
    if (saved) setAmount(saved)
    const loadRates = async () => {
      try {
        const response = await fetch("https://api.frankfurter.app/latest?from=USD")
        if (!response.ok) throw new Error("Could not load rates")
        const data = (await response.json()) as { rates?: Record<string, number> }
        setRates({ ...FALLBACK_RATES, ...(data.rates ?? {}), USD: 1 })
        setRateUpdated("Live rates just now")
      } catch { setRateUpdated("Reference rates / offline mode") }
    }
    void loadRates()
  }, [])

  useEffect(() => {
    if (settings.remember) window.localStorage.setItem("calcurrency-amount", amount)
  }, [amount, settings.remember])

  useEffect(() => {
    if (picker) {
      setSearch("")
      window.setTimeout(() => searchRef.current?.focus(), 0)
    }
  }, [picker])

  function openPicker(slot: Slot) {
    setAmount("")
    setPicker(slot)
  }
  function selectCurrency(currency: Currency) {
    if (picker === "from") setFromCode(currency.code)
    if (picker === "to") setToCode(currency.code)
    setAmount("")
    setPicker(null)
  }
  function clearCurrency() {
    if (picker === "from") setFromCode(null)
    if (picker === "to") setToCode(null)
    setAmount("")
    setPicker(null)
  }
  function swapCurrencies() {
    setFromCode(toCode)
    setToCode(fromCode)
    setAmount(converted ? String(Number(converted.toFixed(4))) : "")
  }
  function handleCalcKey(key: string) {
    if (key === "C") return setAmount("")
    if (key === "⌫") return setAmount((current) => current.slice(0, -1))
    if (key === "." && amount.includes(".")) return
    setAmount((current) => (current + key).replace(/^0+(?=\d)/, ""))
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand-mark" onClick={() => setView("convert")} aria-label="Go to converter"><span className="brand-dot" /><span>calcurrency</span></button>
        <div className="topbar-status"><span className="status-pulse" />{rateUpdated}</div>
        <nav className="nav-actions" aria-label="Main navigation">
          <button className={"nav-button " + (view === "rates" ? "active" : "")} onClick={() => setView("rates")}><TrendingUp size={15} /> <span>Exchange rates</span></button>
          <button className="nav-button donate-button" onClick={() => setDonateOpen(true)}><Heart size={15} fill="currentColor" /> <span>Donate</span></button>
          <button className={"nav-button " + (view === "settings" ? "active" : "")} onClick={() => setView("settings")}><Settings size={15} /> <span>Settings</span></button>
        </nav>
        <button className="mobile-menu" aria-label="Open navigation"><Menu size={19} /></button>
      </header>

      {view === "convert" && <section className="converter-view" aria-label="Currency converter">
        <div className="hero-strip">
          <div><p className="eyebrow"><Crosshair size={13} /> fast, clear, current</p><h1>Move money<br /><em>with context.</em></h1></div>
          <div className="hero-note"><span className="hero-note-index">01</span><p>Choose two currencies.<br />We handle the rest.</p></div>
        </div>
        <div className="currency-stack">
          <CurrencyPanel currency={from} role="source" amount={amount} onOpen={() => openPicker("from")} onChange={setAmount} />
          <div className="swap-line"><span /><button onClick={swapCurrencies} aria-label="Swap currencies"><ArrowDownUp size={17} /></button><span /></div>
          <CurrencyPanel currency={to} role="target" converted={converted} rate={pairRate} onOpen={() => openPicker("to")} />
        </div>
        <div className="rate-summary">
          <div className="rate-summary-copy"><Gauge size={17} /><span>1 {from?.code ?? "—"} equals <strong>{pairRate ? formatAmount(pairRate, to?.code ?? "EUR") : "—"} {to?.code ?? "—"}</strong></span></div>
          <button className="rate-link" onClick={() => setView("rates")}>See market movement <MoveUpRight size={14} /></button>
        </div>
        <Calculator amount={amount} onKey={handleCalcKey} />
      </section>}

      {view === "rates" && <RatesView from={from} to={to} pairRate={pairRate} rates={rates} onBack={() => setView("convert")} />}
      {view === "settings" && <SettingsView settings={settings} setSettings={setSettings} onBack={() => setView("convert")} />}

      <footer className="footer-bar"><span><ShieldCheck size={14} /> Rates refresh on open · Built for the small decisions</span><span className="footer-right">No account needed <span className="footer-square" /></span></footer>

      {picker && <div className="picker-backdrop" onMouseDown={() => setPicker(null)}>
        <div className="picker" role="dialog" aria-modal="true" aria-label={"Choose " + (picker === "from" ? "source" : "target") + " currency"} onMouseDown={(event) => event.stopPropagation()}>
          <div className="picker-header"><div><span className="picker-kicker">select {picker === "from" ? "source" : "target"}</span><h2>Pick a currency</h2></div><button className="close-button" onClick={() => setPicker(null)} aria-label="Close currency picker"><X size={18} /></button></div>
          <label className="search-field"><Search size={17} /><input ref={searchRef} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or code" aria-label="Search currencies" /><kbd>esc</kbd></label>
          <div className="currency-list">{filteredCurrencies.map((currency) => {
            const isSelected = currency.code === (picker === "from" ? fromCode : toCode)
            return <button className={"currency-option " + (isSelected ? "selected" : "")} key={currency.code} onClick={() => selectCurrency(currency)}><span className="option-flag">{currency.flag}</span><span className="option-name"><strong>{currency.code}</strong><small>{currency.name}</small></span>{isSelected && <Check size={17} />}</button>
          })}</div>
          <div className="picker-footer"><p className="picker-footnote"><Info size={13} /> Picking a new currency clears the current amount.</p><button className="clear-pick" onClick={clearCurrency}>Clear this currency</button></div>
        </div>
      </div>}

      {donateOpen && <div className="donate-backdrop" onMouseDown={() => setDonateOpen(false)}><div className="donate-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="donate-icon"><Heart size={21} fill="currentColor" /></div><button className="close-button" onClick={() => setDonateOpen(false)} aria-label="Close donate message"><X size={18} /></button>
        <span className="picker-kicker">keep the rates fresh</span><h2>Buy us a tiny coffee.</h2><p>calcurrency is a weekend tool with no sign-up and no noise. If it saved you a tab, chip in for the next pot.</p><button className="coffee-button" onClick={() => setDonateOpen(false)}>Send a high five <Sparkles size={15} /></button>
      </div></div>}
    </main>
  )
}

function CurrencyPanel({ currency, role, amount, converted, rate, onOpen, onChange }: { currency: Currency | null; role: "source" | "target"; amount?: string; converted?: number; rate?: number; onOpen: () => void; onChange?: (value: string) => void }) {
  const isSource = role === "source"
  return <article className={"currency-panel " + (isSource ? "source-panel" : "target-panel")}>
    <div className="panel-topline"><span>{isSource ? "You send" : "They receive"}</span><span className={"role-label " + (isSource ? "source-label" : "")}>{isSource ? "Selected" : "Converted"}</span></div>
    <div className="panel-main">
      <button className="currency-trigger" onClick={onOpen} aria-label={"Choose " + role + " currency"}>
        {currency ? <><span className="flag-badge">{currency.flag}</span><span className="currency-code">{currency.code}</span><ChevronDown size={17} /></> : <><span className="plus-mark">+</span><span className="currency-code">Add currency</span></>}
      </button>
      {currency ? <div className="amount-wrap"><span className="amount-symbol">{currency.symbol}</span>{isSource ? <input inputMode="decimal" value={amount} onChange={(event) => onChange?.(event.target.value.replace(/[^0-9.]/g, ""))} placeholder="0.00" aria-label={"Amount in " + currency.code} /> : <output>{converted ? formatAmount(converted, currency.code) : "0.00"}</output>}<span className="amount-caption">{isSource ? "Enter amount" : (rate ? "1 " + currency.code + " =" : "Waiting for") + " " + (rate ? formatAmount(rate, currency.code) : "rate")}</span></div> : <button className="empty-panel-button" onClick={onOpen}>+</button>}
    </div>
    {currency && <div className="panel-bottomline"><span>{currency.name}</span><span>{isSource ? "Tap currency to change" : "Live conversion"}</span></div>}
  </article>
}

function Calculator({ amount, onKey }: { amount: string; onKey: (key: string) => void }) {
  const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "C", "0", "."]
  return <section className="calculator"><div className="calculator-heading"><span>Quick calculate</span><span>mobile input</span></div><div className="calculator-display"><span>{amount || "0"}</span><span>source amount</span></div><div className="calculator-grid">{keys.map((key) => <button key={key} onClick={() => onKey(key)} className={key === "C" ? "clear-key" : ""}>{key}</button>)}<button onClick={() => onKey("⌫")} className="backspace-key" aria-label="Backspace">⌫</button></div></section>
}

function RatesView({ from, to, pairRate, rates, onBack }: { from: Currency | null; to: Currency | null; pairRate: number; rates: Record<string, number>; onBack: () => void }) {
  const rows = [
    { code: "EUR", change: "+0.42%", label: "Euro", up: true }, { code: "GBP", change: "−0.18%", label: "British Pound", up: false }, { code: "JPY", change: "+0.76%", label: "Japanese Yen", up: true }, { code: "CHF", change: "−0.06%", label: "Swiss Franc", up: false },
  ]
  return <section className="detail-view"><div className="detail-heading"><button className="back-button" onClick={onBack}><ArrowLeft size={16} /> Converter</button><span className="detail-kicker">market board / 24h</span><h1>Rates that<br /><em>tell a story.</em></h1><p className="detail-intro">A quick read on where the world is moving. Reference rates refreshed when you opened this app.</p></div><div className="market-grid"><div className="featured-rate"><div className="card-topline"><span>{from?.code ?? "USD"} / {to?.code ?? "EUR"}</span><span className="live-tag"><span className="status-pulse" /> live</span></div><strong>{pairRate ? pairRate.toFixed(4) : "—"}</strong><span className="feature-caption">current mid-market reference</span><div className="sparkline"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="chart-axis"><span>09:00</span><span>now</span></div></div><div className="market-aside"><div><span className="market-number">16</span><span>currencies<br />tracked</span></div><div><span className="market-number">0.2s</span><span>refresh<br />latency</span></div><div><span className="market-number">24h</span><span>movement<br />window</span></div></div></div><div className="table-header"><h2>Pairs in motion</h2><span>Reference only · USD base</span></div><div className="rate-table">{rows.map((row) => <div className="rate-row" key={row.code}><span className="table-flag">{CURRENCIES.find((currency) => currency.code === row.code)?.flag}</span><span className="table-currency"><strong>{row.code}</strong><small>{row.label}</small></span><span className="table-value">{rates[row.code]?.toFixed(4) ?? "—"}</span><span className={"trend " + (row.up ? "up" : "down")}>{row.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {row.change}</span><div className={"mini-bars " + (row.up ? "positive" : "negative")}><i /><i /><i /><i /><i /></div></div>)}</div></section>
}

function SettingsView({ settings, setSettings, onBack }: { settings: { decimals: boolean; compact: boolean; remember: boolean }; setSettings: React.Dispatch<React.SetStateAction<{ decimals: boolean; compact: boolean; remember: boolean }>>; onBack: () => void }) {
  const items = [{ key: "decimals", title: "Show decimal precision", detail: "Keep two decimal places on converted values." }, { key: "compact", title: "Compact numbers", detail: "Use 1.2K instead of 1,200 on larger values." }, { key: "remember", title: "Remember my last amount", detail: "Save your last typed value to this browser only." }] as const
  return <section className="detail-view settings-view"><div className="detail-heading"><button className="back-button" onClick={onBack}><ArrowLeft size={16} /> Converter</button><span className="detail-kicker">preferences / local only</span><h1>Make it<br /><em>yours.</em></h1><p className="detail-intro">Small controls for a calmer conversion ritual. Nothing leaves this browser.</p></div><div className="settings-card"><div className="settings-card-head"><div><span className="settings-icon"><Settings size={18} /></span><h2>Display & memory</h2></div><span className="settings-count">03 options</span></div>{items.map((item) => <label className="setting-row" key={item.key}><span><strong>{item.title}</strong><small>{item.detail}</small></span><input type="checkbox" checked={settings[item.key]} onChange={() => setSettings((current) => ({ ...current, [item.key]: !current[item.key] }))} /><span className="toggle" /></label>)}<div className="settings-note"><CircleHelp size={15} /><span>Currency rates come from the European Central Bank via Frankfurter. Amounts are never sent with the request.</span></div></div></section>
}
