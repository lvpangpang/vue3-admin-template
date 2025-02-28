import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const moduleArr = ['admin', 'center']

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  function getProxyObj(arr) {
    const res = {}
    arr.forEach((item) => {
      res[`/${item}-module`] = {
        target: env.VITE_BASE_URL,
        changeOrigin: true,
      }
    })
    return res
  }

  return defineConfig({
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: getProxyObj(moduleArr),
    },
  })
}
