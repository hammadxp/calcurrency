import type { Metadata } from "next"
import { connection } from "next/server"

import { ConverterApp } from "../_components/converter-app"

export const metadata: Metadata = {
  title: "Settings | calcurrency",
  description: "Choose how calcurrency displays and remembers amounts.",
}

export default async function SettingsPage() {
  await connection()

  return <ConverterApp view="settings" />
}
