<template>
  <div id="wrapper">
    <div class="line-wrap" style="margin-left: 70px">
      <!-- <div id="item-1" class="state-item"></div>
      <div id="item-2" class="state-item"></div> -->
    </div>
  </div>
</template>

<script>
import G6 from "@antv/g6";

export default {
  mounted() {
    this.initSelfEdge();
    // this.initSelfNode();
    const topCommon = {
      y: 200,
      type: "rect",
      size: [30, 15],
      style: {
        lineWidth: 0,
        fill: "rgb(116,249,249)",
      },
    };
    const topNodes = [];
    const topEdges = [];
    for (let i = 0; i < 10; i++) {
      topNodes.push({
        id: `item-${i + 1}`,
        x: 100 + i * 60,
        ...topCommon,
      });
      i < 9 &&
        topEdges.push({
          source: `item-${i + 1}`,
          target: `item-${i + 2}`,
          type: "horizontal",
        });
    }
    const data = {
      // 点集
      nodes: [
        {
          id: "item-title-1",
          x: 40,
          type: "title",
          size: [30, 15],
          label: "钱塘江",
        },
        ...topNodes,
        {
          id: "item-v-1",
          x: 100 + 4 * 60 + 30,
          ...topCommon,
          y: 240,
          size: [15, 30],
        },
      ],
      // 边集
      edges: [
        ...topEdges,
        {
          source: "item-5",
          target: "item-v-1",
          type: "vertical",
        },
      ],
    };
    const graph = new G6.Graph({
      container: "wrapper", // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
      width: 800, // Number，必须，图的宽度
      height: 500, // Number，必须，图的高度
    });
    graph.data(data); // 读取 Step 2 中的数据源到图上
    graph.render(); // 渲染图
  },
  methods: {
    initSelfEdge() {
      G6.registerEdge("horizontal", {
        draw(cfg, group) {
          const startPoint = cfg.startPoint;
          const endPoint = cfg.endPoint;
          const shape = group.addShape("path", {
            attrs: {
              stroke: "rgb(116,249,249)",
              path: [
                ["M", startPoint.x, startPoint.y],
                ["L", endPoint.x, endPoint.y],
              ],
              lineDash: [2],
              lineWidth: 2,
            },
            name: "self-horizontal",
          });
          return shape;
        },
      });
      G6.registerEdge("vertical", {
        draw(cfg, group) {
          const startPoint = cfg.startPoint;
          const endPoint = cfg.endPoint;
          const shape = group.addShape("path", {
            attrs: {
              stroke: "rgb(116,249,249)",
              path: [
                ["M", startPoint.x + 15, startPoint.y],
                ["L", endPoint.x + 7.5, endPoint.y],
              ],
              lineDash: [2],
              lineWidth: 2,
            },
            name: "self-vertical",
          });
          return shape;
        },
      });
    },
    initSelfNode() {
      G6.registerNode(
        "title",
        {
          options: {
            style: {
              lineWidth: 0,
              fill: "#fff",
            },
          },
          draw: (cfg, group) => {
            return group.addShape("dom", {
              attrs: {
                width: cfg.size[0],
                height: cfg.size[1],
              },
              draggable: true,
            });
          },
        },
        "rect"
      );
    },
  },
};
</script>

<style scoped>
#wrapper {
  height: 100%;
}
</style>