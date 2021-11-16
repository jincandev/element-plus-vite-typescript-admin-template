import { AuthToken } from "@/utils/AuthToken"
import { ActionContext } from "vuex"

// 测试
// AuthToken.set("XXXXXX")

const state = () => ({
    info: null,
    messages: [],
    token: AuthToken.get() || null,
    roles: [],  //用户角色
})

const getters = {
}

const mutations = {
    SET_TOKEN(state: any, token: string) {
        if(!token) {
            return
        }
        state.token = token
        AuthToken.set(token)
    },
    SET_ROLES(state: any, roles: any[]) {
        // state.roles = roles
    }
}

const actions = {
    async login(ctx: ActionContext<any, any>) {},
    async logout(ctx: ActionContext<any, any>) {},
    async info(ctx: ActionContext<any, any>) {
        // 获取用户信息
        // 保存角色
        // ctx.commit("SET_ROLES", [])
        return {
            roles: ["admin"]
        }
    }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}