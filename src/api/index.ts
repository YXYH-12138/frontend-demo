import { createAxios } from "@/utils/axios";

const service1 = createAxios({
	baseURL: "https://www.zj121.com/"
});
const axiosInstance1 = service1.axiosInstance;

export { service1, axiosInstance1 };
