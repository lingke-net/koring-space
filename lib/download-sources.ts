/** 下载源列表：GitHub 官方直链 + 国内镜像（格式 {镜像}/{GitHub 直链}） */
export const DOWNLOAD_SOURCES = [
  { key: "github", label: "GitHub 官方", url: (u: string) => u },
  { key: "ddlc", label: "镜像 · ddlc", url: (u: string) => `https://gh.ddlc.top/${u}` },
  { key: "proxy", label: "镜像 · proxy", url: (u: string) => `https://gh-proxy.com/${u}` },
  { key: "fast", label: "镜像 · fast", url: (u: string) => `https://ghfast.top/${u}` },
] as const;

export type DownloadSourceKey = (typeof DOWNLOAD_SOURCES)[number]["key"];

export function resolveDownloadUrl(source: DownloadSourceKey, url: string) {
  const s = DOWNLOAD_SOURCES.find((d) => d.key === source);
  return s ? s.url(url) : url;
}

/** 服务端拉取 GitHub 数据（yml / release 页面）时使用的镜像前缀 */
export const DATA_MIRRORS = [
  "https://gh.ddlc.top",
  "https://gh-proxy.com",
  "https://ghfast.top",
] as const;
