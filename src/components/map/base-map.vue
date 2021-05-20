<script>
export default {
  name: "BaseMap",
  inject: ["layer"],
  props: {
    type: String,
    url: String,
    config: Object,
  },
  watch: {
    "layer.map": {
      handler(map) {
        map.addLayer(this.tileLayer(this.url, this.config));
      },
    },
  },
  computed: {
    tileLayer() {
      const $L = this.layer.$L;
      switch (this.type) {
        case "wms":
          return $L.tileLayer.wms;
        default:
          return $L.tileLayer;
      }
    },
  },
  render() {
    return null;
  },
};
</script>

<style>
</style>