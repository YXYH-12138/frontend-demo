import { shallowReactive } from "vue-demi";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from "axios";

type ResultProxy<T> = { loading: boolean; data: T };
type Functional = (...arg: any) => any;
type CallbackMapKey = "catch" | "finally" | "subscribe";

export class AxiosEnhance<T = any, R = AxiosResponse<T>> {
	public readonly proxy = shallowReactive<ResultProxy<R>>({ loading: false } as ResultProxy<R>);

	private cancelSource: CancelTokenSource | null = null;
	private config: AxiosRequestConfig = {};
	// 回调Map
	private callbackMap = new Map<CallbackMapKey, Functional>();
	// pick
	private pipeQueue: Functional[] = [];
	//未完成的请求
	private unfinishCount = 0;

	constructor(
		private axiosInstance: AxiosInstance,
		private url: string,
		config?: AxiosRequestConfig
	) {
		config && Object.assign(this.config, config);
	}

	private setCancelToken() {
		this.cancelSource = axios.CancelToken.source();
		this.config.cancelToken = this.cancelSource.token;
	}

	public finally(cb: () => void) {
		this.callbackMap.set("finally", cb);
		return this;
	}

	public catch(cb: (error: unknown) => void) {
		this.callbackMap.set("catch", cb);
		return this;
	}

	public cancel(message?: string) {
		const { cancelSource } = this;
		cancelSource && cancelSource.cancel(message);
		this.setCancelToken();
	}

	public subscribe<T extends R>(cb: (data: Readonly<T>) => void) {
		this.callbackMap.set("subscribe", cb);
		return this;
	}

	public pipe<B>(cb: (data: R) => B) {
		this.pipeQueue.push(cb);
		return this as any as AxiosEnhance<any, B>;
	}

	public run() {
		const { proxy, url, config, callbackMap, pipeQueue } = this;
		this.cancel();
		proxy.loading = true;
		this.unfinishCount++;
		(this.axiosInstance(url, config) as any as Promise<R>)
			.then((data) => {
				const subscribeFunc = callbackMap.get("subscribe");
				let pipeData: R = data;
				pipeQueue.forEach((callback) => {
					pipeData = callback(pipeData);
				});
				proxy.data = pipeData;
				subscribeFunc && subscribeFunc(proxy.data);
			})
			.catch((error) => {
				if (axios.isCancel(error)) return;
				const catchFunc = callbackMap.get("catch");
				catchFunc && catchFunc(error);
			})
			.finally(() => {
				this.unfinishCount--;
				if (this.unfinishCount === 0) {
					proxy.loading = false;
				}
				const finallyFunc = callbackMap.get("finally");
				finallyFunc && finallyFunc();
			});
		return this;
	}
}
