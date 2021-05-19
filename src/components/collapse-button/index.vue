<template>
  <div :class="[isLeft ? 'collapse-btn-left' : 'collapse-btn-right']">
    <i :class="iconType" @click="toggleCollapsed" />
  </div>
</template>

<script>
export default {
  name: "CollapseButton",
  props: {
    collapsed: Boolean,
    isLeft: Boolean,
  },
  methods: {
    toggleCollapsed() {
      this.$emit("collapse-change");
    },
  },
  computed: {
    iconType() {
      let type = `${this.collapsed ? "right" : "left"}`;
      this.isLeft && (type = `${this.collapsed ? "left" : "right"}`);
      return `el-icon-d-arrow-${type}`;
    },
  },
};
</script>

<style lang="less" scoped>
#library();
.common() {
  width: 25px;
  height: 65px;
  background-color: @theme-color;
  color: white;
  .flex-center();
  position: absolute;
  z-index: 2;
  transform: translateY(-50%);
  & > i {
    padding: 3px;
    cursor: pointer;
  }
}
.collapse-btn-right {
  .common();
  .radius(0;5px;5px;0);
  right: -$width;
  top: 50%;
}
.collapse-btn-left {
  .common();
  .radius(5px;0;0;5px);
  left: -$width;
  top: 50%;
}
</style>