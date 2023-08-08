import axios from "axios";
import { axiosInstance } from "../index";
import { createRequest } from "@/utils/axios";

/** 卫星云图 */
export function getFy2Data() {
	return axiosInstance.get<{ data: [] }>("public/getItems", {
		params: { dataType: "FY2/IR2" }
	});
}

/** 卫星云图Axios */
export const getFy2DataByAxios = () =>
	createRequest(
		(dataType?: string) => {
			return axiosInstance.get<{ data: [] }>("public/getItems", {
				params: { dataType }
			});
		},
		{ defaultData: { data: { data: [] } }, defaultParams: ["FY2/IR2"] }
	);

/** 获取水位流量 */
export function getLasterZQ(stcds: string[]) {
	return axios.post<{ z: number; otq: number; stcd: number }[]>(
		"http://121.40.117.96:6509/ysq/stRsvrR/getLasterZQ",
		{ stcds }
	);
}
