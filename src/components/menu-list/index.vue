<script>
export default {
  name: "MenuList",
  inheritAttrs: false,
  props: {
    list: Array,
    router: Boolean,
  },
  methods: {
    createMenuItem(data, deep) {
      return data.map((item, index) => {
        if (item.hidden) return null;
        const _deep = deep ? deep + "-" : "";
        return item.children && item.children.length > 0 ? (
          // key={"sub-" + _deep + index}
          <el-submenu key={item.path} index={item.path.toLowerCase()}>
            <span slot="title">
              {item.icon && <i class={item.icon} />}
              <span>{item.meta.title}</span>
            </span>
            {this.createMenuItem(item.children, _deep + index)}
          </el-submenu>
        ) : (
          //  key={_deep + index}
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
        {this.createMenuItem(this.list)}
      </el-menu>
    );
  },
};
</script>

<style lang="less" scoped>
#library();
.menu-list {
  max-height: calc(100vh - @header-height);
  li {
    .text-hidden();
    font-size: 16px;
    // text-align: center;
  }
}
/deep/ .el-submenu__title {
  font-size: 16px;
}
</style>