"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import {
  FALLBACK_CURRENCIES,
  FALLBACK_RATES,
  FLAG_OVERRIDES,
} from "@/data/currency"
import { formatRateDate, formatRefreshTime, isRateData } from "@/utils/currency"
import type { RateData } from "@/types/currency"

const CACHE_KEY = "calcurrency-rates"

function subscribe(listener: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === CACHE_KEY || event.key === null) listener()
  }
  window.addEventListener("storage", onStorage)
  return () => window.removeEventListener("storage", onStorage)
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(CACHE_KEY) ?? ""
  } catch {
    return ""
  }
}

function getServerSnapshot() {
  return ""
}

export function useRates() {
  const cachedJson = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const cached = useMemo(() => {
    try {
      const parsed: unknown = JSON.parse(cachedJson)
      return isRateData(parsed) ? parsed : null
    } catch {
      return null
    }
  }, [cachedJson])
  const [live, setLive] = useState<RateData | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let isActive = true

    async function loadRates() {
      try {
        const response = await fetch("/api/rates")
        if (!response.ok) throw new Error("Could not load rates")
        const payload: unknown = await response.json()
        if (
          !isRateData(payload) ||
          !("live" in payload) ||
          payload.live !== true
        )
          throw new Error("No live rates")
        const next: RateData = {
          ...payload,
          currencies: payload.currencies.map((currency) => ({
            ...currency,
            flag:
              FLAG_OVERRIDES[currency.code] ??
              currency.code.slice(0, 2).toLowerCase(),
          })),
        }
        if (!isActive) return
        setLive(next)
        try {
          window.localStorage.setItem(CACHE_KEY, JSON.stringify(next))
        } catch {
          /* Keep in memory. */
        }
      } catch {
        if (isActive) setFailed(true)
      }
    }

    void loadRates()
    return () => {
      isActive = false
    }
  }, [])

  const data = live ?? cached
  return {
    rates: data?.rates ?? FALLBACK_RATES,
    currencies: data?.currencies ?? FALLBACK_CURRENCIES,
    status: live
      ? live.rateDate
        ? `Rates dated ${formatRateDate(live.rateDate)}`
        : `Last refreshed ${formatRefreshTime(live.refreshedAt)}`
      : cached
        ? `Saved rates from ${formatRateDate(cached.rateDate ?? cached.refreshedAt.slice(0, 10))}`
        : failed
          ? "Offline sample rates · verify before use"
          : "Checking rates · showing sample rates",
  }
}
