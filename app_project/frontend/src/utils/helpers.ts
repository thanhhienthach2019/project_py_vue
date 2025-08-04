import type { GenericResponse } from '@/types/api'

export function unwrapResponse<T>(res: GenericResponse<T>): T {
  if (!res.success) throw new Error(res.message || 'Unknown error')
  if (res.data === undefined) throw new Error('Missing response data')
  return res.data
}
