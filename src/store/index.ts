import { createStore } from 'vuex'
import getters from './getters'

// 加载modules
const modules = import.meta.globEager("./modules/**/*.ts")
const storeOptions: any = Reflect.ownKeys(modules).reduce((lo, key) => {
    key = key as string
    let item = modules[key]
    if(item.default) {
        item = item.default
    }
    if(!item.namespaced) {
        lo.mutations = {
            ...lo.mutations,
            ...item.mutations
        }
        lo.actions = {
            ...lo.actions,
            ...item.actions
        }
        lo.getters = {
            ...lo.getters,
            ...item.getters
        }
        if(typeof item.state === "function") {
            let _state = lo.state
            lo.state = () => {
                return {
                    ..._state(),
                    ...item.state()
                }
            }
        } else if(item.state) {
            let _state = lo.state
            lo.state = () => {
                return {
                    ..._state(),
                    ...item.state
                }
            }
        }
    } else {
        const name = key.slice(key.lastIndexOf("/") + 1, key.lastIndexOf("."));
        (<any>lo.modules)[name] = item
    }
    return lo
}, {
    strict: process.env.NODE_ENV !== "production",
    modules: {},
    state: () => ({}),
    mutations: {},
    actions: {},
    getters
})

// 加载插件
let pluginsModules: any = import.meta.globEager("./plugins/*.ts")
storeOptions.plugins = Reflect.ownKeys(pluginsModules).map(pluginKey => {
    const plugin = pluginsModules[pluginKey]
    if(typeof plugin?.create === 'function') {
        return plugin.create()
    }
    return plugin
})

const store = createStore(storeOptions)

export default store