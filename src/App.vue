<script setup lang="ts">
import { routes } from "./router";
import MenuList from "./components/MenuList/index.vue";

const menus = { path: "/", children: [routes[1]] };
</script>

<template>
  <el-container style="height: 100%">
    <el-aside width="200px">
      <MenuList :menus="menus" router />
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
}
.el-main {
  padding: 0;
}
</style>
