import { defineStore } from 'pinia';

export const useSideMenuStore = defineStore('sideMenu', {
  state: () => ({
    menu: [
      {
        icon: 'InboxIcon',
        pageName: 'side-menu-mail-box',
        title: 'Mail Box',
      },
    ],
  }),
});
