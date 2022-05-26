// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from "axios";

declare module "axios" {
	interface AxiosRequestConfig {
		cancelIgnore?: boolean;
	}
}
