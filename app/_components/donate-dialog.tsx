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
      className="donate-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="donate-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="donate-icon">
          <Heart size={21} fill="currentColor" />
        </div>
        <button
          ref={closeRef}
          type="button"
          className="close-button"
          onClick={onClose}
          aria-label="Close donate message"
        >
          <X size={18} />
        </button>
        <span className="picker-kicker">keep the rates fresh</span>
        <h2 id={titleId}>Buy us a tiny coffee.</h2>
        <p>
          calcurrency is a weekend tool with no sign-up and no noise. If it
          saved you a tab, chip in for the next pot.
        </p>
        <button type="button" className="coffee-button" onClick={onClose}>
          Send a high five <Heart size={15} />
        </button>
      </div>
    </div>
  )
}
