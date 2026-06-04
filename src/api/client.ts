import axios, { AxiosError } from 'axios'
import type { AuthTokens } from '../types'

export const api = axios.create({
  baseURL: 'http://localhost:8080',
})

const getAccessToken = () => localStorage.getItem('accessToken')
const getRefreshToken = () => localStorage.getItem('refreshToken')

export const setTokens = (tokens: AuthTokens) => {
  localStorage.setItem('accessToken', tokens.accessToken)
  localStorage.setItem('refreshToken', tokens.refreshToken)
}

export const clearTokens = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status === 401 && !original?._retry) {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          original!.headers!.Authorization = `Bearer ${token}`
          return api(original!)
        })
      }

      original!._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post<AuthTokens>('http://localhost:8080/auth/refresh', {
          refreshToken,
        })
        setTokens(data)
        processQueue(null, data.accessToken)
        original!.headers!.Authorization = `Bearer ${data.accessToken}`
        return api(original!)
      } catch (err) {
        processQueue(err, null)
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
