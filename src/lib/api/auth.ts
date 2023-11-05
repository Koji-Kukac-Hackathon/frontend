import { getAuthToken } from './auth.client'
import { AuthUser } from './types'
import { fetchApi } from '../api'
import { isClient } from '../utils'

export const fetchSelf = async (authToken: string | null) => {
  if (!authToken && isClient()) {
    authToken = getAuthToken()
  }

  const response = await fetchApi<AuthUser>('/auth/user', {
    authToken,
  })

  if (response?.status === 'success') {
    return response.data
  }

  return null
}
