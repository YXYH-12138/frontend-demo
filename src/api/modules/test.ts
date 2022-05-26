import { axiosInstance1, service1 } from "../index";
import { useAxios } from "@vueuse/integrations/useAxios";
import axios from "axios";

/** 卫星云图 */
export function getFy2Data(params?: object) {
	return service1
		.createAxiosEnhance<{ data: any[] }>("public/getItems?dataType=FY2/IR2", { params })
		.pipe(({ data }) => data.data);
}

/** 卫星云图Axios */
export function getFy2DataByAxios() {
	return useAxios<{ data: any[] }>("public/getItems?dataType=FY2/IR2", axiosInstance1);
	// return axiosInstance1.get<{ data: any[] }>("public/getItems?dataType=FY2/IR2");
}

/** 获取水位流量 */
export function getLasterZQ(stcds: string[]) {
	return axios.post<{ z: number; otq: number; stcd: number }[]>(
		"http://121.40.117.96:6509/ysq/stRsvrR/getLasterZQ",
		{ stcds }
	);
}
