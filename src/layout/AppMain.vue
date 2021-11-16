<template>
  <router-view v-slot="{Component, route}">
    <transition :name="route.meta.transition || 'fade'" mode="out-in">
      <keep-alive>
        <div class="app-main"><!-- 要让transition生效，这里必须确保为单一组件 -->
          <component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
        </div>
      </keep-alive>
    </transition>
  </router-view>
</template>
<script>
export default {
};
</script>

<style lang="scss" scoped>
.app-main {
  background: #ffffff;
}
</style>