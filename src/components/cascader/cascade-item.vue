<template>
  <div class="cascader-item">
    <div class="left">
      <div v-for="item in options" :key="item.value" @click="selected(item)">
        <span class="label">{{ item.label }}</span>
        <span
          v-if="(item.children && item.children.length) || 'loading' in item"
        >
          >
        </span>
      </div>
    </div>
    <template v-if="list">
      <cascader-item
        :options="list"
        :value="value"
        :index="index + 1"
        v-on="$listeners"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: "CascaderItem",
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    index: {
      type: Number,
      default: 0,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    list() {
      const current = this.value[this.index];
      return current && current.children;
    },
  },
  data() {
    return {
      children: [],
    };
  },
  methods: {
    selected(item) {
      // 每一次选择事件
      this.$emit("change", { data: item, index: this.index });
    },
  },
};
</script>

<style scoped>
.cascader-item {
  display: flex;
}
.cascader-item .left {
  min-width: 150px;
  white-space: nowrap;
  margin-right: 10px;
}
</style>