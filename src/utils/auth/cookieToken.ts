import Cookies from 'js-cookie'

const TokenKey = 'x-token'

export function getCookieToken() {
  const value = Cookies.get(TokenKey)
  if (value) return value
  else return ''
}

export function setCookieToken(token) {
  return Cookies.set(TokenKey, token, { expires: 1 })
}

export function removeCookieToken() {
  return Cookies.remove(TokenKey)
}
