<template>
  <el-image v-if="settings.sidebarLogo" fit="fill" class="logo" :src="Logo"/>
  <el-menu
    :default-active="activePath"
    class="menu-bar"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
    :router="true"
    :collapse-transition="true"
    background-color="#304156"
    text-color="#bfcbd9"
    active-text-color="#409EFF"
  >
    <menu-item v-for="route in routes" :key="route.path || route.name" :route="route" />
  </el-menu>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import MenuItem from "./item.vue";
import Logo from "@/assets/logo.png"
import settings from '@/settings'

const store = useStore();
const isCollapse = computed(() => store.getters.menuCollapse);
const handleClose = () => {};
const handleOpen = () => {};

const route = useRoute();
const activePath = computed(() => route.path);

const routes = computed(() => {
  return store.getters.routes.map((route) => {
    // 一层菜单提升
    if (route.children?.length === 1) {
      const child = route.children[0];
      const path = [route.path, child.path].join("/").replaceAll(/\//g, "/");
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
  });
});
</script>

<style lang="scss" scoped>
.logo {
  width: 100%;
  max-height: 100px;
  overflow: hidden;
}
.menu-bar {
  height: 100vh;
  overflow-x: hidden;
  &:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
}
</style>