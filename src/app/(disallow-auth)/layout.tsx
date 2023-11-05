import { redirect } from 'next/navigation'

import { fethSelfServer } from '@/lib/api/auth.server'

export default async function LayoutDisallowAuth({ children }: { children: React.ReactNode }) {
  const user = await fethSelfServer()

  if (user) {
    redirect('/')
    return null
  }

  return <>{children}</>
}
