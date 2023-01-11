import { defineStore } from 'pinia';

export const useDarkModeStore = defineStore('darkMode', {
  state: () => ({
    darkModeValue: localStorage.getItem('darkMode') === 'true',
  }),
  getters: {
    darkMode(state) {
      if (localStorage.getItem('darkMode') === null) {
        // TigerBui - Cài đặt mặc định giao diện dark-mode end User lần đầu tiên vào
        localStorage.setItem('darkMode', true);
        state.darkModeValue = true;
      }
      return state.darkModeValue;
    },
  },
  actions: {
    setDarkMode(darkMode) {
      localStorage.setItem('darkMode', darkMode);
      this.darkModeValue = darkMode;
    },
  },
});
