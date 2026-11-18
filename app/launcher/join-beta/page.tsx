"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Loader2,
  AlertCircle,
  Package,
  Hash,
  Calendar,
  GitBranch,
  PackageOpen,
  ArrowUpRight,
  FileText,
  History,
  Monitor,
  Apple,
  Terminal,
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

interface License {
  isNeedAgreat: string;
  title: string;
  text: string;
  liceURL: string;
}

interface PlatformInfo {
  isNoVersion: string;
  licence: License;
  DownlodeURL: string;
}

interface AppInfo {
  windows: PlatformInfo;
  macos: PlatformInfo;
  linux: PlatformInfo;
}

interface AboutVersion {
  about: string;
  "about-list": Record<string, string>;
}

/** 历史预览版条目（与顶层字段同构，可覆盖到页面上） */
interface BetaVersionItem {
  version: string;
  builddate: string;
  tag?: string;
  htmlUrl?: string;
  releaseNotes?: string;
  app: AppInfo;
}

interface BetaData {
  version: string;
  builddate: string;
  /** 数据来源：github = GitHub Releases 自动识别；legacy = 旧静态源兜底 */
  source?: "github" | "legacy";
  tag?: string;
  htmlUrl?: string;
  releaseNotes?: string;
  /** GitHub 可达但没有预览版时的标记 */
  noRelease?: boolean;
  app: AppInfo;
  aboutversion?: AboutVersion;
  /** 历史预览版列表（新 -> 旧） */
  versions?: BetaVersionItem[];
}

const PLATFORM_SLOTS = ["windows", "macos", "linux"] as const;

