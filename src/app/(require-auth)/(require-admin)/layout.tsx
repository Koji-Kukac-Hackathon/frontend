import { notFound } from 'next/navigation'

import { fethSelfServer } from '@/lib/api/auth.server'

export default async function LayoutRequireAdmin({ children }: { children: React.ReactNode }) {
  const user = await fethSelfServer()

  if (user?.role !== 'admin') {
    notFound()
    return null
  }

  return <>{children}</>
}
