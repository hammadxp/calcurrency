import { ArrowLeftRight, Heart, Menu, Settings, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { View } from "@/types/currency"

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
    <header className="relative z-10 flex min-h-[70px] items-center gap-5 bg-slate-900 px-9 text-stone-50 max-[760px]:min-h-[58px] max-[760px]:gap-3 max-[760px]:px-5">
      <button
        type="button"
        className="flex items-center gap-2.5 border-0 bg-transparent p-0 text-base font-extrabold tracking-[-0.06em] text-stone-50 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 max-[760px]:text-[13px]"
        onClick={() => onView("convert")}
        aria-label="Go to converter"
      >
        <span className="grid size-[30px] place-items-center rounded-[7px] bg-rose-500 text-stone-50">
          <ArrowLeftRight size={18} strokeWidth={2.6} />
        </span>
        <span>calcurrency</span>
      </button>
      <div
        className="flex items-center gap-2 text-[11px] leading-none text-slate-300 max-[760px]:hidden"
        role="status"
      >
        <span className="size-2 rounded-full bg-emerald-400" />
        {status}
      </div>
      <nav
        className={cn(
          "ml-auto flex items-center gap-2 max-[760px]:hidden",
          mobileNavOpen &&
            "max-[760px]:absolute max-[760px]:top-[58px] max-[760px]:right-2.5 max-[760px]:z-20 max-[760px]:m-0 max-[760px]:flex max-[760px]:w-[min(270px,calc(100vw-20px))] max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:rounded-b-[9px] max-[760px]:border max-[760px]:border-slate-600 max-[760px]:bg-slate-900 max-[760px]:p-2.5 max-[760px]:shadow-2xl"
        )}
        aria-label="Main navigation"
      >
        <div className="hidden items-center gap-2 px-1.5 pt-2 pb-3 text-[11px] text-slate-300 max-[760px]:flex">
          <span className="size-2 rounded-full bg-emerald-400" />
          {status}
        </div>
        <button
          type="button"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-rose-800 bg-transparent px-[15px] text-xs font-semibold text-rose-300 transition-colors hover:border-rose-300 hover:bg-rose-200 hover:text-slate-900 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 max-[760px]:justify-start"
          onClick={onDonate}
        >
          <Heart size={16} fill="currentColor" /> <span>Donate</span>
        </button>
        <button
          type="button"
          className={cn(
            "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-600 bg-transparent px-[15px] text-xs font-semibold text-slate-300 transition-colors hover:border-emerald-100 hover:bg-emerald-100 hover:text-slate-900 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 max-[760px]:justify-start",
            view === "rates" &&
              "border-emerald-100 bg-emerald-100 text-slate-900"
          )}
          onClick={() => onView("rates")}
          aria-current={view === "rates" ? "page" : undefined}
        >
          <TrendingUp size={15} /> <span>Exchange rates</span>
        </button>
        <button
          type="button"
          className={cn(
            "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-600 bg-transparent px-[15px] text-xs font-semibold text-slate-300 transition-colors hover:border-emerald-100 hover:bg-emerald-100 hover:text-slate-900 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 max-[760px]:justify-start",
            view === "settings" &&
              "border-emerald-100 bg-emerald-100 text-slate-900"
          )}
          onClick={() => onView("settings")}
          aria-current={view === "settings" ? "page" : undefined}
        >
          <Settings size={15} /> <span>Settings</span>
        </button>
      </nav>
      <button
        type="button"
        className="ml-auto hidden size-9 place-items-center rounded-md border border-slate-500 bg-transparent text-stone-50 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 max-[760px]:grid"
        onClick={onToggleNav}
        aria-expanded={mobileNavOpen}
        aria-label="Toggle navigation"
      >
        <Menu size={19} />
      </button>
    </header>
  )
}
