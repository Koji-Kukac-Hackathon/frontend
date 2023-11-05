'use client'

import { ReactNode } from 'react'

import { ReactQueryProvider } from './all/ReactQueryProvider'
import { ThemeProvider } from './all/ThemeProvider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ThemeProvider>
  )
}
