import { cookies } from 'next/headers'

import { fetchSelf } from './auth'
import { AUTH_TOKEN_COOKIE_NAME } from './auth.common'

export const getAuthToken = () => {
  const cookieJar = cookies()

  return cookieJar.get(AUTH_TOKEN_COOKIE_NAME)?.value ?? null
}

export const fethSelfServer = async () => {
  const token = getAuthToken()

  return fetchSelf(token)
}
