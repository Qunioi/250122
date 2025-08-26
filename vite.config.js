import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = mode === 'development' ? '/' : `/${env.VITE_VERSION}/`

  return {
    base,
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: true, // 自動生成類型定義
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: Number(env.VITE_PORT) || 3001,
      host: true, // 只在 dev 模式暴露網路 IP
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api'],
          // 這裡直接注入 .env 的值為 Sass 全域變數
          additionalData: `
            $themeColor: "${env.VITE_THEME_COLOR}";
            $lang: "${env.VITE_LANG}";
          `,
        },
      },
    },
  }
})
