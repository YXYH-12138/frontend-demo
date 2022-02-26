/* eslint-disable @typescript-eslint/no-unused-vars */
import type { _RouteRecordBase } from "vue-router";

declare module "vue-router" {
  interface _RouteRecordBase {
    hidden?: boolean;
    alwaysShow?: boolean;
  }
  interface RouteMeta {
    title: string;
    icon?: string;
    noCache?: boolean;
    activeMenu?: string;
    rootName?: string;
  }
}
