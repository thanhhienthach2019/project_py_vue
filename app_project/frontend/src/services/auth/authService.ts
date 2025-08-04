import { apiClient, refreshClient } from "@/utils/apiClient"
import type { SupportedLang } from '@/utils/i18n_types'
import type { GenericResponse } from '@/types/api'

export const loginApi = async (
  username: string,
  password: string
): Promise<GenericResponse<{}>> => {
  const res = await apiClient.post('/auth/login', { username, password })
  return res.data
}

export const logoutApi = async (): Promise<GenericResponse<null>> => {
  const res = await apiClient.post('/auth/logout')
  return res.data
}

export const getProfileApi = async (): Promise<GenericResponse<any>> => {
  const res = await apiClient.get('/auth/check-auth')
  return res.data
}

export const refreshTokenApi = async (): Promise<GenericResponse<null>> => {
  const res = await refreshClient.post('/auth/refresh-token')
  return res.data
}

export const setPreferredLanguageApi = async (
  lang: SupportedLang
): Promise<GenericResponse<{}>> => {
  const res = await apiClient.put('/auth/set-language', { lang })
  return res.data
}
