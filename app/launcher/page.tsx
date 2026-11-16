import { Button } from "@/components/ui/button";
import { ArrowUpRight, Download } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "多实例管理",
    desc: "同时管理多个 Minecraft 版本与模组配置，互不干扰。",
  },
  {
    title: "账户系统",
    desc: "支持微软 OAuth 与离线登录，安全切换多个账号。",
  },
  {
    title: "版本安装",
    desc: "一键安装 Vanilla、Fabric、Forge、Quilt 等主流版本。",
  },
  {
    title: "个性化背景",
    desc: "自定义背景图、颜色、模糊与视差效果，打造专属启动器。",
  },
  {
    title: "Mod 管理",
    desc: "集成 Modrinth 与 CurseForge，搜索安装一气呵成。",
  },
  {
    title: "任务队列",
    desc: "下载、安装、更新排队执行，进度一目了然。",
  },
];

export default function LauncherPage() {
  return (
    <div className="pb-8">
      {/* Hero — OpenAI 产品页式居中大标题 */}
      <section className="flex flex-col items-center pt-14 md:pt-24 pb-16 md:pb-24 text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Koring Launcher
        </p>
        <h1 className="mt-8 text-[clamp(2.75rem,7vw,5.5rem)] font-bold leading-[1.05] tracking-tight">
          下一次冒险，
          <br />
          从这里开始。
        </h1>
        <p className="mt-8 max-w-xl text-lg md:text-xl leading-relaxed text-muted-foreground">
          基于 Electron 的现代化 Minecraft 启动器。
          管理版本、安装模组、切换账户——把准备工作交给启动器，让游戏回归乐趣。
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <Button size="lg" className="rounded-full px-7" asChild>
            <Link href="/launcher/download">
              <Download className="size-4" />
              立即下载
            </Link>
          </Button>
          <a
            href="https://github.com/lingke-net"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
            <ArrowUpRight className="size-4" />
          </a>
        </div>
        <p className="mt-10 font-mono text-xs text-muted-foreground">
          预览版本已发布 · 正在接受测试 ·{" "}
          <Link
            href="/launcher/join-beta"
            className="underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
          >
            获取测试版
          </Link>
        </p>
      </section>

      {/* 功能 */}
      <section className="border-t border-border py-14 md:py-20">
        <h2 className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          01 — 功能
        </h2>
        <p className="mt-8 max-w-3xl text-2xl md:text-4xl font-medium leading-snug tracking-tight">
          开箱即用的完整体验。
        </p>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          从安装到启动，每一步都经过精心打磨。无需复杂配置，即可享受流畅的 Minecraft 游戏体验。
        </p>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {features.map((f, i) => (
            <div key={f.title}>
              <span className="font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-medium">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="flex flex-wrap items-center justify-between gap-6 border-t border-border py-14 md:py-20">
        <p className="text-2xl md:text-3xl font-medium tracking-tight">
          准备好开始了吗？
        </p>
        <Button size="lg" className="rounded-full px-7" asChild>
          <Link href="/launcher/download">
            下载 Koring Launcher
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
