import type { Metadata } from "next"
import { connection } from "next/server"

import { ConverterApp } from "../_components/converter-app"
import { PROJECT_DETAILS } from "@/data/PROJECT_DETAILS"

export const metadata: Metadata = {
  title: `Settings | ${PROJECT_DETAILS.name}`,
  description: `Choose how ${PROJECT_DETAILS.name} displays and remembers amounts.`,
}

export default async function SettingsPage() {
  await connection()

  return <ConverterApp view="settings" />
}
