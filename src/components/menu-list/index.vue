<template>
  <div>
    <template v-for="item in menuList">
      <template v-if="item.meta && item.meta.title">
        <el-submenu
          v-if="item.children && item.children.length > 0"
          index="1"
          :key="item.path"
        >
          <template slot="title">
            <span> {{ item.meta.title }}</span>
          </template>
          <menu-list :menuList="item.children" :parent="item.path + '/'" />
        </el-submenu>

        <el-menu-item v-else :index="parent + item.path" :key="item.path">
          {{ item.meta.title }}
        </el-menu-item>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: "MenuList",
  props: {
    menuList: {
      type: Array,
      default: () => [],
    },
    parent: {
      type: String,
      default: "",
    },
  },
};
</script>

<style>
</style>