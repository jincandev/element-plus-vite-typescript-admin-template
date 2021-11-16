<template>
  <div class="login-container">
    <el-form
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">后台管理登录</h3>
      </div>
      <el-form-item prop="username" :label-width="0">
        <el-input
          ref="username"
          v-model="loginForm.username"
          maxlength="32"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          @keyup.enter="handleLogin"
        />
      </el-form-item>
      <el-form-item prop="password" :label-width="0">
        <el-input
          ref="password"
          v-model="loginForm.password"
          maxlength="32"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          @keyup.enter="handleLogin"
        />
      </el-form-item>
      <el-form-item prop="vcode" :label-width="0">
        <el-input
          v-model="loginForm.vcode"
          maxlength="6"
          placeholder="验证码"
          name="vcode"
          tabindex="3"
          @keyup.enter="handleLogin"
        >
        <template #append>
          <el-image class="vcode-image" />
        </template>
        </el-input>
      </el-form-item>
      <el-form-item :label-width="0">
        <el-button :loading="loading" type="primary" @click.prevent="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { reactive, ref, toRefs, watchEffect, defineComponent } from "vue"

const loading = ref(false);
const handleLogin = () => {};
const loginForm = reactive({
  username: "",
  password: "",
  vcode: ""
});

const loginRules = reactive({})
const passwordType = ref("password")
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
// #283443
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  display: inline-flex;
  min-height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  background-color: $bg;
  overflow: hidden;
  box-sizing: border-box;

  .login-form {
    position: relative;
    width: 400px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
    box-sizing: border-box;
  }

  .title-container {
    position: relative;
    display: flex;
    align-items: baseline;
    .title:before {
      background: linear-gradient(to left, #7e7e7e 0%, #fff 100%);
    }
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .language {
      margin-right: auto;
    }
  }
}
</style>
