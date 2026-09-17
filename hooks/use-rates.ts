"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import {
  FALLBACK_CURRENCIES,
  FALLBACK_RATES,
  FLAG_OVERRIDES,
} from "@/lib/currency-data"
import {
  formatRefreshTime,
  isRateData,
  type Currency,
  type RateData,
} from "@/lib/currency"

const CACHE_KEY = "calcurrency-rates"

type RatesResponse = {
  rates?: Record<string, number>
  currencies?: Currency[]
  refreshedAt?: string | null
  live?: boolean
}

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
    const controller = new AbortController()
    async function loadRates() {
      try {
        const response = await fetch("/api/rates", {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("Could not load rates")
        const payload = (await response.json()) as RatesResponse
        if (!payload.live || !payload.currencies || !payload.refreshedAt)
          throw new Error("No live rates")
        const next: unknown = {
          rates: payload.rates,
          currencies: payload.currencies.map((currency) => ({
            ...currency,
            flag:
              FLAG_OVERRIDES[currency.code] ??
              currency.code.slice(0, 2).toLowerCase(),
          })),
          refreshedAt: payload.refreshedAt,
        }
        if (!isRateData(next)) throw new Error("Invalid rate data")
        if (controller.signal.aborted) return
        setLive(next)
        try {
          window.localStorage.setItem(CACHE_KEY, JSON.stringify(next))
        } catch {
          /* Keep in memory. */
        }
      } catch {
        if (!controller.signal.aborted) setFailed(true)
      }
    }
    void loadRates()
    return () => controller.abort()
  }, [])

  const data = live ?? cached
  return {
    rates: data?.rates ?? FALLBACK_RATES,
    currencies: data?.currencies ?? FALLBACK_CURRENCIES,
    status: data
      ? `Last refreshed ${formatRefreshTime(data.refreshedAt)}`
      : failed
        ? "Rates awaiting refresh"
        : "Checking rates",
  }
}
