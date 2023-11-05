import { ClientAuthProvider } from './AuthProvider.client'

import { fethSelfServer } from '@/lib/api/auth.server'

export async function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = await fethSelfServer()
  return <ClientAuthProvider user={user}>{children}</ClientAuthProvider>
}
