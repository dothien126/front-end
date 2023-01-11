/// <reference types="vite/client" />

interface ImportMetaEnv {
  // more env variables...
  readonly VITE_SERVER_URL: string;
  readonly VITE_NAME_COOKIE: string;
  readonly VITE_NAME_ADMIN_COOKIE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
