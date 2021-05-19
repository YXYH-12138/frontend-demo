<template>
  <div class="home-header">
    <div class="logo-title">后台模板</div>
    <home-menu
      class="header-menu"
      :active="active"
      :menus="menus"
      @change="handleChange"
    />
  </div>
</template>

<script>
import HomeMenu from "./home-menu";
import { mapState } from "vuex";
export default {
  name: "HomeHeader",
  components: {
    HomeMenu,
  },
  data() {
    return {
      visible: false,
      modalVisible: false,
    };
  },
  watch: {},
  computed: {
    ...mapState({
      menus: (state) => state.menus.headerMenus,
    }),
    active() {
      let path = this.$route.fullPath;
      const root = this.$route.meta.root;
      root && (path = root);
      return this.menus.findIndex((item) => item.path === path);
    },
  },
  methods: {
    handleChange(index) {
      this.$router.push(this.menus[index].path);
    },
    loginOut() {
      sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  & > a {
    display: block;
    cursor: pointer;
    &:hover {
      color: blue;
    }
    &:nth-child(n + 2) {
      margin-top: 10px;
    }
  }
}
/deep/ .el-popover {
  min-width: none !important;
}
.home-header {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  background: @theme-color;
  color: #fff;
  height: @header-height;
  justify-content: space-between;

  .logo-title {
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
    line-height: normal;
    padding-left: 40px;
  }
  .menu-icon {
    font-size: 24px;
  }
  .login-popover {
    position: absolute;
    right: 40px;
  }
  .header-menu {
    margin-right: 100px !important;
  }
}
</style>