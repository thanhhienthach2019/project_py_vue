export const SUPPORTED_LANGUAGES = ['en-US', 'vi-VN', 'zh-CN'] as const
export type SupportedLang = typeof SUPPORTED_LANGUAGES[number]

export const LANGUAGE_STORAGE_KEY = 'preferred_language'
