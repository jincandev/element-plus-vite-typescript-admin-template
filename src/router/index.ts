import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { Odometer } from "@element-plus/icons-vue"
import { markRaw } from 'vue'

import Layout from '@/layout/index.vue'

export const constantRoutes: RouteRecordRaw[] = [
    {   // 登录页面
        path: "/login",
        name: "login",
        meta: {
            hidden: true
        },
        component: () => import("~/login/login.vue")
    },
    {
        path: "/",
        redirect: "/Dashboard",
        component: Layout,
        meta: {
            // hidden: true
        },
        children: [
            {
                path: "Dashboard",
                name: "Dashboard",
                component: () => import("~/index/index.vue"),
                meta: {
                    title: "控制台",
                    affix: true,
                    icon: markRaw(Odometer)
                }
            }
        ]
    },
    {   // 用户中心页面
        path: "/user",
        redirect: "/user/info",
        component: Layout,
        meta: {
            hidden: true
        },
        children: [
            {
                path: 'info',
                name: "userCenter",
                meta: {
                    hidden: true,
                    title: "用户中心"
                },
                component: () => import("~/user/index.vue")
            }
        ]
    },
    {
        path: "/app",
        redirect: "/app/focus-pic",
        component: Layout,
        meta: {
            title: "App管理",
            icon: "iconfont icon-icon_bell",
            roles: ["admin"]
        },
        children: [
            {
                path: "focus-pic",
                name: "focusPic",
                component: () => import("~/index/table.vue"),
                meta: {
                    title: "App管理1"
                }
            },
            {
                path: "one-to-one",
                name: "One2One",
                component: () => import("~/user/index.vue"),
                meta: {
                    title: "App管理2"
                }
            }
        ]
    },
    {
        path: "/media",
        redirect: "/media/publish",
        component: Layout,
        meta: {
            title: "媒体发布",
            icon: "iconfont icon-cinema_icon"
        },
        children: [
            {
                path: "publish",
                name: "MediaPublish",
                component: () => import("~/user/index.vue"),
                meta: {
                    title: "发布视频"
                }
            },
            {
                path: "upload-audit",
                name: "MediaAudit",
                component: () => import("~/user/index.vue"),
                meta: {
                    title: "上传审核"
                }
            },
            {
                path: "live-audit",
                name: "LiveAudit",
                component: () => import("~/user/index.vue"),
                meta: {
                    title: "直播回放审核"
                }
            }
        ]
    },
    {
        path: "/audit",
        redirect: "/audit/order",
        component: Layout,
        meta: {
            title: "审核案例",
            icon: "iconfont icon-xitongguanli"
        },
        children: [
            {
                path: "order",
                name: "OrderAudit",
                component: () => import("~/user/index.vue"),
                meta: {
                    title: "审核案例1"
                }
            },
            {
                path: "settlement",
                name: "SettlementAudit",
                component: () => import("~/user/index.vue"),
                meta: {
                    title: "审核案例2"
                }
            }
        ]
    },
    {
        path: "/role",
        redirect: "/role/permissions",
        component: Layout,
        meta: {
            title: "角色管理",
            icon: "iconfont icon-icon_uers"
        },
        children: [
            {
                path: "permissions",
                name: "Permission",
                component: () => import("~/user/index.vue"),
                meta: {
                    title: "角色权限"
                },
                children: [
                    {
                        path: "permissions",
                        name: "Permission",
                        component: () => import("~/user/index.vue"),
                        meta: {
                            title: "角色权限"
                        }
                    },
                    {
                        path: "resourcea",
                        name: "Resourcesa",
                        component: () => import("~/user/index.vue"),
                        meta: {
                            title: "角色资源"
                        }
                    }
                ]
            },
            {
                path: "resource",
                name: "Resources",
                component: () => import("~/user/index.vue"),
                meta: {
                    title: "角色资源"
                }
            }
        ]
    },
    {   // 404页面
        path: "/404",
        meta: {
            hidden: true
        },
        component: () => import('@/common/404.vue')
    },
    {   // 兜底路由
        path: "/(?.*)",
        meta: {
            hidden: true
        },
        redirect: "/404"
    }
]

export const asyncRoutes: RouteRecordRaw[] = []

const router = createRouter({
    routes: constantRoutes,
    history: createWebHashHistory()
})

export default router