<template>
  <div>
    <video ref="player" muted controls></video>
  </div>
</template>

<script>
import flvjs from "flv.js";
export default {
  name: "rtsp播放",
  data() {
    return {
      player: null,
    };
  },
  mounted() {
    if (flvjs.isSupported()) {
      let video = this.$refs.player;
      if (video) {
        this.player = flvjs.createPlayer({
          type: "flv",
          isLive: true,
          url: `ws://121.40.117.96:6100/rtsp`,
        });
        this.player.attachMediaElement(video);
        this.player.load();
        this.player.play();
      }
    }
  },
  beforeDestroy() {
    this.player.destory();
  },
};
</script>

<style>
</style>