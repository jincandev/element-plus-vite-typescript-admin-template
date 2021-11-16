import path from "path";
import vue from "@vitejs/plugin-vue";
import legacy from "@vitejs/plugin-legacy";

import packageJson from "../package.json";
import { UserConfig } from "vite";
const internalDeps = Reflect.ownKeys(packageJson.dependencies) as string[];

const modules = internalDeps.reduce((lo, dkey) => {
  lo[dkey] = [dkey]
  return lo
}, {})

// https://vitejs.dev/config/
const config: UserConfig = {
  root: process.cwd(),
  mode: process.env.NODE_ENV,
  optimizeDeps: {
    include: internalDeps,
  },
  define: {
    // setting vue-i18-next
    // Suppress warning
    __VUE_I18N_LEGACY_API__: false,
    __VUE_I18N_FULL_INSTALL__: false,
    __INTLIFY_PROD_DEVTOOLS__: false
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "..", "src"),
      "~": path.resolve(__dirname, "..", "src", 'views'),
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
    }
  },
  plugins: [
    vue(),
    legacy({
      targets: ["defaults", "not IE 11"],
      renderLegacyChunks: false,  // 如果使用esbuild且不是ssr，这里必须为false
    })
  ],
  build: {
    rollupOptions: {
      output: {
        // manualChunks: modules  //按模块进行分离js
      }
    }
  }
}

export default config;
