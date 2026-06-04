import { useEffect, useState } from 'react'
import axios from 'axios'

type Status = 'checking' | 'online' | 'offline'

const API_URL = import.meta.env.VITE_API_URL

export function useBackendStatus(intervalMs = 30_000) {
  const [status, setStatus] = useState<Status>('checking')

  const check = async () => {
    try {
      // Cualquier respuesta HTTP (incluso 401/404) significa que el servidor está up
      await axios.get(`${API_URL}/actuator/health`, { timeout: 4000 })
      setStatus('online')
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        // Hay respuesta del servidor → está up
        setStatus('online')
      } else {
        setStatus('offline')
      }
    }
  }

  useEffect(() => {
    check()
    const id = setInterval(check, intervalMs)
    return () => clearInterval(id)
  }, [])

  return status
}
