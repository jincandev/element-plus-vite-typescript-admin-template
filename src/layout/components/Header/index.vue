<template>
  <div id="main-header">
    <div class="menu-switch-icon" @click="switchMenu">
      <el-icon v-if="collapse" :size="20"><expand /></el-icon>
      <el-icon v-else :size="20"><fold /></el-icon>
    </div>
    <el-breadcrumb class="breadcrumb" separator="/">
      <transition-group name="breadcrumb-list" tag="div">
        <el-breadcrumb-item :to="{ path: '/' }" key="/"
          >首页</el-breadcrumb-item
        >
        <template v-for="bread in breadcrumbs" :key="bread.path">
          <el-breadcrumb-item
            v-if="bread.path && bread.title"
            :to="{ path: bread.path }"
            >{{ bread.title }}</el-breadcrumb-item
          >
          <el-breadcrumb-item v-else-if="bread.title">{{
            bread.title
          }}</el-breadcrumb-item>
        </template>
      </transition-group>
    </el-breadcrumb>
    <div class="operations">
      <el-dropdown class="userinfo" @command="handleCommand">
        <span class="el-dropdown-link">
          <div class="headicon">
            <el-badge is-dot :hidden="!messages.length" class="messages">
              <el-avatar
                shape="square"
                :size="30"
                :src="AvatarImage"
              ></el-avatar>
            </el-badge>
          </div>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :icon="UserFilled" command="user-center"
              >个人中心</el-dropdown-item
            >
            <el-dropdown-item :icon="CloseBold" divided command="logout"
              >退出</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 这里可以扩充更多功能 -->
      <div class="fullscreen" title="全屏" @click="setFullScreen">
        <el-icon :size="30"><rank /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { Fold, Expand, CloseBold, UserFilled, Rank } from "@element-plus/icons-vue";

import AvatarImage from "@/assets/avatar.png";
const store = useStore();
const router = useRouter();
const route = useRoute();

const collapse = computed(() => store.state.menu.collapse);
const messages = computed(() => store.getters.userMessages);

const breadcrumbs = computed(() => {
  const routes = store.state.permission.routes;
  const rpaths = route.path.split("/").filter((r) => !!r);
  let found = null;
  let tempPaths = [];
  let crumbs = rpaths.reduce((la, p) => {
    if (!found) {
      found = routes.find((r) => r.path === p || r.path.slice(1) === p);
    } else if (found.children?.length) {
      found = found.children.find((r) => r.path === p || r.path.slice(1) === p);
    }
    if (found) {
      tempPaths.push(found.path);
      la.push({
        title: found.meta?.title || found.name,
        name: found.name,
        path: tempPaths.join("/").replaceAll(/\/{2,}/g, "/"),
      });
    }
    return la;
  }, []);
  return crumbs;
});

const handleCommand = async (command) => {
  if (command === "logout") {
    await store.dispatch("user/logout");
    return;
  }
  if (command === "user-center") {
    router.push({
      name: "userCenter",
    });
    return;
  }
};

const switchMenu = () => {
  store.commit("menu/SWITCH_COLLAPSE");
};

const emits = defineEmits(["fullscreen"]);

const setFullScreen = () => {
  emits("fullscreen");
};
</script>

<style lang="scss" scoped>
#main-header {
  position: relative;
  display: inline-flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  .menu-switch-icon {
    // flex: 1;
    display: inline-flex;
    cursor: pointer;
    border-radius: 5px;
    &:hover {
      box-shadow: 0 0 3px inset;
      color: rgb(64, 158, 255);
    }
  }
  .breadcrumb {
    margin-left: 20px;
  }
  .operations {
    display: inline-flex;
    height: 100%;
    flex: 8;
    flex-direction: row-reverse;
    align-items: center;
    .userinfo {
      .headicon {
        cursor: pointer;
        position: relative;
      }
    }
  }
  .fullscreen {
    padding: 0 10px;
    font-weight: bold;
    transform: rotate(45deg);
    cursor: pointer;
  }
}
.breadcrumb-list-enter-active,
.breadcrumb-list-leave-active {
  transition: all 0.5s ease;
}
.breadcrumb-list-enter-from,
.breadcrumb-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>