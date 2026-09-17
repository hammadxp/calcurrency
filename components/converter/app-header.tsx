import { ArrowLeftRight, Heart, Menu, Settings, TrendingUp } from "lucide-react"
import type { View } from "@/lib/currency"

type AppHeaderProps = {
  view: View
  status: string
  mobileNavOpen: boolean
  onToggleNav: () => void
  onView: (view: View) => void
  onDonate: () => void
}

export function AppHeader({
  view,
  status,
  mobileNavOpen,
  onToggleNav,
  onView,
  onDonate,
}: AppHeaderProps) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="brand-mark"
        onClick={() => onView("convert")}
        aria-label="Go to converter"
      >
        <span className="brand-icon">
          <ArrowLeftRight size={18} strokeWidth={2.6} />
        </span>
        <span>calcurrency</span>
      </button>
      <div className="topbar-status" role="status">
        <span className="status-pulse" />
        {status}
      </div>
      <nav
        className={`nav-actions ${mobileNavOpen ? "nav-open" : ""}`}
        aria-label="Main navigation"
      >
        <div className="mobile-status">
          <span className="status-pulse" />
          {status}
        </div>
        <button
          type="button"
          className="nav-button donate-button"
          onClick={onDonate}
        >
          <Heart size={16} fill="currentColor" /> <span>Donate</span>
        </button>
        <button
          type="button"
          className={`nav-button ${view === "rates" ? "active" : ""}`}
          onClick={() => onView("rates")}
          aria-current={view === "rates" ? "page" : undefined}
        >
          <TrendingUp size={15} /> <span>Exchange rates</span>
        </button>
        <button
          type="button"
          className={`nav-button ${view === "settings" ? "active" : ""}`}
          onClick={() => onView("settings")}
          aria-current={view === "settings" ? "page" : undefined}
        >
          <Settings size={15} /> <span>Settings</span>
        </button>
      </nav>
      <button
        type="button"
        className="mobile-menu"
        onClick={onToggleNav}
        aria-expanded={mobileNavOpen}
        aria-label="Toggle navigation"
      >
        <Menu size={19} />
      </button>
    </header>
  )
}
