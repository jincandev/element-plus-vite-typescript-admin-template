<template>
  <h1>这是首页</h1>
  <el-carousel height="150px">
    <el-carousel-item v-for="item in 4" :key="item">
      <h3 class="small">{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {};
</script>

<style>
</style>