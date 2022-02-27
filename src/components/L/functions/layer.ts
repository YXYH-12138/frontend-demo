import { inject, watch, toRef, provide } from "vue-demi";
import * as L from "leaflet";
import { layerMethodsKey, layerKey, mapContextKey, flyContextKey, flyKey } from "../context";
import { remapEvents, propsBinder } from "../utils";
import type { SetupContext, ExtractPropTypes } from "vue-demi";
import type { LayerMethods } from "../context";

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
  layer: L.Layer,
  layerMethods?: LayerMethods
) => void;

export const layerSetup: SetUp<typeof layerProps, typeof layerEmits> = (
  props,
  context,
  layer,
  layerMethods
) => {
  const methods = layerMethods || inject(layerMethodsKey)!;
  const { events: mapEvents } = inject(mapContextKey)!;
  const { events: flyEvents } = inject(flyContextKey)!;
  const flyName = inject(flyKey);

  const visible = toRef(props, "visible");

  visible.value && methods.addLayer(layer);

  provide(layerKey, layer);

  propsBinder({}, layer, props);
  L.DomEvent.on(layer as any, remapEvents(context.attrs));

  watch(visible, (val) => {
    methods.setVisible(layer, val);
    context.emit("update:visible", val);
    mapEvents.emit("layerVisible", { layer, visible: visible.value, name: flyName });
    !val && flyName && flyEvents.emit("layerHidden", { name: flyName });
  });
};
