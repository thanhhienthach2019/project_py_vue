import { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from '@/utils/i18n_types'
import type { SupportedLang } from '@/utils/i18n_types'
import i18n from '@/i18n'

export function setPreferredLanguage(lang?: string | null): SupportedLang | null {
  if (lang && SUPPORTED_LANGUAGES.includes(lang as SupportedLang)) {
    const validLang = lang as SupportedLang
    i18n.global.locale.value = validLang
    localStorage.setItem(LANGUAGE_STORAGE_KEY, validLang)
    return validLang
  }
  return null
}

export function loadPreferredLanguage(): SupportedLang | null {
  const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return setPreferredLanguage(storedLang)
}
