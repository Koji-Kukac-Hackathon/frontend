import { fetchApi } from '../api'

export type AuthUser = {
  name: string
  email: string
  role: string
}

export const fetchSelf = async (authToken: string | null) => {
  const headers: HeadersInit = {}

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  const response = await fetchApi<AuthUser>('/auth/user', {
    headers,
  })

  if (response?.status === 'success') {
    return response.data
  }

  return null
}
