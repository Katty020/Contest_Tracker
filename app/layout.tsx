import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'contest_tracker',
  description: 'Created by Aryan',
  generator: 'contest_tracker',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
