"use client";

import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/kibo-ui/marquee";
import { Status, StatusIndicator } from "@/components/kibo-ui/status";
import { Meteors } from "@/components/ui/meteors";
import {
  Rocket,
  Network,
  Component,
  Paintbrush,
  Gem,
  TreePine,
  ArrowUpRight,
  HammerIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

type ProjectStatus = "maintenance" | "degraded";

interface Project {
  label: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  href?: string;
  external?: boolean;
  status?: { type: ProjectStatus; text: string };
  gradient: string;
}

const projects: Project[] = [
  {
    label: "科灵启动器",
    name: "Koring Launcher",
    desc: "基于 Electron 的 Minecraft 启动器，多版本管理、多账户切换与 Mod 一键安装",
    icon: Rocket,
    href: "/launcher",
    status: { type: "maintenance", text: "UI 预览版" },
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    label: "散射系列",
    name: "Sanshe Play",
    desc: "Minecraft 综合性一体化设施平台，提供服务器宣传、资源下发与社区服务",
    icon: Network,
    href: "https://docs.play.lenjing.work",
    external: true,
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    label: "科灵潘途锐",
    name: "Pantoray UI",
    desc: "基于 Next.js 的 UI 组件库，为 Koring 生态提供统一的界面语言",
    icon: Component,
    status: { type: "degraded", text: "开发中" },
    gradient: "from-violet-500 to-purple-600",
  },
  {
    label: "绘皮编辑器",
    name: "SkinEditer",
    desc: "基于 Tauri 的 Minecraft 皮肤编辑器，轻量、跨平台、所见即所得",
    icon: Paintbrush,
    status: { type: "degraded", text: "封测中" },
    gradient: "from-pink-500 to-rose-500",
  },
  {
    label: "创汇基金",
    name: "Foreign Exchange Fund",
    desc: "100 万 RMB 的创造力奖励基金，邀请制，赋能社区创作者",
    icon: Gem,
    status: { type: "degraded", text: "邀请制" },
    gradient: "from-amber-500 to-orange-500",
  },
  {
    label: "木柴.空间",
    name: "MChine Space",
    desc: "Minecraft 创作者赞助平台，发现优质服务器、MOD 资源与社区启动器",
    icon: TreePine,
    href: "https://mchine.space",
    external: true,
    gradient: "from-emerald-500 to-teal-600",
  },
];

const marqueeItems = ["Launcher", "Account", "Play 服务", "木柴.空间", "SkinEditer", "创汇基金", "Pantoray UI"];

export default function HomePage() {
  return (
    <div className="flex flex-col w-full h-full gap-12 md:gap-20 pb-16">
      {/* Hero */}
      <section className="relative w-full rounded-2xl overflow-hidden border border-border/60">
        <FlickeringGrid
          className="absolute inset-0 z-0"
          squareSize={6}
          gridGap={14}
          color="#366EFA"
          maxOpacity={0.35}
          flickerChance={0.12}
        />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background)/0.85)_100%)]" />

        <div className="relative z-10 flex flex-col items-center justify-center gap-7 px-6 py-20 md:py-28 text-center">
          <div
            className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 animate-fade-up"
          >
            <img src="/logo.svg" alt="Koring" className="w-full h-full object-contain dark:opacity-90" />
          </div>

          <div
            className="flex flex-col items-center gap-3 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h1 className="font-bold tracking-tight text-5xl md:text-7xl">Koring Team</h1>
            <p className="text-lg md:text-2xl text-muted-foreground tracking-wide">创意无限</p>
          </div>

          <p
            className="max-w-xl text-sm md:text-base text-muted-foreground/80 leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            棱镜视界旗下创意工作室，专注 Minecraft 生态工具与创作者服务。
          </p>
        </div>
      </section>

      {/* Beta Banner */}
      <div
        className="relative flex items-center justify-center gap-3 px-4 py-2.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs md:text-sm font-medium animate-fade-up"
        style={{ animationDelay: "0.4s" }}
      >
        <HammerIcon className="size-3.5" />
        <span className="tracking-wider">Koring Launcher 预览版本已发布 · 正在接受测试</span>
      </div>

      {/* Featured: Koring Launcher */}
      <div
        className="animate-fade-up"
        style={{ animationDelay: "0.5s" }}
      >
        <Link
          href="/launcher"
          className="group relative flex flex-col sm:flex-row sm:items-center gap-6 w-full overflow-hidden rounded-2xl border border-border/60 p-6 md:p-10 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10 dark:from-blue-500/10 dark:to-indigo-500/10 transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_0_60px_-15px_rgba(54,110,250,0.4)]"
        >
          <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shrink-0 shadow-lg shadow-blue-500/30">
            <Rocket className="size-8 md:size-9" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm text-muted-foreground">旗舰产品</span>
              <Status status="maintenance" className="text-xs">
                <StatusIndicator />
                UI 预览版
              </Status>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-1.5">Koring Launcher</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              基于 Electron 的 Minecraft 启动器，支持多版本管理、微软 OAuth 与离线登录、Modrinth 与 CurseForge 集成。
            </p>
          </div>

          <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shrink-0">
            <ArrowUpRight className="size-5" />
          </div>

          <Meteors number={20} />
        </Link>
      </div>

      {/* Projects Grid */}
      <section className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">全部项目</h2>
          <span className="text-sm text-muted-foreground">{projects.length} 个产品</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => {
            const Icon = p.icon;
            const inner = (
              <>
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${p.gradient} text-white shadow-md`}>
                    <Icon className="size-6" />
                  </div>
                  {p.status && (
                    <Status status={p.status.type} className="text-[11px]">
                      <StatusIndicator />
                      {p.status.text}
                    </Status>
                  )}
                </div>
                <div className="mb-1">
                  <span className="text-xs text-muted-foreground">{p.label}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 tracking-tight">{p.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                {p.href && (
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-blue-500 dark:text-blue-400 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    {p.external ? "访问" : "查看"}
                    <ArrowUpRight className="size-3.5" />
                  </div>
                )}
              </>
            );

            return (
              <div
                key={p.name}
                className="animate-fade-up h-full"
                style={{ animationDelay: `${0.1 * i + 0.2}s` }}
              >
                {p.href ? (
                  p.external ? (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block h-full rounded-2xl border border-border/60 p-5 md:p-6 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5"
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link
                      href={p.href}
                      className="group block h-full rounded-2xl border border-border/60 p-5 md:p-6 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5"
                    >
                      {inner}
                    </Link>
                  )
                ) : (
                  <div className="group h-full rounded-2xl border border-border/60 p-5 md:p-6 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-border cursor-default">
                    {inner}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Marquee */}
      <div className="py-4 animate-fade-in" style={{ animationDelay: "0.8s" }}>
        <Marquee>
          <MarqueeFade side="left" />
          <MarqueeFade side="right" />
          <MarqueeContent>
            {marqueeItems.map((item) => (
              <MarqueeItem key={item} className="w-36 md:w-44 text-muted-foreground/70 font-medium">
                {item}
              </MarqueeItem>
            ))}
          </MarqueeContent>
        </Marquee>
      </div>
    </div>
  );
}
