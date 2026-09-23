import { cn } from "@/lib/utils"
import type { View } from "@/types/currency"
import { Heart, Menu, Settings, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

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
    <header className="relative z-10 flex min-h-[58px] items-center gap-3 bg-slate-900 px-5 text-stone-50 md:min-h-[70px] md:gap-5 md:px-9">
      <Link
        href="/"
        className="flex items-center gap-1.5 border-0 bg-transparent p-0 text-[13px] font-extrabold tracking-[-0.06em] text-stone-50 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 md:text-base"
        onClick={onNavigate}
        aria-label="Go to converter"
      >
        <Image
          src="/icon.png"
          alt="Logo of Calcurrency app"
          width={36}
          height={36}
        />
        <span>calcurrency</span>
      </Link>
      <RateStatus
        status={status}
        refreshing={refreshing}
        onRefresh={onRefresh}
        className="hidden md:flex"
      />
      <nav
        className={cn(
          "absolute top-[58px] right-2.5 z-20 m-0 hidden w-68 max-w-[calc(100vw-20px)] flex-col items-stretch gap-2 rounded-b-[9px] border border-slate-600 bg-slate-900 p-2.5 shadow-2xl md:static md:z-auto md:ml-auto md:flex md:w-auto md:max-w-none md:flex-row md:items-center md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none",
          mobileNavOpen && "flex"
        )}
        aria-label="Main navigation"
      >
        <RateStatus
          status={status}
          refreshing={refreshing}
          onRefresh={onRefresh}
          className="px-1.5 pt-2 pb-3 md:hidden"
        />
        <ThemeToggle />
        <button
          type="button"
          className="inline-flex min-h-10 items-center justify-start gap-2 rounded-md border border-rose-400/70 bg-rose-500/10 px-[15px] text-xs font-semibold text-rose-100 transition-colors hover:border-rose-400 hover:bg-rose-500 hover:text-white focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 md:justify-center"
          onClick={onDonate}
        >
          <Heart size={16} fill="currentColor" /> <span>Donate</span>
        </button>
        <Link
          href="/rates"
          className={cn(
            "inline-flex min-h-10 items-center justify-start gap-2 rounded-md border border-slate-600 bg-transparent px-[15px] text-xs font-semibold text-slate-300 transition-colors hover:border-emerald-100 hover:bg-emerald-100 hover:text-slate-900 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 md:justify-center",
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
            "inline-flex min-h-10 items-center justify-start gap-2 rounded-md border border-slate-600 bg-transparent px-[15px] text-xs font-semibold text-slate-300 transition-colors hover:border-emerald-100 hover:bg-emerald-100 hover:text-slate-900 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 md:justify-center",
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
        className="ml-auto grid size-9 place-items-center rounded-md border border-slate-500 bg-transparent text-stone-50 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 md:hidden"
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
