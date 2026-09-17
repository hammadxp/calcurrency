"use client"

import { useSyncExternalStore, type SetStateAction } from "react"
import {
  DEFAULT_SETTINGS,
  normalizeAmount,
  type Settings,
} from "@/lib/currency"

const PAIR_KEY = "calcurrency-selected-currencies"
const AMOUNT_KEY = "calcurrency-amount"
const SETTINGS_KEY = "calcurrency-settings"

type Pair = { from: string | null; to: string | null }
type Preferences = { pair: Pair; amount: string; settings: Settings }

const defaults: Preferences = {
  pair: { from: "USD", to: "EUR" },
  amount: "",
  settings: DEFAULT_SETTINGS,
}
const serverSnapshot = JSON.stringify(defaults)
const listeners = new Set<() => void>()

function readPair(value: string | null): Pair {
  if (value) {
    try {
      const pair: unknown = JSON.parse(value)
      if (pair && typeof pair === "object") {
        const { from, to } = pair as Partial<Pair>
        if (
          (from === null ||
            (typeof from === "string" && /^[A-Z]{3}$/.test(from))) &&
          (to === null || (typeof to === "string" && /^[A-Z]{3}$/.test(to)))
        ) {
          return { from, to } as Pair
        }
      }
    } catch {
      /* Ignore old data. */
    }
  }
  return defaults.pair
}

function readSettings(value: string | null): Settings {
  if (value) {
    try {
      const parsed: unknown = JSON.parse(value)
      if (parsed && typeof parsed === "object") {
        const settings = parsed as Partial<Settings>
        if (
          typeof settings.decimals === "boolean" &&
          typeof settings.compact === "boolean" &&
          typeof settings.remember === "boolean"
        ) {
          return settings as Settings
        }
      }
    } catch {
      /* Ignore old data. */
    }
  }
  return DEFAULT_SETTINGS
}

function readStored(): Preferences {
  try {
    const settings = readSettings(window.localStorage.getItem(SETTINGS_KEY))
    return {
      pair: readPair(window.localStorage.getItem(PAIR_KEY)),
      amount: settings.remember
        ? normalizeAmount(window.localStorage.getItem(AMOUNT_KEY) ?? "")
        : "",
      settings,
    }
  } catch {
    return defaults
  }
}

let current = typeof window === "undefined" ? defaults : readStored()
let snapshot = JSON.stringify(current)

function getSnapshot() {
  return snapshot
}
function getServerSnapshot() {
  return serverSnapshot
}
function notify() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1) window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener("storage", onStorage)
  }
}

function onStorage(event: StorageEvent) {
  if (event.key && ![PAIR_KEY, AMOUNT_KEY, SETTINGS_KEY].includes(event.key))
    return
  current = readStored()
  snapshot = JSON.stringify(current)
  notify()
}

function update(transform: (value: Preferences) => Preferences) {
  current = transform(current)
  snapshot = JSON.stringify(current)
  try {
    window.localStorage.setItem(PAIR_KEY, JSON.stringify(current.pair))
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(current.settings))
    if (current.settings.remember)
      window.localStorage.setItem(AMOUNT_KEY, current.amount)
    else window.localStorage.removeItem(AMOUNT_KEY)
  } catch {
    /* Changes still work for this session. */
  }
  notify()
}

function resolve<T>(action: SetStateAction<T>, previous: T): T {
  return typeof action === "function"
    ? (action as (value: T) => T)(previous)
    : action
}

function setPair(action: SetStateAction<Pair>) {
  update((value) => ({ ...value, pair: resolve(action, value.pair) }))
}

function setAmount(action: SetStateAction<string>) {
  update((value) => ({ ...value, amount: resolve(action, value.amount) }))
}

function setSettings(action: SetStateAction<Settings>) {
  update((value) => ({ ...value, settings: resolve(action, value.settings) }))
}

export function useConverterPreferences() {
  const value = JSON.parse(
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  ) as Preferences
  return { ...value, setPair, setAmount, setSettings }
}
