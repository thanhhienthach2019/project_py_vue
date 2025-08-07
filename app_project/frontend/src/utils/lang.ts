import i18n from '@/i18n'
import { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from '@/utils/i18n_types'
import type { SupportedLang } from '@/utils/i18n_types'

const DEFAULT_LANGUAGE: SupportedLang = 'en-US'

export function setPreferredLanguage(lang?: string | null): SupportedLang {
  const validLang = (lang && SUPPORTED_LANGUAGES.includes(lang as SupportedLang))
    ? (lang as SupportedLang)
    : DEFAULT_LANGUAGE

  i18n.global.locale.value = validLang
  localStorage.setItem(LANGUAGE_STORAGE_KEY, validLang)
  return validLang
}

export function loadPreferredLanguage(): SupportedLang {
  const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return setPreferredLanguage(storedLang)
}

export function resetPreferredLanguage(): void {
  localStorage.removeItem(LANGUAGE_STORAGE_KEY)
  i18n.global.locale.value = DEFAULT_LANGUAGE
}
