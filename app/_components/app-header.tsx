import Link from "next/link"
import { ArrowLeftRight, Heart, Menu, Settings, TrendingUp } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@/lib/utils"
import type { View } from "@/types/currency"

type AppHeaderProps = {
  view: View
  status: string
  refreshing: boolean
  onRefresh: () => void
  mobileNavOpen: boolean
  onToggleNav: () => void
  onNavigate: () => void
  onDonate: () => void
}

export function AppHeader({
  view,
  status,
  refreshing,
  onRefresh,
  mobileNavOpen,
  onToggleNav,
  onNavigate,
  onDonate,
}: AppHeaderProps) {
  return (
    <header className="relative z-10 flex min-h-[70px] items-center gap-5 bg-slate-900 px-9 text-stone-50 max-md:min-h-[58px] max-md:gap-3 max-md:px-5">
      <Link
        href="/"
        className="flex items-center gap-2.5 border-0 bg-transparent p-0 text-base font-extrabold tracking-[-0.06em] text-stone-50 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 max-md:text-[13px]"
        onClick={onNavigate}
        aria-label="Go to converter"
      >
        <span className="grid size-[30px] place-items-center rounded-[7px] bg-rose-500 text-stone-50">
          <ArrowLeftRight size={18} strokeWidth={2.6} />
        </span>
        <span>calcurrency</span>
      </Link>
      <RateStatus
        status={status}
        refreshing={refreshing}
        onRefresh={onRefresh}
        className="max-md:hidden"
      />
      <nav
        className={cn(
          "ml-auto flex items-center gap-2 max-md:hidden",
          mobileNavOpen &&
            "max-md:absolute max-md:top-[58px] max-md:right-2.5 max-md:z-20 max-md:m-0 max-md:flex max-md:w-68 max-md:max-w-[calc(100vw-20px)] max-md:flex-col max-md:items-stretch max-md:rounded-b-[9px] max-md:border max-md:border-slate-600 max-md:bg-slate-900 max-md:p-2.5 max-md:shadow-2xl"
        )}
        aria-label="Main navigation"
      >
        <RateStatus
          status={status}
          refreshing={refreshing}
          onRefresh={onRefresh}
          className="hidden px-1.5 pt-2 pb-3 max-md:flex"
        />
        <ThemeToggle />
        <button
          type="button"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-rose-400/70 bg-rose-500/10 px-[15px] text-xs font-semibold text-rose-100 transition-colors hover:border-rose-400 hover:bg-rose-500 hover:text-white focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 max-md:justify-start"
          onClick={onDonate}
        >
          <Heart size={16} fill="currentColor" /> <span>Donate</span>
        </button>
        <Link
          href="/rates"
          className={cn(
            "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-600 bg-transparent px-[15px] text-xs font-semibold text-slate-300 transition-colors hover:border-emerald-100 hover:bg-emerald-100 hover:text-slate-900 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 max-md:justify-start",
            view === "rates" &&
              "border-emerald-100 bg-emerald-100 text-slate-900"
          )}
          onClick={onNavigate}
          aria-current={view === "rates" ? "page" : undefined}
        >
          <TrendingUp size={15} /> <span>Exchange rates</span>
        </Link>
        <Link
          href="/settings"
          className={cn(
            "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-600 bg-transparent px-[15px] text-xs font-semibold text-slate-300 transition-colors hover:border-emerald-100 hover:bg-emerald-100 hover:text-slate-900 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 max-md:justify-start",
            view === "settings" &&
              "border-emerald-100 bg-emerald-100 text-slate-900"
          )}
          onClick={onNavigate}
          aria-current={view === "settings" ? "page" : undefined}
        >
          <Settings size={15} /> <span>Settings</span>
        </Link>
      </nav>
      <button
        type="button"
        className="ml-auto hidden size-9 place-items-center rounded-md border border-slate-500 bg-transparent text-stone-50 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 max-md:grid"
        onClick={onToggleNav}
        aria-expanded={mobileNavOpen}
        aria-label="Toggle navigation"
      >
        <Menu size={19} />
      </button>
    </header>
  )
}

type RateStatusProps = {
  status: string
  refreshing: boolean
  onRefresh: () => void
  className?: string
}

function RateStatus({
  status,
  refreshing,
  onRefresh,
  className,
}: RateStatusProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[11px] leading-none text-slate-300",
        className
      )}
      role="status"
      aria-label={refreshing ? "Refreshing rates" : undefined}
    >
      <span
        className="size-2 shrink-0 rounded-full bg-emerald-400"
        aria-hidden="true"
      />
      {refreshing ? (
        <span
          className="h-3 w-36 animate-pulse rounded bg-slate-600"
          aria-hidden="true"
        />
      ) : (
        <button
          type="button"
          className="rounded-sm text-left hover:text-white hover:underline focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500"
          onClick={onRefresh}
          title="Refresh exchange rates"
        >
          {status}
        </button>
      )}
    </div>
  )
}
