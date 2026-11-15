import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { ArrowUpRight, HammerIcon, Plus, MessagesSquare, Activity } from "lucide-react";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/kibo-ui/marquee";
import { Status, StatusIndicator } from "@/components/kibo-ui/status";
import { Meteors } from "@/components/ui/meteors";
import Link from "next/link";

function SectionHeading({ title, desc }: { title: string; desc?: string }) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
      {desc && <p className="mt-2 text-sm md:text-base text-muted-foreground">{desc}</p>}
    </div>
  );
}

const faqs = [
  {
    q: "Koring Launcher 是官方启动器吗？",
    a: "不是。Koring Launcher 是一个非官方的 Minecraft 启动器，与 Mojang Studios、Microsoft 或他们位于中国大陆的代理公司之间并无任何从属或关联。",
  },
  {
    q: "Koring Launcher 现在可以下载吗？",
    a: "预览版本已发布并正在接受测试，你可以前往下载中心获取最新版本，也欢迎在试用后向我们反馈问题。",
  },
  {
    q: "如何加入 Koring 社区？",
    a: "访问 community.koring.space 加入 Koring Community，与玩家和创作者交流分享，获取第一手动态与支持。",
  },
  {
    q: "服务出问题了，去哪里确认？",
    a: "在 status.koring.space 查看 Koring 各服务的实时运行状态与历史可用性。",
  },
  {
    q: "什么是创汇基金？",
    a: "创汇基金是一笔 100 万 RMB 的创造力奖励基金，采用邀请制，用于赋能社区中的优秀创作者。",
  },
  {
    q: "如何联系你们？",
    a: "发送邮件至 hi@lenjing.email，我们会尽快回复。",
  },
];

const communityLinks = [
  {
    icon: MessagesSquare,
    label: "社区论坛",
    name: "Koring Community",
    desc: "加入社区，与玩家和创作者交流分享，获取第一手动态与支持。",
    domain: "community.koring.space",
    href: "https://community.koring.space/",
  },
  {
    icon: Activity,
    label: "服务状态",
    name: "Koring Status",
    desc: "查看 Koring 各服务的实时运行状态与历史可用性。",
    domain: "status.koring.space",
    href: "https://status.koring.space",
  },
];

