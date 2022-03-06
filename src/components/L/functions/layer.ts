import { inject, watch, toRef, provide, onBeforeUnmount } from "vue-demi";
import * as L from "leaflet";
import { layerMethodsKey, layerKey, mapContextKey, flyContextKey, flyKey } from "../context";
import { remapEvents, propsBinder } from "../utils";
import type { SetupContext, ExtractPropTypes } from "vue-demi";

export type LayerEmites = {
  "update:visible": (value: boolean) => void;
};

export const layerProps = {
  visible: {
    type: Boolean,
    default: true
  },
  pane: {
    type: String,
    default: "overlayPane"
  },
  attribution: {
    type: String,
    default: null
  },
  zIndex: Number
};

export const layerEmits = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  "update:visible"(visible: boolean) {
    return true;
  }
};

type SetUp<P, E> = (
  props: Readonly<ExtractPropTypes<P>>,
  ctx: SetupContext<E>,
  params: { layer: L.Layer }
) => void;

export const layerSetup: SetUp<typeof layerProps, typeof layerEmits> = (props, context, params) => {
  const methods = inject(layerMethodsKey)!;
  const { events: mapEvents } = inject(mapContextKey)!;
  const { events: flyEvents } = inject(flyContextKey, { events: undefined });
  const flyName = inject(flyKey, "");

  const { layer } = params;

  const visible = toRef(props, "visible");

  provide(layerKey, layer);

  propsBinder({}, layer, props);
  L.DomEvent.on(layer as any, remapEvents(context.attrs));

  watch(visible, (val) => {
    methods.setVisible(layer, val);
    mapEvents.emit("layerVisible", { layer, visible: visible.value, name: flyName });
    !val && flyEvents && flyName && flyEvents.emit("layerHidden", { name: flyName });
  });

  visible.value && methods.addLayer(layer);

  onBeforeUnmount(() => {
    methods.removeLayer(layer);
  });
};
