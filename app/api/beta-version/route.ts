import { NextResponse } from "next/server";

/**
 * 预览版（Beta）发布信息接口
 *
 * 数据源优先级：
 *   1. GitHub Releases API（直连）—— 主源，自动识别最新预览版
 *   2. GitHub Releases API（gh-proxy.com 镜像）—— 国内可达
 *   3. 旧静态源 version.json —— 兜底（同时提供 Beta 协议文本）
 *
 * 发布方案与仓库信息见《Electron Windows自动更新方案规划》：
 *   仓库：dream-pep/koring-launcher
 *   预览版 tag：v{base}-beta.{RUN_NUMBER}（如 v1.2.5-beta.16），GitHub 标记为 prerelease
 *   正式版 tag：v{base}-{RUN_NUMBER}（如 v1.2.5-14），非 prerelease
 *   安装包命名：koring-launcher-{version}-setup.exe（electron-builder artifactName）
 */

const REPO = "dream-pep/koring-launcher";
const GITHUB_API = `https://api.github.com/repos/${REPO}/releases?per_page=100`;
const GITHUB_API_PROXY = `https://gh-proxy.com/https://api.github.com/repos/${REPO}/releases?per_page=100`;
const LEGACY_URL =
  "https://koring-launcher-file-api.lenjing.cloud/launcher/beta/version.json";
const RELEASES_PAGE = `https://github.com/${REPO}/releases`;

const GH_HEADERS: Record<string, string> = {
  "User-Agent": "koring-space-website",
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

/** 预览版 tag 形态：v1.2.5-beta.16 */
const BETA_TAG = /^v?\d+\.\d+\.\d+-beta\.\d+$/i;

const EMPTY_LICENCE = { isNeedAgreat: "false", title: "", text: "", liceURL: "" };

const EMPTY_APPS = {
  windows: { isNoVersion: "true", licence: EMPTY_LICENCE, DownlodeURL: "" },
  macos: { isNoVersion: "true", licence: EMPTY_LICENCE, DownlodeURL: "" },
  linux: { isNoVersion: "true", licence: EMPTY_LICENCE, DownlodeURL: "" },
};

// 简单内存缓存（TTL 15 分钟），避免频繁打 GitHub API / 限流代理
const CACHE_TTL = 15 * 60 * 1000;
const cache = new Map<string, { time: number; value: unknown }>();

async function fetchJson(url: string, headers?: Record<string, string>) {
  const res = await fetch(url, {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/** 依次尝试多个数据源，返回第一个成功的结果 */
async function trySources(
  sources: Array<{ url: string; headers?: Record<string, string> }>
): Promise<unknown | null> {
  for (const s of sources) {
    try {
      const json = await fetchJson(s.url, s.headers);
      if (json !== null && json !== undefined) return json;
    } catch {
      // 继续尝试下一个源
    }
  }
  return null;
}

/** 选出最新预览版 release（prerelease 标记或 -beta.N tag） */
function pickBetaRelease(releases: any[]) {
  const betas = (releases || []).filter(
    (r) =>
      r &&
      !r.draft &&
      (r.prerelease === true || BETA_TAG.test(String(r.tag_name || "")))
  );
  betas.sort((a, b) => {
    const ta = String(a.published_at || a.created_at || "");
    const tb = String(b.published_at || b.created_at || "");
    return tb.localeCompare(ta);
  });
  return betas[0] || null;
}

/** 按文件名匹配 release 资产 */
function pickAsset(release: any, patterns: RegExp[]) {
  const assets = release?.assets || [];
  for (const p of patterns) {
    const hit = assets.find((a: any) => p.test(String(a?.name || "")));
    if (hit) return hit;
  }
  return null;
}

function buildPlatforms(release: any, legacyApp: any) {
  const win = pickAsset(release, [/setup\.exe$/i, /\.exe$/i]);
  const mac = pickAsset(release, [/\.dmg$/i, /\.zip$/i, /\.pkg$/i]);
  const lin = pickAsset(release, [
    /\.appimage$/i,
    /\.deb$/i,
    /\.rpm$/i,
    /\.tar\.gz$/i,
  ]);

  const mk = (hit: any, key: string) => ({
    isNoVersion: hit ? "false" : "true",
    licence: legacyApp?.[key]?.licence ?? EMPTY_LICENCE,
    DownlodeURL: hit?.browser_download_url || "",
  });

  return {
    windows: mk(win, "windows"),
    macos: mk(mac, "macos"),
    linux: mk(lin, "linux"),
  };
}

function buildGithubPayload(release: any, legacy: any) {
  const version = String(release.tag_name || "").replace(/^v/i, "");
  return {
    source: "github",
    version,
    builddate: release.published_at || release.created_at || "",
    tag: release.tag_name,
    htmlUrl: release.html_url || `${RELEASES_PAGE}/tag/${release.tag_name}`,
    releaseNotes: release.body || "",
    app: buildPlatforms(release, legacy?.app),
  };
}

function buildLegacyPayload(legacy: any) {
  return {
    source: "legacy",
    version: String(legacy.version || ""),
    builddate: String(legacy.builddate || ""),
    app: legacy.app ?? EMPTY_APPS,
    aboutversion: legacy.aboutversion,
  };
}

export async function GET() {
  const now = Date.now();
  const cached = cache.get("beta");
  if (cached && now - cached.time < CACHE_TTL) {
    return NextResponse.json(cached.value);
  }

  // 1) 主源：GitHub Releases API（直连 -> 镜像）
  const releases = (await trySources([
    { url: GITHUB_API, headers: GH_HEADERS },
    { url: GITHUB_API_PROXY, headers: GH_HEADERS },
  ])) as any[] | null;

  // 2) 兜底源：旧静态 JSON（也用于补充 Beta 协议 licence）
  const legacy = await trySources([{ url: LEGACY_URL }]);

  let payload: unknown;

  if (Array.isArray(releases) && releases.length > 0) {
    const beta = pickBetaRelease(releases);
    if (beta) {
      payload = buildGithubPayload(beta, legacy);
    } else {
      // GitHub 可达但没有任何预览版
      payload = {
        source: "github",
        noRelease: true,
        version: "",
        builddate: "",
        app: EMPTY_APPS,
      };
    }
  } else if (legacy) {
    payload = buildLegacyPayload(legacy);
  } else {
    return NextResponse.json(
      { error: "无法获取版本信息，请稍后重试" },
      { status: 502 }
    );
  }

  cache.set("beta", { time: now, value: payload });
  return NextResponse.json(payload);
}
