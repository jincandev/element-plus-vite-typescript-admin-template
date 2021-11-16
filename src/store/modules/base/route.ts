import { ActionContext } from 'vuex'

const state = () => ({
    cacheViews: []
})

const getters = {}

const mutations = {
    ADD_AFFIX_VIEW(state: any, views: any[] = []) {
        state.cacheViews = views.filter(view => {
            return !state.cacheViews.find((v: any) => v.path === view.path)
        }).concat(state.cacheViews)
    },
    ADD_CACHE_VIEW(state: any, route: any) {
        if(route?.meta?.affix === true || route?.meta?.hidden === true) {
            return
        }
        const found = state.cacheViews.find((view: any) => view.path === route.path)
        if(found || (!route.name && !route.meta.title)) {
            return
        }
        state.cacheViews.push({
            title: route.meta?.title || route.name,
            name: route.name,
            path: route.path
        })
    },
    DEL_CACHE_VIEW(state: any, index: number) {
      if(isNaN(index) || index < 0) {
        state.cacheViews = state.cacheViews.filter((item: any) => {
            return !item.closable && item.closable !== undefined
        })
        return
      }
      state.cacheViews =  state.cacheViews.filter((item: any, idx: number) => {
          return idx !== index || item.closable === false
      })
    },
    DEL_CACHE_VIEW_OTHERS(state: any, index: number) {
        state.cacheViews = state.cacheViews.filter((item: any, idx: number) => {
            return idx === index || item.closable === false
        })
    },
    DEL_CACHE_VIEW_LEFT(state: any, index: number) {
        state.cacheViews = state.cacheViews.filter((item: any, idx: number) => {
            return idx >= index || item.closable === false
        })
    },
    DEL_CACHE_VIEW_RIGHT(state: any, index: number) {
        state.cacheViews = state.cacheViews.filter((item: any, idx: number) => {
            return idx <= index || item.closable === false
        })
    }
}

const actions = {
    async index(ctx: ActionContext<any, any>) {}
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}