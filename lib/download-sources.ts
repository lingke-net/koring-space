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

/** 允许跳转到感谢页并自动下载的地址前缀（官方直链 + 镜像 + 自建 CDN） */
const ALLOWED_DOWNLOAD_PREFIXES = [
  "https://github.com/dream-pep/koring-launcher/releases/download/",
  "https://gh.ddlc.top/https://github.com/dream-pep/koring-launcher/releases/download/",
  "https://gh-proxy.com/https://github.com/dream-pep/koring-launcher/releases/download/",
  "https://ghfast.top/https://github.com/dream-pep/koring-launcher/releases/download/",
  "https://koring-file-api.lenjing.games/",
  "https://koring-launcher-file-api.lenjing.cloud/",
];

/** 校验下载链接是否在白名单内（防止任意地址跳转/自动下载） */
export function isAllowedDownloadUrl(
  url: string | null | undefined
): url is string {
  return (
    typeof url === "string" &&
    ALLOWED_DOWNLOAD_PREFIXES.some((p) => url.startsWith(p))
  );
}

export type DownloadOsKey = "windows" | "macos" | "linux";

export const DOWNLOAD_OS_META: Record<
  DownloadOsKey,
  { label: string; hint: string }
> = {
  windows: { label: "Windows", hint: "Windows 安装包（exe）" },
  macos: { label: "macOS", hint: "macOS 安装包" },
  linux: { label: "Linux", hint: "Linux 安装包" },
};

/** 构造感谢下载页跳转地址（附带 下载链接 / 平台 / SHA512 / 加速类型） */
export function buildDownloadThanksUrl(opts: {
  url: string;
  os: DownloadOsKey;
  source: string;
  sha512?: string;
  name?: string;
  version?: string;
}) {
  const p = new URLSearchParams();
  p.set("url", opts.url);
  p.set("os", opts.os);
  p.set("source", opts.source);
  if (opts.sha512) p.set("sha512", opts.sha512);
  if (opts.name) p.set("name", opts.name);
  if (opts.version) p.set("version", opts.version);
  return `/thanks?${p.toString()}`;
}
