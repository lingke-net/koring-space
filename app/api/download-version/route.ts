import { NextResponse } from "next/server";
import {
  fetchReleases,
  pickBetaRelease,
  pickStableRelease,
  pickAsset,
  buildDownloadUrl,
  fetchYmlForRelease,
  isBetaRelease,
  RELEASES_PAGE,
} from "@/lib/github-releases";

/**
 * 下载页版本信息接口
 * 返回：
 *   stable / preview —— 正式版与预览版最新一条（含 latest.yml 数据：文件名/大小/SHA512/发布时间，
 *                       与 electron-updater 自动更新机制一致）
 *   versions         —— 历史版本列表（新 -> 旧，按资产匹配平台，无 yml 数据）
 */

const CACHE_TTL = 15 * 60 * 1000;
const cache = new Map<string, { time: number; value: unknown }>();

const LEGACY_URL =
  "https://koring-launcher-file-api.lenjing.cloud/launcher/beta/version.json";

const HISTORY_LIMIT = 20;

const EXE_PATTERNS = [/setup\.exe$/i, /\.exe$/i];
const MAC_PATTERNS = [/\.dmg$/i, /\.zip$/i, /\.pkg$/i];
const LINUX_PATTERNS = [/\.appimage$/i, /\.deb$/i, /\.rpm$/i, /\.tar\.gz$/i];

/** 按发布资产匹配三个平台（无 yml 数据版本用） */
function platformsFromRelease(release: any) {
  const tag = String(release.tag_name || "");
  const mk = (hit: any) =>
    hit ? { name: hit.name, url: buildDownloadUrl(tag, hit.name) } : null;
  return {
    windows: mk(pickAsset(release, EXE_PATTERNS)),
    macos: mk(pickAsset(release, MAC_PATTERNS)),
    linux: mk(pickAsset(release, LINUX_PATTERNS)),
  };
}

function sortDesc(releases: any[]) {
  return [...(releases || [])].sort((a, b) =>
    String(b.published_at || b.created_at || "").localeCompare(
      String(a.published_at || a.created_at || "")
    )
  );
}

/** 最新渠道条目（带 latest.yml / latest-beta.yml 数据） */
async function buildChannelAsync(release: any, ymlNames: string[]) {
  if (!release) return null;
  const tag = String(release.tag_name || "");
  const version = tag.replace(/^v/i, "");

  // 主源：latest.yml / latest-beta.yml（electron-updater 权威数据）
  const yml = await fetchYmlForRelease(release, ymlNames);
  const ymlFile = yml?.files?.[0];
  const plat = platformsFromRelease(release);
  const windowsName =
    ymlFile?.url || yml?.path || plat.windows?.name || "";

  const windows = windowsName
    ? {
        name: windowsName,
        url: buildDownloadUrl(tag, windowsName),
        size: ymlFile?.size ?? undefined,
        sha512: yml?.sha512 || ymlFile?.sha512 || "",
      }
    : null;

  return {
    version,
    tag,
    channel: isBetaRelease(release) ? "preview" : "stable",
    releaseDate:
      yml?.releaseDate || release.published_at || release.created_at || "",
    releaseNotes: release.body || "",
    htmlUrl: release.html_url || `${RELEASES_PAGE}/tag/${tag}`,
    windows,
    macos: plat.macos,
    linux: plat.linux,
  };
}

/** 历史版本条目（资产匹配，不含 yml） */
function buildHistoryEntry(release: any) {
  const tag = String(release.tag_name || "");
  return {
    version: tag.replace(/^v/i, ""),
    tag,
    channel: isBetaRelease(release) ? "preview" : "stable",
    releaseDate: release.published_at || release.created_at || "",
    releaseNotes: release.body || "",
    htmlUrl: release.html_url || `${RELEASES_PAGE}/tag/${tag}`,
    ...platformsFromRelease(release),
  };
}

function buildLegacyPayload(legacy: any) {
  const win = legacy?.app?.windows;
  const preview: any = {
    version: String(legacy?.version || ""),
    tag: "",
    channel: "preview",
    releaseDate: "",
    releaseNotes: legacy?.aboutversion?.about || "",
    htmlUrl: RELEASES_PAGE,
    windows: win?.DownlodeURL
      ? {
          name: String(win.DownlodeURL).split("/").pop() || "",
          url: win.DownlodeURL,
          size: undefined,
          sha512: "",
        }
      : null,
    macos: null,
    linux: null,
  };
  return { source: "legacy", stable: null, preview, versions: [preview] };
}

export async function GET() {
  const now = Date.now();
  const cached = cache.get("download");
  if (cached && now - cached.time < CACHE_TTL) {
    return NextResponse.json(cached.value);
  }

  let payload: unknown;

  const releases = await fetchReleases();
  if (Array.isArray(releases) && releases.length > 0) {
    const stableRelease = pickStableRelease(releases);
    const betaRelease = pickBetaRelease(releases);

    const [stable, preview] = await Promise.all([
      buildChannelAsync(stableRelease, ["latest.yml"]),
      buildChannelAsync(betaRelease, ["latest-beta.yml", "latest.yml"]),
    ]);

    const versions = sortDesc(releases)
      .filter((r) => r && !r.draft)
      .slice(0, HISTORY_LIMIT)
      .map(buildHistoryEntry);

    payload = { source: "github", stable, preview, versions };
  } else {
    // GitHub 不可达 -> 旧静态源兜底（仅预览渠道）
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
    if (legacy) {
      payload = buildLegacyPayload(legacy);
    } else {
      return NextResponse.json(
        { error: "无法获取版本信息，请稍后重试" },
        { status: 502 }
      );
    }
  }

  cache.set("download", { time: now, value: payload });
  return NextResponse.json(payload);
}
