import Cookies from 'js-cookie'

const TokenKey = 'x-token'

export function getCookieToken() {
  return getCookie(TokenKey)
}
export function setCookieToken(token) {
  return setCookie(TokenKey, token, 1)
}
export function removeCookieToken() {
  return delCookie(TokenKey)
}
export const getCookie = (TokenKey: string) => {
  const value = Cookies.get(TokenKey)
  //FIXME 返回undefined被转换成string，导致boolean判断出错
  if (value && value != 'undefined') return value
  else return false
}

export const setCookie = (label: string, value: any, cookieExpires: any) => {
  Cookies.set(label, value, { expires: cookieExpires })
}

export const delCookie = (label: string) => {
  Cookies.remove(label)
}
