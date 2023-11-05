import { redirect } from 'next/navigation'

import { fethSelfServer } from '@/lib/api/auth.server'

export default async function RequireAuthLayout({ children }: { children: React.ReactNode }) {
  const user = await fethSelfServer()

  if (!user) {
    redirect('/login')
    return null
  }

  return <>{children}</>
}
