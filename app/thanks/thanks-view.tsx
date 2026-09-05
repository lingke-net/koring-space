"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  PartyPopper,
  Download,
  ShieldCheck,
  Copy,
  Check,
  RotateCw,
  Monitor,
  Apple,
  Terminal,
  AlertCircle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DOWNLOAD_SOURCES,
  DOWNLOAD_OS_META,
  isAllowedDownloadUrl,
  type DownloadOsKey,
} from "@/lib/download-sources";

const OS_ICON: Record<string, LucideIcon> = {
  windows: Monitor,
  macos: Apple,
  linux: Terminal,
};

export function ThanksView() {
  const searchParams = useSearchParams();
  const [autoStarted, setAutoStarted] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = searchParams.get("url");
  const osParam = searchParams.get("os") || "";
  const sha512 = searchParams.get("sha512") || "";
  const sourceKey = searchParams.get("source") || "";
  const name = searchParams.get("name") || "";
  const version = searchParams.get("version") || "";

  const os = (
    osParam === "windows" || osParam === "macos" || osParam === "linux"
      ? osParam
      : "windows"
  ) as DownloadOsKey;
  const osMeta = DOWNLOAD_OS_META[os];
  const OsIcon = OS_ICON[os];

  const allowed = isAllowedDownloadUrl(url);
  const sourceLabel = useMemo(() => {
    const s = DOWNLOAD_SOURCES.find((d) => d.key === sourceKey);
    if (s) return s.label;
    return sourceKey === "legacy" ? "官方缓存源" : sourceKey || "默认源";
  }, [sourceKey]);

  /** 触发浏览器下载（隐藏 a 标签，同页不离开） */
  const triggerDownload = () => {
    if (!allowed || !url) return;
    const a = document.createElement("a");
    a.href = url;
    a.rel = "noopener noreferrer";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // 自动开始下载
  useEffect(() => {
    if (!allowed || !url || autoStarted) return;
    setAutoStarted(true);
    const timer = setTimeout(triggerDownload, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, allowed]);

  const copySha = async () => {
    if (!sha512) return;
    try {
      await navigator.clipboard.writeText(sha512);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 忽略剪贴板不可用
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full gap-8 px-4">
      {/* 主卡片 */}
      <div className="w-full max-w-xl rounded-3xl border border-border/50 bg-background/60 backdrop-blur-xl p-8 md:p-10 text-center">
        {allowed ? (
          <>
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
              <PartyPopper className="size-8 text-emerald-500" />
            </div>
            <h1 className="mt-5 text-2xl md:text-3xl font-bold tracking-tight">
              感谢下载 Koring Launcher
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {autoStarted
                ? "下载已自动开始，如果未弹出请点击下方按钮"
                : "下载即将自动开始…"}
            </p>

            {/* 下载内容摘要 */}
            <div className="mt-6 flex flex-col gap-3 text-left">
              <div className="flex items-center gap-3 rounded-xl border border-border/50 p-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <OsIcon className="size-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    下载类型 · {osMeta.hint}
                  </p>
                  <p className="truncate font-medium text-sm">
                    {name || `${osMeta.label} 安装包`}
                    {version ? `（v${version}）` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border/50 p-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Download className="size-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">加速类型</p>
                  <p className="truncate font-medium text-sm">{sourceLabel}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={copySha}
                disabled={!sha512}
                title={sha512 ? "点击复制 SHA512" : undefined}
                className="flex items-center gap-3 rounded-xl border border-border/50 p-3 text-left transition-colors hover:border-primary/50"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <ShieldCheck className="size-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    SHA512 校验值
                    {sha512 && (copied ? "（已复制）" : "（点击复制）")}
                  </p>
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {sha512 || "未提供"}
                  </p>
                </div>
              </button>
            </div>

            {/* 操作 */}
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" onClick={triggerDownload}>
                <RotateCw className="size-4" />
                重新下载
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/download">
                  返回下载中心
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-8 text-destructive" />
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight">
              下载链接无效
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              下载地址不在允许范围内，未自动开始下载。
            </p>
            <div className="mt-7">
              <Button variant="outline" size="lg" asChild>
                <Link href="/download">
                  返回下载中心
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>

      {/* 底部提示 */}
      {allowed && (
        <p className={cn("max-w-xl text-center text-xs text-muted-foreground")}>
          如浏览器拦截下载，请点击上方"重新下载"；安装时建议校验文件 SHA512 完整性。
        </p>
      )}
    </div>
  );
}
