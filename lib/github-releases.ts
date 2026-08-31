import { DATA_MIRRORS } from "./download-sources";

/**
 * GitHub Releases 共享辅助函数
 * 发布方案见《Electron Windows自动更新方案规划》：
 *   仓库：dream-pep/koring-launcher
 *   预览版 tag：v{base}-beta.{RUN_NUMBER}（如 v1.2.5-beta.16），GitHub 标记为 prerelease
 *   正式版 tag：v{base}-{RUN_NUMBER}（如 v1.2.5-14），非 prerelease
 *   electron-builder 发布产物：latest.yml / latest-beta.yml + koring-launcher-{version}-setup.exe
 */

export const REPO = "dream-pep/koring-launcher";
export const GITHUB_API = `https://api.github.com/repos/${REPO}/releases?per_page=100`;
export const GITHUB_API_PROXY = `https://gh-proxy.com/https://api.github.com/repos/${REPO}/releases?per_page=100`;
export const RELEASES_PAGE = `https://github.com/${REPO}/releases`;

const GH_HEADERS: Record<string, string> = {
  "User-Agent": "koring-space-website",
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

/** 预览版 tag 形态：v1.2.5-beta.16 */
export const BETA_TAG = /^v?\d+\.\d+\.\d+-beta\.\d+$/i;

interface FetchResult {
  ok: boolean;
  text: string;
  json: any;
}

async function fetchRaw(
  url: string,
  headers?: Record<string, string>
): Promise<FetchResult> {
  const res = await fetch(url, {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    // 非 JSON
  }
  return { ok: res.ok, text, json };
}

/** 依次尝试多个源，返回第一个成功的结果（raw: true 时返回文本，否则返回 JSON） */
export async function trySources(
  sources: Array<{ url: string; headers?: Record<string, string>; raw?: boolean }>
): Promise<unknown | null> {
  for (const s of sources) {
    try {
      const r = await fetchRaw(s.url, s.headers);
      if (!r.ok) continue;
      if (s.raw) return r.text;
      if (r.json !== null && r.json !== undefined) return r.json;
    } catch {
      // 继续尝试下一个源
    }
  }
  return null;
}

/** 拉取 release 列表（直连 -> 镜像代理） */
export async function fetchReleases(): Promise<any[] | null> {
  const releases = await trySources([
    { url: GITHUB_API, headers: GH_HEADERS },
    { url: GITHUB_API_PROXY, headers: GH_HEADERS },
  ]);
  return Array.isArray(releases) ? releases : null;
}

function byPublishedDesc(a: any, b: any) {
  const ta = String(a.published_at || a.created_at || "");
  const tb = String(b.published_at || b.created_at || "");
  return tb.localeCompare(ta);
}

/** 最新预览版 release（prerelease 标记或 -beta.N tag） */
export function pickBetaRelease(releases: any[]) {
  const betas = (releases || []).filter(
    (r) =>
      r &&
      !r.draft &&
      (r.prerelease === true || BETA_TAG.test(String(r.tag_name || "")))
  );
  betas.sort(byPublishedDesc);
  return betas[0] || null;
}

/** 最新正式版 release（非 prerelease、非 draft） */
export function pickStableRelease(releases: any[]) {
  const stables = (releases || []).filter(
    (r) => r && !r.draft && r.prerelease !== true
  );
  stables.sort(byPublishedDesc);
  return stables[0] || null;
}

/** 按文件名匹配 release 资产 */
export function pickAsset(release: any, patterns: RegExp[]) {
  const assets = release?.assets || [];
  for (const p of patterns) {
    const hit = assets.find((a: any) => p.test(String(a?.name || "")));
    if (hit) return hit;
  }
  return null;
}

/** 构造 GitHub 下载直链 */
export function buildDownloadUrl(tag: string, fileName: string) {
  return `https://github.com/${REPO}/releases/download/${tag}/${encodeURIComponent(
    fileName
  )}`;
}

/**
 * 解析 electron-builder 的 latest.yml 格式：
 *   version / files: [{url, sha512, size}] / path / sha512 / releaseDate
 */
export function parseLatestYml(text: string) {
  const out: {
    version?: string;
    path?: string;
    sha512?: string;
    size?: number;
    releaseDate?: string;
    files: Array<{ url: string; sha512?: string; size?: number }>;
  } = { files: [] };

  const unquote = (v: string) => v.trim().replace(/^['"](.*)['"]$/, "$1");
  let currentFile: { url?: string; sha512?: string; size?: number } | null = null;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/\r$/, "");
    if (!line.trim() || line.trim().startsWith("#")) continue;

    // 列表项：  - url: xxx /     sha512: yyy
    const entry = line.match(/^(\s*)-\s+([A-Za-z0-9_-]+):\s*(.*)$/);
    if (entry) {
      currentFile = {};
      out.files.push(currentFile as { url: string });
      const key = entry[2];
      const val = unquote(entry[3]);
      if (key === "url") currentFile.url = val;
      else if (key === "sha512") currentFile.sha512 = val;
      else if (key === "size") currentFile.size = Number(val);
      continue;
    }

    const kv = line.match(/^(\s*)([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const indent = kv[1].length;
    const key = kv[2];
    const val = unquote(kv[3]);

    if (indent === 0) {
      if (key === "version") out.version = val;
      else if (key === "path") out.path = val;
      else if (key === "sha512") out.sha512 = val;
      else if (key === "size") out.size = Number(val);
      else if (key === "releaseDate") out.releaseDate = val;
    } else if (currentFile) {
      if (key === "sha512") currentFile.sha512 = val;
      else if (key === "size") currentFile.size = Number(val);
    }
  }

  return out;
}

/**
 * 拉取 release 的 latest.yml / latest-beta.yml 内容并解析
 * （直连 -> 镜像兜底，自动过滤 HTML 垃圾页）
 */
export async function fetchYmlForRelease(
  release: any,
  names: string[]
): Promise<ReturnType<typeof parseLatestYml> | null> {
  if (!release) return null;
  const assets = release.assets || [];
  const asset = names
    .map((n) => assets.find((a: any) => a?.name === n))
    .find(Boolean);
  if (!asset?.browser_download_url) return null;

  const text = await trySources([
    { url: asset.browser_download_url, headers: GH_HEADERS, raw: true },
    ...DATA_MIRRORS.map((m) => ({
      url: `${m}/${asset.browser_download_url}`,
      raw: true,
    })),
  ]);

  if (typeof text !== "string") return null;
  const parsed = parseLatestYml(text);
  return parsed.version ? parsed : null;
}
