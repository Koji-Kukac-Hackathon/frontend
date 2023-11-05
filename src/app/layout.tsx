import type { Metadata } from 'next'

import './globals.css'
import { AuthProvider } from '@/components/providers/all/AuthProvider'
import { Providers } from '@/components/providers/Providers'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'ZGrabi mjesto',
  description: 'Pronađi svoje parkirno mjesto',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className=" bg-gray-100 dark:bg-gray-900">
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
