import config from '../config/env.dev'
import { UserConfig } from 'vite'

const dev_config: UserConfig = {
    mode: "development",
    server: {
        host: config.host || "0.0.0.0",
        port: config.port || 3000,
        open: !!config.open,
        proxy: (config.proxy || {}) as any,
        cors: config.cors || {},
    }
}

export default dev_config;