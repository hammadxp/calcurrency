import type { Metadata } from "next"
import { connection } from "next/server"

import { ConverterApp } from "../_components/converter-app"
import { PROJECT_DETAILS } from "@/data/PROJECT_DETAILS"

export const metadata: Metadata = {
  title: `Exchange rates | ${PROJECT_DETAILS.name}`,
  description: "Compare indicative currency exchange rates.",
}

export default async function RatesPage() {
  await connection()

  return <ConverterApp view="rates" />
}
