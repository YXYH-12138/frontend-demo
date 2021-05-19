<template>
  <div
    class="map-legend"
    :style="{ [left ? 'left' : 'right']: offset, bottom }"
  >
    <div class="title">图例</div>
    <ul class="content">
      <li v-for="item in legends" :key="item.text">
        <img :src="item.img" alt="" />
        <span>{{ item.text }}</span>
        <!-- <span
          >(<strong>{{ item.count }}</strong
          >处)
        </span> -->
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "MapLegend",
  props: {
    legends: Array,
    left: {
      type: Boolean,
      default: true,
    },
    offset: {
      type: String,
      default: "100px",
    },
    bottom: {
      type: String,
      default: "40px",
    },
  },
};
</script>

<style lang="less" scoped>
.map-legend {
  position: fixed;
  bottom: 40px;
  z-index: 9999;
  padding: 0 16px 0px;
  background-color: rgba(#eee, 0.6);
  border-radius: 10px;
  .title {
    text-align: center;
    line-height: 46px;
    color: #000;
    font-weight: 600;
    font-size: 16px;
  }
  .content {
    padding: 5px;
    li {
      width: auto;
      height: 32px;
      color: black;
      & > img {
        width: 20px;
        height: 20px;
        vertical-align: text-bottom;
        margin-right: 10px;
      }
    }
  }
}
</style>