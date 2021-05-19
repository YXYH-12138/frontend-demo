<script>
export default {
  name: "MenuList",
  inheritAttrs: false,
  props: {
    menus: {
      type: Array,
      required: true,
    },
    router: Boolean,
  },
  methods: {
    createMenuItem(data) {
      return data.map((item) => {
        if (item.hidden || item.redirect) return null;
        return item.children && item.children.length > 0 ? (
          <el-submenu key={item.path} index={item.path.toLowerCase()}>
            <span slot="title">
              {item.icon && <i class={item.icon} />}
              <span>{item.meta.title}</span>
            </span>
            {this.createMenuItem(item.children)}
          </el-submenu>
        ) : (
          <el-menu-item
            index={(item.path[0] === "/"
              ? item.path
              : "/" + item.path
            ).toLowerCase()}
            key={item.path}
          >
            {item.icon && <i class={item.icon} />}
            <span>{item.meta.title}</span>
          </el-menu-item>
        );
      });
    },
    handleClick(path) {
      this.router && this.$router.push(path);
      this.$emit("select", path);
    },
  },
  render() {
    return (
      <el-menu
        class="menu-list"
        unique-opened={true}
        default-active={this.$route.fullPath}
        {...{ props: this.$attrs }}
        {...{ on: this.$listeners }}
        onSelect={this.handleClick}
      >
        {this.createMenuItem(this.menus)}
      </el-menu>
    );
  },
};
</script>

<style lang="less" scoped>
#library();
.menu-list {
  height: 100%;
  li {
    .text-hidden();
    font-size: 16px;
  }
}
/deep/ .el-submenu__title {
  font-size: 16px;
}
</style>