"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Package,
  Calendar,
  HardDrive,
  ShieldCheck,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  GitBranch,
  FileText,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownLite } from "@/components/markdown-lite";
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
}

const CHANNEL_META = [
  { key: "stable" as const, label: "正式版", desc: "稳定渠道，与自动更新的慢走模式一致" },
  { key: "preview" as const, label: "预览版", desc: "抢先体验新功能，可能存在不稳定因素" },
];

export default function DownloadPage() {
  const [data, setData] = useState<DownloadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<"stable" | "preview">("stable");
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

  // 当前渠道：选中的不存在时自动回退到可用渠道
  const activeKey =
    data && data[channel] ? channel : data?.stable ? "stable" : "preview";
  const active = data ? data[activeKey] : null;
  const win = active?.windows || null;
  const isGithub = data?.source === "github";

  const formatSize = (bytes?: number) =>
    bytes ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : "未知";
  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("zh-CN") : "未知";

  const handleDownload = () => {
    if (!win?.url) return;
    window.open(resolveDownloadUrl(downloadSource, win.url), "_blank");
  };

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

  const meta = CHANNEL_META.find((c) => c.key === activeKey)!;

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

      {/* 渠道切换 */}
      <div className="flex flex-wrap items-center gap-2">
        {CHANNEL_META.map((c) => {
          const d = c.key === "stable" ? data.stable : data.preview;
          return (
            <button
              key={c.key}
              type="button"
              disabled={!d}
              onClick={() => setChannel(c.key)}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                activeKey === c.key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
                !d && "opacity-40 cursor-not-allowed"
              )}
            >
              {c.label}
              {d && <span className="ml-1.5 text-xs opacity-70">· {d.version}</span>}
            </button>
          );
        })}
      </div>

      {/* 渠道信息卡 */}
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
                  <Badge variant="outline">{meta.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {meta.desc}
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
                <p className="text-xs text-muted-foreground">文件大小</p>
                <p className="font-semibold text-sm">{formatSize(win?.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={copySha}
              title="点击复制 SHA512"
              className="flex items-center gap-3 rounded-xl border border-border/50 p-3 text-left transition-colors hover:border-primary/50"
            >
              <ShieldCheck className="size-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  SHA512{copied ? "（已复制）" : "（点击复制）"}
                </p>
                <p className="font-mono text-xs text-muted-foreground truncate">
                  {win?.sha512 || "未知"}
                </p>
              </div>
            </button>
          </div>

          {/* 下载区 */}
          {win ? (
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
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
                <span className="text-xs text-muted-foreground">
                  {win.name}
                </span>
              </div>
              <Button size="lg" onClick={handleDownload}>
                <Download className="size-4" />
                下载 Windows 安装包（{active.version}）
              </Button>
              {!active.macos && !active.linux && (
                <p className="text-xs text-muted-foreground">
                  macOS / Linux 版本尚未提供，敬请期待
                </p>
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-border/30 p-4 text-center text-sm text-muted-foreground">
              此渠道暂未提供安装包
            </div>
          )}
        </div>

        {/* 更新内容 */}
        {active.releaseNotes && (
          <div className="border-t border-border/50 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="size-5 text-primary" />
              <h3 className="text-lg font-semibold">版本更新内容</h3>
            </div>
            <MarkdownLite text={active.releaseNotes} />
          </div>
        )}
      </div>
    </div>
  );
}
