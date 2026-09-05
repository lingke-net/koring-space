import { NextResponse } from "next/server";
import {
  fetchReleases,
  pickBetaRelease,
  pickAsset,
  buildDownloadUrl,
  isBetaRelease,
  RELEASES_PAGE,
} from "@/lib/github-releases";

/**
 * 预览版（Beta）发布信息接口
 *
 * 数据源优先级：
 *   1. GitHub Releases API（直连 -> 镜像）—— 主源，自动识别最新预览版
 *   2. 旧静态源 version.json —— 兜底（同时提供 Beta 协议 licence 文本）
 *
 * 返回：
 *   顶层字段 = 最新预览版（licence 从旧静态源补充，下载需同意协议）
 *   versions  = 历史预览版列表（新 -> 旧，按资产匹配平台；无 licence 数据，直接下载）
 */

const LEGACY_URL =
  "https://koring-launcher-file-api.lenjing.cloud/launcher/beta/version.json";

const HISTORY_LIMIT = 10;

const EMPTY_LICENCE = { isNeedAgreat: "false", title: "", text: "", liceURL: "" };

const EMPTY_APPS = {
  windows: { isNoVersion: "true", licence: EMPTY_LICENCE, DownlodeURL: "" },
  macos: { isNoVersion: "true", licence: EMPTY_LICENCE, DownlodeURL: "" },
  linux: { isNoVersion: "true", licence: EMPTY_LICENCE, DownlodeURL: "" },
};

// 简单内存缓存（TTL 15 分钟），避免频繁打 GitHub API / 限流代理
const CACHE_TTL = 15 * 60 * 1000;
const cache = new Map<string, { time: number; value: unknown }>();

function sortDesc(releases: any[]) {
  return [...(releases || [])].sort((a, b) =>
    String(b.published_at || b.created_at || "").localeCompare(
      String(a.published_at || a.created_at || "")
    )
  );
}

/**
 * 平台信息（DownlodeURL 为下载直链）
 * licenceFor：给某平台提供 licence（最新版用旧源协议文本，历史版用空 = 无需同意）
 */
function buildPlatforms(release: any, licenceFor: (key: string) => any) {
  const tag = String(release.tag_name || "");
  const mk = (hit: any, key: string) => ({
    isNoVersion: hit ? "false" : "true",
    licence: licenceFor(key),
    DownlodeURL: hit ? buildDownloadUrl(tag, hit.name) : "",
  });

  return {
    windows: mk(pickAsset(release, [/setup\.exe$/i, /\.exe$/i]), "windows"),
    macos: mk(pickAsset(release, [/\.dmg$/i, /\.zip$/i, /\.pkg$/i]), "macos"),
    linux: mk(
      pickAsset(release, [/\.appimage$/i, /\.deb$/i, /\.rpm$/i, /\.tar\.gz$/i]),
      "linux"
    ),
  };
}

function baseEntry(release: any) {
  const tag = String(release.tag_name || "");
  return {
    version: tag.replace(/^v/i, ""),
    builddate: release.published_at || release.created_at || "",
    tag,
    htmlUrl: release.html_url || `${RELEASES_PAGE}/tag/${tag}`,
    releaseNotes: release.body || "",
  };
}

function buildGithubPayload(beta: any, legacy: any) {
  // 最新预览版：licence 用旧静态源文本（保持原有"需同意 Beta 协议"体验）
  const licenceSrc = legacy?.app || null;
  return {
    source: "github",
    ...baseEntry(beta),
    app: buildPlatforms(beta, (key) => licenceSrc?.[key]?.licence ?? EMPTY_LICENCE),
  };
}

/** 历史预览版条目（无协议要求） */
function buildHistoryEntry(release: any) {
  return {
    ...baseEntry(release),
    app: buildPlatforms(release, () => EMPTY_LICENCE),
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
  const releases = await fetchReleases();

  // 2) 兜底源：旧静态 JSON（也用于补充 Beta 协议 licence）
  let legacy: any = null;
  try {
    const res = await fetch(LEGACY_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (res.ok) legacy = await res.json();
  } catch {
    legacy = null;
  }

  let payload: unknown;

  if (Array.isArray(releases) && releases.length > 0) {
    const beta = pickBetaRelease(releases);
    if (beta) {
      const betaTag = String(beta.tag_name || "");
      const history = sortDesc(releases)
        .filter(
          (r) =>
            isBetaRelease(r) && String(r.tag_name || "") !== betaTag
        )
        .slice(0, HISTORY_LIMIT)
        .map(buildHistoryEntry);

      payload = {
        ...buildGithubPayload(beta, legacy),
        versions: history,
      };
    } else {
      // GitHub 可达但没有任何预览版
      payload = {
        source: "github",
        noRelease: true,
        version: "",
        builddate: "",
        app: EMPTY_APPS,
        versions: [],
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
