import { defineConfig, mergeConfig, UserConfig, UserConfigExport } from 'vite'

import baseConfig from './build/vite.config.base'
import prodConfig from './build/vite.config.prod'
import devConfig from './build/vite.config.dev'

let config: UserConfig | UserConfigExport = defineConfig(({mode, command}) => {
  if(mode === "development") {
    return mergeConfig(baseConfig, devConfig)
  }
  return mergeConfig(baseConfig, prodConfig)
})
export default config


