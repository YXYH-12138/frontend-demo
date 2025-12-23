import { InjectionKey } from "vue";
import { EventBusKey } from "@vueuse/core";
import { IContext } from "@/utils";

export const contextKey: InjectionKey<IContext> = Symbol();

/** 通知虚拟站重新加载 */
export const virtualStationLoadKey: EventBusKey<void> = Symbol();
