<template>
  <div class="layout-page">
    <section class="layout-content">
      <router-view />
    </section>
  </div>
</template>

<style lang="less" scoped>
.layout-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  .layout-content {
    background-color: @bg-main-color;
    flex: 1;
  }
}
</style>