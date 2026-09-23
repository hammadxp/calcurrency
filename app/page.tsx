import { connection } from "next/server"
import { ConverterApp } from "./_components/converter-app"

export default async function Page() {
  await connection()

  return <ConverterApp view="convert" />
}
