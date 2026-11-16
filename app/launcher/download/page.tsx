"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertCircle,
  ArrowUpRight,
  History,
  Monitor,
  Apple,
  Terminal,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ReleaseNotes } from "@/components/release-notes";
import { PlatformDownloadGrid } from "@/components/platform-download-grid";
import {
  DOWNLOAD_SOURCES,
  resolveDownloadUrl,
  buildDownloadThanksUrl,
  type DownloadSourceKey,
  type DownloadOsKey,
} from "@/lib/download-sources";

interface ChannelPlatform {
  name: string;
  url: string;
  size?: number;
  sha512?: string;
}

interface ChannelData {
  version: string;
  tag?: string;
  channel?: "stable" | "preview";
  releaseDate?: string;
  releaseNotes?: string;
  htmlUrl?: string;
  windows?: ChannelPlatform | null;
  macos?: ChannelPlatform | null;
  linux?: ChannelPlatform | null;
}

interface DownloadData {
  source?: "github" | "legacy";
  stable: ChannelData | null;
  preview: ChannelData | null;
  versions: ChannelData[];
}

const CHANNEL_META = [
  { key: "stable" as const, label: "正式版", desc: "稳定渠道，与自动更新的慢走模式一致" },
  { key: "preview" as const, label: "预览版", desc: "抢先体验新功能，可能存在不稳定因素" },
];

type Selection =
  | { kind: "latest"; channel: "stable" | "preview" }
  | { kind: "version"; version: string };

