import { cn } from "@/lib/utils"

type CurrencyPanelSkeletonProps = {
  role: "source" | "target"
}

export function CurrencyPanelSkeleton({ role }: CurrencyPanelSkeletonProps) {
  const surface =
    role === "source"
      ? "bg-emerald-50/30"
      : "bg-slate-300/60 dark:bg-slate-700/70"

  return (
    <>
      <div
        className="flex min-w-0 flex-col items-start gap-4.25 max-md:flex-row max-md:flex-wrap max-md:items-center max-md:gap-x-3 max-md:gap-y-2.5"
        aria-hidden="true"
      >
        <span className={cn("h-12 w-21.5 animate-pulse rounded-md", surface)} />
        <div className="flex min-w-0 flex-col items-start gap-2.5 max-md:flex-row max-md:items-center max-md:gap-1.75">
          <span
            className={cn(
              "h-11.5 w-21.5 animate-pulse rounded-md max-md:h-9",
              surface
            )}
          />
          <span className={cn("h-4 w-28 animate-pulse rounded-md", surface)} />
        </div>
        {role === "target" ? (
          <span
            className={cn(
              "h-4 w-40 animate-pulse rounded-md max-md:w-full",
              surface
            )}
          />
        ) : null}
      </div>
      <div
        className="flex w-full min-w-0 items-end justify-end gap-2"
        aria-hidden="true"
      >
        <span
          className={cn(
            "h-10 w-8 animate-pulse rounded-md max-md:h-6",
            surface
          )}
        />
        <span
          className={cn(
            "h-24 w-64 max-w-full animate-pulse rounded-md max-md:h-14 max-md:w-40 max-sm:h-9 max-sm:w-28",
            surface
          )}
        />
      </div>
      <span className="sr-only" role="status">
        Loading {role} currency and amount
      </span>
    </>
  )
}
