<template>
  <el-menu-item
    class="submenu"
    v-if="!routeChildren && !meta.hidden"
    :index="resolvePath(menu.path)"
  >
    <i v-if="typeof meta.icon === 'string'" :class="meta.icon"></i>
    <el-icon v-else-if="meta.icon" :size="14"
      ><component :is="meta.icon"
    /></el-icon>
    <span>{{ meta.title || route.name }}</span>
  </el-menu-item>
  <el-sub-menu
    class="submenu"
    v-else-if="!meta.hidden"
    :index="resolvePath(route.path)"
  >
    <template #title>
      <i v-if="typeof meta.icon === 'string'" :class="meta.icon"></i>
      <el-icon v-else-if="meta.icon" :size="14"
        ><component :is="meta.icon"
      /></el-icon>
      <span>{{ meta.title || menu.name }}</span>
    </template>
    <!-- 这里使用循环引用 -->
    <item
      v-for="child in routeChildren"
      :key="child.path || child.name"
      :route="child"
      :base-path="resolvePath(route.path)"
    />
  </el-sub-menu>
</template>

<script>
import { computed } from "vue";

const loadRoutes = (routes) => {
  return routes
    .filter((route) => {
      return !route.meta?.hidden;
    })
    .map((route) => {
      route = { ...route };
      if (Array.isArray(route.children)) {
        route.children = loadRoutes(route.children);
        if (route.children.length === 1) {
          // 一层菜单提升
          const child = route.children[0];
          const path = [route.path, child.path]
            .join("/")
            .replaceAll(/\//g, "/");
          return {
            ...child,
            path,
            meta: {
              ...route.meta,
              ...child.meta,
            },
          };
        }
      }
      route.meta = route.meta || {};
      return route;
    });
};
export default {
  name: "Item",
  props: ["route", "basePath"],
  setup(props) {
    const meta = computed(() => {
      return props.route.meta || {};
    });

    const routeChildren = computed(() => {
      if (!props.route.children?.length) {
        return;
      }
      return loadRoutes(props.route.children);
    });

    const menu = computed(() => {
      const children = (props.route.children || []).map((route) => {
        const ch = route.children || [];
        const meta = route.meta || {};
        return {
          ...route,
          children: ch,
          meta,
        };
      });
      if (children.length == 1) {
        return children[0];
      }
      const meta = props.route.meta || {};
      return {
        ...props.route,
        meta,
        children,
      };
    });

    const resolvePath = (subpath) => {
      return [props.basePath || "/", subpath]
        .join("/")
        .replaceAll(/\/{2,}/g, "/");
    };

    return {
      meta,
      routeChildren,
      resolvePath,
      menu,
    };
  },
};
</script>

<style lang="scss" scoped>
.submenu {
  background: #1f2d3d !important;
  &:hover {
    background: #001528 !important;
  }
}
</style>