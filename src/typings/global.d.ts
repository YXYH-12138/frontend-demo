// 提取数组子元素
declare type Flatten<T> = T extends (infer U)[] ? U : T;
// 提取 Promise 值
declare type Unpromisify<T> = T extends Promise<infer R> ? R : T;
// 提取函数参数
declare type ExtractArguments<T> = T extends (...arg: infer A) => unknown ? A : T;
// 数据对象
declare type DataRecord = Record<string | number | symbol, any>;

declare module "*.less";
declare module "*.png";
declare module "*.gif";
declare module "*.json";
declare module "*.js";
