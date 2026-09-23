import { cn } from "@/lib/utils"

type CurrencyPanelSkeletonProps = {
  role: "source" | "target"
}

export function CurrencyPanelSkeleton({ role }: CurrencyPanelSkeletonProps) {
  const surface =
    role === "source"
      ? "bg-slate-900/15"
      : "bg-slate-300/60 dark:bg-slate-700/70"

  return (
    <>
      <div
        className="flex min-w-0 flex-row flex-wrap items-center gap-x-3 gap-y-2.5 md:flex-col md:flex-nowrap md:items-start md:gap-4.25"
        aria-hidden="true"
      >
        <span className={cn("h-12 w-21.5 animate-pulse rounded-md", surface)} />
        <div className="flex min-w-0 flex-row items-center gap-1.75 md:flex-col md:items-start md:gap-2.5">
          <span
            className={cn(
              "h-9 w-21.5 animate-pulse rounded-md md:h-11.5",
              surface
            )}
          />
          <span className={cn("h-4 w-28 animate-pulse rounded-md", surface)} />
        </div>
        {role === "target" ? (
          <span
            className={cn(
              "h-4 w-full animate-pulse rounded-md md:w-40",
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
          className={cn("h-6 w-8 animate-pulse rounded-md md:h-10", surface)}
        />
        <span
          className={cn(
            "h-9 w-28 max-w-full animate-pulse rounded-md sm:h-14 sm:w-40 md:h-24 md:w-64",
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
