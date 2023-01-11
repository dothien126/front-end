declare module '@left4code/tw-starter/dist/js/dom';
declare module 'feather-icons';
declare module 'tabulator-tables';
declare module 'toastify-js';
declare module '@vuelidate/validators';
declare module '@vuelidate/core';
declare module 'dropzone';
declare module 'crypto-js';
declare module 'vue3-tags-input';

declare global {
  declare type Recordable<T = any> = Record<string, T>;

  declare interface ViteEnv {
    VITE_PORT: number;
    VITE_PUBLIC_PATH: string;
    VITE_GLOB_APP_TITLE: string;
    VITE_DROP_CONSOLE: boolean;
  }
}
