// src/types/vue-i18n.d.ts
import 'vue-i18n'

declare module 'vue-i18n' {
  export interface DefineLocaleMessage {
    [key: string]: string | DefineLocaleMessage
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: string, ...args: any[]) => string
    $d: (value: number | Date, ...args: any[]) => string
    $n: (value: number, ...args: any[]) => string
  }
}
