import { constantRoutes, asyncRoutes } from "@/router";
import { RouteRecordRaw } from "vue-router";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles: string[], route: RouteRecordRaw) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => (<any>route.meta).roles.includes(role));
  } else {
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]) {
  const res: any = [];

  routes.forEach((route: RouteRecordRaw) => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

const state = () => ({
  routes: [],
  addRoutes: []
});

const getters = {};

const mutations = {
  SET_ROUTES(state: any, routes: any[]) {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  }
};

const actions = {
  generateRoutes(ctx: any, roles: string[]) {
    let accessedRoutes: RouteRecordRaw[];
    if (roles.includes("admin")) {
      accessedRoutes = asyncRoutes || [];
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
    }
    ctx.commit("SET_ROUTES", accessedRoutes);
    return accessedRoutes
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
