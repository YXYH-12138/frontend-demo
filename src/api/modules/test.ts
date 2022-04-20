import { axiosInstance1, service1 } from "../index";

/** 卫星云图 */
export function getFy2Data() {
	return service1.createAxiosEnhance<{ data: any[] }>("public/getItems?dataType=FY2/IR2");
}

/** 卫星云图Axios */
export function getFy2DataByAxios() {
	return axiosInstance1.get<{ data: any[] }>("public/getItems?dataType=FY2/IR2");
}
