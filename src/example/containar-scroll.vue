<template>
  <div class="container">
    <container-scroll class="scroll" ref="containerScroll">
      <a
        href="javascropt:void(0);"
        class="scroll-item"
        v-for="(item, index) in list"
        :key="item"
        ref="tags"
        @click="selectTag(index)"
      >
        <el-tag :style="{ padding: '0 20px' }">{{ item }}</el-tag>
      </a>
    </container-scroll>
    <div class="btn-con btn-close">
      <el-dropdown @command="handleCloseCtrl">
        <span class="el-dropdown-link">
          <i class="icon el-icon-circle-close" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="all">关闭所有</el-dropdown-item>
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContainarScroll-滚动容器",
  data() {
    return {
      list: [],
    };
  },
  created() {
    for (let i = 0; i < 40; i++) {
      this.list.push(i);
    }
  },
  methods: {
    handleCloseCtrl() {},
    selectTag(index) {
      const currentTag = this.$refs.tags[index];
      this.$refs.containerScroll.moveToCurrent(currentTag, 4);
    },
  },
};
</script>

<style scoped lang="less">
.container {
  display: flex;
  .scroll-item {
    margin-left: 4px;
    &:last-child {
      margin-right: 4px;
    }
  }
  .scroll {
    width: calc(100% - 40px);
  }
  .icon {
    font-size: 18px;
  }
  .btn-close {
    width: 40px;
    padding-top: 10px;
    padding-left: 11px;
    border: solid 1px #f0f0f0;
    cursor: pointer;
    box-sizing: border-box;
  }
}
</style>