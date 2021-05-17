<template>
  <div id="app">
    <el-container>
      <el-aside width="200px">
        <!-- <el-menu router @select="select" :default-active="active">
          <menu-list :menuList="menuList" />
        </el-menu> -->
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
    };
  },
  created() {
    //
    this.menuList = this.$router.options.routes;
  },
  methods: {
    select(index) {
      sessionStorage.setItem("active", index);
    },
  },
  computed: {
    active() {
      return sessionStorage.getItem("active") || "";
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  width: 100%;
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-menu {
  height: 100%;
}
</style>
