import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"
import type { ReactNode } from "react"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { siteMetadata } from "@/config/metadata"
import { cn } from "@/lib/utils"

type RootLayoutProps = Readonly<{ children: ReactNode }>

export const metadata = siteMetadata

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const amountFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-amount",
})

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        amountFont.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body className="m-0 min-h-screen overflow-x-hidden bg-background font-mono text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
