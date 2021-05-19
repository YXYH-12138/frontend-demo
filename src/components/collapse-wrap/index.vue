<template>
  <div
    :class="['collapse-wrap', { 'no-default': defaultHeight !== '100%' }]"
    :style="{
      height: defaultHeight,
      width,
      [left ? 'left' : 'right']: 0,
    }"
  >
    <collapse-button
      :isLeft="!left"
      :collapsed="selfCollapsed"
      @collapse-change="collapseChange"
    />
    <div class="collapse-content" @transitionend.self="transitionend">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "CollapseWrap",
  inheritAttrs: false,
  props: {
    left: {
      type: Boolean,
      default: true,
    },
    collapsed: Boolean,
    defaultWidth: {
      type: String,
      default: "256px",
    },
    defaultHeight: {
      type: String,
      default: "100%",
    },
  },
  data() {
    return {
      selfCollapsed: this.collapsed,
      width: this.defaultWidth,
    };
  },
  methods: {
    collapseChange() {
      this.selfCollapsed = !this.selfCollapsed;
      this.$emit("update:collapsed", !this.collapsed);
      this.$emit("collapsed-change");
      this.width = this.selfCollapsed ? "0" : this.defaultWidth;
    },
    transitionend() {
      this.$emit("collapsed-change-end");
    },
  },
};
</script>

<style lang="less" scoped>
.collapse-wrap {
  position: relative;
  z-index: 2;
  height: 100%;
  transition: width 0.2s ease-out;
  background-color: @collapse-bg-color;
  .collapse-content {
    height: 100%;
    overflow-y: auto;
  }
}
.no-default {
  top: calc(50% + (@header-height / 2));
  transform: translateY(-50%);
}
</style>