<template>
  <div>
    <el-card class="menu-card">
      <menu-list :menus="menus" />
    </el-card>
  </div>
</template>

<script>
export default {
  name: "MenusList-菜单",
  data() {
    return {
      menus: [
        {
          path: "test1",
          meta: {
            title: "路由1",
          },
        },
        {
          path: "test2",
          meta: {
            title: "路由2",
          },
        },
        {
          path: "test3",
          meta: {
            title: "路由3",
          },
          children: [
            {
              path: "test3-children1",
              meta: {
                title: "子路由路由1",
              },
            },
          ],
        },
      ],
      sourceData: [],
      searchValue: "",
      tableData: [],
    };
  },
};
</script>

<style lang="less" scoped>
.menu-card {
  width: 300px;
  margin: auto;
}
</style>