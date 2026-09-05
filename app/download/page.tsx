"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Calendar,
  HardDrive,
  ShieldCheck,
  History,
  Monitor,
  Apple,
  Terminal,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  GitBranch,
  FileText,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ReleaseNotes } from "@/components/release-notes";
import { PlatformDownloadGrid } from "@/components/platform-download-grid";
import {
  DOWNLOAD_SOURCES,
  resolveDownloadUrl,
  type DownloadSourceKey,
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

  const handlePlatformDownload = (url?: string | null) => {
    if (!url) return;
    window.open(resolveDownloadUrl(downloadSource, url), "_blank");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">正在获取版本信息...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="size-8 text-destructive" />
        <p className="text-muted-foreground">获取版本信息失败</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          重试
        </Button>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <Inbox className="size-10 text-muted-foreground" />
        <div>
          <p className="font-semibold text-lg">暂无可用版本</p>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            暂时没有可用的发布版本，请稍后再来看看
          </p>
        </div>
        <a
          href="https://github.com/dream-pep/koring-launcher/releases"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline">
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
    <div className="flex flex-col w-full h-full gap-10 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">
          下载中心
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Koring Launcher
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl">
          基于 Electron 的 Minecraft 启动器，版本信息与自动更新机制同源（
          latest.yml），下载安装包即可开始使用
        </p>
        {isGithub && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <GitBranch className="size-3" />
            版本信息由 GitHub Releases 自动识别
          </span>
        )}
      </div>

      {/* 渠道切换 + 历史版本 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                  "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground",
                  !d && "opacity-40 cursor-not-allowed"
                )}
              >
                {c.label}
                {d && (
                  <span className="ml-1.5 text-xs opacity-70">· {d.version}</span>
                )}
              </button>
            );
          })}
        </div>

        {allVersions.length > 0 && (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <History className="size-4 shrink-0" />
            <span className="shrink-0">历史版本</span>
            <select
              value={active.version}
              onChange={(e) => setSelection({ kind: "version", version: e.target.value })}
              className="max-w-[16rem] rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
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

      {/* 版本信息卡 */}
      <div className="rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                <Package className="size-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {active.version}
                  </h2>
                  <Badge variant="outline">{activeChannelLabel}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {activeDesc}
                </p>
              </div>
            </div>
            {active.htmlUrl && (
              <a
                href={active.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary underline underline-offset-3 hover:text-primary/80"
              >
                在 GitHub 查看发布页
                <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </div>

          {/* 元信息 */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-border/50 p-3">
              <Calendar className="size-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">发布时间</p>
                <p className="font-semibold text-sm">
                  {formatDate(active.releaseDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/50 p-3">
              <HardDrive className="size-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">安装包大小</p>
                <p className="font-semibold text-sm">{formatSize(win?.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={copySha}
              disabled={!win?.sha512}
              title={win?.sha512 ? "点击复制 SHA512" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl border border-border/50 p-3 text-left transition-colors",
                win?.sha512 && "hover:border-primary/50"
              )}
            >
              <ShieldCheck className="size-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  SHA512{win?.sha512 && (copied ? "（已复制）" : "（点击复制）")}
                </p>
                <p className="font-mono text-xs text-muted-foreground truncate">
                  {win?.sha512 || "未提供"}
                </p>
              </div>
            </button>
          </div>

          {/* 下载源切换 */}
          {isGithub && hasAnyDownload && (
            <div className="mt-6 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">下载源</span>
              {DOWNLOAD_SOURCES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setDownloadSource(s.key)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    downloadSource === s.key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* 平台下载（按钮常驻，无版本则禁用） */}
          <div className="mt-6">
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
              onDownload={(p) => handlePlatformDownload(p.download?.url)}
            />
          </div>
        </div>

        {/* 此版本的变更 */}
        {active.releaseNotes && (
          <div className="border-t border-border/50 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="size-5 text-primary" />
              <h3 className="text-lg font-semibold">此版本的变更</h3>
            </div>
            <ReleaseNotes text={active.releaseNotes} />
          </div>
        )}
      </div>
    </div>
  );
}
