'use client'

import { ReactNode } from 'react'

import { ThemeProvider } from './all/ThemeProvider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}
