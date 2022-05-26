import { shallowReactive } from "vue-demi";
import axios from "axios";
import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, CancelTokenSource } from "axios";

type ResultProxy<T> = { loading: boolean; data: T };
type Functional = (...arg: any) => any;

type Callback<T> = {
	catch?: (error: unknown) => void;
	resolve?: (data: T) => void;
	finally?: () => void;
};

export class AxiosEnhance<T = any, R = AxiosResponse<T>> {
	public readonly proxy = shallowReactive<ResultProxy<R>>({ loading: false } as ResultProxy<R>);

	private cancelSource: CancelTokenSource | null = null;
	private config: AxiosRequestConfig = {};
	// 回调Map
	private callbackMap: Callback<R> = {};
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

	public callback<K extends keyof Callback<R>>(key: K, cb: Callback<R>[K]) {
		this.callbackMap[key] = cb;
		return this;
	}

	private setCancelToken() {
		this.cancelSource = axios.CancelToken.source();
		this.config.cancelToken = this.cancelSource.token;
	}

	public cancel(message?: string) {
		const { cancelSource } = this;
		cancelSource && cancelSource.cancel(message);
		this.setCancelToken();
	}

	public pipe<B>(cb: (data: R) => B) {
		this.pipeQueue.push(cb);
		return this as any as AxiosEnhance<any, B>;
	}

	public execute() {
		const { proxy, url, config, callbackMap, pipeQueue } = this;
		config.cancelIgnore || this.cancel();
		proxy.loading = true;
		this.unfinishCount++;
		(this.axiosInstance(url, config) as any as Promise<R>)
			.then((data) => {
				const subscribeFunc = callbackMap["resolve"];
				let pipeData: R = data;
				pipeQueue.forEach((callback) => {
					pipeData = callback(pipeData);
				});
				proxy.data = pipeData;
				subscribeFunc && subscribeFunc(proxy.data);
			})
			.catch((error) => {
				if (axios.isCancel(error)) return;
				const catchFunc = callbackMap["catch"];
				catchFunc && catchFunc(error);
			})
			.finally(() => {
				this.unfinishCount--;
				if (this.unfinishCount === 0) {
					proxy.loading = false;
				}
				const finallyFunc = callbackMap["finally"];
				finallyFunc && finallyFunc();
			});
		return this;
	}
}
