import React from "react";
import {
  Sparkles,
  Bug,
  Zap,
  RefreshCw,
  FileText,
  Rocket,
  Wrench,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownLite } from "./markdown-lite";

/**
 * Release Notes 结构化渲染器
 *
 * 适配 Koring Launcher 发布说明格式（scripts/release-notes.ps1 生成）：
 *   # Koring Launcher Releases X
 *   ## 版本信息
 *   当前版本 {FullVersion}
 *   编译状态：BETA / RUN
 *   签名状态：已签名
 *   构建来源：commit xxxxxx
 *   ## 更新了什么内容
 *   <details><summary>·Commit 1cf906d</summary>提交说明…</details>
 *
 * 渲染策略：
 *   - 版本信息行 -> 顶部小徽章（编译状态 / 签名状态 / 构建来源）
 *   - 每条 <details> commit -> 按提交类型（feat/fix/perf/… 或 修复/新增/优化/…）
 *     归类到独立卡片，每种类型带独立图标；卡片内每条 commit 仍是可折叠的
 *     <details>（原生 HTML，无 JS 依赖）
 *   - 非 commit 结构内容 -> 回退 MarkdownLite 常规渲染
 */

export type ChangeType =
  | "feat"
  | "fix"
  | "perf"
  | "refactor"
  | "docs"
  | "build"
  | "other";

interface TypeMeta {
  label: string;
  icon: LucideIcon;
  color: string; // 图标颜色 class
}

const TYPE_META: Record<ChangeType, TypeMeta> = {
  feat: { label: "新增功能", icon: Sparkles, color: "text-emerald-500" },
  fix: { label: "问题修复", icon: Bug, color: "text-rose-500" },
  perf: { label: "体验优化", icon: Zap, color: "text-amber-500" },
  refactor: { label: "代码重构", icon: RefreshCw, color: "text-violet-500" },
  docs: { label: "文档", icon: FileText, color: "text-sky-500" },
  build: { label: "构建与发布", icon: Rocket, color: "text-slate-500" },
  other: { label: "其他", icon: Wrench, color: "text-muted-foreground" },
};

const CARD_ORDER: ChangeType[] = [
  "feat",
  "fix",
  "perf",
  "refactor",
  "docs",
  "build",
  "other",
];

export interface CommitInfo {
  hash: string;
  subject: string;
  body: string;
  type: ChangeType;
}

export interface ReleaseInfoItem {
  label: string;
  value: string;
}

export interface ParsedReleaseBody {
  mode: "structured" | "plain";
  info: ReleaseInfoItem[];
  commits: CommitInfo[];
}

/** 根据提交说明推断变更类型（Conventional Commits / 中文前缀 / 英文动词） */
export function classifyCommit(subject: string): ChangeType {
  const s = (subject || "").trim();
  if (!s) return "other";

  // Conventional Commits: type(scope)?: message
  const m = s.match(
    /^(feat|feature|fix|perf|refactor|docs|style|test|chore|build|ci|revert)(?:\([^)]*\))?:\s*[\s\S]*$/i
  );
  if (m) {
    const t = m[1].toLowerCase();
    if (t === "feat" || t === "feature") return "feat";
    if (t === "fix") return "fix";
    if (t === "perf") return "perf";
    if (t === "refactor") return "refactor";
    if (t === "docs") return "docs";
    if (t === "build" || t === "ci") return "build";
    return "other"; // style/test/chore/revert
  }

  // 中文关键词
  if (/修复/.test(s)) return "fix";
  if (/新增|添加|新功能|支持/.test(s)) return "feat";
  if (/优化|改进|提升|完善|增强/.test(s)) return "perf";
  if (/重构/.test(s)) return "refactor";

  // 无前缀英文
  const en = s.match(/^([A-Za-z]+)\b/);
  if (en) {
    const w = en[1].toLowerCase();
    if (/^(fix|correct|resolve|repair)/.test(w)) return "fix";
    if (
      /^(add|new|create|implement|introduce|integrate|enable|import|support|build)/.test(w)
    )
      return "feat";
    if (/^(stabilize|adjust|improve|optimize|update|refactor|polish)/.test(w))
      return "perf";
  }

  return "other";
}

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, "").trim();
}

