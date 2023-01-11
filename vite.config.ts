import type { UserConfig, ConfigEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { loadEnv } from 'vite';
import { wrapperEnv } from './src/utils/ReadFileEnv';
import * as path from 'path';

export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  const env = loadEnv(mode, root);

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env);

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_DROP_CONSOLE } = viteEnv;

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      https: false,
      // Listening on all local IPs
      host: true,
      port: VITE_PORT,
      //disable warning socket
      strictPort: true,
      hmr: {clientPort: VITE_PORT}
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
    },

    // The vite plugin used by the project. The quantity is large, so it is separately extracted and managed
    plugins: [vue(), viteEnv],
  };
};
