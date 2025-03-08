import type React from "react"
import type { Metadata } from "next"
import { Inter, Bubblegum_Sans } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const bubblegum = Bubblegum_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bubblegum",
})

export const metadata: Metadata = {
  title: "EmotiPlay - Learn Emotions Through Play!",
  description: "A fun adventure to understand feelings and make new friends!",
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#8A4FFF" />
      </head>
      <body className={`${inter.variable} ${bubblegum.variable} font-sans min-h-screen flex flex-col`}>
        
        <main className="flex-grow">{children}</main>
        
      </body>
    </html>
  )
}



import './globals.css'