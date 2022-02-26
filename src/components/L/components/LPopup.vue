<script lang="ts">
import { defineComponent, PropType, inject, shallowRef, onMounted } from "vue-demi";
import { layerKey } from "./context";
import { point } from "leaflet";
import type { Content, PopupOptions, Point } from "leaflet";

export default defineComponent({
  props: {
    content: [String, Object] as PropType<Content>,
    offset: {
      type: [Object, Array] as PropType<Point | number[]>,
      default: () => point(0, 7)
    },
    options: {
      type: Object as PropType<PopupOptions>
    }
  },
  setup(props) {
    const popupEl = shallowRef<HTMLElement>();
    const layer = inject(layerKey);

    onMounted(() => {
      if (!layer) return;
      const { options = {}, content, offset } = props;
      layer.bindPopup(content || (popupEl.value as HTMLElement), {
        offset,
        ...options
      } as PopupOptions);
    });

    return { popupEl };
  }
});
</script>

<template>
  <div ref="popupEl">
    <slot></slot>
  </div>
</template>