export default function JoinBetaPage() {
  const router = useRouter();
  const [data, setData] = useState<BetaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activePlatform, setActivePlatform] = useState<PlatformInfo | null>(null);
  const [pendingOs, setPendingOs] = useState<DownloadOsKey>("windows");
  const [downloadSource, setDownloadSource] = useState<DownloadSourceKey>("github");
  /** null = 最新预览版（顶层数据），否则为 data.versions 中的历史版本号 */
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/beta-version")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: BetaData) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // 当前展示的版本：选中的历史版本会覆盖顶层字段（保留 source/versions 等）
  const active = useMemo<BetaData | null>(() => {
    if (!data) return null;
    if (selectedVersion) {
      const item = data.versions?.find((v) => v.version === selectedVersion);
      if (item) return { ...data, ...item };
    }
    return data;
  }, [data, selectedVersion]);

  const isGithub = active?.source === "github";
  const hasAnyDownload = !!(
    active &&
    PLATFORM_SLOTS.some((k) => active.app[k].DownlodeURL)
  );

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("zh-CN") : "未知";

  /** 跳转感谢下载页（携带 链接/平台/SHA512/加速类型），由该页自动下载 */
  const goThanks = (url: string, os: DownloadOsKey) => {
    router.push(
      buildDownloadThanksUrl({
        url,
        os,
        source: downloadSource,
        version: active?.version,
      })
    );
  };

  const handleDownload = (platform: PlatformInfo, os: DownloadOsKey) => {
    if (!platform.DownlodeURL) return;
    const url = resolveDownloadUrl(downloadSource, platform.DownlodeURL);
    if (platform.licence.isNeedAgreat === "true") {
      setActivePlatform(platform);
      setPendingOs(os);
      setDialogOpen(true);
    } else {
      goThanks(url, os);
    }
  };

  const confirmDownload = () => {
    if (activePlatform?.DownlodeURL) {
      goThanks(
        resolveDownloadUrl(downloadSource, activePlatform.DownlodeURL),
        pendingOs
      );
    }
    setDialogOpen(false);
    setActivePlatform(null);
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

  if (data.noRelease) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <PackageOpen className="size-10 text-muted-foreground" />
        <div>
          <p className="font-semibold text-lg">暂无预览版本</p>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            GitHub Releases 中暂时没有可用的预览（Beta）版本，请稍后再来看看
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

  if (!active) return null;

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="pt-14 md:pt-20 pb-12">
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Beta 测试 · Koring Launcher
        </p>
        <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
          抢先体验 Koring Launcher
        </h1>
        <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-muted-foreground">
          参与 Beta 测试计划，抢先体验最新功能，帮助我们把启动器做得更好。
        </p>
        {isGithub && (
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            版本信息由 GitHub Releases 自动识别
            {active.htmlUrl && (
              <>
                {" · "}
                <a
                  href={active.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
                >
                  GitHub 发布页
                </a>
              </>
            )}
          </p>
        )}
      </section>

      {/* 版本信息 — 编辑式，无卡片 */}
      <section className="border-t border-border py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight">
              {active.version}
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              预览版
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
            <span className="font-mono">
              {isGithub ? formatDate(active.builddate) : active.builddate}
            </span>
          </div>
        </div>

        {/* 历史版本选择 */}
        {data.versions && data.versions.length > 0 && (
          <label className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-mono text-xs">历史版本</span>
            <select
              value={selectedVersion ?? ""}
              onChange={(e) => setSelectedVersion(e.target.value || null)}
              className="max-w-[16rem] rounded-full border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground outline-none transition-colors focus:border-foreground"
            >
              <option value="">最新 {data.version}</option>
              {data.versions.map((v) => (
                <option key={v.version} value={v.version}>
                  {v.version} · {formatDate(v.builddate)}
                </option>
              ))}
            </select>
          </label>
        )}

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
                download: active.app.windows.DownlodeURL
                  ? { url: active.app.windows.DownlodeURL }
                  : null,
                hint: "未提供对应版本",
              },
              {
                key: "macos",
                label: "macOS",
                icon: Apple,
                download: active.app.macos.DownlodeURL
                  ? { url: active.app.macos.DownlodeURL }
                  : null,
                hint: "未提供对应版本",
              },
              {
                key: "linux",
                label: "Linux",
                icon: Terminal,
                download: active.app.linux.DownlodeURL
                  ? { url: active.app.linux.DownlodeURL }
                  : null,
                hint: "未提供对应版本",
              },
            ]}
            onDownload={(slot) => {
              const info = active.app[slot.key as keyof AppInfo];
              if (info?.DownlodeURL) handleDownload(info, slot.key as DownloadOsKey);
            }}
          />
        </div>
      </section>

      {/* 此版本的更新 */}
      {(active.releaseNotes || active.aboutversion) && (
        <section className="border-t border-border py-10">
          <h3 className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            此版本的更新
          </h3>
          <div className="mt-6">
            {active.releaseNotes ? (
              <ReleaseNotes text={active.releaseNotes} />
            ) : active.aboutversion ? (
              <>
                <p className="leading-relaxed text-muted-foreground">
                  {active.aboutversion.about}
                </p>
                {Object.keys(active.aboutversion["about-list"] || {}).length > 0 && (
                  <ul className="mt-4 flex flex-col gap-2">
                    {Object.entries(active.aboutversion["about-list"]).map(
                      ([key, text]) => (
                        <li key={key} className="flex items-start gap-2 text-sm">
                          <span className="mt-1.5 size-1.5 rounded-full bg-foreground shrink-0" />
                          <span className="text-muted-foreground">{text}</span>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </>
            ) : null}
          </div>
        </section>
      )}

      {/* License Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{activePlatform?.licence.title}</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed whitespace-pre-line mt-2">
              {activePlatform?.licence.text}
            </DialogDescription>
          </DialogHeader>
          {activePlatform?.licence.liceURL && (
            <a
              href={activePlatform.licence.liceURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline underline-offset-3 hover:text-primary/80 flex items-center gap-1 w-fit"
            >
              <ArrowUpRight className="size-3.5" />
              查看《Koring APP Beta 测试协议》
            </a>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={confirmDownload}>
              <ArrowUpRight className="size-4" />
              同意并下载
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
