<template>
  <div class="tag-view-container" v-if="showTagView">
    <div class="icon-arrow el-icon-caret-left">
      <el-icon @click="scroll(-1)"><caret-left /></el-icon>
    </div>
    <!-- <i class="icon-arrow el-icon-caret-left" @click="scroll(-1)"></i> -->
    <el-scrollbar
      class="tag-views-scrollbar"
      @wheel.prevent="handleScroll"
      ref="scrollbar"
    >
      <transition-group name="view-list" tag="div" class="flex-content">
        <el-tag
          class="view-tag"
          @click="goPage(view, index)"
          @close="closeView(view, index)"
          v-for="(view, index) in views"
          :key="view.path"
          :type="(curPath === view.path && 'success') || 'info'"
          size="medium"
          :closable="view.closable"
          >{{ view.title }}</el-tag
        >
      </transition-group>
    </el-scrollbar>
    <div class="icon-arrow el-icon-caret-right">
      <el-icon @click="scroll(1)"><caret-right /></el-icon>
    </div>
    <el-dropdown class="tag-operate" @command="handleCommand">
      <span class="el-dropdown-link">
        <el-icon><arrow-down-bold /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="close-others">
            <el-icon><close /></el-icon>关闭其他
          </el-dropdown-item>
          <el-dropdown-item command="close-left">
            <el-icon><back /></el-icon>关闭左侧
          </el-dropdown-item>
          <el-dropdown-item command="close-right">
            <el-icon><right /></el-icon>关闭右侧
          </el-dropdown-item>
          <el-dropdown-item command="close-all">
            <el-icon><delete /></el-icon>关闭所有
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { computed, onMounted, nextTick, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import {
  CaretLeft,
  CaretRight,
  ArrowDownBold,
  Close, Back, Right, Delete
} from "@element-plus/icons-vue";

import settings from "@/settings";

const scrollbar = ref(null);

const store = useStore();
const route = useRoute();
const router = useRouter();
const allRoutes = router.getRoutes();

const curPath = computed(() => {
  nextTick(() => {
    goPage(
      null,
      views.value.findIndex((item) => item.path === route.path)
    );
  });
  return route.path;
});

const affixRoutes = computed(() =>
  allRoutes
    .filter((route) => route.meta?.affix === true && !route.redirect)
    .map((found) => {
      return {
        title: found.meta?.title || found.name,
        name: found.name,
        path: found.path,
        closable: false,
      };
    })
);

const transformView = (view) => {
  const found = allRoutes.find((r) => {
    return r.path === view.path && !r.redirect && !r.meta?.affix;
  });
  if (!found) {
    return view;
  }
  return {
    ...view,
    closable: found.meta?.affix !== false,
  };
};

const views = computed(() => store.getters.cacheViews.map(transformView));
const showTagView = computed(() => {
  return settings.cacheViews && views.value.length;
});

onMounted(() => {
  store.commit("route/ADD_AFFIX_VIEW", affixRoutes.value);
});

const goPage = (view, index) => {
  const containerWidth = scrollbar.value.wrap$.offsetWidth;
  const target =
    scrollbar.value.wrap$.querySelectorAll(".view-tag")[index] || {};
  const toLeft = (target.offsetLeft || 0) - containerWidth / 2;
  const dir = toLeft - scrollbar.value.wrap$.scrollLeft;
  if (dir === 0) {
    return;
  }
  scrollToLeftAnimate(scrollbar.value.wrap$, dir);
  if (view?.path) {
    router.push({
      path: view.path,
    });
  }
};

function goLastPage() {
  if (views.value.length === 0) {
    if (route.path !== "/") {
      router.push({ path: "/" });
    }
    return;
  }
  const path = views.value[views.value.length - 1].path;
  if (path !== route.path) {
    router.push({ path });
  }
}

const closeView = (view, index) => {
  store.commit("route/DEL_CACHE_VIEW", index);
  goLastPage();
};
const handleCommand = (cmd) => {
  if (cmd === "close-others") {
    const index = views.value.findIndex((item) => item.path === route.path);
    if (index < 0) {
      return;
    }
    store.commit("route/DEL_CACHE_VIEW_OTHERS", index);
    goLastPage();
    return;
  }
  if (cmd === "close-left") {
    const index = views.value.findIndex((item) => item.path === route.path);
    if (index <= 0) {
      return;
    }
    store.commit("route/DEL_CACHE_VIEW_LEFT", index);
    return;
  }
  if (cmd === "close-right") {
    const index = views.value.findIndex((item) => item.path === route.path);
    if (index >= views.value.length) {
      return;
    }
    store.commit("route/DEL_CACHE_VIEW_RIGHT", index);
  }
  if (cmd === "close-all") {
    store.commit("route/DEL_CACHE_VIEW");
    goLastPage();
  }
};

const handleScroll = (ev) => {
  const eventDelta = ev.wheelDelta || -e.deltaY * 40;
  scrollbar.value.wrap.scrollLeft += eventDelta / 4;
};

const scroll = (dir) => {
  if (!scrollbar.value) {
    return;
  }
  const width = scrollbar.value.wrap.offsetWidth;
  if (dir > 0) {
    scrollToLeftAnimate(scrollbar.value.wrap, width);
    return;
  }
  scrollToLeftAnimate(scrollbar.value.wrap, -width);
};

// 滚动特效
const scrollToLeftAnimate = (el, toLeftOffset) => {
  if (toLeftOffset === 0) {
    return;
  }
  const step = Math.abs(toLeftOffset);
  const dir = toLeftOffset < 0 ? -1 : 1;
  const left = el.scrollLeft;
  const _scroll = (start) => {
    start += 50;
    el.scrollLeft = left + start * dir;
    if (start >= step) {
      return;
    }
    window.requestAnimationFrame(() => _scroll(start));
  };
  _scroll(0);
};
</script>

<style lang="scss" scoped>
.tag-view-container {
  display: inline-flex;
  width: 100%;
  height: 33px;
  align-items: center;
  box-shadow: 0 2px 5px rgba(200, 200, 200, 0.875);
  .icon-arrow {
    display: inline-flex;
    width: 20px;
    height: 100%;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;
    font-weight: bold;
    color: #909399;
    &:hover {
      background: rgba(200, 200, 200, 0.2);
    }
    &.el-icon-caret-left {
      border-right: 1px solid rgba(200, 200, 200, 0.5);
      box-shadow: 2px 0 5px rgba(200, 200, 200, 0.5);
    }
    &.el-icon-caret-right {
      border-left: 1px solid rgba(200, 200, 200, 0.5);
      box-shadow: -2px 0 5px rgba(200, 200, 200, 0.5);
    }
  }
  .tag-views-scrollbar {
    width: calc(100% - 90px);
    box-sizing: border-box;
    padding: 0 5px;
    .el-scrollbar__bar {
      bottom: 0px;
    }

    .el-scrollbar__wrap {
      height: 49px;
    }
    .flex-content {
      user-select: none;
      display: inline-flex;
      flex-direction: row;
      padding: 2px 0;
      box-sizing: border-box;
      .view-tag {
        cursor: pointer;
        margin-right: 5px;
        border-radius: 0;
      }
    }
  }
  :deep(.tag-operate) {
    cursor: pointer;
    display: inline-flex;
    width: 50px;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    box-sizing: border-box;
    border-left: 1px solid rgba(200, 200, 200, 0.5);
    &:hover {
      background: #e9e9eb;
    }
  }
  .el-dropdown-link {
    display: inline-block;
    width: 50px;
    height: 100%;
    line-height: 30px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #909399;
    box-sizing: border-box;
  }
}
.view-list-enter-active,
.view-list-leave-active {
  transition: all 0.5s ease;
}
.view-list-enter-from,
.view-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>