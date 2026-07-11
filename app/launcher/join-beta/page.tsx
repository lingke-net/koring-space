"use client";

import { useEffect, useState } from "react";
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
  Monitor,
  Apple,
  Terminal,
  Loader2,
  AlertCircle,
  Package,
  Hash,
  ArrowUpRight,
  FileText,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface AboutVersion {
  about: string;
  "about-list": Record<string, string>;
}

interface BetaData {
  version: string;
  builddate: string;
  app: {
    windows: PlatformInfo;
    macos: PlatformInfo;
    linux: PlatformInfo;
  };
  aboutversion: AboutVersion;
}

const platforms = [
  { key: "windows" as const, label: "Windows", icon: Monitor },
  { key: "macos" as const, label: "macOS", icon: Apple },
  { key: "linux" as const, label: "Linux", icon: Terminal },
];

export default function JoinBetaPage() {
  const [data, setData] = useState<BetaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activePlatform, setActivePlatform] = useState<PlatformInfo | null>(null);

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

  const handleDownload = (platform: PlatformInfo) => {
    if (platform.licence.isNeedAgreat === "true") {
      setActivePlatform(platform);
      setDialogOpen(true);
    } else {
      window.open(platform.DownlodeURL, "_blank");
    }
  };

  const confirmDownload = () => {
    if (activePlatform?.DownlodeURL) {
      window.open(activePlatform.DownlodeURL, "_blank");
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

  return (
    <div className="flex flex-col w-full h-full gap-10 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">
          加入 Beta 测试
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Koring Launcher
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl">
          参与 Koring Launcher 的 Beta 测试计划，抢先体验最新功能
        </p>
      </div>

      {/* Version Info Card */}
      <div className="rounded-2xl border border-border/50 p-6 bg-background/60 backdrop-blur-xl flex flex-col sm:flex-row gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Package className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">版本号</p>
            <p className="font-semibold text-lg">{data.version}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Hash className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">编译号</p>
            <p className="font-semibold text-lg">{data.builddate}</p>
          </div>
        </div>
      </div>

      {/* Platform Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">选择平台</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {platforms.map(({ key, label, icon: Icon }) => {
            const platform = data.app[key];
            const noVersion = platform.isNoVersion === "true";

            return (
              <div
                key={key}
                className={cn(
                  "rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-300",
                  noVersion
                    ? "border-border/30 opacity-60"
                    : "border-border/50 bg-background/60 backdrop-blur-xl hover:scale-[1.02]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-xl",
                      noVersion ? "bg-muted" : "bg-primary/10"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5",
                        noVersion ? "text-muted-foreground" : "text-primary"
                      )}
                    />
                  </div>
                  <span className="font-semibold text-lg">{label}</span>
                </div>
                {noVersion ? (
                  <p className="text-sm text-muted-foreground">
                    未提供对应版本
                  </p>
                ) : (
                  <Button
                    className="w-full mt-auto"
                    onClick={() => handleDownload(platform)}
                  >
                    <Download className="size-4" />
                    下载
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* About This Version */}
      <div className="rounded-2xl border border-border/50 p-6 md:p-8 bg-background/60 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="size-5 text-primary" />
          <h2 className="text-xl font-semibold">关于此版本</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {data.aboutversion.about}
        </p>
        <ul className="flex flex-col gap-2">
          {Object.entries(data.aboutversion["about-list"]).map(
            ([key, text]) => (
              <li key={key} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-muted-foreground">{text}</span>
              </li>
            )
          )}
        </ul>
      </div>

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
