import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const moduleArr = ['admin', 'center', 'patrol']

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  function getProxyObj(arr) {
    const res = {}
    arr.forEach((item) => {
      res[`/${item}-module`] = {
        target: env.VITE_PROXY_TARGET,
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
      extensions: ['.js', '.json', '.vue'],
    },
    server: {
      proxy: getProxyObj(moduleArr),
    },
  })
}