/** 解析发布说明正文 */
export function parseReleaseBody(text: string): ParsedReleaseBody {
  if (!text || !text.trim()) return { mode: "plain", info: [], commits: [] };

  const detailsBlocks = [...text.matchAll(/<details([^>]*)>([\s\S]*?)<\/details>/gi)];

  if (detailsBlocks.length === 0) {
    return { mode: "plain", info: [], commits: [] };
  }

  // 版本信息行（正文顶层，不含 details 内部）
  const info: ReleaseInfoItem[] = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(
      /^(当前版本|编译状态|签名状态|构建来源)\s*[:：]?\s*(.+)$/
    );
    if (m) info.push({ label: m[1], value: m[2].trim() });
  }

  const commits: CommitInfo[] = detailsBlocks.map((m) => {
    const inner = m[2];
    // summary 是标题行；正文 = inner 去掉 summary 后的部分
    const summaryMatch = inner.match(
      /<summary[^>]*>([\s\S]*?)<\/summary>/i
    );
    const summaryText = summaryMatch ? stripHtml(summaryMatch[1]) : "";
    const content = summaryMatch
      ? inner.replace(summaryMatch[0], "")
      : inner;

    const hashMatch =
      summaryText.match(/[0-9a-fA-F]{7,40}/) ||
      content.match(/[0-9a-fA-F]{7,40}/);
    const hash = hashMatch ? hashMatch[0] : "";

    const lines = content
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const subject =
      lines[0] ||
      summaryText.replace(/^[·\s]*Commit\s*/i, "").trim() ||
      "未命名变更";
    const body = lines.slice(1).join("\n");

    return {
      hash,
      subject,
      body,
      type: classifyCommit(subject),
    };
  });

  return { mode: "structured", info, commits };
}

function CommitRow({ commit }: { commit: CommitInfo }) {
  const meta = TYPE_META[commit.type];
  return (
    <li className="border-t border-border/40 first:border-t-0">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
          <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] leading-none text-muted-foreground">
            {commit.hash ? `#${commit.hash.slice(0, 7)}` : "commit"}
          </span>
          <meta.icon className={cn("size-4 shrink-0", meta.color)} />
          <span className="min-w-0 flex-1 leading-snug">{commit.subject}</span>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
        </summary>
        {commit.body && (
          <div className="border-l-2 border-border/60 px-4 pb-3 ml-[3.4rem]">
            <MarkdownLite text={commit.body} />
          </div>
        )}
      </details>
    </li>
  );
}

function TypeCard({ type, commits }: { type: ChangeType; commits: CommitInfo[] }) {
  const meta = TYPE_META[type];
  if (commits.length === 0) return null;
  return (
    <section className="overflow-hidden rounded-xl border border-border/50 bg-background/40">
      <header className="flex items-center gap-2 border-b border-border/50 bg-background/60 px-4 py-3">
        <span className="flex size-6 items-center justify-center rounded-md bg-muted">
          <meta.icon className={cn("size-4", meta.color)} />
        </span>
        <span className="font-semibold text-sm">{meta.label}</span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {commits.length}
        </span>
      </header>
      <ul className="divide-y divide-border/40">
        {commits.map((c, i) => (
          <CommitRow key={c.hash || `${c.subject}-${i}`} commit={c} />
        ))}
      </ul>
    </section>
  );
}

export function ReleaseNotes({ text, className }: { text: string; className?: string }) {
  const parsed = React.useMemo(() => parseReleaseBody(text), [text]);

  if (parsed.mode === "plain") {
    return <MarkdownLite text={text} className={className} />;
  }

  const grouped = new Map<ChangeType, CommitInfo[]>();
  for (const t of CARD_ORDER) grouped.set(t, []);
  for (const c of parsed.commits) {
    grouped.get(c.type)?.push(c);
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* 版本信息徽章 */}
      {parsed.info.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {parsed.info.map((it) => (
            <span
              key={it.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs"
            >
              <span className="text-muted-foreground">{it.label}</span>
              <span className="font-medium">{it.value}</span>
            </span>
          ))}
        </div>
      )}

      {/* 提交类型卡片 */}
      {CARD_ORDER.map((t) => (
        <TypeCard key={t} type={t} commits={grouped.get(t) || []} />
      ))}
    </div>
  );
}
