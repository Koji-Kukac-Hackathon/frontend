import { z } from 'zod'

import { getAuthToken } from './api/auth.client'
import { isClient } from './utils'

export type ApiResponse<TData> =
  | {
      status: 'error'
      message: string
    }
  | {
      status: 'success'
      message: string
      data: TData
    }

export const apiUrl = (path: `/${string}`) => {
  return `${process.env.NEXT_PUBLIC_API_BASE}${path}`
}

const apiResponseValidator = z.union([
  z.object({
    status: z.literal('success'),
    message: z.string(),
    data: z.unknown(),
  }),
  z.object({
    status: z.literal('error'),
    message: z.string(),
  }),
])

const addHeader = (headers: HeadersInit, name: string, value: string) => {
  if (Array.isArray(headers)) {
    headers.push([name, value])
    return
  }

  if (headers instanceof Headers) {
    headers.append(name, value)
    return
  }

  headers[name] = value
}

export const fetchApiRaw = async <TData>(
  path: `/${string}`,
  options?: RequestInit & {
    authToken?: string | null
  }
) => {
  const headers = options?.headers ?? {}
  let authToken = options?.authToken
  if (!authToken && isClient()) {
    authToken = getAuthToken()
  }

  if (authToken) {
    addHeader(headers, 'Authorization', `Bearer ${authToken}`)
  }

  return fetch(apiUrl(path), {
    referrerPolicy: 'unsafe-url',
    ...options,
    headers,
  })
    .then(res => res.json() as Promise<TData>)
    .catch(e => {
      console.error(e)

      return null
    })
}

export const fetchApi = async <TData>(
  path: `/${string}`,
  options?: RequestInit & {
    authToken?: string | null
  }
) => {
  return fetchApiRaw(path, options)
    .then(res => apiResponseValidator.safeParseAsync(res))
    .then(res => {
      if (!res.success) {
        throw new Error(res.error.message)
      }

      return res.data as ApiResponse<TData>
    })
    .catch(e => {
      console.error(e)

      return null
    })
}
