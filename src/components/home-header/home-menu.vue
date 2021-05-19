<template>
  <ul class="header-menu">
    <li
      v-for="(item, index) in menus"
      :key="item.title"
      :class="{ active: index === active }"
      @click.stop="handleClick(index)"
    >
      <div>{{ item.title }}</div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "HomeMenu",
  props: {
    menus: Array,
    active: Number,
  },
  methods: {
    handleClick(index) {
      this.$emit("change", index);
    },
  },
};
</script>

<style lang="less" scoped>
.header-menu {
  height: 46px;
  display: flex;
  justify-content: flex-end;
  li {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: auto;
    padding: 0 20px;
    height: 100%;
    font-size: 18px;
    line-height: normal;
    &:hover {
      cursor: pointer;
      background-color: rgba(skyblue, 0.6);
      border-radius: 10px;
    }
    &:nth-child(n + 1) {
      margin-left: 10px;
    }
    &.active {
      background-color: #fff;
      color: @theme-color;
      font-weight: 600;
      border-radius: 10px;
    }
  }
}
</style>