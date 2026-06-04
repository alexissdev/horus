import type { AxiosError } from 'axios'
import type { ApiError } from '../types'

export const getErrorMessage = (err: unknown): string => {
  const axiosErr = err as AxiosError<ApiError>
  if (axiosErr?.response?.data?.errors?.length) {
    return axiosErr.response.data.errors.join(', ')
  }
  if (axiosErr?.response?.data?.message) {
    return axiosErr.response.data.message
  }
  return 'Ocurrió un error inesperado'
}
