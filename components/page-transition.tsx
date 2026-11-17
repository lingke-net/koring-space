"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * 全局页面切换包装（App Router）。
 *
 * 两层策略：
 *   1. 浏览器支持 View Transitions API
 *      → Next.js 原生 VT 接管（next.config.ts 的 experimental.viewTransition）
 *      → 纯 CSS 伪元素动画，零 JS 成本
 *
 *   2. 浏览器不支持 VT（Safari < 18 / Firefox / 部分嵌入式浏览器）
 *      → usePathname 变化触发 exit → 延迟切换 → enter 动画
 *      → 原生 CSS keyframes 做 fade + scale 过渡
 *
 * 关键：降级路径必须在 exit 动画播放期间保留旧 children 渲染，
 * 220ms 后才切换到新 path 的 children，确保用户看到完整的淡出。
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 支持检测（client 端才执行）
  const supportsVTRef = useRef(false);
  if (typeof document !== "undefined" && "startViewTransition" in document) {
    supportsVTRef.current = true;
  }

  // ===== VT 原生路径 =====
  // 支持 VT 的浏览器让 Next.js 完全接管，本组件只做 view-transition-name 包装
  if (supportsVTRef.current) {
    return <div className="page-content">{children}</div>;
  }

  // ===== JS 降级路径 =====
  // 两个 state 控制内容切换时机：
  //   displayPath — 实际渲染哪个 path 的 children（延迟切换以让 exit 动画播完）
  //   phase — idle / exit / enter 控制 CSS 动画类
  const [displayPath, setDisplayPath] = useState(pathname);
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");
  // 缓存上一帧 children，确保 exit 期间旧 DOM 仍可见
  const [cachedChildren, setCachedChildren] = useState(children);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (pathname === displayPath) {
      // 首屏或 VT 环境：直接显示
      setCachedChildren(children);
      setPhase("idle");
      prevPathRef.current = pathname;
      return;
    }

    // pathname 变化 → 触发 exit 动画
    setPhase("exit");
    // 220ms 后切换内容（与 CSS page-fallback-out 时长一致）
    const exitTimer = setTimeout(() => {
      setDisplayPath(pathname);
      setPhase("enter");
      // 等待 React 渲染新 children 后加 enter 动画，再 idle
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase("idle");
        });
      });
    }, 220);

    return () => clearTimeout(exitTimer);
  }, [pathname, displayPath, children]);

  // 每次 children prop 变化（即使 pathname 没变）也更新缓存
  useEffect(() => {
    if (pathname === displayPath) {
      setCachedChildren(children);
    }
  }, [children, pathname, displayPath]);

  // 当前应渲染的 children：
  //   exit 期间 → 旧 children（cached）
  //   enter / idle + 路径匹配 → 新 children
  //   enter 期间（displayPath 已更新但 phase 仍为 enter）→ 新 children
  const renderChildren =
    phase === "exit"
      ? cachedChildren // exit 动画播旧内容
      : children; // enter / idle 播新内容

  const cls = [
    "page-content",
    "page-fallback",
    phase === "exit" ? "is-exit" : "",
    phase === "enter" ? "is-enter" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls}>
      <div key={displayPath} className="page-fallback__inner">
        {renderChildren}
      </div>
    </div>
  );
}
