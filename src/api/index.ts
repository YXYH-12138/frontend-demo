import { createAxios } from "@/utils/axios";

const axiosInstance = createAxios({
	baseURL: "https://www.zj121.com/"
});

export { axiosInstance };
