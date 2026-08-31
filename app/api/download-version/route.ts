import { NextResponse } from "next/server";
import {
  fetchReleases,
  pickBetaRelease,
  pickStableRelease,
  pickAsset,
  buildDownloadUrl,
  fetchYmlForRelease,
  RELEASES_PAGE,
} from "@/lib/github-releases";

/**
 * 下载页版本信息接口
 * 同时返回 正式版（latest.yml）与 预览版（latest-beta.yml / latest.yml）两个渠道，
 * 版本 / 安装包文件名 / 大小 / SHA512 / 发布时间 均取自 electron-builder 发布的 yml，
 * 与客户端自动更新机制（electron-updater）保持一致。
 */

const CACHE_TTL = 15 * 60 * 1000;
const cache = new Map<string, { time: number; value: unknown }>();

const LEGACY_URL =
  "https://koring-launcher-file-api.lenjing.cloud/launcher/beta/version.json";

async function buildChannelAsync(
  release: any,
  ymlNames: string[],
  fallbackExePatterns: RegExp[]
) {
  if (!release) return null;
  const tag = String(release.tag_name || "");
  const version = tag.replace(/^v/i, "");

  // 主源：latest.yml / latest-beta.yml（electron-updater 权威数据）
  const yml = await fetchYmlForRelease(release, ymlNames);
  const ymlFile = yml?.files?.[0];
  const fileName = ymlFile?.url || yml?.path || "";

  const windowsFile = fileName
    ? { name: fileName }
    : pickAsset(release, fallbackExePatterns);

  const mac = pickAsset(release, [/\.dmg$/i, /\.zip$/i, /\.pkg$/i]);
  const lin = pickAsset(release, [
    /\.appimage$/i,
    /\.deb$/i,
    /\.rpm$/i,
    /\.tar\.gz$/i,
  ]);

  return {
    version,
    tag,
    releaseDate: yml?.releaseDate || release.published_at || release.created_at || "",
    releaseNotes: release.body || "",
    htmlUrl: release.html_url || `${RELEASES_PAGE}/tag/${tag}`,
    windows: windowsFile
      ? {
          name: windowsFile.name,
          url: buildDownloadUrl(tag, windowsFile.name),
          size: ymlFile?.size ?? undefined,
          sha512: yml?.sha512 || ymlFile?.sha512 || "",
        }
      : null,
    macos: mac
      ? { name: mac.name, url: buildDownloadUrl(tag, mac.name) }
      : null,
    linux: lin
      ? { name: lin.name, url: buildDownloadUrl(tag, lin.name) }
      : null,
  };
}

function buildLegacyPayload(legacy: any) {
  const win = legacy?.app?.windows;
  const preview: any = {
    version: String(legacy?.version || ""),
    tag: "",
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
  return { source: "legacy", stable: null, preview };
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
      buildChannelAsync(stableRelease, ["latest.yml"], [/setup\.exe$/i, /\.exe$/i]),
      buildChannelAsync(
        betaRelease,
        ["latest-beta.yml", "latest.yml"],
        [/setup\.exe$/i, /\.exe$/i]
      ),
    ]);

    payload = { source: "github", stable, preview };
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
