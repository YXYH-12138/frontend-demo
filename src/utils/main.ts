/**
 * 拼接路由的path
 * @param rootPath
 * @param path
 * @returns
 */
export function resolveRouterPath(rootPath: string, path: string) {
	if (path.startsWith("/")) return path;
	rootPath.endsWith("/") || (rootPath += "/");
	return rootPath + path;
}

/**
 * 延迟函数
 * @param delay
 * @returns
 */
export async function sleep(delay: number) {
	return new Promise<void>((resolve) => {
		setTimeout(resolve, delay);
	});
}
