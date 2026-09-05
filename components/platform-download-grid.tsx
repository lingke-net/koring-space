import React from "react";
import {
  Monitor,
  Apple,
  Terminal,
  Download,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 平台下载网格（Windows / macOS / Linux 三卡）
 * 三个平台按钮常驻；某平台没有对应安装包时按钮置灰禁用（不删除），
 * 并在卡内提示"暂未提供此平台版本"。
 */

export interface PlatformDownload {
  /** 展示文件名（可选） */
  name?: string;
  url: string;
}

export interface PlatformSlot {
  key: string;
  label: string;
  icon: LucideIcon;
  /** url 为空/缺失 = 该平台暂无版本，按钮禁用 */
  download?: PlatformDownload | null;
  /** 无版本时的提示文案 */
  hint?: string;
}

interface PlatformDownloadGridProps {
  platforms: PlatformSlot[];
  onDownload: (slot: PlatformSlot) => void;
  className?: string;
}

export function PlatformDownloadGrid({
  platforms,
  onDownload,
  className,
}: PlatformDownloadGridProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-4", className)}>
      {platforms.map((p) => {
        const available = !!p.download?.url;
        return (
          <div
            key={p.key}
            className={cn(
              "rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-300",
              available
                ? "border-border/50 bg-background/60 backdrop-blur-xl hover:scale-[1.02]"
                : "border-border/30 opacity-60"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl",
                  available ? "bg-primary/10" : "bg-muted"
                )}
              >
                <p.icon
                  className={cn(
                    "size-5",
                    available ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </div>
              <span className="font-semibold text-lg">{p.label}</span>
            </div>
            <div className="mt-auto">
              <Button
                className="w-full"
                disabled={!available}
                title={available ? undefined : "该平台暂未提供安装包"}
                onClick={() => available && onDownload(p)}
              >
                <Download className="size-4" />
                下载
              </Button>
              {!available && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {p.hint || "暂未提供此平台版本"}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
