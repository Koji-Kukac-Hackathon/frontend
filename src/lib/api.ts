import { z } from 'zod'

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

export const fetchApi = async <TData>(path: `/${string}`, options?: RequestInit) => {
  return fetch(apiUrl(path), {
    referrerPolicy: 'unsafe-url',
    ...options,
  })
    .then(res => res.json())
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
