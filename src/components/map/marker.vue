<script>
import mixins from "./mixins";

export default {
  name: "LayerMarker",
  inject: ["layer"],
  mixins: [mixins],
  props: {
    marker: Array,
    icon: Function,
    content: [String, HTMLElement, Function],
    popupOptions: [Object, Function],
  },
  watch: {
    "layer.map": {
      handler(map) {
        const $L = this.layer.$L;
        const marker = $L.marker([this.marker[0], this.marker[1]], {
          icon: this.icon($L.icon, $L.divIcon),
        });
        marker.addTo(map);
        this.bindingEvent(marker);
      },
    },
  },
  methods: {
    bindingEvent(marker) {
      // 处理popupopen事件
      let content = this.content;
      if (content) {
        typeof content === "function" && (content = content());
        const options =
          typeof this.popupOptions === "function"
            ? this.popupOptions(this.layer.$L)
            : this.popupOptions;
        marker.bindPopup(content, options);
      }
      this.mixBindingEvent(marker);
    },
  },
  render() {
    return null;
  },
};
</script>

<style>
</style>