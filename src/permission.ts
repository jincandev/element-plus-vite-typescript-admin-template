import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style
import { RouteLocationNormalized } from 'vue-router'
import router from './router'
import store from './store'
import { getPageTitle } from './utils/common'

NProgress.configure({
    showSpinner: false
})

const whiteList = ["/login"]    //路由白名单

const checkRoles = (to: RouteLocationNormalized, roles: string[]): boolean => {
    if(!Array.isArray(roles) || !Array.isArray(to.meta?.roles)) {
        return false
    }
    return to.meta?.roles.find(role => roles.includes(role))
}

router.beforeResolve(async (to, form, next) => {
    // return true
    next()
})

router.beforeEach(async (to, from, next) => {
    // 测试
    const testuser = {roles: ["admin"]}
    const testaccessRoutes = await store.dispatch("permission/generateRoutes", testuser.roles)
    console.log("test access Routes:", testaccessRoutes)
    // 加载有权限访问的路由
    for(let route of testaccessRoutes) {
        router.addRoute(route)
    }
    return next()
    // 测试结束
    NProgress.start()
    // 设置页面标题
    document.title = getPageTitle(to.meta?.title as string)
    if(to.matched.length === 0) {
        // 没有命中路由，则跳转404
        next({path: "/404", query: {
            source: to.path
        }})
        return
    }
    const token = store.getters.token
    if(!token) {
        if(whiteList.includes(to.path)) {
            next()
            return
        }
        next(`/login?redirect=${to.path}`)
        return
    }
    if(to.path === "/login") {
        next({path: "/"})
        return
    }
    const roles = store.getters.roles
    if(checkRoles(to, roles)) {
        next()
        return
    }
    const user = await store.dispatch("user/info")
    const accessRoutes = await store.dispatch("permission/generateRoutes", user.roles)
    // 加载有权限访问的路由
    for(let route of accessRoutes) {
        router.addRoute(route)
    }
    //重新发执行一个路由,如果在此之前未执行next()并返回，则会进入死循环
    next({...to, replace: true})
})

router.afterEach(async (to, from, failure) => {
    //
    if(failure) {
        // console.log("Router After Each:", failure)
    } else {
        // 记录访问过的路径
        store.commit("route/ADD_CACHE_VIEW", to)
        //
    }
    NProgress.done()
})