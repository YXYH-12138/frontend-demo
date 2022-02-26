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
