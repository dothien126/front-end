import { defineStore } from 'pinia';

export const useSimpleMenuStore = defineStore('simpleMenu', {
  state: () => ({
    menu: [
      {
        icon: 'InboxIcon',
        pageName: 'simple-menu-mail-box',
        title: 'Mail Box',
      },
    ],
  }),
});
