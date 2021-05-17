<template>
  <div class="cascader" v-click-outside="close">
    <div class="title" @click="toggle">
      <span>{{ fullValue }}</span>
    </div>
    <div class="content" v-show="isShow">
      <cascader-item :options="options" :value="save" @change="change" />
    </div>
  </div>
</template>

<script>
import CascaderItem from "./cascade-item";
import * as utils from "@/common/utils";

export default {
  name: "Cascader",
  components: { CascaderItem },
  model: {
    event: "changed",
  },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
    lazyLoad: Function,
  },
  data() {
    return {
      isShow: false,
      save: [...this.value],
      isAsync: !!this.lazyLoad,
    };
  },
  computed: {
    fullValue() {
      return this.value.reduce((acc, cur, index) => {
        return acc + cur.label + (index !== this.value.length - 1 ? " / " : "");
      }, "");
    },
  },
  methods: {
    toggle() {
      this.isShow = !this.isShow;
    },
    close() {
      this.isShow = false;
    },
    changed(data) {
      // 当前选择的元素没有子元素则选择完毕
      if (!data.children || !data.children.length) {
        this.isShow = false;
        // 触发自定义组件v-model的事件，让父亲更新value值
        this.$emit("changed", utils.deepCopy(this.save));
      }
    },
    change({ data, index }) {
      // 删除后面的数据
      this.save.splice(index + 1);
      // 设置选中值
      this.$set(this.save, index, data);
      // 触发事件
      this.$emit("change", data);
      const loading = "loading" in data;
      // 异步加载
      if (this.lazyLoad) {
        this.lazyLoad(data, loading ? () => this.changed(data) : () => {});
      }
      loading || !this.lazyLoad || this.changed(data);
    },
  },
};
</script>

<style scoped>
.cascader {
  display: inline-block;
  margin: 50px;
  width: 200px;
}

.cascader .title {
  display: flex;
  padding: 0 12px;
  height: 36px;
  line-height: 36px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.cascader .title > span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cascader > .title .item-delimiter {
  margin: 0 5px;
}
</style>