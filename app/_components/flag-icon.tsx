"use client"

import Image from "next/image"
import { Globe2 } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Currency } from "@/types/currency"

type FlagIconProps = { currency: Currency; size?: "small" | "medium" }

export function FlagIcon({ currency, size = "medium" }: FlagIconProps) {
  return currency.flag ? (
    <FlagImage
      key={`${currency.flag}-${size}`}
      flag={currency.flag}
      size={size}
    />
  ) : (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded bg-emerald-100 text-emerald-600",
        size === "small" ? "h-5 w-7 rounded-lg" : "h-9 w-21.5 md:h-11.5"
      )}
      aria-hidden="true"
    >
      <Globe2 size={19} />
    </span>
  )
}

type FlagImageProps = {
  flag: string
  size: "small" | "medium"
}

function FlagImage({ flag, size }: FlagImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded bg-emerald-100 text-emerald-600",
          size === "small" ? "h-5 w-7 rounded-lg" : "h-9 w-21.5 md:h-11.5"
        )}
        aria-hidden="true"
      >
        <Globe2 size={19} />
      </span>
    )
  }

  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-md",
        size === "small"
          ? "h-5 w-7 rounded-[4px]"
          : "h-9 w-21.5 max-w-21.5 shadow-md md:h-11.5"
      )}
      aria-hidden="true"
    >
      {!loaded ? (
        <span className="absolute inset-0 animate-pulse bg-emerald-100/40 dark:bg-neutral-700/70" />
      ) : null}
      <Image
        className={cn(
          "block h-full w-full object-cover",
          !loaded && "opacity-0"
        )}
        src={`https://flagcdn.com/w320/${flag}.png`}
        width={320}
        height={240}
        alt=""
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </span>
  )
}