export default function DownloadPage() {
  const router = useRouter();
  const [data, setData] = useState<DownloadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [downloadSource, setDownloadSource] =
    useState<DownloadSourceKey>("github");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/download-version")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: DownloadData) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // 汇总全部版本（最新渠道条目带 yml 数据，覆盖历史同名条目）
  const allVersions = useMemo<ChannelData[]>(() => {
    if (!data) return [];
    const map = new Map<string, ChannelData>();
    for (const v of data.versions || []) map.set(v.version, v);
    if (data.stable) map.set(data.stable.version, data.stable);
    if (data.preview) map.set(data.preview.version, data.preview);
    return [...map.values()];
  }, [data]);

  // 默认选中：正式版（无则预览版）
  const defaultLatestChannel: "stable" | "preview" =
    data?.stable ? "stable" : "preview";
  const effectiveSelection: Selection =
    selection ?? { kind: "latest", channel: defaultLatestChannel };

  const active = useMemo<ChannelData | null>(() => {
    if (!data) return null;
    if (effectiveSelection.kind === "version") {
      return (
        allVersions.find((v) => v.version === effectiveSelection.version) || null
      );
    }
    return data[effectiveSelection.channel];
  }, [data, effectiveSelection, allVersions]);

  const isGithub = data?.source === "github";
  const win = active?.windows || null;
  const hasAnyDownload = !!(
    active && (active.windows?.url || active.macos?.url || active.linux?.url)
  );

  const formatSize = (bytes?: number) =>
    bytes ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : "未知";
  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("zh-CN") : "未知";

  const copySha = async () => {
    if (!win?.sha512) return;
    try {
      await navigator.clipboard.writeText(win.sha512);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 剪贴板不可用时忽略
    }
  };

  /** 点击下载 -> 跳转感谢下载页（携带 链接/平台/SHA512/加速类型），由该页自动下载 */
  const startThanksDownload = (os: DownloadOsKey) => {
    const info = (
      {
        windows: active?.windows,
        macos: active?.macos,
        linux: active?.linux,
      } as const
    )[os];
    if (!info?.url) return;
    router.push(
      buildDownloadThanksUrl({
        url: resolveDownloadUrl(downloadSource, info.url),
        os,
        source: downloadSource,
        sha512: info.sha512,
        name: info.name,
        version: active?.version,
      })
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <p className="font-mono text-xs text-muted-foreground">正在获取版本信息</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">获取版本信息失败</p>
        <Button variant="outline" className="rounded-full" onClick={() => window.location.reload()}>
          重试
        </Button>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <Inbox className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium text-lg">暂无可用版本</p>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            暂时没有可用的发布版本，请稍后再来看看
          </p>
        </div>
        <a
          href="https://github.com/dream-pep/koring-launcher/releases"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="rounded-full">
            前往 GitHub Releases
            <ArrowUpRight className="size-4" />
          </Button>
        </a>
      </div>
    );
  }

  const activeChannelLabel =
    active.channel === "preview"
      ? CHANNEL_META[1].label
      : CHANNEL_META[0].label;
  const activeIsLatest = effectiveSelection.kind === "latest";
  const activeDesc = activeIsLatest
    ? CHANNEL_META.find((c) => c.key === effectiveSelection.channel)?.desc
    : "历史版本，安装包与更新内容保留展示";

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="flex flex-col items-center pt-14 md:pt-20 pb-12 text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          下载中心 — Download
        </p>
        <h1 className="mt-8 text-4xl md:text-6xl font-bold tracking-tight">
          下载 Koring Launcher
        </h1>
        <p className="mt-6 max-w-lg text-base md:text-lg leading-relaxed text-muted-foreground">
          版本信息与自动更新机制同源（latest.yml），下载安装包即可开始使用。
        </p>
        {isGithub && (
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            版本信息由 GitHub Releases 自动识别
          </p>
        )}
      </section>

      {/* 版本与下载 */}
      <section className="border-t border-border py-10">
        {/* 渠道切换 + 历史版本 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {CHANNEL_META.map((c) => {
              const d = c.key === "stable" ? data.stable : data.preview;
              const isActive =
                effectiveSelection.kind === "latest" &&
                effectiveSelection.channel === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  disabled={!d}
                  onClick={() => setSelection({ kind: "latest", channel: c.key })}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm transition-colors",
                    isActive
                      ? "border-foreground text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                    !d && "opacity-40 cursor-not-allowed"
                  )}
                >
                  {c.label}
                  {d && (
                    <span className="ml-1.5 font-mono text-xs opacity-70">
                      {d.version}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {allVersions.length > 0 && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <History className="size-4 shrink-0" />
              <select
                value={active.version}
                onChange={(e) => setSelection({ kind: "version", version: e.target.value })}
                className="max-w-[16rem] rounded-full border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground outline-none transition-colors focus:border-foreground"
              >
                {allVersions.map((v) => (
                  <option key={v.version} value={v.version}>
                    {v.version}
                    {v.channel === "preview" ? "（预览版）" : "（正式版）"}
                    {" · "}
                    {formatDate(v.releaseDate)}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {/* 版本信息 */}
        <div className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight">
                {active.version}
              </h2>
              <span className="font-mono text-xs text-muted-foreground">
                {activeChannelLabel}
              </span>
            </div>
            {active.htmlUrl && (
              <a
                href={active.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub 发布页
                <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{activeDesc}</p>

          {/* 元信息 */}
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="font-mono text-xs text-muted-foreground">发布时间</p>
              <p className="mt-2 text-sm font-medium">
                {formatDate(active.releaseDate)}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground">安装包大小</p>
              <p className="mt-2 text-sm font-medium">{formatSize(win?.size)}</p>
            </div>
            <div className="min-w-0">
              <p className="font-mono text-xs text-muted-foreground">
                SHA512{win?.sha512 && (copied ? " · 已复制" : " · 点击复制")}
              </p>
              <button
                type="button"
                onClick={copySha}
                disabled={!win?.sha512}
                className="mt-2 block max-w-full text-left"
              >
                <span className="font-mono text-xs text-muted-foreground break-all line-clamp-1 hover:text-foreground transition-colors">
                  {win?.sha512 || "未提供"}
                </span>
              </button>
            </div>
          </div>

          {/* 下载源切换 */}
          {isGithub && hasAnyDownload && (
            <div className="mt-8 flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-muted-foreground">下载源</span>
              {DOWNLOAD_SOURCES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setDownloadSource(s.key)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    downloadSource === s.key
                      ? "border-foreground text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* 平台下载 */}
          <div className="mt-8">
            <PlatformDownloadGrid
              platforms={[
                {
                  key: "windows",
                  label: "Windows",
                  icon: Monitor,
                  download: active.windows
                    ? { name: active.windows.name, url: active.windows.url }
                    : null,
                },
                {
                  key: "macos",
                  label: "macOS",
                  icon: Apple,
                  download: active.macos
                    ? { name: active.macos.name, url: active.macos.url }
                    : null,
                },
                {
                  key: "linux",
                  label: "Linux",
                  icon: Terminal,
                  download: active.linux
                    ? { name: active.linux.name, url: active.linux.url }
                    : null,
                },
              ]}
              onDownload={(p) =>
                startThanksDownload(p.key as DownloadOsKey)
              }
            />
          </div>
        </div>
      </section>

      {/* 此版本的变更 */}
      {active.releaseNotes && (
        <section className="border-t border-border py-10">
          <h3 className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            此版本的变更
          </h3>
          <div className="mt-6">
            <ReleaseNotes text={active.releaseNotes} />
          </div>
        </section>
      )}
    </div>
  );
}
