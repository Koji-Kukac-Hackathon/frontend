'use client'

import { createContext, useContext, useState } from 'react'

import { AuthUser } from '@/lib/api/types'

const AuthProviderContext = createContext(
  null as null | {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
  }
)

export function ClientAuthProvider({ children, user }: { children: React.ReactNode; user: AuthUser | null }) {
  const [data, setData] = useState(user)

  return (
    <AuthProviderContext.Provider
      value={{
        user: data,
        setUser: setData,
      }}
    >
      {children}
    </AuthProviderContext.Provider>
  )
}

export const useAuthState = () => {
  return useContext(AuthProviderContext)!.user
}

export const useSetAuthState = () => {
  const setUser = useContext(AuthProviderContext)!.setUser

  return setUser
}
