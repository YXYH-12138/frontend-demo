<template>
  <div class="example-cascader">
    <cascader
      :options="options1"
      v-model="value"
      @change="change"
      :lazyLoad="lazyLoad"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: [],
      options1: [
        {
          value: "beijing",
          label: "北京",
          children: [],
          loading: false,
        },
        {
          value: "hangzhou",
          label: "杭州",
          children: [],
          loading: false,
        },
      ],
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致",
                },
                {
                  value: "fankui",
                  label: "反馈",
                },
                {
                  value: "xiaolv",
                  label: "效率",
                },
                {
                  value: "kekong",
                  label: "可控",
                },
              ],
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航",
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航",
                },
              ],
            },
          ],
        },
        {
          value: "ziyuan",
          label: "资源",
          children: [
            {
              value: "axure",
              label: "Axure Components",
              children: [
                {
                  value: "aaa",
                  label: "aa",
                },
              ],
            },
            {
              value: "jiaohu",
              label: "组件交互文档",
            },
          ],
        },
      ],
    };
  },
  methods: {
    // 每一次选择都会触发的事件
    change(data) {
      console.log(data);
    },
    lazyLoad(item, resolve) {
      setTimeout(() => {
        if (item.value === "beijing") {
          item.children = [
            {
              value: "talkingdata",
              label: "TalkingData",
            },
            {
              value: "baidu",
              label: "百度",
            },
            {
              value: "sina",
              label: "新浪",
            },
          ];
        } else if (item.value === "hangzhou") {
          item.children = [
            {
              value: "ali",
              label: "阿里巴巴",
            },
            {
              value: "163",
              label: "网易",
            },
          ];
        }
        item.loading = false;
        resolve();
      }, 1000);
    },
  },
};
</script>

<style>
</style>