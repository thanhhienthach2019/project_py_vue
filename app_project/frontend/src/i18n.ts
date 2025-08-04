import { createI18n } from 'vue-i18n'
import en from '@/locales/en-US.json'
import vi from '@/locales/vi-VN.json'
import zh from '@/locales/zh-CN.json'
import { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from '@/utils/i18n_types'
import type { SupportedLang } from '@/utils/i18n_types'

const messages = {
  'en-US': en,
  'vi-VN': vi,
  'zh-CN': zh,
}

const getInitialLocale = (): SupportedLang => {
  const lang = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (SUPPORTED_LANGUAGES.includes(lang as SupportedLang)) {
    return lang as SupportedLang
  }
  return 'en-US'
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getInitialLocale(),
  fallbackLocale: 'en-US',
  messages,
})

export { i18n }
export default i18n
