<script lang="ts">
import { defineComponent, PropType, inject, shallowRef, onMounted } from "vue-demi";
import { layerKey } from "../context";
import { point } from "leaflet";
import type { Content, TooltipOptions, Point, Direction } from "leaflet";

export default defineComponent({
  props: {
    content: [String, Object] as PropType<Content>,
    direction: {
      type: String as PropType<Direction>,
      default: "top"
    },
    permanent: Boolean,
    offset: {
      type: [Object, Array] as PropType<Point | number[]>,
      default: () => point(0, 0)
    },
    options: {
      type: Object as PropType<TooltipOptions>
    }
  },
  setup(props) {
    const tooltipEl = shallowRef<HTMLElement>();

    const layer = inject(layerKey);

    onMounted(() => {
      if (!layer) return;
      const { options = {}, content, direction, permanent, offset } = props;
      layer.bindTooltip(content || (tooltipEl.value as HTMLElement), {
        direction,
        permanent,
        offset,
        ...options
      } as TooltipOptions);
    });

    return { tooltipEl };
  }
});
</script>

<template>
  <div ref="tooltipEl">
    <slot></slot>
  </div>
</template>
