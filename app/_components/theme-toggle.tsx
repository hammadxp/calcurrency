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
      size="lg"
      className="justify-start md:justify-center md:px-3 dark:border-neutral-600 dark:text-neutral-300"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Use light theme" : "Use dark theme"}
      title={isDark ? "Use light theme" : "Use dark theme"}
    >
      {isDark ? <Sun /> : <Moon />}
      <span className="md:hidden">{isDark ? "Light theme" : "Dark theme"}</span>
    </Button>
  )
}
