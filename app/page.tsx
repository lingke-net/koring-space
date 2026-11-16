import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { ArrowUpRight, HammerIcon } from "lucide-react";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/kibo-ui/marquee";
import { Status, StatusIndicator } from "@/components/kibo-ui/status";
import { Meteors } from "@/components/ui/meteors";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";

const projects = [
  {
    name: "Koring Launcher",
    label: "科灵启动器",
    desc: "基于 Electron 的 Minecraft 启动器",
    status: "UI 预览版",
    href: "/launcher",
  },
  {
    name: "Sanshe Play",
    label: "散射系列",
    desc: "Minecraft 综合性一体化设施平台",
    href: "https://docs.play.lenjing.work",
  },
  {
    name: "Koring Pantoray UI",
    label: "科灵潘途锐界面组件库",
    desc: "基于 Next.js 的 UI 组件库",
    status: "开发中",
    href: "",
  },
  {
    name: "SkinEditer",
    label: "绘皮编辑器",
    desc: "基于 Tauri 的 Minecraft 皮肤编辑器",
    status: "封测中",
    href: "",
  },
  {
    name: "Koring Foreign Exchange Fund",
    label: "创汇基金",
    desc: "100 万 RMB 的创造力奖励基金",
    status: "邀请制",
    href: "",
  },
  {
    name: "MChine Space",
    label: "木柴.空间",
    desc: "Minecraft 创作者赞助平台",
    href: "https://mchine.space",
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

const communityLinks = [
  {
    name: "Koring Community",
    desc: "与玩家和创作者交流分享，获取第一手动态与支持。",
    domain: "community.koring.space",
    href: "https://community.koring.space/",
  },
  {
    name: "Koring Status",
    desc: "查看 Koring 各服务的实时运行状态与历史可用性。",
    domain: "status.koring.space",
    href: "https://status.koring.space",
  },
];

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

function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <h2 className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
      {index} — {title}
    </h2>
  );
}

const rowClass =
  "group flex items-start gap-4 md:gap-8 border-t border-border py-5 md:py-6 transition-colors";

export default function HomePage() {
  return (
    <div className="pb-8">
      {/* ===== Hero Slogan ===== */}
      <section className="pt-14 md:pt-24 pb-16 md:pb-24">
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Prism Horizon · 棱镜视界旗下创意工作室
        </p>
        <h1 className="mt-8 text-[clamp(3.5rem,10vw,7.5rem)] font-bold leading-[0.95] tracking-tight">
          Koring Team
          <span className="text-[#366EFA]">.</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg md:text-2xl leading-relaxed text-muted-foreground">
          创意无限。我们专注 Minecraft 生态工具与创作者服务，
          让工具更好用，让创作被看见。
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <Link
            href="/launcher"
            className="inline-flex items-center gap-1.5 underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
          >
            了解 Koring Launcher
            <ArrowUpRight className="size-4" />
          </Link>
          <a
            href="https://community.koring.space/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            加入社区
            <ArrowUpRight className="size-4" />
          </a>
        </div>
        <p className="mt-10 font-mono text-xs text-muted-foreground">
          Koring Launcher 预览版已发布 · 正在接受测试
        </p>
      </section>

      {/* ===== 我们的使命 ===== */}
      <section className="border-t border-border py-14 md:py-20">
        <SectionHeading index="01" title="我们的使命" />
        <p className="mt-8 max-w-3xl text-2xl md:text-4xl font-medium leading-snug tracking-tight">
          让热爱 Minecraft 的每一个人，
          都能找到自己的位置。
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {missionPillars.map((p, i) => (
            <div key={p.title}>
              <span className="font-mono text-xs text-muted-foreground">
                0{i + 1}
              </span>
              <h3 className="mt-3 text-lg font-medium">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 我们的项目 ===== */}
      <section className="border-t border-border py-14 md:py-20">
        <SectionHeading index="02" title="我们的项目" />
        <ul className="mt-10">
          {projects.map((p, i) => {
            const inner = (
              <>
                <span className="w-6 shrink-0 pt-1.5 font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="text-lg font-medium tracking-tight">
                      {p.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {p.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                </div>
                {p.status && (
                  <span className="hidden shrink-0 pt-1.5 font-mono text-xs text-muted-foreground sm:block">
                    {p.status}
                  </span>
                )}
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
              </>
            );
            return (
              <li key={p.name} className="last:border-b last:border-border">
                {p.href.startsWith("/") ? (
                  <Link href={p.href} className={rowClass}>
                    {inner}
                  </Link>
                ) : p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={rowClass}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={rowClass}>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* ===== 社区 ===== */}
      <section className="border-t border-border py-14 md:py-20">
        <SectionHeading index="03" title="社区" />
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
          与玩家和创作者在一起——交流、反馈、一起把事情做好。
        </p>
        <ul className="mt-10">
          {communityLinks.map((c) => (
            <li key={c.name} className="last:border-b last:border-border">
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className={rowClass}
              >
                <div className="min-w-0 flex-1">
                  <span className="text-lg font-medium tracking-tight">
                    {c.name}
                  </span>
                  <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                </div>
                <span className="hidden shrink-0 pt-1.5 font-mono text-xs text-muted-foreground md:block">
                  {c.domain}
                </span>
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== 快速问答 ===== */}
      <section className="border-t border-border py-14 md:py-20">
        <SectionHeading index="04" title="快速问答" />
        <div className="mt-10">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group border-t border-border py-5 last:border-b last:border-border"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ===== 联系 ===== */}
      <section className="flex flex-wrap items-baseline justify-between gap-6 border-t border-border py-14 md:py-20">
        <p className="text-2xl md:text-3xl font-medium tracking-tight">
          下一份灵感，也许来自你。
        </p>
        <a
          href="mailto:hi@lenjing.email"
          className="inline-flex items-center gap-1.5 font-mono text-sm underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
        >
          hi@lenjing.email
          <ArrowUpRight className="size-4" />
        </a>
      </section>
    </div>
export default function HomePage() {
  return (
    <>
      <div className="flex flex-col w-full h-full gap-4 md:gap-8">
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
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6 px-4">
            <span className="font-bold text-5xl md:text-6xl tracking-tight">Koring Team</span>
            <span className="text-xl md:text-2xl text-muted-foreground">创意无限</span>
          </div>
        </div>

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

          <div className="group rounded-md border border-border p-4 sm:p-6">
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
          </div>

          <div className="group rounded-md border border-border p-4 sm:p-6">
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
          </div>

          <div className="group rounded-md border border-border p-4 sm:p-6">
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
          </div>

          <div className="group rounded-md border border-border p-4 sm:p-6">
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
          </div>

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
      </div>
    </>
  );
}
