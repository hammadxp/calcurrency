"use client"

import { useId, useRef } from "react"
import { Heart, X } from "lucide-react"
import { useModalFocus } from "@/hooks/use-modal-focus"

type DonateDialogProps = { onClose: () => void }

export function DonateDialog({ onClose }: DonateDialogProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useModalFocus(dialogRef, closeRef, onClose)

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center bg-slate-900/60 p-5 backdrop-blur-[8px] dark:bg-neutral-950/70"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="relative w-[min(430px,100%)] rounded-2xl border border-slate-900/10 bg-emerald-100 p-[30px] text-slate-900 shadow-[0_25px_70px_rgb(15_23_42_/_28%)] dark:bg-emerald-950 dark:text-stone-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="mb-7 grid size-[46px] place-items-center rounded-lg bg-rose-500 text-stone-50 dark:text-emerald-950">
          <Heart size={21} fill="currentColor" />
        </div>
        <button
          ref={closeRef}
          type="button"
          className="absolute top-[18px] right-[18px] grid size-9 place-items-center rounded-md border border-slate-900/20 bg-white/50 text-slate-900 transition-colors hover:bg-slate-900 hover:text-stone-50 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 dark:border-white/20 dark:bg-white/10 dark:text-stone-50"
          onClick={onClose}
          aria-label="Close donate message"
        >
          <X size={18} />
        </button>
        <span className="mb-[7px] block text-[11px] font-bold tracking-[0.08em] text-slate-500 uppercase dark:text-neutral-300">
          keep the rates fresh
        </span>
        <h2 className="text-[25px] tracking-[-0.08em]" id={titleId}>
          Buy us a tiny coffee.
        </h2>
        <p className="my-[18px] mb-6 max-w-80 text-[13px] leading-[1.6] text-slate-600 dark:text-neutral-300">
          calcurrency is a weekend tool with no sign-up and no noise. If it
          saved you a tab, chip in for the next pot.
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-[13px] text-xs text-stone-50 transition-colors hover:bg-slate-700 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 dark:bg-stone-50 dark:text-neutral-900"
          onClick={onClose}
        >
          Send a high five <Heart size={15} />
        </button>
      </div>
    </div>
  )
}
