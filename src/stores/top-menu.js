import { defineStore } from 'pinia';

export const useTopMenuStore = defineStore('topMenu', {
  state: () => ({
    menu: [
      {
        icon: 'InboxIcon',
        pageName: 'top-menu-mail-box',
        title: 'Mail Box',
      },
    ],
  }),
});
