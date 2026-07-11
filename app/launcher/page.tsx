import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HammerIcon, ArrowUpRight, Rocket, Layers, Palette, Users, Cpu, Shield } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Layers,
    title: "多实例管理",
    desc: "同时管理多个 Minecraft 版本与模组配置，互不干扰",
  },
  {
    icon: Shield,
    title: "账户系统",
    desc: "支持微软 OAuth 与离线登录，安全切换多个账号",
  },
  {
    icon: Rocket,
    title: "版本安装",
    desc: "一键安装 Vanilla、Fabric、Forge、Quilt 等主流版本",
  },
  {
    icon: Palette,
    title: "个性化背景",
    desc: "自定义背景图、颜色、模糊与视差效果，打造专属启动器",
  },
  {
    icon: Cpu,
    title: "Mod 管理",
    desc: "集成 Modrinth 与 CurseForge，搜索安装一气呵成",
  },
  {
    icon: Users,
    title: "任务队列",
    desc: "下载、安装、更新排队执行，进度一目了然",
  },
];



export default function LauncherPage() {
  return (
    <div className="flex flex-col w-full h-full gap-16 md:gap-24 pb-24">

      {/* Banner */}
      <div className="relative overflow-hidden rounded-xl border border-amber-500/50">
        <div
          className="absolute inset-0 z-0 animate-warning-scroll opacity-100"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #f59e0b, #f59e0b 20px, #000 20px, #000 40px)",
            backgroundSize: "56.56px 56.56px",
          }}
        />
        <div className="relative z-10 flex items-center justify-center gap-4 p-3 bg-amber-500/80">
          <div className="flex items-center gap-2 px-3 py-1 bg-black rounded-full text-amber-500">
            <HammerIcon className="size-4" />
            <span className="text-[10px] font-black tracking-widest">正在接受测试</span>
          </div>
          <p className="text-black font-bold text-sm tracking-tight">Koring Launcher 预览版本已发布</p>
        </div>
      </div>

      {/* Hero */}
      <div className="relative w-full" style={{ height: "50vh" }}>
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6 px-4">
          <span className="font-bold text-5xl md:text-7xl tracking-tight">Koring Launcher</span>
          <span className="text-xl md:text-2xl text-muted-foreground">基于 Electron 的 Minecraft 启动器</span>
          <p className="max-w-lg text-center text-sm md:text-base text-muted-foreground/80 leading-relaxed">
            Koring Launcher 是一款面向国际版 Minecraft 的现代化启动器，
            提供流畅的版本管理、多账户支持与丰富的个性化选项。
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Button size="lg" asChild>
              <Link href="https://github.com/lingke-net" target="_blank">
                前往 GitHub
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/launcher/join-beta">
                获取测试版
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 功能亮点 */}
      <div className="relative w-full rounded-2xl border border-border/50 p-10 md:p-16" style={{ background: "linear-gradient(135deg, rgba(107,158,182,0.08) 0%, rgba(100,100,100,0.02) 100%)" }}>
        <Badge variant="outline" className="mb-4">功能亮点</Badge>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">开箱即用的完整体验</h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-6">
          从安装到启动，每一步都经过精心打磨。无需复杂配置，即可享受流畅的 Minecraft 游戏体验。
        </p>
        <Button variant="default" size="lg" asChild>
          <Link href="https://docs.play.lenjing.work" target="_blank">
            了解更多
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>

      {/* 功能卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border/50 p-6 transition-all duration-300 hover:scale-[1.02] bg-background/60 backdrop-blur-xl"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 mb-4">
              <f.icon className="size-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>



    </div>
  );
}
