<template>
  <el-container class="main-container">
    <el-aside class="sidebar-container">
      <menu-bar v-if="menuBarType === 'single'" />
      <menu-bar-double v-if="menuBarType === 'double'" />
    </el-aside>
    <el-container>
      <el-header class="header-container">
        <main-header @fullscreen="handleFullScreen" />
      </el-header>
      <el-main class="body-container">
        <tag-views class="tag-views" />
        <app-main ref="appMain" />
      </el-main>
      <el-footer class="footer-container">
        Copy Right &copy; 陈金灿
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import AppMain from "./AppMain.vue";
import MenuBar from "./components/MenuBar/index.vue";
import MenuBarDouble from "./components/MenuBar-Double/index.vue";
import MainHeader from "./components/Header/index.vue";
import TagViews from "./components/TagViews/index.vue";
import settings from '@/settings'
import { computed, ref } from 'vue';
import screenfull from 'screenfull'
export default {
  components: {
    AppMain,
    MenuBar,
    MenuBarDouble,
    MainHeader,
    TagViews
  },
  setup() {
    const appMain = ref(null)
    const menuBarType = computed(() => settings.menubarStyle || "single")
    const handleFullScreen = () => {
      if(screenfull.isEnabled && appMain.value?.$el) {
        screenfull.request(appMain.value.$el)
      }
    }

    return {
      appMain,
      menuBarType,
      handleFullScreen
    }
  }
};
</script>

<style lang="scss" scoped>
.main-container {
  height: 100vh;
  .sidebar-container {
    width: auto !important;
    height: 100%;
    max-width: 200px;
    background: #304156;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      position: absolute;
      width: 0
    }
  }
  .header-container {
    position: relative;
    border-bottom: 1px solid rgba(200, 200, 200, 0.5);
    box-sizing: border-box;
    height: 40px !important;
  }

  .body-container {
    padding: 0;
    .tag-views {
        box-sizing: border-box;
        border-bottom: 1px solid rgba(200, 200, 200, 0.5);
    }
  }

  .footer-container {
    background: rgba(240, 240, 240, 0.75);
    height: 20px !important;
    // box-shadow: 0 -2px 3px rgba(240, 240, 240, 0.5);
    box-sizing: border-box;
    line-height: 20px;
    color: rgba(220, 220, 220, 0.5);
    text-align: center;
    font-size: 14px;
  }
}
</style>