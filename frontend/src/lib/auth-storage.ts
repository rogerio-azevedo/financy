const KEY = 'financy:token'

export function getToken() {
  return localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY)
}

export function setToken(token: string, remember: boolean) {
  clearToken()
  const store = remember ? localStorage : sessionStorage
  store.setItem(KEY, token)
}

export function clearToken() {
  localStorage.removeItem(KEY)
  sessionStorage.removeItem(KEY)
}
