/*
 * @Date: 2024-06-07 14:17:38
 */
import { resolve } from 'path'
import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'
import { createVitePlugins } from './build/vite'
import { exclude, include } from "./build/vite/optimize"
import qiankun from 'vite-plugin-qiankun'
// 当前执行node命令时文件夹的地址(工作目录)
const root = process.cwd()

const microAppName = 'hrAdmin'

// 路径查找
function pathResolve(dir: string) {
  return resolve(root, '.', dir)
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  let env = {} as any
  const isBuild = command === 'build'
  if (!isBuild) {
    env = loadEnv((process.argv[3] === '--mode' ? process.argv[4] : process.argv[3]), root)
  } else {
    env = loadEnv(mode, root)
  }

  return {
    base: env.VITE_BASE_PATH,
    root: root,
    // 服务端渲染
    server: {
      port: env.VITE_PORT, // 端口号
      host: "0.0.0.0",
      open: true,
      // 本地跨域代理. 目前注释的原因：暂时没有用途，server 端已经支持跨域
      proxy: {
        '/dev-api': {
          target: env.VITE_BASE_URL,
          ws: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^/dev-api`), ''),
        },
        '/workflow-api': {
          target: env.VITE_WORK_VITE_BASE_URL,
          changeOrigin: true,
          ws: false,
          secure: false,
          rewrite: (path) => path.replace(/^\/workflow-api/, '')
        }
      },
      hmr: {
        overlay: false, // 禁用HMR覆盖层
      },
    },

    // 项目使用的vite插件。 单独提取到build/vite/plugin中管理
    plugins: [
      ...createVitePlugins(),
      qiankun(microAppName, {
        useDevMode: !isBuild
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "./src/styles/variables.scss" as *;',
          javascriptEnabled: true,
          silenceDeprecations: ["legacy-js-api"],
        }
      }
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'],
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js'
        },
        {
          find: /\@\//,
          replacement: `${pathResolve('src')}/`
        },
        {
          find: /\~\//,
          replacement: `${pathResolve('src/components/common')}/`
        }
      ]
    },
    build: {
      minify: 'terser',
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      // brotliSize: false,
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
          drop_console: env.VITE_DROP_CONSOLE === 'true'
        }
      },
      rollupOptions: {
        external: [],
        output: {
          compact: true
          // manualChunks(id) {
          //   if (!id.includes('node_modules')) return;
          //   const libName = id.split('node_modules/')[1]?.split('/')[0];
          //   if (!libName) return;
          //   const vendorGroups = {
          //     vue: ['@vue', 'vue', 'vue-router'],
          //     element: ['element-plus', '@element-plus'],
          //     nature: ['@naturefw'],
          //     popper: ['@popperjs']
          //   };
          //   for (const [group, libs] of Object.entries(vendorGroups)) {
          //     if (libs.includes(libName)) return `_${group}`;
          //   }
          //   return `_vendor-${libName.charAt(0)}`;
          // },
          // chunkFileNames: 'static/js/[name].js',
          // entryFileNames: 'static/js/[name]-[hash].js',
          // assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    optimizeDeps: { include, exclude }
  }
}
