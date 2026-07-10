import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { ArrowUpRight, HammerIcon } from "lucide-react";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/kibo-ui/marquee";
import { Status, StatusIndicator } from "@/components/kibo-ui/status";
import { Meteors } from "@/components/ui/meteors";
import Link from "next/link";

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
            <p className="text-black font-bold text-sm tracking-tight">Koring Launcher UI 预览版本已发布</p>
          </div>
        </div>

        <div className="relative w-full h-120 overflow-hidden">
          <div className="relative rounded-xl border w-full h-full">
            <div className="absolute left-12 top-12 flex flex-col gap-2">
              <span className="font-bold text-5xl">Koring Team</span>
              <span className="text-xl">创意无限</span>
            </div>

            <span className="absolute right-12 bottom-12 text-xl text-muted-foreground">
              与光年相遇，见宇宙未开源的无限
              <span className="text-sm">
                <br /> 以星辰为数据，用仰望作读取
              </span>
            </span>

            <FlickeringGrid
              className="relative inset-0 z-0 mask-[radial-gradient(700px_circle_at_center,white,transparent)]"
              squareSize={6}
              gridGap={14}
              color="#6b9eb6"
              maxOpacity={0.7}
              flickerChance={0.1}
            />
          </div>
        </div>

        <Link
          href="/launcher"
          className="relative flex w-full flex-col overflow-hidden rounded-md border p-6 group dark text-white bg-[#0A0A0AFF]"
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
              <MarqueeItem className="w-32">创绘基金</MarqueeItem>
            </MarqueeContent>
          </Marquee>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <a
            href="https://docs.play.lenjing.work"
            target="_blank"
            className="group rounded-md border border-border p-6"
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
            href="/launcher"
            className="group rounded-md border border-border p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <b>科灵启动器</b>
              <Status status="maintenance">
                <StatusIndicator />
                UI 预览版
              </Status>
              {/*<ArrowUpRight className="size-4 -translate-x-2 translate-y-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />*/}
            </div>
            <div className="mt-4">
              <h3 className="mb-1 font-semibold">Koring Launcher</h3>
              <p className="text-sm text-muted-foreground">基于 electron 的 Minecraft 启动器</p>
            </div>
          </a>

          <a className="group rounded-md border border-border p-6">
            <div className="flex items-center justify-between gap-4">
              <b>绘皮编辑器</b>
              <Status status="degraded">
                <StatusIndicator />
                待开发
              </Status>
              {/*<ArrowUpRight className="size-4 -translate-x-2 translate-y-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />*/}
            </div>
            <div className="mt-4">
              <h3 className="mb-1 font-semibold">SkinEditer</h3>
              <p className="text-sm text-muted-foreground">基于 Tauri 的 Minecraft 皮肤编辑器</p>
            </div>
          </a>

          <a className="group rounded-md border border-border p-6">
            <div className="flex items-center justify-between gap-4">
              <b>绘皮编辑器</b>
              <Status status="degraded">
                <StatusIndicator />
                封测中
              </Status>
              {/*<ArrowUpRight className="size-4 -translate-x-2 translate-y-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />*/}
            </div>
            <div className="mt-4">
              <h3 className="mb-1 font-semibold">SkinEditer</h3>
              <p className="text-sm text-muted-foreground">基于 Tauri 的 Minecraft 皮肤编辑器</p>
            </div>
          </a>

          <a className="group rounded-md border border-border p-6">
            <div className="flex items-center justify-between gap-4">
              <b>创汇基金</b>
              <Status status="degraded">
                <StatusIndicator />
                邀请制
              </Status>
              {/*<ArrowUpRight className="size-4 -translate-x-2 translate-y-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />*/}
            </div>
            <div className="mt-4">
              <h3 className="mb-1 font-semibold">Koring Foreign Exchange Fund</h3>
              <p className="text-sm text-muted-foreground">100万 RMB 的创造力奖励基金</p>
            </div>
          </a>

          <a
            href="https://mchine.space"
            target="_blank"
            className="group rounded-md border border-border p-6"
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
