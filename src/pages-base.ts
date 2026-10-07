/** Local builds stay portable. CI passes configure-pages' authoritative base path. */
export function pagesBase(basePath?: string, repository?: string): string {
  if (basePath !== undefined) {
    const path = basePath.trim().replace(/^\/+|\/+$/g, "");
    return path ? `/${path}/` : "/";
  }
  const name = repository?.split("/")[1];
  return name && !name.toLowerCase().endsWith(".github.io")
    ? `/${name}/`
    : "./";
}