const missionPillars = [
  {
    title: "好用的工具",
    desc: "从启动器到皮肤编辑器，把常用工具汇聚在简洁的界面里，让准备工作更轻松。",
  },
  {
    title: "被看见的创作",
    desc: "通过木柴.空间与创汇基金，让优质内容与创作者获得应有的关注与回报。",
  },
  {
    title: "有归属的社区",
    desc: "连接玩家与创作者，让每一次探索都能找到同行的人。",
  },
];

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col w-full h-full gap-16 md:gap-24 pb-16">
        {/* ===== 01. Hero Slogan ===== */}
        <section className="flex flex-col gap-4 md:gap-8">
          <div className="relative overflow-hidden rounded-xl border border-amber-500/50 group">
            {/* 滚动条纹层 */}
            <div
              className="absolute inset-0 z-0 animate-warning-scroll opacity-100"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-45deg, #f59e0b, #f59e0b 20px, #000 20px, #000 40px)",
                backgroundSize: "56.56px 56.56px"
              }}
            />

            {/* 内容层 */}
            <div className="relative z-10 flex items-center justify-center gap-4 p-3 bg-amber-500/80">
              <div className="flex items-center gap-2 px-3 py-1 bg-black rounded-full text-amber-500">
                <HammerIcon className="size-4" />
                <span className="text-[10px] font-black tracking-widest">正在接受测试</span>
              </div>
              <p className="text-black font-bold text-sm tracking-tight">Koring Launcher 预览版本已发布</p>
            </div>
          </div>

          <div className="relative w-full" style={{ height: "60vh" }}>
            <FlickeringGrid
              className="absolute inset-0 z-0 mask-[radial-gradient(700px_circle_at_center,white,transparent)]"
              squareSize={6}
              gridGap={14}
              color="#6b9eb6"
              maxOpacity={0.7}
              flickerChance={0.1}
            />
            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6 px-4 text-center">
              <span className="font-bold text-5xl md:text-6xl tracking-tight">Koring Team</span>
              <span className="text-xl md:text-2xl text-muted-foreground">创意无限</span>
              <p className="max-w-xl text-sm md:text-base text-muted-foreground/80 leading-relaxed">
                棱镜视界旗下创意工作室，专注 Minecraft 生态工具与创作者服务。
              </p>
            </div>
          </div>
        </section>

        {/* ===== 02. 我们的使命 ===== */}
        <section className="flex flex-col gap-6">
          <SectionHeading
            title="我们的使命"
            desc="创意无限，是我们的起点。让工具更好用，让创作被看见，让热爱 Minecraft 的每一个人都能找到自己的位置。"
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {missionPillars.map((p) => (
              <div key={p.title} className="rounded-md border border-border p-4 sm:p-6">
                <h3 className="mb-2 font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 03. 我们的项目 ===== */}
        <section className="flex flex-col gap-4 md:gap-8">
          <SectionHeading title="我们的项目" desc="从启动器到创作者服务，每一个项目都围绕 Minecraft 生态展开。" />

          <Link
            href="/launcher"
            className="relative flex w-full flex-col overflow-hidden rounded-md border p-4 sm:p-6 group dark text-white bg-[#0A0A0AFF]"
          >
            <div className="flex items-center justify-between gap-4">
              要不来尝尝鲜？试试这个...
              <ArrowUpRight className="size-4 -translate-x-2 translate-y-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
            </div>
            <div className="mt-4">
              <h3 className="mb-1 font-semibold">Koring Launcher</h3>
              <p className="text-sm text-muted-foreground">基于 electron 的 Minecraft 启动器</p>
            </div>

            <Meteors number={28} />
          </Link>

          <div className="py-8 font-bold text-xl">
            <Marquee>
              <MarqueeFade side="left" />
              <MarqueeFade side="right" />
              <MarqueeContent>
                <MarqueeItem className="w-32">Launcher</MarqueeItem>
                <MarqueeItem className="w-32">Account</MarqueeItem>
                <MarqueeItem className="w-32">Play服务</MarqueeItem>
                <MarqueeItem className="w-32">木柴.空间</MarqueeItem>
                <MarqueeItem className="w-32">SkinEditer</MarqueeItem>
                <MarqueeItem className="w-32">创汇基金</MarqueeItem>
              </MarqueeContent>
            </Marquee>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <a
              href="https://docs.play.lenjing.work"
              target="_blank"
              className="group rounded-md border border-border p-4 sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <b>散射系列</b>
                <ArrowUpRight className="size-4 -translate-x-2 translate-y-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
              </div>
              <div className="mt-4">
                <h3 className="mb-1 font-semibold">Sanshe Play</h3>
                <p className="text-sm text-muted-foreground">Minecraft 综合性一体化设施平台</p>
              </div>
            </a>

            <a
              className="group rounded-md border border-border p-4 sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <b>科灵启动器</b>
                <Status status="maintenance">
                  <StatusIndicator />
                  UI 预览版
                </Status>
              </div>
              <div className="mt-4">
                <h3 className="mb-1 font-semibold">Koring Launcher</h3>
                <p className="text-sm text-muted-foreground">基于 electron 的 Minecraft 启动器</p>
              </div>
            </a>

            <a className="group rounded-md border border-border p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <b>科灵潘途锐界面组件库</b>
                <Status status="degraded">
                  <StatusIndicator />
                  开发中
                </Status>
              </div>
              <div className="mt-4">
                <h3 className="mb-1 font-semibold">Koring Pantoray UI</h3>
                <p className="text-sm text-muted-foreground">基于 Next.js 的 UI 组件库</p>
              </div>
            </a>

            <a className="group rounded-md border border-border p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <b>绘皮编辑器</b>
                <Status status="degraded">
                  <StatusIndicator />
                  封测中
                </Status>
              </div>
              <div className="mt-4">
                <h3 className="mb-1 font-semibold">SkinEditer</h3>
                <p className="text-sm text-muted-foreground">基于 Tauri 的 Minecraft 皮肤编辑器</p>
              </div>
            </a>

            <a className="group rounded-md border border-border p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <b>创汇基金</b>
                <Status status="degraded">
                  <StatusIndicator />
                  邀请制
                </Status>
              </div>
              <div className="mt-4">
                <h3 className="mb-1 font-semibold">Koring Foreign Exchange Fund</h3>
                <p className="text-sm text-muted-foreground">100万 RMB 的创造力奖励基金</p>
              </div>
            </a>

            <a
              href="https://mchine.space"
              target="_blank"
              className="group rounded-md border border-border p-4 sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <b>木柴.空间</b>
                <ArrowUpRight className="size-4 -translate-x-2 translate-y-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
              </div>
              <div className="mt-4">
                <h3 className="mb-1 font-semibold">MChine Space</h3>
                <p className="text-sm text-muted-foreground">Minecraft 创作者赞助平台</p>
              </div>
            </a>
          </div>
        </section>

        {/* ===== 04. 社区 ===== */}
        <section className="flex flex-col gap-6">
          <SectionHeading title="社区" desc="与玩家和创作者在一起——交流、反馈、一起把事情做好。" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {communityLinks.map((c) => {
              const Icon = c.icon;
              return (
                <a
                  key={c.name}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-md border border-border p-4 sm:p-6 transition-colors hover:border-primary/50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-md border border-border bg-muted/40">
                        <Icon className="size-4" />
                      </div>
                      <b>{c.label}</b>
                    </div>
                    <ArrowUpRight className="size-4 -translate-x-2 translate-y-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                  </div>
                  <div className="mt-4">
                    <h3 className="mb-1 font-semibold">{c.name}</h3>
                    <p className="text-sm text-muted-foreground">{c.desc}</p>
                    <p className="mt-3 font-mono text-xs text-muted-foreground/70">{c.domain}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ===== 05. 快速问答 ===== */}
        <section className="flex flex-col gap-6">
          <SectionHeading title="快速问答" desc="第一次来到这里？从这些问题开始了解我们。" />
          <div className="flex flex-col gap-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-md border border-border px-4 sm:px-6 py-4 open:bg-muted/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm md:text-base font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
