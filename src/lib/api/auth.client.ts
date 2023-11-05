import { AUTH_TOKEN_COOKIE_NAME } from './auth.common'

const AUTH_TOKEN_REGEX = RegExp(`${AUTH_TOKEN_COOKIE_NAME}=([^;]+)`)

export const getAuthToken = () => {
  const cookiesMatch = AUTH_TOKEN_REGEX.exec(document.cookie)

  if (!cookiesMatch) {
    return null
  }

  const cookieValRaw = cookiesMatch.at(1)

  if (!cookieValRaw) {
    return null
  }

  return decodeURIComponent(cookieValRaw)
}
