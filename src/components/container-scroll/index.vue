<template>
  <div class="container-scoll-box" v-bind="$attrs">
    <slot name="left">
      <el-button
        v-if="showButton"
        type="text"
        class="btn-con"
        @click="moveTo(offset)"
      >
        <i class="icon el-icon-arrow-left" />
      </el-button>
    </slot>
    <div ref="tagsViews" class="tags-views">
      <div
        ref="tagsCont"
        class="tags-cont"
        :style="{ transform: `translateX(${tagsContLeft}px)` }"
        @DOMMouseScroll="handlescroll"
        @mousewheel="handlescroll"
      >
        <transition-group>
          <slot></slot>
        </transition-group>
      </div>
    </div>
    <!-- 向右滑动 -->
    <slot name="right">
      <el-button
        v-if="showButton"
        type="text"
        class="btn-con"
        @click="moveTo(-offset)"
      >
        <i class="icon el-icon-arrow-right" />
      </el-button>
    </slot>
  </div>
</template>

<script>
export default {
  name: "ContainerScroll",
  props: {
    // 是否显示左右滑动按钮
    showButton: {
      type: Boolean,
      default: true,
    },
    // 按钮点击滑动的偏移
    offset: {
      type: Number,
      default: 240,
    },
  },
  data() {
    return {
      tagsContLeft: 0,
    };
  },
  methods: {
    handlescroll(e) {
      const type = e.type;
      let distance = 0;
      // mousewheel非火狐浏览器鼠标滚动事件; DOMMouseScroll火狐浏览器鼠标滚动事件
      if (type === "mousewheel" || type === "DOMMouseScroll") {
        // mousewheel 事件中的 event.wheelDelta 属性值：若滚轮是向上滚动，返回值为正，反之为负；且返回的值，均为 120 的倍数，即：幅度大小 = 返回的值 / 120
        // DOMMouseScroll 事件中的 event.detail 属性值：返回的值，与 event.wheelDelta 正好相反，即滚轮是向上滚动，返回值为负，反之为正；返回的值，均为 3 的倍数，即：幅度大小 = 返回的值 / 3
        distance = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
      }
      this.moveTo(distance);
    },
    moveTo(offset) {
      const viewWidth = this.$refs.tagsViews.offsetWidth;
      const contWidth = this.$refs.tagsCont.offsetWidth;
      // 容器长度大于内容长度，无需滚动
      if (viewWidth > contWidth) {
        this.tagsContLeft = 0;
        return;
      }
      this.tagsContLeft =
        offset > 0
          ? Math.min(0, this.tagsContLeft + offset)
          : Math.max(this.tagsContLeft + offset, viewWidth - contWidth);
    },
    moveToCurrent(tag, padding = 0) {
      if (!(tag instanceof Node)) {
        throw new TypeError(`${tag} is not Node instance`);
      }
      const viewWidth = this.$refs.tagsViews.offsetWidth;
      const contWidth = this.$refs.tagsCont.offsetWidth;
      if (contWidth < viewWidth) {
        this.tagsContLeft = 0;
      } else if (tag.offsetLeft < -this.tagsContLeft) {
        // 标签在可视区域左侧
        this.tagsContLeft = -tag.offsetLeft + padding;
      } else if (
        tag.offsetLeft > -this.tagsContLeft &&
        tag.offsetLeft + tag.offsetWidth < -this.tagsContLeft + viewWidth
      ) {
        // 标签在可视区域
        this.tagsContLeft = Math.min(
          0,
          viewWidth - tag.offsetWidth - tag.offsetLeft - padding
        );
      } else {
        // 标签在可视区域右侧
        this.tagsContLeft = -(
          tag.offsetLeft -
          (viewWidth - padding - tag.offsetWidth)
        );
      }
    },
  },
};
</script>

<style lang="less" scoped>
.container-scoll-box {
  display: flex;
  width: 100%;
  height: 40px;
  .icon {
    font-size: 18px;
  }
  .btn-con {
    width: 28px;
    height: 40px;
    padding: 8px 7px 8px 3px;
    border-top: solid 1px #f0f0f0;
    border-bottom: solid 1px #f0f0f0;
    box-sizing: border-box;
  }
  .tags-views {
    flex: 1;
    height: 40px;
    background: #f0f0f0;
    box-shadow: inset 0 0 3px 2px #6464641a;
    overflow: hidden;
    .tags-cont {
      display: flex;
      align-items: center;
      float: left;
      height: 100%;
      overflow: visible;
      white-space: nowrap;
      transition: transform 0.5s ease;
    }
  }
}
</style>