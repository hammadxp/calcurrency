"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"

const subscribeToBrowser = () => () => undefined

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribeToBrowser,
    () => true,
    () => false
  )
  const isDark = mounted && resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="header"
      size="icon-lg"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Use light theme" : "Use dark theme"}
      title={isDark ? "Use light theme" : "Use dark theme"}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  )
}
