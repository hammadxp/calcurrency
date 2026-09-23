import type { Metadata } from "next"
import { connection } from "next/server"

import { ConverterApp } from "../_components/converter-app"

export const metadata: Metadata = {
  title: "Exchange rates | calcurrency",
  description: "Compare indicative currency exchange rates.",
}

export default async function RatesPage() {
  await connection()

  return <ConverterApp view="rates" />
}
