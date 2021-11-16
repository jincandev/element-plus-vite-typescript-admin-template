
export default {
    menuCollapse: (state: any) => state.menu.collapse,
    routes: (state: any) => state.permission.routes,
    userMessages: (state: any) => state.user.messages,
    token: (state: any) => state.user.token,
    roles: (state: any) => state.user.roles,
    cacheViews: (state: any) => state.route.cacheViews
}