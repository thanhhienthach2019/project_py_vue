import enUS from '@/locales/en-US.json'
import viVN from '@/locales/vi-VN.json'
import zhCN from '@/locales/zh-CN.json'

export const messages = {
  'en-US': enUS,
  'vi-VN': viVN,
  'zh-CN': zhCN,
}
export type Locale = keyof typeof messages
