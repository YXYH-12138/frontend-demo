import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Canceler } from "axios";
import { AxiosEnhance } from "./axios-enhance";

const enhanceWeakMap = new WeakMap<AxiosInstance, AxiosEnhance[]>();

const serviceCache: Service[] = [];

export class Service {
	public readonly axiosInstance: AxiosInstance;
	public readonly config?: AxiosRequestConfig;
	// 保存取消请求的方法
	private cancelers: Canceler[] = [];

	public get url() {
		return this.config?.url || "";
	}

	constructor(config: AxiosRequestConfig) {
		this.config = config;
		this.axiosInstance = axios.create(config);
		this.axiosInstance.interceptors.request.use(this.setCancelToken.bind(this));
	}

	/**
	 * 设置取消请求的token
	 */
	private setCancelToken(config: AxiosRequestConfig) {
		if (!config.cancelToken) {
			config.cancelToken = new axios.CancelToken((cancel) => {
				this.cancelers.push(cancel);
			});
		}
		return config;
	}

	/**
	 * 取消所有请求
	 */
	public cancelAll() {
		const { axiosInstance, cancelers } = this;
		const enhances = enhanceWeakMap.get(axiosInstance);
		if (enhances && enhances.length > 0) {
			enhances.forEach((enhance) => enhance.cancel());
		}
		cancelers.forEach((canceler) => canceler());
		cancelers.length = 0;
	}

	/**
	 * 创建AxiosEnhance
	 * @param url
	 * @param config
	 * @returns
	 */
	public createAxiosEnhance<T = any, R = AxiosResponse<T>>(
		url: string,
		config?: AxiosRequestConfig
	) {
		const { axiosInstance } = this;
		const axiosEnhance = new AxiosEnhance<T, R>(axiosInstance, url, config);
		let current = enhanceWeakMap.get(axiosInstance);
		if (!current) {
			current = [axiosEnhance as AxiosEnhance<any, any>];
			enhanceWeakMap.set(axiosInstance, current);
		} else {
			current.push(axiosEnhance as AxiosEnhance<any, any>);
		}
		return axiosEnhance;
	}
}

export function cancelAll() {
	serviceCache.forEach((service) => service.cancelAll());
}

export function createAxios(config: AxiosRequestConfig) {
	const service = new Service(config);
	serviceCache.push(service);
	return service;
}

export { AxiosEnhance };
