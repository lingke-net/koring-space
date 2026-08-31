import React from "react";
import { cn } from "@/lib/utils";

/**
 * 轻量 Markdown 渲染器（无依赖）
 * 用于渲染 GitHub Release Notes 这类常见格式：
 * 标题、无序/有序列表、引用、代码块、粗体、行内代码、链接、分隔线、段落
 */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(text.slice(last, m.index));
    }
    const tok = m[0];
    if (tok.startsWith("**")) {
      parts.push(
        <strong key={`${keyPrefix}-b${i}`} className="font-semibold">
          {tok.slice(2, -2)}
        </strong>
      );
    } else if (tok.startsWith("`")) {
      parts.push(
        <code
          key={`${keyPrefix}-c${i}`}
          className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]"
        >
          {tok.slice(1, -1)}
        </code>
      );
    } else {
      const link = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        parts.push(
          <a
            key={`${keyPrefix}-l${i}`}
            href={link[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-3 hover:text-primary/80"
          >
            {link[1]}
          </a>
        );
      } else {
        parts.push(tok);
      }
    }
    last = m.index + tok.length;
    i += 1;
  }
  if (last < text.length) {
    parts.push(text.slice(last));
  }
  return parts;
}

export function MarkdownLite({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const lines = text.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let key = 0;

  let inCode = false;
  let codeBuf: string[] = [];

  const push = (node: React.ReactNode) => {
    blocks.push(<div key={key++}>{node}</div>);
  };

  for (const line of lines) {
    // 围栏代码块
    if (/^```/.test(line.trim())) {
      if (inCode) {
        push(
          <pre className="overflow-x-auto rounded-lg border border-border/50 bg-muted/40 p-3 font-mono text-xs leading-relaxed">
            {codeBuf.join("\n")}
          </pre>
        );
        codeBuf = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) continue; // 空行跳过

    // 标题
    const heading = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      const lv = heading[1].length;
      const content = renderInline(heading[2], `h${key}`);
      const cls = {
        1: "text-xl font-bold tracking-tight",
        2: "text-lg font-bold tracking-tight",
        3: "text-base font-semibold",
        4: "text-sm font-semibold",
      }[lv as 1 | 2 | 3 | 4];
      push(<h3 className={cn("mb-1 mt-2", cls)}>{content}</h3>);
      continue;
    }

    // 分隔线
    if (/^-{3,}$/.test(trimmed)) {
      push(<hr className="my-3 border-border/60" />);
      continue;
    }

    // 引用
    if (/^>/.test(trimmed)) {
      push(
        <blockquote className="my-1 border-l-2 border-primary/50 pl-3 text-muted-foreground">
          {renderInline(trimmed.replace(/^>\s?/, ""), `q${key}`)}
        </blockquote>
      );
      continue;
    }

    // 无序列表
    const ul = trimmed.match(/^[-*]\s+(.*)$/);
    if (ul) {
      push(
        <div className="flex items-start gap-2 py-0.5 text-sm">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
          <span className="text-muted-foreground">
            {renderInline(ul[1], `ul${key}`)}
          </span>
        </div>
      );
      continue;
    }

    // 有序列表
    const ol = trimmed.match(/^\d+\.\s+(.*)$/);
    if (ol) {
      push(
        <div className="flex items-start gap-2 py-0.5 text-sm">
          <span className="shrink-0 font-mono text-xs leading-5 text-primary/80">
            {trimmed.match(/^\d+/)?.[0]}.
          </span>
          <span className="text-muted-foreground">
            {renderInline(ol[1], `ol${key}`)}
          </span>
        </div>
      );
      continue;
    }

    // 普通段落
    push(
      <p className="py-0.5 text-sm leading-relaxed text-muted-foreground">
        {renderInline(trimmed, `p${key}`)}
      </p>
    );
  }

  return <div className={cn("flex flex-col", className)}>{blocks}</div>;
}
