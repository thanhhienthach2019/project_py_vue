// src/store/logStore.ts
import { defineStore } from 'pinia'

export interface LogEntry {
  storeId: string
  type: string     
  payload: any     
  timestamp: number 
}

export const useLogStore = defineStore('log', {
  state: () => ({
    logs: [] as LogEntry[]
  }),
  actions: {
    add(entry: Omit<LogEntry, 'timestamp'>) {
      this.logs.unshift({ ...entry, timestamp: Date.now() })
      if (this.logs.length > 100) this.logs.pop()
    }
  }
})
