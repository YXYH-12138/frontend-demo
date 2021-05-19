<template>
  <div class="wrap">
    <collapse-wrap>
      <menu-list :menus="menus" router />
    </collapse-wrap>
    <div class="wrap-right">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    menus() {
      const menus = [];
      this.$router.getRoutes().forEach((route) => {
        if (route.path.includes("/example")) {
          menus.push(route);
        }
      });
      return menus;
    },
  },
};
</script>
<style lang="less" scoped>
.wrap {
  height: 100%;
  display: flex;
  .wrap-right {
    flex: 1;
    overflow: hidden;
  }
}
</style>