import enUS from './en-US.json'
import viVN from './vi-VN.json'
import zhCN from './zh-CN.json'

export const messages = {
  'en-US': enUS,
  'vi-VN': viVN,
  'zh-CN': zhCN,
}
export type Locale = keyof typeof messages
