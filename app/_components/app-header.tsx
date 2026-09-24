import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { View } from "@/types/currency"
import { Heart, Menu, Settings, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { PROJECT_DETAILS } from "@/data/PROJECT_DETAILS"

type AppHeaderProps = {
  view: View
  showDonate: boolean
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
  showDonate,
  status,
  refreshing,
  onRefresh,
  mobileNavOpen,
  onToggleNav,
  onNavigate,
  onDonate,
}: AppHeaderProps) {
  const navRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!mobileNavOpen) return

    function closeOnOutsidePointer(event: globalThis.PointerEvent) {
      const target = event.target
      if (
        target instanceof Node &&
        !navRef.current?.contains(target) &&
        !toggleRef.current?.contains(target)
      ) {
        onNavigate()
      }
    }

    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onNavigate()
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer)
    document.addEventListener("keydown", closeOnEscape)

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [mobileNavOpen, onNavigate])

  return (
    <header className="relative z-10 flex min-h-[58px] shrink-0 items-center gap-3 bg-slate-900 px-5 text-stone-50 md:min-h-[70px] md:gap-5 md:px-9 dark:bg-neutral-900">
      <Link
        href="/"
        className="flex items-center gap-1.5 border-0 bg-transparent p-0 text-sm font-extrabold tracking-[-0.06em] text-stone-50 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 md:text-base lg:text-lg"
        onClick={onNavigate}
        aria-label="Go to converter"
      >
        <Image
          src="/icon.png"
          alt={`Logo of ${PROJECT_DETAILS.name} app`}
          width={36}
          height={36}
        />
        <span>{PROJECT_DETAILS.name}</span>
      </Link>
      <RateStatus
        status={status}
        refreshing={refreshing}
        onRefresh={onRefresh}
        className="hidden md:flex"
      />
      <nav
        id="mobile-navigation"
        ref={navRef}
        className={cn(
          "absolute top-[58px] right-2.5 z-20 m-0 hidden w-68 max-w-[calc(100vw-20px)] flex-col items-stretch gap-2 rounded-b-[9px] border border-slate-600 bg-slate-900 p-2.5 shadow-2xl md:static md:z-auto md:ml-auto md:flex md:w-auto md:max-w-none md:flex-row md:items-center md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none dark:border-neutral-600 dark:bg-neutral-900 md:dark:bg-transparent",
          mobileNavOpen && "flex"
        )}
        aria-label="Main navigation"
      >
        {showDonate ? (
          <>
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-start gap-2 rounded-md border border-rose-400/70 bg-rose-500/10 px-[15px] text-xs font-semibold text-rose-100 transition-colors hover:border-rose-400 hover:bg-rose-500 hover:text-white focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 md:justify-center"
              onClick={onDonate}
            >
              <Heart size={16} fill="currentColor" /> <span>Donate</span>
            </button>
            <span
              className="my-1 h-px bg-slate-600 md:mx-1 md:my-0 md:h-6 md:w-px dark:bg-neutral-600"
              aria-hidden="true"
            />
          </>
        ) : null}
        <ThemeToggle />
        <Link
          href="/rates"
          className={cn(
            "inline-flex min-h-10 items-center justify-start gap-2 rounded-md border border-slate-600 bg-transparent px-[15px] text-xs font-semibold text-slate-300 transition-colors hover:border-emerald-100 hover:bg-emerald-100 hover:text-slate-900 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 md:justify-center dark:border-neutral-600 dark:text-neutral-300",
            view === "rates" &&
              "border-emerald-100 bg-emerald-100 text-slate-900 dark:text-neutral-900"
          )}
          onClick={onNavigate}
          aria-current={view === "rates" ? "page" : undefined}
        >
          <TrendingUp size={15} /> <span>Exchange rates</span>
        </Link>
        <Link
          href="/settings"
          className={cn(
            "inline-flex min-h-10 items-center justify-start gap-2 rounded-md border border-slate-600 bg-transparent px-[15px] text-xs font-semibold text-slate-300 transition-colors hover:border-emerald-100 hover:bg-emerald-100 hover:text-slate-900 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 md:justify-center dark:border-neutral-600 dark:text-neutral-300",
            view === "settings" &&
              "border-emerald-100 bg-emerald-100 text-slate-900 dark:text-neutral-900"
          )}
          onClick={onNavigate}
          aria-current={view === "settings" ? "page" : undefined}
        >
          <Settings size={15} /> <span>Settings</span>
        </Link>
        <RateStatus
          status={status}
          refreshing={refreshing}
          onRefresh={onRefresh}
          className="px-1.5 pt-2 pb-3 md:hidden"
        />
      </nav>
      <Button
        ref={toggleRef}
        type="button"
        variant="header"
        size="icon"
        className="ml-auto rounded-md text-stone-50 md:hidden dark:border-neutral-500"
        onClick={onToggleNav}
        aria-expanded={mobileNavOpen}
        aria-controls="mobile-navigation"
        aria-label="Toggle navigation"
      >
        <Menu />
      </Button>
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
        "flex items-center gap-2 text-[11px] leading-none text-slate-300 dark:text-neutral-300",
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
          className="h-3 w-36 animate-pulse rounded bg-slate-600 dark:bg-neutral-600"
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
