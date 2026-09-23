"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { FLAG_OVERRIDES } from "@/data/currency"
import { formatRelativeTimestamp, isRateData } from "@/utils/currency"
import type { RateData } from "@/types/currency"

const CACHE_KEY = "calcurrency-rates"
const EMPTY_RATES: Record<string, number> = {}

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
  const [refreshing, setRefreshing] = useState(true)
  const [now, setNow] = useState(() => new Date())
  const requestInFlight = useRef(false)

  const loadRates = useCallback(async () => {
    if (requestInFlight.current) return
    requestInFlight.current = true
    setRefreshing(true)

    try {
      const response = await fetch("/api/rates", { cache: "no-store" })
      if (!response.ok) throw new Error("Could not load rates")
      const payload: unknown = await response.json()
      if (!isRateData(payload) || !("live" in payload) || payload.live !== true)
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
      setLive(next)
      try {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(next))
      } catch {
        /* Keep in memory. */
      }
    } catch {
      /* Keep showing the most recently cached rates. */
    } finally {
      requestInFlight.current = false
      setRefreshing(false)
      setNow(new Date())
    }
  }, [])

  useEffect(() => {
    const initialRequest = window.setTimeout(() => void loadRates(), 0)

    return () => window.clearTimeout(initialRequest)
  }, [loadRates])

  useEffect(() => {
    const clock = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(clock)
  }, [])

  const data = live ?? cached

  return {
    rates: data?.rates ?? EMPTY_RATES,
    currencies: data?.currencies ?? [],
    loading: refreshing && !data,
    refreshing,
    refreshRates: loadRates,
    status: refreshing
      ? "Refreshing rates"
      : data
        ? `Rates updated: ${formatRelativeTimestamp(data.refreshedAt, now)}`
        : "Rates unavailable",
  }
}
