import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    themeClass: localStorage.getItem('theme') || 'light-theme',
  }),
  getters: {
    getTheme: (state) => state.themeClass,
  },
  actions: {
    toggleTheme() {
      this.themeClass = this.themeClass === 'light-theme' ? 'dark-theme' : 'light-theme'
      localStorage.setItem('theme', this.themeClass)
    },
  },
})
