<template>
  <div id="menu-bar">
    <div id="parent-bar">
      <div class="head-icon" v-if="settings.sidebarLogo">
        <el-avatar shape="square" :size="35"></el-avatar>
      </div>
      <el-popover
        placement="right"
        v-for="menu in menus"
        :key="menu.name || menu.path"
        trigger="hover"
        :content="menu.meta && menu.meta.title || menu.name"
      >
        <template #reference>
          <div
            class="menu-icon"
            :class="{ active: activeHeadPath === menu.path }"
            @click="activeMenu(menu)"
          >
            <i :class="menu.meta.icon || 'el-icon el-icon-s-operation'"></i>
          </div>
        </template>
      </el-popover>
    </div>
    <div id="submenu-bar" :class="{ collapse: isCollapse }">
      <el-menu
        :default-active="activeSubPath"
        class="menu-bar"
        @open="handleOpen"
        @close="handleClose"
        :collapse="false"
        :router="true"
        :collapse-transition="true"
        background-color="#1f2d3d"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <menu-item
          v-for="route in submenus"
          :key="route.path || route.name"
          :route="route"
          :base-path="activeHeadPath"
        />
      </el-menu>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useStore } from "vuex"
import MenuItem from "./item.vue"
import settings from '@/settings'
const route = useRoute()
const router = useRouter()
const store = useStore();

const menus = computed(() => {
  return store.getters.routes.map((route) => {
    // 一层菜单提升
    if (route.children?.length === 1) {
      const child = route.children[0];
      const path = [route.path, child.path].join("/").replaceAll(/\/{2,}/g, "/");
      return {
        ...child,
        path,
        meta: {
          // 这里进行元数据合并
          ...route.meta,
          ...child.meta,
        },
      };
    }
    return route;
  }).filter(route => route.meta?.hidden !== true);
});

const prefix = route.path.split("/").slice(0, 2).join("/")
const activeHeadPath = ref(prefix)
const activeSubPath = ref(route.path)

const submenus = computed(() => {
  const menu = menus.value.find(m => m.path === activeHeadPath.value)
  return menu?.children || []
})
const isCollapse = computed(() => {
  if(!submenus.value.length) {
    return true
  }
  return store.getters.menuCollapse
});

watchEffect(() => {
  if(submenus.value.length === 0) {
    store.commit("menu/SWITCH_COLLAPSE", true)
  }
})

const activeMenu = (menu) => {
  activeHeadPath.value = menu.path;
  if(!menu.children?.length) {
    // 如果没有下级子菜单，则直播跳转
    const path = menu.redirect || menu.path
    router.push({ path })
    return
  }
  nextTick(() => {
    if(submenus.value.length) {
      store.commit("menu/SWITCH_COLLAPSE", false)
    }
  })
};

const handleOpen = () => {}
const handleClose = () => {}

</script>

<style lang="scss" scoped>
#menu-bar {
  display: flex;
  background: #304156;
  width: 100%;
  height: 100vh;
  #parent-bar {
    width: 50px;
    height: 100vh;
    .head-icon {
      position: relative;
      width: 100%;
      text-align: center;
      box-sizing: border-box;
      padding: 5px 0;
      cursor: pointer;
    }
    .menu-icon {
      display: inline-flex;
      width: 100%;
      justify-content: center;
      align-items: center;
      font-size: 35px;
      text-align: center;
      box-sizing: border-box;
      padding: 15px 0;
      cursor: pointer;
      color: #fff;
      background: transparent;
      transition: all 0.2s ease-in-out;
      &.active {
        background: #1f2d3d;
      }
    }
  }
  #submenu-bar {
    width: 150px;
    height: 100vh;
    background: #1f2d3d;
    box-sizing: border-box;
    border-right: 1px solid rgba(200, 200, 200, 0.5);
    overflow: hidden;
    transition: width 0.2s linear;
    &.collapse {
      width: 0;
    }
    .menu-bar {
      height: 100vh;
      box-sizing: border-box;
      &:not(.el-menu--collapse) {
        width: 150px;
        min-height: 400px;
      }
    }
  }
}
.el-icon {
  font-size: 18px;
}

</style>